(function(root,factory){
  'use strict';
  const gameRules=typeof module==='object'&&module.exports?require('./game-rules.js'):root.POKEMON_SLEEP_GAME_RULES;
  const api=factory(root,gameRules);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_PERSONAL_SETTINGS=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root,gameRules){
  'use strict';

  const STORAGE_KEY='pokemon-sleep-personal-settings-v1';
  const LIMITS=gameRules&&gameRules.LIMITS||{helperLevel:70,recipeLevel:70,areaBonusPct:85,permanentPot:81,ingredientPocket:800,sleepStyleGoal:510};
  const INVENTORY_LIMIT=LIMITS.ingredientPocket;
  const SLEEP_STYLE_GOALS=Object.freeze([35,70,110,150,190,240,290,340,390,450,510]);
  const ISLANDS=Object.freeze([
    {key:'green',label:'萌绿之岛',teamProfile:'none'},
    {key:'cyan',label:'天青沙滩',teamProfile:'cyan'},
    {key:'taupe',label:'灰褐洞窟',teamProfile:'taupe'},
    {key:'snowdrop',label:'白花雪原',teamProfile:'snowdrop'},
    {key:'lapis',label:'宝蓝湖畔',teamProfile:'lapis'},
    {key:'gold',label:'黄金发电厂',teamProfile:'gold'},
    {key:'amber',label:'琥珀溪谷',teamProfile:'amber'},
    {key:'green-ex',label:'萌绿之岛 EX',teamProfile:'none'},
    {key:'cyan-ex',label:'天青沙滩 EX',teamProfile:'cyan'}
  ]);
  const WEEK_MODES=Object.freeze({
    normal:{label:'普通周',hint:'按本周三餐目标安排食材与岛屿输出。'},
    preparation:{label:'活动前储备周',hint:'优先保留活动储备，当前料理只消耗非储备或明显溢出的食材。'},
    event:{label:'活动冲刺周',hint:'按活动效果与库存冲刺能量，优先使用已储备食材。'}
  });
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  const clone=value=>JSON.parse(JSON.stringify(value));
  function browserStorage(){try{return root&&root.localStorage||null}catch(_error){return null}}
  function readJson(storage,key,fallback){try{const raw=storage&&storage.getItem(key);return raw?JSON.parse(raw):fallback}catch(_error){return fallback}}
  function writeJson(storage,key,value){try{storage&&storage.setItem(key,JSON.stringify(value));return true}catch(_error){return false}}
  function ingredientNames(value){return [...new Set((value||[]).map(String).filter(Boolean))]}
  function recipeIds(value){return [...new Set((value||[]).map(recipe=>String(recipe&&recipe.id||recipe)).filter(Boolean))]}
  function inventoryTotal(value){return Object.values(value||{}).reduce((sum,amount)=>sum+(Number(amount)||0),0)}
  function normalizeInventory(value,names,limit=INVENTORY_LIMIT){
    const source=value&&typeof value==='object'?value:{},result={};
    ingredientNames(names).forEach(name=>{result[name]=Math.max(0,Math.round(Number(source[name])||0))});
    let overflow=Math.max(0,inventoryTotal(result)-limit);
    if(overflow){
      [...Object.keys(result)].reverse().forEach(name=>{if(!overflow)return;const removed=Math.min(result[name],overflow);result[name]-=removed;overflow-=removed});
    }
    return result;
  }
  function defaults(ingredients=[]){
    return {
      schemaVersion:4,
      accountStage:'mature',
      currentIsland:'green',
      weekMode:'preparation',
      activityKey:'normal',
      islandBonuses:Object.fromEntries(ISLANDS.map(island=>[island.key,0])),
      recipeLevels:{},
      permanentPot:LIMITS.permanentPot,
      sleepStyleCount:0,
      sleepStyleGoal:LIMITS.sleepStyleGoal,
      ingredientStock:Object.fromEntries(ingredientNames(ingredients).map(name=>[name,0])),
      inventoryLimit:INVENTORY_LIMIT,
      updatedAt:''
    };
  }
  function normalizeState(value,{ingredients=[],recipes=[],activityProfiles={}}={}){
    const base=defaults(ingredients),source=value&&typeof value==='object'?value:{},validRecipeIds=new Set(recipeIds(recipes));
    const accountStage=['starter','forming','mature'].includes(source.accountStage)?source.accountStage:base.accountStage;
    const currentIsland=ISLANDS.some(island=>island.key===source.currentIsland)?source.currentIsland:base.currentIsland;
    const weekMode=Object.hasOwn(WEEK_MODES,source.weekMode)?source.weekMode:base.weekMode;
    const activityKey=Object.hasOwn(activityProfiles,source.activityKey)?source.activityKey:(Object.hasOwn(activityProfiles,'normal')?'normal':String(source.activityKey||base.activityKey));
    const islandBonuses={...base.islandBonuses};
    Object.entries(source.islandBonuses&&typeof source.islandBonuses==='object'?source.islandBonuses:{}).forEach(([key,value])=>{if(Object.hasOwn(islandBonuses,key))islandBonuses[key]=clamp(value,0,LIMITS.areaBonusPct)});
    const energy=root&&root.POKEMON_SLEEP_SNORLAX_ENERGY,recipeLevels={},storedLevels=source.recipeLevels&&typeof source.recipeLevels==='object'?source.recipeLevels:null,legacyBonuses=source.recipeBonuses&&typeof source.recipeBonuses==='object'?source.recipeBonuses:{},legacyCookedIds=new Set((Array.isArray(source.cookedRecipeIds)?source.cookedRecipeIds:[]).map(String));
    Object.entries(storedLevels||legacyBonuses).forEach(([id,value])=>{
      if(validRecipeIds.size&&!validRecipeIds.has(String(id)))return;
      const level=storedLevels?clamp(Math.round(value),0,LIMITS.recipeLevel):(Number(value)>0?(energy&&energy.recipeLevelFromBonusPct?energy.recipeLevelFromBonusPct(value):clamp(Math.round(value),1,LIMITS.recipeLevel)):0);
      if(level>0)recipeLevels[String(id)]=level;
    });
    legacyCookedIds.forEach(id=>{if((!validRecipeIds.size||validRecipeIds.has(id))&&!recipeLevels[id])recipeLevels[id]=1});
    const sleepStyleCount=clamp(Math.round(source.sleepStyleCount),0,9999),sleepStyleGoal=SLEEP_STYLE_GOALS.includes(Number(source.sleepStyleGoal))?Number(source.sleepStyleGoal):LIMITS.sleepStyleGoal,permanentPot=clamp(Math.round(source.permanentPot||base.permanentPot),1,LIMITS.permanentPot);
    const normalized={...base,...source,schemaVersion:4,accountStage,currentIsland,weekMode,activityKey,islandBonuses,recipeLevels,permanentPot,sleepStyleCount,sleepStyleGoal,ingredientStock:normalizeInventory(source.ingredientStock,ingredients),inventoryLimit:INVENTORY_LIMIT,updatedAt:String(source.updatedAt||'')};
    delete normalized.recipeBonuses;delete normalized.cookedRecipeIds;return normalized;
  }
  function migrate(storage,context={}){
    const stored=readJson(storage,STORAGE_KEY,null);
    if(stored){const normalized=normalizeState(stored,context);if(Number(stored.schemaVersion)!==4||Object.hasOwn(stored,'recipeBonuses')||Object.hasOwn(stored,'cookedRecipeIds'))writeJson(storage,STORAGE_KEY,normalized);return normalized}
    const base=defaults(context.ingredients),weekly=readJson(storage,'pokemon-sleep-weekly-plan-v1',{}),team=readJson(storage,'pokemon-sleep-team-energy-settings-v1',{}),advisor=readJson(storage,'pokemon-sleep-advisor-preferences-v1',{}),oldRecipeBonus=clamp(readJson(storage,'pokemon-sleep-recipe-level-bonus-v1',0),0,200);
    if(advisor.accountStage)base.accountStage=advisor.accountStage;
    if(weekly.inventory)base.ingredientStock=weekly.inventory;
    if(Number.isInteger(Number(weekly.islandIndex))&&context.islands&&context.islands[Number(weekly.islandIndex)]){
      const label=context.islands[Number(weekly.islandIndex)].name,match=ISLANDS.find(island=>island.label===label);if(match)base.currentIsland=match.key;
    }
    if(team.islandProfile&&ISLANDS.some(island=>island.teamProfile===team.islandProfile))base.currentIsland=ISLANDS.find(island=>island.teamProfile===team.islandProfile).key;
    if(Number(team.islandBonusPct)>0)base.islandBonuses[base.currentIsland]=clamp(team.islandBonusPct,0,LIMITS.areaBonusPct);
    if(oldRecipeBonus>0){const energy=root&&root.POKEMON_SLEEP_SNORLAX_ENERGY,level=energy&&energy.recipeLevelFromBonusPct?energy.recipeLevelFromBonusPct(oldRecipeBonus):clamp(Math.round(oldRecipeBonus),1,LIMITS.recipeLevel);recipeIds(context.recipes).forEach(id=>{base.recipeLevels[id]=level})}
    const normalized=normalizeState(base,context);writeJson(storage,STORAGE_KEY,normalized);return normalized;
  }
  function read(context={},storage=browserStorage()){return migrate(storage,context)}
  function island(state){return ISLANDS.find(item=>item.key===state.currentIsland)||ISLANDS[0]}
  function islandBonus(state,key){return clamp(state&&state.islandBonuses&&state.islandBonuses[key||state.currentIsland],0,LIMITS.areaBonusPct)}
  function recipeLevel(state,id){return clamp(Math.round(state&&state.recipeLevels&&state.recipeLevels[String(id)]||0),0,LIMITS.recipeLevel)}
  function isCooked(state,id){return recipeLevel(state,id)>0}
  function setIngredientStock(state,name,value){
    const next=clone(state),current=Math.max(0,Math.round(Number(next.ingredientStock[name])||0)),requested=Math.max(0,Math.round(Number(value)||0)),other=inventoryTotal(next.ingredientStock)-current;
    next.ingredientStock[name]=Math.min(requested,Math.max(0,INVENTORY_LIMIT-other));return next;
  }
  function islandIndexFor(state,islands=[]){const selected=island(state),index=(islands||[]).findIndex(item=>item&&item.name===selected.label);return index>=0?index:0}

  function mount(options={}){
    if(typeof document==='undefined')return null;
    const storage=options.storage||browserStorage(),context={ingredients:options.ingredients||[],recipes:options.recipes||[],islands:options.islands||[],activityProfiles:options.activityProfiles||{}},dialog=document.querySelector('#personalSettingsDialog');
    if(!dialog)return null;
    let state=migrate(storage,context),recipeQuery='',recipeStatus='all';
    const openButton=document.querySelector('#personalSettingsOpen'),closeButton=document.querySelector('#personalSettingsClose'),islandSelect=document.querySelector('#profileCurrentIsland'),weekSelect=document.querySelector('#profileWeekMode'),activitySelect=document.querySelector('#profileActivity'),islandRoot=document.querySelector('#profileIslandBonuses'),stockRoot=document.querySelector('#profileIngredientStock'),stockTotal=document.querySelector('#profileStockTotal'),recipeSearch=document.querySelector('#profileRecipeSearch'),recipeFilter=document.querySelector('#profileRecipeFilter'),recipeRoot=document.querySelector('#profileRecipeList'),bulkInput=document.querySelector('#profileRecipeBulk'),bulkApply=document.querySelector('#profileRecipeBulkApply'),message=document.querySelector('#profileSettingsMessage'),toolsRoot=document.querySelector('#personalSettingsTools'),accountStage=document.querySelector('#accountStage'),potInput=document.querySelector('#profilePermanentPot'),sleepCountInput=document.querySelector('#profileSleepStyleCount'),sleepGoalSelect=document.querySelector('#profileSleepStyleGoal'),rulesRoot=document.querySelector('#profileRulesStatus');
    document.querySelectorAll('[data-settings-move]').forEach(node=>{node.hidden=false;toolsRoot&&toolsRoot.append(node)});
    function emit(type){
      state.updatedAt=new Date().toISOString();writeJson(storage,STORAGE_KEY,state);
      if(accountStage)writeJson(storage,'pokemon-sleep-advisor-preferences-v1',{accountStage:state.accountStage});
      if(root&&typeof root.dispatchEvent==='function'&&typeof root.CustomEvent==='function'){
        root.dispatchEvent(new root.CustomEvent('pokemon-sleep:personal-settings-change',{detail:{type,state:clone(state)}}));
        root.dispatchEvent(new root.CustomEvent('pokemon-sleep:local-change',{detail:{source:'personal-settings',type}}));
      }
      if(typeof options.onChange==='function')options.onChange(clone(state),type);
      if(message){message.textContent=`已保存 · ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}`;message.hidden=false}
    }
    function renderIslandBonuses(){
      if(!islandRoot)return;islandRoot.replaceChildren();
      ISLANDS.forEach(item=>{const label=document.createElement('label'),span=document.createElement('span'),input=document.createElement('input');span.textContent=`${item.label}（%）`;input.type='number';input.min='0';input.max=String(LIMITS.areaBonusPct);input.step='1';input.inputMode='decimal';input.value=String(islandBonus(state,item.key));input.dataset.islandBonus=item.key;input.addEventListener('change',()=>{state.islandBonuses[item.key]=clamp(input.value,0,LIMITS.areaBonusPct);input.value=String(state.islandBonuses[item.key]);emit('island-bonus')});label.append(span,input);islandRoot.append(label)});
    }
    function renderStock(){
      if(!stockRoot)return;stockRoot.replaceChildren();
      ingredientNames(context.ingredients).forEach(name=>{const label=document.createElement('label'),span=document.createElement('span'),input=document.createElement('input');span.textContent=name;input.type='number';input.min='0';input.max=String(INVENTORY_LIMIT);input.step='1';input.inputMode='numeric';input.value=String(state.ingredientStock[name]||0);input.dataset.stockIngredient=name;input.addEventListener('change',()=>{state=setIngredientStock(state,name,input.value);input.value=String(state.ingredientStock[name]);renderStockTotal();emit('ingredient-stock')});label.append(span,input);stockRoot.append(label)});renderStockTotal();
    }
    function renderStockTotal(){if(stockTotal){const total=inventoryTotal(state.ingredientStock);stockTotal.textContent=`${total} / ${INVENTORY_LIMIT}`;stockTotal.dataset.full=total>=INVENTORY_LIMIT?'true':'false'}}
    function renderRecipes(){
      if(!recipeRoot)return;const query=recipeQuery.trim().toLowerCase(),rows=context.recipes.filter(recipe=>{const cooked=isCooked(state,recipe.id);return (!query||String(recipe.name).toLowerCase().includes(query)||String(recipe.id).includes(query))&&(recipeStatus==='all'||(recipeStatus==='cooked'&&cooked)||(recipeStatus==='uncooked'&&!cooked))});recipeRoot.replaceChildren();
      rows.forEach(recipe=>{const row=document.createElement('div'),copy=document.createElement('div'),name=document.createElement('strong'),meta=document.createElement('small'),levelLabel=document.createElement('label'),level=document.createElement('input');row.className='profile-recipe-row';name.textContent=recipe.name;meta.textContent=`${recipe.type} · ${recipe.total||0} 格`;copy.append(name,meta);levelLabel.className='profile-recipe-bonus';levelLabel.append(document.createTextNode('食谱等级'));level.type='number';level.min='0';level.max=String(LIMITS.recipeLevel);level.step='1';level.inputMode='numeric';level.value=String(recipeLevel(state,recipe.id));level.addEventListener('change',()=>{const value=clamp(Math.round(level.value),0,LIMITS.recipeLevel);value>0?state.recipeLevels[String(recipe.id)]=value:delete state.recipeLevels[String(recipe.id)];level.value=String(value);emit('recipe-level');if(recipeStatus!=='all')renderRecipes()});levelLabel.append(level,document.createTextNode('级'));row.append(copy,levelLabel);recipeRoot.append(row)});
      if(!rows.length){const empty=document.createElement('p');empty.className='profile-settings-empty';empty.textContent='没有符合条件的食谱。';recipeRoot.append(empty)}
    }
    function render(){
      if(islandSelect){islandSelect.replaceChildren();ISLANDS.forEach(item=>{const option=document.createElement('option');option.value=item.key;option.textContent=item.label;islandSelect.append(option)});islandSelect.value=state.currentIsland}
      if(weekSelect){weekSelect.replaceChildren();Object.entries(WEEK_MODES).forEach(([key,item])=>{const option=document.createElement('option');option.value=key;option.textContent=item.label;weekSelect.append(option)});weekSelect.value=state.weekMode}
      if(activitySelect){activitySelect.replaceChildren();Object.entries(context.activityProfiles).forEach(([key,item])=>{const option=document.createElement('option');option.value=key;option.textContent=item.label;activitySelect.append(option)});activitySelect.value=state.activityKey;activitySelect.closest('.profile-field')?.classList.toggle('is-muted',state.weekMode!=='event')}
      if(accountStage)accountStage.value=state.accountStage;renderIslandBonuses();renderStock();renderRecipes();
      if(potInput)potInput.value=String(state.permanentPot);if(sleepCountInput)sleepCountInput.value=String(state.sleepStyleCount);
      if(sleepGoalSelect){sleepGoalSelect.replaceChildren();SLEEP_STYLE_GOALS.forEach(goal=>{const option=document.createElement('option');option.value=String(goal);option.textContent=`${goal} 种`;sleepGoalSelect.append(option)});sleepGoalSelect.value=String(state.sleepStyleGoal)}
      if(rulesRoot&&gameRules){const status=gameRules.freshness(),caps=gameRules.LIMITS;rulesRoot.dataset.stale=status.stale?'true':'false';rulesRoot.innerHTML=`<strong>${status.stale?'规则快照需要复核':'规则快照在有效期内'}</strong><span>游戏 Ver.${status.gameVersion} · 核对于 ${status.verifiedAt}</span><small>个体/食谱 Lv.${caps.helperLevel} · 岛屿 ${caps.areaBonusPct}% · 永久锅 ${caps.permanentPot} · 食材 ${caps.ingredientPocket} · 盒子 ${caps.pokemonBox}</small>`}
    }
    islandSelect?.addEventListener('change',()=>{state.currentIsland=islandSelect.value;emit('current-island')});
    weekSelect?.addEventListener('change',()=>{state.weekMode=weekSelect.value;render();emit('week-mode')});
    activitySelect?.addEventListener('change',()=>{state.activityKey=activitySelect.value;emit('activity')});
    accountStage?.addEventListener('change',()=>{state.accountStage=['starter','forming','mature'].includes(accountStage.value)?accountStage.value:'mature';emit('account-stage')});
    potInput?.addEventListener('change',()=>{state.permanentPot=clamp(Math.round(potInput.value),1,LIMITS.permanentPot);potInput.value=String(state.permanentPot);emit('permanent-pot')});
    sleepCountInput?.addEventListener('change',()=>{state.sleepStyleCount=clamp(Math.round(sleepCountInput.value),0,9999);sleepCountInput.value=String(state.sleepStyleCount);emit('sleep-style-progress')});
    sleepGoalSelect?.addEventListener('change',()=>{state.sleepStyleGoal=SLEEP_STYLE_GOALS.includes(Number(sleepGoalSelect.value))?Number(sleepGoalSelect.value):LIMITS.sleepStyleGoal;emit('sleep-style-progress')});
    recipeSearch?.addEventListener('input',()=>{recipeQuery=recipeSearch.value;renderRecipes()});
    recipeFilter?.addEventListener('change',()=>{recipeStatus=recipeFilter.value;renderRecipes()});
    bulkApply?.addEventListener('click',()=>{const value=clamp(Math.round(bulkInput&&bulkInput.value),0,LIMITS.recipeLevel);recipeIds(context.recipes).forEach(id=>{value>0?state.recipeLevels[id]=value:delete state.recipeLevels[id]});renderRecipes();emit('recipe-level')});
    openButton?.addEventListener('click',()=>{render();dialog.showModal?dialog.showModal():dialog.setAttribute('open','')});
    closeButton?.addEventListener('click',()=>dialog.close?dialog.close():dialog.removeAttribute('open'));
    dialog.addEventListener('click',event=>{if(event.target===dialog&&dialog.close)dialog.close()});
    render();document.documentElement.classList.add('personal-settings-ready');
    return {open:()=>openButton?.click(),close:()=>dialog.close&&dialog.close(),getState:()=>clone(state),update(patch,type='settings'){state=normalizeState({...state,...patch},context);render();emit(type);return clone(state)},setIngredient(name,value){state=setIngredientStock(state,name,value);renderStock();emit('ingredient-stock');return state.ingredientStock[name]},recipeLevel:id=>recipeLevel(state,id),isCooked:id=>isCooked(state,id),islandBonus:key=>islandBonus(state,key),currentIsland:()=>island(state),islandIndex:islands=>islandIndexFor(state,islands)};
  }

  return Object.freeze({STORAGE_KEY,INVENTORY_LIMIT,LIMITS,SLEEP_STYLE_GOALS,ISLANDS,WEEK_MODES,defaults,normalizeInventory,normalizeState,inventoryTotal,migrate,read,island,islandBonus,recipeLevel,isCooked,setIngredientStock,islandIndexFor,mount});
});
