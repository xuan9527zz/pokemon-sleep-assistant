'use strict';

const assert=require('node:assert/strict');
const timeline=require('../production-timeline.js');

assert.equal(timeline.stageFor(100).key,'81-150');
assert.equal(timeline.stageFor(80).key,'61-80');
assert.equal(timeline.stageFor(60).key,'41-60');
assert.equal(timeline.stageFor(40).key,'1-40');
assert.equal(timeline.stageFor(0).key,'0');
assert.equal(timeline.mealRecovery(85),1);
assert.equal(timeline.mealRecovery(5),9);
assert.equal(timeline.skillStorageCapacity('skill'),2);
assert.equal(timeline.skillStorageCapacity('ingredient'),1);

const helper=specialty=>({
  mon:{name:specialty,specialty,nature:'认真',subs:'—'},neutralIntervalSec:3600,carry:999,expectedItemsPerHelp:1,
  skillProbability:{effective:.5},skillEffect:null
});
const skill=timeline.simulate([helper('skill')],{durationHours:8,collectionHours:8,startEnergy:100});
const ingredient=timeline.simulate([helper('ingredient')],{durationHours:8,collectionHours:8,startEnergy:100});
assert.ok(skill.members[0].triggers>ingredient.members[0].triggers,'技能专长储存2次应比普通专长储存1次保留更多触发');

const cleared=timeline.simulate([helper('skill')],{durationHours:8,collectionHours:8,startEnergy:100,swapHours:[4],collectBeforeSwap:false});
const collected=timeline.simulate([helper('skill')],{durationHours:8,collectionHours:8,startEnergy:100,swapHours:[4],collectBeforeSwap:true});
assert.ok(cleared.members[0].lostTriggers>0,'换队前不点击应清空已储存技能');
assert.equal(collected.members[0].lostTriggers,0,'换队前点击不应丢失技能');
assert.ok(collected.members[0].triggers>cleared.members[0].triggers,'换队前点击应保留更多实际触发');

const day=timeline.simulate([helper('berry')],{durationHours:24,collectionHours:4,startEnergy:100,sleepScore:100});
assert.ok(day.members[0].stageMinutes['81-150']>0);
assert.ok(day.members[0].stageMinutes['61-80']>0);
assert.ok(day.members[0].stageMinutes['41-60']>0);
assert.equal(Object.values(day.members[0].stageMinutes).reduce((sum,value)=>sum+value,0),1440);

console.log('production timeline tests passed');
