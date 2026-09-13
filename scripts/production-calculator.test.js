'use strict';
const assert=require('node:assert/strict');
const calculator=require('../production-calculator.js');
const rules=require('../all-rounder-rules.js');
const planner=require('../team-planner.js');

const base={lv:'50',interval:'45:00',inv:'30',ingredients:'萌绿玉米×2／萌绿玉米×5／豆制肉×7',subs:'帮忙速度M；食材概率M；持有上限M；—；—',nature:'认真',specialty:'ingredient',berryId:1,berry:'柿仔果',main:'能量填充S Lv.1',mainSkillId:1,skillRatePct:3,battleEligible:true};
const candidates=[
  {...base,id:'a',name:'个体甲'},
  {...base,id:'b',name:'个体乙',interval:'50:00'},
  {...base,id:'c',name:'个体丙',interval:'55:00'}
];
const supporters=Array.from({length:4},(_,index)=>({...base,id:`s${index}`,name:`队友${index}`,ingredients:'特选苹果×1／特选苹果×2／特选苹果×4'}));
const production={a:{ingredientRate:.25,baseBerryCount:1},b:{ingredientRate:.25,baseBerryCount:1},c:{ingredientRate:.25,baseBerryCount:1},...Object.fromEntries(supporters.map(mon=>[mon.id,{ingredientRate:.2,baseBerryCount:1}]))};
const result=calculator.compareMany(candidates,'萌绿玉米',{teamPlanner:planner,production,baselineTeam:supporters,goodCamp:true,energyProfile:'average'});
assert.equal(result.rows.length,3,'生产计算器应支持多个体比较');
assert.equal(result.leader.id,'a');
assert.ok(result.rows[0].ingredient.low<result.rows[0].ingredient.mean&&result.rows[0].ingredient.high>result.rows[0].ingredient.mean,'食材应显示常见波动区间');
assert.equal(result.rows[0].fullTeam,true,'有四名共同背景队友时应运行完整五人联动');
assert.equal(result.rows[0].unlockedSlots.length,2,'生产卡片应保留目标食材的已解锁栏位供界面显示');
assert.deepEqual(result.rows[0].lockedSlots,[]);
assert.match(calculator.formatRange(result.rows[0].energy),/~/);
assert.equal(result.role,'ingredient');
assert.ok(result.rows[0].teamEnergy.mean>result.rows[0].energy.mean,'完整队伍对比应同时返回五人纯能量收益');
const inactiveSupporter={...supporters[0],id:'inactive',battleEligible:false};
const filteredTeam=calculator.comparisonTeam(candidates[0],[inactiveSupporter,...supporters],candidates.map(mon=>mon.id));
assert.equal(filteredTeam.length,5,'仅收藏成员不应挤占多个体对比的共同队伍背景');
assert.ok(filteredTeam.every(mon=>mon.battleEligible!==false));

const berryFast={...base,id:'bf',name:'树果甲',specialty:'berry',interval:'40:00',ingredients:'特选苹果×1／特选苹果×2／特选苹果×4'};
const berrySlow={...base,id:'bs',name:'树果乙',specialty:'berry',interval:'55:00',ingredients:'特选苹果×1／特选苹果×2／特选苹果×4'};
const berryComparison=calculator.compareMany([berrySlow,berryFast],'特选苹果',{role:'berry',teamPlanner:planner,production:{...production,bf:{ingredientRate:.1,baseBerryCount:2},bs:{ingredientRate:.1,baseBerryCount:2}},baselineTeam:supporters,goodCamp:true,energyProfile:'average'});
assert.equal(berryComparison.leader.id,'bf','树果位应按预期纯能量而不是食材数量排序');
assert.ok(berryComparison.rows.every(row=>row.berries>0&&row.berryEnergy>0));

const skillFrequent={...base,id:'sf',name:'技能甲',specialty:'skill',interval:'45:00',skillRatePct:8,main:'能量填充S Lv.1',mainSkillId:1};
const skillRare={...base,id:'sr',name:'技能乙',specialty:'skill',interval:'45:00',skillRatePct:2,main:'能量填充S Lv.1',mainSkillId:1};
const skillComparison=calculator.compareMany([skillRare,skillFrequent],'萌绿玉米',{teamPlanner:planner,production:{...production,sf:{ingredientRate:.2,baseBerryCount:1},sr:{ingredientRate:.2,baseBerryCount:1}},baselineTeam:supporters,goodCamp:true,energyProfile:'average'});
assert.equal(skillComparison.leader.id,'sf','技能手应优先按预期触发次数排序');
assert.ok(skillComparison.leader.triggers>skillComparison.rows.find(row=>row.id==='sr').triggers);
assert.equal(skillComparison.role,'skill','同为技能手时应根据宝可梦定位自动采用技能口径');
assert.ok(skillComparison.leader.skillProbability.current>skillComparison.rows.find(row=>row.id==='sr').skillProbability.current,'技能对比必须返回计入性格与副技能后的当前技能概率');
assert.equal(calculator.comparisonRole(skillFrequent),'skill');
assert.equal(calculator.comparisonRole({...skillFrequent,main:'树果骤增 Lv.6',mainSkillId:21}),'berry','树果骤增技能手必须归入树果位');
assert.equal(calculator.comparisonRole({...skillFrequent,main:'流星群（树果骤增） Lv.6',mainSkillId:35}),'berry');
assert.equal(calculator.comparisonRole(base),'ingredient');

const cutter={...base,id:'h',name:'怪力钳测试',specialty:'skill',main:'怪力钳（食材精选S） Lv.7',mainSkillId:25};
const cutterView=calculator.calculate(cutter,'萌绿玉米',{teamPlanner:planner,production:{...production,h:{ingredientRate:.2,baseBerryCount:1}},baselineTeam:supporters,goodCamp:true,energyProfile:'average'});
assert.ok(cutterView.resources.ingredientRange[1]>cutterView.resources.ingredientRange[0],'复杂技能的随机资源上下界必须传到多个体生产卡片');

const mew=rules.apply({...base,id:'m',speciesId:'151',name:'梦幻',main:'十项全能 Lv.3'},'berry-burst');
assert.equal(mew.mainSkillId,21);
assert.equal(mew.skillRatePct,3.2);
assert.match(mew.main,/十项全能→树果骤增 Lv\.3/);
assert.equal(rules.assess(mew).role,'树果联动输出位');
assert.match(rules.assess({...base,speciesId:'491',name:'达克莱伊',main:'噩梦（能量填充M） Lv.1'}).team,/恶属性/);
assert.equal(calculator.mewSkillScenarios(mew,'萌绿玉米',{teamPlanner:planner,production:{...production,m:{ingredientRate:.2,baseBerryCount:2}},baselineTeam:supporters,goodCamp:true,energyProfile:'average'}).length,12);

console.log('production calculator tests passed');
