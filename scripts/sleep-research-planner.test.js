'use strict';

const assert=require('node:assert/strict');
const planner=require('../sleep-research-planner.js');
const curves=require('../sleep-reward-curves.generated.js');

assert.equal(curves.schemaVersion,2);
assert.equal(curves.areas.length,9);
assert.equal(curves.targetDefinitions.length,23);
assert.equal(planner.areaFor('黄金发电厂').id,'old-gold');
assert.equal(planner.areaFor('琥珀溪谷').id,'amber-canyon');
assert.equal(planner.areaFor('萌绿之岛 EX').id,'greengrass-expert');
const lapisTargets=planner.targetDefinitions('宝蓝湖畔');
assert.equal(lapisTargets.length,23);
assert.equal(lapisTargets[0].available,true);
assert.ok(lapisTargets.some(target=>target.id==='392'&&!target.available));

const low=planner.rawResearch({area:'萌绿之岛',energy:500000,score:100,sleepType:'balanced'});
const high=planner.rawResearch({area:'萌绿之岛',energy:2500000,score:100,sleepType:'balanced'});
assert.ok(low.available&&high.available);
assert.ok(high.combined>low.combined,'提高卡比兽能量应提高平均研究奖励');
assert.equal(high.drowsyPower,250000000);
assert.equal(high.spawnCount,8);

const unadjusted=[
  planner.rawResearch({area:'萌绿之岛',energy:5000000,score:50,sleepType:'balanced'}),
  planner.rawResearch({area:'萌绿之岛',energy:5000000,score:50,sleepType:'balanced'})
];
const day=planner.applyResearchDayRules(unadjusted);
assert.ok(day.sessions[1].reducedRewardSpawns>0,'每日第11只起应标记奖励减半');
assert.ok(day.sessions[1].rewardFactor<1);
const camp=planner.applyResearchDayRules(unadjusted,{goodCamp:true});
assert.equal(camp.sessions[0].campExtra,1);
assert.equal(camp.sessions[1].campExtra,0,'好露营券额外遇见只应用于第一次研究');

const gardevoir=planner.targetInfo('282','宝蓝湖畔');
assert.equal(gardevoir.available,true);
assert.equal(gardevoir.pokemonId,'280');
assert.equal(gardevoir.pokemonName,'拉鲁拉丝');
const unavailable=planner.targetInfo('392','宝蓝湖畔');
assert.equal(unavailable.available,false,'本岛不会出现的严选目标不得伪造期望值');
assert.ok(unavailable.availableAreas.some(area=>area.name==='灰褐洞窟'));
const targetPlan=planner.compareTargetSleepPlans({area:'宝蓝湖畔',currentStrength:1000000,sleepType:'balanced',objective:'pokemon',targetId:'282'});
assert.equal(targetPlan.available,true);
assert.equal(targetPlan.bestSplit.scores.reduce((sum,value)=>sum+value,0),100);
assert.ok(targetPlan.single.pokemonAppearances>0);
const targetCandy=planner.compareTargetSleepPlans({area:'宝蓝湖畔',currentStrength:5000000,sleepType:'balanced',objective:'candy',targetId:'282'});
assert.equal(targetCandy.available,true);
assert.ok(targetCandy.bestSplit.candy>0);
assert.ok(targetCandy.bestSplit.sessions[1].reducedRewardSpawns>0,'糖果目标也应计入每日第11只起每只1糖果');

const early=planner.compareSleepPlans({area:'萌绿之岛',currentStrength:400000,bedtimeStrength:500000,sleepType:'balanced',objective:'combined'});
assert.equal(early.recommendation,'single');
const late=planner.compareSleepPlans({area:'萌绿之岛',currentStrength:4000000,bedtimeStrength:5000000,sleepType:'balanced',objective:'combined'});
assert.equal(late.recommendation,'split');
assert.equal(late.bestSplit.scores.reduce((sum,value)=>sum+value,0),100);
assert.ok(late.bestSplit.scores[0]>=18&&late.bestSplit.scores[0]<=99);
assert.ok(late.bestSplit.sessions[1].minutes>=90,'第二次睡眠至少按90分钟显示');

const expectedSlowdowns={
  '萌绿之岛':[3000000,4200000],
  '天青沙滩':[3800000,5200000],
  '宝蓝湖畔':[4300000,5800000],
  '黄金发电厂':[5200000,6800000]
};
for(const [area,[minimum,maximum]] of Object.entries(expectedSlowdowns)){
  const result=planner.slowdownReference({area,sleepType:'balanced',objective:'combined'});
  assert.ok(result&&result.energy>=minimum&&result.energy<=maximum,`${area}减速参考点应落在社区平均曲线的百万级平台起点`);
}

console.log('sleep research planner tests passed');
