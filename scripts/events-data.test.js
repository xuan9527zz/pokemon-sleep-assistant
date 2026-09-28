'use strict';

const assert=require('node:assert/strict');
const events=require('../events-data.js');

assert.equal(events.ACTIVITY_PROFILES.mewtwo1.favoriteBerry,'芒芒果');
assert.equal(events.ACTIVITY_PROFILES.goodSleep39.universalSleepMultiplier,1.5);
assert.equal(events.phaseAt('2026-09-28T12:00:00+09:00').id,'good-sleep');
assert.equal(events.phaseAt('2026-09-30T12:00:00+09:00').id,'exchange');
assert.equal(events.phaseAt('2026-10-02T12:00:00+09:00').id,'conversion');
assert.equal(events.phaseAt('2026-10-04T12:00:00+09:00').id,'ended');
const countdown=events.countdownAt('2026-09-29T03:00:00+09:00');
assert.equal(countdown.phase.id,'good-sleep');
assert.equal(countdown.hours,1);
assert.ok(events.EVENT_GUIDE.mewtwo.facts.some(text=>text.includes('0.6／0.8／1.0／1.2／1.6／2.0')));

console.log('event data tests passed');
