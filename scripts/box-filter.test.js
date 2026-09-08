'use strict';

const assert=require('assert');
const boxFilter=require('../box-filter.js');

const pokemon=[
  {id:'1',name:'闪光食材手',boxId:'main',boxName:'实战主力',battleEligible:true,shiny:'是',specialty:'ingredient',cultivation:{tier:'core',label:'核心培养'}},
  {id:'2',name:'普通食材手',boxId:'main',boxName:'实战主力',battleEligible:true,shiny:'否',specialty:'ingredient',cultivation:{tier:'stage',label:'阶段培养'}},
  {id:'3',name:'闪光技能手',boxId:'shiny',boxName:'闪光收藏',battleEligible:false,shiny:'是',specialty:'skill',cultivation:{tier:'collection',label:'收藏用途'}}
];

assert.deepStrictEqual(boxFilter.filter(pokemon,{specialty:'ingredient'}).map(mon=>mon.id),['1','2']);
assert.deepStrictEqual(boxFilter.filter(pokemon,{specialty:'ingredient',shiny:'是'}).map(mon=>mon.id),['1'],'两个筛选条件必须取交集');
assert.deepStrictEqual(boxFilter.filter(pokemon,{boxId:'main',eligibility:'battle',cultivationTier:'core'}).map(mon=>mon.id),['1'],'三个筛选条件必须同时生效');
assert.deepStrictEqual(boxFilter.filter(pokemon,{query:'#3',shiny:'是'}).map(mon=>mon.id),['3'],'精确编号搜索也必须与其他条件取交集');
assert.strictEqual(boxFilter.activeCount({specialty:'ingredient',shiny:'是'}),2);
assert.deepStrictEqual(boxFilter.optionCounts(pokemon,{specialty:'ingredient'},'shiny',['','是','否']),{'':2,'是':1,'否':1});

console.log('box filter tests passed');
