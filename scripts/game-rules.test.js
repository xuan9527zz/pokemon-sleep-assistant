'use strict';

const assert=require('node:assert/strict');
const rules=require('../game-rules.js');

assert.equal(rules.LIMITS.helperLevel,70);
assert.equal(rules.LIMITS.recipeLevel,70);
assert.equal(rules.LIMITS.areaBonusPct,95);
assert.equal(rules.LIMITS.permanentPot,87);
assert.equal(rules.LIMITS.sleepStyleGoal,570);
assert.equal(rules.LIMITS.ingredientPocket,800);
assert.equal(rules.finalPotCapacity({baseCapacity:81,goodCamp:true}),122);
assert.equal(rules.finalPotCapacity({baseCapacity:21,skillBonus:10,goodCamp:true}),47);
assert.equal(rules.finalPotCapacity({baseCapacity:81,eventFlatBonus:30}),111);
assert.equal(rules.finalPotCapacity({baseCapacity:81,eventFlatBonus:30,weekend:true}),222);
assert.equal(rules.requiredCookingPower(47,{baseCapacity:21,goodCamp:true}),10);
assert.equal(rules.requiredCookingPower(999,{baseCapacity:81}),null);
assert.equal(rules.freshness('2026-11-17').stale,false);
assert.equal(rules.freshness('2026-12-02').stale,true);

console.log('game rules tests passed');
