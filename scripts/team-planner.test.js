'use strict';

const assert = require('assert');
const planner = require('../team-planner.js');
const levels = require('../level-manager.js');

assert.strictEqual(planner.parseInterval('38:58'), 2338);
assert.strictEqual(planner.parseInterval('1:05:28'), 3928);

const slots = planner.parseIngredientSlots('甜甜蜜×2／甜甜蜜×5／好眠番茄×7', 52);
assert.deepStrictEqual(slots.unlocked.map(item => item.quantity), [2, 5]);
assert.deepStrictEqual(slots.locked.map(item => item.quantity), [7]);
const legacySlots = planner.parseIngredientSlots('牛奶×2／苹果×5／玉米×7', 60);
assert.deepStrictEqual(
  legacySlots.unlocked.map(item => item.name),
  ['哞哞鲜奶', '特选苹果', '萌绿玉米'],
  '旧盒子数据的食材简称应在产量与预算计算前统一成正式名称'
);

const latias = { name: '拉帝亚斯' };
const latios = { name: '拉帝欧斯' };
const suicune = { name: '水君' };
assert.strictEqual(planner.validateSpecialTeam([latias, latios]).valid, true);
assert.strictEqual(planner.validateSpecialTeam([latias, suicune]).valid, false);
assert.strictEqual(planner.validateBattleTeam([{name:'闪光收藏',battleEligible:false}]).valid,false);

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
const catalogFallback=planner.ingredientProbability({...venusaur,ingredientRate:.31,baseBerryCount:2});
assert.strictEqual(catalogFallback.base,.31,'new records should use catalog ingredient rate without a box snapshot');
assert.strictEqual(catalogFallback.provisional,false,'catalog ingredient rate is not provisional');
const result = planner.calculateTeam([venusaur, gardevoir], rates, { goodCamp: true, energyProfile: 'average' });
assert.strictEqual(result.valid, true);
assert.strictEqual(result.helpingBonusCount, 1);
assert.ok(result.collectionHours >= .5 && result.collectionHours <= 4);
assert.ok(result.ingredients.some(item => item.name === '甜甜蜜'));
assert.ok(result.members.every(member => Number.isFinite(member.fullHours) && member.fullHours > 0));
assert.ok(result.members[0].effectiveIntervalSec < planner.parseInterval(venusaur.interval));
assert.strictEqual(planner.helpingSpeedReduction(venusaur), .07);
assert.ok(result.members[0].combinedSpeedReduction <= .35);

const effectiveVenusaur = {...venusaur,effectiveSubs:'帮手奖励；食材概率M；帮忙速度M；树果数量S；持有上限M'};
assert.strictEqual(planner.helpingSpeedReduction(effectiveVenusaur), .14);
assert.ok(Math.abs(planner.helpingBonusOutputMultiplier({...gardevoir,subs:'睡眠EXP奖励；技能概率S'},1)-(1/.95))<1e-9,'one Helping Bonus should increase a neutral member output by 1/0.95');
assert.ok(Math.abs(planner.helpingBonusOutputMultiplier(effectiveVenusaur,1)-(.86/.81))<1e-9,'Helping Bonus should stack with the member own speed reduction multiplicatively through interval');
assert.ok(Math.abs(planner.helpingBonusOutputMultiplier(effectiveVenusaur,5)-(.86/.65))<1e-9,'speed reduction should stop at the combined 35% cap');
const collectionResult=planner.calculateTeam([{...gardevoir,battleEligible:false}],rates,{goodCamp:false,energyProfile:'average'});
assert.strictEqual(collectionResult.valid,false);
assert.ok(collectionResult.validation.message.includes('仅收藏'));
assert.strictEqual(collectionResult.selectedCount,0,'仅收藏成员不应计入实战人数');
assert.strictEqual(collectionResult.members.length,0,'仅收藏成员不应产生当前队伍收益');
assert.strictEqual(collectionResult.ingredients.length,0,'仅收藏成员不应产生食材收益');

const noCamp = planner.calculateTeam([venusaur], rates, { goodCamp: false, energyProfile: 'average' });
const camp = planner.calculateTeam([venusaur], rates, { goodCamp: true, energyProfile: 'average' });
assert.ok(camp.members[0].carry > noCamp.members[0].carry);
assert.ok(camp.members[0].effectiveIntervalSec < noCamp.members[0].effectiveIntervalSec);

const stufful = {
  id:'94',name:'童偶熊',lv:'15',interval:'1:06:25',inv:'13',specialty:'ingredient',
  ingredients:'玉米×2／豆制肉×6／玉米×7',subs:'树果数量S；食材概率S；食材概率M；持有上限S；持有上限M',
  nature:'浮躁',main:'能量填充S Lv.1'
};
const comfey = {
  id:'95',name:'花疗环环',lv:'35',interval:'38:50',inv:'27',specialty:'ingredient',
  ingredients:'玉米×2／玉米×5／可可×7',subs:'持有上限S；技能概率S；帮忙速度S；食材概率S；食材概率M',
  nature:'马虎：食材↑ 技能↓',main:'活力疗愈S Lv.1'
};
const stuffulMember=planner.calculateMember(stufful,{ingredientRate:.225,baseBerryCount:1},{goodCamp:true,energyProfile:'average',teammateHelpingBonusCount:0});
const comfeyMember=planner.calculateMember(comfey,{ingredientRate:.167,baseBerryCount:1},{goodCamp:true,energyProfile:'average',teammateHelpingBonusCount:0});
const ingredientTotal=(result,name)=>result.member.ingredients.filter(item=>item.name===name).reduce((total,item)=>total+item.perDay,0);
assert.strictEqual(stuffulMember.valid,true);
assert.strictEqual(comfeyMember.valid,true);
assert.ok(ingredientTotal(comfeyMember,'萌绿玉米')>ingredientTotal(stuffulMember,'萌绿玉米'),'当前盒子的花疗环环每天玉米产量应高于童偶熊');
const boostedComfey=planner.calculateMember(comfey,{ingredientRate:.167,baseBerryCount:1},{goodCamp:true,energyProfile:'average',teammateHelpingBonusCount:4});
assert.ok(ingredientTotal(boostedComfey,'萌绿玉米')>ingredientTotal(comfeyMember,'萌绿玉米'),'其他队友的帮手奖励应提升目标个体产出');
assert.ok(boostedComfey.member.combinedSpeedReduction<=.35,'单成员对比同样必须遵守35%速度缩减上限');

const beforeLevelUpdateInterval = noCamp.members[0].baseIntervalSec;
levels.applyLevel(venusaur, 60);
const afterLevelUpdate = planner.calculateTeam([venusaur], rates, { goodCamp: false, energyProfile: 'average' });
assert.ok(afterLevelUpdate.members[0].baseIntervalSec < beforeLevelUpdateInterval);
assert.strictEqual(afterLevelUpdate.members[0].mon.lv, '60');

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
