'use strict';

const assert=require('assert');
const picker=require('../pokemon-picker.js');
const fullCatalog=require('../pokemon-catalog.generated.js');
const catalog={pokemon:[{id:'bear',name:'童偶熊',pokedexId:759}]};
const mon={id:'60',speciesId:'bear',name:'童偶熊',nickname:'玉米熊',customNumber:'A-07',boxName:'食材盒',ingredients:'萌绿玉米×2',subs:'食材概率M'};

assert.strictEqual(picker.displayName(mon),'玉米熊');
assert.ok(picker.searchableText(mon).includes('a-07'));
assert.ok(picker.searchableText(mon).includes('萌绿玉米'));
assert.ok(picker.iconUrl(mon,catalog).endsWith('/759.png'));
assert.ok(picker.iconUrl({speciesId:'9006',name:'海豹球（节日）'},{pokemon:[{id:'9006',name:'海豹球（佳节）',pokedexId:9006}]}).endsWith('/363.png'),'特殊活动形态应使用基础形态图标兜底');
assert.ok(picker.iconUrl({name:'皮卡丘（巫师帽）'},{}).endsWith('/25.png'),'仅有名称时也应识别活动形态图标');
assert.ok(picker.iconUrl({name:'皮卡丘（船长）'},{}).endsWith('/25.png'),'仅有名称时也应识别图鉴采用的活动形态名称');
assert.ok(picker.iconUrl({name:'乌波（帕底亚）'},{}).endsWith('/10253.png'),'地区形态应显示对应图标');

const expectedFormSprites={
  '7006':10103,'7007':10104,'7054':10253,'8001':10184,
  '710-1':710,'710-2':10027,'710-3':10028,'710-4':10029,
  '711-1':711,'711-2':10030,'711-3':10031,'711-4':10032
};
fullCatalog.pokemon.forEach(row=>{
  const url=picker.iconUrl({speciesId:row.id,name:row.name},fullCatalog);
  assert.ok(url,`${row.id} ${row.name} 应有图标`);
  const expected=expectedFormSprites[row.id]||picker.SPRITE_SPECIES_IDS[row.id]||row.pokedexId;
  assert.ok(url.endsWith(`/${expected}.png`),`${row.id} ${row.name} 图标应为 ${expected}，实际 ${url}`);
});
assert.equal(fullCatalog.pokemon.length,fullCatalog.meta.count,'全图鉴图标审计必须覆盖每一条目录记录');

console.log('pokemon picker tests passed');
