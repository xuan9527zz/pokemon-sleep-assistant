(function(root,factory){
  'use strict';
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_DATA=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';

  const POKEMON_KEY='pokemon-sleep-user-pokemon-v1';
  const RECYCLE_KEY='pokemon-sleep-recycle-bin-v1';
  const META_KEY='pokemon-sleep-data-meta-v1';
  const BOX_KEY='pokemon-sleep-box-management-v1';
  const LEVEL_KEY='pokemon-sleep-level-overrides-v1';
  const LEVEL_HISTORY_KEY='pokemon-sleep-level-history-v1';
  const CURRENT_TEAM_KEY='pokemon-sleep-current-team-v1';
  const SAVED_TEAMS_KEY='pokemon-sleep-saved-teams-v1';
  const RECYCLE_DAYS=30;
  const CANONICAL_FIELDS=Object.freeze(['id','recordId','speciesId','finalFormId','name','sp','lv','shiny','ingredients','interval','inv','main','subs','nature','priority','note','createdAt','updatedAt']);

  function storage(){try{return root&&root.localStorage||null}catch(_error){return null}}
  function readJson(key,fallback,target=storage()){
    try{const raw=target&&target.getItem(key);return raw?JSON.parse(raw):fallback}catch(_error){return fallback}
  }
  function writeJson(key,value,target=storage()){
    try{target.setItem(key,JSON.stringify(value));return true}catch(_error){return false}
  }
  function uid(){
    if(root&&root.crypto&&typeof root.crypto.randomUUID==='function')return root.crypto.randomUUID();
    return `pokemon-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,10)}`;
  }
  function now(){return new Date().toISOString()}
  function clone(value){return JSON.parse(JSON.stringify(value))}
  function normalizeId(value){return String(value==null?'':value).trim()}
  function normalizeRecord(value,index=0){
    const source=value&&typeof value==='object'?value:{},id=normalizeId(source.id||index+1),createdAt=String(source.createdAt||'');
    return {
      id,
      recordId:String(source.recordId||`legacy-${id}`),
      speciesId:normalizeId(source.speciesId),
      finalFormId:normalizeId(source.finalFormId),
      name:String(source.name||''),
      sp:String(source.sp||''),
      lv:String(source.lv||source.level||1),
      shiny:source.shiny==='是'||source.shiny===true?'是':'否',
      ingredients:String(source.ingredients||''),
      interval:String(source.interval||''),
      inv:String(source.inv||source.carry||''),
      main:String(source.main||source.mainSkill||''),
      subs:String(source.subs||source.subskills||''),
      nature:String(source.nature||'认真'),
      priority:String(source.priority||'按需求保留'),
      note:String(source.note||''),
      createdAt:createdAt||now(),
      updatedAt:String(source.updatedAt||createdAt||now())
    };
  }
  function canonicalRecord(value){
    const normalized=normalizeRecord(value),result={};
    CANONICAL_FIELDS.forEach(key=>{result[key]=normalized[key]});
    return result;
  }
  function normalizePokemon(value){
    if(!Array.isArray(value))return [];
    const seenIds=new Set(),seenRecords=new Set();
    return value.map(normalizeRecord).filter(record=>{
      if(!record.id||!record.name||seenIds.has(record.id)||seenRecords.has(record.recordId))return false;
      seenIds.add(record.id);seenRecords.add(record.recordId);return true;
    });
  }
  function normalizeRecycle(value){
    if(!Array.isArray(value))return [];
    return value.map(item=>{
      const record=canonicalRecord(item&&item.pokemon||item),deletedAt=String(item&&item.deletedAt||now());
      const fallbackExpiry=new Date(new Date(deletedAt).getTime()+RECYCLE_DAYS*86400000).toISOString();
      return {pokemon:record,deletedAt,expiresAt:String(item&&item.expiresAt||fallbackExpiry)};
    }).filter(item=>item.pokemon.id&&item.pokemon.name);
  }
  function normalizeMeta(value,pokemon,recycle){
    const source=value&&typeof value==='object'?value:{},ids=[...pokemon,...recycle.map(item=>item.pokemon)].map(item=>Number(item.id)).filter(Number.isFinite),minimum=(ids.length?Math.max(...ids):0)+1,next=Math.max(minimum,Math.round(Number(source.nextDisplayId)||minimum));
    return {version:1,nextDisplayId:next,updatedAt:String(source.updatedAt||now())};
  }
  function emit(source,detail={}){
    if(!root||typeof root.dispatchEvent!=='function'||typeof root.CustomEvent!=='function')return;
    root.dispatchEvent(new root.CustomEvent('pokemon-sleep:local-change',{detail:{source,...detail}}));
  }
  function load(seedPokemon,target=storage()){
    let hasStored=false;try{hasStored=Boolean(target&&target.getItem(POKEMON_KEY)!==null)}catch(_error){}
    const stored=normalizePokemon(readJson(POKEMON_KEY,[],target)),pokemon=hasStored?stored:normalizePokemon(seedPokemon);
    const recycle=normalizeRecycle(readJson(RECYCLE_KEY,[],target)),meta=normalizeMeta(readJson(META_KEY,{},target),pokemon,recycle);
    if(!hasStored)writeJson(POKEMON_KEY,pokemon,target);
    writeJson(RECYCLE_KEY,recycle,target);writeJson(META_KEY,meta,target);
    return {pokemon,recycle,meta,storageAvailable:Boolean(target),migratedFromSeed:!hasStored};
  }
  function readAll(target=storage()){
    const pokemon=normalizePokemon(readJson(POKEMON_KEY,[],target)),recycle=normalizeRecycle(readJson(RECYCLE_KEY,[],target)),meta=normalizeMeta(readJson(META_KEY,{},target),pokemon,recycle);
    return {pokemon,recycle,meta};
  }
  function saveAll(state,target=storage(),source='pokemon-data'){
    const pokemon=normalizePokemon(state&&state.pokemon),recycle=normalizeRecycle(state&&state.recycle),meta=normalizeMeta(state&&state.meta,pokemon,recycle);meta.updatedAt=now();
    const ok=writeJson(POKEMON_KEY,pokemon,target)&&writeJson(RECYCLE_KEY,recycle,target)&&writeJson(META_KEY,meta,target);
    emit(source,{ok});return {pokemon,recycle,meta,ok};
  }
  function nextDisplayId(state){
    const current=state&&state.meta?state:readAll(),id=String(current.meta.nextDisplayId);
    current.meta.nextDisplayId+=1;current.meta.updatedAt=now();return id;
  }
  function upsertPokemon(record,{boxId='pending',battleEligible=true}={},target=storage()){
    const state=readAll(target),normalized=canonicalRecord(record),index=state.pokemon.findIndex(item=>item.recordId===normalized.recordId||item.id===normalized.id),changedAt=now();
    normalized.updatedAt=changedAt;if(!normalized.createdAt)normalized.createdAt=changedAt;
    if(index>=0)state.pokemon[index]=normalized;else state.pokemon.push(normalized);
    state.pokemon.sort((a,b)=>Number(a.id)-Number(b.id)||a.id.localeCompare(b.id));
    state.meta=normalizeMeta(state.meta,state.pokemon,state.recycle);state.meta.nextDisplayId=Math.max(state.meta.nextDisplayId,Number(normalized.id)+1||1);
    const result=saveAll(state,target,index>=0?'pokemon-edit':'pokemon-add');
    const boxState=readJson(BOX_KEY,{},target),boxes=boxState&&typeof boxState==='object'?boxState:{};
    boxes.version=1;boxes.boxes=boxes.boxes&&typeof boxes.boxes==='object'?boxes.boxes:{};boxes.pokemon=boxes.pokemon&&typeof boxes.pokemon==='object'?boxes.pokemon:{};
    const previous=boxes.pokemon[normalized.id]&&typeof boxes.pokemon[normalized.id]==='object'?boxes.pokemon[normalized.id]:{};
    boxes.pokemon[normalized.id]={...previous,boxId:String(boxId||previous.boxId||'pending'),battleEligible:Boolean(battleEligible),upgrades:previous.upgrades&&typeof previous.upgrades==='object'?previous.upgrades:{},updatedAt:changedAt};
    writeJson(BOX_KEY,boxes,target);
    const levels=readJson(LEVEL_KEY,{},target);if(levels&&typeof levels==='object'){delete levels[normalized.id];writeJson(LEVEL_KEY,levels,target)}
    emit(index>=0?'pokemon-edit':'pokemon-add',{id:normalized.id,recordId:normalized.recordId});
    return {...result,record:normalized,created:index<0};
  }
  function removeRelations(id,target=storage()){
    const key=String(id),box=readJson(BOX_KEY,{},target);
    if(box&&box.pokemon){delete box.pokemon[key];writeJson(BOX_KEY,box,target)}
    const levels=readJson(LEVEL_KEY,{},target);if(levels&&typeof levels==='object'){delete levels[key];writeJson(LEVEL_KEY,levels,target)}
    const history=readJson(LEVEL_HISTORY_KEY,[],target);
    if(Array.isArray(history))writeJson(LEVEL_HISTORY_KEY,history.filter(entry=>![...(entry.before||[]),...(entry.after||[])].some(item=>String(item&&item.id)===key)),target);
    const current=readJson(CURRENT_TEAM_KEY,[],target);
    if(Array.isArray(current))writeJson(CURRENT_TEAM_KEY,current.filter(member=>String(member)!==key),target);
    const saved=readJson(SAVED_TEAMS_KEY,[],target);
    if(Array.isArray(saved))writeJson(SAVED_TEAMS_KEY,saved.filter(team=>!Array.isArray(team&&team.members)||!team.members.some(member=>String(member)===key)),target);
  }
  function releasePokemon(id,target=storage()){
    const key=String(id),state=readAll(target),index=state.pokemon.findIndex(record=>record.id===key);
    if(index<0)return {ok:false,reason:'not-found'};
    const [pokemon]=state.pokemon.splice(index,1),deletedAt=now(),expiresAt=new Date(Date.now()+RECYCLE_DAYS*86400000).toISOString();
    state.recycle=state.recycle.filter(item=>item.pokemon.recordId!==pokemon.recordId);state.recycle.unshift({pokemon,deletedAt,expiresAt});
    removeRelations(key,target);const result=saveAll(state,target,'pokemon-release');emit('pokemon-release',{id:key,recordId:pokemon.recordId});return {...result,released:pokemon};
  }
  function restorePokemon(recordId,target=storage()){
    const key=String(recordId),state=readAll(target),index=state.recycle.findIndex(item=>item.pokemon.recordId===key);
    if(index<0)return {ok:false,reason:'not-found'};
    const [item]=state.recycle.splice(index,1);item.pokemon.updatedAt=now();state.pokemon.push(item.pokemon);state.pokemon.sort((a,b)=>Number(a.id)-Number(b.id)||a.id.localeCompare(b.id));
    const result=saveAll(state,target,'pokemon-restore');emit('pokemon-restore',{id:item.pokemon.id,recordId:key});return {...result,restored:item.pokemon};
  }
  function purgePokemon(recordId,target=storage()){
    const key=String(recordId),state=readAll(target),before=state.recycle.length;state.recycle=state.recycle.filter(item=>item.pokemon.recordId!==key);
    if(state.recycle.length===before)return {ok:false,reason:'not-found'};
    const result=saveAll(state,target,'pokemon-purge');emit('pokemon-purge',{recordId:key});return result;
  }
  function daysRemaining(expiresAt){return Math.max(0,Math.ceil((new Date(expiresAt).getTime()-Date.now())/86400000))}
  function newRecordId(){return uid()}

  return Object.freeze({POKEMON_KEY,RECYCLE_KEY,META_KEY,BOX_KEY,LEVEL_KEY,LEVEL_HISTORY_KEY,CURRENT_TEAM_KEY,SAVED_TEAMS_KEY,RECYCLE_DAYS,CANONICAL_FIELDS,readJson,writeJson,normalizeRecord,canonicalRecord,normalizePokemon,normalizeRecycle,normalizeMeta,load,readAll,saveAll,nextDisplayId,upsertPokemon,removeRelations,releasePokemon,restorePokemon,purgePokemon,daysRemaining,newRecordId,emit,clone});
});
