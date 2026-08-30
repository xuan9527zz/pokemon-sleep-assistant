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
