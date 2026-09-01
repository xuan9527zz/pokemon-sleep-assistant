'use strict';

const assert=require('node:assert/strict');
const strategy=require('../pokemon-strategy.js');

const flygon=strategy.strategicAdjustment('330',61);
assert.equal(flygon.strategicBonus,8);
assert.equal(flygon.adjustedScore,69);
assert.equal(flygon.profile.ingredient,'嫩亮酪梨');
const meowscarada=strategy.strategicAdjustment('908',74);
assert.equal(meowscarada.strategicBonus,0,'an already healthy mechanical score should not receive a duplicate strategic bonus');

const berryStandard=strategy.minimumStandard({specialty:'berry',subs:'树果数量S；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'154',specialty:'berry'});
assert.equal(berryStandard.meetsGraduation,true);
const berryWithoutBfs=strategy.minimumStandard({specialty:'berry',subs:'帮手奖励；帮忙速度M；帮忙速度S；研究EXP奖励；睡眠EXP奖励',nature:'固执：速度↑ 食材↓'},{finalId:'157',specialty:'berry'});
assert.equal(berryWithoutBfs.meetsMinimum,false,'Berry Finding S is the strict berry-position prerequisite');

const latiosBerryPanel=strategy.minimumStandard({specialty:'skill',main:'流星群（树果骤增）',subs:'树果数量S；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'381',specialty:'skill'});
assert.equal(latiosBerryPanel.roleKind,'berry-position');
assert.equal(latiosBerryPanel.meetsGraduation,true,'Latios Berry Burst must use the berry-position standard');
const berrySkillTriggerOnly=strategy.minimumStandard({specialty:'skill',main:'树果骤增',subs:'树果数量S；帮手奖励；技能概率M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'254',specialty:'skill'});
assert.equal(berrySkillTriggerOnly.meetsGraduation,false,'Skill Trigger M cannot replace personal speed on a Berry Burst berry position');

const ingredientStandard=strategy.minimumStandard({specialty:'ingredient',ingredients:'牛奶×2／牛奶×5／牛奶×7',subs:'食材概率M；帮忙速度M；食材概率S；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'9',specialty:'ingredient'});
assert.equal(ingredientStandard.meetsGraduation,true,'AAA ingredient graduation does not require Helping Bonus');
assert.equal(ingredientStandard.routeMatch,true);
const seedOnlyIngredient=strategy.minimumStandard({specialty:'ingredient',ingredients:'牛奶×2／牛奶×5／牛奶×7',subs:'食材概率S；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'9',specialty:'ingredient'});
assert.equal(seedOnlyIngredient.meetsMinimum,false,'the course panel requires Ingredient Finder M by Lv.50, not an unseeded S');
const aabWorker=strategy.minimumStandard({specialty:'ingredient',ingredientPattern:'AAB',ingredients:'牛奶×2／牛奶×5／可可×7',subs:'食材概率M；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'9',specialty:'ingredient'});
assert.equal(aabWorker.status,'worker');
assert.equal(aabWorker.meetsMinimum,true,'a qualified AAB helper is retained as a worker without becoming a graduation candidate');
assert.equal(aabWorker.meetsGraduation,false);
assert.equal(aabWorker.investmentLimit,'Lv.59');
const verifiedAbb=strategy.minimumStandard({specialty:'ingredient',ingredientPattern:'ABB',ingredients:'火辣香草×2／火辣香草×5／火辣香草×7',subs:'食材概率M；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'149',specialty:'ingredient'});
assert.equal(verifiedAbb.meetsGraduation,true,'course-listed ABB species can graduate after the panel requirement');
const unknownAbb=strategy.minimumStandard({specialty:'ingredient',ingredientPattern:'ABB',ingredients:'牛奶×2／可可×5／可可×7',subs:'食材概率M；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'9',specialty:'ingredient'});
assert.equal(unknownAbb.status,'route-review','ABB is not a universal graduation route');
const ingredientBadNature=strategy.minimumStandard({specialty:'ingredient',ingredients:'牛奶×2／牛奶×5／牛奶×7',subs:'食材概率M；帮手奖励；研究EXP奖励；梦之碎片奖励；睡眠EXP奖励',nature:'固执：速度↑ 食材↓'},{finalId:'9',specialty:'ingredient'});
assert.equal(ingredientBadNature.meetsGraduation,false,'a nature that lowers ingredients is not an ingredient gain merely because it raises speed');

const healerGraduation=strategy.minimumStandard({specialty:'skill',main:'活力全体疗愈S',subs:'技能概率M；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'282',specialty:'skill'});
assert.equal(healerGraduation.roleKind,'formal-healer');
assert.equal(healerGraduation.meetsGraduation,true);
const healerWithoutHb=strategy.minimumStandard({specialty:'skill',main:'新月祈祷（活力全体疗愈S）',subs:'技能概率M；帮忙速度M；技能概率S；研究EXP奖励；睡眠EXP奖励',nature:'温顺：技能↑ 活力恢复↓'},{finalId:'488',specialty:'skill'});
assert.equal(healerWithoutHb.meetsGraduation,false);
assert.equal(healerWithoutHb.status,'transition','a strong healer without Helping Bonus remains transitional');
assert.equal(strategy.ruleFor('213','skill').label,'正式群回奶妈','Shuckle belongs to the formal healer group');

const ordinarySkill=strategy.minimumStandard({specialty:'skill',main:'能量填充S',subs:'技能概率M；技能概率S；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'},{finalId:'55',specialty:'skill'});
assert.equal(ordinarySkill.meetsGraduation,true,'ordinary skill helpers may graduate without Helping Bonus');
const easyTool=strategy.minimumStandard({specialty:'skill',main:'料理强化S',subs:'技能概率M；技能概率S；研究EXP奖励；梦之碎片奖励；睡眠EXP奖励',nature:'认真'},{finalId:'462',specialty:'skill'});
assert.equal(easyTool.status,'transition');
assert.equal(easyTool.meetsMinimum,false,'an ordinary easy-hunt two-gain tool panel is not graduation');
const dedenneCompromise=strategy.minimumStandard({specialty:'skill',main:'料理成功S',subs:'技能概率M；技能概率S；研究EXP奖励；梦之碎片奖励；睡眠EXP奖励',nature:'认真'},{finalId:'702',specialty:'skill'});
assert.equal(dedenneCompromise.status,'compromise');
assert.equal(dedenneCompromise.meetsMinimum,true,'the course allows a 16-gauge Dedenne compromise start');
const skillBadNature=strategy.minimumStandard({specialty:'skill',main:'能量填充S',subs:'技能概率M；帮手奖励；研究EXP奖励；梦之碎片奖励；睡眠EXP奖励',nature:'顽皮：速度↑ 技能↓'},{finalId:'55',specialty:'skill'});
assert.equal(skillBadNature.meetsGraduation,false,'a skill-down nature is not a skill gain merely because it raises speed');

assert.ok(strategy.targetsForIsland('白花雪原').some(row=>row.id==='365'));
assert.ok(strategy.targetsForIsland('天青沙滩 EX').length>0);
assert.equal(strategy.SELECTION_SOURCE.reviewedAt,'2026-09-01');

console.log('pokemon strategy tests passed (course role split, routes, timing and nature safety)');
