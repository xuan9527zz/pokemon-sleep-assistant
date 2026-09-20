'use strict';

const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const boxScoring=require('../skills/pokemon-sleep-scoring/scripts/box-scores.js');
const scoring=require('../pokemon-scoring.js');
const allRounder=require('../all-rounder-rules.js');

const html=fs.readFileSync(path.join(__dirname,'..','index.html'),'utf8'),rows=boxScoring.parseBoxRows(html);
require('../box-scores.generated.js');
const snapshot=globalThis.POKEMON_SLEEP_BOX_SCORES.scores;

assert.equal(rows.length,97);
rows.forEach(row=>{
  const actual=scoring.scorePokemon(row),expected=snapshot[row.id];
  assert.equal(actual.speciesTier,expected.speciesTier,`species tier #${row.id}`);
  assert.equal(actual.individualScore,expected.individualScore,`multiplier #${row.id}`);
  assert.equal(actual.individualGrade,expected.individualGrade,`individual grade #${row.id}`);
  assert.equal(actual.finalScore,actual.individualScore,`individual-only output #${row.id}`);
});

const gardevoir=scoring.scorePokemon({name:'沙奈朵',speciesId:'282',nature:'慎重',ingredients:'特选苹果×1／特选苹果×2／特选苹果×4',subs:'帮手奖励；技能概率M；技能概率S；帮忙速度M；帮忙速度S'});
assert.equal(gardevoir.individualScore,2.33);
assert.equal(gardevoir.individualGrade,'S');
assert.equal(gardevoir.individual.model,'blank-output-multiplier');

const typhlosion=scoring.scorePokemon({name:'火爆兽',speciesId:'157',nature:'固执',ingredients:'暖暖姜×1／暖暖姜×2／暖暖姜×4',subs:'树果数量S；帮手奖励；帮忙速度M；帮忙速度S；技能概率M'});
assert.equal(typhlosion.individualScore,2.37);
assert.equal(typhlosion.individualGrade,'S');

const sceptile=scoring.scorePokemon({name:'蜥蜴王',speciesId:'254',nature:'固执',ingredients:'特选蛋×1／特选蛋×2／特选蛋×4',subs:'树果数量S；帮手奖励；帮忙速度M；技能概率M；技能概率S'});
assert.equal(sceptile.specialty,'berry','树果骤增技能手必须按树果位呈现');
assert.equal(sceptile.evaluationRole,'berry-burst');
assert.equal(sceptile.individualScore,2.24);
assert.equal(sceptile.individualGrade,'S');

const abb=scoring.scorePokemon({name:'快龙',speciesId:'149',nature:'冷静',ingredients:'火辣香草×2／萌绿玉米×4／萌绿玉米×7',subs:'帮手奖励；食材概率M；食材概率S；帮忙速度M；帮忙速度S'});
assert.equal(abb.individual.ingredientPattern,'ABB');
assert.equal(abb.individualGrade,'B','ABB只能封顶B，不能把低倍率抬到B');
const weakAbb=scoring.scorePokemon({name:'快龙',speciesId:'149',nature:'内敛',ingredients:'火辣香草×2／萌绿玉米×4／萌绿玉米×7',subs:'睡眠EXP奖励；活力恢复奖励；研究EXP奖励；梦之碎片奖励；技能等级S'});
assert.equal(weakAbb.individualGrade,'C');

const noHbSkill=scoring.scorePokemon({name:'沙奈朵',speciesId:'282',nature:'慎重',ingredients:'特选苹果×1／特选苹果×2／特选苹果×4',subs:'技能概率M；技能概率S；帮忙速度M；帮忙速度S；技能等级M'});
assert.notEqual(noHbSkill.individualGrade,'S','无帮手奖励的技能手不能进入S');

const panel={id:'mew',name:'梦幻',speciesId:'151',ingredients:'特选蛋×2／特选蛋×4／特选蛋×6',subskills:'帮手奖励；技能概率M；帮忙速度M；树果数量S；食材概率M',nature:'浮躁',main:'十项全能 Lv.8'};
const mew=scoring.scorePokemon(allRounder.apply(panel,'berry-burst'));
assert.equal(mew.speciesTier,'S');
assert.ok(Number.isFinite(mew.individualScore));
assert.ok(['S','A','B','C'].includes(mew.individualGrade));
assert.equal(scoring.scorePokemon({...allRounder.apply(panel,'berry-burst'),nature:'怕寂寞'}).individualScore,mew.individualScore,'幻之宝可梦固定性格不制造评分差异');

console.log('dynamic scoring tests passed (blank=1.00 multipliers and S/A/B/C grades)');
