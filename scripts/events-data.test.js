'use strict';

const assert=require('node:assert/strict');
const events=require('../events-data.js');

assert.equal(events.ACTIVITY_PROFILES.mewtwo1.favoriteBerry,'芒芒果');
assert.equal(events.ACTIVITY_PROFILES.goodSleep39.universalSleepMultiplier,1.5);
assert.equal(events.phaseAt('2026-09-28T12:00:00+09:00').id,'good-sleep');
assert.equal(events.phaseAt('2026-09-30T12:00:00+09:00').id,'exchange');
assert.equal(events.phaseAt('2026-10-02T12:00:00+09:00').id,'conversion');
assert.equal(events.phaseAt('2026-10-04T12:00:00+09:00').id,'cooking-before');
assert.equal(events.phaseAt('2026-10-05T04:00:00+09:00').id,'cooking');
assert.equal(events.phaseAt('2026-10-12T04:00:00+09:00').id,'ended');
const countdown=events.countdownAt('2026-09-29T03:00:00+09:00');
assert.equal(countdown.phase.id,'good-sleep');
assert.equal(countdown.hours,1);
assert.equal(events.bonusAt('2026-09-27T03:59:59+09:00').id,'sleep-first');
assert.equal(events.bonusAt('2026-09-27T04:00:00+09:00').id,'sleep-full');
assert.ok(events.bonusAt('2026-09-27T12:00:00+09:00').badges.includes('睡意之力 ×2'));
assert.equal(events.bonusAt('2026-09-28T04:00:00+09:00').id,'sleep-last');
assert.equal(events.bonusAt('2026-09-29T03:59:59+09:00').id,'sleep-last');
assert.equal(events.bonusAt('2026-09-29T04:00:00+09:00').id,'cooking-upcoming');
assert.ok(!events.bonusAt('2026-09-29T12:00:00+09:00').badges.some(text=>text.includes('睡意之力')));
assert.equal(events.bonusAt('2026-10-11T03:59:59+09:00').id,'cooking-normal');
assert.equal(events.bonusAt('2026-10-11T04:00:00+09:00').id,'cooking-sunday');
assert.ok(events.bonusAt('2026-10-11T12:00:00+09:00').badges.includes('锅容量 ×4'));
assert.equal(events.bonusAt('2026-10-12T04:00:00+09:00').id,'snapshot-ended');
assert.ok(!events.plansAt('2026-09-29T12:00:00+09:00').some(plan=>plan.id==='sleep'));
assert.ok(!events.plansAt('2026-10-02T12:00:00+09:00').some(plan=>plan.id==='exchange'));
assert.ok(events.SOURCES.cookingWeek3.startsWith('https://www.pokemonsleep.net/'));
assert.ok(events.EVENT_GUIDE.mewtwo.facts.some(text=>text.includes('0.6／0.8／1.0／1.2／1.6／2.0')));

console.log('event data tests passed');
