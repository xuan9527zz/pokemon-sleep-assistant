'use strict';

const assert = require('node:assert/strict');
const scoring = require('../pokemon-scoring.js');
const teamPlanner = require('../team-planner.js');
const weekly = require('../weekly-planner.js');
const berries = ['柿仔果','苹野果','橙橙果','萄葡果','金枕果','莓莓果','樱子果','零余果','勿花果','椰木果','芒芒果','木子果','文柚果','墨莓果','番荔果','异奇果','靛莓果','桃桃果'];

const rows = [
  ['妙蛙花', 'ingredient', '甜甜蜜×2／甜甜蜜×5／好眠番茄×7', '食材获取S Lv.3', '帮手奖励；食材概率M；帮忙速度S；持有上限M；技能概率S', '39:00', 18],
  ['水箭龟', 'ingredient', '哞哞鲜奶×2／哞哞鲜奶×5／放松可可×7', '食材获取S Lv.3', '食材概率M；帮手奖励；帮忙速度S；持有上限M；技能概率S', '40:00', 19],
  ['火爆兽', 'berry', '暖暖姜×1／暖暖姜×2／火辣香草×3', '能量填充S Lv.3', '树果数量S；帮忙速度M；帮手奖励；技能概率S；持有上限M', '33:00', 15],
  ['雷丘', 'berry', '特选苹果×1／特选苹果×2／暖暖姜×3', '能量填充S Lv.3', '树果数量S；帮忙速度M；帮手奖励；技能概率S；持有上限M', '32:00', 16],
  ['沙奈朵', 'skill', '特选苹果×1／特选苹果×2／粗枝大葱×2', '活力全体疗愈S Lv.6', '帮手奖励；技能概率M；帮忙速度S；技能概率S；持有上限M', '37:00', 17]
];
const team = rows.map(([name,specialty,ingredients,main,subs,interval,inv],index) => {
  const mon = {id:`audit-${index}`,name,specialty,ingredients,main,subs,interval,inv:String(inv),lv:'50',nature:'认真',battleEligible:true};
  const species = scoring.recordForPokemon(mon);
  return {...mon,berryId:species.berryId,berry:berries[species.berryId-1],skillRatePct:species.skillRatePct,mainSkillId:species.mainSkill.id,catalogHelpFrequencyBaseSec:species.helpFrequencyBaseSec};
});
const production = Object.fromEntries(team.map(mon => {
  const species = scoring.recordForPokemon(mon);
  return [mon.id,{ingredientRate:species.ingredientRate,baseBerryCount:species.baseBerryCount}];
}));
const recipe = {id:'audit-recipe',name:'审计食谱',type:'沙拉',total:10,ingredients:[{name:'特选苹果',amount:10}]};
const baseContext = {island:{name:'宝蓝湖畔'},berries:['金枕果','芒芒果','樱子果'],expert:false};
const base = {
  pokemon:team,production,planner:teamPlanner,targetRecipe:recipe,recipeEnergy:()=>1000,
  recommendTeams:()=>({regular:{ids:team.map(mon=>mon.id)}}),
  individualProductionScore:mon=>100-Number(mon.id.slice(-1)),
  isFullTeamHealer:mon=>mon.name==='沙奈朵',isSpecialPokemon:()=>false,
  inventory:{'特选苹果':100},mealGoal:1,autoTasty:false,
  now:new Date(2026,8,28,4,0,0),context:baseContext
};

function close(actual,expected,label){
  assert.ok(Math.abs(actual-expected)<1e-8,`${label}: ${actual} !== ${expected}`);
}
function audit(label,overrides={}){
  const input={...base,...overrides},sim=weekly.simulateActivityWeek(input);
  assert.equal(sim.available,true,label);
  assert.equal(sim.stages.reduce((sum,stage)=>sum+stage.hours,0),sim.totalHours,`${label}: every hour must be assigned once`);
  const energySum=sim.stages.reduce((sum,stage)=>sum+stage.baseEnergy,0);
  assert.ok(Math.abs(sim.helperEnergy-energySum-sim.zoneBonusEnergy)<=sim.stages.length,`${label}: total energy must reconcile with stage rounding`);
  for(const stage of sim.stages){
    assert.ok(stage.breakdown,`${label}/${stage.kind}: stage has no exact team calculation`);
    const eventArea=weekly.activityApplies(input.activity||weekly.ACTIVITY_PROFILES.normal,input.context);
    const bonus=eventArea?Number(input.activity&&input.activity.carryBonus)||0:0;
    const directTeam=stage.team.map(mon=>bonus?{...mon,inv:String((Number(mon.inv)||0)+bonus)}:mon);
    const direct=teamPlanner.calculateTeam(directTeam,production,{
      ...sim.teamSettings,energyProfile:'timeline',goodCamp:input.goodCamp===true,
      memberModifier:weekly.activityMemberModifier(input.activity||weekly.ACTIVITY_PROFILES.normal,eventArea),
      durationHours:stage.hours,swapAtEnd:stage!==sim.stages.at(-1)
    });
    const actual=stage.breakdown,expected=weekly.teamBreakdown(direct);
    assert.deepEqual(actual,expected,`${label}/${stage.kind}: current-team and event-stage breakdowns differ`);
    close(actual.helps,actual.normalHelps+actual.sneakyHelps,`${label}: ordinary + sneaky helps`);
    close(actual.totalEnergy,actual.berryEnergy+actual.skillEnergy,`${label}: pure energy components`);
    close(actual.berryEnergy,direct.energy.berryEnergy,`${label}: berry energy`);
    close(actual.directSkillEnergy,direct.energy.directSkillEnergy,`${label}: direct skill energy`);
    close(actual.complexSkillEnergy,direct.energy.complexSkillEnergy,`${label}: linked skill energy`);
    close(actual.teamRecovery,direct.energy.teamRecovery,`${label}: team recovery`);
    close(actual.productiveRecovery,direct.energy.productiveRecovery,`${label}: productive recovery`);
    close(actual.triggers,direct.energy.timeline.totals.triggers,`${label}: collected triggers`);
    close(actual.lostTriggers,direct.energy.timeline.totals.lostTriggers,`${label}: lost triggers`);
    actual.members.forEach((member,index)=>{
      close(member.endingEnergy,direct.energy.members[index].endingEnergy,`${label}: ${member.name} ending energy`);
      assert.deepEqual(member.energyStages,direct.energy.members[index].energyStages,`${label}: ${member.name} energy stages`);
    });
    for(const [name,amount] of Object.entries(actual.ingredients)){
      close(amount,direct.ingredients.find(row=>row.name===name).perDay*stage.hours/24,`${label}: ${name}`);
    }
  }
  return sim;
}

audit('ordinary day',{days:1,islandProfile:'lapis',islandBonusPct:85,skillCollectionHours:4});
const split = audit('full bag, long collection and Good Camp',{days:1,goodCamp:true,skillCollectionHours:12});
assert.ok(split.stages.some(stage=>stage.hours===.25&&stage.breakdown),'15-minute stage must use the exact team timeline');
assert.ok(split.warnings.some(message=>message.includes('跨阶段')),'split stages must disclose that energy and inventory are not carried over');
const fullWeek = audit('full week, daily sleep and recovery',{days:7,goodCamp:true,skillCollectionHours:4});
assert.equal(fullWeek.stages.length,1,'full-week regression should cover one uninterrupted team');
audit('24-hour collection',{days:1,skillCollectionHours:24});
audit('EX weekly ingredient bonus',{days:1,context:{island:{name:'萌绿之岛 EX'},berries:['樱子果','金枕果','芒芒果'],expert:true},islandProfile:'greengrass-expert',exWeeklyEffect:'ingredient',skillCollectionHours:1});
audit('EX weekly skill bonus',{days:1,context:{island:{name:'天青沙滩 EX'},berries:['芒芒果','樱子果','金枕果'],expert:true},islandProfile:'cyan-expert',exWeeklyEffect:'skill',skillCollectionHours:4});
audit('event member bonus',{days:1,context:{island:{name:'萌绿之岛'},berries:['芒芒果','金枕果','樱子果'],expert:false},activity:weekly.ACTIVITY_PROFILES.mewtwo1,islandProfile:'none',skillCollectionHours:8});

console.log('team/week parity tests passed');
