'use strict';

const assert=require('assert');
const picker=require('../pokemon-picker.js');
const catalog={pokemon:[{id:'bear',name:'童偶熊',pokedexId:759}]};
const mon={id:'60',speciesId:'bear',name:'童偶熊',nickname:'玉米熊',customNumber:'A-07',boxName:'食材盒',ingredients:'萌绿玉米×2',subs:'食材概率M'};

assert.strictEqual(picker.displayName(mon),'玉米熊');
assert.ok(picker.searchableText(mon).includes('a-07'));
assert.ok(picker.searchableText(mon).includes('萌绿玉米'));
assert.ok(picker.iconUrl(mon,catalog).endsWith('/759.png'));
assert.ok(picker.iconUrl({speciesId:'9006',name:'海豹球（节日）'},{pokemon:[{id:'9006',name:'海豹球（佳节）',pokedexId:9006}]}).endsWith('/363.png'),'特殊活动形态应使用基础形态图标兜底');

console.log('pokemon picker tests passed');
