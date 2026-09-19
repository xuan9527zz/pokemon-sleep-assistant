(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_BOX_FILTER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const FILTER_KEYS=Object.freeze(['query','boxId','eligibility','shiny','speciesTier','specialty','cultivationTier']);

  function values(input){
    const source=Array.isArray(input)?input:String(input||'').split(',');
    return [...new Set(source.map(value=>String(value||'').trim()).filter(Boolean))];
  }

  function normalize(filters={}){
    return {
      query:String(filters.query||'').trim().toLowerCase(),
      boxId:values(filters.boxId),
      eligibility:values(filters.eligibility),
      shiny:values(filters.shiny),
      speciesTier:values(filters.speciesTier),
      specialty:values(filters.specialty),
      cultivationTier:values(filters.cultivationTier)
    };
  }

  function searchableText(mon,isBattleEligible){
    return [
      mon&&mon.id,mon&&mon.pokedexId,mon&&mon.name,mon&&mon.nickname,mon&&mon.customNumber,
      mon&&mon.boxName,mon&&mon.speciesTier&&`${mon.speciesTier}级`,mon&&mon.specialtyText,mon&&mon.ingredients,mon&&mon.main,mon&&mon.subs,
      mon&&mon.nature,mon&&mon.usageLabel,isBattleEligible(mon)?'参与实战':'暂不实战',mon&&mon.effectiveSubs,
      mon&&mon.cultivation&&mon.cultivation.label,mon&&mon.cultivation&&mon.cultivation.reason,
      mon&&mon.cultivation&&mon.cultivation.directSuperior&&mon.cultivation.directSuperior.name,
      mon&&mon.cultivation&&mon.cultivation.exception
    ].join(' ').toLowerCase();
  }

  function usageStatus(mon,isBattleEligible){
    const battle=isBattleEligible(mon),collection=Boolean(mon&&mon.collectionIntent);
    return battle&&collection?'both':battle?'battle-only':collection?'collection-only':'inactive';
  }

  function eligibilityMatches(selected,status){
    return !selected.length||selected.some(value=>value===status||(value==='battle'&&['battle-only','both'].includes(status))||(value==='collection'&&['collection-only','both'].includes(status)));
  }

  function includes(selected,value){return !selected.length||selected.includes(String(value||''))}

  function pokedexNumber(mon){
    const value=Number(mon&&mon.pokedexId||mon&&mon.speciesId);
    return Number.isFinite(value)&&value>0?value:Number.MAX_SAFE_INTEGER;
  }

  function comparePokedex(left,right){return pokedexNumber(left)-pokedexNumber(right)||Number(left&&left.id)-Number(right&&right.id)||String(left&&left.id||'').localeCompare(String(right&&right.id||''),'zh-CN',{numeric:true})}

  function matches(mon,filters={},context={}){
    if(!mon)return false;
    const value=normalize(filters),isBattleEligible=typeof context.isBattleEligible==='function'?context.isBattleEligible:item=>item&&item.battleEligible!==false;
    const exact=value.query.match(/^#(\d+)$/),recordExact=value.query.match(/^个体\s*#?(\d+)$/),status=typeof context.usageStatus==='function'?context.usageStatus(mon):usageStatus(mon,isBattleEligible);
    const conditions=[
      exact?String(pokedexNumber(mon))===exact[1]:recordExact?String(mon.id)===recordExact[1]:!value.query||searchableText(mon,isBattleEligible).includes(value.query),
      includes(value.boxId,mon.boxId),
      eligibilityMatches(value.eligibility,status),
      includes(value.shiny,mon.shiny),
      includes(value.speciesTier,mon.speciesTier),
      includes(value.specialty,mon.specialty),
      includes(value.cultivationTier,mon.cultivation&&mon.cultivation.tier)
    ];
    return conditions.every(Boolean);
  }

  function filter(records,filters,context){
    return (Array.isArray(records)?records:[]).filter(mon=>matches(mon,filters,context));
  }

  function activeCount(filters={}){
    const value=normalize(filters);
    return (value.query?1:0)+FILTER_KEYS.filter(key=>key!=='query').reduce((count,key)=>count+value[key].length,0);
  }

  function activeGroupCount(filters={}){
    const value=normalize(filters);
    return FILTER_KEYS.reduce((count,key)=>count+(key==='query'?Boolean(value.query):value[key].length>0?1:0),0);
  }

  function optionCounts(records,filters,key,values,context){
    if(!FILTER_KEYS.includes(key))return {};
    const base=normalize(filters),result={};
    (Array.isArray(values)?values:[]).forEach(value=>{result[String(value)]=filter(records,{...base,[key]:[String(value)]},context).length});
    return result;
  }

  return Object.freeze({FILTER_KEYS,normalize,searchableText,usageStatus,pokedexNumber,comparePokedex,matches,filter,activeCount,activeGroupCount,optionCounts});
});
