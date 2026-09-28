'use strict';

const assert=require('node:assert/strict');
const guide=require('../species-tier-guide.js');
const tiers=require('../skills/pokemon-sleep-scoring/scripts/species-tiers.js');
const catalog=require('../pokemon-catalog.generated.js');

const result=guide.buildGuide(tiers,catalog);
assert.deepEqual(result.sections.map(section=>section.category),['berry','ingredient','skill','special']);
const section=category=>result.sections.find(item=>item.category===category);
const group=(category,tier)=>section(category).groups.find(item=>item.tier===tier);
assert.ok(group('berry','S').entries.some(entry=>entry.name==='帝牙海狮'),'树果S缺少帝牙海狮');
assert.ok(group('ingredient','S').entries.some(entry=>entry.name==='锹农炮虫'),'食材S缺少锹农炮虫');
assert.ok(group('skill','S').entries.some(entry=>entry.name==='咚咚鼠'),'技能S缺少咚咚鼠');
assert.ok(group('special','B').entries.some(entry=>entry.name==='超梦'),'特殊B缺少超梦');
assert.ok(group('special','S').entries.some(entry=>entry.name==='梦幻（树果骤增）'),'梦幻树果骤增应显示为特殊S');
assert.ok(group('special','B').entries.some(entry=>entry.name==='梦幻（其他技能）'),'梦幻其他技能应显示为特殊B');
const gourgeist=group('ingredient','S').entries.find(entry=>entry.name==='南瓜怪人');
assert.equal(gourgeist.formCount,4,'南瓜怪人四种体型应合并显示');
assert.deepEqual(gourgeist.ids,['711-1','711-2','711-3','711-4']);
assert.equal(group('skill','C').entries.length,0,'技能C应保留空档说明，而不是另造名单');
assert.equal(guide.collapseEntries([{id:'1',name:'同名'},{id:'2',name:'同名'}])[0].formCount,2);

console.log('species tier guide tests passed (shared source, categories, Mew variants and form collapse)');
