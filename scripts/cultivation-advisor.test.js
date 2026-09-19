'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const boxScoring = require('../skills/pokemon-sleep-scoring/scripts/box-scores.js');
const advisor = require('../cultivation-advisor.js');
const boxManager = require('../box-manager.js');
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

assert.equal(mature(byId(73)).tier, 'transition', 'a high mechanical Gardevoir without the course healer graduation panel must remain transitional');
const walreinAdvice = mature(byId(79));
assert.equal(walreinAdvice.tier, 'core', 'elite Walrein individual should clear the near-core species compensation line');
assert.match(advisor.explanation(walreinAdvice), /白花雪原（四岛）主力树果手/, 'Walrein advice should retain its fourth-island core role');
assert.equal(mature(byId(92)).tier, 'transition', 'Sylveon remains a transition healer when Gardevoir is the mature target');
assert.equal(mature(byId(70)).tier, 'transition', 'Berry Burst Sceptile without Berry Finding S cannot remain a long-term berry core');
assert.equal(mature(byId(63)).tier, 'transition', 'a high-score berry helper without Berry Finding S is capped at transition');
assert.equal(mature(byId(89)).tier, 'transition', 'Cresselia is a formal healer and cannot graduate without Skill Trigger M and Helping Bonus');
assert.equal(mature(byId(85)).tier, 'avoid', 'unlisted Magnezone defaults to C and should not be a mature-account investment');
assert.equal(mature(byId(13)).tier, 'avoid', 'unlisted Golduck defaults to C');
assert.equal(mature(byId(81)).tier, 'transition', 'B-tier Latios is only barely usable');
assert.equal(mature(byId(62)).tier, 'avoid', 'the current low-panel Mew must use its numeric all-rounder score instead of staying manually battle-enabled');
assert.equal(mature(byId(91)).tier, 'transition', 'the current Darkrai must use its revealed all-rounder focus score instead of being punished for fixed Nature or unopened slots');

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
    speciesTier: 'C',
    individualScore: 65,
    finalScore: 65
  }
};
const raichu = {
  id: 'raichu-test',
  name: '雷丘',
  speciesId: '26',
  finalFormId: '26',
  battleEligible: true,
  scoreBreakdown: {finalFormId:'26',speciesTier:'S',individualScore:60,finalScore:60}
};
const captainAdvice = advisor.assess(captain, [captain, raichu], { accountStage: 'mature' });
assert.equal(captainAdvice.tier, 'avoid');
assert.match(captainAdvice.reason,/默认 C 级/);

const starterCaptain = advisor.assess(captain, [captain], { accountStage: 'starter' });
assert.equal(starterCaptain.tier, 'avoid');
assert.equal(advisor.explanation(captainAdvice).includes('不会修改物种梯级或个体质量'), true);

const courseBerry = {
  id: 'course-berry',
  name: '课程毕业大竺葵',
  finalFormId: '154',
  lv: '50',
  battleEligible: true,
  subs: '树果数量S；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',
  nature: '认真',
  scoreBreakdown: {finalFormId:'154',specialty:'berry',speciesTier:'S',individualScore:90,finalScore:90}
};
assert.equal(advisor.assess(courseBerry, [courseBerry], {accountStage:'mature'}).tier, 'core', 'a mechanically strong course-graduated berry helper can remain core');

const aabIngredient = {
  id: 'aab-worker',
  name: 'AAB水箭龟',
  finalFormId: '9',
  lv: '50',
  battleEligible: true,
  ingredients: '哞哞鲜奶×2／哞哞鲜奶×5／放松可可×7',
  subs: '食材概率M；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',
  nature: '认真',
  scoreBreakdown: {finalFormId:'9',specialty:'ingredient',speciesTier:'S',individualScore:90,finalScore:90,individual:{ingredientPattern:'AAB',ingredientPatternCoefficient:.7}}
};
const aabAdvice=advisor.assess(aabIngredient,[aabIngredient],{accountStage:'mature'});
assert.equal(aabAdvice.tier,'transition','AAB is a Lv.30 worker even when the mechanical score is high');
assert.match(advisor.explanation(aabAdvice),/Lv\.59|Lv\.30食材工/);

const collectionMarked={...courseBerry,id:'collection-battle-independent',battleEligible:false,collectionIntent:true};
assert.equal(advisor.assess(collectionMarked,[collectionMarked],{accountStage:'mature'}).tier,'core','收藏与实战状态不得短路培养建议重算');

box.forEach(mon=>{mon.specialty=mon.scoreBreakdown&&mon.scoreBreakdown.specialty;mon.cultivation=mature(mon)});
const recalculated=boxManager.recalculateUsageState(box,{},{}).state;
const records=Object.values(recalculated.pokemon),usageCounts=records.reduce((counts,record)=>{const status=boxManager.usageStatus(record);counts[status]=(counts[status]||0)+1;return counts},{});
assert.equal(records.filter(record=>record.collectionIntent).length,box.filter(mon=>mon.shiny==='是').length,'自动重算的收藏维度必须恰好覆盖全部闪光个体');
assert.deepEqual(usageCounts,{'battle-only':40,inactive:13,'collection-only':26,both:18},'97只现有个体的用途分类应按新梯级完整重算并锁定四种状态');

console.log('cultivation advisor tests passed (species tiers, course caps, account stage and berry scenarios)');
