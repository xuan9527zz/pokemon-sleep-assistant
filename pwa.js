(function(root,factory){
  'use strict';
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_PWA=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';

  function isIos(navigatorObject){
    const nav=navigatorObject||{};
    return /iphone|ipad|ipod/i.test(String(nav.userAgent||''))||(String(nav.platform||'')==='MacIntel'&&Number(nav.maxTouchPoints)>1);
  }
  function isStandalone(windowObject,navigatorObject){
    const win=windowObject||{},nav=navigatorObject||{};
    return Boolean(nav.standalone)||(typeof win.matchMedia==='function'&&win.matchMedia('(display-mode: standalone)').matches);
  }
  function statusFor({standalone=false,ios=false,installable=false,online=true,serviceWorker=true}={}){
    if(standalone)return {kind:'installed',title:'已作为 App 运行',detail:online?'可直接从主屏幕打开；核心工具支持离线使用。':'当前离线；正在使用设备中的本地应用资源。'};
    if(ios)return {kind:'ios',title:'添加到 iPhone 主屏幕',detail:'点击 Safari 的“分享”，再选择“添加到主屏幕”。'};
    if(installable)return {kind:'installable',title:'安装 Pokémon Sleep 助手',detail:'安装后会以独立窗口运行，并可离线打开核心工具。'};
    if(!serviceWorker)return {kind:'unsupported',title:'当前环境不支持安装',detail:'请使用 HTTPS 网站或最新版 Safari、Chrome、Edge 打开。'};
    return {kind:'ready',title:'PWA 已准备就绪',detail:'浏览器出现安装选项时即可添加到设备。'};
  }

  function mount({window:win=root,document:doc=root&&root.document,navigator:nav=root&&root.navigator}={}){
    if(!win||!doc||!nav)return null;
    const openButton=doc.querySelector('#pwaInstallOpen'),dialog=doc.querySelector('#pwaInstallDialog'),closeButton=doc.querySelector('#pwaInstallClose'),nativeButton=doc.querySelector('#pwaNativeInstall'),statusRoot=doc.querySelector('#pwaInstallStatus'),stepsRoot=doc.querySelector('#pwaInstallSteps'),offlineToast=doc.querySelector('#pwaOfflineToast'),updateToast=doc.querySelector('#pwaUpdateToast'),updateButton=doc.querySelector('#pwaUpdateApply'),hero=doc.querySelector('.hero');
    if(!openButton||!dialog||!closeButton||!nativeButton||!statusRoot||!stepsRoot)return null;
    let installPrompt=null,registration=null,reloading=false;
    const ios=isIos(nav);
    const standalone=()=>isStandalone(win,nav);
    function sync(){
      const state=statusFor({standalone:standalone(),ios,installable:Boolean(installPrompt),online:nav.onLine!==false,serviceWorker:'serviceWorker' in nav});
      statusRoot.dataset.state=state.kind;statusRoot.querySelector('strong').textContent=state.title;statusRoot.querySelector('span').textContent=state.detail;
      openButton.hidden=standalone()||(!ios&&!installPrompt);hero&&hero.classList.toggle('pwa-install-available',!openButton.hidden);
      nativeButton.hidden=!installPrompt||standalone();stepsRoot.hidden=!ios||standalone();
      if(offlineToast)offlineToast.hidden=nav.onLine!==false;
      return state;
    }
    function open(){sync();dialog.showModal?dialog.showModal():dialog.setAttribute('open','')}
    function close(){dialog.close?dialog.close():dialog.removeAttribute('open')}
    openButton.addEventListener('click',open);closeButton.addEventListener('click',close);dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
    nativeButton.addEventListener('click',async()=>{
      if(!installPrompt)return;
      installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;sync();close();
    });
    win.addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;sync()});
    win.addEventListener('appinstalled',()=>{installPrompt=null;sync();close()});
    win.addEventListener('online',sync);win.addEventListener('offline',sync);
    if('serviceWorker' in nav){
      win.addEventListener('load',async()=>{
        try{
          registration=await nav.serviceWorker.register('./service-worker.js',{scope:'./'});
          function offerUpdate(worker){if(!worker||!updateToast)return;updateToast.hidden=false;updateButton.hidden=false}
          if(registration.waiting)offerUpdate(registration.waiting);
          registration.addEventListener('updatefound',()=>{const worker=registration.installing;if(worker)worker.addEventListener('statechange',()=>{if(worker.state==='installed'&&nav.serviceWorker.controller)offerUpdate(worker)})});
        }catch(error){statusRoot.dataset.registrationError='true';statusRoot.querySelector('span').textContent='离线组件注册失败，联网功能仍可正常使用。'}
      });
      nav.serviceWorker.addEventListener('controllerchange',()=>{if(reloading)return;reloading=true;win.location.reload()});
    }
    updateButton&&updateButton.addEventListener('click',()=>{const worker=registration&&registration.waiting;if(worker)worker.postMessage({type:'SKIP_WAITING'})});
    sync();
    return {open,close,sync,getRegistration:()=>registration,isIos:ios,isStandalone:standalone};
  }

  return Object.freeze({isIos,isStandalone,statusFor,mount});
});
