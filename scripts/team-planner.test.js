'use strict';

const assert = require('assert');
const planner = require('../team-planner.js');

assert.strictEqual(planner.parseInterval('38:58'), 2338);
assert.strictEqual(planner.parseInterval('1:05:28'), 3928);

const slots = planner.parseIngredientSlots('甜甜蜜×2／甜甜蜜×5／好眠番茄×7', 52);
assert.deepStrictEqual(slots.unlocked.map(item => item.quantity), [2, 5]);
assert.deepStrictEqual(slots.locked.map(item => item.quantity), [7]);

const latias = { name: '拉帝亚斯' };
const latios = { name: '拉帝欧斯' };
const suicune = { name: '水君' };
assert.strictEqual(planner.validateSpecialTeam([latias, latios]).valid, true);
assert.strictEqual(planner.validateSpecialTeam([latias, suicune]).valid, false);

const venusaur = {
  id: '1', name: '妙蛙花', lv: '52', interval: '38:58', inv: '33', specialty: 'ingredient',
  ingredients: '甜甜蜜×2／甜甜蜜×5／好眠番茄×7', subs: '帮手奖励；食材概率M；帮忙速度S；树果数量S；持有上限M',
  nature: '坦率', main: '食材获取S Lv.3'
};
const gardevoir = {
  id: '73', name: '沙奈朵', lv: '45', interval: '36:39', inv: '26', specialty: 'skill',
  ingredients: '特选苹果×1／特选苹果×2／粗枝大葱×2', subs: '睡眠EXP奖励；帮忙速度M；技能概率S；梦之碎片奖励；帮忙速度S',
  nature: '固执：速度↑ 食材↓', main: '活力全体疗愈S Lv.6'
};
const rates = {
  '1': { ingredientRate: .266, baseBerryCount: 1 },
  '73': { ingredientRate: .144, baseBerryCount: 1 }
};
const result = planner.calculateTeam([venusaur, gardevoir], rates, { goodCamp: true, energyProfile: 'average' });
assert.strictEqual(result.valid, true);
assert.strictEqual(result.helpingBonusCount, 1);
assert.ok(result.collectionHours >= .5 && result.collectionHours <= 4);
assert.ok(result.ingredients.some(item => item.name === '甜甜蜜'));
assert.ok(result.members.every(member => Number.isFinite(member.fullHours) && member.fullHours > 0));
assert.ok(result.members[0].effectiveIntervalSec < planner.parseInterval(venusaur.interval));

const noCamp = planner.calculateTeam([venusaur], rates, { goodCamp: false, energyProfile: 'average' });
const camp = planner.calculateTeam([venusaur], rates, { goodCamp: true, energyProfile: 'average' });
assert.ok(camp.members[0].carry > noCamp.members[0].carry);
assert.ok(camp.members[0].effectiveIntervalSec < noCamp.members[0].effectiveIntervalSec);

const firstSaved = planner.upsertSavedTeam([], ['1', '2', '3', '4', '5'], {
  goodCamp: false, energyProfile: 'steady', savedAt: '2026-08-30T00:00:00.000Z'
});
assert.strictEqual(firstSaved.ok, true);
assert.strictEqual(firstSaved.created, true);
assert.strictEqual(firstSaved.teams.length, 1);
assert.strictEqual(firstSaved.team.name, '队伍 1');
assert.strictEqual(firstSaved.team.goodCamp, false);

const updatedSaved = planner.upsertSavedTeam(firstSaved.teams, ['1', '2', '3', '4', '5'], {
  goodCamp: true, energyProfile: 'average', savedAt: '2026-08-30T01:00:00.000Z'
});
assert.strictEqual(updatedSaved.created, false);
assert.strictEqual(updatedSaved.teams.length, 1);
assert.strictEqual(updatedSaved.team.goodCamp, true);

let tenTeams = updatedSaved.teams;
for (let teamIndex = 2; teamIndex <= 10; teamIndex++) {
  const start = teamIndex * 10;
  const saved = planner.upsertSavedTeam(tenTeams, [start, start + 1, start + 2, start + 3, start + 4].map(String));
  assert.strictEqual(saved.ok, true);
  tenTeams = saved.teams;
}
assert.strictEqual(tenTeams.length, planner.MAX_SAVED_TEAMS);
const overLimit = planner.upsertSavedTeam(tenTeams, ['201', '202', '203', '204', '205']);
assert.strictEqual(overLimit.ok, false);
assert.strictEqual(overLimit.reason, 'limit');
assert.strictEqual(planner.upsertSavedTeam([], ['1', '2']).reason, 'incomplete');
assert.strictEqual(planner.sameLineup(['1', '2'], ['1', '2']), true);
assert.strictEqual(planner.sameLineup(['1', '2'], ['2', '1']), false);

console.log('team-planner tests passed');
