'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');

const root=path.resolve(__dirname,'..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.webmanifest'),'utf8'));
const worker=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const pwaSource=fs.readFileSync(path.join(root,'pwa.js'),'utf8');
const pwa=require('../pwa.js');

assert.equal(manifest.display,'standalone');
assert.equal(manifest.start_url,'./#box');
assert.equal(manifest.scope,'./');
assert.deepEqual(manifest.icons.map(icon=>icon.sizes),['192x192','512x512','512x512']);
manifest.icons.forEach(icon=>assert.ok(fs.existsSync(path.join(root,icon.src)) ,`缺少PWA图标：${icon.src}`));
new vm.Script(worker,{filename:'service-worker.js'});
new vm.Script(pwaSource,{filename:'pwa.js'});
const appShellSource=worker.match(/const APP_SHELL=\[([\s\S]*?)\];/);
assert.ok(appShellSource,'Service Worker缺少APP_SHELL清单');
const appShellPaths=Array.from(appShellSource[1].matchAll(/'([^']+)'/g),match=>match[1]);
appShellPaths.filter(item=>item!=='./').forEach(item=>{
  assert.ok(fs.existsSync(path.join(root,item)),`离线应用壳引用了不存在的文件：${item}`);
});
assert.ok(worker.includes("url.origin!==self.location.origin"),'Service Worker不得缓存Supabase等站外请求');
assert.ok(worker.includes("request.mode==='navigate'"),'Service Worker缺少离线页面回退');
assert.ok(worker.includes("'./sleep-reward-curves.generated.js'"),'离线应用壳缺少核心研究数据');
assert.deepEqual(pwa.statusFor({standalone:true,online:false}).kind,'installed');
assert.deepEqual(pwa.statusFor({ios:true}).kind,'ios');
assert.deepEqual(pwa.statusFor({installable:true}).kind,'installable');
assert.equal(pwa.isIos({userAgent:'Mozilla/5.0 (iPhone)'}),true);
assert.equal(pwa.isStandalone({matchMedia:()=>({matches:true})},{}),true);

console.log('pwa tests passed (manifest, offline shell, install states and external-request boundary)');
