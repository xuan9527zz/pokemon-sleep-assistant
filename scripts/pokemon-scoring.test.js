'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const boxScoring = require('../skills/pokemon-sleep-scoring/scripts/box-scores.js');
const dynamicScoring = require('../pokemon-scoring.js');
const catalog = require('../pokemon-catalog.generated.js');
const allRounderRules = require('../all-rounder-rules.js');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const rows = boxScoring.parseBoxRows(html);
require('../box-scores.generated.js');
const snapshot = globalThis.POKEMON_SLEEP_BOX_SCORES.scores;

assert.equal(catalog.pokemon.length, 247);
assert.equal(rows.length, 97);

rows.forEach(row => {
  const actual = dynamicScoring.scorePokemon(row);
  const expected = snapshot[row.id];
  assert.equal(actual.speciesScore, expected.speciesScore, `species score #${row.id}`);
  assert.equal(actual.individualScore, expected.individualScore, `individual score #${row.id}`);
  assert.equal(actual.finalScore, expected.finalScore, `final score #${row.id}`);
});

const bulbasaur = catalog.pokemon.find(record => record.id === '1');
const newPokemon = {
  id: '98',
  name: bulbasaur.name,
  speciesId: '1',
  finalFormId: '3',
  ingredients: '甜甜蜜×2／甜甜蜜×5／甜甜蜜×7',
  subskills: '帮手奖励；食材概率S；食材概率M；帮忙速度M；帮忙速度S',
  nature: '认真'
};
const newScore = dynamicScoring.scorePokemon(newPokemon);
assert.equal(newScore.finalFormId, '3');
assert.equal(newScore.individual.subskillScore, 100);
assert.equal(newScore.individual.ingredientPattern, 'AAA');
assert.ok(Number.isFinite(newScore.finalScore));

const allRounderPanel = {
  id: 'all-test',
  name: '梦幻',
  speciesId: '151',
  ingredients: '特选蛋×2／特选蛋×4／特选蛋×6',
  subskills: '帮手奖励；技能概率M；帮忙速度M；树果数量S；食材概率M',
  nature: '认真',
  main: '十项全能 Lv.8'
};
const metronomeScore = dynamicScoring.scorePokemon(allRounderRules.apply(allRounderPanel, 'metronome'));
const healerScore = dynamicScoring.scorePokemon(allRounderRules.apply(allRounderPanel, 'e4e'));
const berryBurstScore = dynamicScoring.scorePokemon(allRounderRules.apply(allRounderPanel, 'berry-burst'));
assert.equal(metronomeScore.speciesScore, 64.9);
assert.equal(healerScore.speciesScore, 84.3);
assert.equal(berryBurstScore.speciesScore, 73.2);
assert.equal(metronomeScore.individualScore, 70);
assert.equal(healerScore.individualScore, metronomeScore.individualScore, '切换十项全能只应改变物种技能场景，不应改写同一个体面板');
assert.ok([metronomeScore, healerScore, berryBurstScore].every(score => Number.isFinite(score.finalScore)));

const darkraiScore = dynamicScoring.scorePokemon({
  ...allRounderPanel,
  id: 'darkrai-test',
  name: '达克莱伊',
  speciesId: '491',
  main: '噩梦（能量填充M）Lv.7'
});
assert.equal(darkraiScore.speciesScore, 77.3);
assert.equal(darkraiScore.selectedAllRounderSkillId, 'nightmare');
assert.ok(Number.isFinite(darkraiScore.finalScore));

console.log('dynamic scoring tests passed (97/97 snapshot parity)');
