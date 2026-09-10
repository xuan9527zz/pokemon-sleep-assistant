(function(root,factory){
  'use strict';
  const ingredients=typeof module==='object'&&module.exports?require('./ingredients.js'):root.POKEMON_SLEEP_INGREDIENTS;
  const boxManager=typeof module==='object'&&module.exports?require('./box-manager.js'):root.POKEMON_SLEEP_BOX_MANAGER;
  const energyMechanics=typeof module==='object'&&module.exports?require('./snorlax-energy.js'):root.POKEMON_SLEEP_SNORLAX_ENERGY;
  const personalSettings=typeof module==='object'&&module.exports?require('./personal-settings.js'):root.POKEMON_SLEEP_PERSONAL_SETTINGS;
  const api=factory(ingredients,boxManager,energyMechanics,personalSettings);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.POKEMON_SLEEP_TEAM_PLANNER=api;
})(typeof window!=='undefined'?window:globalThis,function(ingredientCatalog,boxManager,energyMechanics,personalSettings){
  'use strict';

  const SUBSKILL_LEVELS=[10,25,50,70,80];
  const MAX_SAVED_TEAMS=10;
  const SPECIAL_NAMES=new Set(['梦幻','雷公','炎帝','水君','拉帝亚斯','拉帝欧斯','克雷色利亚','达克莱伊']);
  const ROLE_LABELS={berry:'树果手',ingredient:'食材手',skill:'技能手',all:'全能手',unknown:'待核对'};
  const ENERGY_PROFILES={
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
    all:Object.freeze({label:'自定义：当前队员全部命中',all:true,berries:Object.freeze([])})
  });
  const DEFAULT_ENERGY_SETTINGS=Object.freeze({durationHours:24,islandBonusPct:0,islandProfile:'none'});

  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const sum=values=>values.reduce((total,value)=>total+value,0);

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
    const pityCeiling=['skill','all'].includes(mon.specialty)?Math.ceil(144000/sourceInterval):78;
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

  function normalizeEnergySettings(options={}){
    return {
      durationHours:clamp(Number(options.durationHours)||DEFAULT_ENERGY_SETTINGS.durationHours,.5,168),
      islandBonusPct:clamp(Number(options.islandBonusPct)||0,0,200),
      islandProfile:Object.hasOwn(ISLAND_PROFILES,options.islandProfile)?options.islandProfile:DEFAULT_ENERGY_SETTINGS.islandProfile
    };
  }

  function calculateEnergyBreakdown(members,options={}){
    const settings=normalizeEnergySettings(options),profile=ISLAND_PROFILES[settings.islandProfile],durationSeconds=settings.durationHours*3600;
    const rows=(members||[]).map(member=>{
      const mon=member.mon||{},helps=durationSeconds/member.effectiveIntervalSec;
      const favorite=Boolean(profile.all||(mon.berry&&profile.berries.includes(mon.berry)));
      const berryStrength=energyMechanics&&energyMechanics.berryStrengthAtLevel(mon.berryId,Number(mon.lv));
      const berries=helps*(1-member.probability.current)*member.berryCount;
      const berryBaseEnergy=berryStrength?berries*berryStrength*(favorite?2:1):0;
      const berryEnergy=energyMechanics?energyMechanics.applyPercentageBonus(berryBaseEnergy,settings.islandBonusPct):Math.round(berryBaseEnergy);
      const modifier=member.eventModifier||memberModifier(options,mon),probability=applySkillTriggerMultiplier(skillProbability(mon),modifier.skillTriggerMultiplier),baseSkillLevel=boxManager&&typeof boxManager.effectiveMainSkillLevel==='function'?boxManager.effectiveMainSkillLevel(mon):Number(String(mon.main||'').match(/Lv\.(\d+)/)?.[1]||1),skillCap=boxManager&&typeof boxManager.mainSkillLevelCap==='function'?boxManager.mainSkillLevelCap(mon.main):Math.max(6,baseSkillLevel),skillLevel=Math.min(skillCap,baseSkillLevel+modifier.mainSkillLevelBonus);
      const skill=energyMechanics?energyMechanics.directEnergyPerUse(mon.main,mon.mainSkillId,skillLevel,settings.islandBonusPct):{supported:false,actualEnergy:0,baseEnergy:0};
      const triggers=skill.supported?helps*probability.effective:0,directSkillEnergy=Math.round(triggers*skill.actualEnergy);
      return {
        id:mon.id,name:mon.name,berryName:mon.berry||'待核对',favorite,helps,berries,berryStrength,
        berryBaseEnergy,berryEnergy,skillProbability:probability,skillLevel,baseSkillLevel,eventModifier:modifier,skill,triggers,directSkillEnergy,
        totalEnergy:berryEnergy+directSkillEnergy
      };
    });
    const berryEnergy=sum(rows.map(row=>row.berryEnergy)),directSkillEnergy=sum(rows.map(row=>row.directSkillEnergy)),totalEnergy=berryEnergy+directSkillEnergy;
    return {...settings,island:profile,berryEnergy,directSkillEnergy,totalEnergy,perHour:totalEnergy/settings.durationHours,members:rows,unsupportedSkillMembers:rows.filter(row=>!row.skill.supported&&/树果骤增|流星群|帮手加速|帮手支援|新月祈祷|治愈波动|挥指|模仿/.test(String((members.find(member=>member.mon.id===row.id)||{}).mon?.main||'')))};
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
    const ownSpeedReduction=helpingSpeedReduction(mon);
    const outputMultiplier=helpingBonusOutputMultiplier(mon,helpingBonusCount);
    const combinedSpeedReduction=clamp(ownSpeedReduction+helpingBonusCount*.05,0,.35);
    const teamSpeedFactor=1/outputMultiplier;
    const teamSpeedReduction=1-teamSpeedFactor;
    const effectiveIntervalSec=baseIntervalSec*teamSpeedFactor/(campSpeed*energyFactor);
    const carryBase=Number(mon.inv)||0;
    const carry=options.goodCamp?Math.ceil(carryBase*1.2):carryBase;
    const ingredients=parseIngredientSlots(mon.ingredients,mon.lv);
    const eventModifier=memberModifier(options,mon);
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
      mon,production,ingredients,probability,baseIntervalSec,effectiveIntervalSec,carryBase,carry,
      berryCount,berryFinding,expectedItemsPerHelp,helpsPerDay,fullHours,ingredientPerHelp,eventModifier,
      helpingBonusCount,ownSpeedReduction,combinedSpeedReduction,teamSpeedReduction,helpingBonusOutputMultiplier:outputMultiplier
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
    const energyProfile=ENERGY_PROFILES[options.energyProfile]||ENERGY_PROFILES.average;
    const teammateHelpingBonusCount=clamp(Math.round(Number(options.teammateHelpingBonusCount)||0),0,4);
    const ownHelpingBonus=unlockedSubskills(mon).includes('帮手奖励')?1:0;
    const helpingBonusCount=teammateHelpingBonusCount+ownHelpingBonus;
    const resolvedOptions={goodCamp:options.goodCamp!==false,energyFactor:energyProfile.factor,energyProfile:options.energyProfile||'average',memberModifier:options.memberModifier};
    const base=baseMemberModel(mon,production,resolvedOptions,helpingBonusCount);
    const requestedCollectionHours=Number(options.collectionHours);
    const collectionHours=Number.isFinite(requestedCollectionHours)
      ?clamp(requestedCollectionHours,.5,24)
      :recommendedCollectionHours([base]);
    const member=addCollectionModel(base,collectionHours);
    const energy=calculateEnergyBreakdown([member],options);
    const withEnergy={...member,snorlaxEnergy:energy.members[0]};
    return {valid:true,member:withEnergy,energy,energyProfile,options:resolvedOptions,teammateHelpingBonusCount,ownHelpingBonus,helpingBonusCount,collectionHours};
  }

  function calculateTeam(team,productionByBoxId,options={}){
    const selectedTeam=team.filter(Boolean);
    const validation=validateBattleTeam(selectedTeam);
    const cleanTeam=selectedTeam.filter(mon=>mon.battleEligible!==false);
    const energyProfile=ENERGY_PROFILES[options.energyProfile]||ENERGY_PROFILES.average;
    const resolvedOptions={goodCamp:options.goodCamp!==false,energyFactor:energyProfile.factor,energyProfile:options.energyProfile||'average',memberModifier:options.memberModifier};
    const helpingBonusCount=cleanTeam.filter(mon=>unlockedSubskills(mon).includes('帮手奖励')).length;
    const baseMembers=cleanTeam.map(mon=>baseMemberModel(mon,productionByBoxId&&productionByBoxId[mon.id],resolvedOptions,helpingBonusCount));
    const collectionHours=recommendedCollectionHours(baseMembers);
    const members=baseMembers.map(member=>addCollectionModel(member,collectionHours));
    const energy=calculateEnergyBreakdown(members,options);
    const membersWithEnergy=members.map((member,index)=>({...member,snorlaxEnergy:energy.members[index]}));
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

  function mount({pokemon,production,onChange,profile,picker:pokemonPicker,catalog}={}){
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
    const clearButton=document.querySelector('#currentTeamClear');
    const saveTeamButton=document.querySelector('#currentTeamSave');
    const savedCountRoot=document.querySelector('#currentTeamSavedCount');
    const savedListRoot=document.querySelector('#currentTeamSavedList');
    const saveMessageRoot=document.querySelector('#currentTeamSaveMessage');
    const drawer=document.querySelector('#currentTeamDrawer');
    const drawerOpen=document.querySelector('#currentTeamDrawerOpen');
    const drawerClose=document.querySelector('#currentTeamDrawerClose');
    const drawerSlots=document.querySelector('#currentTeamDrawerSlots');
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

    function teamOptions(){
      const personal=profile&&typeof profile.getState==='function'?profile.getState():personalSettings&&personalSettings.read?personalSettings.read():null;
      const selectedIsland=personal&&personalSettings&&personalSettings.island?personalSettings.island(personal):null;
      return {goodCamp:campInput.checked,energyProfile:energyInput.value,...energySettings,islandProfile:selectedIsland&&selectedIsland.teamProfile||energySettings.islandProfile||'none',islandBonusPct:personal&&personalSettings?personalSettings.islandBonus(personal):energySettings.islandBonusPct||0};
    }

    function saveEnergySettings(){
      energySettings=normalizeEnergySettings({
        durationHours:durationInput&&durationInput.value,
        islandProfile:energySettings.islandProfile,
        islandBonusPct:energySettings.islandBonusPct
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
      const cards=[
        [`${number(result.energy.durationHours,1)}小时纯能量`,`${Math.round(result.energy.totalEnergy).toLocaleString('zh-CN')}`,`每小时约 ${Math.round(result.energy.perHour).toLocaleString('zh-CN')}；不计食材能量`],
        ['常规树果',Math.round(result.energy.berryEnergy).toLocaleString('zh-CN'),`${result.energy.island.label} · 岛屿加成 +${number(result.energy.islandBonusPct,0)}%`],
        ['直接能量技能',Math.round(result.energy.directSkillEnergy).toLocaleString('zh-CN'),result.energy.directSkillEnergy?'按理论触发期望计算':'当前队员没有可直接折算的能量技能'],
        ['建议收菜',formatHours(result.collectionHours),limiting?`按${limiting.mon.name}预计${formatHours(limiting.fullHours)}满仓，预留约15%空间`:'等待完整队伍'],
        ['食材合计',`${number(totalPerDay,1)} 个／24h`,'按建议频率全天执行的常规帮忙期望'],
        ['帮手奖励',`${result.helpingBonusCount} 个已解锁`,result.helpingBonusCount?`每名成员按自身速度补正逐只重算；队内叠加${result.helpingBonusCount*5}%，与速度副技能合计遵守35%上限`:'当前没有全队速度加成'],
        ['计算状态',`${result.selectedCount}／5 人`,result.energyProfile.label+(result.options.goodCamp?'＋好露营券':'＋无露营券')]
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
        [[formatInterval(member.effectiveIntervalSec),'有效帮忙间隔'],[`${number(member.probability.current*100)}%`,'当前食材概率'],[`${member.carry}`,'模型持有上限'],[formatHours(member.fullHours),'预计满仓'],[Math.round(memberEnergy.totalEnergy).toLocaleString('zh-CN'),`${number(result.energy.durationHours,1)}小时纯能量`],[`${memberEnergy.berryName}${memberEnergy.favorite?' ×2':''}`,'当前树果']].forEach(([value,label])=>{const item=element('div','');item.append(element('strong','',value),element('span','',label));stats.append(item)});card.append(stats);
        const foods=element('div','current-team-member-foods');
        member.ingredients.forEach(slot=>{const row=element('div','');row.append(element('strong','',slot.name),element('span','',`每次约 ${number(slot.perCollection)} · 24h约 ${number(slot.perDay)}`));foods.append(row)});
        if(!member.ingredients.length)foods.append(element('span','current-team-muted','暂无可统计食材'));
        card.append(foods);
        const notes=[];
        if(/食材获取|食材精选|十项全能|料理辅助/.test(mon.main))notes.push('主技能还可能带来额外食材，未并入上面的常规帮忙数量');
        if(memberEnergy.skill.supported)notes.push(`直接能量技能按 Lv.${memberEnergy.skillLevel}、约${number(memberEnergy.triggers,2)}次触发计入 ${Math.round(memberEnergy.directSkillEnergy).toLocaleString('zh-CN')} 能量`);
        else if(/树果骤增|流星群|帮手加速|帮手支援|新月祈祷|治愈波动|挥指|模仿/.test(mon.main))notes.push('该主技能依赖完整队伍状态，本次纯能量暂未折算');
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
    saveTeamButton?.addEventListener('click',saveCurrentTeam);
    clearButton.addEventListener('click',()=>{selected=[];deleteArmedId=null;saveSelection();render()});
    drawerOpen?.addEventListener('click',()=>drawer.showModal?drawer.showModal():drawer.setAttribute('open',''));
    drawerClose?.addEventListener('click',()=>drawer.close?drawer.close():drawer.removeAttribute('open'));
    drawer?.addEventListener('click',event=>{if(event.target===drawer&&drawer.close)drawer.close()});
    globalThis.addEventListener?.('pokemon-sleep:personal-settings-change',event=>{if(['current-island','island-bonus'].includes(event.detail&&event.detail.type))render()});
    buildPickers();render();
    function refresh(){sortedMons=[...mons].sort((a,b)=>a.name.localeCompare(b.name,'zh-CN')||Number(b.lv)-Number(a.lv)||Number(a.id)-Number(b.id));buildPickers();return render()}
    return {render,refresh,calculate:()=>calculateTeam(selected.map(id=>mons.find(mon=>mon.id===id)).filter(Boolean),productionByBoxId,teamOptions())};
  }

  return {ENERGY_PROFILES,ISLAND_PROFILES,DEFAULT_ENERGY_SETTINGS,SPECIAL_NAMES,MAX_SAVED_TEAMS,parseInterval,parseIngredientSlots,unlockedSubskills,ingredientProbability,skillProbability,normalizeEnergySettings,calculateEnergyBreakdown,validateSpecialTeam,validateBattleTeam,cleanMemberIds,sameLineup,normalizeSavedTeams,upsertSavedTeam,helpingSpeedReduction,helpingBonusOutputMultiplier,calculateMember,calculateTeam,formatHours,mount};
});
