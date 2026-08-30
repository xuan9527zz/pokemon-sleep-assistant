(function(root,factory){
  'use strict';
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.POKEMON_SLEEP_BOX_MANAGER=api;
})(typeof window!=='undefined'?window:globalThis,function(root){
  'use strict';

  const STORAGE_KEY='pokemon-sleep-box-management-v1';
  const SUBSKILL_LEVELS=[10,25,50,70,80];
  const BOXES=Object.freeze([
    {id:'main',name:'实战主力',color:'#1d8b5b'},
    {id:'training',name:'培养候选',color:'#d8891c'},
    {id:'ingredient',name:'食材专用',color:'#278f83'},
    {id:'skill',name:'技能专用',color:'#3978c5'},
    {id:'special',name:'特殊宝可梦',color:'#7653bd'},
    {id:'shiny',name:'闪光收藏',color:'#c18812'},
    {id:'pending',name:'待筛选',color:'#687588'},
    {id:'retire',name:'放生候选',color:'#b34f58'}
  ]);
  const BOX_IDS=new Set(BOXES.map(function(box){return box.id}));
  const COLLECTION_BOXES=new Set(['shiny','retire']);
  const SPECIAL_NAMES=new Set(['梦幻','雷公','炎帝','水君','拉帝亚斯','拉帝欧斯','克雷色利亚','达克莱伊','超梦']);
  const UPGRADE_FAMILIES=Object.freeze([
    Object.freeze(['帮忙速度S','帮忙速度M']),
    Object.freeze(['食材概率S','食材概率M']),
    Object.freeze(['技能概率S','技能概率M']),
    Object.freeze(['技能等级S','技能等级M']),
    Object.freeze(['持有上限S','持有上限M','持有上限L'])
  ]);
  const NEXT_UPGRADE=new Map();
  UPGRADE_FAMILIES.forEach(function(family){
    family.slice(0,-1).forEach(function(skill,index){NEXT_UPGRADE.set(skill,family[index+1])});
  });

  function browserStorage(){
    try{return root&&root.localStorage||null}catch(_error){return null}
  }

  function readJson(storage,key,fallback){
    try{
      const raw=storage&&storage.getItem(key);
      return raw?JSON.parse(raw):fallback;
    }catch(_error){return fallback}
  }

  function writeJson(storage,key,value){
    try{storage.setItem(key,JSON.stringify(value));return true}catch(_error){return false}
  }

  function splitSubskills(value){
    const skills=String(value||'').split('；').slice(0,5);
    while(skills.length<5)skills.push('—');
    return skills;
  }

  function familyFor(skill){
    return UPGRADE_FAMILIES.find(function(family){return family.includes(skill)})||null;
  }

  function defaultBoxId(mon){
    const priority=String(mon&&mon.priority||'');
    const name=String(mon&&mon.name||'');
    if(priority==='闪光收藏')return 'shiny';
    if(SPECIAL_NAMES.has(name))return 'special';
    if(['重点培养','继续使用','即时战力','闪光且可用'].includes(priority))return 'main';
    if(priority==='未来可期')return 'training';
    return 'pending';
  }

  function defaultBattleEligible(mon,boxId){
    return !(String(mon&&mon.priority||'')==='闪光收藏'||COLLECTION_BOXES.has(boxId));
  }

  function normalizeBoxNames(value){
    const source=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    const result={};
    BOXES.forEach(function(box){
      const raw=source[box.id];
      const candidate=raw&&typeof raw==='object'?raw.name:raw;
      result[box.id]={
        name:typeof candidate==='string'&&candidate.trim()?candidate.trim().slice(0,12):box.name,
        color:box.color
      };
    });
    return result;
  }

  function normalizeUpgrades(mon,value){
    const base=splitSubskills(mon&&mon.subs);
    const source=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    const targets={};
    Object.entries(source).forEach(function(entry){
      const index=Number(entry[0]),target=String(entry[1]||'');
      if(!Number.isInteger(index)||index<0||index>=base.length)return;
      const family=familyFor(base[index]);
      if(!family)return;
      const baseRank=family.indexOf(base[index]),targetRank=family.indexOf(target);
      if(targetRank>baseRank)targets[index]=target;
    });

    const effective=base.slice();
    const pending=new Set(Object.keys(targets).map(Number));
    let progressed=true;
    while(pending.size&&progressed){
      progressed=false;
      Array.from(pending).sort(function(a,b){
        const familyA=familyFor(effective[a]),familyB=familyFor(effective[b]);
        return (familyB?familyB.indexOf(targets[b]):-1)-(familyA?familyA.indexOf(targets[a]):-1);
      }).forEach(function(index){
        const family=familyFor(effective[index]);
        if(!family){pending.delete(index);return}
        const currentRank=family.indexOf(effective[index]),targetRank=family.indexOf(targets[index]);
        if(currentRank>=targetRank){pending.delete(index);return}
        const next=family[currentRank+1];
        if(effective.some(function(skill,otherIndex){return otherIndex!==index&&skill===next}))return;
        effective[index]=next;
        progressed=true;
        if(next===targets[index])pending.delete(index);
      });
    }

    const result={};
    effective.forEach(function(skill,index){
      if(skill!==base[index])result[String(index)]=skill;
    });
    return result;
  }

  function normalizeRecord(mon,value){
    const source=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    const boxId=BOX_IDS.has(source.boxId)?source.boxId:defaultBoxId(mon);
    return {
      boxId:boxId,
      battleEligible:typeof source.battleEligible==='boolean'?source.battleEligible:defaultBattleEligible(mon,boxId),
      upgrades:normalizeUpgrades(mon,source.upgrades),
      updatedAt:typeof source.updatedAt==='string'?source.updatedAt:''
    };
  }

  function normalizeState(value,pokemon){
    const source=value&&typeof value==='object'&&!Array.isArray(value)?value:{};
    const mons=Array.isArray(pokemon)?pokemon:[];
    const records=source.pokemon&&typeof source.pokemon==='object'&&!Array.isArray(source.pokemon)?source.pokemon:{};
    const normalized={version:1,boxes:normalizeBoxNames(source.boxes),pokemon:{}};
    mons.forEach(function(mon){normalized.pokemon[String(mon.id)]=normalizeRecord(mon,records[String(mon.id)])});
    return normalized;
  }

  function boxList(state){
    const names=normalizeBoxNames(state&&state.boxes);
    return BOXES.map(function(box){return {id:box.id,name:names[box.id].name,color:box.color}});
  }

  function setHidden(target,key,value){
    const descriptor=Object.getOwnPropertyDescriptor(target,key);
    if(descriptor&&descriptor.writable){target[key]=value;return}
    Object.defineProperty(target,key,{value:value,writable:true,configurable:true,enumerable:false});
  }

  function applyRecord(mon,record,boxes){
    const normalized=normalizeRecord(mon,record),names=normalizeBoxNames(boxes);
    const base=splitSubskills(mon.subs),effective=base.map(function(skill,index){
      return normalized.upgrades[String(index)]||skill;
    });
    setHidden(mon,'boxId',normalized.boxId);
    setHidden(mon,'boxName',names[normalized.boxId].name);
    setHidden(mon,'battleEligible',normalized.battleEligible);
    setHidden(mon,'subskillUpgrades',Object.assign({},normalized.upgrades));
    setHidden(mon,'effectiveSubs',effective.join('；'));
    setHidden(mon,'managementUpdatedAt',normalized.updatedAt);
    return normalized;
  }

  function applyState(pokemon,state){
    const mons=Array.isArray(pokemon)?pokemon:[],normalized=normalizeState(state,mons);
    mons.forEach(function(mon){applyRecord(mon,normalized.pokemon[String(mon.id)],normalized.boxes)});
    return normalized;
  }

  function applyStored(pokemon,storage){
    const resolved=storage===undefined?browserStorage():storage;
    const state=applyState(pokemon,readJson(resolved,STORAGE_KEY,{}));
    return {state:state,storageAvailable:Boolean(resolved)};
  }

  function effectiveSubskills(mon){
    return splitSubskills(mon&&mon.effectiveSubs||mon&&mon.subs);
  }

  function unlockedSubskills(mon,level){
    const safe=Number(level===undefined?mon&&mon.lv:level);
    return effectiveSubskills(mon).filter(function(skill,index){
      return skill&&skill!=='—'&&(SUBSKILL_LEVELS[index]||80)<=safe;
    });
  }

  function upgradeInfo(mon,record,index,level){
    const slot=Number(index),safeLevel=Number(level===undefined?mon&&mon.lv:level);
    const normalized=normalizeRecord(mon,record),skills=splitSubskills(mon.subs).map(function(skill,slotIndex){
      return normalized.upgrades[String(slotIndex)]||skill;
    });
    const current=skills[slot]||'—',target=NEXT_UPGRADE.get(current),unlock=SUBSKILL_LEVELS[slot]||80;
    if(!target)return {allowed:false,current:current,target:null,unlockLevel:unlock,reason:'已是该系列最高等级或不能使用副技能种子'};
    if(safeLevel<unlock)return {allowed:false,current:current,target:target,unlockLevel:unlock,reason:'Lv.'+unlock+' 尚未解锁，游戏内不能对该栏使用种子'};
    const conflictIndex=skills.findIndex(function(skill,otherIndex){return otherIndex!==slot&&skill===target});
    if(conflictIndex>=0)return {allowed:false,current:current,target:target,unlockLevel:unlock,conflictIndex:conflictIndex,reason:'已有'+target+'（Lv.'+(SUBSKILL_LEVELS[conflictIndex]||80)+'），不能生成重复副技能'};
    return {allowed:true,current:current,target:target,unlockLevel:unlock,reason:'可记录 '+current+'→'+target};
  }

  function upgradeRecord(mon,record,index,level){
    const info=upgradeInfo(mon,record,index,level);
    if(!info.allowed)return {ok:false,info:info,record:normalizeRecord(mon,record)};
    const next=normalizeRecord(mon,record);
    next.upgrades[String(index)]=info.target;
    next.upgrades=normalizeUpgrades(mon,next.upgrades);
    return {ok:true,info:info,record:next};
  }

  function downgradeInfo(mon,record,index){
    const slot=Number(index),normalized=normalizeRecord(mon,record),base=splitSubskills(mon.subs),skills=base.map(function(skill,slotIndex){
      return normalized.upgrades[String(slotIndex)]||skill;
    });
    const current=skills[slot]||'—';
    if(current===base[slot])return {allowed:false,current:current,target:null,reason:'没有已记录的升级'};
    const family=familyFor(current),rank=family?family.indexOf(current):-1,target=rank>0?family[rank-1]:base[slot];
    const conflictIndex=skills.findIndex(function(skill,otherIndex){return otherIndex!==slot&&skill===target});
    if(conflictIndex>=0)return {allowed:false,current:current,target:target,conflictIndex:conflictIndex,reason:'先回退占用'+target+'的另一栏记录'};
    return {allowed:true,current:current,target:target,reason:'回退网站记录 '+current+'→'+target};
  }

  function downgradeRecord(mon,record,index){
    const info=downgradeInfo(mon,record,index);
    if(!info.allowed)return {ok:false,info:info,record:normalizeRecord(mon,record)};
    const next=normalizeRecord(mon,record),base=splitSubskills(mon.subs);
    if(info.target===base[Number(index)])delete next.upgrades[String(index)];
    else next.upgrades[String(index)]=info.target;
    next.upgrades=normalizeUpgrades(mon,next.upgrades);
    return {ok:true,info:info,record:next};
  }

  function skillLevelBonus(skills,level){
    const safe=Number(level);
    return splitSubskills(skills).reduce(function(total,skill,index){
      if((SUBSKILL_LEVELS[index]||80)>safe)return total;
      return total+(skill==='技能等级M'?2:skill==='技能等级S'?1:0);
    },0);
  }

  function mainSkillLevelCap(main){
    const label=String(main||'');
    if(/梦之碎片获取S|波导弹|十项全能/.test(label))return 8;
    if(/帮手支援S|能量填充[SM]|蓄力|噩梦|食材获取S|食材精选S|料理强化S|料理辅助S/.test(label))return 7;
    return 6;
  }

  function effectiveMainSkillLevel(mon){
    const base=Number(String(mon&&mon.main||'').match(/Lv\.(\d+)/)?.[1]||1);
    const level=Number(mon&&mon.lv)||1;
    const original=skillLevelBonus(mon&&mon.subs,level);
    const actual=skillLevelBonus(mon&&mon.effectiveSubs||mon&&mon.subs,level);
    return Math.max(1,Math.min(mainSkillLevelCap(mon&&mon.main),base+actual-original));
  }

  function element(tag,className,text){
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  }

  function mount(options){
    options=options||{};
    if(typeof document==='undefined')return null;
    const mons=Array.isArray(options.pokemon)?options.pokemon:[];
    const byId=new Map(mons.map(function(mon){return [String(mon.id),mon]}));
    const storage=browserStorage();
    let state=applyState(mons,options.initialState&&options.initialState.state||options.initialState||readJson(storage,STORAGE_KEY,{}));
    let activeBox='main',selected=new Set(),focusedId=null,messageTimer=null;

    const openButton=document.querySelector('#boxManagerOpen');
    const statusRoot=document.querySelector('#boxManagerToolbarStatus');
    const dialog=document.querySelector('#boxManagerDialog');
    const closeButton=document.querySelector('#boxManagerClose');
    const tabsRoot=document.querySelector('#boxManagerTabs');
    const searchInput=document.querySelector('#boxManagerSearch');
    const eligibilityInput=document.querySelector('#boxManagerEligibility');
    const selectVisibleButton=document.querySelector('#boxManagerSelectVisible');
    const shownRoot=document.querySelector('#boxManagerShown');
    const selectedRoot=document.querySelector('#boxManagerSelected');
    const renameInput=document.querySelector('#boxManagerRename');
    const renameButton=document.querySelector('#boxManagerRenameApply');
    const gridRoot=document.querySelector('#boxManagerGrid');
    const inspectorRoot=document.querySelector('#boxManagerInspector');
    const destinationInput=document.querySelector('#boxManagerDestination');
    const moveButton=document.querySelector('#boxManagerMove');
    const enableButton=document.querySelector('#boxManagerEnable');
    const disableButton=document.querySelector('#boxManagerDisable');
    const clearButton=document.querySelector('#boxManagerClearSelection');
    const messageRoot=document.querySelector('#boxManagerMessage');
    if(!openButton||!dialog||!gridRoot||!inspectorRoot)return null;

    function recordFor(id){return state.pokemon[String(id)]}
    function monFor(id){return byId.get(String(id))}
    function persist(){
      const ok=writeJson(storage,STORAGE_KEY,state);
      updateToolbar(ok?'':'浏览器未开放本地存储，本次修改刷新后可能失效',!ok);
      return ok;
    }
    function notifyChanges(changes){
      if(typeof options.onChange==='function')options.onChange(changes,{state:state});
    }
    function applyIds(ids){
      ids.forEach(function(id){
        const mon=monFor(id);
        if(mon)state.pokemon[String(id)]=applyRecord(mon,state.pokemon[String(id)],state.boxes);
      });
    }
    function showMessage(text,type){
      messageRoot.textContent=text;
      messageRoot.className='box-manager-message '+(type||'success');
      messageRoot.hidden=false;
      if(messageTimer)clearTimeout(messageTimer);
      messageTimer=setTimeout(function(){messageRoot.hidden=true},4200);
    }
    function boxCounts(){
      const counts=Object.fromEntries(BOXES.map(function(box){return [box.id,0]}));
      mons.forEach(function(mon){counts[recordFor(mon.id).boxId]++});
      return counts;
    }
    function updateToolbar(message,warning){
      const battle=mons.filter(function(mon){return recordFor(mon.id).battleEligible}).length;
      const collection=mons.length-battle;
      statusRoot.textContent=message||battle+' 只参与实战 · '+collection+' 只仅收藏';
      statusRoot.classList.toggle('warning',Boolean(warning));
    }
    function visibleMons(){
      const query=searchInput.value.trim().toLowerCase(),mode=eligibilityInput.value;
      return mons.filter(function(mon){
        const record=recordFor(mon.id);
        if(record.boxId!==activeBox)return false;
        if(mode==='battle'&&!record.battleEligible)return false;
        if(mode==='collection'&&record.battleEligible)return false;
        const lv10=effectiveSubskills(mon)[0]||'—';
        return !query||['#'+mon.id,mon.id,mon.name,mon.shiny,mon.priority,lv10].join(' ').toLowerCase().includes(query);
      }).sort(function(a,b){return Number(a.id)-Number(b.id)});
    }
    function renderTabs(){
      const counts=boxCounts();
      tabsRoot.replaceChildren();
      boxList(state).forEach(function(box){
        const button=element('button','box-manager-tab'+(box.id===activeBox?' active':''));
        button.type='button';
        button.style.setProperty('--box-color',box.color);
        button.setAttribute('aria-selected',box.id===activeBox?'true':'false');
        button.append(element('span','box-manager-tab-dot'),element('strong','',box.name),element('small','',String(counts[box.id])));
        button.addEventListener('click',function(){activeBox=box.id;selected.clear();focusedId=null;renderAll()});
        tabsRoot.append(button);
      });
      const current=boxList(state).find(function(box){return box.id===activeBox});
      renameInput.value=current?current.name:'';
      destinationInput.replaceChildren();
      boxList(state).forEach(function(box){
        const option=document.createElement('option');
        option.value=box.id;option.textContent=box.name;destinationInput.append(option);
      });
      destinationInput.value=activeBox;
    }
    function toggleSelected(id){
      const key=String(id);
      if(selected.has(key)){selected.delete(key);if(focusedId===key)focusedId=selected.size===1?Array.from(selected)[0]:null}
      else{selected.add(key);focusedId=key}
      renderGrid();renderInspector();updateActions();
    }
    function renderGrid(){
      const rows=visibleMons();
      gridRoot.replaceChildren();
      rows.forEach(function(mon){
        const record=recordFor(mon.id),pressed=selected.has(mon.id),card=element('button','box-manager-card'+(pressed?' selected':'')+(!record.battleEligible?' collection-only':''));
        card.type='button';card.setAttribute('aria-pressed',pressed?'true':'false');
        card.addEventListener('click',function(){toggleSelected(mon.id)});
        const head=element('span','box-manager-card-head');
        head.append(element('span','box-manager-card-number','#'+mon.id),element('span','box-manager-card-check',pressed?'✓':''));
        const name=element('strong','',mon.name);
        const badges=element('span','box-manager-card-badges');
        if(mon.shiny==='是')badges.append(element('span','shiny','★ 闪光'));
        badges.append(element('span',record.battleEligible?'box-manager-battle':'box-manager-collection',record.battleEligible?'参与实战':'仅收藏'));
        const lv10=effectiveSubskills(mon)[0]||'—';
        const upgrade=record.upgrades['0']?'（原 '+splitSubskills(mon.subs)[0]+'）':'';
        card.append(head,name,badges,element('small','',('Lv.'+mon.lv+' · '+(mon.specialtyLabel||'待分类'))),element('small','box-manager-card-skill','Lv.10 '+lv10+upgrade));
        gridRoot.append(card);
      });
      if(!rows.length)gridRoot.append(element('div','box-manager-empty','当前盒子和筛选条件下没有宝可梦。'));
      shownRoot.textContent='显示 '+rows.length+' 只';
      selectedRoot.textContent='已选 '+selected.size+' 只';
      selectVisibleButton.textContent=rows.length&&rows.every(function(mon){return selected.has(mon.id)})?'取消选择当前结果':'选择当前结果';
    }
    function renderInspectorEmpty(text){
      inspectorRoot.replaceChildren(element('div','box-manager-inspector-empty',text));
    }
    function renderSubskillEditor(mon,record){
      const rootNode=element('div','box-manager-subskills');
      splitSubskills(mon.subs).forEach(function(baseSkill,index){
        const effective=effectiveSubskills(mon)[index],unlock=SUBSKILL_LEVELS[index]||80,row=element('article','box-manager-subskill-row'+(Number(mon.lv)<unlock?' locked':''));
        const copy=element('div','box-manager-subskill-copy');
        copy.append(element('span','box-manager-subskill-level','Lv.'+unlock),element('strong','',effective));
        if(effective!==baseSkill)copy.append(element('small','',('原始 '+baseSkill+' · 已记录升级')));
        else copy.append(element('small','',Number(mon.lv)>=unlock?'当前已解锁':'尚未解锁'));
        const actions=element('div','box-manager-subskill-actions'),up=upgradeInfo(mon,record,index,mon.lv);
        if(up.target){
          const button=element('button','',up.allowed?('记录 '+up.current+'→'+up.target):'不可升级');
          button.type='button';button.disabled=!up.allowed;button.title=up.reason;
          button.addEventListener('click',function(){
            const result=upgradeRecord(mon,record,index,mon.lv);
            if(!result.ok){showMessage(result.info.reason,'warning');return}
            result.record.updatedAt=new Date().toISOString();state.pokemon[mon.id]=result.record;applyIds([mon.id]);persist();notifyChanges([{id:mon.id,type:'subskill',slot:index,before:result.info.current,after:result.info.target}]);showMessage(mon.name+'的Lv.'+unlock+'副技能已记录为'+result.info.target+'。');renderAll();
          });
          actions.append(button);
        }
        const down=downgradeInfo(mon,record,index);
        if(effective!==baseSkill){
          const revert=element('button','secondary',down.allowed?'回退记录':'暂不可回退');
          revert.type='button';revert.disabled=!down.allowed;revert.title=down.reason;
          revert.addEventListener('click',function(){
            const result=downgradeRecord(mon,record,index);
            if(!result.ok){showMessage(result.info.reason,'warning');return}
            result.record.updatedAt=new Date().toISOString();state.pokemon[mon.id]=result.record;applyIds([mon.id]);persist();notifyChanges([{id:mon.id,type:'subskill',slot:index,before:result.info.current,after:result.info.target}]);showMessage('已回退'+mon.name+'的网页升级记录；这不会在游戏内执行降级。');renderAll();
          });
          actions.append(revert);
        }
        if(!actions.children.length)actions.append(element('span','box-manager-subskill-blocked',up.reason));
        row.append(copy,actions);rootNode.append(row);
      });
      return rootNode;
    }
    function renderInspector(){
      if(!selected.size){renderInspectorEmpty('选择一只宝可梦后，可编辑实际副技能升级；多选则可批量移动盒子或切换实战资格。');return}
      if(selected.size>1){renderInspectorEmpty('已选择 '+selected.size+' 只。使用底部操作批量移动，或设为“参与实战／仅收藏”。');return}
      const id=focusedId||Array.from(selected)[0],mon=monFor(id),record=recordFor(id);
      if(!mon){renderInspectorEmpty('没有找到所选宝可梦。');return}
      const head=element('div','box-manager-inspector-head');
      const title=element('div','');title.append(element('span','box-manager-inspector-kicker','#'+mon.id+' · Lv.'+mon.lv),element('h3','',mon.name),element('p','',record.battleEligible?'会进入自动组队、食材推荐与当前队伍选择。':'仅作收藏显示，不进入任何自动实战计算。'));
      const headActions=element('div','box-manager-inspector-head-actions'),back=element('button','box-manager-mobile-back','返回盒子');back.type='button';back.addEventListener('click',function(){selected.clear();focusedId=null;renderAll()});headActions.append(element('span',record.battleEligible?'box-manager-battle':'box-manager-collection',record.battleEligible?'参与实战':'仅收藏'),back);head.append(title,headActions);
      const note=element('p','box-manager-seed-note','这里记录游戏中已经发生的升级，不改变Lv.70潜力评分。若同时有多个可升级的已解锁栏位，游戏实际使用种子时会随机抽选；本页不会模拟定向使用。');
      inspectorRoot.replaceChildren(head,note,renderSubskillEditor(mon,record));
    }
    function updateActions(){
      const disabled=!selected.size;
      moveButton.disabled=disabled;enableButton.disabled=disabled;disableButton.disabled=disabled;clearButton.disabled=disabled;
      dialog.classList.toggle('single-selection',selected.size===1);
      dialog.classList.toggle('multi-selection',selected.size>1);
    }
    function renderAll(){renderTabs();renderGrid();renderInspector();updateActions();updateToolbar()}
    function showDialog(){
      if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal()}else dialog.setAttribute('open','');
    }
    function closeDialog(){
      selected.clear();focusedId=null;
      dialog.classList.remove('single-selection','multi-selection');
      if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open');
    }
    function openBulk(){
      const first=boxList(state).find(function(box){return mons.some(function(mon){return recordFor(mon.id).boxId===box.id})});
      activeBox=first?first.id:'main';selected.clear();focusedId=null;searchInput.value='';eligibilityInput.value='all';renderAll();showDialog();
    }
    function openFor(id){
      const mon=monFor(id);if(!mon)return false;
      activeBox=recordFor(mon.id).boxId;selected=new Set([mon.id]);focusedId=mon.id;searchInput.value='';eligibilityInput.value='all';renderAll();showDialog();return true;
    }
    function changeEligibility(value){
      if(!selected.size)return;
      const ids=Array.from(selected),now=new Date().toISOString();
      ids.forEach(function(id){state.pokemon[id].battleEligible=value;state.pokemon[id].updatedAt=now});
      applyIds(ids);persist();notifyChanges(ids.map(function(id){return {id:id,type:'eligibility',after:value}}));
      showMessage(ids.length+'只宝可梦已设为'+(value?'参与实战。':'仅收藏；自动队伍会立即避开它们。'));renderAll();
    }
    function moveSelected(){
      if(!selected.size)return;
      const target=destinationInput.value,ids=Array.from(selected),now=new Date().toISOString(),autoCollection=COLLECTION_BOXES.has(target);
      ids.forEach(function(id){
        state.pokemon[id].boxId=target;
        if(autoCollection)state.pokemon[id].battleEligible=false;
        state.pokemon[id].updatedAt=now;
      });
      applyIds(ids);persist();notifyChanges(ids.map(function(id){return {id:id,type:'box',after:target,battleEligible:state.pokemon[id].battleEligible}}));
      selected.clear();focusedId=null;activeBox=target;
      showMessage(ids.length+'只宝可梦已移动到“'+state.boxes[target].name+'”'+(autoCollection?'，并设为仅收藏。':'。'));renderAll();
    }

    openButton.addEventListener('click',openBulk);
    closeButton.addEventListener('click',closeDialog);
    searchInput.addEventListener('input',function(){renderGrid();updateActions()});
    eligibilityInput.addEventListener('change',function(){renderGrid();updateActions()});
    selectVisibleButton.addEventListener('click',function(){
      const rows=visibleMons(),allSelected=rows.length&&rows.every(function(mon){return selected.has(mon.id)});
      rows.forEach(function(mon){if(allSelected)selected.delete(mon.id);else selected.add(mon.id)});
      focusedId=selected.size===1?Array.from(selected)[0]:null;renderGrid();renderInspector();updateActions();
    });
    renameButton.addEventListener('click',function(){
      const name=renameInput.value.trim().slice(0,12);
      if(!name){showMessage('盒子名称不能为空。','warning');return}
      state.boxes[activeBox].name=name;applyIds(mons.map(function(mon){return mon.id}));persist();notifyChanges([{type:'box-name',boxId:activeBox,after:name}]);showMessage('当前盒子已重命名为“'+name+'”。');renderAll();
    });
    moveButton.addEventListener('click',moveSelected);
    enableButton.addEventListener('click',function(){changeEligibility(true)});
    disableButton.addEventListener('click',function(){changeEligibility(false)});
    clearButton.addEventListener('click',function(){selected.clear();focusedId=null;renderGrid();renderInspector();updateActions()});
    dialog.addEventListener('cancel',function(event){event.preventDefault();closeDialog()});
    dialog.addEventListener('click',function(event){if(event.target===dialog)closeDialog()});
    document.addEventListener('pokemon-sleep:manage-box',function(event){openFor(event.detail&&event.detail.id)});
    updateToolbar();

    return {
      openBulk:openBulk,
      openFor:openFor,
      render:renderAll,
      getState:function(){return JSON.parse(JSON.stringify(state))},
      getBoxes:function(){return boxList(state)}
    };
  }

  return {
    STORAGE_KEY:STORAGE_KEY,
    SUBSKILL_LEVELS:SUBSKILL_LEVELS,
    BOXES:BOXES,
    UPGRADE_FAMILIES:UPGRADE_FAMILIES,
    splitSubskills:splitSubskills,
    defaultBoxId:defaultBoxId,
    defaultBattleEligible:defaultBattleEligible,
    normalizeBoxNames:normalizeBoxNames,
    normalizeUpgrades:normalizeUpgrades,
    normalizeRecord:normalizeRecord,
    normalizeState:normalizeState,
    boxList:boxList,
    applyRecord:applyRecord,
    applyState:applyState,
    applyStored:applyStored,
    effectiveSubskills:effectiveSubskills,
    unlockedSubskills:unlockedSubskills,
    upgradeInfo:upgradeInfo,
    upgradeRecord:upgradeRecord,
    downgradeInfo:downgradeInfo,
    downgradeRecord:downgradeRecord,
    mainSkillLevelCap:mainSkillLevelCap,
    effectiveMainSkillLevel:effectiveMainSkillLevel,
    mount:mount
  };
});
