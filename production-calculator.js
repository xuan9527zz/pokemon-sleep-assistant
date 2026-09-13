(function(root,factory){
  'use strict';
  const rules=typeof module==='object'&&module.exports?require('./all-rounder-rules.js'):root.POKEMON_SLEEP_ALL_ROUNDER_RULES;
  const api=factory(rules);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_PRODUCTION_CALCULATOR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(allRounderRules){
  'use strict';
  const Z80=1.281551565545;
  const SPECIAL_NAMES=new Set(['梦幻','雷公','炎帝','水君','拉帝亚斯','拉帝欧斯','克雷色利亚','达克莱伊']);
  const COMPARISON_ROLES=Object.freeze({ingredient:'食材手',berry:'树果位',skill:'技能手'});
  const BERRY_BURST_SKILL_IDS=new Set([17,21,35]);
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  const range=(mean,variance)=>{const spread=Z80*Math.sqrt(Math.max(0,Number(variance)||0));return {low:Math.max(0,mean-spread),high:Math.max(0,mean+spread)}};
  const distinctById=rows=>{const seen=new Set();return (rows||[]).filter(mon=>{const id=String(mon&&mon.id||'');if(!id||seen.has(id))return false;seen.add(id);return true})};
  function isBerryBurst(mon){return BERRY_BURST_SKILL_IDS.has(Number(mon&&mon.mainSkillId))||/树果骤增/.test(String(mon&&mon.main||mon&&mon.mainSkill||''))}
  function comparisonRole(mon){
    if(isBerryBurst(mon))return 'berry';
    const specialty=String(mon&&mon.scoreBreakdown&&mon.scoreBreakdown.specialty||mon&&mon.specialty||'');
    if(specialty==='ingredient')return 'ingredient';
    if(specialty==='berry')return 'berry';
    return 'skill';
  }
  function comparisonTeam(candidate,baseline,candidateIds){
    const blocked=new Set((candidateIds||[]).map(String)),rest=distinctById(baseline).filter(mon=>mon&&mon.battleEligible!==false&&String(mon.id)!==String(candidate.id)&&!blocked.has(String(mon.id))&&!SPECIAL_NAMES.has(String(mon.name||''))).slice(0,4);
    return [candidate,...rest];
  }
  function ingredientRange(member,target,days=1){
    const helps=Math.max(0,Number(member&&member.snorlaxEnergy&&member.snorlaxEnergy.normalHelps)||Number(member&&member.helpsPerDay)||0)*days;
    const slots=(member&&member.ingredientPerHelp||[]).filter(item=>item.name===target),mean=slots.reduce((sum,item)=>sum+(Number(item.expected)||0),0),rate=Number(member&&member.probability&&member.probability.current)||0,slotCount=Math.max(1,(member&&member.ingredients&&member.ingredients.unlocked||member&&member.ingredientPerHelp||[]).length),second=slots.reduce((sum,item)=>sum+rate*((Number(item.quantity)||0)**2)/slotCount,0),variance=helps*Math.max(0,second-mean*mean);
    return {mean:helps*mean,...range(helps*mean,variance),helps};
  }
  function energyRange(row){
    const helps=Math.max(1,Number(row&&row.normalHelps)||0),triggers=Math.max(0,Number(row&&row.triggers)||0),berryMean=Math.max(0,Number(row&&row.berryEnergy)||0),skillMean=Math.max(0,Number(row&&row.directSkillEnergy||0)+Number(row&&row.complexSkillEnergy||0)),variance=(berryMean*berryMean/helps)+(triggers>0?skillMean*skillMean/triggers:0);
    return {mean:berryMean+skillMean,variance,...range(berryMean+skillMean,variance)};
  }
  function teamEnergyRange(rows){
    const parts=(rows||[]).map(energyRange),mean=parts.reduce((sum,item)=>sum+item.mean,0),variance=parts.reduce((sum,item)=>sum+(Number(item.variance)||0),0);
    return {mean,variance,...range(mean,variance)};
  }
  function calculate(mon,targetIngredient,options={}){
    const planner=options.teamPlanner,production=options.production&&options.production.byBoxId||options.production||{};
    if(!mon||!planner)return null;
    const candidateIds=options.candidateIds||[mon.id],team=comparisonTeam(mon,options.baselineTeam||[],candidateIds),fullTeam=team.length===5,result=fullTeam&&typeof planner.calculateTeam==='function'?planner.calculateTeam(team,production,options):planner.calculateMember(mon,production[String(mon.id)],options);
    if(!result||!result.valid)return {valid:false,id:String(mon.id||''),name:String(mon.name||'未知'),message:result&&(result.message||result.validation&&result.validation.message)||'当前生产模型不可用。'};
    const member=fullTeam?result.members.find(item=>String(item.mon&&item.mon.id||item.id)===String(mon.id))||result.members[0]:result.member,energyRow=member&&member.snorlaxEnergy||result.energy&&result.energy.members&&result.energy.members[0];
    if(!member)return {valid:false,id:String(mon.id||''),name:String(mon.name||'未知'),message:'没有生成成员生产结果。'};
    const ingredient=ingredientRange(member,targetIngredient,1),energy=energyRange(energyRow),teamEnergy=fullTeam?teamEnergyRange(result.energy&&result.energy.members):energy,collectionHours=Number(result.collectionHours)||Number(result.energy&&result.energy.skillCollectionHours)||4,targetRows=(member.ingredients||[]).filter(item=>item.name===targetIngredient),allRows=typeof planner.parseIngredientSlots==='function'?planner.parseIngredientSlots(mon.ingredients,100).all.filter(item=>item.name===targetIngredient):targetRows,lockedRows=allRows.filter(item=>Number(item.unlockLevel)>Number(mon.lv));
    const resources={ingredients:Number(energyRow&&energyRow.skillIngredients)||0,ingredientRange:Array.isArray(energyRow&&energyRow.skillIngredientRange)?energyRow.skillIngredientRange.map(Number):null,potSlots:Number(energyRow&&energyRow.potSlots)||0,tastyBonusPct:Number(energyRow&&energyRow.tastyBonusPct)||0,dreamShards:Number(energyRow&&energyRow.dreamShards)||0,dreamShardRange:Array.isArray(energyRow&&energyRow.dreamShardRange)?energyRow.dreamShardRange.map(Number):null,candy:Number(energyRow&&energyRow.candy)||0,berryJuice:Number(energyRow&&energyRow.berryJuice)||0,recovery:Number(energyRow&&energyRow.teamRecovery)||0};
    return {valid:true,id:String(mon.id||''),name:String(mon.nickname||mon.name||'未知'),speciesName:String(mon.name||''),level:Number(mon.lv)||1,comparisonRole:comparisonRole(mon),targetIngredient,ingredient,energy,teamEnergy,berries:Number(energyRow&&energyRow.berries)||0,berryEnergy:Number(energyRow&&energyRow.berryEnergy)||0,skillEnergy:(Number(energyRow&&energyRow.directSkillEnergy)||0)+(Number(energyRow&&energyRow.complexSkillEnergy)||0),resources,collectionHours,fullHours:Number(member.fullHours),ingredientProbability:Number(member.probability&&member.probability.current)||0,effectiveIntervalSec:Number(member.effectiveIntervalSec)||0,triggers:Number(energyRow&&energyRow.triggers)||0,unlockedSlots:targetRows.map(item=>({unlockLevel:item.unlockLevel,quantity:item.quantity})),lockedSlots:lockedRows.map(item=>({unlockLevel:item.unlockLevel,quantity:item.quantity})),rateProvisional:Boolean(member.probability&&member.probability.provisional),team,fullTeam,mainSkill:String(mon.main||''),audit:{energyProfile:String(options.energyProfile||'timeline'),goodCamp:options.goodCamp!==false,islandBonusPct:Number(options.islandBonusPct)||0,helpingBonusCount:Number(member.helpingBonusCount)||0,skillRatePct:Number(mon.skillRatePct)||null}};
  }
  function compareMany(candidates,targetIngredient,options={}){
    const role=Object.hasOwn(COMPARISON_ROLES,options.role)?options.role:'ingredient',clean=distinctById(candidates).slice(0,5),candidateIds=clean.map(mon=>mon.id),rows=clean.map(mon=>calculate(mon,targetIngredient,{...options,candidateIds})).filter(Boolean),valid=rows.filter(row=>row.valid),compare=role==='berry'?(a,b)=>b.energy.mean-a.energy.mean||b.berries-a.berries:role==='skill'?(a,b)=>b.triggers-a.triggers||b.teamEnergy.mean-a.teamEnergy.mean:(a,b)=>b.ingredient.mean-a.ingredient.mean||b.energy.mean-a.energy.mean,leader=[...valid].sort(compare)[0]||null;
    return {rows,leader,targetIngredient,role,roleLabel:COMPARISON_ROLES[role]};
  }
  function mewSkillScenarios(mon,targetIngredient,options={}){
    if(!allRounderRules||!allRounderRules.isMew(mon))return [];
    return allRounderRules.ALL_MIGHTY_OPTIONS.map(skill=>{const applied=allRounderRules.apply(mon,skill.id),view=calculate(applied,targetIngredient,options);return {skill,...view}}).sort((a,b)=>(b.valid?b.energy.mean:-1)-(a.valid?a.energy.mean:-1));
  }
  function formatRange(value,digits=0){
    if(!value)return '—';const factor=10**digits,low=Math.round(value.low*factor)/factor,high=Math.round(value.high*factor)/factor;return `${low.toLocaleString('zh-CN')}~${high.toLocaleString('zh-CN')}`;
  }
  return Object.freeze({Z80,COMPARISON_ROLES,BERRY_BURST_SKILL_IDS,isBerryBurst,comparisonRole,range,comparisonTeam,ingredientRange,energyRange,teamEnergyRange,calculate,compareMany,mewSkillScenarios,formatRange});
});
