'use strict';

const assert=require('assert');
const boxFilter=require('../box-filter.js');

const pokemon=[
  {id:'1',pokedexId:25,name:'闪光食材手',boxId:'main',boxName:'实战主力',battleEligible:true,collectionIntent:true,shiny:'是',speciesTier:'S',specialty:'ingredient',cultivation:{tier:'core',label:'核心培养'}},
  {id:'2',pokedexId:1,name:'普通食材手',boxId:'main',boxName:'实战主力',battleEligible:true,collectionIntent:false,shiny:'否',speciesTier:'A',specialty:'ingredient',cultivation:{tier:'stage',label:'阶段培养'}},
  {id:'3',pokedexId:25,name:'闪光技能手',boxId:'shiny',boxName:'闪光收藏',battleEligible:false,collectionIntent:true,shiny:'是',speciesTier:'B',specialty:'skill',cultivation:{tier:'avoid',label:'暂不建议'}},
  {id:'4',pokedexId:151,name:'普通技能手',boxId:'pending',boxName:'待整理',battleEligible:false,collectionIntent:false,shiny:'否',speciesTier:'C',specialty:'skill',cultivation:{tier:'avoid',label:'暂不建议'}}
];

assert.deepStrictEqual(boxFilter.filter(pokemon,{specialty:'ingredient'}).map(mon=>mon.id),['1','2']);
assert.deepStrictEqual(boxFilter.filter(pokemon,{specialty:['ingredient','skill'],shiny:'是'}).map(mon=>mon.id),['1','3'],'同一组多选取任一，跨组筛选取交集');
assert.deepStrictEqual(boxFilter.filter(pokemon,{boxId:'main',eligibility:['both','battle-only'],cultivationTier:['core','stage']}).map(mon=>mon.id),['1','2'],'多个筛选组必须同时生效');
assert.deepStrictEqual(boxFilter.filter(pokemon,{query:'#25',shiny:'是'}).map(mon=>mon.id),['1','3'],'#编号应按图鉴号搜索，并继续叠加其他条件');
assert.deepStrictEqual(boxFilter.filter(pokemon,{query:'个体 #3'}).map(mon=>mon.id),['3'],'个体编号必须使用明确前缀搜索');
assert.deepStrictEqual(boxFilter.filter(pokemon,{eligibility:'collection'}).map(mon=>mon.id),['1','3'],'兼容收藏筛选时应包含收藏＋实战');
assert.deepStrictEqual(boxFilter.filter(pokemon,{speciesTier:['S','A']}).map(mon=>mon.id),['1','2'],'梯级筛选同组多选应取并集');
assert.strictEqual(boxFilter.activeCount({specialty:['ingredient','skill'],shiny:'是'}),3);
assert.strictEqual(boxFilter.activeGroupCount({specialty:['ingredient','skill'],shiny:'是'}),2);
assert.deepStrictEqual(boxFilter.optionCounts(pokemon,{specialty:'ingredient'},'shiny',['是','否']),{'是':1,'否':1});
assert.deepStrictEqual([...pokemon].sort(boxFilter.comparePokedex).map(mon=>mon.id),['2','1','3','4'],'图鉴号相同才按个体编号排序');
assert.deepStrictEqual(boxFilter.normalize({specialty:'ingredient,skill'}).specialty,['ingredient','skill']);
assert.deepStrictEqual(boxFilter.normalize({speciesTier:'S,A'}).speciesTier,['S','A']);

console.log('box filter tests passed');
