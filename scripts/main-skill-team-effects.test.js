'use strict';

const assert=require('node:assert/strict');
const effects=require('../main-skill-team-effects.js');
const energy=require('../snorlax-energy.js');

function rows(mainSkills=[]){
  return Array.from({length:5},(_,index)=>({
    mon:{name:`成员${index+1}`,finalFormId:String(index+1),berryId:1,main:mainSkills[index]&&mainSkills[index].name||'',mainSkillId:mainSkills[index]&&mainSkills[index].id||0},
    skillLevel:6,
    triggers:2,
    berryEnergyPerBerry:100,
    ordinaryBerryEnergyPerHelp:80
  }));
}

const burst=effects.effectPerUse(0,rows([{id:21,name:'树果骤增'}]),'berry-burst',6);
assert.equal(burst.energyPerUse,5000,'树果骤增必须使用实际五人每颗树果能量');
assert.equal(burst.berryCountPerUse,50);

const support=effects.effectPerUse(0,rows([{id:9,name:'帮手支援S'}]),'helping-support',6);
assert.equal(support.extraHelpsPerUse,11);
assert.equal(support.energyPerUse,880,'额外帮忙只使用普通树果期望，不能再次触发技能');

const boostRows=rows([{id:15,name:'帮手加速'}]);
const boost=effects.effectPerUse(0,boostRows,'helper-boost',6);
assert.equal(boost.extraHelpsPerUse,55,'五种同属性宝可梦应让五名成员各帮忙11次');
assert.equal(boost.energyPerUse,4400);

const healing=effects.effectPerUse(0,rows([{id:8,name:'活力全体疗愈S'}]),'e4e',6);
assert.equal(healing.teamRecoveryPerUse,90.5);
assert.equal(healing.productiveRecoveryPerUse,72.4,'治疗位自身回复不计为另外四名产能位收益');
assert.equal(healing.energyPerUse,0,'活力回复不应伪装成卡比兽能量');

const copiedRows=rows([
  {id:19,name:'技能复制'},
  {id:2,name:'能量填充M'},
  {id:21,name:'树果骤增'},
  {id:8,name:'活力全体疗愈S'},
  {id:10,name:'食材获取S'}
]);
const copied=effects.effectPerUse(0,copiedRows,'skill-copy',6,{energyMechanics:energy,islandBonusPct:0});
assert.equal(copied.energyPerUse,(4546+5000)/4,'技能复制必须按另外四名实际队友等概率抽选');
assert.equal(copied.teamRecoveryPerUse,90.5/4);
assert.ok(copied.detail.includes('Lv.6'));
assert.equal(copied.ingredientsPerUse,21/4,'技能复制抽到食材获取时应保留资源向量');

const crescent=effects.effectPerUse(0,rows([{id:22,name:'新月祈祷'}]),'crescent-prayer',6);
assert.equal(crescent.teamRecoveryPerUse,55);
assert.equal(crescent.berryCountPerUse,48.5,'新月祈祷Lv.6应按25~32与队友各1~9的区间中点计算期望');
assert.match(crescent.detail,/25~32/);

const nightmareRows=rows([{id:23,name:'噩梦'}]);nightmareRows[0].mon.typeId=16;nightmareRows[1].mon.typeId=16;
const nightmare=effects.effectPerUse(0,nightmareRows,'nightmare',7);
assert.equal(nightmare.teamRecoveryPerUse,-36,'噩梦只扣除三名非恶属性队友活力');
assert.deepEqual(nightmare.recoveryByIndex,[0,0,-12,-12,-12]);

const resources=effects.effectPerUse(0,rows([{id:11,name:'料理强化S'}]),'cooking-power',7);
assert.equal(resources.potSlotsPerUse,31);

const selectedIngredients=effects.effectPerUse(0,rows([{id:28,name:'食材精选S'}]),'ingredient-draw',7);
assert.equal(selectedIngredients.ingredientsPerUse,18);

const present=effects.effectPerUse(0,rows([{id:29,name:'礼物（食材获取S）'}]),'present',7);
assert.equal(present.ingredientsPerUse,17);
assert.equal(present.candyPerUse,4/3,'礼物应把1/3概率获得4个糖果保留为独立期望');

const pairedRows=rows([{id:26,name:'正电（食材获取S）'},{id:27,name:'负电（料理强化S）'}]);
pairedRows[0].mon.name='正电拍拍';
const plus=effects.effectPerUse(0,pairedRows,'plus',7);
assert.equal(plus.ingredientsPerUse,30,'正电拍拍Lv.7和正负电搭档同队时应获得18+12个首格食材');
const minus=effects.effectPerUse(1,pairedRows,'minus',7);
assert.equal(minus.potSlotsPerUse,24);
assert.equal(minus.teamRecoveryPerUse,35,'负电Lv.7在搭档条件满足时应随机回复35活力');

const floatingShards=effects.effectPerUse(0,rows([{id:6,name:'梦之碎片获取S（浮动）'}]),'dream-shard-random',8);
assert.deepEqual(floatingShards.dreamShardRangePerUse,[1150,4600]);
assert.equal(floatingShards.dreamShardsPerUse,0,'浮动碎片没有公开分布时不得伪造均值');

const cutter=effects.effectPerUse(0,rows([{id:25,name:'怪力钳（食材精选S）'}]),'hyper-cutter',7);
assert.deepEqual(cutter.ingredientRangePerUse,[18,54]);
assert.equal(cutter.ingredientsPerUse,18,'怪力钳基础量应保留为确定资源');

const lucky=effects.effectPerUse(0,rows([{id:24,name:'超幸运（食材精选S）'}]),'super-luck',7);
assert.deepEqual(lucky.ingredientRangePerUse,[0,18]);
assert.deepEqual(lucky.dreamShardRangePerUse,[0,20000]);
assert.match(lucky.detail,/不会同时获得/);

const juice=effects.effectPerUse(0,rows([{id:32,name:'树果汁'}]),'berry-juice',6);
assert.equal(juice.berryJuicePerUse,.185);
assert.equal(juice.teamRecoveryPerUse,90.5);

const aura=effects.effectPerUse(0,rows([{id:36,name:'波导弹（梦之碎片获取S）'}]),'aura-sphere',7);
assert.equal(aura.dreamShardsPerUse,1800,'波导弹的碎片资源应与固定型碎片表联动');

const mewRows=rows([{id:2,name:'十项全能→能量填充M'}]);mewRows[0].mon.main='十项全能→能量填充M Lv.7';mewRows[0].mon.mainSkillId=2;mewRows[0].skillLevel=7;
const mewCandy=effects.evaluateMember(0,mewRows,{energyMechanics:energy});
assert.equal(mewCandy.candyPerUse,1.6,'梦幻选择直接能量技能时仍应计算十项全能的额外糖果');

assert.equal(effects.effectPerUse(0,rows().slice(0,4),'berry-burst',6).supported,false,'缺少完整五人队时不得伪造队伍收益');

console.log('main skill team effects tests passed');
