'use strict';

const assert=require('assert');
const {auditAnnouncement}=require('../skills/pokemon-sleep-event-update/scripts/audit-announcement.js');

const cooking=auditAnnouncement({title:'大份料理周',sourceUrl:'https://www.pokemonsleep.net/en/news/example/',start:'2026-10-05T04:00:00+09:00',end:'2026-10-12T04:00:00+09:00',areas:'all',effects:[
  {type:'cookingEnergyMultiplier',value:1.25,when:'all',target:'all'},
  {type:'potCapacityMultiplier',value:2,when:'weekday',target:'all'},
  {type:'potCapacityMultiplier',value:4,when:'sunday',target:'all'},
  {type:'ingredientHelpBonus',value:1,when:'all',target:'ingredient-specialist'},
  {type:'skillIngredientMultiplier',value:1.5,when:'all',target:'all'}
]});
assert.equal(cooking.ok,true);
assert.equal(cooking.fullyModeled,false);
assert.equal(cooking.suggestedProfile.cookingEnergyMultiplier,1.25);
assert.equal(cooking.suggestedProfile.potCapacityMultiplier,undefined);
assert.deepStrictEqual(cooking.unmodeled.map(item=>item.type),['potCapacityMultiplier','potCapacityMultiplier','ingredientHelpBonus','skillIngredientMultiplier']);

const growth=auditAnnouncement({title:'快快长大周',sourceUrl:'https://www.pokemonsleep.net/news/example/',start:'2026-11-02T04:00:00+09:00',end:'2026-11-09T04:00:00+09:00',areas:'all',effects:[
  {type:'helperSleepExpMultiplier',value:1.5,when:'all',target:'all'},
  {type:'firstSleepCandyMultiplier',value:1.5,when:'first-sleep',target:'all'}
]});
assert.equal(growth.ok,true);
assert.equal(growth.fullyModeled,false);
assert.equal(growth.unmodeled.length,2);
assert.equal(growth.suggestedProfile.helperSleepExpMultiplier,undefined);

const invalid=auditAnnouncement({title:'?',sourceUrl:'https://example.org/news/',start:'2026-10-12T04:00:00+09:00',end:'2026-10-05T04:00:00+09:00',areas:'all',effects:[{type:'cookingEnergyMultiplier',value:1.25,when:'all'}]});
assert.equal(invalid.ok,false);
assert.ok(invalid.errors.some(error=>error.includes('官方公告')));
assert.ok(invalid.errors.some(error=>error.includes('结束时间')));
assert.ok(invalid.errors.some(error=>error.includes('target')));

console.log('event announcement audit tests passed');
