(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_GAME_RULES=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const LIMITS=Object.freeze({
    helperLevel:70,
    recipeLevel:70,
    researchRank:70,
    areaBonusPct:95,
    permanentPot:87,
    cookingPowerStored:200,
    ingredientPocket:800,
    pokemonBox:1400,
    sleepStyleGoal:570,
    dailySleepScore:100,
    incenseSlots:3
  });
  const SNAPSHOT=Object.freeze({
    gameVersion:'3.9.1',
    verifiedAt:'2026-11-16',
    reviewAfter:'2026-12-01',
    sources:Object.freeze({
      official:'https://www.pokemonsleep.net/zh/news/343537323732393732323130363031393838/',
      history:'https://wiki.pokesleep.com/ja/history',
      pot:'https://www.serebii.net/pokemonsleep/dishes.shtml'
    })
  });
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  function freshness(now=new Date()){
    const current=now instanceof Date?now:new Date(now),verified=new Date(`${SNAPSHOT.verifiedAt}T00:00:00Z`),review=new Date(`${SNAPSHOT.reviewAfter}T00:00:00Z`),ageDays=Math.max(0,Math.floor((current-verified)/86400000));
    return {gameVersion:SNAPSHOT.gameVersion,verifiedAt:SNAPSHOT.verifiedAt,reviewAfter:SNAPSHOT.reviewAfter,ageDays,stale:Number.isFinite(current.getTime())&&current>review};
  }
  function finalPotCapacity(options={}){
    const base=clamp(Math.round(options.baseCapacity||LIMITS.permanentPot),1,LIMITS.permanentPot),eventFlatBonus=clamp(Math.round(options.eventFlatBonus)||0,0,200),eventMultiplier=[1,1.5,2].includes(Number(options.eventMultiplier))?Number(options.eventMultiplier):1,weekend=options.weekend===true?2:1,skill=clamp(Math.round(options.skillBonus)||0,0,LIMITS.cookingPowerStored),camp=options.goodCamp===true?1.5:1;
    return Math.round((Math.round((base+eventFlatBonus)*eventMultiplier)*weekend+skill)*camp);
  }
  function requiredCookingPower(targetCapacity,options={}){
    const target=Math.max(1,Math.round(Number(targetCapacity)||1));
    for(let skill=0;skill<=LIMITS.cookingPowerStored;skill++)if(finalPotCapacity({...options,skillBonus:skill})>=target)return skill;
    return null;
  }

  return Object.freeze({LIMITS,SNAPSHOT,clamp,freshness,finalPotCapacity,requiredCookingPower});
});
