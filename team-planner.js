(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.POKEMON_SLEEP_TEAM_PLANNER=api;
})(typeof window!=='undefined'?window:globalThis,function(){
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
      return {unlockLevel:unlocks[index]||60,name:match?match[1].trim():raw.trim(),quantity:match?Number(match[2]):0};
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

  function baseMemberModel(mon,production,options,helpingBonusCount){
    const baseIntervalSec=parseInterval(mon.interval);
    const energyFactor=Number(options.energyFactor)||2;
    const campSpeed=options.goodCamp?1.2:1;
    const ownSpeedReduction=helpingSpeedReduction(mon);
    const combinedSpeedReduction=clamp(ownSpeedReduction+helpingBonusCount*.05,0,.35);
    const teamSpeedFactor=(1-combinedSpeedReduction)/Math.max(1-ownSpeedReduction,.65);
    const teamSpeedReduction=1-teamSpeedFactor;
    const effectiveIntervalSec=baseIntervalSec*teamSpeedFactor/(campSpeed*energyFactor);
    const carryBase=Number(mon.inv)||0;
    const carry=options.goodCamp?Math.ceil(carryBase*1.2):carryBase;
    const ingredients=parseIngredientSlots(mon.ingredients,mon.lv);
    const probability=ingredientProbability(mon,production);
    const unlockedCount=Math.max(ingredients.unlocked.length,1);
    const averageIngredientQuantity=ingredients.unlocked.length?sum(ingredients.unlocked.map(slot=>slot.quantity))/unlockedCount:0;
    const berryFinding=unlockedSubskills(mon).includes('树果数量S')?1:0;
    const catalogBerryCount=production&&production.baseBerryCount!==undefined?production.baseBerryCount:mon&&mon.baseBerryCount;
    const baseBerryCount=Number(catalogBerryCount)||1;
    const berryCount=baseBerryCount+berryFinding;
    const expectedItemsPerHelp=(1-probability.current)*berryCount+probability.current*averageIngredientQuantity;
    const helpsPerDay=86400/effectiveIntervalSec;
    const fullHours=carry>0&&expectedItemsPerHelp>0?carry/expectedItemsPerHelp*effectiveIntervalSec/3600:Infinity;
    const ingredientPerHelp=ingredients.unlocked.map(slot=>({
      ...slot,
      expected:probability.current*slot.quantity/unlockedCount
    }));
    return {
      mon,production,ingredients,probability,baseIntervalSec,effectiveIntervalSec,carryBase,carry,
      berryCount,berryFinding,expectedItemsPerHelp,helpsPerDay,fullHours,ingredientPerHelp,
      helpingBonusCount,ownSpeedReduction,combinedSpeedReduction,teamSpeedReduction
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

  function calculateTeam(team,productionByBoxId,options={}){
    const selectedTeam=team.filter(Boolean);
    const validation=validateBattleTeam(selectedTeam);
    const cleanTeam=selectedTeam.filter(mon=>mon.battleEligible!==false);
    const energyProfile=ENERGY_PROFILES[options.energyProfile]||ENERGY_PROFILES.average;
    const resolvedOptions={goodCamp:options.goodCamp!==false,energyFactor:energyProfile.factor,energyProfile:options.energyProfile||'average'};
    const helpingBonusCount=cleanTeam.filter(mon=>unlockedSubskills(mon).includes('帮手奖励')).length;
    const baseMembers=cleanTeam.map(mon=>baseMemberModel(mon,productionByBoxId&&productionByBoxId[mon.id],resolvedOptions,helpingBonusCount));
    const collectionHours=recommendedCollectionHours(baseMembers);
    const members=baseMembers.map(member=>addCollectionModel(member,collectionHours));
    const ingredientTotals=new Map();
    members.forEach(member=>member.ingredients.forEach(slot=>{
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
      members,
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

  function mount({pokemon,production,onChange}={}){
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
    const clearButton=document.querySelector('#currentTeamClear');
    const saveTeamButton=document.querySelector('#currentTeamSave');
    const savedCountRoot=document.querySelector('#currentTeamSavedCount');
    const savedListRoot=document.querySelector('#currentTeamSavedList');
    const saveMessageRoot=document.querySelector('#currentTeamSaveMessage');
    const ingredientApi=typeof globalThis!=='undefined'?globalThis.POKEMON_SLEEP_INGREDIENTS:null;
    const storageKey='pokemon-sleep-current-team-v1';
    const savedStorageKey='pokemon-sleep-saved-teams-v1';
    let sortedMons=[...mons].sort((a,b)=>a.name.localeCompare(b.name,'zh-CN')||Number(b.lv)-Number(a.lv)||Number(a.id)-Number(b.id));
    let selected=loadSelection();
    let savedTeams=loadSavedTeams(),deleteArmedId=null,saveMessageTimer=null;
    const selects=[];

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

    function optionLabel(mon){
      const lv10=String(mon.effectiveSubs||mon.subs||'').split('；')[0]||'—';
      return `${mon.name}｜Lv.${mon.lv}｜Lv.10 ${lv10}${mon.shiny==='是'?'｜★闪光':''}${SPECIAL_NAMES.has(mon.name)?'｜特殊':''}${mon.battleEligible===false?'｜仅收藏':''}`;
    }

    function buildPickers(){
      selects.length=0;
      picker.replaceChildren();
      for(let index=0;index<5;index++){
        const card=element('div','current-team-pick');
        const label=element('label','current-team-pick-label',`位置 ${index+1}`);
        const select=document.createElement('select');
        select.setAttribute('aria-label',`当前队伍位置 ${index+1}`);
        const empty=document.createElement('option');empty.value='';empty.textContent='选择宝可梦';select.append(empty);
        const optionMons=[...sortedMons];
        optionMons.forEach(mon=>{const option=document.createElement('option');option.value=mon.id;option.textContent=optionLabel(mon);option.disabled=mon.battleEligible===false;select.append(option)});
        select.value=selected[index]||'';
        const detail=element('div','current-team-pick-detail','尚未选择');
        select.addEventListener('change',()=>{selected[index]=select.value;while(selected.length&&selected[selected.length-1]==='')selected.pop();saveSelection();render()});
        label.htmlFor=`currentTeamSlot${index+1}`;select.id=label.htmlFor;
        card.append(label,select,detail);picker.append(card);selects.push({select,detail});
      }
    }

    function updatePickers(){
      const chosen=selected.filter(Boolean);
      selects.forEach(({select,detail},index)=>{
        const own=selected[index]||'';
        [...select.options].forEach(option=>{option.disabled=Boolean(option.value&&option.value!==own&&chosen.includes(option.value))});
        select.value=own;
        const mon=mons.find(item=>item.id===own);
        if(!mon){detail.textContent='尚未选择';detail.className='current-team-pick-detail';return}
        const foods=parseIngredientSlots(mon.ingredients,mon.lv).unlocked.map(slot=>`${slot.name}×${slot.quantity}`).join('／')||'暂无食材栏';
        detail.textContent=(mon.battleEligible===false?'仅收藏 · 不参与计算 · ':'')+`${ROLE_LABELS[mon.specialty]||'待核对'} · 当前食材：${foods}`;
        detail.className=`current-team-pick-detail role-${mon.specialty||'unknown'}${mon.battleEligible===false?' collection-only':''}`;
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
        ['建议收菜',formatHours(result.collectionHours),limiting?`按${limiting.mon.name}预计${formatHours(limiting.fullHours)}满仓，预留约15%空间`:'等待完整队伍'],
        ['食材合计',`${number(totalPerDay,1)} 个／24h`,'按建议频率全天执行的常规帮忙期望'],
        ['帮手奖励',`${result.helpingBonusCount} 个已解锁`,result.helpingBonusCount?`名义缩短${result.helpingBonusCount*5}%；与自身速度副技能合计后遵守35%上限`:'当前没有全队速度加成'],
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
        const stats=element('div','current-team-member-stats');
        [[formatInterval(member.effectiveIntervalSec),'有效帮忙间隔'],[`${number(member.probability.current*100)}%`,'当前食材概率'],[`${member.carry}`,'模型持有上限'],[formatHours(member.fullHours),'预计满仓']].forEach(([value,label])=>{const item=element('div','');item.append(element('strong','',value),element('span','',label));stats.append(item)});card.append(stats);
        const foods=element('div','current-team-member-foods');
        member.ingredients.forEach(slot=>{const row=element('div','');row.append(element('strong','',slot.name),element('span','',`每次约 ${number(slot.perCollection)} · 24h约 ${number(slot.perDay)}`));foods.append(row)});
        if(!member.ingredients.length)foods.append(element('span','current-team-muted','暂无可统计食材'));
        card.append(foods);
        const notes=[];
        if(/食材获取|食材精选|十项全能|料理辅助/.test(mon.main))notes.push('主技能还可能带来额外食材，未并入上面的常规帮忙数量');
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
      const team=selected.filter(Boolean),result=calculateTeam(team.map(id=>mons.find(mon=>mon.id===id)).filter(Boolean),productionByBoxId,{goodCamp:campInput.checked,energyProfile:energyInput.value});
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
      const result=calculateTeam(team,productionByBoxId,{goodCamp:campInput.checked,energyProfile:energyInput.value});
      countRoot.textContent=`${result.selectedCount}／5`;
      renderWarning(result);renderSummary(result);renderMembers(result);renderSavedTeams(result);ingredientApi?.decorate(page);
      return result;
    }

    campInput.addEventListener('change',render);
    energyInput.addEventListener('change',render);
    saveTeamButton?.addEventListener('click',saveCurrentTeam);
    clearButton.addEventListener('click',()=>{selected=[];deleteArmedId=null;saveSelection();selects.forEach(({select})=>{select.value=''});render()});
    buildPickers();render();
    function refresh(){sortedMons=[...mons].sort((a,b)=>a.name.localeCompare(b.name,'zh-CN')||Number(b.lv)-Number(a.lv)||Number(a.id)-Number(b.id));buildPickers();return render()}
    return {render,refresh,calculate:()=>calculateTeam(selected.map(id=>mons.find(mon=>mon.id===id)).filter(Boolean),productionByBoxId,{goodCamp:campInput.checked,energyProfile:energyInput.value})};
  }

  return {ENERGY_PROFILES,SPECIAL_NAMES,MAX_SAVED_TEAMS,parseInterval,parseIngredientSlots,unlockedSubskills,ingredientProbability,validateSpecialTeam,validateBattleTeam,cleanMemberIds,sameLineup,normalizeSavedTeams,upsertSavedTeam,helpingSpeedReduction,calculateTeam,formatHours,mount};
});
