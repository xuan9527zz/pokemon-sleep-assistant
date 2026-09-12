(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_MAIN_SKILL_TEAM_EFFECTS=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const freezeTable=table=>Object.freeze(Object.fromEntries(Object.entries(table).map(([key,value])=>[
    key,value&&typeof value==='object'?Object.freeze(value):value
  ])));
  const E4E=Object.freeze({mainSkillId:8,maxLevel:6,healingByLevel:freezeTable({1:5,2:7,3:9,4:11.4,5:15,6:18.1})});
  const ENERGIZING_CHEER=Object.freeze({mainSkillId:4,maxLevel:6,healingByLevel:freezeTable({1:12,2:15,3:20,4:25,5:33,6:44})});
  const CHARGE_ENERGY=Object.freeze({mainSkillId:7,maxLevel:6,healingByLevel:freezeTable({1:12,2:16.2,3:21.2,4:26.6,5:33.6,6:43.4})});
  const MOONLIGHT=Object.freeze({mainSkillId:18,maxLevel:6,selfHealingByLevel:CHARGE_ENERGY.healingByLevel,bonusHealingByLevel:freezeTable({1:6.3,2:7.7,3:10.1,4:13,5:17.2,6:22.8}),bonusProbability:.45});
  const NUZZLE=Object.freeze({mainSkillId:30,maxLevel:6,healingByLevel:freezeTable({1:9,2:12,3:16,4:20,5:27,6:35}),bonusDrawsByLevel:freezeTable({1:2,2:3,3:4,4:5,5:6,6:7})});
  const HEAL_PULSE=Object.freeze({mainSkillId:34,maxLevel:6,targetCount:2,healingByLevel:freezeTable({1:6,2:8,3:10,4:13,5:17,6:22}),helpsByLevel:freezeTable({1:1,2:2,3:2,4:3,5:4,6:4}),latiosBonusHelpsByLevel:freezeTable({1:1,2:1,3:2,4:2,5:2,6:3})});
  const HELPING_SUPPORT=Object.freeze({mainSkillId:9,maxLevel:7,helpsByLevel:freezeTable({1:6,2:7,3:8,4:9,5:10,6:11,7:12})});
  const HELPER_BOOST=Object.freeze({
    mainSkillId:15,maxLevel:6,
    helpsByLevelAndDistinctSpecies:freezeTable({
      1:{1:2,2:2,3:3,4:4,5:6},2:{1:3,2:3,3:4,4:5,5:7},3:{1:3,2:3,3:5,4:6,5:8},
      4:{1:4,2:4,3:6,4:7,5:9},5:{1:4,2:5,3:7,4:8,5:10},6:{1:5,2:6,3:8,4:9,5:11}
    })
  });
  const BERRY_BURST=Object.freeze({mainSkillId:21,maxLevel:6,selfBerryByLevel:freezeTable({1:11,2:14,3:21,4:24,5:27,6:30}),teammateBerryByLevel:freezeTable({1:1,2:2,3:2,4:3,5:4,6:5})});
  const DISGUISE_BERRY_BURST=Object.freeze({mainSkillId:17,maxLevel:6,selfBerryByLevel:freezeTable({1:8,2:10,3:15,4:17,5:19,6:21}),teammateBerryByLevel:BERRY_BURST.teammateBerryByLevel,largeSuccessProbability:.186,largeSuccessMultiplier:3});
  const METEOR_SHOWER=Object.freeze({
    mainSkillId:35,maxLevel:6,dragonBerryId:15,
    selfBerryByLevelAndDistinctSpecies:freezeTable({
      1:{1:12,2:14,3:18,4:18,5:20},2:{1:21,2:24,3:29,4:30,5:33},3:{1:29,2:29,3:35,4:37,5:41},
      4:{1:38,2:39,3:42,4:45,5:49},5:{1:43,2:44,3:48,4:49,5:53},6:{1:48,2:50,3:55,4:55,5:58}
    }),
    teammateBerryByLevelAndDistinctSpecies:freezeTable({
      1:{1:1,2:1,3:1,4:2,5:2},2:{1:1,2:1,3:1,4:2,5:2},3:{1:1,2:2,3:2,4:3,5:3},
      4:{1:1,2:2,3:3,4:4,5:4},5:{1:2,2:3,3:4,4:5,5:5},6:{1:3,2:4,3:4,4:5,5:5}
    }),
    latiasSelfBonusByLevel:freezeTable({1:2,2:4,3:6,4:8,5:9,6:10})
  });
  const CRESCENT_PRAYER=Object.freeze({mainSkillId:22,maxLevel:6,healingByLevel:freezeTable({1:3,2:4,3:5,4:7,5:9,6:11}),selfBerryRangeByLevel:freezeTable({1:[5,14],2:[9,19],3:[13,24],4:[17,29],5:[21,30],6:[25,32]}),teammateBerryRangeByLevel:freezeTable({1:[1,2],2:[1,3],3:[1,4],4:[1,5],5:[1,7],6:[1,9]})});
  const NIGHTMARE=Object.freeze({mainSkillId:23,maxLevel:7,nonDarkRecoveryPenalty:12,darkTypeId:16});
  const INGREDIENT_MAGNET=Object.freeze({mainSkillId:10,maxLevel:7,countByLevel:freezeTable({1:6,2:8,3:11,4:14,5:17,6:21,7:24})});
  const INGREDIENT_DRAW=Object.freeze({mainSkillId:28,maxLevel:7,countByLevel:freezeTable({1:5,2:6,3:8,4:11,5:13,6:16,7:18})});
  const PLUS=Object.freeze({mainSkillId:26,maxLevel:7,countByLevel:freezeTable({1:5,2:7,3:9,4:11,5:13,6:16,7:18}),plusleExtraByLevel:freezeTable({1:6,2:7,3:8,4:9,5:10,6:11,7:12}),otherExtraByLevel:freezeTable({1:6,2:7,3:9,4:10,5:12,6:13,7:14})});
  const MINUS=Object.freeze({mainSkillId:27,maxLevel:7,potByLevel:freezeTable({1:5,2:7,3:9,4:12,5:16,6:20,7:24}),healingByLevel:freezeTable({1:8,2:10,3:13,4:17,5:23,6:30,7:35})});
  const PRESENT=Object.freeze({mainSkillId:29,maxLevel:7,countByLevel:freezeTable({1:4,2:6,3:8,4:10,5:12,6:15,7:17}),candyPerUse:4/3});
  const DREAM_SHARD_RANDOM=Object.freeze({mainSkillId:6,maxLevel:8,rangeByLevel:freezeTable({1:[120,480],2:[170,680],3:[240,960],4:[335,1340],5:[460,1840],6:[630,2520],7:[900,3600],8:[1150,4600]})});
  const SUPER_LUCK=Object.freeze({mainSkillId:24,maxLevel:7,ingredientByLevel:INGREDIENT_DRAW.countByLevel,shardByLevel:freezeTable({1:[500,2500],2:[720,3600],3:[1030,5150],4:[1440,7200],5:[2000,10000],6:[2800,14000],7:[4000,20000]})});
  const HYPER_CUTTER=Object.freeze({mainSkillId:25,maxLevel:7,countByLevel:INGREDIENT_DRAW.countByLevel,largeSuccessMultiplier:3});
  const BERRY_JUICE=Object.freeze({dropPerUse:.185});
  const COOKING_POWER=Object.freeze({mainSkillId:11,maxLevel:7,slotsByLevel:freezeTable({1:7,2:10,3:12,4:17,5:22,6:27,7:31})});
  const TASTY_CHANCE=Object.freeze({mainSkillId:14,maxLevel:6,bonusByLevel:freezeTable({1:4,2:5,3:6,4:7,5:8,6:10})});
  const DREAM_SHARD=Object.freeze({mainSkillId:3,maxLevel:8,countByLevel:freezeTable({1:240,2:340,3:480,4:670,5:920,6:1260,7:1800,8:2500})});
  const ALL_MIGHTY_CANDY=Object.freeze({1:1,2:1,3:1,4:1,5:1,6:1.3,7:1.6,8:1.9});
  const SKILL_COPY=Object.freeze({mainSkillIds:Object.freeze([19,20]),maxLevel:6,fallbackMainSkillId:1});

  const KIND_BY_ID=Object.freeze({
    4:'energizing-cheer',7:'charge-energy',8:'e4e',9:'helping-support',15:'helper-boost',17:'disguise-berry-burst',
    3:'dream-shard',6:'dream-shard-random',10:'ingredient-magnet',11:'cooking-power',13:'metronome',14:'tasty-chance',18:'moonlight',19:'skill-copy',20:'skill-copy',21:'berry-burst',22:'crescent-prayer',23:'nightmare',24:'super-luck',25:'hyper-cutter',26:'plus',27:'minus',28:'ingredient-draw',29:'present',30:'nuzzle',31:'cooking-assist',32:'berry-juice',
    34:'heal-pulse',35:'meteor-shower',36:'aura-sphere'
  });
  const LABELS=Object.freeze({
    'energizing-cheer':'活力疗愈S','charge-energy':'活力填充S','e4e':'活力全体疗愈S','helping-support':'帮手支援S',
    'helper-boost':'帮手加速','disguise-berry-burst':'画皮（树果骤增）','moonlight':'月光','skill-copy':'技能复制',
    'berry-burst':'树果骤增','crescent-prayer':'新月祈祷','nuzzle':'蹭蹭脸颊','berry-juice':'树果汁','heal-pulse':'治愈波动',
    'meteor-shower':'流星群（树果骤增）','metronome':'挥指','nightmare':'噩梦','ingredient-magnet':'食材获取S','ingredient-draw':'食材精选S','super-luck':'超幸运（食材精选S）','hyper-cutter':'怪力钳（食材精选S）','plus':'正电（食材获取S）','minus':'负电（料理强化S）','present':'礼物（食材获取S）','cooking-power':'料理强化S','tasty-chance':'料理成功S','dream-shard':'梦之碎片获取S','dream-shard-random':'梦之碎片获取S（浮动）','aura-sphere':'波导弹（梦之碎片获取S）','cooking-assist':'料理辅助S'
  });
  const FAMILY_PATTERN=/活力全体疗愈|活力疗愈|活力填充|月光|蹭蹭脸颊|树果汁|治愈波动|帮手支援|帮手加速|树果骤增|流星群|新月祈祷|技能复制|变身|模仿|挥指|噩梦|食材获取|食材精选|超幸运|怪力钳|正电|负电|礼物|料理强化|料理成功|梦之碎片|波导弹|料理辅助/;
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  const sum=values=>values.reduce((total,value)=>total+(Number(value)||0),0);
  const levelAt=(table,level,maxLevel)=>Number(table[clamp(Math.round(level),1,maxLevel)])||0;
  const rangeAt=(table,level,maxLevel)=>{const value=table[clamp(Math.round(level),1,maxLevel)];return Array.isArray(value)?[Number(value[0])||0,Number(value[1])||0]:null};
  const averageRanges=(effects,field,scalarField,divisor)=>{
    const ranges=effects.map(row=>Array.isArray(row[field])?row[field]:[Number(row[scalarField])||0,Number(row[scalarField])||0]);
    const low=sum(ranges.map(value=>value[0]))/divisor,high=sum(ranges.map(value=>value[1]))/divisor;
    return low||high?[low,high]:null;
  };
  const speciesKey=row=>String(row&&row.mon&&(row.mon.finalFormId||row.mon.speciesId||row.mon.pokedexId||row.mon.name)||row&&row.name||'');

  function kindFor(main,mainSkillId){
    const id=Number(mainSkillId);if(KIND_BY_ID[id])return KIND_BY_ID[id];
    const label=String(main||'');
    if(/挥指/.test(label))return 'metronome';
    if(/变身|模仿|技能复制/.test(label))return 'skill-copy';
    if(/流星群/.test(label))return 'meteor-shower';
    if(/画皮/.test(label))return 'disguise-berry-burst';
    if(/树果骤增/.test(label))return 'berry-burst';
    if(/帮手加速/.test(label))return 'helper-boost';
    if(/帮手支援/.test(label))return 'helping-support';
    if(/新月祈祷/.test(label))return 'crescent-prayer';
    if(/噩梦/.test(label))return 'nightmare';
    if(/超幸运/.test(label))return 'super-luck';
    if(/怪力钳/.test(label))return 'hyper-cutter';
    if(/正电/.test(label))return 'plus';
    if(/负电/.test(label))return 'minus';
    if(/礼物/.test(label))return 'present';
    if(/食材精选/.test(label))return 'ingredient-draw';
    if(/食材获取/.test(label))return 'ingredient-magnet';
    if(/料理强化/.test(label))return 'cooking-power';
    if(/料理成功/.test(label))return 'tasty-chance';
    if(/波导弹/.test(label))return 'aura-sphere';
    if(/梦之碎片.*(?:浮动|随机)|(?:浮动|随机).*梦之碎片/.test(label))return 'dream-shard-random';
    if(/梦之碎片/.test(label))return 'dream-shard';
    if(/料理辅助/.test(label))return 'cooking-assist';
    if(/治愈波动/.test(label))return 'heal-pulse';
    if(/蹭蹭脸颊/.test(label))return 'nuzzle';
    if(/月光/.test(label))return 'moonlight';
    if(/树果汁/.test(label))return 'berry-juice';
    if(/活力全体疗愈/.test(label))return 'e4e';
    if(/活力疗愈/.test(label))return 'energizing-cheer';
    if(/活力填充/.test(label))return 'charge-energy';
    return '';
  }
  function isComplexMainSkill(main,mainSkillId){return Boolean(kindFor(main,mainSkillId)||FAMILY_PATTERN.test(String(main||'')))}
  function emptyEffect(kind,supported=true){return {kind,label:LABELS[kind]||'复杂主技能',supported,energyPerUse:0,teamRecoveryPerUse:0,productiveRecoveryPerUse:0,selfRecoveryPerUse:0,recoveryByIndex:null,extraHelpsPerUse:0,berryCountPerUse:0,ingredientsPerUse:0,ingredientRangePerUse:null,potSlotsPerUse:0,tastyBonusPctPerUse:0,dreamShardsPerUse:0,dreamShardRangePerUse:null,candyPerUse:0,berryJuicePerUse:0,detail:'',pendingComponents:[]}}
  function teamIncomplete(kind){return {...emptyEffect(kind,false),requiresFullTeam:true,detail:'需要完整五人队伍才能按实际队友计算'}}
  function berrySkillEffect(kind,userIndex,rows,selfCount,teammateCount){
    const user=rows[userIndex],teammates=rows.filter((_row,index)=>index!==userIndex),effect=emptyEffect(kind);
    effect.berryCountPerUse=selfCount+teammateCount*teammates.length;
    effect.energyPerUse=selfCount*user.berryEnergyPerBerry+teammateCount*sum(teammates.map(row=>row.berryEnergyPerBerry));
    effect.detail=`自身 ${selfCount} 个＋其他队友各 ${teammateCount} 个树果`;
    return effect;
  }
  function directCopiedEffect(target,level,options){
    const mechanics=options.energyMechanics;if(!mechanics||typeof mechanics.directEnergyPerUse!=='function')return null;
    const result=mechanics.directEnergyPerUse(target.mon.main,target.mon.mainSkillId,level,options.islandBonusPct);
    return result&&result.supported?{...emptyEffect('copied-direct'),supported:true,label:String(target.mon.main||'直接能量技能').replace(/\s*Lv\.\d+.*/,''),energyPerUse:Number(result.actualEnergy)||0,detail:'按复制者主技能等级重算'}:null;
  }
  function effectPerUse(userIndex,rows,kind,level,options={},stack=[]){
    const effect=emptyEffect(kind);if(rows.length!==5)return teamIncomplete(kind);
    const user=rows[userIndex],safeLevel=clamp(Math.round(level),1,8),averageHelp=sum(rows.map(row=>row.ordinaryBerryEnergyPerHelp))/rows.length;
    if(kind==='e4e'||kind==='berry-juice'){
      const healing=levelAt(E4E.healingByLevel,safeLevel,E4E.maxLevel);effect.teamRecoveryPerUse=healing*5;effect.productiveRecoveryPerUse=healing*4;effect.selfRecoveryPerUse=healing;effect.detail=`全队各回复 ${healing} 活力`;
      if(kind==='berry-juice'){effect.berryJuicePerUse=BERRY_JUICE.dropPerUse;effect.detail+=`；另获得树果汁期望 ${BERRY_JUICE.dropPerUse} 瓶`;effect.pendingComponents.push('树果汁瓶装回复的使用时机不折成卡比兽能量')}return effect;
    }
    if(kind==='energizing-cheer'){
      const healing=levelAt(ENERGIZING_CHEER.healingByLevel,safeLevel,ENERGIZING_CHEER.maxLevel);effect.teamRecoveryPerUse=healing;effect.productiveRecoveryPerUse=healing*.8;effect.selfRecoveryPerUse=healing*.2;effect.detail=`随机 1 名回复 ${healing} 活力（按五名等概率）`;return effect;
    }
    if(kind==='charge-energy'){
      const healing=levelAt(CHARGE_ENERGY.healingByLevel,safeLevel,CHARGE_ENERGY.maxLevel);effect.teamRecoveryPerUse=healing;effect.selfRecoveryPerUse=healing;effect.detail=`自身回复 ${healing} 活力`;return effect;
    }
    if(kind==='moonlight'){
      const self=levelAt(MOONLIGHT.selfHealingByLevel,safeLevel,MOONLIGHT.maxLevel),bonus=levelAt(MOONLIGHT.bonusHealingByLevel,safeLevel,MOONLIGHT.maxLevel)*MOONLIGHT.bonusProbability;effect.teamRecoveryPerUse=self+bonus;effect.productiveRecoveryPerUse=bonus*.8;effect.selfRecoveryPerUse=self+bonus*.2;effect.detail=`自身回复 ${self}；额外随机回复期望 ${bonus.toFixed(1)}`;return effect;
    }
    if(kind==='nuzzle'){
      const healing=levelAt(NUZZLE.healingByLevel,safeLevel,NUZZLE.maxLevel),draws=levelAt(NUZZLE.bonusDrawsByLevel,safeLevel,NUZZLE.maxLevel),targets=rows.filter((_row,index)=>index!==userIndex),outcomes=targets.map(target=>{const targetIndex=rows.indexOf(target),kindForTarget=kindFor(target.mon.main,target.mon.mainSkillId),probability=Number(target.skillProbability&&target.skillProbability.effective)||Number(target.skillProbability)||0;if(!kindForTarget||kindForTarget==='nuzzle'||kindForTarget==='metronome')return null;const direct=directCopiedEffect(target,target.skillLevel,options),resolved=direct||effectPerUse(targetIndex,rows,kindForTarget,target.skillLevel,options,[...stack,'nuzzle']);return resolved&&resolved.supported?{resolved,probability}:null}).filter(Boolean),scale=draws/Math.max(1,targets.length),weighted=field=>scale*sum(outcomes.map(item=>(Number(item.resolved[field])||0)*item.probability)),weightedRange=(rangeField,scalarField)=>{const low=scale*sum(outcomes.map(item=>(Array.isArray(item.resolved[rangeField])?Number(item.resolved[rangeField][0])||0:Number(item.resolved[scalarField])||0)*item.probability)),high=scale*sum(outcomes.map(item=>(Array.isArray(item.resolved[rangeField])?Number(item.resolved[rangeField][1])||0:Number(item.resolved[scalarField])||0)*item.probability));return low||high?[low,high]:null};effect.teamRecoveryPerUse=healing+weighted('teamRecoveryPerUse');effect.productiveRecoveryPerUse=healing*.8+weighted('productiveRecoveryPerUse');effect.selfRecoveryPerUse=healing*.2+weighted('selfRecoveryPerUse');effect.energyPerUse=weighted('energyPerUse');effect.extraHelpsPerUse=weighted('extraHelpsPerUse');effect.ingredientsPerUse=weighted('ingredientsPerUse');effect.ingredientRangePerUse=weightedRange('ingredientRangePerUse','ingredientsPerUse');effect.potSlotsPerUse=weighted('potSlotsPerUse');effect.tastyBonusPctPerUse=weighted('tastyBonusPctPerUse');effect.dreamShardsPerUse=weighted('dreamShardsPerUse');effect.dreamShardRangePerUse=weightedRange('dreamShardRangePerUse','dreamShardsPerUse');effect.candyPerUse=weighted('candyPerUse');effect.berryJuicePerUse=weighted('berryJuicePerUse');effect.pendingComponents=[...new Set(outcomes.flatMap(item=>item.resolved.pendingComponents||[]))];effect.detail=`随机 1 名回复 ${healing} 活力；${draws} 次额外技能抽选按实际四名队友技能率求期望（不递归抽蹭蹭脸颊／挥指）`;return effect;
    }
    if(kind==='heal-pulse'){
      const healing=levelAt(HEAL_PULSE.healingByLevel,safeLevel,HEAL_PULSE.maxLevel),latios=rows.some(row=>row.mon&&row.mon.name==='拉帝欧斯'),helps=levelAt(HEAL_PULSE.helpsByLevel,safeLevel,HEAL_PULSE.maxLevel)+(latios?levelAt(HEAL_PULSE.latiosBonusHelpsByLevel,safeLevel,HEAL_PULSE.maxLevel):0);effect.teamRecoveryPerUse=healing*HEAL_PULSE.targetCount;effect.productiveRecoveryPerUse=effect.teamRecoveryPerUse*.8;effect.selfRecoveryPerUse=effect.teamRecoveryPerUse*.2;effect.extraHelpsPerUse=helps*HEAL_PULSE.targetCount;effect.energyPerUse=effect.extraHelpsPerUse*averageHelp;effect.detail=`随机 2 名各回复 ${healing}，并各立即帮忙 ${helps} 次${latios?'（含拉帝欧斯加成）':''}`;return effect;
    }
    if(kind==='helping-support'){
      const helps=levelAt(HELPING_SUPPORT.helpsByLevel,safeLevel,HELPING_SUPPORT.maxLevel);effect.extraHelpsPerUse=helps;effect.energyPerUse=helps*averageHelp;effect.detail=`随机队员立即帮忙 ${helps} 次；额外帮忙不再触发主技能`;return effect;
    }
    if(kind==='helper-boost'){
      const berryId=Number(user.mon&&user.mon.berryId),sameType=rows.filter(row=>Number(row.mon&&row.mon.berryId)===berryId),distinct=clamp(new Set(sameType.map(speciesKey)).size,1,5),helps=Number(HELPER_BOOST.helpsByLevelAndDistinctSpecies[clamp(safeLevel,1,HELPER_BOOST.maxLevel)][distinct])||0;effect.extraHelpsPerUse=helps*rows.length;effect.energyPerUse=helps*sum(rows.map(row=>row.ordinaryBerryEnergyPerHelp));effect.detail=`同属性共 ${distinct} 种宝可梦，全队各立即帮忙 ${helps} 次`;return effect;
    }
    if(kind==='berry-burst')return berrySkillEffect(kind,userIndex,rows,levelAt(BERRY_BURST.selfBerryByLevel,safeLevel,BERRY_BURST.maxLevel),levelAt(BERRY_BURST.teammateBerryByLevel,safeLevel,BERRY_BURST.maxLevel));
    if(kind==='disguise-berry-burst'){
      const ordinary=berrySkillEffect(kind,userIndex,rows,levelAt(DISGUISE_BERRY_BURST.selfBerryByLevel,safeLevel,DISGUISE_BERRY_BURST.maxLevel),levelAt(DISGUISE_BERRY_BURST.teammateBerryByLevel,safeLevel,DISGUISE_BERRY_BURST.maxLevel)),triggers=Math.max(0,Number(user.triggers)||0),days=Math.max(1/24,(Number(options.durationHours)||24)/24),largeSuccesses=days*(1-(1-DISGUISE_BERRY_BURST.largeSuccessProbability)**(triggers/days));ordinary.energyPerUse=triggers>0?ordinary.energyPerUse*(1+(DISGUISE_BERRY_BURST.largeSuccessMultiplier-1)*largeSuccesses/triggers):ordinary.energyPerUse;ordinary.detail+=`；大成功率 ${DISGUISE_BERRY_BURST.largeSuccessProbability*100}%、每天最多按 1 次大成功期望`;return ordinary;
    }
    if(kind==='meteor-shower'){
      const dragons=rows.filter(row=>Number(row.mon&&row.mon.berryId)===METEOR_SHOWER.dragonBerryId),distinct=clamp(new Set(dragons.map(speciesKey)).size,1,5),rowLevel=clamp(safeLevel,1,METEOR_SHOWER.maxLevel),selfCount=Number(METEOR_SHOWER.selfBerryByLevelAndDistinctSpecies[rowLevel][distinct])||0,teammateCount=Number(METEOR_SHOWER.teammateBerryByLevelAndDistinctSpecies[rowLevel][distinct])||0,latias=rows.some(row=>row.mon&&row.mon.name==='拉帝亚斯'),result=berrySkillEffect(kind,userIndex,rows,selfCount+(latias?levelAt(METEOR_SHOWER.latiasSelfBonusByLevel,rowLevel,METEOR_SHOWER.maxLevel):0),teammateCount);result.detail=`队内龙属性共 ${distinct} 种；${result.detail}${latias?'（含拉帝亚斯加成）':''}`;return result;
    }
    if(kind==='crescent-prayer'){
      const rowLevel=clamp(safeLevel,1,CRESCENT_PRAYER.maxLevel),selfRange=CRESCENT_PRAYER.selfBerryRangeByLevel[rowLevel],mateRange=CRESCENT_PRAYER.teammateBerryRangeByLevel[rowLevel],self=(selfRange[0]+selfRange[1])/2,teammate=(mateRange[0]+mateRange[1])/2,healing=levelAt(CRESCENT_PRAYER.healingByLevel,rowLevel,CRESCENT_PRAYER.maxLevel),result=berrySkillEffect(kind,userIndex,rows,self,teammate);result.teamRecoveryPerUse=healing*5;result.productiveRecoveryPerUse=healing*4;result.selfRecoveryPerUse=healing;result.detail=`自身 ${selfRange[0]}~${selfRange[1]}、其他队友各 ${mateRange[0]}~${mateRange[1]} 个树果（能量取区间中点期望），全队各回复 ${healing}`;return result;
    }
    if(kind==='nightmare'){
      const recoveryByIndex=rows.map(row=>Number(row.mon&&row.mon.typeId)===NIGHTMARE.darkTypeId?0:-NIGHTMARE.nonDarkRecoveryPenalty),nonDark=recoveryByIndex.filter(value=>value<0).length;effect.recoveryByIndex=recoveryByIndex;effect.teamRecoveryPerUse=sum(recoveryByIndex);effect.productiveRecoveryPerUse=effect.teamRecoveryPerUse;effect.detail=`纯能量由噩梦本体计入；${nonDark} 名非恶属性队友各损失 ${NIGHTMARE.nonDarkRecoveryPenalty} 活力`;return effect;
    }
    if(kind==='ingredient-magnet'){effect.ingredientsPerUse=levelAt(INGREDIENT_MAGNET.countByLevel,safeLevel,INGREDIENT_MAGNET.maxLevel);effect.detail=`随机食材 ${effect.ingredientsPerUse} 个／次`;return effect}
    if(kind==='ingredient-draw'){effect.ingredientsPerUse=levelAt(INGREDIENT_DRAW.countByLevel,safeLevel,INGREDIENT_DRAW.maxLevel);effect.detail=`指定食材 ${effect.ingredientsPerUse} 个／次`;return effect}
    if(kind==='super-luck'){
      const ingredients=levelAt(SUPER_LUCK.ingredientByLevel,safeLevel,SUPER_LUCK.maxLevel),shards=rangeAt(SUPER_LUCK.shardByLevel,safeLevel,SUPER_LUCK.maxLevel);effect.ingredientRangePerUse=[0,ingredients];effect.dreamShardRangePerUse=[0,shards[1]];effect.detail=`每次在指定食材 ${ingredients} 个或梦之碎片 ${shards[0]}~${shards[1]} 中择一，不会同时获得`;effect.pendingComponents.push('两种结果的分支概率尚无可靠公开值，因此只显示单次上下界');return effect;
    }
    if(kind==='hyper-cutter'){
      const ingredients=levelAt(HYPER_CUTTER.countByLevel,safeLevel,HYPER_CUTTER.maxLevel);effect.ingredientsPerUse=ingredients;effect.ingredientRangePerUse=[ingredients,ingredients*HYPER_CUTTER.largeSuccessMultiplier];effect.detail=`指定食材 ${ingredients}~${ingredients*HYPER_CUTTER.largeSuccessMultiplier} 个／次（大成功为基础量的 ${HYPER_CUTTER.largeSuccessMultiplier} 倍）`;effect.pendingComponents.push('大成功概率尚无可靠公开值，因此不伪造均值');return effect;
    }
    if(kind==='plus'){
      const base=levelAt(PLUS.countByLevel,safeLevel,PLUS.maxLevel),paired=rows.some((row,index)=>index!==userIndex&&/正电|负电/.test(String(row.mon&&row.mon.main||''))),isPlusle=/正电拍拍/.test(String(user.mon&&user.mon.name||'')),extra=paired?levelAt(isPlusle?PLUS.plusleExtraByLevel:PLUS.otherExtraByLevel,safeLevel,PLUS.maxLevel):0;effect.ingredientsPerUse=base+extra;effect.detail=`指定首格食材 ${base}${paired?`＋正／负电搭档加成 ${extra}`:'（队内没有正／负电搭档，未触发追加量）'} 个／次`;return effect;
    }
    if(kind==='minus'){
      const pot=levelAt(MINUS.potByLevel,safeLevel,MINUS.maxLevel),paired=rows.some((row,index)=>index!==userIndex&&/正电|负电/.test(String(row.mon&&row.mon.main||''))),healing=paired?levelAt(MINUS.healingByLevel,safeLevel,MINUS.maxLevel):0;effect.potSlotsPerUse=pot;effect.teamRecoveryPerUse=healing;effect.productiveRecoveryPerUse=healing*.8;effect.selfRecoveryPerUse=healing*.2;effect.detail=`下次锅容量 +${pot} 格${paired?`，并随机 1 名回复 ${healing} 活力`:'；队内没有正／负电搭档，未触发随机回复'}`;return effect;
    }
    if(kind==='present'){effect.ingredientsPerUse=levelAt(PRESENT.countByLevel,safeLevel,PRESENT.maxLevel);effect.candyPerUse=PRESENT.candyPerUse;effect.detail=`指定食材 ${effect.ingredientsPerUse} 个，并以 1/3 概率额外获得 4 个队友糖果（期望 ${effect.candyPerUse.toFixed(2)}）`;return effect}
    if(kind==='cooking-power'){effect.potSlotsPerUse=levelAt(COOKING_POWER.slotsByLevel,safeLevel,COOKING_POWER.maxLevel);effect.detail=`下次料理锅容量 +${effect.potSlotsPerUse} 格／次（累计上限另行处理）`;return effect}
    if(kind==='tasty-chance'){effect.tastyBonusPctPerUse=levelAt(TASTY_CHANCE.bonusByLevel,safeLevel,TASTY_CHANCE.maxLevel);effect.detail=`下次料理大成功率 +${effect.tastyBonusPctPerUse}%／次`;return effect}
    if(kind==='dream-shard'||kind==='aura-sphere'){effect.dreamShardsPerUse=levelAt(DREAM_SHARD.countByLevel,safeLevel,DREAM_SHARD.maxLevel);effect.detail=`梦之碎片 ${effect.dreamShardsPerUse}／次${kind==='aura-sphere'?'；波导弹的卡比兽能量另由直接能量表计入':''}`;return effect}
    if(kind==='dream-shard-random'){effect.dreamShardRangePerUse=rangeAt(DREAM_SHARD_RANDOM.rangeByLevel,safeLevel,DREAM_SHARD_RANDOM.maxLevel);effect.detail=`梦之碎片 ${effect.dreamShardRangePerUse[0]}~${effect.dreamShardRangePerUse[1]}／次`;return effect}
    if(kind==='cooking-assist'){effect.ingredientsPerUse=levelAt(INGREDIENT_MAGNET.countByLevel,safeLevel,INGREDIENT_MAGNET.maxLevel);effect.tastyBonusPctPerUse=levelAt(Object.freeze({1:1,2:2,3:2,4:3,5:3,6:4,7:5}),safeLevel,7);effect.detail=`随机食材 ${effect.ingredientsPerUse} 个，并使下次料理大成功率 +${effect.tastyBonusPctPerUse}%`;return effect}
    if(kind==='skill-copy'){
      if(stack.includes('skill-copy'))return {...emptyEffect(kind,false),detail:'技能复制不会递归复制自身'};
      const targets=rows.filter((_row,index)=>index!==userIndex),effects=targets.map(target=>{
        const targetKind=kindFor(target.mon.main,target.mon.mainSkillId);
        if(targetKind==='skill-copy'){
          const fallback=options.energyMechanics&&options.energyMechanics.directEnergyPerUse('',SKILL_COPY.fallbackMainSkillId,Math.min(safeLevel,7),options.islandBonusPct);
          return {...emptyEffect('copy-fallback'),label:'能量填充S（复制回退）',energyPerUse:Number(fallback&&fallback.actualEnergy)||0,detail:'抽到另一只技能复制时按回退技能计算'};
        }
        const direct=directCopiedEffect(target,safeLevel,options);if(direct)return direct;
        if(targetKind&&targetKind!=='metronome')return effectPerUse(userIndex,rows,targetKind,safeLevel,options,[...stack,'skill-copy']);
        return {...emptyEffect(targetKind||'copy-resource'),label:String(target.mon.main||'资源技能').replace(/\s*Lv\.\d+.*/,''),detail:targetKind==='metronome'?'挥指结果池仍保留为待核对':'该目标不产生纯能量或队伍活力'};
      }),selectable=effects.length||1;effect.energyPerUse=sum(effects.map(row=>row.energyPerUse))/selectable;effect.teamRecoveryPerUse=sum(effects.map(row=>row.teamRecoveryPerUse))/selectable;effect.productiveRecoveryPerUse=sum(effects.map(row=>row.productiveRecoveryPerUse))/selectable;effect.selfRecoveryPerUse=sum(effects.map(row=>row.selfRecoveryPerUse))/selectable;effect.extraHelpsPerUse=sum(effects.map(row=>row.extraHelpsPerUse))/selectable;effect.berryCountPerUse=sum(effects.map(row=>row.berryCountPerUse))/selectable;effect.ingredientsPerUse=sum(effects.map(row=>row.ingredientsPerUse))/selectable;effect.ingredientRangePerUse=averageRanges(effects,'ingredientRangePerUse','ingredientsPerUse',selectable);effect.potSlotsPerUse=sum(effects.map(row=>row.potSlotsPerUse))/selectable;effect.tastyBonusPctPerUse=sum(effects.map(row=>row.tastyBonusPctPerUse))/selectable;effect.dreamShardsPerUse=sum(effects.map(row=>row.dreamShardsPerUse))/selectable;effect.dreamShardRangePerUse=averageRanges(effects,'dreamShardRangePerUse','dreamShardsPerUse',selectable);effect.candyPerUse=sum(effects.map(row=>row.candyPerUse))/selectable;effect.berryJuicePerUse=sum(effects.map(row=>row.berryJuicePerUse))/selectable;effect.detail=`按另外四名实际队友等概率抽选，并统一使用复制者 Lv.${safeLevel} 重算：${effects.map(row=>row.label).join('、')}`;effect.pendingComponents=[...new Set(effects.flatMap(row=>row.pendingComponents||[]))];return effect;
    }
    return {...emptyEffect(kind,false),detail:kind==='metronome'?'挥指会从动态技能池抽选，当前不写入伪精确值':'尚未建立该技能的队伍效果模型'};
  }
  function evaluateMember(userIndex,rows,options={}){
    const user=rows[userIndex],allMighty=/十项全能/.test(String(user&&user.mon&&user.mon.main||'')),kind=kindFor(user&&user.mon&&user.mon.main,user&&user.mon&&user.mon.mainSkillId);
    if(!kind&&!allMighty)return null;let effect=kind?effectPerUse(userIndex,rows,kind,user.skillLevel,options):emptyEffect('all-mighty-candy');if(allMighty){if(effect&&!effect.supported&&kind==='metronome')effect={...effect,supported:true};effect.candyPerUse=Number(ALL_MIGHTY_CANDY[Math.min(8,Math.max(1,user.skillLevel))])||1;effect.detail=[effect.detail,`另获得队友糖果期望 ${effect.candyPerUse} 个／次`].filter(Boolean).join('；')}return effect;
  }

  return Object.freeze({
    E4E,ENERGIZING_CHEER,CHARGE_ENERGY,MOONLIGHT,NUZZLE,HEAL_PULSE,HELPING_SUPPORT,HELPER_BOOST,BERRY_BURST,
    DISGUISE_BERRY_BURST,METEOR_SHOWER,CRESCENT_PRAYER,NIGHTMARE,INGREDIENT_MAGNET,INGREDIENT_DRAW,PLUS,MINUS,PRESENT,DREAM_SHARD_RANDOM,SUPER_LUCK,HYPER_CUTTER,BERRY_JUICE,COOKING_POWER,TASTY_CHANCE,DREAM_SHARD,ALL_MIGHTY_CANDY,SKILL_COPY,KIND_BY_ID,LABELS,FAMILY_PATTERN,
    kindFor,isComplexMainSkill,effectPerUse,evaluateMember
  });
});
