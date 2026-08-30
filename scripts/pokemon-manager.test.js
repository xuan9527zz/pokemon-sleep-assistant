'use strict';

const assert = require('node:assert/strict');
const manager = require('../pokemon-manager.js');
const nature = require('../skills/pokemon-sleep-scoring/scripts/nature-scores.js');
const catalog = require('../pokemon-catalog.generated.js');

const bulbasaur = catalog.pokemon.find(record => record.id === '1');
const base = manager.computedStats(bulbasaur, 1, '认真', ['—','—','—','—','—'], nature);
assert.equal(base.interval, '1:13:20');
assert.equal(base.carry, bulbasaur.carryLimitRaisedFromFirstStage);

const trained = manager.computedStats(bulbasaur, 70, '固执', ['帮忙速度S','持有上限M','帮忙速度M','—','—'], nature);
assert.ok(trained.interval !== base.interval);
assert.ok(trained.carry > base.carry);
assert.ok(Math.abs(trained.speedReduction-.21)<1e-9);
assert.equal(manager.mainSkillCap('食材获取S'), 7);
assert.equal(manager.mainSkillCap('活力全体疗愈S'), 6);

console.log('pokemon entry derivation tests passed');
