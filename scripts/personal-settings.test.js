'use strict';

const assert=require('assert');
require('../snorlax-energy.js');
const settings=require('../personal-settings.js');

function storage(seed={}){
  const values=new Map(Object.entries(seed));
  return {getItem:key=>values.has(key)?values.get(key):null,setItem:(key,value)=>values.set(key,String(value)),values};
}

const ingredients=['萌绿玉米','哞哞鲜奶','特选苹果'];
const recipes=[{id:1,name:'测试料理'},{id:2,name:'第二料理'}];
const context={ingredients,recipes,islands:[{name:'萌绿之岛'},{name:'天青沙滩'}],activityProfiles:{normal:{label:'普通周'}}};
const normalized=settings.normalizeState({schemaVersion:2,currentIsland:'cyan',weekMode:'event',islandBonuses:{cyan:120},recipeLevels:{1:60},cookedRecipeIds:[1],ingredientStock:{萌绿玉米:700,哞哞鲜奶:200}},context);
assert.strictEqual(normalized.currentIsland,'cyan');
assert.strictEqual(settings.islandBonus(normalized),85);
assert.strictEqual(settings.recipeLevel(normalized,1),60);
assert.strictEqual(settings.recipeLevel(normalized,2),1);
assert.strictEqual(normalized.schemaVersion,2);
assert.ok(settings.isCooked(normalized,1));
assert.strictEqual(settings.inventoryTotal(normalized.ingredientStock),800,'库存规范化必须遵守800硬上限');

const upgraded=settings.normalizeState({schemaVersion:1,recipeBonuses:{1:60}},context);
assert.strictEqual(settings.recipeLevel(upgraded,1),30,'旧版60%应迁移到最接近的Lv.30（+61%）');

const changed=settings.setIngredientStock(normalized,'特选苹果',500);
assert.strictEqual(settings.inventoryTotal(changed.ingredientStock),800,'单项修改不得让总库存超过800');

const old=storage({
  'pokemon-sleep-weekly-plan-v1':JSON.stringify({islandIndex:1,inventory:{萌绿玉米:300,哞哞鲜奶:100}}),
  'pokemon-sleep-team-energy-settings-v1':JSON.stringify({islandBonusPct:85}),
  'pokemon-sleep-recipe-level-bonus-v1':'60'
});
const migrated=settings.migrate(old,context);
assert.strictEqual(migrated.currentIsland,'cyan');
assert.strictEqual(settings.islandBonus(migrated),85);
assert.strictEqual(settings.recipeLevel(migrated,2),30);
assert.strictEqual(migrated.ingredientStock['萌绿玉米'],300);
assert.ok(old.values.has(settings.STORAGE_KEY));

console.log('personal settings tests passed');
