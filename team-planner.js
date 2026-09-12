(function(root,factory){
  'use strict';
  const ingredients=typeof module==='object'&&module.exports?require('./ingredients.js'):root.POKEMON_SLEEP_INGREDIENTS;
  const boxManager=typeof module==='object'&&module.exports?require('./box-manager.js'):root.POKEMON_SLEEP_BOX_MANAGER;
  const energyMechanics=typeof module==='object'&&module.exports?require('./snorlax-energy.js'):root.POKEMON_SLEEP_SNORLAX_ENERGY;
  const personalSettings=typeof module==='object'&&module.exports?require('./personal-settings.js'):root.POKEMON_SLEEP_PERSONAL_SETTINGS;
  const teamSkillEffects=typeof module==='object'&&module.exports?require('./main-skill-team-effects.js'):root.POKEMON_SLEEP_MAIN_SKILL_TEAM_EFFECTS;
  const gameRules=typeof module==='object'&&module.exports?require('./game-rules.js'):root.POKEMON_SLEEP_GAME_RULES;
  const investmentPlanner=typeof module==='object'&&module.exports?require('./investment-planner.js'):root.POKEMON_SLEEP_INVESTMENT_PLANNER;
  const cookingSuccess=typeof module==='object'&&module.exports?require('./cooking-success.js'):root.POKEMON_SLEEP_COOKING_SUCCESS;
  const productionTimeline=typeof module==='object'&&module.exports?require('./production-timeline.js'):root.POKEMON_SLEEP_PRODUCTION_TIMELINE;
  const api=factory(ingredients,boxManager,energyMechanics,personalSettings,teamSkillEffects,gameRules,investmentPlanner,cookingSuccess,productionTimeline);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.POKEMON_SLEEP_TEAM_PLANNER=api;
})(typeof window!=='undefined'?window:globalThis,function(ingredientCatalog,boxManager,energyMechanics,personalSettings,teamSkillEffects,gameRules,investmentPlanner,cookingSuccess,productionTimeline){
  'use strict';

  const SUBSKILL_LEVELS=[10,25,50,70,80];
  const MAX_SAVED_TEAMS=10;
  const SPECIAL_NAMES=new Set(['梦幻','雷公','炎帝','水君','拉帝亚斯','拉帝欧斯','克雷色利亚','达克莱伊']);
  const ROLE_LABELS={berry:'树果手',ingredient:'食材手',skill:'技能手',all:'全能手',unknown:'待核对'};
  const ENERGY_PROFILES={
    timeline:{factor:2,label:'五档活力时间轴（推荐）'},
    steady:{factor:1/0.45,label:'回复稳定（活力81以上）'},
    average:{factor:2,label:'日间平均（评分统一口径）'},
    low:{factor:1/0.66,label:'低活力（活力2–40）'},
    empty:{factor:1,label:'无活力加速（活力0–1）'}
  };
  const ISLAND_PROFILES=Object.freeze({
    none:Object.freeze({label:'未选择／随机岛屿',berries:Object.freeze([])}),
    cyan:Object.freeze({label:'天青沙滩',berries:Object.freeze(['橙橙果','椰木果','桃桃果'])}),
    taupe:Object.freeze({label:'灰褐洞窟',berries:Object.freeze(['苹野果','勿花果','文柚果'])}),
    snowdrop:Object.freeze({label:'白花雪原',berries:Object.freeze(['柿仔果','莓莓果','异奇果'])}),
    lapis:Object.freeze({label:'宝蓝湖畔',berries:Object.freeze(['金枕果','芒芒果','樱子果'])}),
    gold:Object.freeze({label:'黄金发电厂',berries:Object.freeze(['萄葡果','墨莓果','靛莓果'])}),
    amber:Object.freeze({label:'琥珀溪谷',berries:Object.freeze(['零余果','木子果','番荔果'])}),
    'greengrass-expert':Object.freeze({label:'萌绿之岛 EX',expert:true,berries:Object.freeze([]),mainSpeedMultiplier:.9,unmatchedSpeedMultiplier:1.15,mainSkillLevelBonus:1}),
    'cyan-expert':Object.freeze({label:'天青沙滩 EX',expert:true,berries:Object.freeze([]),mainSpeedMultiplier:.8,unmatchedSpeedMultiplier:1.35,mainCarryBonus:5}),
    all:Object.freeze({label:'自定义：当前队员全部命中',all:true,berries:Object.freeze([])})
  });
  const EX_WEEKLY_EFFECTS=Object.freeze({none:'本周效果未选择',berry:'树果能量强化',ingredient:'食材帮忙＋1',skill:'主技能触发率×1.25'});
  const BERRY_NAMES=Object.freeze(['柿仔果','苹野果','橙橙果','萄葡果','金枕果','莓莓果','樱子果','零余果','勿花果','椰木果','芒芒果','木子果','文柚果','墨莓果','番荔果','异奇果','靛莓果','桃桃果']);
  const DEFAULT_ENERGY_SETTINGS=Object.freeze({durationHours:24,islandBonusPct:0,islandProfile:'none',startEnergy:100,sleepScore:100,skillCollectionHours:4,teamSwapCount:0,collectBeforeSwap:true,exWeeklyEffect:'none'});
  const POT_SKILL_SLOTS=Object.freeze({11:Object.freeze([7,10,12,17,22,27,31]),27:Object.freeze([5,7,9,12,16,20,24])});

  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const sum=values=>values.reduce((total,value)=>total+value,0);
  const sumResourceRange=(rows,rangeKey,scalarKey)=>{
    let hasValue=false,low=0,high=0;
    rows.forEach(row=>{const range=Array.isArray(row[rangeKey])?row[rangeKey]:null,scalar=Number(row[scalarKey])||0;if(range){hasValue=true;low+=Number(range[0])||0;high+=Number(range[1])||0}else{if(scalar)hasValue=true;low+=scalar;high+=scalar}});
    return hasValue?[low,high]:null;
  };

  function parseInterval(value){
    const parts=String(value||'').trim().split(':').map(Number);
    if(parts.some(part=>!Number.isFinite(part)))return NaN;
    if(parts.length===2)return parts[0]*60+parts[1];
    if(parts.length===3)return parts[0]*3600+parts[1]*60+parts[2];
    return NaN;
  }

  function parseIngredientSlots(value,level){
    const unlocks=[1,30,60];
    const slots=String(value||'').split('／').map((raw,index)=>{
      const match=raw.trim().match(/^(.+?)×(\d+)$/);
      const sourceName=match?match[1].trim():raw.trim();
      const name=ingredientCatalog&&typeof ingredientCatalog.canonicalize==='function'
        ?ingredientCatalog.canonicalize(sourceName)||sourceName
        :sourceName;
      return {unlockLevel:unlocks[index]||60,name,quantity:match?Number(match[2]):0};
    }).filter(slot=>slot.name&&slot.name!=='—'&&slot.quantity>0);
    return {
      all:slots,
      unlocked:slots.filter(slot=>slot.unlockLevel<=Number(level)),
      locked:slots.filter(slot=>slot.unlockLevel>Number(level))
    };
  }

  function unlockedSubskills(mon){
    return String(mon.effectiveSubs||mon.subs||'').split('；').filter((skill,index)=>skill&&skill!=='—'&&(SUBSKILL_LEVELS[index]||80)<=Number(mon.lv));
  }

  function natureIngredientMultiplier(nature){
    if(String(nature).includes('食材↑'))return 1.2;
    if(String(nature).includes('食材↓'))return .8;
    return 1;
  }

  function natureSkillMultiplier(nature){
    if(String(nature).includes('技能↑'))return 1.2;
    if(String(nature).includes('技能↓'))return .8;
    return 1;
  }

  function skillProbability(mon){
    const base=Number(mon&&mon.skillRatePct)/100;
    if(!(base>0&&base<1))return {base:0,current:0,effective:0,provisional:true,pityCeiling:null};
    const skills=unlockedSubskills(mon);
    const subskillBonus=(skills.includes('技能概率M')?.36:0)+(skills.includes('技能概率S')?.18:0);
    const natureMultiplier=natureSkillMultiplier(mon.nature);
    const current=clamp(base*natureMultiplier*(1+subskillBonus),0,.95);
    const sourceInterval=Number(mon.catalogHelpFrequencyBaseSec)||parseInterval(mon.interval);
    const pityCeiling=['skill','all'].includes(mon.specialty)?Math.max(1,Math.floor(144000/sourceInterval)):78;
    const effective=current/(1-(1-current)**pityCeiling);
    return {base,current,effective,natureMultiplier,subskillBonus,pityCeiling,provisional:false};
  }

  function applySkillTriggerMultiplier(probability,multiplier){
    const factor=clamp(Number(multiplier)||1,.01,10);
    if(factor===1)return probability;
    const current=clamp(probability.current*factor,0,.95),pityCeiling=probability.pityCeiling;
    const effective=pityCeiling?current/(1-(1-current)**pityCeiling):current;
    return {...probability,current,effective,eventMultiplier:factor};
  }

  function memberModifier(options,mon){
    const raw=typeof options.memberModifier==='function'?options.memberModifier(mon)||{}:options.memberModifier||{};
    return {
      ingredientHelpBonus:clamp(Number(raw.ingredientHelpBonus)||0,0,99),
      skillTriggerMultiplier:clamp(Number(raw.skillTriggerMultiplier)||1,.01,10),
      mainSkillLevelBonus:clamp(Number(raw.mainSkillLevelBonus)||0,0,20),
      label:String(raw.label||'')
    };
  }

  function exMemberRule(settings,mon){
    const profile=ISLAND_PROFILES[settings.islandProfile]||ISLAND_PROFILES.none;
    if(!profile.expert)return {match:'normal',favorite:null,intervalMultiplier:1,carryBonus:0,mainSkillLevelBonus:0,ingredientHelpBonus:0,skillTriggerMultiplier:1,berryFavoriteMultiplier:2,label:''};
    const index=settings.favoriteBerries.indexOf(String(mon&&mon.berry||'')),match=index===0?'main':index>0?'sub':'unmatched',favorite=index>=0,weekly=favorite?settings.exWeeklyEffect:'none';
    return {
      match,favorite,
      intervalMultiplier:match==='main'?(profile.mainSpeedMultiplier||1):match==='unmatched'?(profile.unmatchedSpeedMultiplier||1):1,
      carryBonus:match==='main'?(profile.mainCarryBonus||0):0,
      mainSkillLevelBonus:match==='main'?(profile.mainSkillLevelBonus||0):0,
      ingredientHelpBonus:weekly==='ingredient'?(mon&&mon.specialty==='ingredient'?1.5:1):0,
      skillTriggerMultiplier:weekly==='skill'?1.25:1,
      berryFavoriteMultiplier:weekly==='berry'?2.4:2,
      label:`EX ${match==='main'?'主树果':match==='sub'?'副树果':'未命中'}${weekly!=='none'?`／${EX_WEEKLY_EFFECTS[weekly]}`:''}`
    };
  }

  function normalizeEnergySettings(options={}){
    const favoriteBerries=[...new Set((Array.isArray(options.favoriteBerries)?options.favoriteBerries:[]).map(String).filter(Boolean))];
    return {
      durationHours:clamp(Number(options.durationHours)||DEFAULT_ENERGY_SETTINGS.durationHours,.5,168),
      islandBonusPct:clamp(Number(options.islandBonusPct)||0,0,gameRules&&gameRules.LIMITS?gameRules.LIMITS.areaBonusPct:85),
      islandProfile:Object.hasOwn(ISLAND_PROFILES,options.islandProfile)?options.islandProfile:DEFAULT_ENERGY_SETTINGS.islandProfile,
      favoriteBerries,
      startEnergy:clamp(options.startEnergy===undefined?DEFAULT_ENERGY_SETTINGS.startEnergy:Number(options.startEnergy),0,150),
      sleepScore:clamp(options.sleepScore===undefined?DEFAULT_ENERGY_SETTINGS.sleepScore:Number(options.sleepScore),0,100),
      skillCollectionHours:clamp(Number(options.skillCollectionHours)||DEFAULT_ENERGY_SETTINGS.skillCollectionHours,.5,24),
      teamSwapCount:clamp(Math.round(Number(options.teamSwapCount)||0),0,20),
      collectBeforeSwap:options.collectBeforeSwap!==false,
      exWeeklyEffect:Object.hasOwn(EX_WEEKLY_EFFECTS,options.exWeeklyEffect)?options.exWeeklyEffect:'none'
    };
  }

  function calculateEnergyBreakdown(members,options={}){
    const settings=normalizeEnergySettings(options),profile=ISLAND_PROFILES[settings.islandProfile],durationSeconds=settings.durationHours*3600,useTimeline=options.energyProfile==='timeline'&&productionTimeline&&typeof productionTimeline.simulate==='function';
    const rows=(members||[]).map(member=>{
      const mon=member.mon||{},helps=useTimeline?0:durationSeconds/member.effectiveIntervalSec,exRule=member.exRule||exMemberRule(settings,mon),favorite=profile.expert?Boolean(exRule.favorite):Boolean(profile.all||(mon.berry&&(settings.favoriteBerries.length?settings.favoriteBerries.includes(mon.berry):profile.berries.includes(mon.berry))));
      let normalHelps=helps,sneakyHelps=0;
      if(!useTimeline){
        const helpsPerCollection=Number(member.helpsAvailable),collectiblePerCollection=Number(member.collectibleHelps);
        if(helpsPerCollection>0&&Number.isFinite(collectiblePerCollection)){
          const collectible=clamp(collectiblePerCollection,0,helpsPerCollection),completeCollections=Math.floor(helps/helpsPerCollection),remainingHelps=Math.max(0,helps-completeCollections*helpsPerCollection);
          normalHelps=Math.min(helps,completeCollections*collectible+Math.min(remainingHelps,collectible));
        }
        sneakyHelps=Math.max(0,helps-normalHelps);
      }
      const berryStrength=energyMechanics&&energyMechanics.berryStrengthAtLevel(mon.berryId,Number(mon.lv));
      const modifier=member.eventModifier||memberModifier(options,mon),probability=applySkillTriggerMultiplier(skillProbability(mon),modifier.skillTriggerMultiplier),baseSkillLevel=boxManager&&typeof boxManager.effectiveMainSkillLevel==='function'?boxManager.effectiveMainSkillLevel(mon):Number(String(mon.main||'').match(/Lv\.(\d+)/)?.[1]||1),skillCap=boxManager&&typeof boxManager.mainSkillLevelCap==='function'?boxManager.mainSkillLevelCap(mon.main):Math.max(6,baseSkillLevel),skillLevel=Math.min(skillCap,baseSkillLevel+modifier.mainSkillLevelBonus);
      const skill=energyMechanics?energyMechanics.directEnergyPerUse(mon.main,mon.mainSkillId,skillLevel,settings.islandBonusPct):{supported:false,actualEnergy:0,baseEnergy:0};
      const favoriteMultiplier=favorite?(profile.expert?exRule.berryFavoriteMultiplier:2):1,berryEnergyPerBerry=energyMechanics?energyMechanics.applyPercentageBonus((berryStrength||0)*favoriteMultiplier,settings.islandBonusPct):(berryStrength||0)*favoriteMultiplier;
      return {
        id:mon.id,name:mon.name,berryName:mon.berry||'待核对',favorite,favoriteMultiplier,exRule,helps,normalHelps,sneakyHelps,berries:0,berryStrength,
        berryBaseEnergy:0,berryEnergy:0,skillProbability:probability,skillLevel,baseSkillLevel,eventModifier:modifier,skill,triggers:useTimeline?0:normalHelps*probability.effective,lostTriggers:0,directSkillEnergy:0,
        berryEnergyPerBerry,ordinaryBerryEnergyPerHelp:(1-member.probability.current)*member.berryCount*berryEnergyPerBerry,
        complexSkill:null,complexSkillEnergy:0,teamRecovery:0,productiveRecovery:0,selfRecovery:0,skillIngredients:0,skillIngredientRange:null,potSlots:0,tastyBonusPct:0,dreamShards:0,dreamShardRange:null,candy:0,berryJuice:0,
        totalEnergy:0,mon
      };
    });
    if(teamSkillEffects&&typeof teamSkillEffects.evaluateMember==='function')rows.forEach((row,index)=>{row.complexSkill=teamSkillEffects.evaluateMember(index,rows,{energyMechanics,islandBonusPct:settings.islandBonusPct,durationHours:settings.durationHours})});
    let timeline=null;
    if(useTimeline){
      const swapHours=Array.isArray(options.swapHours)?options.swapHours:Array.from({length:settings.teamSwapCount},(_value,index)=>settings.durationHours*(index+1)/(settings.teamSwapCount+1));
      const simulationMembers=members.map((member,index)=>({...member,skillProbability:rows[index].skillProbability,skillEffect:rows[index].complexSkill}));
      timeline=productionTimeline.simulate(simulationMembers,{durationHours:settings.durationHours,collectionHours:settings.skillCollectionHours||members[0]?.collectionHours||4,startEnergy:settings.startEnergy,sleepScore:settings.sleepScore,swapHours,collectBeforeSwap:settings.collectBeforeSwap});
      rows.forEach((row,index)=>{const simulated=timeline.members[index];row.helps=simulated.helps;row.normalHelps=simulated.normalHelps;row.sneakyHelps=simulated.sneakyHelps;row.triggers=simulated.triggers;row.lostTriggers=simulated.lostTriggers;row.energyStages=simulated.stageMinutes;row.endingEnergy=simulated.endingEnergy;row.averageHelpFactor=simulated.averageHelpFactor});
      if(teamSkillEffects&&typeof teamSkillEffects.evaluateMember==='function')rows.forEach((row,index)=>{row.complexSkill=teamSkillEffects.evaluateMember(index,rows,{energyMechanics,islandBonusPct:settings.islandBonusPct,durationHours:settings.durationHours})});
    }
    rows.forEach((row,index)=>{
      const member=members[index],ingredientRate=Number(member&&member.probability&&member.probability.current)||0;
      row.berries=(row.normalHelps*(1-ingredientRate)+row.sneakyHelps)*(member&&member.berryCount||1);
      row.berryBaseEnergy=(row.berryStrength||0)*row.berries*row.favoriteMultiplier;
      row.berryEnergy=energyMechanics?energyMechanics.applyPercentageBonus(row.berryBaseEnergy,settings.islandBonusPct):Math.round(row.berryBaseEnergy);
      row.directSkillEnergy=row.skill.supported?Math.round(row.triggers*row.skill.actualEnergy):0;
      if(row.complexSkill&&row.complexSkill.supported){row.complexSkillEnergy=Math.round(row.triggers*row.complexSkill.energyPerUse);row.teamRecovery=row.triggers*row.complexSkill.teamRecoveryPerUse;row.productiveRecovery=row.triggers*row.complexSkill.productiveRecoveryPerUse;row.selfRecovery=row.triggers*row.complexSkill.selfRecoveryPerUse;row.skillIngredients=row.triggers*row.complexSkill.ingredientsPerUse;row.skillIngredientRange=Array.isArray(row.complexSkill.ingredientRangePerUse)?row.complexSkill.ingredientRangePerUse.map(value=>row.triggers*value):null;row.potSlots=row.triggers*row.complexSkill.potSlotsPerUse;row.tastyBonusPct=row.triggers*row.complexSkill.tastyBonusPctPerUse;row.dreamShards=row.triggers*row.complexSkill.dreamShardsPerUse;row.dreamShardRange=Array.isArray(row.complexSkill.dreamShardRangePerUse)?row.complexSkill.dreamShardRangePerUse.map(value=>row.triggers*value):null;row.candy=row.triggers*row.complexSkill.candyPerUse;row.berryJuice=row.triggers*row.complexSkill.berryJuicePerUse}
      row.totalEnergy=row.berryEnergy+row.directSkillEnergy+row.complexSkillEnergy;
    });
    rows.forEach(row=>{delete row.mon});
    const berryEnergy=sum(rows.map(row=>row.berryEnergy)),directSkillEnergy=sum(rows.map(row=>row.directSkillEnergy)),complexSkillEnergy=sum(rows.map(row=>row.complexSkillEnergy)),totalSkillEnergy=directSkillEnergy+complexSkillEnergy,totalEnergy=berryEnergy+totalSkillEnergy,teamRecovery=sum(rows.map(row=>row.teamRecovery)),productiveRecovery=sum(rows.map(row=>row.productiveRecovery)),skillIngredients=sum(rows.map(row=>row.skillIngredients)),skillIngredientRange=sumResourceRange(rows,'skillIngredientRange','skillIngredients'),potSlots=sum(rows.map(row=>row.potSlots)),tastyBonusPct=sum(rows.map(row=>row.tastyBonusPct)),dreamShards=sum(rows.map(row=>row.dreamShards)),dreamShardRange=sumResourceRange(rows,'dreamShardRange','dreamShards'),candy=sum(rows.map(row=>row.candy)),berryJuice=sum(rows.map(row=>row.berryJuice));
    return {...settings,island:profile,timeline,berryEnergy,directSkillEnergy,complexSkillEnergy,totalSkillEnergy,teamRecovery,productiveRecovery,skillIngredients,skillIngredientRange,potSlots,tastyBonusPct,dreamShards,dreamShardRange,candy,berryJuice,totalEnergy,perHour:totalEnergy/settings.durationHours,members:rows,unsupportedSkillMembers:rows.filter(row=>row.complexSkill&&!row.complexSkill.supported)};
  }

  function ingredientProbability(mon,production){
    const skills=unlockedSubskills(mon);
    const subskillBonus=(skills.includes('食材概率M')?.36:0)+(skills.includes('食材概率S')?.18:0);
    const natureMultiplier=natureIngredientMultiplier(mon.nature);
    const catalogRate=production&&production.ingredientRate!==undefined?production.ingredientRate:mon&&mon.ingredientRate;
    const base=Number(catalogRate);
    return {
      base:Number.isFinite(base)?base:.2,
      current:clamp((Number.isFinite(base)?base:.2)*natureMultiplier*(1+subskillBonus),0,.95),
      natureMultiplier,
      subskillBonus,
      provisional:!Number.isFinite(base)
    };
  }

  function validateSpecialTeam(team){
    const specials=team.filter(mon=>mon&&SPECIAL_NAMES.has(mon.name));
    if(specials.length<=1)return {valid:true,specials};
    const names=new Set(specials.map(mon=>mon.name));
    const latiasLatiosOnly=specials.length===2&&names.size===2&&names.has('拉帝亚斯')&&names.has('拉帝欧斯');
    return latiasLatiosOnly
      ?{valid:true,specials,exception:'拉帝亚斯＋拉帝欧斯例外'}
      :{valid:false,specials,message:`特殊宝可梦通常只能上场1只；当前选择了${specials.map(mon=>mon.name).join('、')}。只有拉帝亚斯＋拉帝欧斯可以同时上场。`};
  }

  function validateBattleTeam(team){
    const collectionOnly=team.filter(mon=>mon&&mon.battleEligible===false);
    if(collectionOnly.length)return {valid:false,collectionOnly,message:`${collectionOnly.map(mon=>mon.name).join('、')}已设为“仅收藏”，不会参与实战计算。请在盒子管理中重新启用，或替换当前队员。`};
    return validateSpecialTeam(team);
  }

  function cleanMemberIds(members){
    return Array.isArray(members)?members.slice(0,5).map(String).filter(Boolean):[];
  }

  function sameLineup(left,right){
    const a=cleanMemberIds(left),b=cleanMemberIds(right);
    return a.length===b.length&&a.every((id,index)=>id===b[index]);
  }

  function normalizeSavedTeams(value,validIds){
    if(!Array.isArray(value))return [];
    const allowed=validIds?new Set([...validIds].map(String)):null,usedSlots=new Set(),signatures=new Set(),result=[];
    for(const raw of value){
      if(!raw||typeof raw!=='object'||result.length>=MAX_SAVED_TEAMS)continue;
      const members=cleanMemberIds(raw.members);
      if(members.length!==5||new Set(members).size!==5||(allowed&&members.some(id=>!allowed.has(id))))continue;
      const signature=members.join('|');if(signatures.has(signature))continue;
      let slot=Number(raw.slot);
      if(!Number.isInteger(slot)||slot<1||slot>MAX_SAVED_TEAMS||usedSlots.has(slot))slot=Array.from({length:MAX_SAVED_TEAMS},(_,index)=>index+1).find(candidate=>!usedSlots.has(candidate));
      if(!slot)continue;
      usedSlots.add(slot);signatures.add(signature);
      const energyProfile=Object.hasOwn(ENERGY_PROFILES,raw.energyProfile)?raw.energyProfile:'average';
      result.push({
        id:typeof raw.id==='string'&&raw.id?raw.id:`team-${slot}`,
        slot,
        name:typeof raw.name==='string'&&raw.name.trim()?raw.name.trim().slice(0,30):`队伍 ${slot}`,
        members,
        goodCamp:raw.goodCamp!==false,
        energyProfile,
        savedAt:typeof raw.savedAt==='string'?raw.savedAt:''
      });
    }
    return result.sort((a,b)=>a.slot-b.slot);
  }

  function upsertSavedTeam(savedTeams,members,options={}){
    const teams=normalizeSavedTeams(savedTeams),clean=cleanMemberIds(members);
    if(clean.length!==5||new Set(clean).size!==5)return {ok:false,reason:'incomplete',teams};
    const energyProfile=Object.hasOwn(ENERGY_PROFILES,options.energyProfile)?options.energyProfile:'average';
    const goodCamp=options.goodCamp!==false,savedAt=options.savedAt||new Date().toISOString();
    const existingIndex=teams.findIndex(team=>sameLineup(team.members,clean));
    if(existingIndex>=0){
      const team={...teams[existingIndex],members:clean,goodCamp,energyProfile,savedAt};
      const next=[...teams];next[existingIndex]=team;
      return {ok:true,created:false,team,teams:next.sort((a,b)=>a.slot-b.slot)};
    }
    if(teams.length>=MAX_SAVED_TEAMS)return {ok:false,reason:'limit',teams};
    const used=new Set(teams.map(team=>team.slot)),slot=Array.from({length:MAX_SAVED_TEAMS},(_,index)=>index+1).find(candidate=>!used.has(candidate));
    const team={id:`team-${slot}`,slot,name:`队伍 ${slot}`,members:clean,goodCamp,energyProfile,savedAt};
    return {ok:true,created:true,team,teams:[...teams,team].sort((a,b)=>a.slot-b.slot)};
  }

  function helpingSpeedReduction(mon){
    return clamp(unlockedSubskills(mon).reduce((total,skill)=>total+(skill==='帮忙速度S'?.07:skill==='帮忙速度M'?.14:0),0),0,.35);
  }

  function helpingBonusOutputMultiplier(mon,helpingBonusCount){
    const ownSpeedReduction=helpingSpeedReduction(mon);
    const combinedSpeedReduction=clamp(ownSpeedReduction+Math.max(0,Number(helpingBonusCount)||0)*.05,0,.35);
    return (1-ownSpeedReduction)/Math.max(1-combinedSpeedReduction,.65);
  }

  function baseMemberModel(mon,production,options,helpingBonusCount){
    const baseIntervalSec=parseInterval(mon.interval);
    const energyFactor=Number(options.energyFactor)||2;
    const campSpeed=options.goodCamp?1.2:1;
    const settings=normalizeEnergySettings(options),exRule=exMemberRule(settings,mon);
    const ownSpeedReduction=helpingSpeedReduction(mon);
    const outputMultiplier=helpingBonusOutputMultiplier(mon,helpingBonusCount);
    const combinedSpeedReduction=clamp(ownSpeedReduction+helpingBonusCount*.05,0,.35);
    const teamSpeedFactor=1/outputMultiplier;
    const teamSpeedReduction=1-teamSpeedFactor;
    const neutralIntervalSec=baseIntervalSec*teamSpeedFactor*exRule.intervalMultiplier/campSpeed;
    const effectiveIntervalSec=neutralIntervalSec/energyFactor;
    const carryBase=Number(mon.inv)||0;
    const carry=(options.goodCamp?Math.ceil(carryBase*1.2):carryBase)+exRule.carryBonus;
    const ingredients=parseIngredientSlots(mon.ingredients,mon.lv);
    const sourceModifier=memberModifier(options,mon),eventModifier={
      ingredientHelpBonus:sourceModifier.ingredientHelpBonus+exRule.ingredientHelpBonus,
      skillTriggerMultiplier:sourceModifier.skillTriggerMultiplier*exRule.skillTriggerMultiplier,
      mainSkillLevelBonus:sourceModifier.mainSkillLevelBonus+exRule.mainSkillLevelBonus,
      label:[sourceModifier.label,exRule.label].filter(Boolean).join('／')
    };
    const probability=ingredientProbability(mon,production);
    const unlockedCount=Math.max(ingredients.unlocked.length,1);
    const averageIngredientQuantity=ingredients.unlocked.length?sum(ingredients.unlocked.map(slot=>slot.quantity+eventModifier.ingredientHelpBonus))/unlockedCount:0;
    const berryFinding=unlockedSubskills(mon).includes('树果数量S')?1:0;
    const catalogBerryCount=production&&production.baseBerryCount!==undefined?production.baseBerryCount:mon&&mon.baseBerryCount;
    const baseBerryCount=Number(catalogBerryCount)||1;
    const berryCount=baseBerryCount+berryFinding;
    const expectedItemsPerHelp=(1-probability.current)*berryCount+probability.current*averageIngredientQuantity;
    const helpsPerDay=86400/effectiveIntervalSec;
    const fullHours=carry>0&&expectedItemsPerHelp>0?carry/expectedItemsPerHelp*effectiveIntervalSec/3600:Infinity;
    const ingredientPerHelp=ingredients.unlocked.map(slot=>({
      ...slot,
      expected:probability.current*(slot.quantity+eventModifier.ingredientHelpBonus)/unlockedCount
    }));
    return {
      mon,production,ingredients,probability,baseIntervalSec,neutralIntervalSec,effectiveIntervalSec,carryBase,carry,
      berryCount,berryFinding,expectedItemsPerHelp,helpsPerDay,fullHours,ingredientPerHelp,eventModifier,
      helpingBonusCount,ownSpeedReduction,combinedSpeedReduction,teamSpeedReduction,helpingBonusOutputMultiplier:outputMultiplier,exRule
    };
  }

  function addCollectionModel(member,collectionHours){
    const helpsAvailable=collectionHours*3600/member.effectiveIntervalSec;
    const helpsBeforeFull=member.expectedItemsPerHelp>0?member.carry/member.expectedItemsPerHelp:helpsAvailable;
    const collectibleHelps=Math.min(helpsAvailable,helpsBeforeFull);
    const fullness=clamp(helpsAvailable*member.expectedItemsPerHelp/Math.max(member.carry,1),0,1);
    const ingredients=member.ingredientPerHelp.map(slot=>({
      ...slot,
      perCollection:slot.expected*collectibleHelps,
      perDay:slot.expected*collectibleHelps*(24/collectionHours)
    }));
    return {...member,collectionHours,helpsAvailable,collectibleHelps,fullness,ingredients};
  }

  function recommendedCollectionHours(members){
    if(!members.length)return 4;
    const primary=members.filter(member=>member.mon.specialty!=='berry');
    const pool=primary.length?primary:members;
    const earliest=Math.min(...pool.map(member=>member.fullHours));
    if(!Number.isFinite(earliest))return 4;
    const safe=Math.min(4,earliest*.85);
    return clamp(Math.floor(safe*4)/4,.5,4);
  }

  function calculateMember(mon,production,options={}){
    if(!mon)return {valid:false,member:null,message:'没有可计算的宝可梦。'};
    if(mon.battleEligible===false)return {valid:false,member:null,message:`${mon.name||'这个体'}已设为“仅收藏”，不参与上场产出计算。`};
    const energyProfile=ENERGY_PROFILES[options.energyProfile]||ENERGY_PROFILES.timeline;
    const teammateHelpingBonusCount=clamp(Math.round(Number(options.teammateHelpingBonusCount)||0),0,4);
    const ownHelpingBonus=unlockedSubskills(mon).includes('帮手奖励')?1:0;
    const helpingBonusCount=teammateHelpingBonusCount+ownHelpingBonus;
    const resolvedOptions={...normalizeEnergySettings(options),goodCamp:options.goodCamp!==false,energyFactor:energyProfile.factor,energyProfile:options.energyProfile||'timeline',memberModifier:options.memberModifier};
    const base=baseMemberModel(mon,production,resolvedOptions,helpingBonusCount);
    const requestedCollectionHours=Number(options.collectionHours);
    const collectionHours=Number.isFinite(requestedCollectionHours)
      ?clamp(requestedCollectionHours,.5,24)
      :recommendedCollectionHours([base]);
    const member=addCollectionModel(base,collectionHours);
    const energy=calculateEnergyBreakdown([member],{...options,skillCollectionHours:options.skillCollectionHours||collectionHours}),energyRow=energy.members[0],dailyScale=24/energy.durationHours;
    const withEnergy={...member,effectiveIntervalSec:energyRow&&energyRow.helps>0?energy.durationHours*3600/energyRow.helps:member.effectiveIntervalSec,ingredients:member.ingredientPerHelp.map(slot=>({...slot,perCollection:slot.expected*(energyRow&&energyRow.normalHelps||0)*collectionHours/energy.durationHours,perDay:slot.expected*(energyRow&&energyRow.normalHelps||0)*dailyScale})),snorlaxEnergy:energyRow};
    return {valid:true,member:withEnergy,energy,energyProfile,options:resolvedOptions,teammateHelpingBonusCount,ownHelpingBonus,helpingBonusCount,collectionHours};
  }

  function calculateTeam(team,productionByBoxId,options={}){
    const selectedTeam=team.filter(Boolean);
    const validation=validateBattleTeam(selectedTeam);
    const cleanTeam=selectedTeam.filter(mon=>mon.battleEligible!==false);
    const energyProfile=ENERGY_PROFILES[options.energyProfile]||ENERGY_PROFILES.timeline;
    const resolvedOptions={...normalizeEnergySettings(options),goodCamp:options.goodCamp!==false,energyFactor:energyProfile.factor,energyProfile:options.energyProfile||'timeline',memberModifier:options.memberModifier};
    const helpingBonusCount=cleanTeam.filter(mon=>unlockedSubskills(mon).includes('帮手奖励')).length;
    const baseMembers=cleanTeam.map(mon=>baseMemberModel(mon,productionByBoxId&&productionByBoxId[mon.id],resolvedOptions,helpingBonusCount));
    const requestedCollectionHours=Number(options.skillCollectionHours),collectionHours=Number.isFinite(requestedCollectionHours)?clamp(requestedCollectionHours,.5,24):recommendedCollectionHours(baseMembers);
    const members=baseMembers.map(member=>addCollectionModel(member,collectionHours));
    const energy=calculateEnergyBreakdown(members,{...options,skillCollectionHours:collectionHours});
    const membersWithEnergy=members.map((member,index)=>{const energyRow=energy.members[index],dailyScale=24/energy.durationHours;return {...member,effectiveIntervalSec:energyRow&&energyRow.helps>0?energy.durationHours*3600/energyRow.helps:member.effectiveIntervalSec,ingredients:member.ingredientPerHelp.map(slot=>({...slot,perCollection:slot.expected*(energyRow&&energyRow.normalHelps||0)*collectionHours/energy.durationHours,perDay:slot.expected*(energyRow&&energyRow.normalHelps||0)*dailyScale})),snorlaxEnergy:energyRow}});
    const ingredientTotals=new Map();
    membersWithEnergy.forEach(member=>member.ingredients.forEach(slot=>{
      const current=ingredientTotals.get(slot.name)||{name:slot.name,perCollection:0,perDay:0,contributors:[]};
      current.perCollection+=slot.perCollection;
      current.perDay+=slot.perDay;
      current.contributors.push({id:member.mon.id,name:member.mon.name,perDay:slot.perDay});
      ingredientTotals.set(slot.name,current);
    }));
    const relevant=baseMembers.filter(member=>member.mon.specialty!=='berry');
    const limitingPool=relevant.length?relevant:baseMembers;
    const limitingMember=limitingPool.length?[...limitingPool].sort((a,b)=>a.fullHours-b.fullHours)[0]:null;
    const earliestBerry=baseMembers.filter(member=>member.mon.specialty==='berry').sort((a,b)=>a.fullHours-b.fullHours)[0]||null;
    return {
      valid:validation.valid,
      validation,
      selectedCount:cleanTeam.length,
      options:resolvedOptions,
      energyProfile,
      helpingBonusCount,
      collectionHours,
      limitingMember,
      earliestBerry,
      members:membersWithEnergy,
      energy,
      ingredients:[...ingredientTotals.values()].sort((a,b)=>b.perDay-a.perDay||a.name.localeCompare(b.name,'zh-CN')),
      overnightFull:baseMembers.filter(member=>member.fullHours<8).sort((a,b)=>a.fullHours-b.fullHours)
    };
  }

  function forEachCombination(items,count,visit){
    const picked=[];
    function walk(start){
      if(picked.length===count){visit([...picked]);return}
      for(let index=start;index<=items.length-(count-picked.length);index++){picked.push(items[index]);walk(index+1);picked.pop()}
    }
    if(count>0&&items.length>=count)walk(0);
  }

  function isFullTeamHealer(mon){return /活力全体疗愈|新月祈祷/.test(String(mon&&mon.main||''))}

  function suggestEnergyTeams(pokemon,productionByBoxId,options={}){
    const eligible=(pokemon||[]).filter(mon=>mon&&mon.battleEligible!==false&&Number.isFinite(parseInterval(mon.interval))),poolSize=clamp(Math.round(options.poolSize)||14,5,18),ranked=eligible.map(mon=>{
      const report=calculateMember(mon,productionByBoxId&&productionByBoxId[mon.id],{...options,durationHours:24,teammateHelpingBonusCount:0});
      return {mon,score:report.valid?report.energy.totalEnergy:-Infinity};
    }).sort((a,b)=>b.score-a.score),healers=ranked.filter(item=>isFullTeamHealer(item.mon)).slice(0,3),bonus=ranked.filter(item=>unlockedSubskills(item.mon).includes('帮手奖励')).slice(0,4),pool=[];
    [...ranked.slice(0,poolSize),...healers,...bonus].forEach(item=>{if(item&&!pool.some(row=>row.mon.id===item.mon.id)&&pool.length<18)pool.push(item)});
    let burst=null,stable=null;forEachCombination(pool.map(item=>item.mon),5,team=>{
      const result=calculateTeam(team,productionByBoxId,options);if(!result.valid)return;
      const candidate={team,result,energy:result.energy.totalEnergy};
      if(!burst||candidate.energy>burst.energy)burst=candidate;
      if(team.some(isFullTeamHealer)&&(!stable||candidate.energy>stable.energy))stable=candidate;
    });
    return {burst,stable,poolSize:pool.length,evaluated:pool.length>=5?Math.round(pool.length*(pool.length-1)*(pool.length-2)*(pool.length-3)*(pool.length-4)/120):0};
  }

  function potSlotsPerTrigger(mon,skillLevel){
    const id=Number(mon&&mon.mainSkillId),name=String(mon&&mon.main||''),table=POT_SKILL_SLOTS[id]||(/料理强化S/.test(name)?POT_SKILL_SLOTS[11]:null);
    return table?table[Math.min(table.length,Math.max(1,Math.round(Number(skillLevel)||1)))-1]:0;
  }

  function potOutputForResult(result){
    const duration=Math.max(.5,Number(result&&result.energy&&result.energy.durationHours)||24),members=(result&&result.members||[]).map(member=>{
      const row=member.snorlaxEnergy||{},slots=potSlotsPerTrigger(member.mon,row.skillLevel),triggersPerHour=(Number(row.triggers)||0)/duration;
      return {mon:member.mon,skillLevel:row.skillLevel,slotsPerTrigger:slots,triggersPerHour,slotsPerHour:slots*triggersPerHour};
    }).filter(item=>item.slotsPerTrigger>0);
    return {members,slotsPerHour:sum(members.map(item=>item.slotsPerHour))};
  }

  function suggestPotTeam(pokemon,productionByBoxId,options={}){
    const eligible=(pokemon||[]).filter(mon=>mon&&mon.battleEligible!==false&&Number.isFinite(parseInterval(mon.interval))),potRanked=eligible.filter(mon=>potSlotsPerTrigger(mon,boxManager&&boxManager.effectiveMainSkillLevel?boxManager.effectiveMainSkillLevel(mon):1)>0).map(mon=>{
      const report=calculateMember(mon,productionByBoxId&&productionByBoxId[mon.id],{...options,durationHours:24,teammateHelpingBonusCount:0}),output=potOutputForResult({energy:report.energy,members:[report.member]});return {mon,score:output.slotsPerHour};
    }).sort((a,b)=>b.score-a.score);
    if(!potRanked.length)return {team:[],result:null,output:{members:[],slotsPerHour:0},evaluated:0};
    const supporters=eligible.filter(mon=>unlockedSubskills(mon).includes('帮手奖励')).map(mon=>({mon})),energyFill=eligible.map(mon=>({mon,score:calculateMember(mon,productionByBoxId&&productionByBoxId[mon.id],{...options,durationHours:24}).energy.totalEnergy})).sort((a,b)=>b.score-a.score),pool=[];
    [...potRanked.slice(0,10),...supporters.slice(0,8),...energyFill].forEach(item=>{if(item&&!pool.some(row=>row.id===item.mon.id)&&pool.length<16)pool.push(item.mon)});
    const teamSize=Math.min(5,pool.length);let best=null,evaluated=0;forEachCombination(pool,teamSize,team=>{if(!team.some(mon=>potSlotsPerTrigger(mon,boxManager&&boxManager.effectiveMainSkillLevel?boxManager.effectiveMainSkillLevel(mon):1)>0))return;const result=calculateTeam(team,productionByBoxId,{...options,durationHours:24});if(!result.valid)return;const output=potOutputForResult(result);evaluated++;if(!best||output.slotsPerHour>best.output.slotsPerHour)best={team,result,output}});
    return best?{...best,evaluated}:{team:[],result:null,output:{members:[],slotsPerHour:0},evaluated};
  }

  function calculatePotDeployment(pokemon,productionByBoxId,options={}){
    const baseCapacity=clamp(Math.round(options.baseCapacity||81),1,gameRules&&gameRules.LIMITS?gameRules.LIMITS.permanentPot:81),targetCapacity=Math.max(1,Math.round(Number(options.targetCapacity)||baseCapacity)),goodCamp=options.goodCamp===true,eventMultiplier=Number(options.eventMultiplier)||1,weekend=options.weekend===true,potTeam=suggestPotTeam(pokemon,productionByBoxId,options),requiredSkill=gameRules&&gameRules.requiredCookingPower?gameRules.requiredCookingPower(targetCapacity,{baseCapacity,goodCamp,eventMultiplier,weekend}):Math.max(0,targetCapacity-Math.round(baseCapacity*(goodCamp?1.5:1))),baseFinal=gameRules&&gameRules.finalPotCapacity?gameRules.finalPotCapacity({baseCapacity,goodCamp,eventMultiplier,weekend}):Math.round(baseCapacity*(goodCamp?1.5:1)),rate=potTeam.output.slotsPerHour,expectedHours=requiredSkill===null||rate<=0?null:requiredSkill/rate,safeHours=expectedHours===null?null:Math.ceil(expectedHours*1.3*2)/2;
    return {baseCapacity,targetCapacity,baseFinal,requiredSkill,goodCamp,eventMultiplier,weekend,rate,expectedHours,safeHours,potTeam,reachable:requiredSkill!==null&&(requiredSkill===0||rate>0)};
  }

  function tastyBonusPerTrigger(mon,skillLevel){
    return cookingSuccess&&typeof cookingSuccess.bonusPctPerTrigger==='function'?cookingSuccess.bonusPctPerTrigger(mon,skillLevel):0;
  }

  function tastyOutputForResult(result){
    const duration=Math.max(.5,Number(result&&result.energy&&result.energy.durationHours)||24),members=(result&&result.members||[]).map(member=>{
      const row=member.snorlaxEnergy||{},bonus=tastyBonusPerTrigger(member.mon,row.skillLevel),triggersPerHour=(Number(row.triggers)||0)/duration;
      return {mon:member.mon,skillLevel:row.skillLevel,bonusPctPerTrigger:bonus,triggersPerHour,bonusPctPerHour:bonus*triggersPerHour};
    }).filter(item=>item.bonusPctPerTrigger>0);
    return {members,bonusPctPerHour:sum(members.map(item=>item.bonusPctPerHour))};
  }

  function suggestTastyTeam(pokemon,productionByBoxId,options={}){
    const eligible=(pokemon||[]).filter(mon=>mon&&mon.battleEligible!==false&&Number.isFinite(parseInterval(mon.interval))),tastyRanked=eligible.filter(mon=>tastyBonusPerTrigger(mon,boxManager&&boxManager.effectiveMainSkillLevel?boxManager.effectiveMainSkillLevel(mon):1)>0).map(mon=>{
      const report=calculateMember(mon,productionByBoxId&&productionByBoxId[mon.id],{...options,durationHours:24,teammateHelpingBonusCount:0}),output=tastyOutputForResult({energy:report.energy,members:[report.member]});return {mon,score:output.bonusPctPerHour};
    }).sort((a,b)=>b.score-a.score);
    if(!tastyRanked.length)return {team:[],result:null,output:{members:[],bonusPctPerHour:0},evaluated:0};
    const supporters=eligible.filter(mon=>unlockedSubskills(mon).includes('帮手奖励')).map(mon=>({mon,score:calculateMember(mon,productionByBoxId&&productionByBoxId[mon.id],{...options,durationHours:24}).energy.totalEnergy})).sort((a,b)=>b.score-a.score),energyFill=eligible.map(mon=>({mon,score:calculateMember(mon,productionByBoxId&&productionByBoxId[mon.id],{...options,durationHours:24}).energy.totalEnergy})).sort((a,b)=>b.score-a.score),pool=[];
    [...tastyRanked.slice(0,8),...supporters.slice(0,5),...energyFill].forEach(item=>{if(item&&!pool.some(row=>row.id===item.mon.id)&&pool.length<11)pool.push(item.mon)});
    const teamSize=Math.min(5,pool.length);let best=null,evaluated=0;forEachCombination(pool,teamSize,team=>{if(!team.some(mon=>tastyBonusPerTrigger(mon,boxManager&&boxManager.effectiveMainSkillLevel?boxManager.effectiveMainSkillLevel(mon):1)>0))return;const result=calculateTeam(team,productionByBoxId,{...options,durationHours:24});if(!result.valid)return;const output=tastyOutputForResult(result),energy=Number(result.energy&&result.energy.totalEnergy)||0;evaluated++;if(!best||output.bonusPctPerHour>best.output.bonusPctPerHour+1e-9||(Math.abs(output.bonusPctPerHour-best.output.bonusPctPerHour)<=1e-9&&energy>best.energy))best={team,result,output,energy}});
    return best?{...best,evaluated}:{team:[],result:null,output:{members:[],bonusPctPerHour:0},evaluated};
  }

  function calculateTastyDeployment(pokemon,productionByBoxId,options={}){
    const targetSetting=Number(options.targetBonusPct),currentBonusPct=clamp(Math.round(options.currentBonusPct),0,70),targetBonusPct=clamp(Math.round(Number.isFinite(targetSetting)?targetSetting:70),currentBonusPct,70),tastyTeam=suggestTastyTeam(pokemon,productionByBoxId,options),sources=tastyTeam.output.members.map(member=>({id:member.mon.id,name:member.mon.nickname||member.mon.name,triggersPerHour:member.triggersPerHour,bonusPctPerTrigger:member.bonusPctPerTrigger})),estimate=cookingSuccess&&typeof cookingSuccess.deploymentEstimate==='function'?cookingSuccess.deploymentEstimate(sources,{currentBonusPct,targetBonusPct,confidence:options.confidence||.8,maxHours:options.maxHours||336}):null,isSunday=options.isSunday===true,outcome=cookingSuccess&&typeof cookingSuccess.mealOutcome==='function'?cookingSuccess.mealOutcome({bonusPct:targetBonusPct,isSunday}):null;
    return {currentBonusPct,targetBonusPct,isSunday,tastyTeam,sources,estimate,outcome,rate:tastyTeam.output.bonusPctPerHour,reachable:Boolean(estimate&&estimate.reachable)};
  }

  function clockInterval(seconds){
    const total=Math.max(1,Math.round(Number(seconds)||1)),hours=Math.floor(total/3600),minutes=Math.floor(total%3600/60),rest=total%60;
    return hours?`${hours}:${String(minutes).padStart(2,'0')}:${String(rest).padStart(2,'0')}`:`${minutes}:${String(rest).padStart(2,'0')}`;
  }

  function projectPokemon(mon,options={}){
    const api=options.investmentPlanner||investmentPlanner,scoring=options.scoring,catalog=options.catalog,natureApi=options.natureApi,targetLevel=options.targetLevel==='current'?Number(mon.lv):Math.max(Number(mon.lv)||1,Number(options.targetLevel)||Number(mon.lv)||1);
    if(!api||typeof api.calculateInvestment!=='function'||!scoring||!catalog)return {ok:false,mon,reason:'missing-projection-engine'};
    const report=api.calculateInvestment(mon,targetLevel,{catalog,scoring,natureApi,mainSeeds:options.mainSeeds||0,subSeeds:0,includeEvolution:options.includeEvolution!==false});
    if(!report.ok)return {ok:false,mon,reason:report.reason};
    const species=report.targetSpecies,snapshot=report.after,projected={...mon,name:species.name,speciesId:String(species.id),lv:String(snapshot.level),interval:clockInterval(snapshot.intervalSec),inv:String(snapshot.carry),specialty:species.specialty||mon.specialty,berryId:species.berryId||mon.berryId,mainSkillId:Number(species.mainSkill&&species.mainSkill.id||mon.mainSkillId),main:`${species.mainSkill&&species.mainSkill.name||String(mon.main||'').replace(/\s*Lv\.\d+.*/, '')} Lv.${report.mainSkill.target}`,ingredientRate:Number(species.ingredientRate),skillRatePct:Number(species.skillRatePct),baseBerryCount:Number(species.baseBerryCount)||1,catalogHelpFrequencyBaseSec:Number(species.helpFrequencyBaseSec),effectiveSubs:report.seedPlan.after.join('；')};
    const production={ingredientRate:projected.ingredientRate,baseBerryCount:projected.baseBerryCount};
    return {ok:true,mon:projected,production,report};
  }

  function calculateProjectedTeam(team,productionByBoxId,options={}){
    const current=calculateTeam(team,productionByBoxId,options),rows=(team||[]).map(mon=>projectPokemon(mon,options)),projectedTeam=rows.map(row=>row.mon),projectedProduction={...(productionByBoxId||{})};rows.forEach(row=>{if(row.ok)projectedProduction[row.mon.id]=row.production});
    const projected=calculateTeam(projectedTeam,projectedProduction,options);
    return {current,projected,members:rows,available:rows.some(row=>row.ok),energyChangePct:current.energy.totalEnergy>0?(projected.energy.totalEnergy/current.energy.totalEnergy-1)*100:0};
  }

  function formatHours(hours){
    if(!Number.isFinite(hours))return '不会满仓';
    const totalMinutes=Math.max(1,Math.round(hours*60));
    const h=Math.floor(totalMinutes/60),m=totalMinutes%60;
    return h&&m?`${h}小时${m}分`:h?`${h}小时`:`${m}分钟`;
  }

  function formatInterval(seconds){
    if(!Number.isFinite(seconds))return '—';
    const total=Math.round(seconds),minutes=Math.floor(total/60),rest=total%60;
    return `${minutes}分${String(rest).padStart(2,'0')}秒`;
  }

  function element(tag,className,text){
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  }

  function number(value,digits=1){return Number(value).toFixed(digits)}
  function formatResourceRange(range,digits=1){
    if(!Array.isArray(range))return number(0,digits);
    const low=Number(range[0])||0,high=Number(range[1])||0;
    return Math.abs(high-low)<10**(-digits)?number(low,digits):`${number(low,digits)}~${number(high,digits)}`;
  }

  function mount({pokemon,production,onChange,profile,picker:pokemonPicker,catalog,recipes,scoring,natureApi,investmentPlanner:investmentApi}={}){
    if(typeof document==='undefined')return null;
    const page=document.querySelector('[data-page="team"]');
    if(!page)return null;
    const mons=Array.isArray(pokemon)?pokemon:[];
    const productionSnapshot=production||(
      typeof globalThis!=='undefined'&&globalThis.POKEMON_SLEEP_TEAM_PRODUCTION
    )||{};
    const productionByBoxId=productionSnapshot.byBoxId||{};
    const picker=document.querySelector('#currentTeamPicker');
    const warning=document.querySelector('#currentTeamWarning');
    const summary=document.querySelector('#currentTeamSummary');
    const ingredientRoot=document.querySelector('#currentTeamIngredients');
    const memberRoot=document.querySelector('#currentTeamMembers');
    const countRoot=document.querySelector('#currentTeamCount');
    const campInput=document.querySelector('#currentTeamCamp');
    const energyInput=document.querySelector('#currentTeamEnergy');
    const durationInput=document.querySelector('#currentTeamDuration');
    const startEnergyInput=document.querySelector('#currentTeamStartEnergy');
    const sleepScoreInput=document.querySelector('#currentTeamSleepScore');
    const skillCollectionInput=document.querySelector('#currentTeamSkillCollection');
    const swapCountInput=document.querySelector('#currentTeamSwapCount');
    const collectBeforeSwapInput=document.querySelector('#currentTeamCollectBeforeSwap');
    const exControls=document.querySelector('#currentTeamExControls');
    const exMainBerry=document.querySelector('#currentTeamExMainBerry');
    const exSubBerry1=document.querySelector('#currentTeamExSubBerry1');
    const exSubBerry2=document.querySelector('#currentTeamExSubBerry2');
    const exEffect=document.querySelector('#currentTeamExEffect');
    const clearButton=document.querySelector('#currentTeamClear');
    const saveTeamButton=document.querySelector('#currentTeamSave');
    const savedCountRoot=document.querySelector('#currentTeamSavedCount');
    const savedListRoot=document.querySelector('#currentTeamSavedList');
    const saveMessageRoot=document.querySelector('#currentTeamSaveMessage');
    const drawer=document.querySelector('#currentTeamDrawer');
    const drawerOpen=document.querySelector('#currentTeamDrawerOpen');
    const drawerClose=document.querySelector('#currentTeamDrawerClose');
    const drawerSlots=document.querySelector('#currentTeamDrawerSlots');
    const scenarioLevel=document.querySelector('#teamScenarioLevel');
    const scenarioSeeds=document.querySelector('#teamScenarioMainSeeds');
    const scenarioEvolution=document.querySelector('#teamScenarioEvolution');
    const scenarioRun=document.querySelector('#teamScenarioRun');
    const scenarioRoot=document.querySelector('#teamScenarioResult');
    const suggestRun=document.querySelector('#teamSuggestRun');
    const suggestRoot=document.querySelector('#teamSuggestResult');
    const tastyCurrent=document.querySelector('#teamTastyCurrent');
    const tastyTarget=document.querySelector('#teamTastyTarget');
    const tastySunday=document.querySelector('#teamTastySunday');
    const tastyRun=document.querySelector('#teamTastyRun');
    const tastyRoot=document.querySelector('#teamTastyResult');
    const ingredientApi=typeof globalThis!=='undefined'?globalThis.POKEMON_SLEEP_INGREDIENTS:null;
    const storageKey='pokemon-sleep-current-team-v1';
    const savedStorageKey='pokemon-sleep-saved-teams-v1';
    const energySettingsStorageKey='pokemon-sleep-team-energy-settings-v1';
    let sortedMons=[...mons].sort((a,b)=>a.name.localeCompare(b.name,'zh-CN')||Number(b.lv)-Number(a.lv)||Number(a.id)-Number(b.id));
    let selected=loadSelection();
    let savedTeams=loadSavedTeams(),deleteArmedId=null,saveMessageTimer=null;
    const slots=[];

    function loadEnergySettings(){
      try{return normalizeEnergySettings(JSON.parse(localStorage.getItem(energySettingsStorageKey)||'{}'))}catch(_error){return {...DEFAULT_ENERGY_SETTINGS}}
    }

    let energySettings=loadEnergySettings();
    if(durationInput)durationInput.value=String(energySettings.durationHours);
    if(startEnergyInput)startEnergyInput.value=String(energySettings.startEnergy);
    if(sleepScoreInput)sleepScoreInput.value=String(energySettings.sleepScore);
    if(skillCollectionInput)skillCollectionInput.value=String(energySettings.skillCollectionHours);
    if(swapCountInput)swapCountInput.value=String(energySettings.teamSwapCount);
    if(collectBeforeSwapInput)collectBeforeSwapInput.checked=energySettings.collectBeforeSwap;
    if(exEffect)exEffect.value=energySettings.exWeeklyEffect;

    function fillBerrySelect(select,values,current){
      if(!select)return;select.replaceChildren(...values.map(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;return option}));select.value=values.includes(current)?current:values[0];
    }

    function syncExControls(selectedIsland){
      const profileKey=selectedIsland&&selectedIsland.teamProfile||energySettings.islandProfile,expert=['greengrass-expert','cyan-expert'].includes(profileKey);
      if(exControls)exControls.hidden=!expert;
      if(!expert)return;
      const mainAllowed=profileKey==='cyan-expert'?['橙橙果','桃桃果','椰木果']:BERRY_NAMES,current=energySettings.favoriteBerries||[],main=current[0]||mainAllowed[0],remaining=BERRY_NAMES.filter(name=>name!==main);
      fillBerrySelect(exMainBerry,mainAllowed,main);fillBerrySelect(exSubBerry1,remaining,current[1]||remaining[0]);fillBerrySelect(exSubBerry2,remaining.filter(name=>name!==exSubBerry1.value),current[2]||remaining.find(name=>name!==exSubBerry1.value));
    }

    function teamOptions(){
      const personal=profile&&typeof profile.getState==='function'?profile.getState():personalSettings&&personalSettings.read?personalSettings.read():null;
      const selectedIsland=personal&&personalSettings&&personalSettings.island?personalSettings.island(personal):null;
      const islandProfile=selectedIsland&&selectedIsland.teamProfile||energySettings.islandProfile||'none',expert=['greengrass-expert','cyan-expert'].includes(islandProfile),favoriteBerries=expert?[exMainBerry&&exMainBerry.value,exSubBerry1&&exSubBerry1.value,exSubBerry2&&exSubBerry2.value].filter(Boolean):energySettings.favoriteBerries;
      return {goodCamp:campInput.checked,energyProfile:energyInput.value,...energySettings,islandProfile,islandBonusPct:personal&&personalSettings?personalSettings.islandBonus(personal):energySettings.islandBonusPct||0,favoriteBerries,exWeeklyEffect:expert&&exEffect?exEffect.value:'none'};
    }

    function saveEnergySettings(){
      energySettings=normalizeEnergySettings({
        durationHours:durationInput&&durationInput.value,
        islandProfile:energySettings.islandProfile,
        islandBonusPct:energySettings.islandBonusPct,
        favoriteBerries:[exMainBerry&&exMainBerry.value,exSubBerry1&&exSubBerry1.value,exSubBerry2&&exSubBerry2.value].filter(Boolean),
        startEnergy:startEnergyInput&&startEnergyInput.value,
        sleepScore:sleepScoreInput&&sleepScoreInput.value,
        skillCollectionHours:skillCollectionInput&&skillCollectionInput.value,
        teamSwapCount:swapCountInput&&swapCountInput.value,
        collectBeforeSwap:collectBeforeSwapInput&&collectBeforeSwapInput.checked,
        exWeeklyEffect:exEffect&&exEffect.value
      });
      if(durationInput)durationInput.value=String(energySettings.durationHours);
      try{localStorage.setItem(energySettingsStorageKey,JSON.stringify(energySettings))}catch(_error){}
    }

    function notifyChange(type){
      if(typeof onChange==='function')onChange({type,currentTeam:[...selected.filter(Boolean)],savedTeams:savedTeams.map(team=>({...team,members:[...team.members]}))});
    }

    function loadSelection(){
      try{
        const value=JSON.parse(localStorage.getItem(storageKey)||'[]');
        if(Array.isArray(value))return value.slice(0,5).map(String).filter(id=>mons.some(mon=>mon.id===id));
      }catch(_error){}
      return [];
    }

    function saveSelection(){
      try{localStorage.setItem(storageKey,JSON.stringify(selected.filter(Boolean)))}catch(_error){}
      notifyChange('current-team');
    }

    function loadSavedTeams(){
      try{return normalizeSavedTeams(JSON.parse(localStorage.getItem(savedStorageKey)||'[]'),mons.map(mon=>mon.id))}catch(_error){return []}
    }

    function persistSavedTeams(){
      try{localStorage.setItem(savedStorageKey,JSON.stringify(savedTeams));notifyChange('saved-teams');return true}catch(_error){return false}
    }

    function showSaveMessage(text,type='success'){
      if(!saveMessageRoot)return;
      saveMessageRoot.textContent=text;saveMessageRoot.hidden=false;saveMessageRoot.className=`current-team-save-message ${type}`;
      if(saveMessageTimer)clearTimeout(saveMessageTimer);
      saveMessageTimer=setTimeout(()=>{saveMessageRoot.hidden=true},3600);
    }

    function chooseFor(index){
      const pickerController=pokemonPicker||globalThis.POKEMON_SLEEP_POKEMON_PICKER_CONTROLLER;if(!pickerController||typeof pickerController.open!=='function')return;
      pickerController.open({title:`选择队伍位置 ${index+1}`,pokemon:sortedMons,selectedIds:selected.filter(Boolean),disabledIds:selected.filter((id,slot)=>slot!==index&&Boolean(id)),onSelect:id=>{selected[index]=id;while(selected.length&&selected[selected.length-1]==='')selected.pop();saveSelection();render()}});
    }

    function buildPickers(){
      slots.length=0;picker.replaceChildren();drawerSlots?.replaceChildren();
      for(let index=0;index<5;index++){
        const main=element('button','current-team-roster-card');main.type='button';main.addEventListener('click',()=>chooseFor(index));picker.append(main);
        const row=element('div','current-team-drawer-slot'),position=element('span','current-team-pick-label',`位置 ${index+1}`),select=element('button','pokemon-selection-button');select.type='button';select.addEventListener('click',()=>chooseFor(index));const remove=element('button','current-team-slot-remove','清除');remove.type='button';remove.addEventListener('click',()=>{selected[index]='';while(selected.length&&selected[selected.length-1]==='')selected.pop();saveSelection();render()});row.append(position,select,remove);drawerSlots?.append(row);slots.push({main,select,remove,index});
      }
    }

    function updatePickers(){
      const pickerController=pokemonPicker||globalThis.POKEMON_SLEEP_POKEMON_PICKER_CONTROLLER;
      slots.forEach(({main,select,remove,index})=>{const mon=mons.find(item=>item.id===(selected[index]||''));
        if(pickerController&&typeof pickerController.setButton==='function'){
          main.replaceChildren();if(mon&&typeof pickerController.createIcon==='function')main.append(pickerController.createIcon(mon,{size:'large'}));else main.textContent='＋';main.classList.toggle('is-empty',!mon);pickerController.setButton(select,mon,{emptyLabel:'选择宝可梦'});
        }else{main.textContent=mon?`${mon.nickname||mon.name} #${mon.id}`:`位置 ${index+1} ＋`;select.textContent=mon?`${mon.nickname||mon.name} #${mon.id}`:'选择宝可梦'}
        main.dataset.position=String(index+1);main.title=mon?`${mon.nickname||mon.name} · #${mon.id} · Lv.${mon.lv}`:`位置 ${index+1}`;main.setAttribute('aria-label',mon?`更换位置${index+1}的${mon.nickname||mon.name}`:`选择位置${index+1}的宝可梦`);remove.disabled=!mon;
      });
    }

    function renderSummary(result){
      summary.replaceChildren();
      if(!result.selectedCount){
        summary.append(element('div','current-team-empty','从上方五个位置选择宝可梦后，这里会显示食材与收菜时间。'));
        ingredientRoot.replaceChildren();memberRoot.replaceChildren();return;
      }
      if(!result.valid){
        summary.append(element('div','current-team-empty error',result.validation.message));
        ingredientRoot.replaceChildren();memberRoot.replaceChildren();return;
      }
      const limiting=result.limitingMember;
      const totalPerDay=sum(result.ingredients.map(item=>item.perDay));
      const timeline=result.energy.timeline,stageSummary=timeline&&productionTimeline?productionTimeline.ENERGY_STAGES.map(stage=>{const minutes=sum(timeline.members.map(member=>member.stageMinutes[stage.key]||0))/Math.max(1,timeline.members.length);return `${stage.label} ${number(minutes/60,1)}h`}).filter(text=>!text.endsWith(' 0.0h')).join('／'):'';
      const skillIngredientText=result.energy.skillIngredientRange?`食材 ${formatResourceRange(result.energy.skillIngredientRange,1)} 个`:'',dreamShardText=result.energy.dreamShardRange?`碎片 ${formatResourceRange(result.energy.dreamShardRange,0)}`:'',berryJuiceText=result.energy.berryJuice?`树果汁 ${number(result.energy.berryJuice,2)} 瓶`:'';
      const resourceHeadline=skillIngredientText||result.energy.potSlots?skillIngredientText||`扩锅 ${number(result.energy.potSlots,1)} 格`:result.energy.tastyBonusPct?`大成功 +${number(result.energy.tastyBonusPct,1)}%`:dreamShardText||result.energy.candy?dreamShardText||`糖果 ${number(result.energy.candy,1)}`:berryJuiceText||'无';
      const resourceDetail=[skillIngredientText,result.energy.potSlots?`扩锅 ${number(result.energy.potSlots,1)} 格`:'',result.energy.tastyBonusPct?`大成功 +${number(result.energy.tastyBonusPct,1)}%`:'',dreamShardText,result.energy.candy?`糖果 ${number(result.energy.candy,1)}`:'',berryJuiceText].filter(Boolean).join(' · ')||'无额外技能资源';
      const cards=[
        [`${number(result.energy.durationHours,1)}小时纯能量`,`${Math.round(result.energy.totalEnergy).toLocaleString('zh-CN')}`,`每小时约 ${Math.round(result.energy.perHour).toLocaleString('zh-CN')}；不计食材能量`],
        ['常规树果',Math.round(result.energy.berryEnergy).toLocaleString('zh-CN'),`${result.energy.island.label} · 岛屿加成 +${number(result.energy.islandBonusPct,0)}%`],
        ['主技能纯能量',Math.round(result.energy.totalSkillEnergy).toLocaleString('zh-CN'),result.energy.complexSkillEnergy?`直接能量 ${Math.round(result.energy.directSkillEnergy).toLocaleString('zh-CN')}＋队伍联动 ${Math.round(result.energy.complexSkillEnergy).toLocaleString('zh-CN')}`:result.energy.directSkillEnergy?'按理论触发期望计算':'当前队员没有可折算的纯能量主技能'],
        ['队伍活力收益',number(result.energy.productiveRecovery,1),result.energy.teamRecovery?`治疗已回填时间轴；全队回复总量 ${number(result.energy.teamRecovery,1)}`:'当前队伍没有可统计的治疗技能'],
        ['技能资源',resourceHeadline,`独立于卡比兽能量：${resourceDetail}`],
        [timeline?'点击收取':'建议收菜',formatHours(result.collectionHours),timeline?`技能实际收取 ${number(timeline.totals.triggers,2)} 次；换队清空损失 ${number(timeline.totals.lostTriggers,2)} 次`:limiting?`按${limiting.mon.name}预计${formatHours(limiting.fullHours)}满仓，预留约15%空间`:'等待完整队伍'],
        ['食材合计',`${number(totalPerDay,1)} 个／24h`,'按建议频率全天执行的常规帮忙期望'],
        ['帮手奖励',`${result.helpingBonusCount} 个已解锁`,result.helpingBonusCount?`每名成员按自身速度补正逐只重算；队内叠加${result.helpingBonusCount*5}%，与速度副技能合计遵守35%上限`:'当前没有全队速度加成'],
        [timeline?'五档活力':'计算状态',timeline?`${number(result.energy.startEnergy,0)} → ${number(sum(timeline.members.map(member=>member.endingEnergy))/Math.max(1,timeline.members.length),0)}`:`${result.selectedCount}／5 人`,timeline?stageSummary:result.energyProfile.label+(result.options.goodCamp?'＋好露营券':'＋无露营券')]
      ];
      cards.forEach(([label,value,note])=>{const card=element('article','current-team-stat');card.append(element('span','',label),element('strong','',value),element('small','',note));summary.append(card)});
      ingredientRoot.replaceChildren();
      if(!result.ingredients.length)ingredientRoot.append(element('div','current-team-empty','当前已选成员没有可统计的已解锁食材。'));
      else result.ingredients.forEach(item=>{const chip=element('article','current-team-ingredient');chip.append(element('strong','',item.name),element('span','',`每次约 ${number(item.perCollection)} 个`),element('small','',`24小时约 ${number(item.perDay)} 个`));ingredientRoot.append(chip)});
    }

    function renderMembers(result){
      memberRoot.replaceChildren();
      if(!result.valid)return;
      result.members.forEach((member,index)=>{
        const mon=member.mon,card=element('article','current-team-member');
        const head=element('div','current-team-member-head');
        const title=element('div',''),levelLine=element('div','current-team-level-line'),levelMeta=element('small','',`Lv.${mon.lv} · ${ROLE_LABELS[mon.specialty]||'待核对'} · Lv.10 ${String(mon.effectiveSubs||mon.subs).split('；')[0]||'—'}`),levelButton=element('button','current-team-level-edit','调整等级');
        levelButton.type='button';levelButton.setAttribute('aria-label',`调整${mon.name}当前等级`);levelButton.addEventListener('click',()=>document.dispatchEvent(new CustomEvent('pokemon-sleep:edit-level',{detail:{id:mon.id}})));
        levelLine.append(levelMeta,levelButton);title.append(element('span','current-team-position',`位置 ${index+1}`),element('h3','pokemon-name-text',mon.name),levelLine);
        const fullness=element('span',`current-team-fullness ${member.fullness>=.9?'danger':member.fullness>=.7?'warn':''}`,`收菜时约${Math.round(member.fullness*100)}%`);head.append(title,fullness);card.append(head);
        const stats=element('div','current-team-member-stats'),memberEnergy=member.snorlaxEnergy;
        [[formatInterval(member.effectiveIntervalSec),'时间轴平均间隔'],[`${number(member.probability.current*100)}%`,'当前食材概率'],[`${member.carry}`,'模型持有上限'],[formatHours(member.fullHours),'预计满仓'],[Math.round(memberEnergy.totalEnergy).toLocaleString('zh-CN'),`${number(result.energy.durationHours,1)}小时纯能量`],[`${memberEnergy.berryName}${memberEnergy.favorite?` ×${number(memberEnergy.favoriteMultiplier,1)}`:''}`,'当前树果']].forEach(([value,label])=>{const item=element('div','');item.append(element('strong','',value),element('span','',label));stats.append(item)});card.append(stats);
        const foods=element('div','current-team-member-foods');
        member.ingredients.forEach(slot=>{const row=element('div','');row.append(element('strong','',slot.name),element('span','',`每次约 ${number(slot.perCollection)} · 24h约 ${number(slot.perDay)}`));foods.append(row)});
        if(!member.ingredients.length)foods.append(element('span','current-team-muted','暂无可统计食材'));
        card.append(foods);
        const notes=[];
        if(/食材获取|食材精选|十项全能|料理辅助/.test(mon.main))notes.push('主技能食材单独列示，不并入上面的常规帮忙食材数量');
        if(memberEnergy.skill.supported)notes.push(`直接能量技能按 Lv.${memberEnergy.skillLevel}、约${number(memberEnergy.triggers,2)}次触发计入 ${Math.round(memberEnergy.directSkillEnergy).toLocaleString('zh-CN')} 能量`);
        if(memberEnergy.complexSkill&&memberEnergy.complexSkill.supported){
          const effect=memberEnergy.complexSkill,parts=[`${effect.label}按 Lv.${memberEnergy.skillLevel}、约${number(memberEnergy.triggers,2)}次触发`];
          if(memberEnergy.complexSkillEnergy)parts.push(`计入 ${Math.round(memberEnergy.complexSkillEnergy).toLocaleString('zh-CN')} 纯能量`);
          if(memberEnergy.teamRecovery)parts.push(`全队活力收益约 ${number(memberEnergy.teamRecovery,1)}`);
          if(memberEnergy.skillIngredientRange)parts.push(`技能食材 ${formatResourceRange(memberEnergy.skillIngredientRange,1)} 个`);
          if(memberEnergy.potSlots)parts.push(`扩锅约 ${number(memberEnergy.potSlots,1)} 格`);
          if(memberEnergy.tastyBonusPct)parts.push(`大成功率累计约 +${number(memberEnergy.tastyBonusPct,1)}%`);
          if(memberEnergy.dreamShardRange)parts.push(`梦之碎片 ${formatResourceRange(memberEnergy.dreamShardRange,0)}`);
          if(memberEnergy.candy)parts.push(`队友糖果约 ${number(memberEnergy.candy,1)} 个`);
          if(memberEnergy.berryJuice)parts.push(`树果汁约 ${number(memberEnergy.berryJuice,2)} 瓶`);
          parts.push(effect.detail);notes.push(parts.join('，'));
          if(effect.pendingComponents&&effect.pendingComponents.length)notes.push(effect.pendingComponents.join('；'));
        }else if(memberEnergy.complexSkill)notes.push(`${memberEnergy.complexSkill.label}暂未计入：${memberEnergy.complexSkill.detail}`);
        if(memberEnergy.lostTriggers>.005)notes.push(`因未在换队前收取，期望损失 ${number(memberEnergy.lostTriggers,2)} 次已储存技能`);
        if(memberEnergy.exRule&&memberEnergy.exRule.label)notes.push(`${memberEnergy.exRule.label}规则已计入`);
        if(mon.specialty==='berry'&&member.fullHours<result.collectionHours)notes.push('树果手满仓后仍会偷偷吃树果，但食材与主技能抽选会停止');
        if(member.probability.provisional)notes.push('缺少物种食材概率，当前使用20%暂定值');
        if(notes.length)card.append(element('p','current-team-member-note',notes.join('；')+'。'));
        memberRoot.append(card);
      });
    }

    function renderSavedTeams(result){
      if(!savedListRoot||!saveTeamButton)return;
      const currentIds=selected.filter(Boolean),currentSaved=savedTeams.find(team=>sameLineup(team.members,currentIds));
      const canSave=result.selectedCount===5&&result.valid,atLimit=savedTeams.length>=MAX_SAVED_TEAMS&&!currentSaved;
      savedCountRoot.textContent=`${savedTeams.length}／${MAX_SAVED_TEAMS}`;
      saveTeamButton.disabled=!canSave||atLimit;
      saveTeamButton.textContent=currentSaved?'更新已保存队伍':'保存当前队伍';
      saveTeamButton.title=!canSave?'选满五只且符合特殊宝可梦规则后才能保存':atLimit?'已经保存10队，请先删除一队':'';
      savedListRoot.replaceChildren();
      if(!savedTeams.length){savedListRoot.append(element('div','current-team-saved-empty','还没有保存队伍。选满五只后点击“保存当前队伍”。'));return}
      savedTeams.forEach(team=>{
        const card=element('article',`current-team-saved-card${sameLineup(team.members,currentIds)?' active':''}`);
        const head=element('div','current-team-saved-card-head'),title=element('div','');
        title.append(element('strong','',team.name),element('small','',`${ENERGY_PROFILES[team.energyProfile]?.label||ENERGY_PROFILES.average.label} · ${team.goodCamp?'好露营券':'无露营券'}`));
        if(sameLineup(team.members,currentIds))head.append(title,element('span','current-team-saved-active','当前使用'));else head.append(title);
        const membersRoot=element('div','current-team-saved-members');
        team.members.forEach(id=>{const mon=mons.find(item=>item.id===id);membersRoot.append(element('span',mon&&mon.battleEligible===false?'collection-only':'',mon?`#${id} ${mon.name} Lv.${mon.lv}${mon.battleEligible===false?'［仅收藏］':''}`:`#${id}`))});
        const actions=element('div','current-team-saved-actions'),loadButton=element('button','current-team-saved-load','切换'),deleteButton=element('button','current-team-saved-delete',deleteArmedId===team.id?'确认删除':'删除');
        loadButton.type='button';deleteButton.type='button';loadButton.setAttribute('aria-label',`切换到${team.name}`);deleteButton.setAttribute('aria-label',`${deleteArmedId===team.id?'确认删除':'删除'}${team.name}`);
        loadButton.addEventListener('click',()=>{
          selected=[...team.members];campInput.checked=team.goodCamp;energyInput.value=team.energyProfile;deleteArmedId=null;saveSelection();render();showSaveMessage(`已切换到${team.name}。`);
        });
        deleteButton.addEventListener('click',()=>{
          if(deleteArmedId!==team.id){deleteArmedId=team.id;renderSavedTeams(result);showSaveMessage(`再次点击“确认删除”即可移除${team.name}。`,'warning');return}
          savedTeams=savedTeams.filter(item=>item.id!==team.id);deleteArmedId=null;const persisted=persistSavedTeams();render();showSaveMessage(persisted?`${team.name}已删除。`:`${team.name}已从本次会话移除；浏览器未开放本地存储。`,persisted?'success':'warning');
        });
        actions.append(loadButton,deleteButton);card.append(head,membersRoot,actions);savedListRoot.append(card);
      });
    }

    function appendMiniTeam(rootNode,title,candidate,actionLabel='应用这套队伍'){
      if(!candidate||!candidate.team||!candidate.team.length)return;
      const card=element('article','team-tool-team'),head=element('div','team-tool-team-head'),copy=element('div','');copy.append(element('strong','',title),element('small','',`${Math.round(candidate.result.energy.totalEnergy).toLocaleString('zh-CN')} 纯能量／${number(candidate.result.energy.durationHours,1)}小时`));head.append(copy);
      const apply=element('button','',actionLabel);apply.type='button';apply.addEventListener('click',()=>{selected=candidate.team.map(mon=>String(mon.id));saveSelection();render();showSaveMessage(`已应用“${title}”。`)});head.append(apply);card.append(head);
      const members=element('div','team-tool-members'),pickerController=pokemonPicker||globalThis.POKEMON_SLEEP_POKEMON_PICKER_CONTROLLER;candidate.team.forEach(mon=>{const item=element('span',''),label=element('b','',mon.nickname||mon.name);if(pickerController&&typeof pickerController.createIcon==='function')item.append(pickerController.createIcon(mon,{size:'small'}));item.append(label);members.append(item)});card.append(members);rootNode.append(card);
    }

    function renderScenario(){
      if(!scenarioRoot)return;scenarioRoot.replaceChildren();const team=selected.map(id=>mons.find(mon=>mon.id===id)).filter(Boolean);
      if(!team.length){scenarioRoot.append(element('p','team-tool-empty','先选择当前队伍，再进行推演。'));return}
      const report=calculateProjectedTeam(team,productionByBoxId,{...teamOptions(),targetLevel:scenarioLevel&&scenarioLevel.value||70,mainSeeds:scenarioSeeds&&scenarioSeeds.value||0,includeEvolution:scenarioEvolution&&scenarioEvolution.checked!==false,catalog,scoring,natureApi,investmentPlanner:investmentApi});
      if(!report.available){scenarioRoot.append(element('p','team-tool-empty','缺少图鉴或推演引擎资料，暂时无法计算。'));return}
      const card=element('article','team-scenario-summary'),energy=element('div','');energy.append(element('span','',`${number(report.current.energy.durationHours,1)}小时纯能量`),element('strong','',`${Math.round(report.current.energy.totalEnergy).toLocaleString('zh-CN')} → ${Math.round(report.projected.energy.totalEnergy).toLocaleString('zh-CN')}`),element('small','',`${report.energyChangePct>=0?'+':''}${number(report.energyChangePct,1)}%`));card.append(energy);
      const changes=element('div','team-scenario-members');report.members.forEach(row=>{const line=element('span','');line.textContent=row.ok?`#${row.mon.id} ${row.report.source.name} Lv.${row.report.before.level} → ${row.report.targetSpecies.name} Lv.${row.report.after.level} · 主技能 Lv.${row.report.mainSkill.current}→${row.report.mainSkill.target}`:`#${row.mon.id} ${row.mon.name}：资料不足，保持当前状态`;changes.append(line)});card.append(changes);scenarioRoot.append(card);
    }

    function renderSuggestions(){
      if(!suggestRoot)return;suggestRoot.replaceChildren();suggestRoot.append(element('p','team-tool-empty','正在组合盒内候选……'));
      setTimeout(()=>{const report=suggestEnergyTeams(mons,productionByBoxId,teamOptions());suggestRoot.replaceChildren();if(!report.burst){suggestRoot.append(element('p','team-tool-empty','盒内可上场个体不足五只。'));return}appendMiniTeam(suggestRoot,'岛屿纯能量',report.burst);if(report.stable&&report.stable.team.map(mon=>mon.id).join('|')!==report.burst.team.map(mon=>mon.id).join('|'))appendMiniTeam(suggestRoot,'保留全体治疗',report.stable);else if(report.stable)suggestRoot.append(element('p','team-tool-note','纯能量建议已经包含全体治疗，不再重复显示第二套。'));suggestRoot.append(element('p','team-tool-note',`从 ${report.poolSize} 只高产与队伍增益候选中验算 ${report.evaluated.toLocaleString('zh-CN')} 个组合；不会改写现有严选评分。`))},20);
    }

    function renderTasty(){
      if(!tastyRoot)return;tastyRoot.replaceChildren();const currentBonusPct=clamp(Math.round(tastyCurrent&&tastyCurrent.value),0,70),targetValue=Number(tastyTarget&&tastyTarget.value),targetBonusPct=clamp(Math.round(Number.isFinite(targetValue)?targetValue:70),currentBonusPct,70);if(tastyCurrent)tastyCurrent.value=String(currentBonusPct);if(tastyTarget)tastyTarget.value=String(targetBonusPct);const report=calculateTastyDeployment(mons,productionByBoxId,{...teamOptions(),currentBonusPct,targetBonusPct,isSunday:tastySunday&&tastySunday.checked,confidence:.8});
      const card=element('article','team-pot-summary'),headline=element('div',''),mealLabel=report.isSunday?'周日下一餐':'工作日／周六下一餐';headline.append(element('span','',`${mealLabel} · 当前 +${currentBonusPct}% → 目标 +${targetBonusPct}%`));
      if(currentBonusPct>=targetBonusPct)headline.append(element('strong','','已经达到目标'),element('small','',`当前不需要再上爆锅队；大成功率约 ${number(report.outcome&&report.outcome.critProbability*100,0)}%。`));
      else if(!report.reachable)headline.append(element('strong','','当前盒子无法计算'),element('small','','盒内没有可用的料理成功 S 个体，或在两周内达不到所选把握。'));
      else headline.append(element('strong','',`80% 把握约需 ${formatHours(report.estimate.safeHours)}`),element('small','',`达到目标的中位时间 ${formatHours(report.estimate.medianHours)}；届时该餐大成功率约 ${number(report.outcome.critProbability*100,0)}%，成功时料理为 ${report.outcome.critMultiplier} 倍。`));card.append(headline);
      if(report.tastyTeam.team.length){const candidate={team:report.tastyTeam.team,result:report.tastyTeam.result};appendMiniTeam(card,`爆锅队 · 期望 +${number(report.rate,1)}%／小时`,candidate,'应用爆锅队');const detail=element('p','team-tool-note',report.tastyTeam.output.members.map(member=>`${member.mon.nickname||member.mon.name}：Lv.${member.skillLevel} 每次 +${member.bonusPctPerTrigger}%，约 ${number(member.triggersPerHour,2)} 次/小时`).join('；'));card.append(detail)}
      card.append(element('p','team-tool-note','这里的“爆锅”只指料理成功 S 的大成功率蓄力；好露营券和料理强化 S 才会扩大锅容量。触发存在随机性，80% 时间不是必定完成。'));tastyRoot.append(card);
    }

    function saveCurrentTeam(){
      const team=selected.filter(Boolean),result=calculateTeam(team.map(id=>mons.find(mon=>mon.id===id)).filter(Boolean),productionByBoxId,teamOptions());
      if(result.selectedCount!==5){showSaveMessage('请先选满五只宝可梦。','warning');return}
      if(!result.valid){showSaveMessage(result.validation.message,'warning');return}
      const saved=upsertSavedTeam(savedTeams,team,{goodCamp:campInput.checked,energyProfile:energyInput.value});
      if(!saved.ok){showSaveMessage(saved.reason==='limit'?'最多只能保存10队，请先删除一队。':'当前队伍无法保存。','warning');return}
      savedTeams=saved.teams;deleteArmedId=null;const persisted=persistSavedTeams();render();
      const action=saved.created?'已保存':'已更新';showSaveMessage(persisted?`${action}${saved.team.name}。`:`${action}${saved.team.name}，但浏览器未开放本地存储，刷新后可能失效。`,persisted?'success':'warning');
    }

    function renderWarning(result){
      const messages=[];
      if(result.selectedCount<5)messages.push(`还可选择 ${5-result.selectedCount} 只；当前先按已选成员试算。`);
      if(!result.valid)messages.push(result.validation.message);
      else if(result.validation.exception)messages.push('已应用拉帝亚斯＋拉帝欧斯双特殊例外。');
      if(result.earliestBerry&&result.earliestBerry.fullHours<result.collectionHours)messages.push(`${result.earliestBerry.mon.name}约${formatHours(result.earliestBerry.fullHours)}先满仓，但它是树果手，因此不强制全队按它缩短收菜时间。`);
      if(result.overnightFull.length)messages.push(`夜间连续8小时预计会满仓：${result.overnightFull.map(member=>member.mon.name).join('、')}；睡前应先收一次。`);
      warning.textContent=messages.join(' ');
      warning.hidden=!messages.length;
      warning.classList.toggle('error',!result.valid);
    }

    function render(){
      const personal=profile&&typeof profile.getState==='function'?profile.getState():null,selectedIsland=personal&&personalSettings&&personalSettings.island?personalSettings.island(personal):null;syncExControls(selectedIsland);
      updatePickers();
      const team=selected.map(id=>mons.find(mon=>mon.id===id)).filter(Boolean);
      const result=calculateTeam(team,productionByBoxId,teamOptions());
      countRoot.textContent=`${result.selectedCount}／5`;
      renderWarning(result);renderSummary(result);renderMembers(result);renderSavedTeams(result);ingredientApi?.decorate(page);
      return result;
    }

    campInput.addEventListener('change',render);
    energyInput.addEventListener('change',render);
    durationInput?.addEventListener('input',()=>{saveEnergySettings();render()});
    durationInput?.addEventListener('change',()=>{durationInput.value=String(normalizeEnergySettings({durationHours:durationInput.value}).durationHours)});
    [startEnergyInput,sleepScoreInput,skillCollectionInput,swapCountInput,collectBeforeSwapInput,exEffect].filter(Boolean).forEach(input=>input.addEventListener('change',()=>{saveEnergySettings();render()}));
    [exMainBerry,exSubBerry1,exSubBerry2].filter(Boolean).forEach(input=>input.addEventListener('change',()=>{saveEnergySettings();render()}));
    saveTeamButton?.addEventListener('click',saveCurrentTeam);
    scenarioRun?.addEventListener('click',renderScenario);
    suggestRun?.addEventListener('click',renderSuggestions);
    tastyRun?.addEventListener('click',renderTasty);
    clearButton.addEventListener('click',()=>{selected=[];deleteArmedId=null;saveSelection();render()});
    drawerOpen?.addEventListener('click',()=>drawer.showModal?drawer.showModal():drawer.setAttribute('open',''));
    drawerClose?.addEventListener('click',()=>drawer.close?drawer.close():drawer.removeAttribute('open'));
    drawer?.addEventListener('click',event=>{if(event.target===drawer&&drawer.close)drawer.close()});
    globalThis.addEventListener?.('pokemon-sleep:personal-settings-change',event=>{if(['current-island','island-bonus'].includes(event.detail&&event.detail.type))render()});
    buildPickers();render();
    function refresh(){sortedMons=[...mons].sort((a,b)=>a.name.localeCompare(b.name,'zh-CN')||Number(b.lv)-Number(a.lv)||Number(a.id)-Number(b.id));buildPickers();return render()}
    return {render,refresh,renderScenario,renderSuggestions,renderTasty,getTeam:()=>selected.map(id=>mons.find(mon=>mon.id===id)).filter(Boolean),calculate:()=>calculateTeam(selected.map(id=>mons.find(mon=>mon.id===id)).filter(Boolean),productionByBoxId,teamOptions())};
  }

  return {ENERGY_PROFILES,ISLAND_PROFILES,DEFAULT_ENERGY_SETTINGS,SPECIAL_NAMES,MAX_SAVED_TEAMS,POT_SKILL_SLOTS,parseInterval,parseIngredientSlots,unlockedSubskills,ingredientProbability,skillProbability,normalizeEnergySettings,calculateEnergyBreakdown,validateSpecialTeam,validateBattleTeam,cleanMemberIds,sameLineup,normalizeSavedTeams,upsertSavedTeam,helpingSpeedReduction,helpingBonusOutputMultiplier,calculateMember,calculateTeam,isFullTeamHealer,suggestEnergyTeams,potSlotsPerTrigger,potOutputForResult,suggestPotTeam,calculatePotDeployment,tastyBonusPerTrigger,tastyOutputForResult,suggestTastyTeam,calculateTastyDeployment,projectPokemon,calculateProjectedTeam,formatHours,mount};
});
