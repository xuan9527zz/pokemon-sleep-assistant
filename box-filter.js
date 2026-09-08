(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_BOX_FILTER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const FILTER_KEYS=Object.freeze(['query','boxId','eligibility','shiny','specialty','cultivationTier']);

  function normalize(filters={}){
    return {
      query:String(filters.query||'').trim().toLowerCase(),
      boxId:String(filters.boxId||''),
      eligibility:String(filters.eligibility||''),
      shiny:String(filters.shiny||''),
      specialty:String(filters.specialty||''),
      cultivationTier:String(filters.cultivationTier||'')
    };
  }

  function searchableText(mon,isBattleEligible){
    return [
      Object.values(mon||{}).join(' '),mon&&mon.boxName,
      isBattleEligible(mon)?'参与实战':'仅收藏',mon&&mon.effectiveSubs,
      mon&&mon.cultivation&&mon.cultivation.label,mon&&mon.cultivation&&mon.cultivation.reason,
      mon&&mon.cultivation&&mon.cultivation.directSuperior&&mon.cultivation.directSuperior.name,
      mon&&mon.cultivation&&mon.cultivation.exception
    ].join(' ').toLowerCase();
  }

  function matches(mon,filters={},context={}){
    if(!mon)return false;
    const value=normalize(filters),isBattleEligible=typeof context.isBattleEligible==='function'?context.isBattleEligible:item=>item&&item.battleEligible!==false;
    const exact=value.query.match(/^#(\d+)$/),eligible=isBattleEligible(mon);
    const conditions=[
      exact?String(mon.id)===exact[1]:!value.query||searchableText(mon,isBattleEligible).includes(value.query),
      !value.boxId||String(mon.boxId)===value.boxId,
      !value.eligibility||(value.eligibility==='battle'?eligible:!eligible),
      !value.shiny||String(mon.shiny)===value.shiny,
      !value.specialty||String(mon.specialty)===value.specialty,
      !value.cultivationTier||String(mon.cultivation&&mon.cultivation.tier||'')===value.cultivationTier
    ];
    return conditions.every(Boolean);
  }

  function filter(records,filters,context){
    return (Array.isArray(records)?records:[]).filter(mon=>matches(mon,filters,context));
  }

  function activeCount(filters={}){
    const value=normalize(filters);
    return FILTER_KEYS.reduce((count,key)=>count+(value[key]?1:0),0);
  }

  function optionCounts(records,filters,key,values,context){
    if(!FILTER_KEYS.includes(key))return {};
    const base=normalize(filters),result={};
    (Array.isArray(values)?values:[]).forEach(value=>{result[String(value)]=filter(records,{...base,[key]:String(value)},context).length});
    return result;
  }

  return Object.freeze({FILTER_KEYS,normalize,searchableText,matches,filter,activeCount,optionCounts});
});
