'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const boxScoring = require('../skills/pokemon-sleep-scoring/scripts/box-scores.js');
const dynamicScoring = require('../pokemon-scoring.js');
const catalog = require('../pokemon-catalog.generated.js');

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

console.log('dynamic scoring tests passed (97/97 snapshot parity)');
