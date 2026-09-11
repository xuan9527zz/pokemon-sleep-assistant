(function(root,factory){
  'use strict';
  const curves=typeof module==='object'&&module.exports?require('./sleep-reward-curves.generated.js'):root.POKEMON_SLEEP_REWARD_CURVES;
  const api=factory(curves);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_RESEARCH_PLANNER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(curves){
  'use strict';

  const SLEEP_TYPES=Object.freeze({balanced:'综合平均',dozing:'浅浅入梦',snoozing:'安然入睡',slumbering:'深深入眠'});
  const OBJECTIVES=Object.freeze({combined:'梦之碎片＋研究EXP',shards:'梦之碎片',researchExp:'研究EXP',spawns:'遇见总数',pokemon:'严选目标出现',candy:'目标进化系糖果'});
  const TARGET_OBJECTIVES=new Set(['pokemon','candy']);
  const AREA_ALIASES=Object.freeze({
    '黄金发电厂':'old-gold','黄金旧发电厂':'old-gold','琥珀溪谷':'amber-canyon','琥褐溪谷':'amber-canyon',
    '萌绿之岛 EX':'greengrass-expert','萌绿之岛EX':'greengrass-expert','天青沙滩 EX':'cyan-expert','天青沙滩EX':'cyan-expert'
  });
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));

  function areaFor(value){
    const key=String(value||'').trim(),id=AREA_ALIASES[key]||key.replace(/\s+/g,'');
    return curves&&Array.isArray(curves.areas)?curves.areas.find(area=>area.id===id||area.name===key||area.name.replace(/\s+/g,'')===id)||null:null;
  }
  function rankFor(area,energy){
    const value=Math.max(0,Number(energy)||0),ranks=area&&area.ranks||[];
    return ranks.find(rank=>value>=Number(rank.minEnergy||0)&&(rank.maxEnergy===null||value<=Number(rank.maxEnergy)))||ranks[ranks.length-1]||null;
  }
  function spawnCountFor(area,drowsyPower){
    const value=Math.max(0,Number(drowsyPower)||0),rows=area&&area.spawnThresholds||[];
    return rows.reduce((count,row)=>value>=Number(row.minDrowsyPower||0)?Number(row.spawnCount)||count:count,rows[0]&&Number(rows[0].spawnCount)||3);
  }
  function segmentFor(area,rankOrder,sleepType){
    const type=Object.hasOwn(SLEEP_TYPES,sleepType)?sleepType:'balanced',segments=area&&area.segments||[];
    return segments.find(segment=>segment.rankOrder===rankOrder&&segment.sleepType===type)||segments.find(segment=>segment.rankOrder===rankOrder&&segment.sleepType==='balanced')||null;
  }
  function targetDefinition(targetId){return curves&&Array.isArray(curves.targetDefinitions)?curves.targetDefinitions.find(item=>String(item.id)===String(targetId))||null:null}
  function targetDefinitions(areaValue){
    const area=areaFor(areaValue);
    return (curves&&Array.isArray(curves.targetDefinitions)?curves.targetDefinitions:[]).map(definition=>({
      ...definition,
      available:Boolean(area&&(area.targetSegments||[]).some(segment=>String(segment.targetId)===String(definition.id)))
    })).sort((left,right)=>Number(right.available)-Number(left.available)||left.name.localeCompare(right.name,'zh-CN'));
  }
  function targetSegmentFor(area,targetId,rankOrder,sleepType){
    const type=Object.hasOwn(SLEEP_TYPES,sleepType)?sleepType:'balanced',segments=area&&area.targetSegments||[];
    return segments.find(segment=>String(segment.targetId)===String(targetId)&&segment.rankOrder===rankOrder&&segment.sleepType===type)||segments.find(segment=>String(segment.targetId)===String(targetId)&&segment.rankOrder===rankOrder&&segment.sleepType==='balanced')||null;
  }
  function targetInfo(targetId,areaValue){
    const definition=targetDefinition(targetId),area=areaFor(areaValue),segment=area&&area.targetSegments&&area.targetSegments.find(item=>String(item.targetId)===String(targetId)),availableAreas=(definition&&definition.areas||[]).map(id=>areaFor(id)).filter(Boolean).map(item=>({id:item.id,name:item.name}));
    return {definition,area,available:Boolean(definition&&area&&segment),pokemonId:segment&&segment.pokemonId||null,pokemonName:segment&&segment.pokemonName||null,availableAreas};
  }
  function interpolate(segment,key,drowsyPower){
    const powers=segment&&segment.powers||[],values=segment&&segment[key]||[];
    if(!powers.length||powers.length!==values.length)return 0;
    const target=Math.min(Math.max(0,Number(drowsyPower)||0),Number(segment.saturationPower)||powers[powers.length-1]);
    if(target<=powers[0])return Number(values[0])||0;
    if(target>=powers[powers.length-1])return Number(values[values.length-1])||0;
    let low=0,high=powers.length-1;
    while(low+1<high){const middle=(low+high)>>1;if(powers[middle]<=target)low=middle;else high=middle}
    const span=powers[high]-powers[low],ratio=span>0?(target-powers[low])/span:0;
    return (Number(values[low])||0)+((Number(values[high])||0)-(Number(values[low])||0))*ratio;
  }
  function calculateDrowsyPower(snorlaxEnergy,sleepScore,multiplier=1){
    return Math.round(Math.max(0,Number(snorlaxEnergy)||0)*clamp(sleepScore,0,100)*Math.max(0,Number(multiplier)||1));
  }
  function rawResearch(options={}){
    const area=areaFor(options.area),energy=Math.max(0,Math.round(Number(options.energy)||0)),score=clamp(options.score,0,100),multiplier=Math.max(0,Number(options.multiplier)||1),sleepType=Object.hasOwn(SLEEP_TYPES,options.sleepType)?options.sleepType:'balanced';
    if(!area||!energy||!score)return {available:false,area,energy,score,sleepType,drowsyPower:0,spawnCount:0,researchExp:0,shards:0,combined:0,dataCapped:false};
    const rank=rankFor(area,energy),segment=rank&&segmentFor(area,rank.order,sleepType),calculatedPower=calculateDrowsyPower(energy,score,multiplier),datasetCap=Number(curves&&curves.drowsyPowerMax)||Infinity,drowsyPower=Math.min(calculatedPower,datasetCap);
    if(!segment)return {available:false,area,rank,energy,score,sleepType,drowsyPower,spawnCount:spawnCountFor(area,drowsyPower),researchExp:0,shards:0,combined:0,dataCapped:calculatedPower>datasetCap};
    const researchExp=interpolate(segment,'researchExp',drowsyPower),shards=interpolate(segment,'shards',drowsyPower);
    return {available:true,area,rank,energy,score,sleepType,drowsyPower,calculatedPower,spawnCount:spawnCountFor(area,drowsyPower),researchExp,shards,combined:researchExp+shards,dataCapped:calculatedPower>datasetCap};
  }
  function applyResearchDayRules(rawSessions,options={}){
    let researched=Math.max(0,Math.round(Number(options.alreadyResearched)||0));
    const sessions=(rawSessions||[]).map((raw,index)=>{
      const natural=Math.max(0,Math.round(Number(raw.spawnCount)||0)),campExtra=options.goodCamp&&index===0&&natural?1:0,totalSpawns=natural+campExtra,fullRewardSpawns=Math.min(totalSpawns,Math.max(0,10-researched)),reducedRewardSpawns=Math.max(0,totalSpawns-fullRewardSpawns),campFactor=natural?totalSpawns/natural:1,rewardFactor=totalSpawns?(fullRewardSpawns+reducedRewardSpawns*.5)/totalSpawns*campFactor:0;
      researched+=totalSpawns;
      const researchExp=raw.researchExp*rewardFactor,shards=raw.shards*rewardFactor;
      return {...raw,index:index+1,naturalSpawns:natural,campExtra,totalSpawns,fullRewardSpawns,reducedRewardSpawns,rewardFactor,researchExp,shards,combined:researchExp+shards};
    });
    return {sessions,researchExp:sessions.reduce((sum,item)=>sum+item.researchExp,0),shards:sessions.reduce((sum,item)=>sum+item.shards,0),combined:sessions.reduce((sum,item)=>sum+item.combined,0),totalSpawns:sessions.reduce((sum,item)=>sum+item.totalSpawns,0)};
  }
  function durationForScore(score,index=0){return Math.max(index>0?90:0,Math.round(clamp(score,0,100)*5.1))}
  function evaluatePlan(options={}){
    const scores=Array.isArray(options.scores)?options.scores.map(value=>clamp(Math.round(value),1,100)):[],strengths=Array.isArray(options.strengths)?options.strengths:[];
    const raw=scores.map((score,index)=>rawResearch({area:options.area,energy:strengths[index]||strengths[strengths.length-1],score,multiplier:options.multiplier,sleepType:options.sleepType}));
    const adjusted=applyResearchDayRules(raw,{goodCamp:options.goodCamp,alreadyResearched:options.alreadyResearched});
    const objective=Object.hasOwn(OBJECTIVES,options.objective)&&!TARGET_OBJECTIVES.has(options.objective)?options.objective:'combined';
    return {...adjusted,mode:scores.length>1?'split':'single',scores,objective,objectiveValue:objective==='spawns'?adjusted.totalSpawns:adjusted[objective],available:raw.every(item=>item.available),dataCapped:raw.some(item=>item.dataCapped),sessions:adjusted.sessions.map((session,index)=>({...session,minutes:durationForScore(scores[index],index)}))};
  }
  function compareSleepPlans(options={}){
    const area=areaFor(options.area),enteredStrength=Math.max(0,Math.round(Number(options.currentStrength)||Number(options.bedtimeStrength)||0)),currentStrength=enteredStrength,bedtimeStrength=Math.max(0,Math.round(Number(options.bedtimeStrength)||enteredStrength)),sleepType=Object.hasOwn(SLEEP_TYPES,options.sleepType)?options.sleepType:'balanced',objective=Object.hasOwn(OBJECTIVES,options.objective)&&!TARGET_OBJECTIVES.has(options.objective)?options.objective:'combined',multiplier=Math.max(0,Number(options.multiplier)||1),goodCamp=options.goodCamp===true;
    if(!area||!currentStrength)return {available:false,reason:!area?'当前岛屿暂无研究收益曲线。':'填写当前卡比兽能量后，系统才会判断是否达到惩罚线。',area,currentStrength,bedtimeStrength,sleepType,objective,multiplier,goodCamp};
    const base={area:area.id,sleepType,objective,multiplier,goodCamp},single=evaluatePlan({...base,scores:[100],strengths:[bedtimeStrength]}),splits=[];
    for(let firstScore=18;firstScore<100;firstScore+=1)splits.push(evaluatePlan({...base,scores:[firstScore,100-firstScore],strengths:[currentStrength,bedtimeStrength]}));
    splits.sort((left,right)=>right.objectiveValue-left.objectiveValue||Math.abs(left.scores[0]-50)-Math.abs(right.scores[0]-50));
    const bestSplit=splits[0],gain=bestSplit&&single.objectiveValue>0?(bestSplit.objectiveValue/single.objectiveValue-1)*100:0,recommendSplit=gain>=1;
    return {available:true,area,currentStrength,bedtimeStrength,sleepType,objective,multiplier,goodCamp,single,bestSplit,gainPercent:gain,recommendation:recommendSplit?'split':'single',reason:recommendSplit?`按${OBJECTIVES[objective]}估算，最佳分段比完整睡眠高 ${gain.toFixed(1)}%。`:`分段优势不足 1%（${gain.toFixed(1)}%），不值得为此打断一次完整睡眠。`};
  }
  function rawTarget(options={}){
    const area=areaFor(options.area),energy=Math.max(0,Math.round(Number(options.energy)||0)),score=clamp(options.score,0,100),multiplier=Math.max(0,Number(options.multiplier)||1),sleepType=Object.hasOwn(SLEEP_TYPES,options.sleepType)?options.sleepType:'balanced',targetId=String(options.targetId||''),info=targetInfo(targetId,area&&area.id);
    if(!area||!energy||!score||!info.available)return {available:false,area,energy,score,sleepType,targetId,target:info,drowsyPower:0,spawnCount:0,pokemonAppearances:0,familyAppearances:0,candy:0,dataCapped:false};
    const rank=rankFor(area,energy),segment=rank&&targetSegmentFor(area,targetId,rank.order,sleepType),calculatedPower=calculateDrowsyPower(energy,score,multiplier),datasetCap=Number(curves&&curves.drowsyPowerMax)||Infinity,drowsyPower=Math.min(calculatedPower,datasetCap);
    if(!segment)return {available:false,area,rank,energy,score,sleepType,targetId,target:info,drowsyPower,spawnCount:spawnCountFor(area,drowsyPower),pokemonAppearances:0,familyAppearances:0,candy:0,dataCapped:calculatedPower>datasetCap};
    return {available:true,area,rank,energy,score,sleepType,targetId,target:{...info,pokemonId:segment.pokemonId,pokemonName:segment.pokemonName},drowsyPower,calculatedPower,spawnCount:spawnCountFor(area,drowsyPower),pokemonAppearances:interpolate(segment,'pokemonAppearances',drowsyPower),familyAppearances:interpolate(segment,'familyAppearances',drowsyPower),candy:interpolate(segment,'candy',drowsyPower),dataCapped:calculatedPower>datasetCap};
  }
  function applyTargetDayRules(rawSessions,options={}){
    let researched=Math.max(0,Math.round(Number(options.alreadyResearched)||0));
    const sessions=(rawSessions||[]).map((raw,index)=>{
      const natural=Math.max(0,Math.round(Number(raw.spawnCount)||0)),campExtra=options.goodCamp&&index===0&&natural?1:0,totalSpawns=natural+campExtra,fullRewardSpawns=Math.min(totalSpawns,Math.max(0,10-researched)),reducedRewardSpawns=Math.max(0,totalSpawns-fullRewardSpawns),campFactor=natural?totalSpawns/natural:1,fullFraction=totalSpawns?fullRewardSpawns/totalSpawns:1,reducedFraction=totalSpawns?reducedRewardSpawns/totalSpawns:0,pokemonAppearances=raw.pokemonAppearances*campFactor,familyAppearances=raw.familyAppearances*campFactor,candy=raw.candy*campFactor*fullFraction+familyAppearances*reducedFraction;
      researched+=totalSpawns;
      return {...raw,index:index+1,naturalSpawns:natural,campExtra,totalSpawns,fullRewardSpawns,reducedRewardSpawns,pokemonAppearances,familyAppearances,candy};
    });
    return {sessions,pokemonAppearances:sessions.reduce((sum,item)=>sum+item.pokemonAppearances,0),familyAppearances:sessions.reduce((sum,item)=>sum+item.familyAppearances,0),candy:sessions.reduce((sum,item)=>sum+item.candy,0),totalSpawns:sessions.reduce((sum,item)=>sum+item.totalSpawns,0)};
  }
  function evaluateTargetPlan(options={}){
    const objective=TARGET_OBJECTIVES.has(options.objective)?options.objective:'pokemon',scores=Array.isArray(options.scores)?options.scores.map(value=>clamp(Math.round(value),1,100)):[],strengths=Array.isArray(options.strengths)?options.strengths:[],raw=scores.map((score,index)=>rawTarget({area:options.area,targetId:options.targetId,energy:strengths[index]||strengths[strengths.length-1],score,multiplier:options.multiplier,sleepType:options.sleepType})),adjusted=applyTargetDayRules(raw,{goodCamp:options.goodCamp,alreadyResearched:options.alreadyResearched}),target=raw[0]&&raw[0].target||targetInfo(options.targetId,options.area);
    return {...adjusted,mode:scores.length>1?'split':'single',scores,objective,target,objectiveValue:objective==='candy'?adjusted.candy:adjusted.pokemonAppearances,available:raw.every(item=>item.available),dataCapped:raw.some(item=>item.dataCapped),sessions:adjusted.sessions.map((session,index)=>({...session,minutes:durationForScore(scores[index],index)}))};
  }
  function compareTargetSleepPlans(options={}){
    const area=areaFor(options.area),currentStrength=Math.max(0,Math.round(Number(options.currentStrength)||Number(options.bedtimeStrength)||0)),bedtimeStrength=Math.max(0,Math.round(Number(options.bedtimeStrength)||currentStrength)),sleepType=Object.hasOwn(SLEEP_TYPES,options.sleepType)?options.sleepType:'balanced',objective=TARGET_OBJECTIVES.has(options.objective)?options.objective:'pokemon',targetId=String(options.targetId||''),multiplier=Math.max(0,Number(options.multiplier)||1),goodCamp=options.goodCamp===true,info=targetInfo(targetId,area&&area.id);
    if(!area||!currentStrength||!targetId||!info.available){
      const reason=!area?'当前岛屿暂无研究曲线。':!currentStrength?'请先填写当前卡比兽能量。':!targetId?'请先选择严选目标。':`${info.definition&&info.definition.name||'该目标'}不会在当前岛屿出现。`;
      return {available:false,reason,area,currentStrength,bedtimeStrength,sleepType,objective,targetId,target:info,multiplier,goodCamp};
    }
    const base={area:area.id,targetId,sleepType,objective,multiplier,goodCamp},single=evaluateTargetPlan({...base,scores:[100],strengths:[bedtimeStrength]}),splits=[];
    for(let firstScore=18;firstScore<100;firstScore+=1)splits.push(evaluateTargetPlan({...base,scores:[firstScore,100-firstScore],strengths:[currentStrength,bedtimeStrength]}));
    splits.sort((left,right)=>right.objectiveValue-left.objectiveValue||Math.abs(left.scores[0]-50)-Math.abs(right.scores[0]-50));
    const bestSplit=splits[0],difference=(bestSplit&&bestSplit.objectiveValue||0)-single.objectiveValue,gain=single.objectiveValue>0?difference/single.objectiveValue*100:difference>0?Infinity:0,recommendation=Math.abs(difference)<=1e-9?'either':difference>0?'split':'single',label=objective==='candy'?`${info.pokemonName||info.definition.name}进化系糖果`:`${info.pokemonName||info.definition.name}出现次数`;
    return {available:true,area,currentStrength,bedtimeStrength,sleepType,objective,targetId,target:single.target||info,multiplier,goodCamp,single,bestSplit,gainPercent:gain,recommendation,reason:recommendation==='split'?`按${label}期望估算，分两段更高。`:recommendation==='single'?`按${label}期望估算，一次睡满更高。`:'两种方案的目标期望相同。'};
  }
  function rewardAtEnergy(options={}){
    return evaluatePlan({area:options.area,sleepType:options.sleepType,objective:options.objective,multiplier:options.multiplier,goodCamp:false,scores:[100],strengths:[options.energy]});
  }
  function marginalReturn(options={}){
    const energy=Math.max(0,Math.round(Number(options.energy)||0));
    if(!energy)return null;
    const nextEnergy=Math.max(energy+100000,Math.round(energy*1.1)),current=rewardAtEnergy({...options,energy}),next=rewardAtEnergy({...options,energy:nextEnergy}),energyGain=(nextEnergy/energy-1)*100,rewardGain=current.objectiveValue>0?(next.objectiveValue/current.objectiveValue-1)*100:0;
    return {energy,nextEnergy,energyGainPercent:energyGain,rewardGainPercent:rewardGain,elasticity:energyGain?rewardGain/energyGain:0,current,next};
  }
  function slowdownReference(options={}){
    const area=areaFor(options.area);
    if(!area)return null;
    const maxEnergy=Math.min(Number(options.maxEnergy)||10000000,area.ranks[area.ranks.length-1].maxEnergy||10000000),step=Math.max(25000,Math.round((Number(options.step)||50000)/25000)*25000);
    let streak=0,first=null;
    for(let energy=Math.max(100000,step);energy<=maxEnergy;energy+=step){
      const marginal=marginalReturn({...options,area:area.id,energy});
      if(marginal&&marginal.elasticity<.32){streak+=1;if(streak===1)first={...marginal,energy}}else{streak=0;first=null}
      if(streak>=4)return {...first,area};
    }
    return null;
  }
  function datasetInfo(){return curves?{datasetId:curves.datasetId,generatedAt:curves.generatedAt,algorithmVersion:curves.algorithmVersion,source:curves.source,sourcePage:curves.sourcePage}:null}

  return Object.freeze({SLEEP_TYPES,OBJECTIVES,TARGET_OBJECTIVES,AREA_ALIASES,areaFor,rankFor,spawnCountFor,segmentFor,targetDefinition,targetDefinitions,targetSegmentFor,targetInfo,interpolate,calculateDrowsyPower,rawResearch,rawTarget,applyResearchDayRules,applyTargetDayRules,durationForScore,evaluatePlan,evaluateTargetPlan,compareSleepPlans,compareTargetSleepPlans,rewardAtEnergy,marginalReturn,slowdownReference,datasetInfo});
});
