'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const levels = require('../level-manager.js');

assert.strictEqual(levels.normalizeLevel(1), 1);
assert.strictEqual(levels.normalizeLevel('70'), 70);
assert.strictEqual(levels.normalizeLevel(0), null);
assert.strictEqual(levels.normalizeLevel(71), null);
assert.strictEqual(levels.clampLevel(99), 70);

const venusaur = {
  id: '1', name: '妙蛙花', lv: '52', interval: '38:58', inv: '33',
  subs: '帮手奖励；食材概率M；帮忙速度S；树果数量S；持有上限M'
};
const same = levels.calculateLevelState(venusaur, 52);
assert.strictEqual(same.interval, '38:58');
assert.strictEqual(same.inventory, 33);

const beforeSpeedUnlock = levels.calculateLevelState(venusaur, 49);
assert.ok(beforeSpeedUnlock.intervalSec > same.intervalSec, '降到速度S解锁前应增加帮忙间隔');
const atBerryUnlock = levels.calculateLevelState(venusaur, 70);
assert.ok(atBerryUnlock.unlockedSubskills.includes('树果数量S'));
assert.ok(atBerryUnlock.intervalSec < same.intervalSec);

const inventoryMon = {
  id: '19', name: '三合一磁怪', lv: '20', interval: '1:08:56', inv: '16',
  subs: '技能等级S；帮手奖励；持有上限S；食材概率M；帮忙速度M'
};
assert.strictEqual(levels.calculateLevelState(inventoryMon, 49).inventory, 16);
assert.strictEqual(levels.calculateLevelState(inventoryMon, 50).inventory, 22);
assert.ok(levels.calculateLevelState(inventoryMon, 70).intervalSec < levels.calculateLevelState(inventoryMon, 69).intervalSec);

const originalSp = venusaur.sp = '2961';
const applied = levels.applyLevel(venusaur, 60);
assert.strictEqual(venusaur.lv, '60');
assert.strictEqual(venusaur.sp, originalSp);
assert.strictEqual(venusaur.interval, applied.interval);
assert.ok(venusaur.levelOutputMultiplier > 1);

const normalized = levels.normalizeOverrides({
  1: { level: 60, updatedAt: '2026-08-30T00:00:00.000Z' },
  2: { level: 71 },
  999: { level: 20 }
}, ['1', '2']);
assert.deepStrictEqual(normalized, {'1': {level: 60, updatedAt: '2026-08-30T00:00:00.000Z'}});

const squirtle = {id:'3',name:'杰尼龟',lv:'16',interval:'1:02:55',inv:'17',subs:'帮忙速度S；持有上限S；—；—；—'};
levels.applyOverrides([squirtle], {'3': {level:30,updatedAt:''}});
assert.strictEqual(squirtle.lv,'30');
assert.ok(levels.unlockedSubskills(squirtle,30).includes('持有上限S'));
assert.strictEqual(Number(squirtle.inv),23);

const actualUpgrade = {
  id:'100',name:'实际升级测试',lv:'30',interval:'50:00',inv:'20',
  subs:'帮忙速度S；持有上限S；—；—；—',
  effectiveSubs:'帮忙速度M；持有上限M；—；—；—'
};
const actualState = levels.calculateLevelState(actualUpgrade,30);
assert.ok(actualState.intervalSec < 3000,'实际速度S→M应缩短当前间隔');
assert.strictEqual(actualState.inventory,26,'实际持有S→M应在原始持有上限上增加6');
assert.deepStrictEqual(levels.unlockedSubskills(actualUpgrade,30),['帮忙速度M','持有上限M']);

const evolutionCatalog = {pokemon:[
  {id:'1',name:'妙蛙种子',stage:1,helpFrequencyBaseSec:4400,carryLimitBase:11,defaultFinalId:'3',finalOptions:['3'],mainSkill:{name:'食材获取S'},evolution:{next:[{id:'2'}]}},
  {id:'2',name:'妙蛙草',stage:2,helpFrequencyBaseSec:3300,carryLimitBase:14,defaultFinalId:'3',finalOptions:['3'],mainSkill:{name:'食材获取S'},evolution:{next:[{id:'3'}]}},
  {id:'3',name:'妙蛙花',stage:3,helpFrequencyBaseSec:2800,carryLimitBase:17,defaultFinalId:'3',finalOptions:['3'],mainSkill:{name:'食材获取S'},evolution:{next:[]}},
  {id:'133',name:'伊布',stage:1,helpFrequencyBaseSec:3700,carryLimitBase:12,defaultFinalId:'700',finalOptions:['134','700'],mainSkill:{name:'食材获取S'},evolution:{next:[{id:'134'},{id:'700'}]}},
  {id:'134',name:'水伊布',stage:2,helpFrequencyBaseSec:3100,carryLimitBase:13,defaultFinalId:'134',finalOptions:['134'],mainSkill:{name:'食材获取S'},evolution:{next:[]}},
  {id:'700',name:'仙子伊布',stage:2,helpFrequencyBaseSec:2600,carryLimitBase:15,defaultFinalId:'700',finalOptions:['700'],mainSkill:{name:'活力全体疗愈S'},evolution:{next:[]}}
]};
const bulbasaur={id:'e1',recordId:'record-e1',speciesId:'1',finalFormId:'3',name:'妙蛙种子',lv:'12',interval:'1:00:00',inv:'11',main:'食材获取S Lv.1',subs:'—；—；—；—；—',nature:'认真'};
assert.strictEqual(levels.evolutionTarget(bulbasaur,evolutionCatalog).target.name,'妙蛙草');
const ivysaur=levels.evolutionRecord(bulbasaur,evolutionCatalog,'2026-09-21T00:00:00.000Z');
assert.strictEqual(ivysaur.speciesId,'2');
assert.strictEqual(ivysaur.name,'妙蛙草');
assert.strictEqual(ivysaur.finalFormId,'3');
assert.strictEqual(ivysaur.main,'食材获取S Lv.2');
assert.strictEqual(ivysaur.interval,'45:00');
assert.strictEqual(ivysaur.inv,'19');
const venusaurEvolution=levels.evolutionRecord(ivysaur,evolutionCatalog);
assert.strictEqual(venusaurEvolution.name,'妙蛙花');
assert.strictEqual(venusaurEvolution.main,'食材获取S Lv.3');
assert.strictEqual(venusaurEvolution.inv,'27');
assert.strictEqual(levels.evolutionRecord(venusaurEvolution,evolutionCatalog),null);
const eevee={...bulbasaur,speciesId:'133',finalFormId:'700',name:'伊布',interval:'1:01:40',inv:'12'};
assert.strictEqual(levels.evolutionTarget(eevee,evolutionCatalog).target.name,'仙子伊布','分支进化必须遵循已选择的最终形态');
assert.strictEqual(levels.evolutionRecord(eevee,evolutionCatalog).main,'活力全体疗愈S Lv.2');

const html = fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8');
const rawMatch = html.match(/const raw=`([\s\S]*?)`;\s*const cols=/);
assert.ok(rawMatch, '应能读取盒子原始数据');
const columns = ['id','name','sp','lv','shiny','ingredients','interval','inv','main','subs','nature','priority','note'];
const box = rawMatch[1].trim().split('\n').map(line => Object.fromEntries(line.split('|').map((value,index) => [columns[index],value||''])));
assert.strictEqual(box.length, 97);
box.forEach(mon => {
  const current = levels.calculateLevelState(mon, Number(mon.lv));
  assert.strictEqual(current.interval, mon.interval, `#${mon.id} 当前等级不应改变原始间隔`);
  assert.strictEqual(current.inventory, Number(mon.inv), `#${mon.id} 当前等级不应改变原始持有`);
  assert.ok(Number.isFinite(levels.calculateLevelState(mon, 70).intervalSec));
});

console.log('level-manager tests passed');
