'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const weekly = require('../weekly-planner.js');
const teamPlanner = require('../team-planner.js');
const scoring = require('../pokemon-scoring.js');
const picker = require('../pokemon-picker.js');
const catalog = require('../pokemon-catalog.generated.js');

assert.equal(weekly.effectivePot(81, false), 81);
assert.equal(weekly.effectivePot(81, true), 122);
const monday=new Date(2026,7,31,12,0,0),sunday=new Date(2026,8,6,12,0,0);
assert.equal(weekly.weekKey(monday),'2026-08-31');
assert.equal(weekly.weekKey(sunday),'2026-08-31');
assert.equal(weekly.daysRemainingInWeek(monday),7);
assert.equal(weekly.daysRemainingInWeek(sunday),1);

const normalized=weekly.normalizeState({recipeType:'坏数据',activityKey:'bad',islandIndex:99,mealGoal:80,weekKey:'2026-08-31',completedMeals:['d0-m0','bad'],penaltyLines:{'萌绿之岛':19563553}},['特选苹果'],9,monday);
assert.equal(normalized.recipeType,'咖喱／浓汤');
assert.equal(normalized.islandIndex,8);
assert.equal(normalized.mealGoal,21);
assert.deepEqual(normalized.completedMeals,['d0-m0']);
assert.equal(normalized.goodCamp,false,'旧版单一好露营券开关迁移后不应误算为准备周当前采集增益');
assert.equal(normalized.eventGoodCamp,true);
assert.equal(normalized.schemaVersion,7);
assert.equal(normalized.currentSnorlaxStrength,0);
assert.equal(normalized.sleepType,'balanced');
assert.equal(normalized.sleepObjective,'combined');
assert.equal(normalized.sleepTargetId,'');
assert.equal(Object.hasOwn(normalized,'penaltyLines'),false,'旧版8只遇见参考线应从本地状态中清理');
assert.deepEqual(normalized.preparationRecipeTypes,['咖喱／浓汤','沙拉']);
const migratedSleepEnergy=weekly.normalizeState({schemaVersion:5,currentSnorlaxStrength:0,bedtimeSnorlaxStrength:5000000},['特选苹果'],9,monday);
assert.equal(migratedSleepEnergy.currentSnorlaxStrength,5000000,'旧版睡前能量应迁移为唯一的当前卡比兽能量');
assert.equal(Object.hasOwn(migratedSleepEnergy,'bedtimeSnorlaxStrength'),false,'迁移后不再保留第二个能量输入');
const nextWeek=weekly.normalizeState(normalized,['特选苹果'],9,new Date(2026,8,7,12,0,0));
assert.deepEqual(nextWeek.completedMeals,[]);

const recipes = [
  {id:1,name:'小料理',type:'沙拉',energy:1000,total:10,ingredients:[{name:'特选苹果',amount:10}]},
  {id:2,name:'大料理',type:'沙拉',energy:3000,total:20,ingredients:[{name:'特选苹果',amount:20}]},
  {id:3,name:'咖喱',type:'咖喱／浓汤',energy:5000,total:20,ingredients:[{name:'豆制肉',amount:20}]}
];
assert.equal(weekly.chooseTargetRecipe(recipes,'沙拉',15,{},{}).id,1);
assert.equal(weekly.chooseTargetRecipe(recipes,'沙拉',25,{'特选苹果':60},{'特选苹果':100}).id,2);
assert.equal(weekly.recipeRows(recipes,'沙拉',25,recipe=>recipe.id===1?5000:3000)[0].id,1,'食谱等级换算后的能量应参与排序');
assert.equal(weekly.ACTIVITY_PROFILES.snapshot.archived,true);
assert.equal(weekly.ACTIVITY_PROFILES.mewtwo1.psychicIngredientBonus,1);
assert.equal(weekly.ACTIVITY_PROFILES.mewtwo1.skillTriggerMultiplier,1.5);
assert.equal(weekly.ACTIVITY_PROFILES.mewtwo2.sleepDrowsyPowerMultiplier,1.3);
assert.equal(weekly.calculateDrowsyPower(200000,50,1.1),11000000);
assert.deepEqual(weekly.sleepMultiplierForTeam(weekly.ACTIVITY_PROFILES.mewtwo1,[{name:'梦幻'}],true),{multiplier:1.1,active:true,matched:'梦幻',required:['梦幻','超梦']});
assert.equal(weekly.sleepMultiplierForTeam(weekly.ACTIVITY_PROFILES.mewtwo1,[{name:'梦幻'}],false).multiplier,1,'非活动岛不能套用活动睡意之力倍率');
const singleSleep=weekly.calculateSleepPlan({area:'萌绿之岛',currentStrength:100000,bedtimeStrength:150000,sleepType:'balanced',objective:'combined'});
assert.equal(singleSleep.recommendation,'single');
assert.equal(singleSleep.single.sessions[0].score,100);
const splitSleep=weekly.calculateSleepPlan({area:'萌绿之岛',currentStrength:4000000,bedtimeStrength:5000000,sleepType:'balanced',objective:'combined'});
assert.equal(splitSleep.recommendation,'split');
assert.equal(splitSleep.bestSplit.sessions.reduce((sum,session)=>sum+session.score,0),100);
assert.ok(splitSleep.bestSplit.objectiveValue>splitSleep.single.objectiveValue,'应直接比较奖励曲线，而不是把8只遇见门槛当惩罚线');
const oneInputSleep=weekly.calculateSleepPlan({area:'萌绿之岛',currentStrength:5000000,sleepType:'balanced',objective:'combined'});
assert.equal(oneInputSleep.available,true);
assert.equal(oneInputSleep.bedtimeStrength,5000000,'只输入当前能量时应自动用于两次研究');
assert.deepEqual(weekly.applyActivityContext({island:{name:'萌绿之岛'},berries:['金枕果','芒芒果','莓莓果']},weekly.ACTIVITY_PROFILES.mewtwo1).berries,['芒芒果','金枕果','莓莓果']);
assert.deepEqual(weekly.activityMemberModifier(weekly.ACTIVITY_PROFILES.mewtwo1,true)({berry:'芒芒果'}),{ingredientHelpBonus:1,skillTriggerMultiplier:1.5,mainSkillLevelBonus:2,label:'超梦登场活动·第1周'});
assert.deepEqual(weekly.activityMemberModifier(weekly.ACTIVITY_PROFILES.mewtwo1,false)({berry:'芒芒果'}),{});
const mergedRoutes=weekly.mergeTargetRecipes([
  {id:'salad',name:'沙拉A',type:'沙拉',ingredients:[{name:'特选苹果',amount:10},{name:'萌绿玉米',amount:5}]},
  {id:'curry',name:'咖喱A',type:'咖喱／浓汤',ingredients:[{name:'特选苹果',amount:6},{name:'豆制肉',amount:8}]}
]);
assert.deepEqual(Object.fromEntries(mergedRoutes.ingredients.map(item=>[item.name,item.amount])),{'特选苹果':10,'萌绿玉米':5,'豆制肉':8},'双路线共同食材应取较高需求而不是相加');

const budget=weekly.ingredientBudget(recipes[1],{'特选苹果':30},{'特选苹果':0},15,5,7);
assert.equal(budget.remaining,10);
assert.equal(budget.rows[0].need,200);
assert.equal(budget.rows[0].projectedGap,0);
assert.equal(budget.rows[0].daysToStock,6.7);
const impossible=weekly.ingredientBudget(recipes[1],{'特选苹果':5},{'特选苹果':0},15,0,2);
assert.ok(impossible.projectedShortages.length>0);
const capped=weekly.ingredientBudget(recipes[1],{'特选苹果':30},{'豆制肉':760,'特选苹果':0},15,0,7);
assert.equal(capped.inventoryLimit,800);
assert.equal(capped.batchMeals,2,'只应规划仓库剩余40格能容纳的两餐');
assert.equal(capped.rows[0].need,40);
assert.ok(capped.rows.reduce((sum,row)=>sum+row.need,0)+760<=800,'下一批阈值不得超过仓库硬上限');
const full=weekly.ingredientBudget(recipes[1],{'特选苹果':30},{'豆制肉':800,'特选苹果':0},15,0,7);
assert.equal(full.batchMeals,0);
assert.ok(weekly.createActionPlan(full,recipes[1],{production:{}},{production:{}},monday,{weekMode:'preparation'}).title.includes('仓库已满'));

const projectRoot = path.resolve(__dirname,'..');
const html = fs.readFileSync(path.join(projectRoot,'index.html'),'utf8');
assert.ok(html.includes('id="weeklyCurrentStrength"'));
assert.ok(html.includes('id="weeklySleepTarget"'));
assert.ok(html.includes('<option value="pokemon">指定宝可梦出现</option>'));
assert.ok(!html.includes('id="weeklyBedtimeStrength"'),'本周作战页面只应要求一个当前卡比兽能量');
const raw = html.match(/const raw=`([\s\S]*?)`;/)[1].trim();
const columns = ['id','name','sp','lv','shiny','ingredients','interval','inv','main','subs','nature','priority','note'];
const box = raw.split('\n').map(line=>Object.fromEntries(line.split('|').map((value,index)=>[columns[index],value||''])));
const berryNames=['柿仔果','苹野果','橙橙果','萄葡果','金枕果','莓莓果','樱子果','零余果','勿花果','椰木果','芒芒果','木子果','文柚果','墨莓果','番荔果','异奇果','靛莓果','桃桃果'];
box.forEach(mon=>{const species=scoring.recordForPokemon(mon);mon.specialty=species.specialty;mon.specialtyLabel={berry:'树果手',ingredient:'食材手',skill:'技能手',all:'全能手'}[mon.specialty];mon.berry=berryNames[species.berryId-1];mon.battleEligible=true});
const context={};context.window=context;context.globalThis=context;vm.createContext(context);vm.runInContext(fs.readFileSync(path.join(projectRoot,'team-production.generated.js'),'utf8'),context);vm.runInContext(fs.readFileSync(path.join(projectRoot,'recipes.js'),'utf8'),context);
const realRecipes=context.POKEMON_SLEEP_RECIPES.map(recipe=>({...recipe,total:recipe.ingredients.reduce((sum,item)=>sum+item.amount,0)}));
const islandContext={island:{name:'宝蓝湖畔',kind:'普通岛'},index:4,berries:['金枕果','芒芒果','樱子果'],expert:false};
const outputScore=mon=>Number(mon.sp)||100;
const healer=mon=>/活力全体疗愈|新月祈祷/.test(mon.main);
const special=mon=>['梦幻','雷公','炎帝','水君','拉帝亚斯','拉帝欧斯','克雷色利亚','达克莱伊'].includes(mon.name);
const recommend=()=>{const heal=box.filter(healer).sort((a,b)=>outputScore(b)-outputScore(a))[0],producers=box.filter(mon=>!healer(mon)&&!special(mon)).sort((a,b)=>outputScore(b)-outputScore(a)).slice(0,4);return {regular:{ids:[...producers.map(mon=>mon.id),heal.id],label:'无特殊宝可梦'}}};
const common={pokemon:box,context:islandContext,recommendTeams:recommend,individualProductionScore:outputScore,isFullTeamHealer:healer,isSpecialPokemon:monId=>special(box.find(mon=>String(mon.id)===String(monId))||{}),planner:teamPlanner,production:context.POKEMON_SLEEP_TEAM_PRODUCTION.byBoxId,goodCamp:true,activityKey:'snapshot',recipes:realRecipes,recipeType:'沙拉',basePot:81,mealGoal:15,completedMeals:[],inventory:{},now:monday};
const target=weekly.recipeRows(realRecipes,'沙拉',121)[0];
const realPlan=weekly.calculatePlan({...common,targetRecipeId:target.id});
assert.equal(realPlan.preparationTeam.members.length,5);
assert.equal(realPlan.outputTeam.members.length,5);
assert.equal(realPlan.targetRecipe.id,target.id);
assert.equal(realPlan.budget.goal,15);
assert.ok(realPlan.budget.rows.length>0);
assert.ok(['prepare','adjust','output'].includes(realPlan.action.phase));
assert.ok(Number(realPlan.action.collectionHours)>0);
const sleepGatedPlan=weekly.calculatePlan({...common,targetRecipeId:target.id,currentSnorlaxStrength:5000000,sleepType:'balanced',sleepObjective:'combined'});
assert.equal(sleepGatedPlan.currentSleepEnergy,5000000);
assert.equal(sleepGatedPlan.sleepThresholdReached,true);
assert.equal(sleepGatedPlan.sleepPlan.currentStrength,5000000);
assert.equal(sleepGatedPlan.sleepPlan.bedtimeStrength,5000000,'两次研究默认都应使用用户输入的当前能量');
const belowSleepLine=weekly.calculatePlan({...common,targetRecipeId:target.id,currentSnorlaxStrength:1000000,sleepType:'balanced',sleepObjective:'combined'});
assert.equal(belowSleepLine.sleepThresholdReached,false);
assert.equal(belowSleepLine.sleepPlan.available,false,'未达到惩罚线时不应生成分段方案');
const targetSleepBelowLine=weekly.calculatePlan({...common,targetRecipeId:target.id,currentSnorlaxStrength:1000000,sleepType:'balanced',sleepObjective:'pokemon',sleepTargetId:'282'});
assert.equal(targetSleepBelowLine.sleepThresholdReached,false);
assert.equal(targetSleepBelowLine.sleepTarget.id,'282');
assert.equal(targetSleepBelowLine.sleepPlan.available,true,'指定严选目标不应被研究奖励惩罚线拦截');
assert.equal(targetSleepBelowLine.sleepPlan.target.pokemonName,'拉鲁拉丝');
const unavailableTarget=weekly.calculatePlan({...common,targetRecipeId:target.id,currentSnorlaxStrength:1000000,sleepType:'balanced',sleepObjective:'pokemon',sleepTargetId:'392'});
assert.equal(unavailableTarget.sleepPlan.available,false);
assert.ok(unavailableTarget.sleepPlan.reason.includes('不会在当前岛屿出现'));
const preparationPlan=weekly.calculatePlan({...common,targetRecipeId:target.id,weekMode:'preparation'});
assert.ok(preparationPlan.action.title.includes('活动前储备')||preparationPlan.action.phase==='adjust');
const dualRoutePlan=weekly.calculatePlan({...common,goodCamp:false,eventGoodCamp:true,weekMode:'preparation',preparationRecipeTypes:['咖喱／浓汤','沙拉'],travelTicketPlanned:true});
assert.equal(dualRoutePlan.pot,122,'准备周目标锅应读取活动周计划好露营券，并按最终容量四舍五入');
assert.equal(dualRoutePlan.targetRecipes.length,2);
assert.ok(dualRoutePlan.targetRecipe.name.includes('双路线储备'));
assert.ok(dualRoutePlan.action.detail.includes('移动营地券'));
const huntTargets=weekly.buildHuntTargets([{id:'x',name:'大竺葵',specialty:'berry',subs:'树果数量S；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'固执：速度↑ 食材↓',scoreIndividual:88,scoreTotal:82,scoreBreakdown:{finalFormId:'154'}}],'宝蓝湖畔');
assert.equal(huntTargets.find(row=>row.id==='154').status,'covered');
assert.equal(huntTargets.find(row=>row.id==='254').status,'missing');
assert.ok(huntTargets.find(row=>row.id==='154').minimum.includes('Lv.50'));
assert.deepEqual(Object.fromEntries(huntTargets.map(row=>[row.id,row.name])),{
  '154':'大竺葵','254':'蜥蜴王','392':'烈焰猴','282':'沙奈朵'
});
const swampertTarget={id:'260',name:'巨沼怪',best:{speciesId:'259',name:'沼跃鱼'}};
assert.deepEqual(weekly.huntTargetIconIdentity(swampertTarget),{speciesId:'260',name:'巨沼怪'},'严选目标图标应表示目标最终形态，而非盒内当前最好个体');
assert.ok(picker.iconUrl(weekly.huntTargetIconIdentity(swampertTarget),catalog).endsWith('/260.png'));

const wrongArea=weekly.calculatePlan({...common,activityKey:'mewtwo1'});
assert.equal(wrongArea.preparationTeam.carryBonus,0);
const eventArea=weekly.calculatePlan({...common,context:{...islandContext,island:{name:'萌绿之岛',kind:'普通岛'}},activityKey:'mewtwo1'});
assert.equal(eventArea.preparationTeam.carryBonus,8);
assert.equal(eventArea.context.berries[0],'芒芒果','超梦活动周必须固定芒芒果为喜爱树果');
const completed=weekly.calculatePlan({...common,targetRecipeId:target.id,completedMeals:weekly.DAY_NAMES.flatMap((_day,day)=>weekly.MEAL_NAMES.map((_meal,meal)=>`d${day}-m${meal}`)).slice(0,15)});
assert.equal(completed.action.phase,'complete');
assert.equal(completed.budget.remaining,0);

console.log('weekly planner tests passed');
