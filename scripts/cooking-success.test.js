'use strict';

const assert=require('node:assert/strict');
const cooking=require('../cooking-success.js');

assert.equal(cooking.bonusPctPerTrigger({mainSkillId:14,main:'料理成功S Lv.6'},6),10);
assert.equal(cooking.bonusPctPerTrigger({mainSkillId:11,main:'料理强化S Lv.7'},7),0,'扩锅技能不能被识别为爆锅技能');

const weekday=cooking.mealOutcome({bonusPct:70});
assert.ok(Math.abs(weekday.critProbability-.8)<1e-12);
assert.equal(weekday.critMultiplier,2);
assert.ok(Math.abs(weekday.expectedMultiplier-1.8)<1e-12);
const sunday=cooking.mealOutcome({bonusPct:70,isSunday:true});
assert.equal(sunday.critProbability,1);
assert.equal(sunday.critMultiplier,3);
assert.equal(sunday.expectedMultiplier,3);

const estimate=cooking.deploymentEstimate([{triggersPerHour:.2,bonusPctPerTrigger:10}],{targetBonusPct:70,confidence:.8});
assert.ok(estimate.medianHours>0);
assert.ok(estimate.safeHours>estimate.medianHours);
assert.ok(estimate.probabilityAtTarget>=.8-.000001);
assert.ok(estimate.expectedBonus<70,'80%把握时间仍应保留随机未蓄满的分布，不能伪装成必定满层');
assert.equal(cooking.deploymentEstimate([],{currentBonusPct:0,targetBonusPct:0}).safeHours,0);

console.log('cooking success tests passed');
