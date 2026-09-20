'use strict';

const assert=require('node:assert/strict');
const advisor=require('../cultivation-advisor.js');

const mon=(speciesTier,individualGrade,extra={})=>({
  id:`${speciesTier}-${individualGrade}`,name:'测试宝可梦',shiny:'否',lv:1,
  scoreBreakdown:{speciesTier,individualGrade,individualScore:1.8,individual:{grade:individualGrade},finalFormId:'1',finalFormNameZh:'测试宝可梦'},
  ...extra
});
const tier=(species,individual,extra)=>advisor.assess(mon(species,individual,extra),[]).tier;

assert.equal(tier('S','S'),'core');
assert.equal(tier('S','A'),'recommended');
assert.equal(tier('S','B'),'stage');
assert.equal(tier('A','S'),'recommended');
assert.equal(tier('A','A'),'recommended');
assert.equal(tier('A','B'),'transition');
assert.equal(tier('B','S'),'transition');
assert.equal(tier('B','A'),'transition');
assert.equal(tier('B','B'),'transition');

assert.equal(tier('S','C'),'release');
assert.equal(tier('C','S'),'release');
assert.equal(tier('C','C',{shiny:'是'}),'collection','闪光只在基础暂不培养时触发收藏保护');
assert.equal(tier('S','S',{shiny:'是'}),'core','闪光双S仍按基础矩阵进入核心培养');
assert.equal(tier('C','C',{name:'梦幻',speciesId:'151',finalFormId:'151'}),'collection','限定个体在暂不培养时进入收藏保护');
assert.equal(tier('C','C',{lv:70,boxId:'main',priority:'重点培养'}),'release','已有投入不得改变放生判断');
assert.equal(tier('C','C',{ingredients:'A／B／C'}),'release','独特路线不得单独覆盖基础矩阵');
assert.equal(advisor.assess({name:'缺资料'},[]).tier,'manual');
assert.match(advisor.explanation(advisor.assess(mon('C','C'),[])),/不会自动放生或删除/);
assert.equal(advisor.stageProfile('starter').id,'starter');
assert.match(advisor.stageProfile('starter').description,/不再改变结论/);

console.log('cultivation advisor tests passed (fixed matrix and collection protection)');
