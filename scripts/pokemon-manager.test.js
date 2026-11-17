'use strict';

const assert = require('node:assert/strict');
const manager = require('../pokemon-manager.js');
const nature = require('../skills/pokemon-sleep-scoring/scripts/nature-scores.js');
const catalog = require('../pokemon-catalog.generated.js');
const scoring = require('../pokemon-scoring.js');

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

const skillHelper = {speciesId:'282',lv:'50',ingredients:'苹果×2／苹果×3／苹果×4',subs:'帮手奖励；技能概率M；技能概率S；帮忙速度M；帮忙速度S'};
const speedDown = {...skillHelper,nature:'内敛'};
const mintGain = manager.assessPlainMint(speedDown,scoring.scorePokemon(speedDown),scoring);
assert.ok(mintGain.future.after>mintGain.future.before);
assert.ok(mintGain.current.after>mintGain.current.before);
assert.equal(mintGain.verdict,'按需求考虑');
assert.ok(Math.abs(scoring.scorePokemon(speedDown).individual.potentialMultiplier-mintGain.future.after)<.0001);

const skillUp = {...skillHelper,nature:'温顺'};
const mintLoss = manager.assessPlainMint(skillUp,scoring.scorePokemon(skillUp),scoring);
assert.ok(mintLoss.future.after<mintLoss.future.before);
assert.equal(mintLoss.verdict,'不建议使用');

const neutral = {...skillHelper,nature:'认真',lv:'1'};
const noMintGain = manager.assessPlainMint(neutral,scoring.scorePokemon(neutral),scoring);
assert.equal(noMintGain.current.before,1);
assert.equal(noMintGain.current.after,1);
assert.equal(noMintGain.verdict,'不建议使用');

const berryHelper = {speciesId:'157',lv:'50',nature:'内敛',ingredients:'苹果×2／苹果×3／苹果×4',subs:'树果数量S；帮手奖励；帮忙速度M；帮忙速度S；—'};
const berryMint = manager.assessPlainMint(berryHelper,scoring.scorePokemon(berryHelper),scoring);
assert.equal(berryMint.beforeGrade,'B');
assert.equal(berryMint.afterGrade,'S');
assert.equal(berryMint.verdict,'值得考虑');
assert.equal(berryMint.recommended,true);

const belowA = {...berryHelper,subs:'树果数量S；帮手奖励；—；—；—'};
const weakMint = manager.assessPlainMint(belowA,scoring.scorePokemon(belowA),scoring);
assert.ok(weakMint.percent>0);
assert.equal(weakMint.afterGrade,'C');
assert.equal(weakMint.verdict,'不建议使用');
assert.equal(weakMint.recommended,false);

const stillB = {...skillHelper,nature:'内敛',subs:'技能概率M；技能概率S；帮忙速度M；帮忙速度S；—'};
const bMint = manager.assessPlainMint(stillB,scoring.scorePokemon(stillB),scoring);
assert.ok(bMint.percent>0);
assert.equal(bMint.afterGrade,'B');
assert.equal(bMint.recommended,false);

const alreadyMinted = {...berryHelper,plainMintUsed:true};
const usedScore = scoring.scorePokemon(alreadyMinted);
const usedAdvice = manager.assessPlainMint(alreadyMinted,usedScore,scoring);
assert.equal(usedAdvice.verdict,'已使用');
assert.equal(usedAdvice.recommended,false);
assert.ok(Math.abs(usedScore.individual.currentMultiplier-scoring.scorePokemon({...berryHelper,nature:'认真'}).individual.currentMultiplier)<.0001);

const mythical = {speciesId:'491',lv:'50',nature:'认真',ingredients:'苹果×2／苹果×3／苹果×4',subs:'帮手奖励；技能概率M；—；—；—'};
assert.equal(manager.assessPlainMint(mythical,scoring.scorePokemon(mythical),scoring),null);

console.log('pokemon entry derivation tests passed');
