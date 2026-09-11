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
    areaBonusPct:85,
    permanentPot:81,
    cookingPowerStored:200,
    ingredientPocket:800,
    pokemonBox:1400,
    sleepStyleGoal:510,
    dailySleepScore:100,
    incenseSlots:3
  });
  const SNAPSHOT=Object.freeze({
    gameVersion:'3.8.0',
    verifiedAt:'2026-09-11',
    reviewAfter:'2026-09-25',
    sources:Object.freeze({
      official:'https://www.pokemonsleep.net/en/news/343431333739343830363430393436313737/',
      history:'https://wiki.pokesleep.com/en/history',
      pot:'https://wiki.pokesleep.com/en/pot'
    })
  });
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  function freshness(now=new Date()){
    const current=now instanceof Date?now:new Date(now),verified=new Date(`${SNAPSHOT.verifiedAt}T00:00:00Z`),review=new Date(`${SNAPSHOT.reviewAfter}T00:00:00Z`),ageDays=Math.max(0,Math.floor((current-verified)/86400000));
    return {gameVersion:SNAPSHOT.gameVersion,verifiedAt:SNAPSHOT.verifiedAt,reviewAfter:SNAPSHOT.reviewAfter,ageDays,stale:Number.isFinite(current.getTime())&&current>review};
  }
  function finalPotCapacity(options={}){
    const base=clamp(Math.round(options.baseCapacity||LIMITS.permanentPot),1,LIMITS.permanentPot),eventMultiplier=[1,1.5,2].includes(Number(options.eventMultiplier))?Number(options.eventMultiplier):1,weekend=options.weekend===true?2:1,skill=clamp(Math.round(options.skillBonus)||0,0,LIMITS.cookingPowerStored),camp=options.goodCamp===true?1.5:1;
    return Math.round((Math.round(base*eventMultiplier)*weekend+skill)*camp);
  }
  function requiredCookingPower(targetCapacity,options={}){
    const target=Math.max(1,Math.round(Number(targetCapacity)||1));
    for(let skill=0;skill<=LIMITS.cookingPowerStored;skill++)if(finalPotCapacity({...options,skillBonus:skill})>=target)return skill;
    return null;
  }

  return Object.freeze({LIMITS,SNAPSHOT,clamp,freshness,finalPotCapacity,requiredCookingPower});
});
