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
const normalized=weekly.normalizeState({recipeType:'坏数据',activityKey:'bad',strategy:'bad',islandIndex:99},['特选苹果'],9);
assert.equal(normalized.recipeType,'咖喱／浓汤');
assert.equal(normalized.islandIndex,8);

const recipes = [
  {id:1,name:'小料理',type:'沙拉',energy:1000,total:10,ingredients:[{name:'特选苹果',amount:10}]},
  {id:2,name:'大料理',type:'沙拉',energy:3000,total:20,ingredients:[{name:'特选苹果',amount:20}]},
  {id:3,name:'咖喱',type:'咖喱／浓汤',energy:5000,total:20,ingredients:[{name:'豆制肉',amount:20}]}
];
assert.equal(weekly.chooseTargetRecipe(recipes,'沙拉',15,{},{}).id,1);
assert.equal(weekly.chooseTargetRecipe(recipes,'沙拉',25,{'特选苹果':60},{'特选苹果':100}).id,2);

const meals = weekly.simulateMeals({recipes,type:'沙拉',pot:25,daily:{'特选苹果':60},inventory:{'特选苹果':100},cookingMultiplier:1});
assert.equal(meals.meals.length,21);
assert.equal(meals.cooked,21);
assert.ok(meals.expectedEnergy>meals.normalEnergy);
assert.equal(meals.meals[18].critFactor,1.6);

const shortages = weekly.targetShortages(recipes[1],{'特选苹果':30},{'特选苹果':0});
assert.equal(shortages[0].shortage,210);

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
const realPlan=weekly.calculatePlan({pokemon:box,context:islandContext,recommendTeams:recommend,individualProductionScore:outputScore,isFullTeamHealer:healer,isSpecialPokemon:special,planner:teamPlanner,production:context.POKEMON_SLEEP_TEAM_PRODUCTION.byBoxId,goodCamp:true,activityKey:'snapshot',recipes:realRecipes,recipeType:'沙拉',basePot:81,strategy:'balanced',inventory:{}});
assert.equal(realPlan.team.members.length,5);
assert.equal(realPlan.meals.meals.length,21);
assert.ok(Object.keys(realPlan.team.daily).length>0);
const wrongArea=weekly.calculatePlan({pokemon:box,context:islandContext,recommendTeams:recommend,individualProductionScore:outputScore,isFullTeamHealer:healer,isSpecialPokemon:special,planner:teamPlanner,production:context.POKEMON_SLEEP_TEAM_PRODUCTION.byBoxId,goodCamp:true,activityKey:'mewtwo1',recipes:realRecipes,recipeType:'沙拉',basePot:81,strategy:'balanced',inventory:{}});
assert.equal(wrongArea.team.carryBonus,0);
const eventArea=weekly.calculatePlan({pokemon:box,context:{...islandContext,island:{name:'萌绿之岛',kind:'普通岛'}},recommendTeams:recommend,individualProductionScore:outputScore,isFullTeamHealer:healer,isSpecialPokemon:special,planner:teamPlanner,production:context.POKEMON_SLEEP_TEAM_PRODUCTION.byBoxId,goodCamp:true,activityKey:'mewtwo1',recipes:realRecipes,recipeType:'沙拉',basePot:81,strategy:'balanced',inventory:{}});
assert.equal(eventArea.team.carryBonus,8);
console.log('weekly planner tests passed');
