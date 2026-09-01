'use strict';

const assert=require('node:assert/strict');
const strategy=require('../pokemon-strategy.js');

const flygon=strategy.strategicAdjustment('330',61);
assert.equal(flygon.strategicBonus,8);
assert.equal(flygon.adjustedScore,69);
assert.equal(flygon.profile.ingredient,'嫩亮酪梨');
const meowscarada=strategy.strategicAdjustment('908',74);
assert.equal(meowscarada.strategicBonus,0,'an already healthy mechanical score should not receive a duplicate strategic bonus');

const berryStandard=strategy.minimumStandard({specialty:'berry',subs:'树果数量S；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'154',specialty:'berry'});
assert.equal(berryStandard.meetsGraduation,true);
const ingredientStandard=strategy.minimumStandard({specialty:'ingredient',ingredients:'嫩亮酪梨×2／嫩亮酪梨×5／嫩亮酪梨×7',subs:'食材概率S；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'330',specialty:'ingredient'});
assert.equal(ingredientStandard.meetsMinimum,true,'seedable Ingredient Finder S should satisfy the core requirement when M is absent');
assert.equal(ingredientStandard.routeMatch,true);
assert.ok(strategy.targetsForIsland('白花雪原').some(row=>row.id==='365'));
assert.ok(strategy.targetsForIsland('天青沙滩 EX').length>0);

console.log('pokemon strategy tests passed');
