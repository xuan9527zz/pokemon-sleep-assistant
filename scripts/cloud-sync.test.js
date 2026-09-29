'use strict';

const assert = require('node:assert/strict');
const cloud = require('../cloud-sync.js');

class MemoryStorage {
  constructor(){this.values=new Map()}
  getItem(key){return this.values.has(key)?this.values.get(key):null}
  setItem(key,value){this.values.set(key,String(value))}
}

const left = {b:2,a:{z:3,y:[2,1]}};
const right = {a:{y:[2,1],z:3},b:2};
assert.equal(cloud.stableString(left), cloud.stableString(right));
assert.equal(cloud.hashState(left), cloud.hashState(right));

const first = new MemoryStorage();
first.setItem('pokemon-sleep-user-pokemon-v1', JSON.stringify([{id:'1',name:'妙蛙花',customNumber:'A-01',note:'旧备注'}]));
first.setItem('pokemon-sleep-weekly-plan-v1', JSON.stringify({islandIndex:4,basePot:81}));
first.setItem('pokemon-sleep-personal-settings-v1', JSON.stringify({currentIsland:'lapis',islandBonuses:{lapis:85}}));
first.setItem('pokemon-sleep-advisor-preferences-v1', JSON.stringify({accountStage:'forming'}));
first.setItem('pokemon-sleep-state-clock-v1', JSON.stringify({updatedAt:'2026-08-31T00:00:00.000Z'}));
const state = cloud.collectState(first);
assert.equal(state.schemaVersion, 1);
assert.equal(state.data.pokemon.length, 1);
assert.equal(state.data.weeklyPlan.islandIndex, 4);
assert.equal(state.data.personalSettings.islandBonuses.lapis,85);
assert.equal(Object.hasOwn(state.data,'advisorPreferences'),false);
assert.equal(Object.hasOwn(state.data.pokemon[0],'customNumber'),false);
assert.equal(Object.hasOwn(state.data.pokemon[0],'note'),false);

const second = new MemoryStorage();
assert.equal(cloud.applyState(state, second), true);
assert.deepEqual(JSON.parse(second.getItem('pokemon-sleep-user-pokemon-v1')), state.data.pokemon);
assert.deepEqual(JSON.parse(second.getItem('pokemon-sleep-weekly-plan-v1')), state.data.weeklyPlan);
assert.deepEqual(JSON.parse(second.getItem('pokemon-sleep-personal-settings-v1')), state.data.personalSettings);
assert.equal(second.getItem('pokemon-sleep-advisor-preferences-v1'),null);
assert.equal(cloud.hashState(cloud.collectState(second)), cloud.hashState(state));

assert.equal(cloud.errorMessage({code:'PGRST205',message:'schema cache'}).includes('SQL'), true);
assert.deepEqual(cloud.parseEmailProof('123456','https://example.supabase.co'),{kind:'code',token:'123456'});
assert.deepEqual(cloud.parseEmailProof('https://example.supabase.co/auth/v1/verify?token=abc&type=magiclink&redirect_to=https%3A%2F%2Fother.example','https://example.supabase.co'),{kind:'link',token:'abc',type:'magiclink'});
assert.equal(cloud.parseEmailProof('https://other.example/auth/v1/verify?token=abc&type=magiclink','https://example.supabase.co'),null);
assert.equal(cloud.parseEmailProof('https://example.supabase.co/auth/v1/verify?token=abc&type=recovery','https://example.supabase.co'),null);
console.log('cloud state serialization tests passed');
