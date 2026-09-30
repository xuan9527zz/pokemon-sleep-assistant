'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const ocr=require('../inventory-ocr.js');
const ingredients=require('../ingredients.js');
const names=Object.keys(ingredients.INGREDIENTS);

assert.equal(ocr.matchName('粗枝大划',names).name,'粗枝大葱');
assert.equal(ocr.matchName('噬噬鲜奶',names).name,'哞哞鲜奶');
assert.equal(ocr.matchName('食材',names),null);

const mockLine={bbox:{x0:0,y0:648,x1:588,y1:665},words:[
  {text:'粗枝大划',bbox:{x0:54,x1:120,y0:648,y1:665}},
  {text:'品鲜蘑菇',bbox:{x0:190,x1:256,y0:648,y1:665}},
  {text:'特选蛋',bbox:{x0:334,x1:383,y0:648,y1:665}},
  {text:'窝心洋苹',bbox:{x0:462,x1:528,y0:648,y1:665}}
]};
const data={blocks:[{paragraphs:[{lines:[mockLine]}]}]};
assert.deepEqual(ocr.extractNameRows(data,names)[0].cells.map(cell=>cell.match.name),['粗枝大葱','品鲜蘑菇','特选蛋','窝心洋芋']);

const rows=ocr.mergeObservations([
  {name:'特选苹果',quantity:41,source:'上半张',include:true,review:false},
  {name:'特选苹果',quantity:41,source:'下半张',include:true,review:false},
  {name:'哞哞鲜奶',quantity:'',source:'上半张',include:false,review:true},
  {name:'哞哞鲜奶',quantity:91,source:'下半张',include:true,review:false}
]);
assert.equal(rows.length,2,'重叠截图不得重复计算');
assert.deepEqual(rows[0].sources,['上半张','下半张']);
assert.equal(rows[1].quantity,91,'第一张漏识别时应使用第二张有效数量');
const stock=Object.fromEntries(names.map(name=>[name,0]));
assert.equal(ocr.buildStock(stock,rows)['特选苹果'],41);
assert.equal(ocr.buildStock(stock,rows)['哞哞鲜奶'],91);
assert.equal(stock['特选苹果'],0,'预览计算不得直接改动库存');
assert.throws(()=>ocr.buildStock({...stock,'美味尾巴':790},rows),/超出背包上限/);
const conflict=ocr.mergeObservations([
  {name:'特选苹果',quantity:41,source:'一',include:true},
  {name:'特选苹果',quantity:42,source:'二',include:true}
]);
assert.throws(()=>ocr.buildStock(stock,conflict),/数量不同/);
conflict[0].quantity=42;conflict[0].checked=true;
assert.equal(ocr.buildStock(stock,conflict)['特选苹果'],42);
assert.throws(()=>ocr.buildStock(stock,[{name:'特选苹果',quantity:'',include:true}]),/数量无效/);
assert.throws(()=>ocr.buildStock(stock,[...rows,{name:'暖暖姜',quantity:'',include:false}],{clearMissing:true}),/核对并勾选/);

const root=path.resolve(__dirname,'..'),sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
assert.ok(sw.includes("key!==OCR_CACHE"),'版本更新不得清除已经准备的离线识别包');
assert.ok(sw.includes("url.pathname.includes('/assets/ocr/')"),'离线资源应由专用缓存返回');
for(const asset of ocr.ASSETS)assert.ok(fs.existsSync(path.join(root,'assets/ocr',asset)),`离线识别缺少 ${asset}`);
console.log('inventory OCR tests passed');
