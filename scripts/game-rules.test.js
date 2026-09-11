'use strict';

const assert=require('node:assert/strict');
const rules=require('../game-rules.js');

assert.equal(rules.LIMITS.helperLevel,70);
assert.equal(rules.LIMITS.recipeLevel,70);
assert.equal(rules.LIMITS.areaBonusPct,85);
assert.equal(rules.LIMITS.permanentPot,81);
assert.equal(rules.LIMITS.ingredientPocket,800);
assert.equal(rules.finalPotCapacity({baseCapacity:81,goodCamp:true}),122);
assert.equal(rules.finalPotCapacity({baseCapacity:21,skillBonus:10,goodCamp:true}),47);
assert.equal(rules.requiredCookingPower(47,{baseCapacity:21,goodCamp:true}),10);
assert.equal(rules.requiredCookingPower(999,{baseCapacity:81}),null);
assert.equal(rules.freshness('2026-09-12').stale,false);
assert.equal(rules.freshness('2026-09-26').stale,true);

console.log('game rules tests passed');
