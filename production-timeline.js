(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_PRODUCTION_TIMELINE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const STEP_MINUTES=10;
  const ENERGY_STAGES=Object.freeze([
    Object.freeze({key:'81-150',min:81,max:150,intervalMultiplier:.45,helpFactor:1/.45,label:'81–150'}),
    Object.freeze({key:'61-80',min:61,max:80,intervalMultiplier:.52,helpFactor:1/.52,label:'61–80'}),
    Object.freeze({key:'41-60',min:41,max:60,intervalMultiplier:.58,helpFactor:1/.58,label:'41–60'}),
    Object.freeze({key:'1-40',min:1,max:40,intervalMultiplier:.66,helpFactor:1/.66,label:'1–40'}),
    Object.freeze({key:'0',min:0,max:0,intervalMultiplier:1,helpFactor:1,label:'0'})
  ]);
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  const stageFor=energy=>ENERGY_STAGES.find(stage=>Number(energy)>=stage.min)||ENERGY_STAGES[ENERGY_STAGES.length-1];
  const mealRecovery=energy=>energy>=81?1:energy>=71?2:energy>=61?3:energy>=51?4:energy>=41?5:energy>=31?6:energy>=21?7:energy>=11?8:9;
  const natureRecoveryMultiplier=nature=>String(nature||'').includes('活力恢复↑')?1.2:String(nature||'').includes('活力恢复↓')?.88:1;
  const skillStorageCapacity=specialty=>['skill','all'].includes(String(specialty||''))?2:1;

  function addPoissonArrivals(probabilities,lambda,capacity){
    const next=Array.from({length:capacity+1},()=>0),rate=Math.max(0,Number(lambda)||0),p0=Math.exp(-rate),p1=rate*p0;
    probabilities.forEach((probability,stored)=>{
      if(!(probability>0))return;
      if(stored>=capacity){next[capacity]+=probability;return}
      next[stored]+=probability*p0;
      if(stored+1<capacity){next[stored+1]+=probability*p1;next[capacity]+=probability*Math.max(0,1-p0-p1)}
      else next[capacity]+=probability*(1-p0);
    });
    return next;
  }

  function recoveryVector(effect,userIndex,count){
    const values=Array.from({length:count},()=>0);
    if(!effect||!effect.supported||count<1)return values;
    if(Array.isArray(effect.recoveryByIndex)&&effect.recoveryByIndex.length===count)return effect.recoveryByIndex.map(Number);
    const total=Math.max(0,Number(effect.teamRecoveryPerUse)||0),self=Math.min(total,Math.max(0,Number(effect.selfRecoveryPerUse)||0));
    values[userIndex]=self;
    const remaining=Math.max(0,total-self),others=Math.max(1,count-1);
    values.forEach((_value,index)=>{if(index!==userIndex)values[index]=remaining/others});
    return values;
  }

  function normalizeHours(values,durationHours){
    return [...new Set((Array.isArray(values)?values:[]).map(Number).filter(value=>value>0&&value<durationHours).map(value=>Math.round(value*6)/6))].sort((a,b)=>a-b);
  }

  function simulate(members,options={}){
    const durationHours=clamp(options.durationHours||24,.5,168),durationMinutes=Math.round(durationHours*60),stepMinutes=STEP_MINUTES,steps=Math.ceil(durationMinutes/stepMinutes),collectionHours=clamp(options.collectionHours||4,.5,24),collectionMinutes=Math.max(stepMinutes,Math.round(collectionHours*60/stepMinutes)*stepMinutes),startEnergy=clamp(options.startEnergy===undefined?100:options.startEnergy,0,150),sleepScore=clamp(options.sleepScore===undefined?100:options.sleepScore,0,100),collectAtEnd=options.collectAtEnd!==false,collectBeforeSwap=options.collectBeforeSwap!==false,mealHours=normalizeHours(options.mealHours||[4,10,16],24),swapHours=normalizeHours(options.swapHours||[],durationHours),recoveryBonusCount=(members||[]).filter(member=>String(member.mon&&member.mon.effectiveSubs||member.mon&&member.mon.subs||'').split('；').includes('活力恢复奖励')).length;
    const rows=(members||[]).map((member,index)=>({
      index,energy:startEnergy,helps:0,normalHelps:0,sneakyHelps:0,triggers:0,lostTriggers:0,carriedItems:0,
      stageMinutes:Object.fromEntries(ENERGY_STAGES.map(stage=>[stage.key,0])),
      capacity:skillStorageCapacity(member.mon&&member.mon.specialty),storage:[1,0,0].slice(0,skillStorageCapacity(member.mon&&member.mon.specialty)+1),
      recoveryMultiplier:natureRecoveryMultiplier(member.mon&&member.mon.nature),endingEnergy:startEnergy
    }));
    const collectionMoments=[],swapMoments=[];
    for(let minute=collectionMinutes;minute<durationMinutes;minute+=collectionMinutes)collectionMoments.push(minute);
    swapHours.forEach(hour=>swapMoments.push(Math.round(hour*60/stepMinutes)*stepMinutes));
    function collect(minute,kind){
      const collected=rows.map(row=>row.storage.reduce((total,probability,stored)=>total+stored*probability,0));
      rows.forEach((row,index)=>{row.triggers+=collected[index];row.storage=Array.from({length:row.capacity+1},(_value,slot)=>slot===0?1:0)});
      rows.forEach((_row,userIndex)=>{
        const effect=members[userIndex]&&members[userIndex].skillEffect,recovery=recoveryVector(effect,userIndex,rows.length),uses=collected[userIndex];
        if(!(uses>0))return;
        rows.forEach((target,targetIndex)=>{target.energy=clamp(target.energy+recovery[targetIndex]*uses*target.recoveryMultiplier,0,150)});
      });
      return {minute,kind,collected:collected.reduce((total,value)=>total+value,0)};
    }
    function clearForSwap(minute){
      if(collectBeforeSwap)return collect(minute,'pre-swap');
      let lost=0;rows.forEach(row=>{const pending=row.storage.reduce((total,probability,stored)=>total+stored*probability,0);row.lostTriggers+=pending;lost+=pending;row.storage=Array.from({length:row.capacity+1},(_value,slot)=>slot===0?1:0);row.carriedItems=0});return {minute,kind:'swap-loss',lost};
    }
    const events=[];
    for(let step=0;step<steps;step+=1){
      const start=step*stepMinutes,end=Math.min(durationMinutes,start+stepMinutes),minutes=end-start;
      rows.forEach((row,index)=>{
        const member=members[index],stage=stageFor(row.energy),neutralIntervalSec=Math.max(1,Number(member.neutralIntervalSec)||Number(member.effectiveIntervalSec)||3600),helps=minutes*60/neutralIntervalSec*stage.helpFactor,space=Math.max(0,(Number(member.carry)||0)-row.carriedItems),itemsPerHelp=Math.max(.0001,Number(member.expectedItemsPerHelp)||1),normal=Math.min(helps,space/itemsPerHelp),sneaky=Math.max(0,helps-normal),triggerLambda=normal*Math.max(0,Number(member.skillProbability&&member.skillProbability.effective)||0);
        row.stageMinutes[stage.key]+=minutes;row.helps+=helps;row.normalHelps+=normal;row.sneakyHelps+=sneaky;row.carriedItems+=normal*itemsPerHelp;row.storage=addPoissonArrivals(row.storage,triggerLambda,row.capacity);
      });
      const dayMinute=end%1440;
      if(mealHours.some(hour=>Math.round(hour*60)===dayMinute))rows.forEach(row=>{row.energy=clamp(row.energy+mealRecovery(row.energy),0,150)});
      if(collectionMoments.includes(end)){events.push(collect(end,'click'));rows.forEach(row=>{row.carriedItems=0})}
      if(swapMoments.includes(end)){events.push(clearForSwap(end));rows.forEach(row=>{row.carriedItems=0})}
      rows.forEach(row=>{row.energy=Math.max(0,row.energy-minutes/10)});
      if(end<durationMinutes&&end%1440===0)rows.forEach(row=>{const cap=String(members[row.index].mon&&members[row.index].mon.effectiveSubs||members[row.index].mon&&members[row.index].mon.subs||'').split('；').includes('活力恢复奖励')?105:100;row.energy=Math.min(cap,row.energy+sleepScore*row.recoveryMultiplier*(1+.14*recoveryBonusCount));});
    }
    if(collectAtEnd){events.push(collect(durationMinutes,'final'));rows.forEach(row=>{row.carriedItems=0})}
    rows.forEach(row=>{row.endingEnergy=row.energy;row.averageHelpFactor=row.stageMinutes?Object.entries(row.stageMinutes).reduce((total,[key,minutes])=>total+minutes*(ENERGY_STAGES.find(stage=>stage.key===key)?.helpFactor||1),0)/durationMinutes:1});
    return {durationHours,collectionHours,startEnergy,sleepScore,collectBeforeSwap,swapHours,events,members:rows,totals:{helps:rows.reduce((sum,row)=>sum+row.helps,0),normalHelps:rows.reduce((sum,row)=>sum+row.normalHelps,0),sneakyHelps:rows.reduce((sum,row)=>sum+row.sneakyHelps,0),triggers:rows.reduce((sum,row)=>sum+row.triggers,0),lostTriggers:rows.reduce((sum,row)=>sum+row.lostTriggers,0)}};
  }

  return Object.freeze({STEP_MINUTES,ENERGY_STAGES,stageFor,mealRecovery,natureRecoveryMultiplier,skillStorageCapacity,addPoissonArrivals,recoveryVector,simulate});
});
