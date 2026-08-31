'use strict';

const assert = require('node:assert/strict');
const investment = require('../investment-planner.js');
const catalog = require('../pokemon-catalog.generated.js');
const nature = require('../skills/pokemon-sleep-scoring/scripts/nature-scores.js');
const scoring = require('../pokemon-scoring.js');

assert.equal(investment.BASE_EXP.length,71);
assert.equal(investment.SHARDS_PER_CANDY.length,71);
const neutral = investment.simulateLevelInvestment(1,30,1,'认真',nature);
const expUp = investment.simulateLevelInvestment(1,30,1,'胆小',nature);
const expDown = investment.simulateLevelInvestment(1,30,1,'勇敢',nature);
assert.ok(expUp.candies<neutral.candies);
assert.ok(expDown.candies>neutral.candies);
assert.ok(neutral.shards>0);

const path = investment.findEvolutionPath('1','3',catalog);
assert.equal(path.length,2);
const evolution = investment.summarizeEvolution(path,catalog);
assert.equal(evolution.requirements.candy,120);
assert.equal(evolution.requirements.minimumLevel,24);

const species = catalog.pokemon.find(item=>item.id==='3');
const mon = {lv:'70',nature:'认真',ingredients:'甜甜蜜×2／好眠番茄×5／甜甜蜜×7',subs:'帮忙速度S；食材概率S；—；—；—'};
const seedPlan = investment.optimizeSubskillSeeds(mon,species,70,2,nature);
assert.equal(seedPlan.used,2);
assert.ok(seedPlan.upgrades.some(item=>item.to==='帮忙速度M'));
assert.ok(seedPlan.upgrades.some(item=>item.to==='食材概率M'));

const bagon = {id:'test',speciesId:'371',finalFormId:'373',name:'宝贝龙',lv:'1',nature:'认真',ingredients:'豆制肉×2／火辣香草×5／豆制肉×7',subs:'—；—；—；—；—',main:'活力填充S Lv.1'};
const partial = investment.calculateInvestment(bagon,30,{catalog,scoring,natureApi:nature,includeEvolution:true});
assert.equal(partial.targetSpecies.id,'372');
assert.equal(partial.fullEvolutionAvailable,false);
assert.equal(partial.evolution.steps.length,1);
assert.equal(investment.mainSkillEffect(2,7),'每次能量 6,858');
assert.equal(investment.mainSkillEffect(14,6),'料理大成功率 10%');
console.log('investment planner tests passed');
