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
first.setItem('pokemon-sleep-user-pokemon-v1', JSON.stringify([{id:'1',name:'妙蛙花'}]));
first.setItem('pokemon-sleep-state-clock-v1', JSON.stringify({updatedAt:'2026-08-31T00:00:00.000Z'}));
const state = cloud.collectState(first);
assert.equal(state.schemaVersion, 1);
assert.equal(state.data.pokemon.length, 1);

const second = new MemoryStorage();
assert.equal(cloud.applyState(state, second), true);
assert.deepEqual(JSON.parse(second.getItem('pokemon-sleep-user-pokemon-v1')), state.data.pokemon);
assert.equal(cloud.hashState(cloud.collectState(second)), cloud.hashState(state));

assert.equal(cloud.errorMessage({code:'PGRST205',message:'schema cache'}).includes('SQL'), true);
console.log('cloud state serialization tests passed');
