(function(root,factory){
  'use strict';
  const nature=typeof module==='object'&&module.exports?require('./nature-scores.js'):root.POKEMON_SLEEP_SCORING;
  const api=factory(nature);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_SCORING_CORE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(natureScoring){
  'use strict';

  const SPECIES_WEIGHT=.75,INDIVIDUAL_WEIGHT=.25,SUBSKILL_WEIGHT=.7,NATURE_WEIGHT=.3,NATURE_POSITIVE_BENCHMARK=55.6;
  const SLOT_LEVELS=Object.freeze([10,25,50,70,80]);
  const SLOT_WEIGHTS=Object.freeze([.25,.25,.25,.15,.10]);
  const INGREDIENT_PATTERN_COEFFICIENTS=Object.freeze({AAA:1,ABB:.85,ABA:.80,AAB:.70,AAC:.70,ABC:.50});
  const LEGAL_SUBSKILL_MAX_BUILDS=Object.freeze({
    berry:Object.freeze(['树果数量S','帮手奖励','帮忙速度M','帮忙速度S','技能概率M']),
    ingredient:Object.freeze(['帮手奖励','食材概率S','食材概率M','帮忙速度M','帮忙速度S']),
    skill:Object.freeze(['帮手奖励','技能概率S','技能概率M','帮忙速度M','帮忙速度S'])
  });
  const SUBSKILL_UPGRADE_FAMILIES=Object.freeze([
    Object.freeze(['帮忙速度S','帮忙速度M']),Object.freeze(['食材概率S','食材概率M']),
    Object.freeze(['技能概率S','技能概率M']),Object.freeze(['技能等级S','技能等级M']),
    Object.freeze(['持有上限S','持有上限M','持有上限L'])
  ]);
  const SUBSKILL_FIT=Object.freeze({
    berry:Object.freeze({'树果数量S':[100,'confirmed'],'帮手奖励':[75,'confirmed'],'帮忙速度M':[47,'confirmed'],'帮忙速度S':[22,'confirmed'],'技能概率M':[30,'provisional'],'技能概率S':[15,'provisional'],'技能等级M':[8,'provisional'],'技能等级S':[4,'provisional'],'持有上限L':[8,'provisional'],'持有上限M':[5,'provisional'],'持有上限S':[3,'provisional']}),
    ingredient:Object.freeze({'树果数量S':[25,'provisional'],'食材概率M':[100,'confirmed'],'食材概率S':[50,'confirmed'],'帮手奖励':[75,'confirmed'],'帮忙速度M':[45,'confirmed'],'帮忙速度S':[21,'confirmed'],'技能概率M':[25,'provisional'],'技能概率S':[12.5,'provisional'],'技能等级M':[8,'provisional'],'技能等级S':[4,'provisional'],'持有上限L':[25,'provisional'],'持有上限M':[12,'provisional'],'持有上限S':[6,'provisional']}),
    skill:Object.freeze({'树果数量S':[10,'provisional'],'食材概率M':[0,'confirmed-not-applicable-before-cap'],'食材概率S':[0,'confirmed-not-applicable-before-cap'],'技能概率M':[100,'confirmed'],'技能概率S':[50,'confirmed'],'帮手奖励':[75,'confirmed'],'帮忙速度M':[45,'confirmed'],'帮忙速度S':[21,'confirmed'],'技能等级M':[8,'confirmed'],'技能等级S':[4,'confirmed'],'持有上限L':[0,'confirmed-no-separate-individual-score'],'持有上限M':[0,'confirmed-no-separate-individual-score'],'持有上限S':[0,'confirmed-no-separate-individual-score']})
  });
  const RESOURCE_SUBSKILL_FIT=Object.freeze({'睡眠EXP奖励':[20,'confirmed'],'活力恢复奖励':[12,'confirmed'],'梦之碎片奖励':[10,'confirmed'],'研究EXP奖励':[8,'confirmed'],'—':[0,'not-present']});
  const HELP_SPEED_REDUCTION=Object.freeze({'帮忙速度S':.07,'帮忙速度M':.14});
  const PROBABILITY_BOOST=Object.freeze({'食材概率S':.18,'食材概率M':.36,'技能概率S':.18,'技能概率M':.36});
  const round=(value,digits=1)=>{const scale=10**digits;return Math.round((Number(value)+Number.EPSILON)*scale)/scale};
  const clamp=(value,min=0,max=100)=>Math.min(max,Math.max(min,value));
  const splitSubskills=value=>{const skills=(Array.isArray(value)?value:String(value||'').split('；')).slice(0,5);while(skills.length<5)skills.push('—');return skills};

  function seedMaximizedSubskills(skills){
    const slots=splitSubskills(skills).map(skill=>({skill,scoredSkill:skill,seedUpgraded:false,seedNote:''}));
    for(const family of SUBSKILL_UPGRADE_FAMILIES){
      const members=slots.map((slot,index)=>({slot,index,rank:family.indexOf(slot.skill)})).filter(member=>member.rank>=0).sort((a,b)=>a.rank-b.rank);
      if(!members.length)continue;
      const firstTargetRank=family.length-members.length;
      members.forEach((member,order)=>{
        const targetSkill=family[firstTargetRank+order];
        member.slot.scoredSkill=targetSkill;member.slot.seedUpgraded=targetSkill!==member.slot.skill;
        if(member.slot.seedUpgraded)member.slot.seedNote='按副技能种子最高合法形态计分';
      });
      if(members.length>1)members.forEach(member=>{member.slot.seedNote=[member.slot.seedNote,'同系技能分别占位并叠加'].filter(Boolean).join('；')});
    }
    return slots;
  }

  function ingredientPattern(ingredients){
    const names=String(ingredients||'').split('／').map(slot=>slot.replace(/×\d+$/,'').trim()),letters=new Map();let next=0;
    return names.map(name=>{if(!letters.has(name))letters.set(name,String.fromCharCode(65+next++));return letters.get(name)}).join('');
  }

  function subskillFit(role,skill,finalRecord){
    if(Object.hasOwn(RESOURCE_SUBSKILL_FIT,skill)){const [score,status]=RESOURCE_SUBSKILL_FIT[skill];return {score,status}}
    if(role==='berry'&&(skill==='食材概率M'||skill==='食材概率S')){
      const p=Number(finalRecord&&finalRecord.ingredientRate),score=-(p*PROBABILITY_BOOST[skill]/(1-p))/.5*100;
      return {score:round(score),status:'confirmed-dynamic-negative'};
    }
    const entry=SUBSKILL_FIT[role]&&SUBSKILL_FIT[role][skill];
    return entry?{score:entry[0],status:entry[1]}:{score:0,status:'provisional-unlisted-zero'};
  }

  function interactionBonus(role,slots,finalRecord){
    const relevant=[],speedEffects=[];let speedReduction=0,probabilityBoost=0,berryFinding=0;
    slots.forEach((slot,index)=>{
      const speed=HELP_SPEED_REDUCTION[slot.scoredSkill]||0;
      if(speed){speedReduction+=speed;speedEffects.push(speed/(1-speed));relevant.push(index)}
      const roleProbability=(role==='ingredient'&&slot.scoredSkill.startsWith('食材概率'))||(role==='skill'&&slot.scoredSkill.startsWith('技能概率'))||(role==='berry'&&slot.scoredSkill.startsWith('食材概率'));
      if(roleProbability){probabilityBoost+=PROBABILITY_BOOST[slot.scoredSkill]||0;relevant.push(index)}
      if(role==='berry'&&slot.scoredSkill==='树果数量S'){berryFinding=1;relevant.push(index)}
    });
    if(relevant.length<2)return {score:0,slotIndex:null,multiplier:1};
    let multiplier,separateEffect,scale;
    if(role==='berry'){
      const p=Number(finalRecord&&finalRecord.ingredientRate);
      multiplier=1/(1-speedReduction)*(1-p*(1+probabilityBoost))/(1-p)*(1+berryFinding*.5);
      separateEffect=speedEffects.reduce((sum,value)=>sum+value,0)-p*probabilityBoost/(1-p)+berryFinding*.5;scale=200;
    }else{
      multiplier=(1+probabilityBoost)/(1-speedReduction);
      separateEffect=probabilityBoost+speedEffects.reduce((sum,value)=>sum+value,0);scale=277.78;
    }
    return {score:round((multiplier-1-separateEffect)*scale),slotIndex:Math.max(...relevant),multiplier:round(multiplier,4)};
  }

  function scoreSubskillSlots(rawSkills,role,finalRecord){
    const slots=seedMaximizedSubskills(rawSkills),interaction=interactionBonus(role,slots,finalRecord);
    const scoredSlots=slots.map((slot,index)=>{
      const fit=subskillFit(role,slot.scoredSkill,finalRecord),interactionScore=interaction.slotIndex===index?interaction.score:0,effectiveFit=fit.score+interactionScore;
      return {level:SLOT_LEVELS[index],weight:SLOT_WEIGHTS[index],...slot,fitScore:round(fit.score),fitStatus:fit.status,interactionScore:round(interactionScore),effectiveFitScore:round(effectiveFit),contribution:round(effectiveFit*SLOT_WEIGHTS[index])};
    });
    return {slots:scoredSlots,interaction,raw:round(scoredSlots.reduce((sum,slot)=>sum+slot.contribution,0))};
  }

  function legalSubskillMaximum(role,finalRecord){
    const build=LEGAL_SUBSKILL_MAX_BUILDS[role];if(!build)return null;
    const scored=scoreSubskillSlots(build,role,finalRecord),provisionalItems=[...new Set(scored.slots.filter(slot=>slot.fitStatus.startsWith('provisional')).map(slot=>slot.scoredSkill))];
    return {raw:scored.raw,build:[...build],slots:scored.slots,provisional:provisionalItems.length>0,provisionalItems};
  }

  function individualScore(box,role,finalRecord){
    if(!['berry','ingredient','skill'].includes(role))return null;
    const scored=scoreSubskillSlots(box&&box.subskills||box&&box.subs||'',role,finalRecord),legalMaximum=legalSubskillMaximum(role,finalRecord);
    const subskillRawBeforeClamp=scored.raw,subskillRaw=round(clamp(subskillRawBeforeClamp)),subskillScore=round(clamp(subskillRawBeforeClamp/legalMaximum.raw*100)),subskillContribution=round(subskillScore*SUBSKILL_WEIGHT);
    const natureRaw=natureScoring.natureScore(role,box&&box.nature,role==='berry'?Number(finalRecord&&finalRecord.ingredientRate):undefined);
    const natureScoreBeforeRound=clamp(natureRaw/NATURE_POSITIVE_BENCHMARK*100,-100,100),natureScore=round(natureScoreBeforeRound),natureContribution=round(natureScoreBeforeRound*NATURE_WEIGHT);
    const individualBeforePattern=round(clamp(subskillContribution+natureContribution)),pattern=role==='ingredient'?ingredientPattern(box&&box.ingredients):'不适用',patternCoefficient=role==='ingredient'?(INGREDIENT_PATTERN_COEFFICIENTS[pattern]??INGREDIENT_PATTERN_COEFFICIENTS.ABC):1,score=round(individualBeforePattern*patternCoefficient);
    const provisionalItems=[...new Set([...scored.slots.filter(slot=>slot.fitStatus.startsWith('provisional')).map(slot=>slot.scoredSkill),...legalMaximum.provisionalItems.map(skill=>`合法满分基准：${skill}`)])];
    return {score,subskillRaw,subskillRawBeforeClamp:round(subskillRawBeforeClamp),subskillLegalMaximum:legalMaximum.raw,subskillLegalMaximumBuild:legalMaximum.build,subskillScore,subskillContribution,natureRaw,natureScore,natureContribution,individualBeforePattern,ingredientPattern:pattern,ingredientPatternCoefficient:patternCoefficient,interactionMultiplier:scored.interaction.multiplier,interactionBonus:scored.interaction.score,slots:scored.slots,provisional:provisionalItems.length>0,provisionalItems};
  }

  return Object.freeze({
    weights:Object.freeze({species:SPECIES_WEIGHT,individual:INDIVIDUAL_WEIGHT,subskill:SUBSKILL_WEIGHT,nature:NATURE_WEIGHT}),
    naturePositiveBenchmark:NATURE_POSITIVE_BENCHMARK,slotLevels:SLOT_LEVELS,slotWeights:SLOT_WEIGHTS,
    ingredientPatternCoefficients:INGREDIENT_PATTERN_COEFFICIENTS,legalSubskillMaxBuilds:LEGAL_SUBSKILL_MAX_BUILDS,
    subskillFitTable:SUBSKILL_FIT,resourceSubskillFit:RESOURCE_SUBSKILL_FIT,helpSpeedReduction:HELP_SPEED_REDUCTION,probabilityBoost:PROBABILITY_BOOST,
    round,clamp,splitSubskills,seedMaximizedSubskills,ingredientPattern,subskillFit,interactionBonus,scoreSubskillSlots,legalSubskillMaximum,individualScore
  });
});
