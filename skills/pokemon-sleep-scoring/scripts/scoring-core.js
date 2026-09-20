(function(root,factory){
  'use strict';
  const nature=typeof module==='object'&&module.exports?require('./nature-scores.js'):root.POKEMON_SLEEP_SCORING;
  const api=factory(nature);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_SCORING_CORE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(natureScoring){
  'use strict';

  const INDIVIDUAL_WEIGHT=1,SUBSKILL_WEIGHT=.7,NATURE_WEIGHT=.3,NATURE_POSITIVE_BENCHMARK=55.6;
  const SLOT_LEVELS=Object.freeze([10,25,50,70,80]);
  const SLOT_WEIGHTS=Object.freeze([.25,.25,.25,.15,.10]);
  const INGREDIENT_PATTERN_COEFFICIENTS=Object.freeze({AAA:1,ABB:.85,ABA:.80,AAB:.70,AAC:.70,ABC:.50});
  const ALL_ROUNDER_FOCUS_LABELS=Object.freeze({berry:'树果位',ingredient:'食材位',skill:'技能位'});
  const LEGAL_SUBSKILL_MAX_BUILDS=Object.freeze({
    berry:Object.freeze(['树果数量S','帮手奖励','帮忙速度M','帮忙速度S','技能概率M']),
    ingredient:Object.freeze(['帮手奖励','食材概率S','食材概率M','帮忙速度M','帮忙速度S']),
    skill:Object.freeze(['帮手奖励','技能概率S','技能概率M','帮忙速度M','帮忙速度S']),
    all:Object.freeze(['帮手奖励','技能概率M','帮忙速度M','树果数量S','食材概率M'])
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
  const BERRY_BURST_SKILL_IDS=new Set([17,21,35]);
  const ROLE_MULTIPLIER_CEILINGS=Object.freeze({berry:2.37,ingredient:2.60,skill:2.32,'berry-burst':2.24});
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
    if(role==='all'){
      const parts=['berry','ingredient','skill'].map(partRole=>subskillFit(partRole,skill,finalRecord));
      const provisional=parts.some(part=>part.status.startsWith('provisional'));
      return {score:round(parts.reduce((sum,part)=>sum+part.score,0)/parts.length),status:provisional?'provisional-balanced-all-rounder-average':'confirmed-balanced-all-rounder-average'};
    }
    if(role==='berry'&&(skill==='食材概率M'||skill==='食材概率S')){
      const p=Number(finalRecord&&finalRecord.ingredientRate),score=-(p*PROBABILITY_BOOST[skill]/(1-p))/.5*100;
      return {score:round(score),status:'confirmed-dynamic-negative'};
    }
    const entry=SUBSKILL_FIT[role]&&SUBSKILL_FIT[role][skill];
    return entry?{score:entry[0],status:entry[1]}:{score:0,status:'provisional-unlisted-zero'};
  }

  function interactionBonus(role,slots,finalRecord){
    if(role==='all'){
      const parts=['berry','ingredient','skill'].map(partRole=>interactionBonus(partRole,slots,finalRecord));
      const active=parts.filter(part=>part.slotIndex!==null);
      if(!active.length)return {score:0,slotIndex:null,multiplier:1};
      return {score:round(parts.reduce((sum,part)=>sum+part.score,0)/parts.length),slotIndex:Math.max(...active.map(part=>part.slotIndex)),multiplier:round(parts.reduce((sum,part)=>sum+part.multiplier,0)/parts.length,4)};
    }
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

  function allRounderIngredientRoute(ingredients){
    const names=String(ingredients||'').split('／').slice(0,3).map(slot=>slot.replace(/×\d+$/,'').trim());
    while(names.length<3)names.push('');
    const letters=new Map();let next=0,complete=true;
    const pattern=names.map(name=>{
      if(!name||name==='—'){complete=false;return '?'}
      if(!letters.has(name))letters.set(name,String.fromCharCode(65+next++));
      return letters.get(name);
    }).join('');
    return {pattern,coefficient:complete?(INGREDIENT_PATTERN_COEFFICIENTS[pattern]??INGREDIENT_PATTERN_COEFFICIENTS.ABC):1,complete};
  }

  function allRounderChannelScore(box,role,finalRecord,revealedMask,route){
    const rawSkills=box&&box.subskills||box&&box.subs||'',scored=scoreSubskillSlots(rawSkills,role,finalRecord);
    const ceilingBuild=LEGAL_SUBSKILL_MAX_BUILDS[role].map((skill,index)=>revealedMask[index]?skill:'—');
    const ceiling=scoreSubskillSlots(ceilingBuild,role,finalRecord),score=ceiling.raw>0?round(clamp(scored.raw/ceiling.raw*100)):0;
    const routeCoefficient=role==='ingredient'?route.coefficient:1,adjustedScore=round(score*routeCoefficient);
    const provisionalItems=[...new Set([
      ...scored.slots.filter((slot,index)=>revealedMask[index]&&slot.fitStatus.startsWith('provisional')).map(slot=>slot.scoredSkill),
      ...ceiling.slots.filter((slot,index)=>revealedMask[index]&&slot.fitStatus.startsWith('provisional')).map(slot=>`当前开放栏位基准：${slot.scoredSkill}`)
    ])];
    return {role,label:ALL_ROUNDER_FOCUS_LABELS[role],score,adjustedScore,routeCoefficient,subskillRaw:scored.raw,subskillLegalMaximum:ceiling.raw,subskillLegalMaximumBuild:ceilingBuild,interactionMultiplier:scored.interaction.multiplier,interactionBonus:scored.interaction.score,slots:scored.slots,provisional:provisionalItems.length>0,provisionalItems};
  }

  function allRounderIndividualScore(box,finalRecord){
    const rawSkills=splitSubskills(box&&box.subskills||box&&box.subs||''),revealedMask=rawSkills.map(skill=>skill!=='—'),revealedSubskillCount=revealedMask.filter(Boolean).length;
    const unopenedSubskillLevels=SLOT_LEVELS.filter((_level,index)=>!revealedMask[index]),route=allRounderIngredientRoute(box&&box.ingredients);
    const channels=Object.fromEntries(['berry','ingredient','skill'].map(role=>[role,allRounderChannelScore(box,role,finalRecord,revealedMask,route)]));
    const requestedFocus=String(box&&box.allRounderFocusRole||'auto'),explicitFocus=Object.hasOwn(ALL_ROUNDER_FOCUS_LABELS,requestedFocus)?requestedFocus:null;
    const focusRole=explicitFocus||['berry','ingredient','skill'].sort((left,right)=>channels[right].adjustedScore-channels[left].adjustedScore)[0],selected=channels[focusRole];
    const provisionalItems=[...new Set([
      ...selected.provisionalItems,
      ...(!route.complete&&focusRole==='ingredient'?['食材栏尚未全部开放，暂不扣路线系数']:[])
    ])];
    const hasHelpingBonus=rawSkills.includes('帮手奖励'),hasBerryFinding=rawSkills.includes('树果数量S'),mainSkillId=Number(finalRecord&&finalRecord.mainSkill&&finalRecord.mainSkill.id),berryBurst=focusRole==='berry'&&(BERRY_BURST_SKILL_IDS.has(mainSkillId)||/树果骤增/.test(String(box&&box.main||''))),modelRole=berryBurst?'berry-burst':focusRole;
    const multiplier=round(1+selected.adjustedScore/100*((ROLE_MULTIPLIER_CEILINGS[modelRole]||2)-1),2),grade=gradeMultiplier(modelRole,multiplier,{hasHelpingBonus,hasBerryFinding,ingredientPattern:route.pattern});
    return {
      model:'mythical-role-focus',score:multiplier,multiplier,currentMultiplier:multiplier,potentialMultiplier:multiplier,grade,qualityScore:selected.adjustedScore,focusRole,focusRoleLabel:selected.label,focusSelection:explicitFocus?'manual':'automatic-best-fit',channels,
      revealedSubskillCount,unopenedSubskillLevels,subskillRaw:selected.subskillRaw,subskillRawBeforeClamp:selected.subskillRaw,subskillLegalMaximum:selected.subskillLegalMaximum,subskillLegalMaximumBuild:selected.subskillLegalMaximumBuild,
      subskillScore:selected.score,subskillContribution:selected.adjustedScore,natureRaw:0,natureScore:0,natureContribution:0,fixedNature:true,natureNote:'幻之宝可梦性格固定，不参与可洗个体差异',
      individualBeforePattern:selected.score,ingredientPattern:route.pattern,ingredientPatternCoefficient:route.coefficient,ingredientRouteComplete:route.complete,ingredientRouteScope:'ingredient-channel-only',
      interactionMultiplier:selected.interactionMultiplier,interactionBonus:selected.interactionBonus,slots:selected.slots,hasHelpingBonus,hasBerryFinding,berryBurst,provisional:provisionalItems.length>0,provisionalItems
    };
  }

  function skillSet(rawSkills,potential){
    return (potential?seedMaximizedSubskills(rawSkills).map(slot=>slot.scoredSkill):splitSubskills(rawSkills));
  }
  function skillEffects(skills){
    let speedReduction=0,ingredientBoost=0,skillBoost=0;
    skills.forEach(skill=>{
      if(skill==='帮手奖励')speedReduction+=.05;
      speedReduction+=HELP_SPEED_REDUCTION[skill]||0;
      if(skill.startsWith('食材概率'))ingredientBoost+=PROBABILITY_BOOST[skill]||0;
      if(skill.startsWith('技能概率'))skillBoost+=PROBABILITY_BOOST[skill]||0;
    });
    return {speedReduction:Math.min(.35,speedReduction),ingredientBoost,skillBoost,hasHelpingBonus:skills.includes('帮手奖励'),hasBerryFinding:skills.includes('树果数量S')};
  }
  function effectiveSkillProbability(probability,pityCount){
    const p=clamp(Number(probability)||0,0,.999999),pity=Math.max(1,Math.round(Number(pityCount)||1));
    return p>0?p/(1-(1-p)**pity):0;
  }
  function berryBurstEquivalent(mainSkillId){
    if(Number(mainSkillId)===17)return 21*(1+.186*2)+5*4*.625;
    if(Number(mainSkillId)===35)return 58+5*4*.625;
    return 30+5*4*.625;
  }
  function multiplierFor(role,skills,natureText,finalRecord){
    const effects=skillEffects(skills),nature=natureScoring.natureModifiers(natureText||'认真'),baseIngredient=clamp(Number(finalRecord&&finalRecord.ingredientRate)||0,0,.999999),baseSkill=clamp((Number(finalRecord&&finalRecord.skillRatePct)||0)/100,0,.999999),baseBerries=Math.max(1,Number(finalRecord&&finalRecord.baseBerryCount)||1);
    const speed=1/(nature.helpInterval*(1-effects.speedReduction)),ingredientProbability=clamp(baseIngredient*nature.ingredientChance*(1+effects.ingredientBoost),0,.999999);
    if(role==='ingredient')return speed*(baseIngredient>0?ingredientProbability/baseIngredient:1);
    if(role==='berry')return speed*((1-ingredientProbability)/(1-baseIngredient))*((baseBerries+(effects.hasBerryFinding?1:0))/baseBerries);
    const pity=Math.max(1,Math.ceil(144000/Math.max(1,Number(finalRecord&&finalRecord.helpFrequencyBaseSec)||2400))),skillProbability=clamp(baseSkill*nature.skillChance*(1+effects.skillBoost),0,.999999),effective=effectiveSkillProbability(skillProbability,pity),blankEffective=effectiveSkillProbability(baseSkill,pity);
    if(role==='skill')return speed*(blankEffective>0?effective/blankEffective:1);
    if(role==='berry-burst'){
      const burst=berryBurstEquivalent(finalRecord&&finalRecord.mainSkill&&finalRecord.mainSkill.id),candidate=(1-ingredientProbability)*(baseBerries+(effects.hasBerryFinding?1:0))+effective*burst,blank=(1-baseIngredient)*baseBerries+blankEffective*burst;
      return speed*(blank>0?candidate/blank:1);
    }
    return 1;
  }
  function baseGrade(role,multiplier,hasHelpingBonus){
    if(role==='ingredient'){
      if(hasHelpingBonus)return multiplier>=1.9?'S':multiplier>=1.7?'A':multiplier>=1.6?'B':'C';
      return multiplier>=2?'S':multiplier>=1.75?'A':multiplier>=1.63?'B':'C';
    }
    if(role==='berry-burst')return multiplier>=2?'S':multiplier>=1.85?'A':multiplier>=1.6?'B':'C';
    if(role==='berry'){
      if(hasHelpingBonus)return multiplier>=2?'S':multiplier>=1.84?'A':multiplier>=1.7?'B':'C';
      return multiplier>=2?'A':multiplier>=1.84?'B':'C';
    }
    if(hasHelpingBonus)return multiplier>=2?'S':multiplier>=1.7?'A':multiplier>=1.6?'B':'C';
    return multiplier>=1.84?'A':multiplier>=1.75?'B':'C';
  }
  function gradeMultiplier(role,multiplier,options={}){
    if(['berry','berry-burst'].includes(role)&&!options.hasBerryFinding)return 'C';
    let grade=baseGrade(role,Number(multiplier)||0,Boolean(options.hasHelpingBonus));
    if(role==='ingredient'){
      const pattern=String(options.ingredientPattern||'');
      if(pattern==='ABB'&&['S','A'].includes(grade))grade='B';
      else if(pattern&&pattern!=='AAA'&&pattern!=='ABB')grade='C';
    }
    return grade;
  }
  function outputMultiplierScore(box,role,finalRecord){
    const rawSkills=box&&box.subskills||box&&box.subs||'',currentRawSkills=box&&box.effectiveSubs||rawSkills,currentSkills=skillSet(currentRawSkills,false),potentialSkills=skillSet(rawSkills,true),actualNature=box&&box.nature||'认真';
    const currentMultiplier=multiplierFor(role,currentSkills,actualNature,finalRecord),potentialWithNature=multiplierFor(role,potentialSkills,actualNature,finalRecord),neutralPotential=multiplierFor(role,potentialSkills,'认真',finalRecord),potentialMultiplier=Math.max(potentialWithNature,neutralPotential),potentialEffects=skillEffects(potentialSkills),pattern=role==='ingredient'?ingredientPattern(box&&box.ingredients):'不适用',grade=gradeMultiplier(role,potentialMultiplier,{...potentialEffects,ingredientPattern:pattern});
    return {
      model:'blank-output-multiplier',score:round(potentialMultiplier,2),multiplier:round(potentialMultiplier,4),currentMultiplier:round(currentMultiplier,4),potentialMultiplier:round(potentialMultiplier,4),grade,role,hasHelpingBonus:potentialEffects.hasHelpingBonus,hasBerryFinding:potentialEffects.hasBerryFinding,
      ingredientPattern:pattern,ingredientPatternCoefficient:pattern==='AAA'?1:pattern==='ABB'?.85:0,routeRule:role==='ingredient'?(pattern==='AAA'?'长期路线':pattern==='ABB'?'最高 B 级':'长期评价为 C 级'):'不适用',mintApplied:neutralPotential>potentialWithNature+1e-9,seedApplied:seedMaximizedSubskills(rawSkills).some(slot=>slot.seedUpgraded),currentSkills,potentialSkills,
      reference:'同最终形态、同食材路线、同主技能等级、及时收菜；白板=1.00',provisional:false,provisionalItems:[]
    };
  }

  function individualScore(box,role,finalRecord,options={}){
    if(!['berry','ingredient','skill','berry-burst','all'].includes(role))return null;
    if(role==='all')return allRounderIndividualScore(box,finalRecord);
    return outputMultiplierScore(box,role,finalRecord,options);
  }

  return Object.freeze({
    weights:Object.freeze({individual:INDIVIDUAL_WEIGHT,subskill:SUBSKILL_WEIGHT,nature:NATURE_WEIGHT}),
    naturePositiveBenchmark:NATURE_POSITIVE_BENCHMARK,slotLevels:SLOT_LEVELS,slotWeights:SLOT_WEIGHTS,
    ingredientPatternCoefficients:INGREDIENT_PATTERN_COEFFICIENTS,legalSubskillMaxBuilds:LEGAL_SUBSKILL_MAX_BUILDS,allRounderFocusLabels:ALL_ROUNDER_FOCUS_LABELS,
    subskillFitTable:SUBSKILL_FIT,resourceSubskillFit:RESOURCE_SUBSKILL_FIT,helpSpeedReduction:HELP_SPEED_REDUCTION,probabilityBoost:PROBABILITY_BOOST,
    berryBurstSkillIds:BERRY_BURST_SKILL_IDS,roleMultiplierCeilings:ROLE_MULTIPLIER_CEILINGS,
    round,clamp,splitSubskills,seedMaximizedSubskills,ingredientPattern,subskillFit,interactionBonus,scoreSubskillSlots,legalSubskillMaximum,allRounderIngredientRoute,allRounderChannelScore,allRounderIndividualScore,skillEffects,effectiveSkillProbability,berryBurstEquivalent,multiplierFor,gradeMultiplier,outputMultiplierScore,individualScore
  });
});
