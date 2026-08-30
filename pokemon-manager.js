(function(root,factory){
  'use strict';
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_POKEMON_MANAGER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';

  const SUBSKILLS=Object.freeze(['树果数量S','帮手奖励','帮忙速度M','帮忙速度S','食材概率M','食材概率S','技能概率M','技能概率S','技能等级M','技能等级S','持有上限L','持有上限M','持有上限S','睡眠EXP奖励','活力恢复奖励','梦之碎片奖励','研究EXP奖励','—']);
  const SUBSKILL_LEVELS=Object.freeze([10,25,50,70,80]);
  const PRIORITIES=Object.freeze(['重点培养','未来可期','即时战力','继续使用','按需求保留','备用','闪光收藏']);
  const ROLE_LABELS=Object.freeze({berry:'树果手',ingredient:'食材手',skill:'技能手',all:'全能手',unknown:'待核对'});
  const INVENTORY_BONUS=Object.freeze({'持有上限S':6,'持有上限M':12,'持有上限L':18});
  const SPEED_REDUCTION=Object.freeze({'帮忙速度S':.07,'帮忙速度M':.14});

  const number=value=>Number(value)||0;
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const option=(value,label)=>{const node=document.createElement('option');node.value=String(value);node.textContent=String(label);return node};
  const element=(tag,className,text)=>{const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node};
  function showDialog(dialog){if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal()}else dialog.setAttribute('open','')}
  function closeDialog(dialog){if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open')}
  function formatInterval(value){const total=Math.max(1,Math.round(value)),hours=Math.floor(total/3600),minutes=Math.floor(total%3600/60),seconds=total%60;return hours?`${hours}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`:`${minutes}:${String(seconds).padStart(2,'0')}`}
  function natureName(value,natureApi){try{return natureApi.natureName(value)}catch(_error){return '认真'}}
  function natureModifiers(value,natureApi){
    const name=natureName(value,natureApi),nature=natureApi.natures.find(item=>item.name===name)||{};
    return {name,interval:nature.up==='speed'?.9:nature.down==='speed'?1.075:1};
  }
  function mainSkillCap(name){
    if(/梦之碎片获取S|波导弹|十项全能/.test(name))return 8;
    if(/帮手支援S|能量填充[SM]|蓄力|噩梦|食材获取S|食材精选S|料理强化S|料理辅助S/.test(name))return 7;
    return 6;
  }
  function activeSubskills(skills,level){return skills.filter((skill,index)=>skill!=='—'&&(SUBSKILL_LEVELS[index]||80)<=level)}
  function computedStats(species,level,nature,skills,natureApi){
    const safeLevel=clamp(Math.round(number(level)||1),1,70),modifiers=natureModifiers(nature,natureApi),unlocked=activeSubskills(skills,safeLevel),speed=clamp(unlocked.reduce((sum,skill)=>sum+(SPEED_REDUCTION[skill]||0),0),0,.35),base=number(species.helpFrequencyBaseSec),interval=base*(501-safeLevel)/500*modifiers.interval*(1-speed),carry=number(species.carryLimitRaisedFromFirstStage||species.carryLimitBase)+unlocked.reduce((sum,skill)=>sum+(INVENTORY_BONUS[skill]||0),0);
    return {level:safeLevel,interval:formatInterval(interval),carry:Math.max(1,Math.round(carry)),speedReduction:speed};
  }
  function selectedIngredient(select,species,level){
    const list=species.ingredients&&species.ingredients[level]||[],chosen=list.find(item=>String(item.id)===select.value)||list[0];
    return chosen||null;
  }
  function canonicalIngredient(item,ingredientApi){
    if(!item)return '—';
    const name=ingredientApi&&ingredientApi.canonicalize(item.name)||item.name;
    return `${name}×${item.quantity}`;
  }
  function inferSpecies(mon,catalog,scoring){
    if(mon&&mon.speciesId){const found=catalog.pokemon.find(item=>item.id===String(mon.speciesId));if(found)return found}
    const direct=scoring.recordForPokemon(mon||{});if(direct)return direct;
    return null;
  }

  function mount(options={}){
    if(typeof document==='undefined')return null;
    const pokemon=Array.isArray(options.pokemon)?options.pokemon:[],catalog=options.catalog||root.POKEMON_SLEEP_CATALOG,scoring=options.scoring||root.POKEMON_SLEEP_DYNAMIC_SCORING,dataApi=options.dataApi||root.POKEMON_SLEEP_DATA,natureApi=root.POKEMON_SLEEP_SCORING,ingredientApi=root.POKEMON_SLEEP_INGREDIENTS,boxApi=root.POKEMON_SLEEP_BOX_MANAGER;
    if(!catalog||!scoring||!dataApi||!natureApi)return null;
    const byId=new Map(pokemon.map(mon=>[String(mon.id),mon])),catalogById=new Map(catalog.pokemon.map(record=>[String(record.id),record]));
    const addButton=document.querySelector('#pokemonAddOpen'),recycleButton=document.querySelector('#pokemonRecycleOpen'),dialog=document.querySelector('#pokemonEditorDialog'),recycleDialog=document.querySelector('#pokemonRecycleDialog');
    if(!addButton||!dialog||!recycleDialog)return null;
    const title=document.querySelector('#pokemonEditorTitle'),closeButton=document.querySelector('#pokemonEditorClose'),cancelButton=document.querySelector('#pokemonEditorCancel'),saveButton=document.querySelector('#pokemonEditorSave'),releaseButton=document.querySelector('#pokemonEditorRelease'),duplicateButton=document.querySelector('#pokemonEditorDuplicate'),message=document.querySelector('#pokemonEditorMessage'),speciesSearch=document.querySelector('#pokemonSpeciesSearch'),speciesSelect=document.querySelector('#pokemonSpecies'),finalWrap=document.querySelector('#pokemonFinalWrap'),finalSelect=document.querySelector('#pokemonFinal'),levelInput=document.querySelector('#pokemonLevel'),shinyInput=document.querySelector('#pokemonShiny'),natureSelect=document.querySelector('#pokemonNature'),mainLevelSelect=document.querySelector('#pokemonMainLevel'),prioritySelect=document.querySelector('#pokemonPriority'),boxSelect=document.querySelector('#pokemonBox'),battleInput=document.querySelector('#pokemonBattleEligible'),noteInput=document.querySelector('#pokemonNote'),ingredientSelects=[1,30,60].map(level=>document.querySelector(`#pokemonIngredient${level}`)),subskillSelects=SUBSKILL_LEVELS.map(level=>document.querySelector(`#pokemonSubskill${level}`)),identityPreview=document.querySelector('#pokemonIdentityPreview'),scorePreview=document.querySelector('#pokemonScorePreview'),recycleList=document.querySelector('#pokemonRecycleList'),recycleClose=document.querySelector('#pokemonRecycleClose'),recycleCount=document.querySelector('#pokemonRecycleCount');
    let editingId=null,releaseArmed=false,purgeArmed=null;

    natureApi.natures.forEach(item=>natureSelect.append(option(item.name,item.name)));
    PRIORITIES.forEach(item=>prioritySelect.append(option(item,item)));
    subskillSelects.forEach(select=>SUBSKILLS.forEach(skill=>select.append(option(skill,skill))));

    function namedBoxes(){
      const stored=dataApi.readJson(dataApi.BOX_KEY,{}),names=boxApi.normalizeBoxNames(stored&&stored.boxes);
      return boxApi.BOXES.map(box=>({id:box.id,name:names[box.id].name}));
    }
    namedBoxes().forEach(box=>boxSelect.append(option(box.id,box.name)));

    function speciesLabel(record){return `#${record.id} ${record.name}${record.nameEn?` / ${record.nameEn}`:''}`}
    function filteredCatalog(){
      const query=speciesSearch.value.trim().toLowerCase();
      return catalog.pokemon.filter(record=>!query||speciesLabel(record).toLowerCase().includes(query)).sort((a,b)=>a.pokedexId-b.pokedexId||a.id.localeCompare(b.id,'en',{numeric:true}));
    }
    function renderSpeciesOptions(preferred){
      const current=String(preferred||speciesSelect.value||''),rows=filteredCatalog();speciesSelect.replaceChildren();
      rows.forEach(record=>speciesSelect.append(option(record.id,speciesLabel(record))));
      if(current&&rows.some(row=>row.id===current))speciesSelect.value=current;
      else if(rows.length)speciesSelect.value=rows[0].id;
      updateSpeciesFields();
    }
    function currentSpecies(){return catalogById.get(String(speciesSelect.value))||null}
    function renderFinalOptions(species,preferred){
      const ids=species&&species.finalOptions||[],current=String(preferred||'');finalSelect.replaceChildren();
      ids.forEach(id=>{const record=catalogById.get(String(id));if(record)finalSelect.append(option(record.id,`${record.name}｜${ROLE_LABELS[record.specialty]||'待核对'}`))});
      finalSelect.value=ids.includes(current)?current:String(species&&species.defaultFinalId||ids[0]||'');
      finalWrap.hidden=ids.length<=1;
    }
    function renderIngredients(species,preferred=[]){
      [1,30,60].forEach((level,index)=>{
        const select=ingredientSelects[index],items=species&&species.ingredients&&species.ingredients[level]||[];select.replaceChildren();
        items.forEach(item=>select.append(option(item.id,canonicalIngredient(item,ingredientApi))));
        const wanted=String(preferred[index]||'');
        const match=items.find(item=>canonicalIngredient(item,ingredientApi)===wanted||String(item.id)===wanted);
        if(match)select.value=String(match.id);
        select.disabled=!items.length;
      });
    }
    function renderMainLevels(species,preferred){
      const cap=mainSkillCap(species&&species.mainSkill&&species.mainSkill.name||''),value=clamp(Math.round(number(preferred)||number(species&&species.stage)||1),1,cap);mainLevelSelect.replaceChildren();
      for(let level=1;level<=cap;level++)mainLevelSelect.append(option(level,`Lv.${level}`));mainLevelSelect.value=String(value);
    }
    function updateSpeciesFields({finalFormId,ingredients,mainLevel}={}){
      const species=currentSpecies();if(!species)return;
      renderFinalOptions(species,finalFormId||finalSelect.value);renderIngredients(species,ingredients);renderMainLevels(species,mainLevel||mainLevelSelect.value);renderPreview();
    }
    function formSkills(){return subskillSelects.map(select=>select.value||'—')}
    function draftRecord(){
      const species=currentSpecies();if(!species)return null;
      const skills=formSkills(),stats=computedStats(species,levelInput.value,natureSelect.value,skills,natureApi),foods=[1,30,60].map((level,index)=>canonicalIngredient(selectedIngredient(ingredientSelects[index],species,level),ingredientApi)),mainLevel=Number(mainLevelSelect.value)||1,existing=editingId&&byId.get(editingId),state=dataApi.readAll();
      const id=existing?String(existing.id):String(state.meta.nextDisplayId),recordId=existing&&existing.recordId||dataApi.newRecordId(),createdAt=existing&&existing.createdAt||new Date().toISOString();
      return {id,recordId,speciesId:species.id,finalFormId:finalSelect.value||species.defaultFinalId,name:species.name,sp:existing&&existing.sp||'',lv:String(stats.level),shiny:shinyInput.checked?'是':'否',ingredients:foods.join('／'),interval:stats.interval,inv:String(stats.carry),main:`${species.mainSkill.name} Lv.${mainLevel}`,subs:skills.join('；'),nature:natureSelect.value,priority:prioritySelect.value,note:noteInput.value.trim(),createdAt,updatedAt:new Date().toISOString()};
    }
    function validateDraft(record){
      if(!record||!record.speciesId)return '请选择宝可梦。';
      const duplicates=formSkills().filter(skill=>skill!=='—').filter((skill,index,array)=>array.indexOf(skill)!==index);
      if(duplicates.length)return `副技能不能重复：${[...new Set(duplicates)].join('、')}。S 与 M 可以同时存在。`;
      if(record.ingredients.split('／').some(item=>item==='—'))return '当前图鉴资料缺少这个形态的食材选项，暂时不能保存。';
      return '';
    }
    function renderPreview(){
      const record=draftRecord();if(!record)return;
      const species=currentSpecies(),target=catalogById.get(String(record.finalFormId)),score=scoring.scorePokemon(record),role=ROLE_LABELS[target&&target.specialty||species.specialty]||'待核对';
      identityPreview.textContent=`${species.name} · ${role} · ${species.mainSkill.name} · 间隔 ${record.interval} · 持有 ${record.inv}`;
      scorePreview.replaceChildren();
      const cards=Number.isFinite(score.finalScore)?[['综合分',score.finalScore.toFixed(1)],['种族分',score.speciesScore.toFixed(1)],['个体分',score.individualScore.toFixed(1)],['食材路线',score.individual.ingredientPattern==='不适用'?'不适用':`${score.individual.ingredientPattern} ×${score.individual.ingredientPatternCoefficient.toFixed(2)}`]]:[['综合分','待定'],['原因',score.status==='pending-all-rounder-formula'?'全能型公式尚未确认':'缺少种族评分'],['定位',role]];
      cards.forEach(([label,value])=>{const card=element('span','pokemon-score-preview-item');card.append(element('small','',label),element('strong','',value));scorePreview.append(card)});
      const error=validateDraft(record);message.hidden=!error;message.textContent=error;message.className='pokemon-editor-message warning';saveButton.disabled=Boolean(error);
    }
    function resetForm(){
      editingId=null;releaseArmed=false;title.textContent='快速录入新个体';releaseButton.hidden=true;duplicateButton.hidden=true;releaseButton.textContent='放生到回收站';speciesSearch.value='';renderSpeciesOptions();levelInput.value='1';shinyInput.checked=false;natureSelect.value='认真';prioritySelect.value='按需求保留';boxSelect.value='pending';battleInput.checked=true;noteInput.value='';subskillSelects.forEach(select=>{select.value='—'});updateSpeciesFields();message.hidden=true;
    }
    function openNew(){resetForm();showDialog(dialog);setTimeout(()=>speciesSearch.focus(),0)}
    function openFor(id){
      const mon=byId.get(String(id));if(!mon)return false;editingId=String(mon.id);releaseArmed=false;title.textContent=`编辑 #${mon.id} ${mon.name}`;releaseButton.hidden=false;duplicateButton.hidden=false;releaseButton.textContent='放生到回收站';speciesSearch.value='';
      const species=inferSpecies(mon,catalog,scoring);renderSpeciesOptions(species&&species.id);if(species){speciesSelect.value=species.id;const currentFoods=String(mon.ingredients||'').split('／');updateSpeciesFields({finalFormId:mon.finalFormId||scoring.targetForPokemon(mon)?.id,ingredients:currentFoods,mainLevel:String(mon.main||'').match(/Lv\.(\d+)/)?.[1]})}
      levelInput.value=String(mon.lv||1);shinyInput.checked=mon.shiny==='是';natureSelect.value=natureName(mon.nature,natureApi);prioritySelect.value=PRIORITIES.includes(mon.priority)?mon.priority:'按需求保留';boxSelect.value=mon.boxId||boxApi.defaultBoxId(mon);battleInput.checked=mon.battleEligible!==false;noteInput.value=mon.note||'';
      const skills=String(mon.subs||'').split('；');subskillSelects.forEach((select,index)=>{select.value=SUBSKILLS.includes(skills[index])?skills[index]:'—'});renderPreview();showDialog(dialog);return true;
    }
    async function persistAndReload(){
      const controller=root.POKEMON_SLEEP_CLOUD_SYNC_CONTROLLER;
      if(controller&&typeof controller.saveNow==='function'){try{await controller.saveNow()}catch(_error){}}
      root.location.reload();
    }
    async function save(){
      const record=draftRecord(),error=validateDraft(record);if(error){renderPreview();return}
      saveButton.disabled=true;saveButton.textContent='正在保存…';
      dataApi.upsertPokemon(record,{boxId:boxSelect.value,battleEligible:battleInput.checked});
      await persistAndReload();
    }
    async function release(){
      if(!editingId)return;
      if(!releaseArmed){releaseArmed=true;releaseButton.textContent='再次点击确认放生';message.hidden=false;message.className='pokemon-editor-message warning';message.textContent='放生后会移出当前队伍与包含它的已保存队伍，并进入30天回收站。';return}
      releaseButton.disabled=true;dataApi.releasePokemon(editingId);await persistAndReload();
    }
    function duplicate(){
      if(!editingId)return;
      const source=byId.get(editingId);editingId=null;releaseArmed=false;title.textContent=`复制 ${source?source.name:'同种'}为新个体`;releaseButton.hidden=true;duplicateButton.hidden=true;renderPreview();message.hidden=false;message.className='pokemon-editor-message';message.textContent='已复制种类与各栏资料；修改不同项后保存，会自动使用新的盒子编号。';
    }
    function renderRecycle(){
      const state=dataApi.readAll(),items=state.recycle;recycleCount.textContent=`${items.length} 只`;recycleList.replaceChildren();purgeArmed=null;
      if(!items.length){recycleList.append(element('div','pokemon-recycle-empty','回收站为空。放生的宝可梦会在这里保留30天。'));return}
      items.forEach(item=>{
        const mon=item.pokemon,row=element('article','pokemon-recycle-row'),copy=element('div','pokemon-recycle-copy'),actions=element('div','pokemon-recycle-actions'),restore=element('button','primary','恢复'),purge=element('button','danger','永久删除');
        copy.append(element('span','',`#${mon.id} · 剩余 ${dataApi.daysRemaining(item.expiresAt)} 天`),element('strong','',mon.name),element('small','',`Lv.${mon.lv} · Lv.10 ${String(mon.subs).split('；')[0]||'—'} · ${new Date(item.deletedAt).toLocaleDateString('zh-CN')}`));
        restore.type='button';purge.type='button';restore.addEventListener('click',async()=>{restore.disabled=true;dataApi.restorePokemon(mon.recordId);await persistAndReload()});
        purge.addEventListener('click',async()=>{if(purgeArmed!==mon.recordId){purgeArmed=mon.recordId;purge.textContent='确认永久删除';return}purge.disabled=true;dataApi.purgePokemon(mon.recordId);await persistAndReload()});
        actions.append(restore,purge);row.append(copy,actions);recycleList.append(row);
      });
    }
    function openRecycle(){renderRecycle();showDialog(recycleDialog)}

    addButton.addEventListener('click',openNew);recycleButton.addEventListener('click',openRecycle);closeButton.addEventListener('click',()=>closeDialog(dialog));cancelButton.addEventListener('click',()=>closeDialog(dialog));saveButton.addEventListener('click',save);releaseButton.addEventListener('click',release);duplicateButton.addEventListener('click',duplicate);recycleClose.addEventListener('click',()=>closeDialog(recycleDialog));speciesSearch.addEventListener('input',()=>renderSpeciesOptions());speciesSelect.addEventListener('change',()=>updateSpeciesFields());finalSelect.addEventListener('change',renderPreview);[levelInput,shinyInput,natureSelect,mainLevelSelect,prioritySelect,boxSelect,battleInput,noteInput,...ingredientSelects,...subskillSelects].forEach(control=>{control.addEventListener(control===noteInput?'input':'change',renderPreview)});
    dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(dialog)});dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog(dialog)});recycleDialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog(recycleDialog)});recycleDialog.addEventListener('click',event=>{if(event.target===recycleDialog)closeDialog(recycleDialog)});document.addEventListener('pokemon-sleep:edit-pokemon',event=>openFor(event.detail&&event.detail.id));
    return {openNew,openFor,openRecycle,renderPreview};
  }

  return Object.freeze({SUBSKILLS,SUBSKILL_LEVELS,PRIORITIES,ROLE_LABELS,formatInterval,natureModifiers,mainSkillCap,activeSubskills,computedStats,mount});
});
