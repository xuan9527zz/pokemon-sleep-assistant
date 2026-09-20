(function(root,factory){
  'use strict';
  const core=typeof module==='object'&&module.exports
    ?require('./skills/pokemon-sleep-scoring/scripts/scoring-core.js')
    :root.POKEMON_SLEEP_SCORING_CORE;
  const catalog=typeof module==='object'&&module.exports?require('./pokemon-catalog.generated.js'):root.POKEMON_SLEEP_CATALOG;
  const strategy=typeof module==='object'&&module.exports?require('./pokemon-strategy.js'):root.POKEMON_SLEEP_STRATEGY;
  const allRounder=typeof module==='object'&&module.exports?require('./all-rounder-rules.js'):root.POKEMON_SLEEP_ALL_ROUNDER_RULES;
  const tiers=typeof module==='object'&&module.exports?require('./skills/pokemon-sleep-scoring/scripts/species-tiers.js'):root.POKEMON_SLEEP_SPECIES_TIERS;
  const api=factory(core,catalog,strategy,allRounder,tiers);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_DYNAMIC_SCORING=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(core,catalog,strategy,allRounder,tiers){
  'use strict';

  const LEGACY_SOURCE_IDS=Object.freeze({'皮卡丘（巫师帽）':'9001-1','皮卡丘（圣诞）':'9002','伊布（圣诞）':'9004','乌波（城都）':'194','乌波（帕底亚）':'7054','海豹球（节日）':'9006'});
  const byId=new Map((catalog&&catalog.pokemon||[]).map(record=>[String(record.id),record]));
  const byName=new Map();
  (catalog&&catalog.pokemon||[]).forEach(record=>{
    [record.name,record.sourceNameZh,record.nameEn].filter(Boolean).forEach(name=>{
      if(!byName.has(String(name).toLowerCase()))byName.set(String(name).toLowerCase(),record);
    });
  });

  function recordForPokemon(mon){
    if(mon&&mon.speciesId&&byId.has(String(mon.speciesId)))return byId.get(String(mon.speciesId));
    if(mon&&LEGACY_SOURCE_IDS[mon.name]&&byId.has(LEGACY_SOURCE_IDS[mon.name]))return byId.get(LEGACY_SOURCE_IDS[mon.name]);
    return byName.get(String(mon&&mon.name||'').toLowerCase())||null;
  }

  function targetForPokemon(mon){
    const explicit=mon&&mon.finalFormId&&byId.get(String(mon.finalFormId));
    if(explicit)return explicit;
    const existing=catalog&&catalog.existingNameTargets&&catalog.existingNameTargets[mon&&mon.name];
    if(existing&&byId.has(String(existing.id)))return byId.get(String(existing.id));
    const source=recordForPokemon(mon);
    return source&&byId.get(String(source.defaultFinalId||source.id))||null;
  }

  function scorePokemon(mon){
    const target=targetForPokemon(mon);
    if(!target)return {id:String(mon&&mon.id||''),name:String(mon&&mon.name||''),finalScore:null,status:'missing-species-catalog'};
    const catalogRole=target.specialty,mainSkillId=Number(mon&&mon.mainSkillId||target.mainSkill&&target.mainSkill.id),berryBurst=catalogRole==='skill'&&core.berryBurstSkillIds&&core.berryBurstSkillIds.has(mainSkillId),role=berryBurst?'berry':catalogRole,evaluationRole=berryBurst?'berry-burst':catalogRole,base={id:String(mon&&mon.id||''),name:String(mon&&mon.name||target.name),specialty:role,catalogSpecialty:catalogRole,evaluationRole,berryBurst,finalFormId:target.id,finalFormNameZh:target.name,routeReason:null,routeCandidates:null};
    const selectedAllRounderSkillId=role==='all'?(allRounder&&allRounder.isMew(mon)?allRounder.selectedId(mon):'nightmare'):null;
    const tier=tiers.entryFor({...base,selectedAllRounderSkillId}),individual=core.individualScore(mon,evaluationRole,target,{berryBurst}),finalScore=individual.score;
    const selectedOption=role==='all'&&allRounder&&allRounder.BY_ID?allRounder.BY_ID[selectedAllRounderSkillId]:null;
    return {...base,speciesTier:tier.tier,speciesTierCategory:tier.category,speciesTierListed:tier.listed,speciesTierSource:tier.source,strategy:strategy&&strategy.SPECIES_ROLES[target.id]||null,selectedAllRounderSkillId,selectedAllRounderSkillNameZh:catalogRole==='all'?(selectedOption&&selectedOption.label||'梦魇'):null,individualScore:individual.score,individualGrade:individual.grade,individual,finalScore,scoreModel:'species-tier-plus-blank-output-multiplier',rank:null,status:individual.provisional?'scored-with-provisional-components':'scored-confirmed-components'};
  }

  function speciesSearch(query){
    const normalized=String(query||'').trim().toLowerCase(),rows=catalog&&catalog.pokemon||[];
    if(!normalized)return rows;
    return rows.filter(record=>[record.id,record.name,record.sourceNameZh,record.nameEn].join(' ').toLowerCase().includes(normalized));
  }

  return Object.freeze({...core,recordForPokemon,targetForPokemon,scorePokemon,speciesSearch,strategy,tiers});
});
