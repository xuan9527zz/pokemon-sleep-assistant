'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const boxScoring = require('../skills/pokemon-sleep-scoring/scripts/box-scores.js');
const advisor = require('../cultivation-advisor.js');
const catalog = require('../pokemon-catalog.generated.js');

require('../box-scores.generated.js');
const snapshot = globalThis.POKEMON_SLEEP_BOX_SCORES.scores;
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const box = boxScoring.parseBoxRows(html).map(mon => ({
  ...mon,
  lv: mon.level,
  battleEligible: true,
  scoreBreakdown: snapshot[mon.id]
}));

const byId = id => box.find(mon => mon.id === String(id));
const mature = mon => advisor.assess(mon, box, { accountStage: 'mature' });

assert.equal(mature(byId(73)).tier, 'core', 'strong Gardevoir should be a mature-account core');
const walreinAdvice = mature(byId(79));
assert.equal(walreinAdvice.tier, 'core', 'elite Walrein individual should clear the near-core species compensation line');
assert.match(advisor.explanation(walreinAdvice), /白花雪原（四岛）主力树果手/, 'Walrein advice should retain its fourth-island core role');
assert.equal(mature(byId(92)).tier, 'transition', 'Sylveon remains a transition healer when Gardevoir is the mature target');
assert.equal(mature(byId(70)).tier, 'core', 'Sceptile should retain core status after positive slot replacement economics');
assert.equal(mature(byId(85)).tier, 'avoid', 'Magnezone below break-even should not be a mature-account default investment');
assert.equal(mature(byId(13)).tier, 'niche', 'Golduck operation/stability cost should remain visible');
assert.equal(mature(byId(81)).tier, 'niche', 'Latios value depends on the Latias pair scenario');

const tinkaton = catalog.pokemon.find(record => record.id === '959');
const feraligatr = catalog.pokemon.find(record => record.id === '160');
const tinkatonScenario = catalog.speciesScores[tinkaton.id].scenarios;
const feraligatrScenario = catalog.speciesScores[feraligatr.id].scenarios;
assert.ok(tinkatonScenario.normalCollection.rank < feraligatrScenario.normalCollection.rank, 'Tinkaton should lead Feraligatr under normal collection');
assert.ok(tinkatonScenario.fullBagSneakySnacking.rank > feraligatrScenario.fullBagSneakySnacking.rank, 'Feraligatr should lead Tinkaton under full-bag Sneaky Snacking');

const captain = {
  id: 'captain-test',
  name: '皮卡丘（船长）',
  speciesId: '9007',
  finalFormId: '9007',
  lv: '30',
  battleEligible: true,
  scoreBreakdown: {
    specialty: 'berry',
    finalFormId: '9007',
    speciesScore: 81,
    individualScore: 65,
    finalScore: 77
  }
};
const raichu = {
  id: 'raichu-test',
  name: '雷丘',
  speciesId: '26',
  finalFormId: '26',
  battleEligible: true,
  scoreBreakdown: {finalFormId:'26',speciesScore:87.5,individualScore:60,finalScore:80.6}
};
const captainAdvice = advisor.assess(captain, [captain, raichu], { accountStage: 'mature' });
assert.equal(captainAdvice.tier, 'niche');
assert.equal(captainAdvice.directSuperior.name, '雷丘');
assert.equal(captainAdvice.directSuperior.present, true);
assert.ok(captainAdvice.exception.includes('雷公队'));

const starterCaptain = advisor.assess(captain, [captain], { accountStage: 'starter' });
assert.equal(starterCaptain.tier, 'transition');
assert.equal(advisor.explanation(captainAdvice).includes('不会反向修改综合评分'), true);

console.log('cultivation advisor tests passed (stage, direct-superior, team-cost, berry scenarios)');
