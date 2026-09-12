'use strict';

const assert=require('assert');
const odds=require('../selection-odds.js');

assert.strictEqual(odds.SUBSKILLS.length,17,'副技能候选池必须保持17项');
assert.strictEqual(odds.medalStatus(5,9).rank,0);
assert.strictEqual(odds.medalStatus(5,10).label,'铜徽章');
assert.strictEqual(odds.medalStatus(5,40).toggleable,true);
assert.strictEqual(odds.medalStatus(5,100).maxLockedGold,3);
assert.deepStrictEqual(odds.medalStatus(16,25).thresholds,[10,25,50]);
assert.strictEqual(odds.medalStatus(30,40).label,'金徽章');

const lockedPair=odds.probabilityOfTargets(['树果数量S','帮手奖励'],{slotCount:2,lockedGold:2,mode:'all'});
assert.ok(Math.abs(lockedPair.probability-1/21)<1e-12,'前两格锁金时指定两个金技能应按金池无放回计算');
const lockedTriple=odds.probabilityOfTargets(['树果数量S','帮手奖励'],{slotCount:3,lockedGold:3,mode:'all'});
assert.ok(Math.abs(lockedTriple.probability-1/7)<1e-12,'前三格锁金时三格内出现指定两个金技能的概率应为1/7');
assert.strictEqual(odds.probabilityOfTargets(['食材概率M'],{slotCount:3,lockedGold:3,mode:'any'}).probability,0,'前三格锁金时蓝色技能不可出现');
assert.ok(odds.probabilityOfTargets(['树果数量S'],{slotCount:3,lockedGold:0}).probability>0);

const ingredientLocked=odds.graduationProbability('ingredient',{lockedGold:3,ingredientRoute:'panel'});
assert.strictEqual(ingredientLocked.probability,0,'前三格锁金时本站食材手Lv.50毕业面板不可达');
const berryLocked=odds.graduationProbability('berry',{lockedGold:3});
assert.ok(berryLocked.probability>0,'前三格锁金仍可通过速度性格满足树果位毕业面板');
const ingredientPanel=odds.graduationProbability('ingredient',{lockedGold:0,ingredientRoute:'panel'});
const ingredientAaa=odds.graduationProbability('ingredient',{lockedGold:0,ingredientRoute:'aaa'});
assert.ok(Math.abs(ingredientAaa.probability-ingredientPanel.probability/9)<1e-12,'AAA完整毕业率应在面板率上乘1/9路线概率');
assert.ok(odds.graduationProbability('healer',{lockedGold:0}).probability>0);

console.log('selection odds tests passed');
