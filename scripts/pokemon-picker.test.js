'use strict';

const assert=require('assert');
const fs=require('fs');
const path=require('path');
const picker=require('../pokemon-picker.js');
const fullCatalog=require('../pokemon-catalog.generated.js');
const catalog={pokemon:[{id:'bear',name:'童偶熊',pokedexId:759}]};
const mon={id:'60',speciesId:'bear',name:'童偶熊',nickname:'玉米熊',customNumber:'A-07',boxName:'食材盒',ingredients:'萌绿玉米×2',subs:'食材概率M'};

assert.strictEqual(picker.displayName(mon),'玉米熊');
assert.ok(picker.searchableText(mon).includes('a-07'));
assert.ok(picker.searchableText(mon).includes('萌绿玉米'));
assert.ok(picker.iconUrl(mon,catalog).endsWith('/bear.png'));
assert.ok(picker.iconUrl({speciesId:'9006',name:'海豹球（节日）'},{pokemon:[{id:'9006',name:'海豹球（佳节）',pokedexId:9006}]}).endsWith('/9006.png'),'特殊活动形态应使用本地独立图标');
assert.ok(picker.iconUrl({name:'皮卡丘（巫师帽）'},{}).endsWith('/9001-1.png'),'仅有名称时也应识别活动形态图标');
assert.ok(picker.iconUrl({name:'皮卡丘（船长）'},{}).endsWith('/9007.webp'),'仅有名称时也应识别图鉴采用的活动形态名称与文件格式');
assert.ok(picker.iconUrl({name:'乌波（帕底亚）'},{}).endsWith('/7054.png'),'地区形态应显示对应本地图标');

fullCatalog.pokemon.forEach(row=>{
  const url=picker.iconUrl({speciesId:row.id,name:row.name},fullCatalog);
  assert.ok(url,`${row.id} ${row.name} 应有图标`);
  const extension=picker.LOCAL_EXTENSIONS[row.id]||'png';
  assert.ok(url.endsWith(`/${row.id}.${extension}`),`${row.id} ${row.name} 应使用同 ID 的本地图标，实际 ${url}`);
  assert.ok(fs.existsSync(path.resolve(__dirname,'..',url.replace(/^\.\//,''))),`${row.id} ${row.name} 缺少本地图标文件`);
});
assert.equal(fullCatalog.pokemon.length,fullCatalog.meta.count,'全图鉴图标审计必须覆盖每一条目录记录');
assert.ok(!picker.iconUrl(mon,catalog).startsWith('http'),'页面运行时不得再请求远端宝可梦图标');

console.log('pokemon picker tests passed');
