'use strict';

const assert = require('node:assert/strict');
const dataApi = require('../pokemon-data.js');

class MemoryStorage {
  constructor(){this.values=new Map()}
  getItem(key){return this.values.has(key)?this.values.get(key):null}
  setItem(key,value){this.values.set(key,String(value))}
  removeItem(key){this.values.delete(key)}
}

const storage = new MemoryStorage();
const seed = [
  {id:'1',name:'妙蛙花',lv:'20',shiny:'否',ingredients:'甜甜蜜×2／甜甜蜜×5／甜甜蜜×7',interval:'50:00',inv:'20',main:'食材获取S Lv.1',subs:'帮手奖励；食材概率S；食材概率M；帮忙速度S；帮忙速度M',nature:'认真',priority:'继续使用'},
  {id:'2',name:'雷丘',lv:'30',shiny:'否',ingredients:'特选苹果×1／特选苹果×2／暖暖姜×3',interval:'40:00',inv:'25',main:'能量填充S Lv.2',subs:'树果数量S；帮手奖励；帮忙速度M；帮忙速度S；技能概率M',nature:'认真',priority:'重点培养'}
];

const loaded = dataApi.load(seed, storage);
assert.equal(loaded.pokemon.length, 2);
assert.equal(loaded.meta.nextDisplayId, 3);

dataApi.writeJson(dataApi.CURRENT_TEAM_KEY, ['1','2'], storage);
dataApi.writeJson(dataApi.SAVED_TEAMS_KEY, [{id:'team-1',members:['1','2','3','4','5']}], storage);

const added = {...seed[0],id:'3',recordId:'new-3',speciesId:'1',finalFormId:'3',name:'妙蛙种子'};
dataApi.upsertPokemon(added, {boxId:'training',battleEligible:true}, storage);
assert.equal(dataApi.readAll(storage).pokemon.length, 3);
assert.equal(dataApi.readJson(dataApi.BOX_KEY, {}, storage).pokemon['3'].boxId, 'training');

const released = dataApi.releasePokemon('2', storage);
assert.equal(released.ok, true);
assert.equal(dataApi.readAll(storage).pokemon.some(mon => mon.id === '2'), false);
assert.equal(dataApi.readAll(storage).recycle.length, 1);
assert.deepEqual(dataApi.readJson(dataApi.CURRENT_TEAM_KEY, [], storage), ['1']);
assert.equal(dataApi.readJson(dataApi.SAVED_TEAMS_KEY, [], storage).length, 0);

const recordId = dataApi.readAll(storage).recycle[0].pokemon.recordId;
assert.equal(dataApi.restorePokemon(recordId, storage).ok, true);
assert.equal(dataApi.readAll(storage).pokemon.some(mon => mon.id === '2'), true);

dataApi.releasePokemon('2', storage);
assert.equal(dataApi.purgePokemon(recordId, storage).ok, true);
assert.equal(dataApi.readAll(storage).recycle.length, 0);
assert.ok(dataApi.readAll(storage).meta.nextDisplayId >= 4);

console.log('pokemon data lifecycle tests passed');
