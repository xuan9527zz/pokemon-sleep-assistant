'use strict';

const assert=require('node:assert/strict');
const tiers=require('../skills/pokemon-sleep-scoring/scripts/species-tiers.js');
const scoring=require('../pokemon-scoring.js');

assert.deepEqual(tiers.TIER_ORDER,{S:0,A:1,B:2,C:3});
assert.equal(tiers.entryFor({finalFormId:'365',specialty:'berry'}).tier,'S','帝牙海狮应为树果S');
assert.equal(tiers.entryFor({finalFormId:'959',specialty:'berry'}).tier,'A','巨锻匠应为树果A');
assert.equal(tiers.entryFor({finalFormId:'628',specialty:'berry'}).tier,'B','勇士雄鹰应为树果B');
assert.equal(tiers.entryFor({finalFormId:'9007',specialty:'berry'}).tier,'C','船长皮卡丘应为树果C');
assert.equal(tiers.entryFor({finalFormId:'738',specialty:'ingredient'}).tier,'S','锹农炮虫应为食材S');
assert.equal(tiers.entryFor({finalFormId:'908',specialty:'ingredient'}).tier,'A','魔幻假面喵应为食材A');
assert.equal(tiers.entryFor({finalFormId:'975',specialty:'ingredient'}).tier,'B','浩大鲸应为食材B');
assert.equal(tiers.entryFor({finalFormId:'132',specialty:'ingredient'}).tier,'C','百变怪应为食材C');
assert.equal(tiers.entryFor({finalFormId:'702',specialty:'skill'}).tier,'S','咚咚鼠应为技能S');
assert.equal(tiers.entryFor({finalFormId:'9006',specialty:'skill'}).tier,'A','佳节海豹球应为技能A');
assert.equal(tiers.entryFor({finalFormId:'700',specialty:'skill'}).tier,'B','仙子伊布应为技能B');
assert.equal(tiers.entryFor({finalFormId:'181',specialty:'skill'}).tier,'C','未列出的电龙应默认C');
assert.equal(tiers.entryFor({finalFormId:'491',specialty:'all'}).tier,'S','达克莱伊应为特殊S');
assert.equal(tiers.entryFor({finalFormId:'245',specialty:'skill'}).tier,'A','水君应为特殊A');
assert.equal(tiers.entryFor({finalFormId:'381',specialty:'skill'}).tier,'B','拉帝欧斯应为特殊B');
assert.equal(tiers.entryFor({name:'超梦'}).tier,'B','未进入图鉴的超梦也应保留特殊B定义');
assert.equal(tiers.entryFor({finalFormId:'151',selectedAllRounderSkillId:'berry-burst'}).tier,'S','树果骤增梦幻应为S');
assert.equal(tiers.entryFor({finalFormId:'151',selectedAllRounderSkillId:'e4e'}).tier,'B','其他技能梦幻应为B');

const inherited=scoring.scorePokemon({name:'海豹球',speciesId:'363',ingredients:'纯粹油×1／纯粹油×2／纯粹油×4',subskills:'树果数量S；帮手奖励；帮忙速度M；帮忙速度S；技能概率M',nature:'认真'});
assert.equal(inherited.finalFormId,'365');
assert.equal(inherited.speciesTier,'S','未进化个体应继承选定最终形态梯级');

console.log('species tier tests passed (user list, Mew variants, default C and evolution inheritance)');
