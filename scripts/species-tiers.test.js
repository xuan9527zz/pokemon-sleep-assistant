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
assert.equal(tiers.entryFor({finalFormId:'547',specialty:'ingredient'}).tier,'A','风妖精应为食材A');
assert.equal(tiers.entryFor({finalFormId:'546',specialty:'ingredient'}).tier,'A','木棉球应继承风妖精的食材A级');
assert.equal(tiers.entryFor({finalFormId:'975',specialty:'ingredient'}).tier,'B','浩大鲸应为食材B');
assert.deepEqual(tiers.entryFor({finalFormId:'591',specialty:'ingredient'}),tiers.entryFor({finalFormId:'195',specialty:'ingredient'}),'败露球菇与沼王应同属食材B');
assert.equal(tiers.entryFor({finalFormId:'590',specialty:'ingredient'}).tier,'B','哎呀球菇应继承败露球菇的食材B');
assert.equal(tiers.entryFor({name:'哎呀球菇'}).category,'ingredient','图鉴数据接入前也应识别哎呀球菇定位');
assert.equal(tiers.entryFor({name:'败露球菇'}).tier,'B','图鉴数据接入前也应识别败露球菇梯级');
assert.equal(scoring.scorePokemon({name:'哎呀球菇',speciesId:'590',ingredients:'品鲜蘑菇×2／品鲜蘑菇×5／品鲜蘑菇×7',nature:'认真'}).speciesTier,'B');
assert.equal(tiers.entryFor({finalFormId:'132',specialty:'ingredient'}).tier,'C','百变怪应为食材C');
assert.equal(tiers.entryFor({finalFormId:'702',specialty:'skill'}).tier,'S','咚咚鼠应为技能S');
assert.equal(tiers.entryFor({finalFormId:'9006',specialty:'skill'}).tier,'A','佳节海豹球应为技能A');
assert.equal(tiers.entryFor({finalFormId:'700',specialty:'skill'}).tier,'B','仙子伊布应为技能B');
assert.equal(tiers.entryFor({finalFormId:'181',specialty:'skill'}).tier,'C','未列出的电龙应默认C');
assert.equal(tiers.entryFor({finalFormId:'429'}).tier,'C','梦妖魔应明确列为技能C');
assert.equal(tiers.entryFor({finalFormId:'429'}).listed,true,'梦妖魔应进入梯度图鉴，不只依赖默认C');
assert.equal(tiers.entryFor({finalFormId:'200'}).tier,'C','梦妖应继承梦妖魔的C级');
assert.equal(tiers.entryFor({name:'梦妖'}).category,'skill','图鉴资料接入前也应识别梦妖定位');
assert.equal(scoring.scorePokemon({name:'梦妖',speciesId:'200',ingredients:'窝心洋芋×1／窝心洋芋×2／窝心洋芋×4',nature:'认真'}).speciesTier,'C');
assert.equal(tiers.entryFor({finalFormId:'491',specialty:'all'}).tier,'S','达克莱伊应为特殊S');
assert.equal(tiers.entryFor({finalFormId:'245',specialty:'skill'}).tier,'A','水君应为特殊A');
assert.equal(tiers.entryFor({finalFormId:'381',specialty:'skill'}).tier,'B','拉帝欧斯应为特殊B');
assert.equal(tiers.entryFor({finalFormId:'150',name:'超梦',specialty:'skill'}).tier,'B','超梦进入图鉴后应沿用特殊B定义');
assert.equal(tiers.entryFor({finalFormId:'151',selectedAllRounderSkillId:'berry-burst'}).tier,'S','树果骤增梦幻应为S');
assert.equal(tiers.entryFor({finalFormId:'151',selectedAllRounderSkillId:'e4e'}).tier,'B','其他技能梦幻应为B');

const inherited=scoring.scorePokemon({name:'海豹球',speciesId:'363',ingredients:'纯粹油×1／纯粹油×2／纯粹油×4',subskills:'树果数量S；帮手奖励；帮忙速度M；帮忙速度S；技能概率M',nature:'认真'});
assert.equal(inherited.finalFormId,'365');
assert.equal(inherited.speciesTier,'S','未进化个体应继承选定最终形态梯级');

const mewtwo=scoring.scorePokemon({name:'超梦',speciesId:'150',ingredients:'萌绿大豆×1／萌绿玉米×2／窝心洋芋×3',subskills:'技能概率M；技能概率S；帮手奖励；帮忙速度M；帮忙速度S',nature:'认真'});
assert.equal(mewtwo.finalFormId,'150');
assert.equal(mewtwo.speciesTier,'B');

const cottonee=scoring.scorePokemon({name:'木棉球',speciesId:'546',ingredients:'一口坚果×2／一口坚果×5／一口坚果×7',subskills:'帮手奖励；食材概率M；帮忙速度M；食材概率S；帮忙速度S',nature:'认真'});
assert.equal(cottonee.finalFormId,'547');
assert.equal(cottonee.speciesTier,'A');

console.log('species tier tests passed (user list, Mew variants, default C and evolution inheritance)');
