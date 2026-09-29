'use strict';

const assert=require('node:assert/strict');
const cloud=require('../cloud-sync.js');

class MemoryStorage{
  constructor(){this.values=new Map()}
  getItem(key){return this.values.get(key)||null}
  setItem(key,value){this.values.set(key,String(value))}
}
class Control{
  constructor(){this.value='';this.hidden=false;this.disabled=false;this.dataset={};this.handlers={};this.textContent=''}
  addEventListener(name,handler){this.handlers[name]=handler}
  focus(){}
}

(async()=>{
  const previous={document:global.document,location:global.location,localStorage:global.localStorage,addEventListener:global.addEventListener};
  try{
    const controls=Object.fromEntries(['#cloudSyncStatus','#cloudEmail','#cloudLogin','#cloudProof','#cloudVerify','#cloudLogout','#cloudIdentity','#cloudSyncPanel'].map(id=>[id,new Control()]));
    const storage=new MemoryStorage(),requests=[];
    global.document={querySelector:selector=>controls[selector]||null,addEventListener(){},visibilityState:'visible'};
    global.location={protocol:'https:',hostname:'example.github.io',origin:'https://example.github.io',pathname:'/pokemon-sleep-assistant/'};
    global.localStorage=storage;global.addEventListener=()=>{};
    const supabase={createClient:()=>({
      auth:{getSession:async()=>({data:{session:null}}),onAuthStateChange(){},signInWithOtp:async request=>{requests.push({kind:'send',request});return {error:null}},verifyOtp:async request=>{requests.push({kind:'verify',request});return {error:null,data:{session:{user:{id:'user-1',email:'ash@example.com'}}}}}},
      from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>({data:{revision:1,state:cloud.collectState(storage),updated_at:new Date().toISOString()}})})})})
    })};
    const app=cloud.mount({config:{url:'https://project.supabase.co',publishableKey:'test-key'},supabase});
    assert.ok(app);
    await Promise.resolve();
    assert.equal(controls['#cloudProof'].hidden,false,'登录链接输入应在重新打开应用后仍可见');
    controls['#cloudEmail'].value='ash@example.com';
    await controls['#cloudLogin'].handlers.click();
    assert.equal(requests[0].kind,'send');
    assert.equal(requests[0].request.options.emailRedirectTo,'https://example.github.io/pokemon-sleep-assistant/');
    controls['#cloudProof'].value='https://project.supabase.co/auth/v1/verify?token=hash-123&type=magiclink';
    await controls['#cloudVerify'].handlers.click();
    assert.deepEqual(requests[1],{kind:'verify',request:{token_hash:'hash-123',type:'email'}});
    assert.equal(controls['#cloudProof'].value,'');
    assert.equal(controls['#cloudProof'].hidden,true);
    assert.equal(controls['#cloudIdentity'].textContent,'已登录：ash@example.com');
    console.log('cloud in-app email verification tests passed');
  }finally{
    for(const [name,value] of Object.entries(previous))if(value===undefined)delete global[name];else global[name]=value;
  }
})().catch(error=>{console.error(error);process.exitCode=1});
