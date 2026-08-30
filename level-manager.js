(function(root,factory){
  'use strict';
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.POKEMON_SLEEP_LEVELS=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';

  const MIN_LEVEL=1;
  const MAX_LEVEL=70;
  const SUBSKILL_LEVELS=[10,25,50,70,80];
  const STORAGE_KEY='pokemon-sleep-level-overrides-v1';
  const HISTORY_KEY='pokemon-sleep-level-history-v1';
  const MAX_HISTORY=20;
  const baselineByPokemon=new WeakMap();

  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));

  function normalizeLevel(value){
    const level=Number(value);
    return Number.isInteger(level)&&level>=MIN_LEVEL&&level<=MAX_LEVEL?level:null;
  }

  function clampLevel(value){
    const level=Math.round(Number(value));
    return Number.isFinite(level)?clamp(level,MIN_LEVEL,MAX_LEVEL):MIN_LEVEL;
  }

  function parseInterval(value){
    const parts=String(value||'').trim().split(':').map(Number);
    if(parts.some(part=>!Number.isFinite(part)))return NaN;
    if(parts.length===2)return parts[0]*60+parts[1];
    if(parts.length===3)return parts[0]*3600+parts[1]*60+parts[2];
    return NaN;
  }

  function formatInterval(value){
    const total=Math.max(1,Math.floor(Number(value)||0));
    const hours=Math.floor(total/3600),minutes=Math.floor(total%3600/60),seconds=total%60;
    return hours?`${hours}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`:`${minutes}:${String(seconds).padStart(2,'0')}`;
  }

  function captureBaseline(mon){
    if(!mon||typeof mon!=='object')return null;
    if(baselineByPokemon.has(mon))return baselineByPokemon.get(mon);
    const level=normalizeLevel(mon.lv)||MIN_LEVEL;
    const intervalSec=parseInterval(mon.interval);
    const inventory=Number(mon.inv);
    const baseline={
      level,
      intervalSec:Number.isFinite(intervalSec)?intervalSec:NaN,
      interval:String(mon.interval||''),
      inventory:Number.isFinite(inventory)?inventory:0
    };
    baselineByPokemon.set(mon,baseline);
    return baseline;
  }

  function levelSpeedFactor(level){
    const safe=clampLevel(level);
    return 1-(safe-1)*.002;
  }

  function unlockedSubskills(mon,level,useActual=true){
    const safe=clampLevel(level);
    const source=useActual&&mon&&mon.effectiveSubs?mon.effectiveSubs:mon&&mon.subs;
    return String(source||'').split('；').filter((skill,index)=>skill&&skill!=='—'&&(SUBSKILL_LEVELS[index]||80)<=safe);
  }

  function helpingSpeedReduction(mon,level,useActual=true){
    return clamp(unlockedSubskills(mon,level,useActual).reduce((total,skill)=>total+(skill==='帮忙速度S'?.07:skill==='帮忙速度M'?.14:0),0),0,.35);
  }

  function inventoryBonus(mon,level,useActual=true){
    return unlockedSubskills(mon,level,useActual).reduce((total,skill)=>total+({持有上限S:6,持有上限M:12,持有上限L:18}[skill]||0),0);
  }

  function calculateLevelState(mon,level){
    const baseline=captureBaseline(mon),safe=clampLevel(level);
    const baseLevelFactor=levelSpeedFactor(baseline.level),nextLevelFactor=levelSpeedFactor(safe);
    const baseOwnSpeed=helpingSpeedReduction(mon,baseline.level,false),nextOwnSpeed=helpingSpeedReduction(mon,safe,true);
    let intervalSec=baseline.intervalSec;
    if(Number.isFinite(intervalSec)){
      intervalSec=Math.floor(intervalSec*(nextLevelFactor/baseLevelFactor)*((1-nextOwnSpeed)/(1-baseOwnSpeed)));
    }
    const inventory=Math.max(0,baseline.inventory-inventoryBonus(mon,baseline.level,false)+inventoryBonus(mon,safe,true));
    const outputMultiplier=Number.isFinite(intervalSec)&&intervalSec>0?baseline.intervalSec/intervalSec:1;
    return {
      level:safe,
      intervalSec,
      interval:Number.isFinite(intervalSec)?formatInterval(intervalSec):baseline.interval,
      inventory,
      outputMultiplier,
      unlockedSubskills:unlockedSubskills(mon,safe)
    };
  }

  function setHiddenNumber(target,key,value){
    const descriptor=Object.getOwnPropertyDescriptor(target,key);
    if(descriptor&&descriptor.writable){target[key]=value;return}
    Object.defineProperty(target,key,{value,writable:true,configurable:true,enumerable:false});
  }

  function applyLevel(mon,level){
    if(!mon||typeof mon!=='object')return null;
    const state=calculateLevelState(mon,level);
    mon.lv=String(state.level);
    mon.interval=state.interval;
    mon.inv=String(state.inventory);
    setHiddenNumber(mon,'levelOutputMultiplier',state.outputMultiplier);
    return state;
  }

  function normalizeOverrides(value,validIds){
    if(!value||typeof value!=='object'||Array.isArray(value))return {};
    const allowed=validIds?new Set([...validIds].map(String)):null,result={};
    Object.entries(value).forEach(([rawId,raw])=>{
      const id=String(rawId),level=normalizeLevel(raw&&typeof raw==='object'?raw.level:raw);
      if(level===null||(allowed&&!allowed.has(id)))return;
      result[id]={level,updatedAt:raw&&typeof raw.updatedAt==='string'?raw.updatedAt:''};
    });
    return result;
  }

  function normalizeHistory(value,validIds){
    if(!Array.isArray(value))return [];
    const allowed=validIds?new Set([...validIds].map(String)):null;
    return value.slice(0,MAX_HISTORY).map(entry=>{
      if(!entry||typeof entry!=='object'||!Array.isArray(entry.before)||!Array.isArray(entry.after))return null;
      const normalizeItems=items=>items.map(item=>{
        const id=String(item&&item.id||''),level=normalizeLevel(item&&item.level);
        if(!id||level===null||(allowed&&!allowed.has(id)))return null;
        const record=item.record&&typeof item.record==='object'?normalizeOverrides({[id]:item.record},[id])[id]||null:null;
        return {id,level,record};
      }).filter(Boolean);
      const before=normalizeItems(entry.before),after=normalizeItems(entry.after);
      return before.length&&before.length===after.length?{id:String(entry.id||''),changedAt:String(entry.changedAt||''),before,after}:null;
    }).filter(Boolean);
  }

  function readJson(storage,key,fallback){
    try{
      const raw=storage&&storage.getItem(key);
      return raw?JSON.parse(raw):fallback;
    }catch(_error){return fallback}
  }

  function writeJson(storage,key,value){
    try{storage.setItem(key,JSON.stringify(value));return true}catch(_error){return false}
  }

  function browserStorage(){
    try{return root&&root.localStorage||null}catch(_error){return null}
  }

  function applyOverrides(pokemon,overrides){
    const mons=Array.isArray(pokemon)?pokemon:[],normalized=normalizeOverrides(overrides,mons.map(mon=>mon.id));
    mons.forEach(mon=>{captureBaseline(mon);applyLevel(mon,normalized[String(mon.id)]?.level||captureBaseline(mon).level)});
    return normalized;
  }

  function applyStored(pokemon,storage=browserStorage()){
    const mons=Array.isArray(pokemon)?pokemon:[],validIds=mons.map(mon=>mon.id);
    const overrides=normalizeOverrides(readJson(storage,STORAGE_KEY,{}),validIds);
    const history=normalizeHistory(readJson(storage,HISTORY_KEY,[]),validIds);
    applyOverrides(mons,overrides);
    return {overrides,history,storageAvailable:Boolean(storage)};
  }

  function element(tag,className,text){
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  }

  function mount({pokemon,initialState,onChange}={}){
    if(typeof document==='undefined')return null;
    const mons=Array.isArray(pokemon)?pokemon:[];
    const byId=new Map(mons.map(mon=>[String(mon.id),mon]));
    const storage=browserStorage(),validIds=[...byId.keys()];
    let overrides=normalizeOverrides(initialState&&initialState.overrides!==undefined?initialState.overrides:readJson(storage,STORAGE_KEY,{}),validIds);
    let history=normalizeHistory(initialState&&initialState.history!==undefined?initialState.history:readJson(storage,HISTORY_KEY,[]),validIds);
    let drafts=new Map(),singleId=null;

    const openButton=document.querySelector('#levelManagerOpen');
    const undoButton=document.querySelector('#levelManagerUndo');
    const toolbarStatus=document.querySelector('#levelManagerToolbarStatus');
    const dialog=document.querySelector('#levelManagerDialog');
    const title=document.querySelector('#levelManagerDialogTitle');
    const closeButton=document.querySelector('#levelManagerClose');
    const cancelButton=document.querySelector('#levelManagerCancel');
    const applyButton=document.querySelector('#levelManagerApply');
    const searchInput=document.querySelector('#levelManagerSearch');
    const scopeInput=document.querySelector('#levelManagerScope');
    const listRoot=document.querySelector('#levelManagerList');
    const shownRoot=document.querySelector('#levelManagerShown');
    const pendingRoot=document.querySelector('#levelManagerPending');
    const messageRoot=document.querySelector('#levelManagerMessage');
    if(!openButton||!dialog||!listRoot)return null;

    function currentTeamIds(){
      const current=readJson(storage,'pokemon-sleep-current-team-v1',[]),saved=readJson(storage,'pokemon-sleep-saved-teams-v1',[]);
      return {
        current:new Set(Array.isArray(current)?current.map(String):[]),
        saved:new Set(Array.isArray(saved)?saved.flatMap(team=>Array.isArray(team&&team.members)?team.members.map(String):[]):[])
      };
    }

    function formatUpdatedAt(value){
      const date=new Date(value);
      if(Number.isNaN(date.getTime()))return '';
      return new Intl.DateTimeFormat('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'}).format(date);
    }

    function updateToolbar(message='',warning=false){
      const records=Object.values(overrides).filter(item=>item.updatedAt).sort((a,b)=>String(b.updatedAt).localeCompare(String(a.updatedAt)));
      const latest=records[0]&&formatUpdatedAt(records[0].updatedAt);
      toolbarStatus.textContent=message||`${Object.keys(overrides).length} 只使用本机等级记录${latest?` · 最近 ${latest}`:''}`;
      toolbarStatus.classList.toggle('warning',warning);
      undoButton.disabled=!history.length;
      undoButton.title=history.length?`撤销最近一批（${history[0].before.length}只）`:'没有可撤销的等级修改';
    }

    function draftLevel(mon){return drafts.has(mon.id)?drafts.get(mon.id):Number(mon.lv)}

    function setDraft(mon,value){
      const next=clampLevel(value),current=Number(mon.lv);
      if(next===current)drafts.delete(mon.id);else drafts.set(mon.id,next);
      renderList();
    }

    function filteredMons(){
      const query=searchInput.value.trim().toLowerCase(),scope=scopeInput.value,teams=currentTeamIds();
      let rows=singleId?[byId.get(singleId)].filter(Boolean):[...mons];
      rows=rows.filter(mon=>{
        if(scope==='current'&&!teams.current.has(mon.id))return false;
        if(scope==='saved'&&!teams.saved.has(mon.id))return false;
        if(scope==='priority'&&mon.priority!=='重点培养')return false;
        if(scope==='recent'&&!overrides[mon.id]?.updatedAt)return false;
        const lv10=String(mon.effectiveSubs||mon.subs||'').split('；')[0]||'—';
        return !query||[`#${mon.id}`,mon.id,mon.name,mon.shiny,mon.priority,lv10].join(' ').toLowerCase().includes(query);
      });
      if(scope==='recent')rows.sort((a,b)=>String(overrides[b.id]?.updatedAt||'').localeCompare(String(overrides[a.id]?.updatedAt||''))||Number(a.id)-Number(b.id));
      else rows.sort((a,b)=>Number(a.id)-Number(b.id));
      return rows;
    }

    function levelButton(label,delta,mon){
      const button=element('button','level-manager-step',label);button.type='button';
      button.setAttribute('aria-label',`${mon.name}${delta>0?'增加':'减少'}${Math.abs(delta)}级`);
      button.addEventListener('click',()=>setDraft(mon,draftLevel(mon)+delta));
      return button;
    }

    function renderRow(mon){
      const row=element('article',`level-manager-row${drafts.has(mon.id)?' changed':''}`),identity=element('div','level-manager-identity');
      const nameLine=element('div','level-manager-name'),number=element('span','level-manager-number',`#${mon.id}`),name=element('strong','pokemon-name-text',mon.name);
      nameLine.append(number,name);
      if(mon.shiny==='是')nameLine.append(element('span','level-manager-shiny','★ 闪光'));
      const lv10=String(mon.effectiveSubs||mon.subs||'').split('；')[0]||'—';
      identity.append(nameLine,element('small','',`${mon.priority||'未分类'} · Lv.10 ${lv10}`));
      const controls=element('div','level-manager-row-controls'),input=document.createElement('input');
      input.type='number';input.min=String(MIN_LEVEL);input.max=String(MAX_LEVEL);input.step='1';input.value=String(draftLevel(mon));input.inputMode='numeric';
      input.setAttribute('aria-label',`${mon.name}新等级`);
      input.addEventListener('change',()=>{if(!String(input.value).trim()){input.value=String(draftLevel(mon));return}setDraft(mon,input.value)});
      controls.append(levelButton('−1',-1,mon),input,levelButton('+1',1,mon),levelButton('+5',5,mon));
      const result=element('small','level-manager-result');
      if(drafts.has(mon.id)){
        const state=calculateLevelState(mon,drafts.get(mon.id)),base=Number(mon.lv),newUnlocks=state.unlockedSubskills.filter(skill=>!unlockedSubskills(mon,base).includes(skill));
        result.textContent=`Lv.${base} → Lv.${state.level} · 间隔 ${state.interval} · 持有 ${state.inventory}${newUnlocks.length?` · 解锁 ${newUnlocks.join('、')}`:''}`;
      }else result.textContent=`当前 Lv.${mon.lv} · 间隔 ${mon.interval} · 持有 ${mon.inv}`;
      row.append(identity,controls,result);return row;
    }

    function renderList(){
      const rows=filteredMons();
      listRoot.replaceChildren(...rows.map(renderRow));
      if(!rows.length)listRoot.append(element('div','level-manager-empty','当前筛选没有宝可梦。'));
      shownRoot.textContent=`显示 ${rows.length} 只`;
      pendingRoot.textContent=drafts.size?`待保存 ${drafts.size} 处修改`:'尚未修改';
      applyButton.disabled=!drafts.size;
      messageRoot.hidden=true;
    }

    function showDialog(){
      if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal()}else dialog.setAttribute('open','');
    }

    function closeDialog(){
      drafts.clear();singleId=null;
      if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');
    }

    function openBulk(){
      drafts.clear();singleId=null;title.textContent='批量更新盒子等级';searchInput.value='';scopeInput.value='all';scopeInput.disabled=false;searchInput.disabled=false;renderList();showDialog();setTimeout(()=>searchInput.focus(),0);
    }

    function openFor(id){
      const mon=byId.get(String(id));if(!mon)return false;
      drafts.clear();singleId=mon.id;title.textContent=`更新 #${mon.id} ${mon.name}等级`;searchInput.value='';scopeInput.value='all';scopeInput.disabled=true;searchInput.disabled=true;renderList();showDialog();
      setTimeout(()=>listRoot.querySelector('input')?.select(),0);return true;
    }

    function persist(){
      const levelsOk=writeJson(storage,STORAGE_KEY,overrides),historyOk=writeJson(storage,HISTORY_KEY,history);
      return levelsOk&&historyOk;
    }

    function saveDrafts(){
      if(!drafts.size)return;
      const changedAt=new Date().toISOString(),before=[],after=[];
      drafts.forEach((level,id)=>{
        const mon=byId.get(id);if(!mon||Number(mon.lv)===level)return;
        before.push({id,level:Number(mon.lv),record:overrides[id]?{...overrides[id]}:null});
        after.push({id,level,record:{level,updatedAt:changedAt}});
      });
      if(!before.length){closeDialog();return}
      before.forEach((item,index)=>{
        const next=after[index],mon=byId.get(item.id),baseline=captureBaseline(mon);
        if(next.level===baseline.level)delete overrides[item.id];else overrides[item.id]={level:next.level,updatedAt:changedAt};
        applyLevel(mon,next.level);
      });
      history=[{id:`levels-${changedAt}`,changedAt,before,after},...history].slice(0,MAX_HISTORY);
      const persisted=persist();
      closeDialog();updateToolbar(`已更新 ${before.length} 只宝可梦等级${persisted?'':'；浏览器未开放本地存储，刷新后可能失效'}`,!persisted);
      if(typeof onChange==='function')onChange(before.map((item,index)=>({id:item.id,before:item.level,after:after[index].level})),{source:'save'});
    }

    function undo(){
      const entry=history.shift();if(!entry)return;
      entry.before.forEach(item=>{
        const mon=byId.get(item.id);if(!mon)return;
        if(item.record)overrides[item.id]={...item.record};else delete overrides[item.id];
        applyLevel(mon,item.level);
      });
      const persisted=persist();updateToolbar(`已撤销最近 ${entry.before.length} 只的等级修改${persisted?'':'；浏览器未开放本地存储，刷新后可能失效'}`,!persisted);
      if(typeof onChange==='function')onChange(entry.before.map((item,index)=>({id:item.id,before:entry.after[index]?.level,after:item.level})),{source:'undo'});
    }

    openButton.addEventListener('click',openBulk);
    undoButton.addEventListener('click',undo);
    closeButton.addEventListener('click',closeDialog);
    cancelButton.addEventListener('click',closeDialog);
    applyButton.addEventListener('click',saveDrafts);
    searchInput.addEventListener('input',renderList);
    scopeInput.addEventListener('change',renderList);
    dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog()});
    dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});
    document.addEventListener('pokemon-sleep:edit-level',event=>openFor(event.detail&&event.detail.id));
    updateToolbar();

    return {openBulk,openFor,undo,render:renderList,getOverrides:()=>({...overrides}),getHistory:()=>history.map(entry=>({...entry}))};
  }

  return {
    MIN_LEVEL,MAX_LEVEL,SUBSKILL_LEVELS,STORAGE_KEY,HISTORY_KEY,MAX_HISTORY,
    normalizeLevel,clampLevel,parseInterval,formatInterval,captureBaseline,levelSpeedFactor,
    unlockedSubskills,helpingSpeedReduction,inventoryBonus,calculateLevelState,applyLevel,
    normalizeOverrides,normalizeHistory,applyOverrides,applyStored,mount
  };
});
