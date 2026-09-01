'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const weekly = require('../weekly-planner.js');
const teamPlanner = require('../team-planner.js');
const scoring = require('../pokemon-scoring.js');

assert.equal(weekly.effectivePot(81, false), 81);
assert.equal(weekly.effectivePot(81, true), 121);
const monday=new Date(2026,7,31,12,0,0),sunday=new Date(2026,8,6,12,0,0);
assert.equal(weekly.weekKey(monday),'2026-08-31');
assert.equal(weekly.weekKey(sunday),'2026-08-31');
assert.equal(weekly.daysRemainingInWeek(monday),7);
assert.equal(weekly.daysRemainingInWeek(sunday),1);

const normalized=weekly.normalizeState({recipeType:'坏数据',activityKey:'bad',islandIndex:99,mealGoal:80,weekKey:'2026-08-31',completedMeals:['d0-m0','bad']},['特选苹果'],9,monday);
assert.equal(normalized.recipeType,'咖喱／浓汤');
assert.equal(normalized.islandIndex,8);
assert.equal(normalized.mealGoal,21);
assert.deepEqual(normalized.completedMeals,['d0-m0']);
const nextWeek=weekly.normalizeState(normalized,['特选苹果'],9,new Date(2026,8,7,12,0,0));
assert.deepEqual(nextWeek.completedMeals,[]);

const recipes = [
  {id:1,name:'小料理',type:'沙拉',energy:1000,total:10,ingredients:[{name:'特选苹果',amount:10}]},
  {id:2,name:'大料理',type:'沙拉',energy:3000,total:20,ingredients:[{name:'特选苹果',amount:20}]},
  {id:3,name:'咖喱',type:'咖喱／浓汤',energy:5000,total:20,ingredients:[{name:'豆制肉',amount:20}]}
];
assert.equal(weekly.chooseTargetRecipe(recipes,'沙拉',15,{},{}).id,1);
assert.equal(weekly.chooseTargetRecipe(recipes,'沙拉',25,{'特选苹果':60},{'特选苹果':100}).id,2);

const budget=weekly.ingredientBudget(recipes[1],{'特选苹果':30},{'特选苹果':0},15,5,7);
assert.equal(budget.remaining,10);
assert.equal(budget.rows[0].need,200);
assert.equal(budget.rows[0].projectedGap,0);
assert.equal(budget.rows[0].daysToStock,6.7);
const impossible=weekly.ingredientBudget(recipes[1],{'特选苹果':5},{'特选苹果':0},15,0,2);
assert.ok(impossible.projectedShortages.length>0);

const projectRoot = path.resolve(__dirname,'..');
const html = fs.readFileSync(path.join(projectRoot,'index.html'),'utf8');
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
const huntTargets=weekly.buildHuntTargets([{id:'x',name:'大竺葵',specialty:'berry',subs:'树果数量S；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'固执：速度↑ 食材↓',scoreIndividual:88,scoreTotal:82,scoreBreakdown:{finalFormId:'154'}}],'宝蓝湖畔');
assert.equal(huntTargets.find(row=>row.id==='154').status,'covered');
assert.equal(huntTargets.find(row=>row.id==='254').status,'missing');
assert.ok(huntTargets.find(row=>row.id==='154').minimum.includes('Lv.50'));

const wrongArea=weekly.calculatePlan({...common,activityKey:'mewtwo1'});
assert.equal(wrongArea.preparationTeam.carryBonus,0);
const eventArea=weekly.calculatePlan({...common,context:{...islandContext,island:{name:'萌绿之岛',kind:'普通岛'}},activityKey:'mewtwo1'});
assert.equal(eventArea.preparationTeam.carryBonus,8);
const completed=weekly.calculatePlan({...common,targetRecipeId:target.id,completedMeals:weekly.DAY_NAMES.flatMap((_day,day)=>weekly.MEAL_NAMES.map((_meal,meal)=>`d${day}-m${meal}`)).slice(0,15)});
assert.equal(completed.action.phase,'complete');
assert.equal(completed.budget.remaining,0);

console.log('weekly planner tests passed');
