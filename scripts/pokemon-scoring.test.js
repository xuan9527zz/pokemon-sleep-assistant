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
  assert.equal(actual.speciesTier, expected.speciesTier, `species tier #${row.id}`);
  assert.equal(actual.individualScore, expected.individualScore, `individual score #${row.id}`);
  assert.equal(actual.finalScore, expected.finalScore, `final score #${row.id}`);
  assert.equal(actual.finalScore, actual.individualScore, `percent score must be individual-only #${row.id}`);
  assert.equal(Object.hasOwn(actual,'speciesScore'),false,`dynamic score must not expose species score #${row.id}`);
  assert.equal(Object.hasOwn(expected,'speciesScore'),false,`snapshot must not expose species score #${row.id}`);
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
assert.equal(newScore.speciesTier, 'S');
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
assert.equal(metronomeScore.speciesTier, 'B');
assert.equal(healerScore.speciesTier, 'B');
assert.equal(berryBurstScore.speciesTier, 'S');
assert.equal(metronomeScore.individualScore, 86.6);
assert.equal(healerScore.individualScore, metronomeScore.individualScore, '切换十项全能只应改变物种技能场景，不应改写同一个体面板');
assert.equal(dynamicScoring.scorePokemon({...allRounderRules.apply(allRounderPanel, 'metronome'),nature:'怕寂寞'}).individualScore,metronomeScore.individualScore,'幻之宝可梦固定性格不得制造不可达的个体分缺口');
assert.ok([metronomeScore, healerScore, berryBurstScore].every(score => Number.isFinite(score.finalScore)));

const darkraiScore = dynamicScoring.scorePokemon({
  ...allRounderPanel,
  id: 'darkrai-test',
  name: '达克莱伊',
  speciesId: '491',
  main: '噩梦（能量填充M）Lv.7'
});
assert.equal(darkraiScore.speciesTier, 'S');
assert.equal(darkraiScore.selectedAllRounderSkillId, 'nightmare');
assert.ok(Number.isFinite(darkraiScore.finalScore));

const darkraiBerryCore = dynamicScoring.scorePokemon({
  id: 'darkrai-berry-core',
  name: '达克莱伊',
  speciesId: '491',
  ingredients: '豆制肉×2／豆制肉×4／哞哞鲜奶×6',
  subskills: '帮手奖励；树果数量S；帮忙速度M；—；—',
  nature: '害羞',
  main: '噩梦（能量填充M） Lv.1'
});
assert.equal(darkraiBerryCore.individual.focusRole, 'berry');
assert.equal(darkraiBerryCore.individualScore, 100, '已开放的Lv.50毕业树果骨架应按同开放栏位合法上限归一化');
assert.equal(darkraiBerryCore.finalScore, 100);
assert.deepEqual(darkraiBerryCore.individual.unopenedSubskillLevels, [70, 80]);
assert.equal(darkraiBerryCore.individual.channels.ingredient.routeCoefficient, .7);
assert.equal(darkraiBerryCore.individual.channels.berry.routeCoefficient, 1, '食材路线不得给树果分支整体打折');

const exportedDarkrai = dynamicScoring.scorePokemon({
  id: '91',
  name: '达克莱伊',
  speciesId: '491',
  finalFormId: '491',
  ingredients: '豆制肉×2／豆制肉×4／哞哞鲜奶×6',
  subs: '帮手奖励；树果数量S；帮忙速度M；食材概率S；—',
  nature: '害羞',
  main: '噩梦（能量填充M） Lv.1'
});
assert.equal(exportedDarkrai.individual.focusRole, 'berry');
assert.equal(exportedDarkrai.individualScore, 84.1);
assert.equal(exportedDarkrai.finalScore, 84.1);
assert.equal(exportedDarkrai.individual.channels.ingredient.adjustedScore, 56.5);

const partialMew = dynamicScoring.scorePokemon(allRounderRules.apply({
  id: 'partial-mew',
  name: '梦幻',
  speciesId: '151',
  ingredients: '特选蛋×2／火辣香草×4／—',
  subskills: '技能等级M；持有上限S；—；—；—',
  nature: '浮躁',
  main: '十项全能 Lv.3'
}, 'metronome'));
assert.equal(partialMew.individual.ingredientPattern, 'AB?');
assert.equal(partialMew.individual.ingredientPatternCoefficient, 1, '尚未开放的幻之宝可梦食材栏不得预判成ABC');
assert.equal(partialMew.individual.revealedSubskillCount, 2);

console.log('dynamic scoring tests passed (97/97 snapshot parity)');
