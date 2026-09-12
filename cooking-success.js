(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_COOKING_SUCCESS=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const TASTY_CHANCE_S=Object.freeze({
    mainSkillId:14,
    maxLevel:6,
    bonusPctByLevel:Object.freeze({1:4,2:5,3:6,4:7,5:8,6:10}),
    maximumAccumulatedBonusPct:70,
    weekdayBaseCritProbability:.1,
    sundayBaseCritProbability:.3,
    weekdayCritMultiplier:2,
    sundayCritMultiplier:3
  });

  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  const sum=values=>values.reduce((total,value)=>total+value,0);

  function isTastyChanceHelper(mon){
    return Number(mon&&mon.mainSkillId)===TASTY_CHANCE_S.mainSkillId||/料理成功S/.test(String(mon&&mon.main||''));
  }

  function bonusPctPerTrigger(mon,skillLevel=1){
    if(!isTastyChanceHelper(mon))return 0;
    const level=clamp(Math.round(skillLevel),1,TASTY_CHANCE_S.maxLevel);
    return TASTY_CHANCE_S.bonusPctByLevel[level]||0;
  }

  function poissonCappedCounts(mean,maximumCount){
    const safeMean=Math.max(0,Number(mean)||0),safeMaximum=Math.max(1,Math.round(maximumCount)||1),probabilities=Array(safeMaximum+1).fill(0);
    let probability=Math.exp(-safeMean),explicitTotal=probability;
    probabilities[0]=probability;
    for(let count=1;count<safeMaximum;count+=1){
      probability*=safeMean/count;
      probabilities[count]=probability;
      explicitTotal+=probability;
    }
    probabilities[safeMaximum]=Math.max(0,1-explicitTotal);
    return probabilities;
  }

  function initialBonusState(currentBonusPct=0){
    const state=Array(TASTY_CHANCE_S.maximumAccumulatedBonusPct+1).fill(0);
    state[clamp(Math.round(currentBonusPct),0,TASTY_CHANCE_S.maximumAccumulatedBonusPct)]=1;
    return state;
  }

  function advanceTriggers(state,triggerMean,bonusPerTrigger){
    const maximumBonus=TASTY_CHANCE_S.maximumAccumulatedBonusPct,safeBonus=Math.max(1,Math.round(bonusPerTrigger)||1),maximumUsefulTriggers=Math.ceil(maximumBonus/safeBonus),counts=poissonCappedCounts(triggerMean,maximumUsefulTriggers),next=Array(maximumBonus+1).fill(0);
    for(let bonus=0;bonus<=maximumBonus;bonus+=1){
      const stateProbability=Number(state&&state[bonus])||0;
      if(!(stateProbability>0))continue;
      if(bonus>=maximumBonus){next[maximumBonus]+=stateProbability;continue}
      const available=Math.ceil((maximumBonus-bonus)/safeBonus);
      counts.forEach((countProbability,count)=>{
        if(!(countProbability>0))return;
        const accepted=Math.min(count,available),nextBonus=Math.min(maximumBonus,bonus+accepted*safeBonus);
        next[nextBonus]+=stateProbability*countProbability;
      });
    }
    return next;
  }

  function bonusDistribution(sources,hours,currentBonusPct=0){
    let state=initialBonusState(currentBonusPct);
    (sources||[]).forEach(source=>{
      const rate=Math.max(0,Number(source&&source.triggersPerHour)||0),bonus=Math.max(0,Math.round(Number(source&&source.bonusPctPerTrigger)||0));
      if(rate>0&&bonus>0)state=advanceTriggers(state,rate*Math.max(0,Number(hours)||0),bonus);
    });
    return state;
  }

  function summarizeDistribution(state,targetBonusPct=70){
    const target=clamp(Math.round(targetBonusPct),0,TASTY_CHANCE_S.maximumAccumulatedBonusPct),probabilityAtTarget=sum((state||[]).slice(target)),expectedBonus=sum((state||[]).map((probability,bonus)=>probability*bonus));
    return {targetBonusPct:target,probabilityAtTarget,expectedBonus};
  }

  function timeForTargetProbability(sources,{currentBonusPct=0,targetBonusPct=70,confidence=.8,maxHours=336}={}){
    const current=clamp(Math.round(currentBonusPct),0,TASTY_CHANCE_S.maximumAccumulatedBonusPct),target=clamp(Math.round(targetBonusPct),current,TASTY_CHANCE_S.maximumAccumulatedBonusPct),safeConfidence=clamp(confidence,.01,.999);
    if(current>=target)return 0;
    const hasRate=(sources||[]).some(source=>Number(source&&source.triggersPerHour)>0&&Number(source&&source.bonusPctPerTrigger)>0);
    if(!hasRate)return null;
    const probabilityAt=hours=>summarizeDistribution(bonusDistribution(sources,hours,current),target).probabilityAtTarget;
    let high=.5;
    while(high<maxHours&&probabilityAt(high)<safeConfidence)high*=2;
    high=Math.min(high,maxHours);
    if(probabilityAt(high)<safeConfidence)return null;
    let low=0;
    for(let index=0;index<42;index+=1){const middle=(low+high)/2;if(probabilityAt(middle)>=safeConfidence)high=middle;else low=middle}
    return high;
  }

  function deploymentEstimate(sources,options={}){
    const targetSetting=Number(options.targetBonusPct),currentBonusPct=clamp(Math.round(options.currentBonusPct),0,TASTY_CHANCE_S.maximumAccumulatedBonusPct),targetBonusPct=clamp(Math.round(Number.isFinite(targetSetting)?targetSetting:70),currentBonusPct,TASTY_CHANCE_S.maximumAccumulatedBonusPct),medianHours=timeForTargetProbability(sources,{currentBonusPct,targetBonusPct,confidence:.5,maxHours:options.maxHours}),safeHours=timeForTargetProbability(sources,{currentBonusPct,targetBonusPct,confidence:options.confidence||.8,maxHours:options.maxHours});
    const state=safeHours===null?initialBonusState(currentBonusPct):bonusDistribution(sources,safeHours,currentBonusPct),summary=summarizeDistribution(state,targetBonusPct),bonusPerHour=sum((sources||[]).map(source=>(Number(source.triggersPerHour)||0)*(Number(source.bonusPctPerTrigger)||0)));
    return {currentBonusPct,targetBonusPct,confidence:clamp(options.confidence||.8,.01,.999),medianHours,safeHours,bonusPerHour,state,...summary,reachable:currentBonusPct>=targetBonusPct||safeHours!==null};
  }

  function mealOutcome({bonusPct=0,isSunday=false,activityMultiplier=1}={}){
    const accumulated=clamp(bonusPct,0,TASTY_CHANCE_S.maximumAccumulatedBonusPct),baseProbability=isSunday?TASTY_CHANCE_S.sundayBaseCritProbability:TASTY_CHANCE_S.weekdayBaseCritProbability,critMultiplier=isSunday?TASTY_CHANCE_S.sundayCritMultiplier:TASTY_CHANCE_S.weekdayCritMultiplier,critProbability=Math.min(1,baseProbability+accumulated/100),expectedMultiplier=(Number(activityMultiplier)||1)*(1+critProbability*(critMultiplier-1));
    return {bonusPct:accumulated,isSunday,baseProbability,critProbability,critMultiplier,activityMultiplier:Number(activityMultiplier)||1,expectedMultiplier};
  }

  function expectedMealOutcome(state,{isSunday=false,activityMultiplier=1}={}){
    let critProbability=0,expectedMultiplier=0;
    (state||initialBonusState(0)).forEach((probability,bonusPct)=>{
      if(!(probability>0))return;
      const outcome=mealOutcome({bonusPct,isSunday,activityMultiplier});
      critProbability+=probability*outcome.critProbability;
      expectedMultiplier+=probability*outcome.expectedMultiplier;
    });
    return {isSunday,critProbability,expectedMultiplier,critMultiplier:isSunday?TASTY_CHANCE_S.sundayCritMultiplier:TASTY_CHANCE_S.weekdayCritMultiplier};
  }

  return Object.freeze({TASTY_CHANCE_S,isTastyChanceHelper,bonusPctPerTrigger,poissonCappedCounts,initialBonusState,advanceTriggers,bonusDistribution,summarizeDistribution,timeForTargetProbability,deploymentEstimate,mealOutcome,expectedMealOutcome});
});
