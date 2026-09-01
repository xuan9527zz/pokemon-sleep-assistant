(function(root,factory){
  'use strict';
  const strategy=typeof module==='object'&&module.exports?require('./pokemon-strategy.js'):root.POKEMON_SLEEP_STRATEGY;
  const catalog=typeof module==='object'&&module.exports?require('./pokemon-catalog.generated.js'):root.POKEMON_SLEEP_CATALOG;
  const api=factory(strategy,catalog);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_WEEKLY_PLANNER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(strategy,catalog){
  'use strict';

  const STORAGE_KEY='pokemon-sleep-weekly-plan-v1';
  const ACTIVITY_PROFILES=Object.freeze({
    normal:{label:'普通周',carryBonus:0,note:'无活动临时加成。',defaultMealGoal:21},
    snapshot:{label:'迷你糖果增强周',carryBonus:0,note:'当前 Mini Candy Boost 周不提供料理能量或产量倍率。',defaultMealGoal:15},
    mewtwo1:{label:'超梦登场活动·第1周',carryBonus:8,psychicSkillBonus:2,note:'仅萌绿之岛／萌绿之岛 EX：全员持有上限＋8，超能力属性主技能等级＋2。',defaultMealGoal:15},
    mewtwo2:{label:'超梦登场活动·第2周',carryBonus:15,psychicSkillBonus:5,note:'仅萌绿之岛／萌绿之岛 EX：全员持有上限＋15，超能力属性主技能等级＋5。',defaultMealGoal:15},
    cooking125:{label:'料理能量＋25%',carryBonus:0,note:'活动料理能量＋25%；本页只规划目标食材，不把倍率伪装成固定产量。',defaultMealGoal:15},
    cooking150:{label:'料理能量＋50%',carryBonus:0,note:'活动料理能量＋50%；建议优先完成高系数目标料理。',defaultMealGoal:15}
  });
  const MEAL_NAMES=Object.freeze(['早','午','晚']);
  const DAY_NAMES=Object.freeze(['周一','周二','周三','周四','周五','周六','周日']);
  const VALID_MEAL_KEYS=new Set(DAY_NAMES.flatMap((_day,day)=>MEAL_NAMES.map((_meal,meal)=>`d${day}-m${meal}`)));
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  const round=(value,digits=1)=>{const scale=10**digits;return Math.round((Number(value)+Number.EPSILON)*scale)/scale};
  const readJson=(storage,key,fallback)=>{try{const value=storage&&storage.getItem(key);return value?JSON.parse(value):fallback}catch(_error){return fallback}};
  const writeJson=(storage,key,value)=>{try{storage&&storage.setItem(key,JSON.stringify(value));return true}catch(_error){return false}};
  const dateValue=value=>{const date=value instanceof Date?new Date(value):new Date(value||Date.now());return Number.isNaN(date.getTime())?new Date():date};
  const dateKey=date=>`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;

  function weekKey(value){
    const date=dateValue(value),weekday=(date.getDay()+6)%7,monday=new Date(date.getFullYear(),date.getMonth(),date.getDate()-weekday);
    return dateKey(monday);
  }
  function daysRemainingInWeek(value){
    const date=dateValue(value),weekday=(date.getDay()+6)%7;
    return Math.max(1,7-weekday);
  }
  function effectivePot(base,goodCamp){return Math.floor(clamp(Math.round(base),1,1000)*(goodCamp?1.5:1))}
  function recipeRows(recipes,type,pot){
    return (recipes||[]).filter(recipe=>Number(recipe.energy)>0&&Number(recipe.total)<=pot&&(!type||type==='全部'||recipe.type===type)).sort((a,b)=>Number(b.energy)-Number(a.energy)||Number(a.total)-Number(b.total));
  }
  function chooseTargetRecipe(recipes,type,pot,daily={},inventory={},mealGoal=15){
    const candidates=recipeRows(recipes,type,pot);if(!candidates.length)return null;
    return candidates.map(recipe=>{
      const coverage=recipe.ingredients.reduce((sum,item)=>sum+Math.min(1,((Number(daily[item.name])||0)*7+(Number(inventory[item.name])||0))/(item.amount*mealGoal)),0)/Math.max(1,recipe.ingredients.length);
      return {recipe,score:Number(recipe.energy)*(.45+.55*coverage)};
    }).sort((a,b)=>b.score-a.score||Number(b.recipe.energy)-Number(a.recipe.energy))[0].recipe;
  }
  function withCarry(mon,carryBonus){return carryBonus?{...mon,inv:String((Number(mon.inv)||0)+carryBonus)}:mon}
  function mergeDaily(target,source){Object.entries(source||{}).forEach(([name,amount])=>{target[name]=(target[name]||0)+(Number(amount)||0)});return target}
  function individualIngredientProduction(mon,planner,production,goodCamp,carryBonus){
    const result=planner.calculateTeam([withCarry(mon,carryBonus)],production,{goodCamp,energyProfile:'average'}),member=result.members[0],daily={};
    if(member)member.ingredients.forEach(item=>{daily[item.name]=(daily[item.name]||0)+item.perDay});
    return {daily,member};
  }
  function requirementMap(targetRecipe,remainingMeals,daysRemaining){
    const daily={};if(!targetRecipe)return daily;
    targetRecipe.ingredients.forEach(item=>{daily[item.name]=item.amount*Math.max(0,remainingMeals)/Math.max(1,daysRemaining)});return daily;
  }
  function normalizedDeficit(daily,required){
    const entries=Object.entries(required);if(!entries.length)return 0;
    return entries.reduce((sum,[name,need])=>sum+(need>0?Math.max(0,need-(Number(daily[name])||0))/need:0),0)/entries.length;
  }
  function buildPreparationTeam(options){
    const {pokemon,context,individualProductionScore,isFullTeamHealer,planner,production,goodCamp,targetRecipe,remainingMeals,daysRemaining}=options,isSpecialPokemon=options.isSpecialPokemon||(()=>false),activity=options.activity||ACTIVITY_PROFILES.normal;
    const eligible=(pokemon||[]).filter(mon=>mon.battleEligible!==false),eventArea=/萌绿之岛/.test(String(context.island&&context.island.name||'')),carryBonus=activity.psychicSkillBonus&&!eventArea?0:Number(activity.carryBonus)||0;
    const outputValue=mon=>Number(individualProductionScore(mon,context))||0,maxOutput=Math.max(1,...eligible.map(outputValue)),healers=eligible.filter(isFullTeamHealer).filter(mon=>!isSpecialPokemon(mon.id)).sort((a,b)=>outputValue(b)-outputValue(a)),healer=healers[0]||null;
    const rows=eligible.filter(mon=>!isFullTeamHealer(mon)&&!isSpecialPokemon(mon.id)).map(mon=>({mon,ingredient:individualIngredientProduction(mon,planner,production,goodCamp,carryBonus),island:outputValue(mon)/maxOutput*100}));
    const selected=healer?[healer]:[],selectedRows=[],aggregate={};
    if(healer)mergeDaily(aggregate,individualIngredientProduction(healer,planner,production,goodCamp,carryBonus).daily);
    const required=requirementMap(targetRecipe,remainingMeals,daysRemaining),slots=5-selected.length;
    for(let slot=0;slot<slots&&rows.length;slot++){
      const before=normalizedDeficit(aggregate,required);
      rows.forEach(row=>{const combined=mergeDaily({...aggregate},row.ingredient.daily),gain=before-normalizedDeficit(combined,required);row.pickScore=gain*100+row.island*.12});
      rows.sort((a,b)=>b.pickScore-a.pickScore||b.island-a.island||Number(a.mon.id)-Number(b.mon.id));
      const best=rows.shift();selected.push(best.mon);selectedRows.push(best);mergeDaily(aggregate,best.ingredient.daily);
    }
    while(selected.length<5){const fallback=eligible.filter(mon=>!isSpecialPokemon(mon.id)&&!selected.includes(mon)).sort((a,b)=>outputValue(b)-outputValue(a))[0];if(!fallback)break;selected.push(fallback)}
    const result=planner.calculateTeam(selected.map(mon=>withCarry(mon,carryBonus)),production,{goodCamp,energyProfile:'average'}),daily=Object.fromEntries(result.ingredients.map(item=>[item.name,item.perDay]));
    return {members:selected,production:result,daily,candidateRows:selectedRows,eventArea,carryBonus,requiredDaily:required};
  }
  function buildOutputTeam(options){
    const {pokemon,context,recommendTeams,planner,production,goodCamp}=options,isSpecialPokemon=options.isSpecialPokemon||(()=>false),carryBonus=Number(options.carryBonus)||0,eligible=(pokemon||[]).filter(mon=>mon.battleEligible!==false&&!isSpecialPokemon(mon.id)),byId=new Map(eligible.map(mon=>[String(mon.id),mon])),recommendation=recommendTeams&&recommendTeams(context),regular=recommendation&&recommendation.regular||{},members=[];
    (regular.ids||[]).forEach(id=>{const mon=byId.get(String(id));if(mon&&!members.includes(mon)&&members.length<5)members.push(mon)});
    (options.fallbackMembers||[]).forEach(mon=>{if(mon&&byId.has(String(mon.id))&&!members.includes(mon)&&members.length<5)members.push(mon)});
    eligible.forEach(mon=>{if(!members.includes(mon)&&members.length<5)members.push(mon)});
    const result=planner.calculateTeam(members.map(mon=>withCarry(mon,carryBonus)),production,{goodCamp,energyProfile:'average'}),daily=Object.fromEntries(result.ingredients.map(item=>[item.name,item.perDay]));
    return {members,production:result,daily,label:regular.label||'岛屿输出队'};
  }
  function ingredientBudget(targetRecipe,daily,inventory,mealGoal,completedMeals,daysRemaining){
    const goal=clamp(Math.round(mealGoal),1,21),completed=Math.min(goal,Math.max(0,Math.round(completedMeals))),remaining=Math.max(0,goal-completed),rows=(targetRecipe&&targetRecipe.ingredients||[]).map(item=>{
      const need=item.amount*remaining,stock=Number(inventory&&inventory[item.name])||0,perDay=Number(daily&&daily[item.name])||0,gapNow=Math.max(0,need-stock),projected=stock+perDay*Math.max(1,daysRemaining),projectedGap=Math.max(0,need-projected),daysToStock=gapNow<=0?0:perDay>0?gapNow/perDay:Infinity;
      return {name:item.name,perMeal:item.amount,need:round(need),stock:round(stock),perDay:round(perDay),gapNow:round(gapNow),projected:round(projected),projectedGap:round(projectedGap),daysToStock:Number.isFinite(daysToStock)?round(daysToStock,1):null};
    });
    return {goal,completed,remaining,daysRemaining,rows,allStocked:rows.every(row=>row.gapNow<=.05),projectedShortages:rows.filter(row=>row.projectedGap>.05),maxDaysToStock:rows.reduce((max,row)=>row.gapNow<=.05?max:row.daysToStock===null?Infinity:Math.max(max,row.daysToStock),0)};
  }
  function createActionPlan(budget,targetRecipe,preparationTeam,outputTeam,now){
    const collectionHours=Number((budget.allStocked?outputTeam:preparationTeam).production.collectionHours)||4,nextCollect=new Date(dateValue(now).getTime()+collectionHours*3600000),collectAt=new Intl.DateTimeFormat('zh-CN',{weekday:'short',hour:'2-digit',minute:'2-digit'}).format(nextCollect);
    if(!targetRecipe)return {phase:'setup',title:'先选择可制作的目标食谱',detail:'当前锅容量与料理类别下没有可用食谱，请调整高级设置。',collectionHours,collectAt,thresholds:[]};
    if(budget.remaining===0)return {phase:'complete',title:'本周目标已经完成',detail:'目标餐数已全部勾选；接下来可以直接使用岛屿输出队。',collectionHours,collectAt,thresholds:[]};
    if(budget.allStocked)return {phase:'output',title:'库存已够，直接使用岛屿输出队',detail:`现有库存已经覆盖剩余 ${budget.remaining} 餐，不需要继续占用食材准备位。`,collectionHours,collectAt,thresholds:budget.rows.map(row=>`${row.name} ${Math.ceil(row.need)}`)};
    if(budget.projectedShortages.length){
      const names=budget.projectedShortages.map(row=>`${row.name}约缺${Math.ceil(row.projectedGap)}`).join('、');
      return {phase:'adjust',title:'先补食材，但当前目标需要下调',detail:`按当前盒子与剩余 ${budget.daysRemaining} 天估算，周末仍会${names}。建议减少目标餐数或改选低需求食谱。`,collectionHours,collectAt,thresholds:budget.rows.filter(row=>row.gapNow>.05).map(row=>`${row.name}库存到 ${Math.ceil(row.need)}`)};
    }
    const days=Number.isFinite(budget.maxDaysToStock)?Math.max(.1,budget.maxDaysToStock):budget.daysRemaining;
    return {phase:'prepare',title:'现在先用食材准备队',detail:`预计约 ${round(days,1)} 天补齐剩余 ${budget.remaining} 餐；达到下列库存后切换岛屿输出队。`,collectionHours,collectAt,thresholds:budget.rows.filter(row=>row.gapNow>.05).map(row=>`${row.name}库存到 ${Math.ceil(row.need)}`)};
  }
  function buildHuntTargets(pokemon,islandName,options={}){
    const strategyApi=options.strategy||strategy,catalogApi=options.catalog||catalog;
    if(!strategyApi||typeof strategyApi.targetsForIsland!=='function')return [];
    const speciesRows=catalogApi&&Array.isArray(catalogApi.pokemon)?catalogApi.pokemon:[],bySpeciesId=new Map(speciesRows.map(row=>[String(row.id),row]));
    return strategyApi.targetsForIsland(islandName).map(target=>{
      const targetId=String(target.id),species=bySpeciesId.get(targetId),matches=(pokemon||[]).filter(mon=>String(mon.scoreBreakdown&&mon.scoreBreakdown.finalFormId||mon.finalFormId||mon.speciesId||'')===targetId).sort((a,b)=>(Number(b.scoreIndividual)||-Infinity)-(Number(a.scoreIndividual)||-Infinity)||(Number(b.scoreTotal)||-Infinity)-(Number(a.scoreTotal)||-Infinity)),best=matches[0]||null,specialty=best&&best.specialty||species&&species.specialty||'unknown';
      const assessment=best?strategyApi.minimumStandard(best,{finalId:targetId,specialty,strategicProfile:target.profile}):null,rule=strategyApi.ruleFor(targetId,specialty),status=!best?'missing':assessment&&assessment.meetsMinimum?'covered':'upgrade';
      return {id:targetId,name:target.profile&&target.profile.name||species&&species.name||`图鉴 #${targetId}`,note:target.note,profile:target.profile||null,status,count:matches.length,best,assessment,minimum:rule&&rule.minimum||'依照定位与Lv.50前三栏人工判断'};
    }).sort((a,b)=>({missing:0,upgrade:1,covered:2}[a.status]-{missing:0,upgrade:1,covered:2}[b.status]));
  }
  function calculatePlan(options){
    const activity=ACTIVITY_PROFILES[options.activityKey]||ACTIVITY_PROFILES.normal,pot=effectivePot(options.basePot,options.goodCamp),now=dateValue(options.now),daysRemaining=daysRemainingInWeek(now),mealGoal=clamp(Math.round(options.mealGoal||activity.defaultMealGoal),1,21),completedMeals=Array.isArray(options.completedMeals)?options.completedMeals.length:Number(options.completedMeals)||0,candidates=recipeRows(options.recipes,options.recipeType,pot),targetRecipe=candidates.find(recipe=>String(recipe.id)===String(options.targetRecipeId))||chooseTargetRecipe(options.recipes,options.recipeType,pot,{},options.inventory,mealGoal),remainingMeals=Math.max(0,mealGoal-Math.min(mealGoal,completedMeals));
    const preparationTeam=buildPreparationTeam({...options,activity,targetRecipe,remainingMeals,daysRemaining}),outputTeam=buildOutputTeam({...options,carryBonus:preparationTeam.carryBonus,fallbackMembers:preparationTeam.members}),budget=ingredientBudget(targetRecipe,preparationTeam.daily,options.inventory,mealGoal,completedMeals,daysRemaining),action=createActionPlan(budget,targetRecipe,preparationTeam,outputTeam,now),currentTeam=['output','complete'].includes(action.phase)?outputTeam:preparationTeam;
    const huntTargets=buildHuntTargets(options.pokemon,options.context&&options.context.island&&options.context.island.name,{strategy:options.strategy,catalog:options.catalog});
    return {activity,pot,targetRecipe,preparationTeam,outputTeam,currentTeam,budget,action,huntTargets,weekKey:weekKey(now)};
  }
  function defaults(ingredients,now){
    return {schemaVersion:2,islandIndex:0,berries:[],recipeType:'咖喱／浓汤',activityKey:'snapshot',goodCamp:true,basePot:81,mealGoal:15,targetRecipeId:'',completedMeals:[],weekKey:weekKey(now),inventory:Object.fromEntries(ingredients.map(name=>[name,0]))};
  }
  function normalizeState(value,ingredients,islandCount,now=new Date()){
    const base=defaults(ingredients,now),source=value&&typeof value==='object'?value:{},recipeType=['咖喱／浓汤','沙拉','点心／饮料','全部'].includes(source.recipeType)?source.recipeType:base.recipeType,activityKey=Object.hasOwn(ACTIVITY_PROFILES,source.activityKey)?source.activityKey:base.activityKey,currentWeek=weekKey(now),completed=source.weekKey===currentWeek&&Array.isArray(source.completedMeals)?[...new Set(source.completedMeals.filter(key=>VALID_MEAL_KEYS.has(key)))]:[];
    return {...base,...source,schemaVersion:2,recipeType,activityKey,goodCamp:source.goodCamp!==false,basePot:clamp(Math.round(source.basePot||base.basePot),1,1000),mealGoal:clamp(Math.round(source.mealGoal||base.mealGoal),1,21),targetRecipeId:String(source.targetRecipeId||''),islandIndex:clamp(Math.round(source.islandIndex),0,Math.max(0,islandCount-1)),completedMeals:completed,weekKey:currentWeek,inventory:{...base.inventory,...(source.inventory&&typeof source.inventory==='object'?source.inventory:{})}};
  }
  function mount(options={}){
    if(typeof document==='undefined')return null;const rootNode=document.querySelector('#weeklyPlanner');if(!rootNode)return null;
    let browserStorage=null;try{browserStorage=window.localStorage}catch(_error){}
    const pokemon=options.pokemon||[],islands=options.islands||[],recipes=options.recipes||[],ingredients=options.ingredients||[],storage=options.storage||browserStorage,teamPlanner=options.teamPlanner,production=options.production&&options.production.byBoxId||options.production||{},controls={island:document.querySelector('#weeklyIsland'),berries:document.querySelector('#weeklyBerries'),recipeType:document.querySelector('#weeklyRecipeType'),activity:document.querySelector('#weeklyActivity'),targetRecipe:document.querySelector('#weeklyTargetRecipe'),mealGoal:document.querySelector('#weeklyMealGoal'),camp:document.querySelector('#weeklyGoodCamp'),pot:document.querySelector('#weeklyPot'),inventory:document.querySelector('#weeklyInventory'),result:document.querySelector('#weeklyResult'),stamp:document.querySelector('#weeklySaveStamp')};
    let state=normalizeState(readJson(storage,STORAGE_KEY,{}),ingredients,islands.length),resetArmed=false,resetTimer=null;
    islands.forEach((island,index)=>{const item=document.createElement('option');item.value=String(index);item.textContent=island.name;controls.island.append(item)});
    Object.entries(ACTIVITY_PROFILES).forEach(([key,item])=>{const option=document.createElement('option');option.value=key;option.textContent=item.label;controls.activity.append(option)});
    function selectedBerries(){const island=islands[state.islandIndex],selects=[...controls.berries.querySelectorAll('select')];return selects.length?selects.map(select=>select.value):island.defaultBerries||String(island.berries||'').split('／')}
    function renderBerryControls(){
      const island=islands[state.islandIndex];controls.berries.replaceChildren();if(!island||!island.berryMode){controls.berries.hidden=true;return}controls.berries.hidden=false;
      const current=Array.isArray(state.berries)&&state.berries.length===3?state.berries:[...(island.defaultBerries||[])],all=options.allBerries||[];
      ['树果 1','树果 2','树果 3'].forEach((label,index)=>{const wrap=document.createElement('label');wrap.textContent=island.kind==='EX'&&index===0?'主树果':label;const select=document.createElement('select'),allowed=island.berryMode==='cyan-expert'&&index===0?['橙橙果','桃桃果','椰木果']:all;allowed.forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option)});select.value=current[index]||allowed[index]||allowed[0];select.addEventListener('change',()=>{state.berries=selectedBerries();persist();render()});wrap.append(select);controls.berries.append(wrap)});state.berries=selectedBerries();
    }
    function availableRecipes(){return recipeRows(recipes,state.recipeType,effectivePot(state.basePot,state.goodCamp))}
    function renderRecipeOptions(clearProgress=false){
      const rows=availableRecipes(),previous=state.targetRecipeId;controls.targetRecipe.replaceChildren();
      if(!rows.length){const option=document.createElement('option');option.value='';option.textContent='当前锅容量没有可用食谱';controls.targetRecipe.append(option);controls.targetRecipe.disabled=true;state.targetRecipeId='';return}
      controls.targetRecipe.disabled=false;rows.forEach(recipe=>{const option=document.createElement('option');option.value=String(recipe.id);option.textContent=`${recipe.name}｜${recipe.total} 格`;controls.targetRecipe.append(option)});
      if(!rows.some(recipe=>String(recipe.id)===String(state.targetRecipeId)))state.targetRecipeId=String(rows[0].id);controls.targetRecipe.value=state.targetRecipeId;
      if(clearProgress&&previous&&previous!==state.targetRecipeId)state.completedMeals=[];
    }
    function renderInventory(){
      controls.inventory.replaceChildren();ingredients.forEach(name=>{const label=document.createElement('label'),input=document.createElement('input');label.textContent=name;input.type='number';input.min='0';input.step='1';input.inputMode='numeric';input.value=String(Number(state.inventory[name])||0);input.dataset.ingredient=name;input.addEventListener('change',()=>{state.inventory[name]=Math.max(0,Number(input.value)||0);persist();render()});label.append(input);controls.inventory.append(label)});
    }
    function syncControls(){controls.island.value=String(state.islandIndex);controls.recipeType.value=state.recipeType;controls.activity.value=state.activityKey;controls.camp.checked=Boolean(state.goodCamp);controls.pot.value=String(state.basePot);controls.mealGoal.value=String(state.mealGoal);renderBerryControls();renderRecipeOptions();renderInventory()}
    function persist(){state.weekKey=weekKey();writeJson(storage,STORAGE_KEY,state);controls.stamp.textContent=`已保存 · ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}`;window.dispatchEvent(new CustomEvent('pokemon-sleep:local-change',{detail:{type:'weekly-plan'}}))}
    function context(){const island=islands[state.islandIndex];return {island,index:state.islandIndex,berries:selectedBerries(),expert:island.kind==='EX'}}
    function icon(name){const api=window.POKEMON_SLEEP_INGREDIENTS;return api&&api.create?api.create(name,{label:name}):document.createTextNode(name)}
    function teamCards(team){
      const grid=document.createElement('div');grid.className='weekly-team';(team.members||[]).forEach((mon,index)=>{const card=document.createElement('article');card.innerHTML=`<span>位置 ${index+1}</span><b>#${mon.id} ${mon.name}</b><small>Lv.${mon.lv} · ${mon.specialtyLabel||''}</small>`;grid.append(card)});return grid;
    }
    function overviewSection(report){
      const section=document.createElement('section');section.className='weekly-overview';const activityNote=report.activity.psychicSkillBonus&&!report.preparationTeam.eventArea?`${report.activity.note} 当前岛屿不在活动区域，因此不套用持有加成。`:report.activity.note;
      section.innerHTML=`<div><span>WEEK TARGET</span><h3>${report.targetRecipe?report.targetRecipe.name:'尚无可用目标食谱'} × ${report.budget.goal}</h3><p>${islands[state.islandIndex].name}｜${activityNote}</p></div><div class="weekly-overview-stats"><span><small>目标进度</small><b>${report.budget.completed} / ${report.budget.goal}</b></span><span><small>剩余目标餐</small><b>${report.budget.remaining}</b></span><span><small>食材缺口</small><b>${report.budget.rows.filter(row=>row.gapNow>.05).length} 种</b></span><span><small>本周剩余</small><b>${report.budget.daysRemaining} 天</b></span></div>`;return section;
    }
    function actionSection(report){
      const section=document.createElement('section');section.className=`weekly-action phase-${report.action.phase}`;const top=document.createElement('div');top.className='weekly-action-head';top.innerHTML=`<div><span>NOW｜当前行动</span><h3>${report.action.title}</h3></div><b>${teamPlanner.formatHours(report.action.collectionHours)} 收菜</b>`;const detail=document.createElement('p');detail.textContent=report.action.detail;const thresholds=document.createElement('div');thresholds.className='weekly-action-thresholds';report.action.thresholds.forEach(text=>{const chip=document.createElement('span');chip.textContent=text;thresholds.append(chip)});const timing=document.createElement('small');timing.textContent=`建议下一次收菜：约 ${report.action.collectAt}`;section.append(top,detail);if(report.action.thresholds.length)section.append(thresholds);section.append(timing);return section;
    }
    function teamSection(report){
      const section=document.createElement('section');section.className='weekly-section';section.innerHTML='<div class="weekly-section-head"><div><span>TEAM SWITCH</span><h3>现在用队与补齐后队伍</h3></div><small>准备队按目标食材缺口选择；输出队沿用岛屿推荐页</small></div>';const pair=document.createElement('div');pair.className='weekly-team-pair';
      const current=document.createElement('article');current.className='weekly-team-panel';current.innerHTML=`<div class="weekly-team-panel-head"><span>${['output','complete'].includes(report.action.phase)?'现在使用':'食材准备阶段'}</span><b>${['output','complete'].includes(report.action.phase)?'岛屿输出队':'目标食材准备队'}</b></div>`;current.append(teamCards(report.currentTeam));pair.append(current);
      if(!['output','complete'].includes(report.action.phase)){const after=document.createElement('article');after.className='weekly-team-panel';after.innerHTML='<div class="weekly-team-panel-head"><span>食材补齐后</span><b>切换岛屿输出队</b></div>';after.append(teamCards(report.outputTeam));pair.append(after)}else current.classList.add('wide');
      section.append(pair);return section;
    }
    function huntSection(report){
      const section=document.createElement('section');section.className='weekly-section weekly-hunt';section.innerHTML='<div class="weekly-section-head"><div><span>WEEKLY HUNT</span><h3>本周严选目标</h3></div><small>先补缺失岗位，再筛低于入盒线的个体；达标后才追毕业词条</small></div>';
      const grid=document.createElement('div');grid.className='weekly-hunt-grid';
      (report.huntTargets||[]).forEach(target=>{const card=document.createElement('article');card.className=`weekly-hunt-card status-${target.status}`;const status={missing:'盒内缺失',upgrade:'继续严选',covered:'已有达标'}[target.status]||'人工判断',best=target.best?`当前最好：#${target.best.id} ${target.best.name} · 个体 ${Number(target.best.scoreIndividual).toFixed(1)}${target.assessment?` · ${target.assessment.label}`:''}`:'盒内尚无该最终形态';card.innerHTML=`<div><span>${status}</span><b>${target.name}</b></div><p>${target.note}</p><small>${best}</small><details><summary>查看最低入盒标准</summary><p>${target.minimum}</p>${target.assessment&&target.assessment.missing.length?`<p>当前还缺：${target.assessment.missing.join('、')}</p>`:''}</details>`;grid.append(card)});
      if(!report.huntTargets||!report.huntTargets.length){const empty=document.createElement('p');empty.className='weekly-empty';empty.textContent='这个岛屿的攻略严选清单仍在整理中。';grid.append(empty)}
      section.append(grid);return section;
    }
    function budgetSection(report){
      const section=document.createElement('section');section.className='weekly-section';section.innerHTML='<div class="weekly-section-head"><div><span>INGREDIENT BUDGET</span><h3>剩余目标的食材预算</h3></div><small>库存是现在持有的数量；预计值按准备队与本周剩余天数计算</small></div>';const grid=document.createElement('div');grid.className='weekly-budget';
      if(!report.budget.rows.length){const empty=document.createElement('p');empty.className='weekly-empty';empty.textContent='选择目标食谱后会显示食材预算。';grid.append(empty)}
      report.budget.rows.forEach(row=>{const card=document.createElement('article');card.className=`weekly-budget-row ${row.projectedGap>.05?'short':row.gapNow>.05?'working':'ready'}`;const identity=document.createElement('div');identity.className='weekly-budget-name';identity.append(icon(row.name));const copy=document.createElement('div');copy.innerHTML=`<b>${row.name}</b><small>每餐 ${row.perMeal}</small>`;identity.append(copy);const stats=document.createElement('div');stats.className='weekly-budget-stats';[['剩余需求',row.need],['当前库存',row.stock],['准备队／日',row.perDay],['周末预计',row.projected]].forEach(([label,value])=>{const item=document.createElement('span');item.innerHTML=`<small>${label}</small><b>${value}</b>`;stats.append(item)});const status=document.createElement('strong');status.className='weekly-budget-state';status.textContent=row.projectedGap>.05?`预计仍缺 ${Math.ceil(row.projectedGap)}`:row.gapNow>.05?`约 ${row.daysToStock} 天补齐`:'库存已够';card.append(identity,stats,status);grid.append(card)});section.append(grid);return section;
    }
    function progressSection(report){
      const section=document.createElement('section');section.className='weekly-section';const head=document.createElement('div');head.className='weekly-section-head weekly-progress-head';head.innerHTML=`<div><span>MEAL CHECK</span><h3>目标料理完成记录 · ${report.budget.completed}/${report.budget.goal}</h3></div>`;const reset=document.createElement('button');reset.type='button';reset.className='weekly-reset';reset.textContent='清空本周勾选';reset.addEventListener('click',()=>{if(!resetArmed){resetArmed=true;reset.textContent='再点一次确认清空';if(resetTimer)clearTimeout(resetTimer);resetTimer=setTimeout(()=>{resetArmed=false;reset.textContent='清空本周勾选'},3000);return}resetArmed=false;if(resetTimer)clearTimeout(resetTimer);state.completedMeals=[];persist();render()});head.append(reset);const grid=document.createElement('div');grid.className='weekly-progress';
      DAY_NAMES.forEach((dayName,day)=>{const card=document.createElement('article');card.className='weekly-progress-day';const title=document.createElement('b');title.textContent=dayName;const meals=document.createElement('div');meals.className='weekly-progress-meals';MEAL_NAMES.forEach((mealName,meal)=>{const key=`d${day}-m${meal}`,label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=state.completedMeals.includes(key);label.className=input.checked?'done':'';input.setAttribute('aria-label',`${dayName}${mealName}餐已完成目标食谱`);input.addEventListener('change',()=>{const keys=new Set(state.completedMeals);input.checked?keys.add(key):keys.delete(key);state.completedMeals=[...keys].filter(value=>VALID_MEAL_KEYS.has(value));persist();render()});label.append(input,document.createTextNode(`${mealName}餐`));meals.append(label)});card.append(title,meals);grid.append(card)});section.append(head,grid);return section;
    }
    function logisticsDetails(report){const details=document.createElement('details');details.className='weekly-logistics';const summary=document.createElement('summary');summary.innerHTML=`<span>食材预算与料理记录</span><small>${report.budget.rows.filter(row=>row.gapNow>.05).length} 种缺口 · 已完成 ${report.budget.completed}/${report.budget.goal} 餐</small>`;const body=document.createElement('div');body.className='weekly-logistics-body';body.append(budgetSection(report),progressSection(report));details.append(summary,body);return details}
    function render(){
      if(!pokemon.length||!islands.length)return null;if(state.weekKey!==weekKey()){state.weekKey=weekKey();state.completedMeals=[];persist()}
      const report=calculatePlan({pokemon,context:context(),recommendTeams:options.recommendTeams,individualProductionScore:options.individualProductionScore,isFullTeamHealer:options.isFullTeamHealer,isSpecialPokemon:options.isSpecialPokemon,planner:teamPlanner,production,goodCamp:state.goodCamp,activityKey:state.activityKey,recipes,recipeType:state.recipeType,targetRecipeId:state.targetRecipeId,basePot:state.basePot,mealGoal:state.mealGoal,completedMeals:state.completedMeals,inventory:state.inventory,strategy:options.strategy,catalog:options.catalog});controls.result.replaceChildren(overviewSection(report),actionSection(report),huntSection(report),teamSection(report),logisticsDetails(report));return report;
    }
    controls.island.addEventListener('change',()=>{state.islandIndex=Number(controls.island.value);state.berries=[];renderBerryControls();persist();render()});
    controls.recipeType.addEventListener('change',()=>{state.recipeType=controls.recipeType.value;renderRecipeOptions(true);persist();render()});
    controls.activity.addEventListener('change',()=>{const previous=ACTIVITY_PROFILES[state.activityKey]||ACTIVITY_PROFILES.normal;state.activityKey=controls.activity.value;if(state.mealGoal===previous.defaultMealGoal){state.mealGoal=ACTIVITY_PROFILES[state.activityKey].defaultMealGoal;controls.mealGoal.value=String(state.mealGoal)}persist();render()});
    controls.targetRecipe.addEventListener('change',()=>{state.targetRecipeId=controls.targetRecipe.value;state.completedMeals=[];persist();render()});
    controls.mealGoal.addEventListener('change',()=>{state.mealGoal=clamp(Math.round(controls.mealGoal.value),1,21);controls.mealGoal.value=String(state.mealGoal);persist();render()});
    controls.camp.addEventListener('change',()=>{state.goodCamp=controls.camp.checked;renderRecipeOptions(true);persist();render()});
    controls.pot.addEventListener('change',()=>{state.basePot=clamp(Math.round(controls.pot.value),1,1000);controls.pot.value=String(state.basePot);renderRecipeOptions(true);persist();render()});
    syncControls();render();return {render,getState:()=>({...state}),calculatePlan};
  }
  return Object.freeze({STORAGE_KEY,ACTIVITY_PROFILES,MEAL_NAMES,DAY_NAMES,weekKey,daysRemainingInWeek,effectivePot,recipeRows,chooseTargetRecipe,individualIngredientProduction,buildPreparationTeam,buildOutputTeam,ingredientBudget,createActionPlan,buildHuntTargets,calculatePlan,normalizeState,mount});
});
