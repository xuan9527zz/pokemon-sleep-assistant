(function(root,factory){
  'use strict';
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_CLOUD_SYNC=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';

  const META_KEY='pokemon-sleep-cloud-meta-v1';
  const CLOCK_KEY='pokemon-sleep-state-clock-v1';
  const STATE_KEYS=Object.freeze({
    pokemon:'pokemon-sleep-user-pokemon-v1',
    recycleBin:'pokemon-sleep-recycle-bin-v1',
    dataMeta:'pokemon-sleep-data-meta-v1',
    boxManagement:'pokemon-sleep-box-management-v1',
    levelOverrides:'pokemon-sleep-level-overrides-v1',
    levelHistory:'pokemon-sleep-level-history-v1',
    currentTeam:'pokemon-sleep-current-team-v1',
    savedTeams:'pokemon-sleep-saved-teams-v1',
    weeklyPlan:'pokemon-sleep-weekly-plan-v1',
    advisorPreferences:'pokemon-sleep-advisor-preferences-v1'
  });
  const FALLBACKS=Object.freeze({pokemon:[],recycleBin:[],dataMeta:{},boxManagement:{},levelOverrides:{},levelHistory:[],currentTeam:[],savedTeams:[],weeklyPlan:{},advisorPreferences:{accountStage:'mature'}});
  function storage(){try{return root&&root.localStorage||null}catch(_error){return null}}
  function readJson(key,fallback,target=storage()){try{const raw=target&&target.getItem(key);return raw?JSON.parse(raw):fallback}catch(_error){return fallback}}
  function writeJson(key,value,target=storage()){try{target.setItem(key,JSON.stringify(value));return true}catch(_error){return false}}
  function stableString(value){
    if(value===null||typeof value!=='object')return JSON.stringify(value);
    if(Array.isArray(value))return `[${value.map(stableString).join(',')}]`;
    return `{${Object.keys(value).sort().map(key=>`${JSON.stringify(key)}:${stableString(value[key])}`).join(',')}}`;
  }
  function hashState(value){
    const text=stableString(value);let hash=2166136261;
    for(let index=0;index<text.length;index++){hash^=text.charCodeAt(index);hash=Math.imul(hash,16777619)}
    return (hash>>>0).toString(16).padStart(8,'0');
  }
  function clock(target=storage()){
    const value=readJson(CLOCK_KEY,{},target),updatedAt=String(value&&value.updatedAt||'');
    return updatedAt||String(readJson('pokemon-sleep-data-meta-v1',{},target).updatedAt||new Date(0).toISOString());
  }
  function touch(target=storage()){
    const updatedAt=new Date().toISOString();writeJson(CLOCK_KEY,{updatedAt},target);return updatedAt;
  }
  function collectState(target=storage()){
    const data={};Object.entries(STATE_KEYS).forEach(([name,key])=>{data[name]=readJson(key,FALLBACKS[name],target)});
    return {schemaVersion:1,updatedAt:clock(target),data};
  }
  function applyState(state,target=storage()){
    if(!state||typeof state!=='object'||!state.data||typeof state.data!=='object')return false;
    Object.entries(STATE_KEYS).forEach(([name,key])=>{if(Object.hasOwn(state.data,name))writeJson(key,state.data[name],target)});
    writeJson(CLOCK_KEY,{updatedAt:String(state.updatedAt||new Date().toISOString())},target);return true;
  }
  function normalizeMeta(value){
    const source=value&&typeof value==='object'?value:{};
    return {userId:String(source.userId||''),revision:Math.max(0,Math.round(Number(source.revision)||0)),lastSyncedHash:String(source.lastSyncedHash||''),cloudUpdatedAt:String(source.cloudUpdatedAt||'')};
  }
  function errorMessage(error){
    const code=String(error&&error.code||''),message=String(error&&error.message||'');
    if(code==='42P01'||code==='PGRST205'||/user_state|schema cache|does not exist/i.test(message))return '云端数据表尚未创建：请先在 Supabase SQL Editor 执行项目提供的 SQL。';
    if(/redirect|not allowed/i.test(message))return '登录回跳地址未获允许：请在 Supabase Auth URL Configuration 添加 GitHub Pages 地址。';
    return message||'云端同步失败，请稍后重试。';
  }
  function newer(left,right){return new Date(left||0).getTime()>=new Date(right||0).getTime()}

  function mount(options={}){
    if(typeof document==='undefined')return null;
    const config=options.config||root.POKEMON_SLEEP_SUPABASE_CONFIG,supabaseGlobal=options.supabase||root.supabase;
    const status=document.querySelector('#cloudSyncStatus'),emailInput=document.querySelector('#cloudEmail'),loginButton=document.querySelector('#cloudLogin'),logoutButton=document.querySelector('#cloudLogout'),identity=document.querySelector('#cloudIdentity'),panel=document.querySelector('#cloudSyncPanel');
    if(!status||!emailInput||!loginButton||!logoutButton||!config||!supabaseGlobal||typeof supabaseGlobal.createClient!=='function')return null;
    const client=supabaseGlobal.createClient(config.url,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}),table=config.table||'user_state';
    let session=null,revision=0,syncing=false,dirty=false,timer=null,lastError='';
    function setStatus(text,type='idle'){status.textContent=text;status.dataset.state=type;panel.dataset.state=type}
    function renderAuth(){
      const user=session&&session.user,email=user&&user.email||'';identity.textContent=user?`已登录：${email}`:'未登录 · 当前使用本机缓存';emailInput.hidden=Boolean(user);loginButton.hidden=Boolean(user);logoutButton.hidden=!user;
      if(!user&&!lastError)setStatus('登录后会自动同步并长期保持会话','idle');
    }
    function saveMeta(stateHash,cloudUpdatedAt){writeJson(META_KEY,{userId:session.user.id,revision,lastSyncedHash:stateHash,cloudUpdatedAt:cloudUpdatedAt||new Date().toISOString()})}
    async function fetchRow(){
      const result=await client.from(table).select('user_id,schema_version,revision,state,updated_at').eq('user_id',session.user.id).maybeSingle();
      if(result.error)throw result.error;return result.data;
    }
    async function insertLocal(local){
      const nextRevision=1,result=await client.from(table).insert({user_id:session.user.id,schema_version:1,revision:nextRevision,state:local,updated_at:new Date().toISOString()}).select('revision,updated_at').single();
      if(result.error)throw result.error;revision=Number(result.data.revision);const hash=hashState(local);saveMeta(hash,result.data.updated_at);dirty=false;return result.data;
    }
    async function updateLocal(local,expectedRevision=revision){
      const nextRevision=expectedRevision+1,result=await client.from(table).update({schema_version:1,revision:nextRevision,state:local,updated_at:new Date().toISOString()}).eq('user_id',session.user.id).eq('revision',expectedRevision).select('revision,updated_at').maybeSingle();
      if(result.error)throw result.error;
      if(!result.data)return null;
      revision=Number(result.data.revision);const hash=hashState(local);saveMeta(hash,result.data.updated_at);dirty=false;return result.data;
    }
    async function applyCloud(row,localHash){
      const cloud=row.state,cloudHash=hashState(cloud);revision=Number(row.revision)||1;applyState(cloud);saveMeta(cloudHash,row.updated_at);dirty=false;
      if(cloudHash!==localHash){setStatus('已载入云端数据，正在刷新页面…','synced');setTimeout(()=>root.location.reload(),80);return true}
      setStatus('云端数据已同步','synced');return false;
    }
    async function resolveConflict(local,row){
      const cloudHash=hashState(row.state),localHash=hashState(local),meta=normalizeMeta(readJson(META_KEY,{}));
      revision=Number(row.revision)||1;
      if(localHash===cloudHash){saveMeta(localHash,row.updated_at);dirty=false;setStatus('云端数据已同步','synced');return}
      if(meta.userId!==session.user.id||!meta.lastSyncedHash){await applyCloud(row,localHash);return}
      if(meta.userId===session.user.id&&meta.lastSyncedHash===localHash){await applyCloud(row,localHash);return}
      if(meta.userId===session.user.id&&meta.lastSyncedHash===cloudHash){const saved=await updateLocal(local,revision);if(saved){setStatus('本机修改已保存到云端','synced');return}}
      if(newer(local.updatedAt,row.state&&row.state.updatedAt)){
        const saved=await updateLocal(local,revision);if(saved){setStatus('已用较新的本机修改更新云端','synced');return}
      }
      await applyCloud(row,localHash);setStatus('检测到多设备修改，已采用较新的云端版本','warning');
    }
    async function initialSync(){
      if(!session||syncing)return;syncing=true;lastError='';setStatus('正在读取云端数据…','saving');
      try{
        const local=collectState(),row=await fetchRow();
        if(!row){await insertLocal(local);setStatus('已将当前盒子首次保存到云端','synced')}
        else await resolveConflict(local,row);
      }catch(error){lastError=errorMessage(error);setStatus(lastError,'error')}
      finally{syncing=false}
    }
    async function saveNow(){
      if(!session)return {ok:false,reason:'signed-out'};
      if(syncing){dirty=true;return {ok:false,reason:'busy'}}
      syncing=true;lastError='';setStatus('正在保存…','saving');
      try{
        const local=collectState();let saved=revision?await updateLocal(local,revision):null;
        if(!saved){const row=await fetchRow();if(!row)saved=await insertLocal(local);else{await resolveConflict(local,row);saved=true}}
        if(saved)setStatus('刚刚已同步','synced');return {ok:true,revision};
      }catch(error){dirty=true;lastError=errorMessage(error);setStatus(lastError,'error');throw error}
      finally{syncing=false}
    }
    function scheduleSave(){
      dirty=true;touch();if(!session)return;
      if(timer)clearTimeout(timer);timer=setTimeout(()=>{timer=null;saveNow().catch(()=>{})},850);
    }
    async function sendMagicLink(){
      const email=emailInput.value.trim();if(!email||!email.includes('@')){setStatus('请输入有效邮箱地址','warning');emailInput.focus();return}
      if(root.location.protocol!=='https:'&&root.location.hostname!=='localhost'){setStatus('邮箱登录请在 GitHub Pages 在线网址中使用；本地文件仍可正常使用本机数据。','warning');return}
      loginButton.disabled=true;setStatus('正在发送登录邮件…','saving');
      const redirectTo=`${root.location.origin}${root.location.pathname}`.replace(/index\.html$/,'');
      const result=await client.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo}});loginButton.disabled=false;
      if(result.error){lastError=errorMessage(result.error);setStatus(lastError,'error');return}
      setStatus('登录邮件已发送；点击邮件中的链接即可完成登录','sent');
    }
    async function signOut(){logoutButton.disabled=true;const result=await client.auth.signOut();logoutButton.disabled=false;if(result.error){setStatus(errorMessage(result.error),'error');return}session=null;revision=0;renderAuth();setStatus('已退出；本机缓存仍保留','idle')}
    function handleSession(nextSession){
      const previousId=session&&session.user&&session.user.id;session=nextSession;renderAuth();
      if(session&&session.user&&session.user.id!==previousId){revision=normalizeMeta(readJson(META_KEY,{})).userId===session.user.id?normalizeMeta(readJson(META_KEY,{})).revision:0;initialSync()}
    }
    loginButton.addEventListener('click',()=>sendMagicLink().catch(error=>setStatus(errorMessage(error),'error')));emailInput.addEventListener('keydown',event=>{if(event.key==='Enter'){event.preventDefault();sendMagicLink().catch(error=>setStatus(errorMessage(error),'error'))}});logoutButton.addEventListener('click',()=>signOut().catch(error=>setStatus(errorMessage(error),'error')));root.addEventListener('pokemon-sleep:local-change',scheduleSave);root.addEventListener('online',()=>{if(dirty&&session)saveNow().catch(()=>{})});document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden'&&dirty&&session)saveNow().catch(()=>{})});
    client.auth.onAuthStateChange((_event,nextSession)=>setTimeout(()=>handleSession(nextSession),0));
    client.auth.getSession().then(({data,error})=>{if(error){setStatus(errorMessage(error),'error');return}handleSession(data.session)});
    renderAuth();
    return {client,getSession:()=>session,collectState,markDirty:scheduleSave,saveNow,syncNow:initialSync,signOut};
  }

  return Object.freeze({META_KEY,CLOCK_KEY,STATE_KEYS,FALLBACKS,stableString,hashState,collectState,applyState,normalizeMeta,errorMessage,mount});
});
