(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_SNORLAX_ENERGY=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  // Kept in sync with the executable mechanics in species-scores.js. The
  // cross-module test fails if either source changes without the other.
  const BERRY_BASE_STRENGTH=Object.freeze({
    1:28,2:27,3:31,4:25,5:30,6:32,7:27,8:32,9:29,
    10:24,11:26,12:24,13:30,14:26,15:35,16:31,17:33,18:26
  });
  const ENERGY_CHARGE_S_FIXED=Object.freeze({1:400,2:569,3:785,4:1083,5:1496,6:2066,7:3212});
  const ENERGY_CHARGE_S_RANDOM=Object.freeze({
    1:Object.freeze([200,800]),2:Object.freeze([285,1138]),3:Object.freeze([393,1570]),
    4:Object.freeze([542,2166]),5:Object.freeze([748,2992]),6:Object.freeze([1033,4132]),
    7:Object.freeze([1606,6424])
  });
  const ENERGY_CHARGE_M=Object.freeze({1:880,2:1251,3:1726,4:2383,5:3290,6:4546,7:6858});
  const STOCKPILE=Object.freeze({
    stockpileProbability:.75,spitUpProbability:.25,maximumStockpiles:10,
    energyByLevel:Object.freeze({
      1:Object.freeze([600,1020,1500,2040,2640,3300,4020,4920,6480,8880,12120]),
      2:Object.freeze([853,1450,2132,2900,3753,4691,5715,6995,9213,12625,17231]),
      3:Object.freeze([1177,2001,2943,4002,5179,6474,7886,9652,12712,17420,23776]),
      4:Object.freeze([1625,2763,4063,5526,7151,8939,10889,13327,17552,24052,32827]),
      5:Object.freeze([2243,3813,5607,7626,9869,12336,15028,18393,24225,33197,45309]),
      6:Object.freeze([3099,5268,7747,10536,13635,17044,20763,25412,33469,45865,62600]),
      7:Object.freeze([4502,7653,11255,15307,19809,24761,30163,36916,48621,66629,90940])
    })
  });
  const NIGHTMARE=Object.freeze({1:2640,2:3753,3:5178,4:7149,5:9870,6:13638,7:18515});
  const AURA_SPHERE=Object.freeze({1:200,2:285,3:393,4:542,5:748,6:1033,7:1501,8:2042});
  // Recipe level bonus percentages for Lv.1–70. The level bonus is rounded
  // against the recipe's Lv.1 strength before the area bonus is applied.
  const RECIPE_LEVEL_BONUS_PCT=Object.freeze([
    0,0,2,4,6,8,9,11,13,16,18,19,21,23,24,26,28,30,31,33,35,37,40,42,45,47,50,52,55,58,61,64,67,70,74,77,
    81,84,88,92,96,100,104,108,113,117,122,127,132,137,142,148,153,159,165,171,177,183,190,197,203,209,215,221,
    227,234,239,243,248,252,258
  ]);

  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));

  function berryStrengthAtLevel(berryId,level=1){
    const base=BERRY_BASE_STRENGTH[Number(berryId)];
    if(!(base>0))return null;
    const safe=clamp(Math.round(level),1,100);
    return Math.round(Math.max(base+safe-1,base*(1.025**(safe-1))));
  }

  function percentageMultiplier(percent){return 1+clamp(percent,0,200)/100}

  function applyPercentageBonus(value,percent,rounding='round'){
    const result=Math.max(0,Number(value)||0)*percentageMultiplier(percent);
    if(rounding==='ceil')return Math.ceil(result);
    if(rounding==='floor')return Math.floor(result);
    return Math.round(result);
  }

  function normalizeRecipeLevel(level){return clamp(Math.round(Number(level)||1),1,70)}

  function recipeLevelBonusPct(level){return RECIPE_LEVEL_BONUS_PCT[normalizeRecipeLevel(level)]}

  function recipeLevelFromBonusPct(percent){
    const target=clamp(percent,0,258);
    let best=1,distance=Infinity;
    for(let level=1;level<=70;level++){
      const next=Math.abs(RECIPE_LEVEL_BONUS_PCT[level]-target);
      if(next<distance){best=level;distance=next}
    }
    return best;
  }

  function recipeStrengthAtLevel(baseEnergy,level=1){
    const base=Math.max(0,Number(baseEnergy)||0);
    return base+Math.round(base*recipeLevelBonusPct(level)/100);
  }

  function recipeFinalEnergy({baseEnergy=0,level=1,islandBonusPct=0,extraIngredientEnergy=0,eventMultiplier=1}={}){
    const recipeStrength=recipeStrengthAtLevel(baseEnergy,level),extras=Math.max(0,Number(extraIngredientEnergy)||0),event=Math.max(0,Number(eventMultiplier)||0);
    return Math.floor((recipeStrength+extras)*percentageMultiplier(islandBonusPct)*event);
  }

  function expectedRandomEnergy(range,bonusPct){
    if(!range)return null;
    const count=151,denominator=count-1;
    let total=0;
    for(let rank=0;rank<count;rank++){
      const base=range[0]+(range[1]-range[0])*rank/denominator;
      total+=Math.ceil(base*percentageMultiplier(bonusPct));
    }
    return total/count;
  }

  function expectedStockpileEnergy(level,bonusPct){
    const values=STOCKPILE.energyByLevel[level];
    if(!values)return null;
    let energy=0,triggers=0;
    values.forEach((base,stockpiles)=>{
      const probability=stockpiles<STOCKPILE.maximumStockpiles
        ?STOCKPILE.stockpileProbability**stockpiles*STOCKPILE.spitUpProbability
        :STOCKPILE.stockpileProbability**STOCKPILE.maximumStockpiles;
      energy+=probability*Math.ceil(base*percentageMultiplier(bonusPct));
      triggers+=probability*(stockpiles+1);
    });
    return energy/triggers;
  }

  function directEnergyPerUse(mainSkill,mainSkillId,level=1,bonusPct=0){
    const label=String(mainSkill||''),id=Number(mainSkillId),requested=Math.max(1,Math.round(Number(level)||1));
    let kind=null,table=null,maxLevel=7,baseEnergy=null,actualEnergy=null;
    if(id===16||label.includes('蓄力')){
      kind='stockpile';maxLevel=7;const safe=Math.min(requested,maxLevel);
      baseEnergy=expectedStockpileEnergy(safe,0);actualEnergy=expectedStockpileEnergy(safe,bonusPct);
    }else if(id===23||label.includes('噩梦')){
      kind='nightmare';table=NIGHTMARE;maxLevel=7;
    }else if(id===36||label.includes('波导弹')){
      kind='aura-sphere';table=AURA_SPHERE;maxLevel=8;
    }else if(id===5||label.includes('能量填充S（随机）')){
      kind='energy-s-random';maxLevel=7;const safe=Math.min(requested,maxLevel);
      baseEnergy=expectedRandomEnergy(ENERGY_CHARGE_S_RANDOM[safe],0);
      actualEnergy=expectedRandomEnergy(ENERGY_CHARGE_S_RANDOM[safe],bonusPct);
    }else if(id===2||/能量填充M/.test(label)){
      kind='energy-m';table=ENERGY_CHARGE_M;maxLevel=7;
    }else if(id===1||(/能量填充S/.test(label)&&!label.includes('蓄力'))){
      kind='energy-s-fixed';table=ENERGY_CHARGE_S_FIXED;maxLevel=7;
    }
    if(!kind)return {supported:false,kind:null,level:requested,baseEnergy:0,actualEnergy:0};
    const safeLevel=Math.min(requested,maxLevel);
    if(table){baseEnergy=table[safeLevel];actualEnergy=applyPercentageBonus(baseEnergy,bonusPct,'ceil')}
    return {supported:true,kind,level:safeLevel,baseEnergy,actualEnergy};
  }

  return Object.freeze({
    BERRY_BASE_STRENGTH,ENERGY_CHARGE_S_FIXED,ENERGY_CHARGE_S_RANDOM,ENERGY_CHARGE_M,STOCKPILE,NIGHTMARE,AURA_SPHERE,RECIPE_LEVEL_BONUS_PCT,
    berryStrengthAtLevel,percentageMultiplier,applyPercentageBonus,normalizeRecipeLevel,recipeLevelBonusPct,recipeLevelFromBonusPct,recipeStrengthAtLevel,recipeFinalEnergy,expectedRandomEnergy,expectedStockpileEnergy,directEnergyPerUse
  });
});
