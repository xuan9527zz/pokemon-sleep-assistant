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
  {id:3,name:'食材获取S'}
]);
const copied=effects.effectPerUse(0,copiedRows,'skill-copy',6,{energyMechanics:energy,islandBonusPct:0});
assert.equal(copied.energyPerUse,(4546+5000)/4,'技能复制必须按另外四名实际队友等概率抽选');
assert.equal(copied.teamRecoveryPerUse,90.5/4);
assert.ok(copied.detail.includes('Lv.6'));

assert.equal(effects.effectPerUse(0,rows().slice(0,4),'berry-burst',6).supported,false,'缺少完整五人队时不得伪造队伍收益');

console.log('main skill team effects tests passed');
