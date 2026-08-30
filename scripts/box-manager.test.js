'use strict';

const assert = require('assert');
const manager = require('../box-manager.js');

const shinyCollection = {
  id:'7',name:'拉达',lv:'15',shiny:'是',priority:'闪光收藏',
  main:'活力填充S Lv.2',
  subs:'持有上限S；帮忙速度S；食材概率S；技能概率S；梦之碎片奖励'
};
const shinyUsable = {
  id:'10',name:'雷丘',lv:'18',shiny:'是',priority:'闪光且可用',
  main:'能量填充S Lv.2',
  subs:'梦之碎片奖励；食材概率S；食材概率M；帮忙速度S；帮手奖励'
};
const mythical = {
  id:'62',name:'梦幻',lv:'38',shiny:'否',priority:'继续使用',
  main:'十项全能 Lv.3',
  subs:'技能等级S；技能概率S；帮忙速度S；持有上限M；帮手奖励'
};

assert.strictEqual(manager.defaultBoxId(shinyCollection),'shiny');
assert.strictEqual(manager.defaultBattleEligible(shinyCollection,'shiny'),false);
assert.strictEqual(manager.defaultBoxId(shinyUsable),'main');
assert.strictEqual(manager.defaultBattleEligible(shinyUsable,'main'),true);
assert.strictEqual(manager.defaultBoxId(mythical),'special');

const speedOnly = {
  id:'1',name:'测试速度',lv:'25',priority:'继续使用',main:'能量填充M Lv.3',
  subs:'帮忙速度S；帮手奖励；技能概率S；技能等级S；持有上限S'
};
const speedRecord = manager.normalizeRecord(speedOnly,{boxId:'main',battleEligible:true,upgrades:{}});
const speedInfo = manager.upgradeInfo(speedOnly,speedRecord,0,25);
assert.strictEqual(speedInfo.allowed,true);
assert.strictEqual(speedInfo.target,'帮忙速度M');
const upgradedSpeed = manager.upgradeRecord(speedOnly,speedRecord,0,25);
assert.strictEqual(upgradedSpeed.ok,true);
assert.strictEqual(upgradedSpeed.record.upgrades['0'],'帮忙速度M');
manager.applyRecord(speedOnly,upgradedSpeed.record,manager.normalizeBoxNames());
assert.strictEqual(manager.effectiveSubskills(speedOnly)[0],'帮忙速度M');

const speedConflict = {
  id:'2',name:'速度冲突',lv:'70',priority:'继续使用',main:'能量填充M Lv.3',
  subs:'帮忙速度S；帮手奖励；技能概率S；技能等级S；帮忙速度M'
};
const blocked = manager.upgradeInfo(speedConflict,{},0,70);
assert.strictEqual(blocked.allowed,false);
assert.strictEqual(blocked.conflictIndex,4,'未解锁的上位技能也应阻止生成重复技能');

const inventoryChain = {
  id:'3',name:'持有链',lv:'70',priority:'继续使用',main:'食材获取S Lv.3',
  subs:'持有上限S；持有上限M；帮手奖励；食材概率S；帮忙速度S'
};
assert.strictEqual(manager.upgradeInfo(inventoryChain,{},0,70).allowed,false);
const mToL = manager.upgradeRecord(inventoryChain,{},1,70);
assert.strictEqual(mToL.ok,true);
assert.strictEqual(mToL.record.upgrades['1'],'持有上限L');
const sToM = manager.upgradeRecord(inventoryChain,mToL.record,0,70);
assert.strictEqual(sToM.ok,true);
assert.deepStrictEqual(sToM.record.upgrades,{'0':'持有上限M','1':'持有上限L'});
manager.applyRecord(inventoryChain,sToM.record,manager.normalizeBoxNames());
assert.deepStrictEqual(manager.effectiveSubskills(inventoryChain).slice(0,2),['持有上限M','持有上限L']);
const blockedRevert = manager.downgradeInfo(inventoryChain,sToM.record,1);
assert.strictEqual(blockedRevert.allowed,false,'M被另一栏占用时不应生成重复M');
const revertS = manager.downgradeRecord(inventoryChain,sToM.record,0);
assert.strictEqual(revertS.ok,true);
const revertL = manager.downgradeRecord(inventoryChain,revertS.record,1);
assert.strictEqual(revertL.ok,true);
assert.deepStrictEqual(revertL.record.upgrades,{});

const skillLevelMon = {
  id:'4',name:'技能等级测试',lv:'25',priority:'继续使用',main:'能量填充M Lv.3',
  subs:'技能等级S；帮手奖励；技能概率S；帮忙速度S；持有上限S'
};
manager.applyRecord(skillLevelMon,{boxId:'skill',battleEligible:true,upgrades:{'0':'技能等级M'}},manager.normalizeBoxNames());
assert.strictEqual(manager.effectiveMainSkillLevel(skillLevelMon),4,'S升级M应在当前解锁后增加1级主技能');

const cappedHealer = Object.assign({},skillLevelMon,{id:'5',main:'活力全体疗愈S Lv.6'});
manager.applyRecord(cappedHealer,{boxId:'skill',battleEligible:true,upgrades:{'0':'技能等级M'}},manager.normalizeBoxNames());
assert.strictEqual(manager.mainSkillLevelCap(cappedHealer.main),6);
assert.strictEqual(manager.effectiveMainSkillLevel(cappedHealer),6,'实际等级不能超过该主技能的Lv.6上限');

const levelSevenSkill = Object.assign({},skillLevelMon,{id:'6',main:'能量填充M Lv.6'});
manager.applyRecord(levelSevenSkill,{boxId:'skill',battleEligible:true,upgrades:{'0':'技能等级M'}},manager.normalizeBoxNames());
assert.strictEqual(manager.mainSkillLevelCap(levelSevenSkill.main),7);
assert.strictEqual(manager.effectiveMainSkillLevel(levelSevenSkill),7,'Lv.7上限技能应允许实际S→M带来的一级提升');

const customState = manager.normalizeState({
  boxes:{main:{name:'一队主力'}},
  pokemon:{
    '7':{boxId:'shiny',battleEligible:false},
    '10':{boxId:'main',battleEligible:true}
  }
},[shinyCollection,shinyUsable]);
assert.strictEqual(customState.boxes.main.name,'一队主力');
manager.applyState([shinyCollection,shinyUsable],customState);
assert.strictEqual(shinyCollection.boxName,'闪光收藏');
assert.strictEqual(shinyCollection.battleEligible,false);
assert.strictEqual(shinyUsable.boxName,'一队主力');

const fakeStorage={
  value:null,
  getItem(){return this.value},
  setItem(_key,value){this.value=value}
};
fakeStorage.value=JSON.stringify(customState);
const loaded=manager.applyStored([shinyCollection,shinyUsable],fakeStorage);
assert.strictEqual(loaded.storageAvailable,true);
assert.strictEqual(loaded.state.pokemon['7'].battleEligible,false);

console.log('box-manager tests passed');
