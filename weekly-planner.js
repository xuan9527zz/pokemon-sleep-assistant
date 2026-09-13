(function(root,factory){
  'use strict';
  const strategy=typeof module==='object'&&module.exports?require('./pokemon-strategy.js'):root.POKEMON_SLEEP_STRATEGY;
  const catalog=typeof module==='object'&&module.exports?require('./pokemon-catalog.generated.js'):root.POKEMON_SLEEP_CATALOG;
  const sleepResearch=typeof module==='object'&&module.exports?require('./sleep-research-planner.js'):root.POKEMON_SLEEP_RESEARCH_PLANNER;
  const gameRules=typeof module==='object'&&module.exports?require('./game-rules.js'):root.POKEMON_SLEEP_GAME_RULES;
  const cookingSuccess=typeof module==='object'&&module.exports?require('./cooking-success.js'):root.POKEMON_SLEEP_COOKING_SUCCESS;
  const api=factory(strategy,catalog,sleepResearch,gameRules,cookingSuccess);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_WEEKLY_PLANNER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(strategy,catalog,sleepResearch,gameRules,cookingSuccess){
  'use strict';

  const STORAGE_KEY='pokemon-sleep-weekly-plan-v1';
  const LIMITS=gameRules&&gameRules.LIMITS||{ingredientPocket:800,permanentPot:81};
  const INVENTORY_LIMIT=LIMITS.ingredientPocket;
  const ACTIVITY_PROFILES=Object.freeze({
    normal:{label:'普通周',carryBonus:0,cookingEnergyMultiplier:1,note:'无活动临时加成。',defaultMealGoal:21},
    snapshot:{label:'梦幻拍照活动（已结束）',carryBonus:0,cookingEnergyMultiplier:1,note:'活动已于 2026-09-07 03:59 结束，仅保留历史档案。',defaultMealGoal:15,archived:true},
    mewtwo1:{label:'超梦登场活动·第1周',eventAreas:Object.freeze(['萌绿之岛','萌绿之岛 EX']),bonusBerries:Object.freeze(['芒芒果']),carryBonus:8,mainSkillLevelBonus:2,ingredientHelpBonus:1,skillTriggerMultiplier:1.5,cookingEnergyMultiplier:1,sleepDrowsyPowerMultiplier:1.1,sleepBonusSpecies:Object.freeze(['梦幻','超梦']),favoriteBerry:'芒芒果',note:'仅萌绿之岛／萌绿之岛 EX：芒芒果固定喜爱；全员持有＋8，超能力系主技能等级＋2、触发率 ×1.5、食材帮忙＋1；梦幻或超梦随队睡眠时睡意之力 ×1.1。',defaultMealGoal:15},
    mewtwo2:{label:'超梦登场活动·第2周',eventAreas:Object.freeze(['萌绿之岛','萌绿之岛 EX']),bonusBerries:Object.freeze(['芒芒果']),carryBonus:15,mainSkillLevelBonus:5,ingredientHelpBonus:1,skillTriggerMultiplier:1.5,cookingEnergyMultiplier:1,sleepDrowsyPowerMultiplier:1.3,sleepBonusSpecies:Object.freeze(['超梦']),favoriteBerry:'芒芒果',note:'仅萌绿之岛／萌绿之岛 EX：芒芒果固定喜爱；全员持有＋15，超能力系主技能等级＋5、触发率 ×1.5、食材帮忙＋1；超梦随队睡眠时睡意之力 ×1.3。',defaultMealGoal:15},
    cooking125:{label:'料理能量＋25%',carryBonus:0,cookingEnergyMultiplier:1.25,note:'活动料理能量＋25%；完整推演会把倍率计入每餐能量。',defaultMealGoal:15},
    cooking150:{label:'料理能量＋50%',carryBonus:0,cookingEnergyMultiplier:1.5,note:'活动料理能量＋50%；完整推演会把倍率计入每餐能量。',defaultMealGoal:15}
  });
  const MEAL_NAMES=Object.freeze(['早','午','晚']);
  const DAY_NAMES=Object.freeze(['周一','周二','周三','周四','周五','周六','周日']);
  const RECIPE_TYPES=Object.freeze(['咖喱／浓汤','沙拉','点心／饮料']);
  const VALID_MEAL_KEYS=new Set(DAY_NAMES.flatMap((_day,day)=>MEAL_NAMES.map((_meal,meal)=>`d${day}-m${meal}`)));
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  const sum=values=>values.reduce((total,value)=>total+(Number(value)||0),0);
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
  function calculateDrowsyPower(snorlaxStrength,sleepScore,multiplier=1){return sleepResearch.calculateDrowsyPower(snorlaxStrength,sleepScore,multiplier)}
  function sleepMultiplierForTeam(activity,team,eventArea=true){
    const required=Array.isArray(activity&&activity.sleepBonusSpecies)?activity.sleepBonusSpecies:[],members=Array.isArray(team)?team:[],matched=required.find(name=>members.some(mon=>String(mon&&mon.name||'')===name))||'';
    const active=Boolean(eventArea&&matched&&Number(activity&&activity.sleepDrowsyPowerMultiplier)>1);
    return {multiplier:active?Number(activity.sleepDrowsyPowerMultiplier):1,active,matched,required};
  }
  function calculateSleepPlan(options={}){return sleepResearch.TARGET_OBJECTIVES.has(options.objective)?sleepResearch.compareTargetSleepPlans(options):sleepResearch.compareSleepPlans(options)}
  function effectivePot(base,goodCamp){return gameRules&&gameRules.finalPotCapacity?gameRules.finalPotCapacity({baseCapacity:base,goodCamp}):Math.round(clamp(Math.round(base),1,LIMITS.permanentPot)*(goodCamp?1.5:1))}
  function recipeRows(recipes,type,pot,energyFor=recipe=>Number(recipe.energy)||0){
    return (recipes||[]).filter(recipe=>Number(energyFor(recipe))>0&&Number(recipe.total)<=pot&&(!type||type==='全部'||recipe.type===type)).sort((a,b)=>Number(energyFor(b))-Number(energyFor(a))||Number(a.total)-Number(b.total));
  }
  function chooseTargetRecipe(recipes,type,pot,daily={},inventory={},mealGoal=15,energyFor=recipe=>Number(recipe.energy)||0){
    const candidates=recipeRows(recipes,type,pot,energyFor);if(!candidates.length)return null;
    return candidates.map(recipe=>{
      const coverage=recipe.ingredients.reduce((sum,item)=>sum+Math.min(1,((Number(daily[item.name])||0)*7+(Number(inventory[item.name])||0))/(item.amount*mealGoal)),0)/Math.max(1,recipe.ingredients.length);
      return {recipe,score:Number(energyFor(recipe))*(.45+.55*coverage)};
    }).sort((a,b)=>b.score-a.score||Number(energyFor(b.recipe))-Number(energyFor(a.recipe)))[0].recipe;
  }
  function isEventArea(context){return /萌绿之岛/.test(String(context&&context.island&&context.island.name||''))}
  function isPsychic(mon){return String(mon&&mon.berry||'')==='芒芒果'}
  function activityApplies(activity,context){
    const areas=Array.isArray(activity&&activity.eventAreas)?activity.eventAreas:[];
    return !areas.length||areas.includes(String(context&&context.island&&context.island.name||''));
  }
  function activityEligibleMember(activity,mon){
    const berries=Array.isArray(activity&&activity.bonusBerries)?activity.bonusBerries:[];
    return berries.length?berries.includes(String(mon&&mon.berry||'')):false;
  }
  function activityMemberModifier(activity,eventArea){
    return mon=>eventArea&&activityEligibleMember(activity,mon)?{
      ingredientHelpBonus:Number(activity.ingredientHelpBonus)||0,
      skillTriggerMultiplier:Number(activity.skillTriggerMultiplier)||1,
      mainSkillLevelBonus:Number(activity.mainSkillLevelBonus)||0,
      label:activity.label
    }:{};
  }
  function plannerOptions(goodCamp,activity,eventArea,extra={}){return {...extra,goodCamp,energyProfile:'timeline',memberModifier:activityMemberModifier(activity,eventArea)}}
  function applyActivityContext(context,activity){
    if(!context||!activityApplies(activity,context)||!activity.favoriteBerry)return context;
    const berries=[activity.favoriteBerry,...(context.berries||[]).filter(name=>name!==activity.favoriteBerry)].slice(0,3);
    return {...context,berries};
  }
  function mergeTargetRecipes(recipes){
    const rows=(recipes||[]).filter(Boolean);if(rows.length<=1)return rows[0]||null;
    const amounts=new Map();rows.forEach(recipe=>(recipe.ingredients||[]).forEach(item=>amounts.set(item.name,Math.max(amounts.get(item.name)||0,Number(item.amount)||0))));
    return {id:`routes:${rows.map(recipe=>recipe.id).join('+')}`,name:`${rows.map(recipe=>recipe.type).join('＋')}双路线储备`,type:'活动前储备',energy:0,total:[...amounts.values()].reduce((sum,value)=>sum+value,0),ingredients:[...amounts].map(([name,amount])=>({name,amount})),routes:rows};
  }
  function withCarry(mon,carryBonus){return carryBonus?{...mon,inv:String((Number(mon.inv)||0)+carryBonus)}:mon}
  function mergeDaily(target,source){Object.entries(source||{}).forEach(([name,amount])=>{target[name]=(target[name]||0)+(Number(amount)||0)});return target}
  function individualIngredientProduction(mon,planner,production,goodCamp,carryBonus,activity=ACTIVITY_PROFILES.normal,eventArea=false,teamSettings={}){
    const result=planner.calculateTeam([withCarry(mon,carryBonus)],production,plannerOptions(goodCamp,activity,eventArea,teamSettings)),member=result.members[0],daily={};
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
    const eligible=(pokemon||[]).filter(mon=>mon.battleEligible!==false),eventArea=activityApplies(activity,context),carryBonus=eventArea?Number(activity.carryBonus)||0:0,teamSettings=options.teamSettings||{};
    const outputValue=mon=>Number(individualProductionScore(mon,context))||0,maxOutput=Math.max(1,...eligible.map(outputValue)),healers=eligible.filter(isFullTeamHealer).filter(mon=>!isSpecialPokemon(mon.id)).sort((a,b)=>outputValue(b)-outputValue(a)),healer=healers[0]||null;
    const rows=eligible.filter(mon=>!isFullTeamHealer(mon)&&!isSpecialPokemon(mon.id)).map(mon=>({mon,ingredient:individualIngredientProduction(mon,planner,production,goodCamp,carryBonus,activity,eventArea,teamSettings),island:outputValue(mon)/maxOutput*100}));
    const selected=healer?[healer]:[],selectedRows=[],aggregate={};
    if(healer)mergeDaily(aggregate,individualIngredientProduction(healer,planner,production,goodCamp,carryBonus,activity,eventArea,teamSettings).daily);
    const required=requirementMap(targetRecipe,remainingMeals,daysRemaining),slots=5-selected.length;
    for(let slot=0;slot<slots&&rows.length;slot++){
      const before=normalizedDeficit(aggregate,required);
      rows.forEach(row=>{const combined=mergeDaily({...aggregate},row.ingredient.daily),gain=before-normalizedDeficit(combined,required);row.pickScore=gain*100+row.island*.12});
      rows.sort((a,b)=>b.pickScore-a.pickScore||b.island-a.island||Number(a.mon.id)-Number(b.mon.id));
      const best=rows.shift();selected.push(best.mon);selectedRows.push(best);mergeDaily(aggregate,best.ingredient.daily);
    }
    while(selected.length<5){const fallback=eligible.filter(mon=>!isSpecialPokemon(mon.id)&&!selected.includes(mon)).sort((a,b)=>outputValue(b)-outputValue(a))[0];if(!fallback)break;selected.push(fallback)}
    const result=planner.calculateTeam(selected.map(mon=>withCarry(mon,carryBonus)),production,plannerOptions(goodCamp,activity,eventArea,teamSettings)),daily=Object.fromEntries(result.ingredients.map(item=>[item.name,item.perDay]));
    return {members:selected,production:result,daily,candidateRows:selectedRows,eventArea,carryBonus,requiredDaily:required};
  }
  function buildOutputTeam(options){
    const {pokemon,context,recommendTeams,planner,production,goodCamp}=options,isSpecialPokemon=options.isSpecialPokemon||(()=>false),activity=options.activity||ACTIVITY_PROFILES.normal,eventArea=activityApplies(activity,context),carryBonus=Number(options.carryBonus)||0,eligible=(pokemon||[]).filter(mon=>mon.battleEligible!==false&&!isSpecialPokemon(mon.id)),byId=new Map(eligible.map(mon=>[String(mon.id),mon])),recommendation=recommendTeams&&recommendTeams(context),regular=recommendation&&recommendation.regular||{},members=[],teamSettings=options.teamSettings||{};
    (regular.ids||[]).forEach(id=>{const mon=byId.get(String(id));if(mon&&!members.includes(mon)&&members.length<5)members.push(mon)});
    (options.fallbackMembers||[]).forEach(mon=>{if(mon&&byId.has(String(mon.id))&&!members.includes(mon)&&members.length<5)members.push(mon)});
    eligible.forEach(mon=>{if(!members.includes(mon)&&members.length<5)members.push(mon)});
    const result=planner.calculateTeam(members.map(mon=>withCarry(mon,carryBonus)),production,plannerOptions(goodCamp,activity,eventArea,teamSettings)),daily=Object.fromEntries(result.ingredients.map(item=>[item.name,item.perDay]));
    return {members,production:result,daily,label:regular.label||'岛屿输出队'};
  }
  function ingredientBudget(targetRecipe,daily,inventory,mealGoal,completedMeals,daysRemaining,inventoryLimit=INVENTORY_LIMIT){
    const goal=clamp(Math.round(mealGoal),1,21),completed=Math.min(goal,Math.max(0,Math.round(completedMeals))),remaining=Math.max(0,goal-completed),safeInventory=inventory&&typeof inventory==='object'?inventory:{},inventoryTotal=Object.values(safeInventory).reduce((sum,value)=>sum+Math.max(0,Number(value)||0),0),freeCapacity=Math.max(0,inventoryLimit-inventoryTotal),recipeTotal=Math.max(0,Number(targetRecipe&&targetRecipe.total)||0),targetStock=(targetRecipe&&targetRecipe.ingredients||[]).reduce((sum,item)=>sum+Math.max(0,Number(safeInventory[item.name])||0),0),maxBatchMeals=recipeTotal>0?Math.max(0,Math.floor((targetStock+freeCapacity)/recipeTotal)):remaining,batchMeals=Math.min(remaining,maxBatchMeals),rows=(targetRecipe&&targetRecipe.ingredients||[]).map(item=>{
      const need=item.amount*batchMeals,stock=Math.max(0,Number(safeInventory[item.name])||0),perDay=Number(daily&&daily[item.name])||0,gapNow=Math.max(0,need-stock),projected=Math.min(Math.max(stock,need),stock+perDay*Math.max(1,daysRemaining)),projectedGap=Math.max(0,need-projected),daysToStock=gapNow<=0?0:perDay>0?gapNow/perDay:Infinity;
      return {name:item.name,perMeal:item.amount,need:round(need),stock:round(stock),perDay:round(perDay),gapNow:round(gapNow),projected:round(projected),projectedGap:round(projectedGap),daysToStock:Number.isFinite(daysToStock)?round(daysToStock,1):null};
    });
    return {goal,completed,remaining,batchMeals,maxBatchMeals,inventoryTotal:round(inventoryTotal),inventoryLimit,freeCapacity:round(freeCapacity),daysRemaining,rows,allStocked:batchMeals>0&&rows.every(row=>row.gapNow<=.05),projectedShortages:rows.filter(row=>row.projectedGap>.05),maxDaysToStock:rows.reduce((max,row)=>row.gapNow<=.05?max:row.daysToStock===null?Infinity:Math.max(max,row.daysToStock),0)};
  }
  function createActionPlan(budget,targetRecipe,preparationTeam,outputTeam,now,options={}){
    const collectionHours=Number((budget.allStocked?outputTeam:preparationTeam).production.collectionHours)||4,nextCollect=new Date(dateValue(now).getTime()+collectionHours*3600000),collectAt=new Intl.DateTimeFormat('zh-CN',{weekday:'short',hour:'2-digit',minute:'2-digit'}).format(nextCollect);
    const strategyNotes=[];
    if(options.weekMode==='preparation'&&options.targetGoodCamp)strategyNotes.push('活动周目标锅已按好露营券的 1.5 倍容量选食谱，本周产量仍只读取“本周已启用”开关。');
    if(options.weekMode==='preparation'&&options.travelTicketPlanned&&options.targetRecipes&&options.targetRecipes.some(recipe=>recipe.type==='沙拉')&&options.targetRecipes.some(recipe=>recipe.type==='咖喱／浓汤'))strategyNotes.push('活动首日若抽到点心／饮料，可使用移动营地券重抽；命中沙拉或咖喱后，只消耗对应路线库存。');
    const finish=plan=>({...plan,detail:`${plan.detail}${strategyNotes.length?` ${strategyNotes.join(' ')}`:''}`});
    if(!targetRecipe)return finish({phase:'setup',title:'先选择可制作的目标食谱',detail:'当前锅容量与料理类别下没有可用食谱，请调整高级设置。',collectionHours,collectAt,thresholds:[]});
    if(budget.remaining===0)return finish({phase:'complete',title:'本周目标已经完成',detail:'目标餐数已全部勾选；接下来可以直接使用岛屿输出队。',collectionHours,collectAt,thresholds:[]});
    if(budget.batchMeals===0)return finish({phase:'adjust',title:'仓库已满，先清出可用空间',detail:`当前库存 ${Math.ceil(budget.inventoryTotal)} / ${budget.inventoryLimit}，没有空间容纳一餐目标料理。先消耗非储备食材，再按新库存重新规划。`,collectionHours,collectAt,thresholds:[]});
    const batchNote=budget.batchMeals<budget.remaining?`本次只规划仓库放得下的 ${budget.batchMeals} 餐；用掉后会自动计算下一批。`:`本批覆盖剩余 ${budget.batchMeals} 餐。`,preparing=options.weekMode==='preparation';
    if(budget.allStocked)return finish({phase:'output',title:preparing?'活动前储备：本批目标已备齐':'本批库存已够，切换岛屿输出队',detail:`${batchNote}${preparing?' 当前以保存目标食材、避免误消耗为主。':' 不需要继续占用食材准备位。'}`,collectionHours,collectAt,thresholds:budget.rows.map(row=>`${row.name}保留 ${Math.ceil(row.need)}`)});
    if(budget.projectedShortages.length){
      const names=budget.projectedShortages.map(row=>`${row.name}约缺${Math.ceil(row.projectedGap)}`).join('、');
      return finish({phase:'adjust',title:preparing?'活动前储备：先补本批食材':'先补食材，但本批目标可能需要下调',detail:`${batchNote}按当前盒子与剩余 ${budget.daysRemaining} 天估算，仍会${names}。可减少本批餐数或改选低需求食谱。`,collectionHours,collectAt,thresholds:budget.rows.filter(row=>row.gapNow>.05).map(row=>`${row.name}库存到 ${Math.ceil(row.need)}`)});
    }
    const days=Number.isFinite(budget.maxDaysToStock)?Math.max(.1,budget.maxDaysToStock):budget.daysRemaining;
    return finish({phase:'prepare',title:preparing?'活动前储备：现在先用食材准备队':'现在先用食材准备队',detail:`预计约 ${round(days,1)} 天补齐。${batchNote}达到下列库存后切换岛屿输出队。`,collectionHours,collectAt,thresholds:budget.rows.filter(row=>row.gapNow>.05).map(row=>`${row.name}库存到 ${Math.ceil(row.need)}`)});
  }
  function teamRates(team){
    const report=team&&team.production||team&&team.result||team,duration=Math.max(.5,Number(report&&report.energy&&report.energy.durationHours)||24),ingredients={};
    (report&&report.ingredients||[]).forEach(item=>{ingredients[item.name]=(ingredients[item.name]||0)+(Number(item.perDay)||0)/24});
    return {energyPerHour:(Number(report&&report.energy&&report.energy.totalEnergy)||0)/duration,ingredients};
  }
  function teamBreakdown(team){
    const report=team&&team.production||team&&team.result||team;
    if(!report||!report.energy)return null;
    const duration=Math.max(.5,Number(report.energy.durationHours)||24),ingredients={};
    (report.ingredients||[]).forEach(item=>{ingredients[item.name]=(ingredients[item.name]||0)+(Number(item.perDay)||0)*duration/24});
    const members=(report.members||[]).map((member,index)=>{
      const energy=member.snorlaxEnergy||report.energy.members&&report.energy.members[index]||{},memberIngredients={};
      (member.ingredients||[]).forEach(item=>{memberIngredients[item.name]=(memberIngredients[item.name]||0)+(Number(item.perDay)||0)*duration/24});
      return {id:String(member.mon&&member.mon.id||energy.id||''),helps:Number(energy.helps)||0,normalHelps:Number(energy.normalHelps)||0,sneakyHelps:Number(energy.sneakyHelps)||0,berries:Number(energy.berries)||0,ingredients:memberIngredients,triggers:Number(energy.triggers)||0,lostTriggers:Number(energy.lostTriggers)||0,endingEnergy:Number(energy.endingEnergy),berryEnergy:Number(energy.berryEnergy)||0,skillEnergy:(Number(energy.directSkillEnergy)||0)+(Number(energy.complexSkillEnergy)||0),totalEnergy:Number(energy.totalEnergy)||0};
    });
    return {durationHours:duration,collectionHours:Number(report.collectionHours)||Number(report.energy.skillCollectionHours)||0,ingredients,members,helps:sum(members.map(member=>member.helps)),normalHelps:sum(members.map(member=>member.normalHelps)),sneakyHelps:sum(members.map(member=>member.sneakyHelps)),berries:sum(members.map(member=>member.berries)),triggers:sum(members.map(member=>member.triggers)),lostTriggers:sum(members.map(member=>member.lostTriggers)),berryEnergy:Number(report.energy.berryEnergy)||0,skillEnergy:Number(report.energy.totalSkillEnergy)||0,totalEnergy:Number(report.energy.totalEnergy)||0};
  }
  function activityCookingMultiplier(activity){return clamp(Number(activity&&activity.cookingEnergyMultiplier)||1,.01,10)}
  function finalPotCapacity(baseCapacity,goodCamp,activity){
    const eventMultiplier=Number(activity&&activity.potCapacityMultiplier)||1;
    return gameRules&&gameRules.finalPotCapacity?gameRules.finalPotCapacity({baseCapacity,goodCamp,eventMultiplier}):Math.round(baseCapacity*(goodCamp?1.5:1)*eventMultiplier);
  }
  function ingredientTotals(inventory,rates,hours){
    const totals={...inventory};
    rates.forEach((rate,index)=>Object.entries(rate.ingredients||{}).forEach(([name,value])=>{totals[name]=(Number(totals[name])||0)+(Number(value)||0)*(Number(hours[index])||0)}));
    return totals;
  }
  function craftableMeals(recipe,totals,limit){
    const rows=recipe&&recipe.ingredients||[];if(!rows.length)return 0;
    return Math.max(0,Math.min(Math.max(0,Math.round(limit)||0),...rows.map(item=>Math.floor((Number(totals[item.name])||0)/Math.max(1,Number(item.amount)||0)))));
  }
  function sundayMealShare(days,now){
    const start=dateValue(now),dayCount=clamp(Math.round(days)||1,1,14);let sundays=0;
    for(let offset=0;offset<dayCount;offset+=1){const date=new Date(start);date.setDate(start.getDate()+offset);if(date.getDay()===0)sundays+=1}
    return sundays/dayCount;
  }
  function expectedCookingMultiplier(state,activityMultiplier,sundayShare){
    if(!cookingSuccess||typeof cookingSuccess.expectedMealOutcome!=='function')return Number(activityMultiplier)||1;
    const weekday=cookingSuccess.expectedMealOutcome(state,{isSunday:false,activityMultiplier}),sunday=cookingSuccess.expectedMealOutcome(state,{isSunday:true,activityMultiplier}),share=clamp(sundayShare,0,1);
    return weekday.expectedMultiplier*(1-share)+sunday.expectedMultiplier*share;
  }
  function scheduleClock(start,hours){
    const date=new Date(start.getTime()+Math.max(0,Number(hours)||0)*3600000),weekday=['周日','周一','周二','周三','周四','周五','周六'][date.getDay()];return `${weekday} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
  }
  function buildShiftSchedule(start,totalHours,prepareHours,tastyHoursPerMeal,tastyMeals){
    const origin=new Date(start),stepMinutes=15,stepMs=stepMinutes*60000,end=new Date(origin.getTime()+Math.max(0,Number(totalHours)||0)*3600000),slotCount=Math.max(0,Math.ceil((end-origin)/stepMs)),slots=Array.from({length:slotCount},(_,index)=>({start:new Date(origin.getTime()+index*stepMs),end:new Date(Math.min(end.getTime(),origin.getTime()+(index+1)*stepMs)),kind:'output'}));
    const anchors=[],cursor=new Date(origin);cursor.setHours(0,0,0,0);
    while(cursor<end){[6,12,18].forEach(hour=>{const value=new Date(cursor);value.setHours(hour,0,0,0);if(value>origin&&value<=end)anchors.push(value)});cursor.setDate(cursor.getDate()+1)}
    const selected=anchors.slice(0,Math.max(0,Math.round(Number(tastyMeals)||0))),perMealSlots=Math.max(0,Math.round((Number(tastyHoursPerMeal)||0)*60/stepMinutes));
    selected.forEach(anchor=>{
      let remaining=perMealSlots;
      for(let index=slots.length-1;index>=0&&remaining>0;index-=1){const slot=slots[index];if(slot.kind==='output'&&slot.end<=anchor){slot.kind='tasty';remaining-=1}}
    });
    let prepareSlots=Math.max(0,Math.round((Number(prepareHours)||0)*60/stepMinutes));
    for(const slot of slots){if(prepareSlots<=0)break;if(slot.kind==='output'){slot.kind='prepare';prepareSlots-=1}}
    const segments=[];
    slots.forEach(slot=>{const previous=segments[segments.length-1],sameDay=previous&&previous.start.toDateString()===slot.start.toDateString();if(previous&&previous.kind===slot.kind&&previous.end.getTime()===slot.start.getTime()&&sameDay)previous.end=slot.end;else segments.push({...slot})});
    const rows=[];
    segments.forEach(segment=>{const key=segment.start.toDateString();let row=rows.find(item=>item.key===key);if(!row){row={key,label:`${segment.start.getMonth()+1}月${segment.start.getDate()}日 ${['周日','周一','周二','周三','周四','周五','周六'][segment.start.getDay()]}`,entries:[]};rows.push(row)}row.entries.push({kind:segment.kind,start:`${String(segment.start.getHours()).padStart(2,'0')}:${String(segment.start.getMinutes()).padStart(2,'0')}`,end:`${String(segment.end.getHours()).padStart(2,'0')}:${String(segment.end.getMinutes()).padStart(2,'0')}`})});
    return {rows,segments,stepMinutes};
  }
  function scheduleSummary(schedule,kind){
    const matches=(schedule&&schedule.segments||[]).filter(segment=>segment.kind===kind),format=date=>`${['周日','周一','周二','周三','周四','周五','周六'][date.getDay()]} ${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
    if(!matches.length)return '没有安排';const first=matches.slice(0,2).map(segment=>`${format(segment.start)}～${format(segment.end)}`).join('；');return matches.length>2?`${first} 等 ${matches.length} 段`:first;
  }
  function simulateActivityWeek(options={}){
    const activity=options.activity||ACTIVITY_PROFILES.normal,context=applyActivityContext(options.context,activity),recipe=options.targetRecipe,days=clamp(Math.round(options.days)||7,1,14),requestedMeals=clamp(Math.round(options.mealGoal)||days*3,1,42),totalHours=days*24,goodCamp=options.goodCamp===true,baseCapacity=clamp(Math.round(options.basePot)||LIMITS.permanentPot,1,LIMITS.permanentPot),teamSettings={islandBonusPct:Math.max(0,Number(options.islandBonusPct)||0),islandProfile:String(options.islandProfile||'none'),favoriteBerries:[...(context&&context.berries||[])],startEnergy:100,sleepScore:100,skillCollectionHours:clamp(Number(options.skillCollectionHours)||4,.5,24),collectBeforeSwap:options.collectBeforeSwap!==false,exWeeklyEffect:String(options.exWeeklyEffect||'none')};
    if(!recipe||!(recipe.ingredients||[]).length)return {available:false,reason:'没有可推演的目标食谱。',activity,days,requestedMeals,targetRecipe:recipe||null};
    const eventArea=activityApplies(activity,context),carryBonus=eventArea?Number(activity.carryBonus)||0:0,preparationTeam=buildPreparationTeam({...options,context,activity,goodCamp,targetRecipe:recipe,remainingMeals:requestedMeals,daysRemaining:days,teamSettings}),outputTeam=buildOutputTeam({...options,context,activity,goodCamp,carryBonus,fallbackMembers:preparationTeam.members,teamSettings});
    const targetSetting=Number(options.tastyTargetPct),basePotFinal=finalPotCapacity(baseCapacity,goodCamp,activity),needsPot=Number(recipe.total)>basePotFinal,capacityReady=!needsPot,autoTasty=options.autoTasty!==false,tastyTargetPct=clamp(Math.round(Number.isFinite(targetSetting)?targetSetting:70),0,70),tastyPokemon=(options.pokemon||[]).map(mon=>withCarry(mon,carryBonus)),tastyOptions=plannerOptions(goodCamp,activity,eventArea,{...teamSettings,currentBonusPct:0,targetBonusPct:tastyTargetPct,confidence:.8}),tastyDeployment=capacityReady&&autoTasty&&tastyTargetPct>0&&options.planner&&typeof options.planner.calculateTastyDeployment==='function'?options.planner.calculateTastyDeployment(tastyPokemon,options.production,tastyOptions):null,tastyHoursPerMeal=tastyDeployment&&tastyDeployment.reachable?Math.max(0,Number(tastyDeployment.estimate&&tastyDeployment.estimate.safeHours)||0):0,maxTastyMeals=tastyHoursPerMeal>0?Math.min(requestedMeals,Math.floor(totalHours/tastyHoursPerMeal)):0,plannedMeals=capacityReady?requestedMeals:0;
    const preparationRates=teamRates(preparationTeam),outputRates=teamRates(outputTeam),tastyRates=teamRates(tastyDeployment&&tastyDeployment.tastyTeam&&tastyDeployment.tastyTeam.result),inventory=options.inventory&&typeof options.inventory==='object'?options.inventory:{},step=.25,cookingMultiplier=activityCookingMultiplier(activity),baseMealEnergy=Math.max(0,Math.floor(Number(options.recipeEnergy&&options.recipeEnergy(recipe))||0)),sundayShare=sundayMealShare(days,options.now),baselineState=cookingSuccess&&typeof cookingSuccess.initialBonusState==='function'?cookingSuccess.initialBonusState(0):null,boostedState=tastyDeployment&&tastyDeployment.estimate&&tastyDeployment.estimate.state||baselineState,baselineExpectedMultiplier=expectedCookingMultiplier(baselineState,cookingMultiplier,sundayShare),boostedExpectedMultiplier=expectedCookingMultiplier(boostedState,cookingMultiplier,sundayShare);
    function solve(stock){let choice=null;
      for(let tastyMeals=0;tastyMeals<=maxTastyMeals;tastyMeals+=1){
        const tastyHours=tastyHoursPerMeal*tastyMeals,fieldHours=Math.max(0,totalHours-tastyHours),steps=Math.ceil(fieldHours/step);
        for(let index=0;index<=steps;index+=1){
          const prepareHours=Math.min(fieldHours,index*step),outputHours=Math.max(0,fieldHours-prepareHours),totals=ingredientTotals(stock,[preparationRates,outputRates,tastyRates],[prepareHours,outputHours,tastyHours]),meals=craftableMeals(recipe,totals,plannedMeals),boostedMeals=Math.min(tastyMeals,meals),helperEnergy=preparationRates.energyPerHour*prepareHours+outputRates.energyPerHour*outputHours+tastyRates.energyPerHour*tastyHours,cookingEnergy=baseMealEnergy*(boostedMeals*boostedExpectedMultiplier+(meals-boostedMeals)*baselineExpectedMultiplier),candidate={prepareHours,outputHours,tastyHours,tastyMeals,boostedMeals,totals,meals,helperEnergy,cookingEnergy,totalGain:helperEnergy+cookingEnergy};
          if(!choice||candidate.meals>choice.meals||(candidate.meals===choice.meals&&candidate.totalGain>choice.totalGain))choice=candidate;
        }
      }
      return choice||{prepareHours:0,outputHours:totalHours,tastyHours:0,tastyMeals:0,boostedMeals:0,totals:{...stock},meals:0,helperEnergy:outputRates.energyPerHour*totalHours,cookingEnergy:0,totalGain:outputRates.energyPerHour*totalHours};
    }
    const best=solve(inventory),withoutStock=solve({}),stockSavedPrepareHours=Math.max(0,withoutStock.prepareHours-best.prepareHours),scheduleStart=new Date(options.now||Date.now()),schedule=buildShiftSchedule(scheduleStart,totalHours,best.prepareHours,tastyHoursPerMeal,best.tastyMeals);
    const stageSpecs=[best.prepareHours>.01?{kind:'prepare',label:'食材准备队',hours:best.prepareHours,members:preparationTeam.members}:null,best.tastyHours>.01?{kind:'tasty',label:`爆锅队／料理成功 S（每餐前约 ${round(tastyHoursPerMeal,1)} 小时）`,hours:best.tastyHours,members:tastyDeployment&&tastyDeployment.tastyTeam&&tastyDeployment.tastyTeam.team||[],repeated:best.tastyMeals}:null,best.outputHours>.01?{kind:'output',label:'岛屿输出队',hours:best.outputHours,members:outputTeam.members}:null].filter(Boolean),stageReports=stageSpecs.map((stage,index)=>{
      const switchesAtEnd=index<stageSpecs.length-1,team=(stage.members||[]).map(mon=>withCarry(mon,carryBonus)),report=stage.hours>=.5&&options.planner&&typeof options.planner.calculateTeam==='function'?options.planner.calculateTeam(team,options.production,plannerOptions(goodCamp,activity,eventArea,{...teamSettings,durationHours:stage.hours,swapAtEnd:switchesAtEnd})):null;
      return {...stage,report,breakdown:teamBreakdown(report),energy:report?Number(report.energy.totalEnergy)||0:(stage.kind==='prepare'?preparationRates:stage.kind==='tasty'?tastyRates:outputRates).energyPerHour*stage.hours,lostTriggers:report&&report.energy&&report.energy.timeline?report.energy.timeline.totals.lostTriggers:0};
    }),exactRates=stageReports.map(stage=>stage.report?teamRates(stage.report):stage.kind==='prepare'?preparationRates:stage.kind==='tasty'?tastyRates:outputRates),exactTotals=ingredientTotals(inventory,exactRates,stageReports.map(stage=>stage.hours)),cookedMeals=Math.min(plannedMeals,craftableMeals(recipe,exactTotals,plannedMeals)),exactBoostedMeals=Math.min(best.tastyMeals,cookedMeals),cookingEnergy=Math.round(baseMealEnergy*(exactBoostedMeals*boostedExpectedMultiplier+(cookedMeals-exactBoostedMeals)*baselineExpectedMultiplier)),mealEnergy=cookedMeals?Math.round(cookingEnergy/cookedMeals):0,helperEnergy=Math.round(stageReports.length?sum(stageReports.map(stage=>stage.energy)):best.helperEnergy),startingEnergy=Math.max(0,Math.round(Number(options.currentSnorlaxStrength)||0)),finalEnergy=startingEnergy+helperEnergy+cookingEnergy;
    const ingredientRows=(recipe.ingredients||[]).map(item=>{const stock=Math.max(0,Number(inventory[item.name])||0),produced=Math.max(0,(Number(exactTotals[item.name])||0)-stock),consumed=(Number(item.amount)||0)*cookedMeals,requested=(Number(item.amount)||0)*requestedMeals,end=Math.max(0,stock+produced-consumed);return {name:item.name,perMeal:Number(item.amount)||0,stock:round(stock),produced:round(produced),consumed:round(consumed),end:round(end),requested:round(requested),shortage:round(Math.max(0,requested-stock-produced))}}),stages=[];
    stageReports.forEach(stage=>{const scheduleText=scheduleSummary(schedule,stage.kind);stages.push({kind:stage.kind,label:stage.label,hours:round(stage.hours,2),team:stage.members,energy:Math.round(stage.energy),repeated:stage.repeated,lostTriggers:round(stage.lostTriggers,2),scheduleText,breakdown:stage.breakdown})});
    const warnings=[];
    if(needsPot)warnings.push(`目标料理需要 ${recipe.total} 格，当前锅只有 ${basePotFinal} 格，因此不能制作；请启用好露营券或另行安排料理强化 S 扩锅。“爆锅队”不会增加容量。`);
    if(capacityReady&&autoTasty&&tastyTargetPct>0&&!tastyDeployment)warnings.push('当前没有可用的料理成功 S 计算结果，本次只按自然大成功率推演。');
    else if(capacityReady&&autoTasty&&tastyTargetPct>0&&tastyDeployment&&!tastyDeployment.reachable)warnings.push('盒内料理成功 S 队伍无法在本次最长计算范围内达到目标，本次只按自然大成功率推演。');
    else if(capacityReady&&autoTasty&&tastyTargetPct>0&&tastyDeployment&&tastyDeployment.reachable&&maxTastyMeals===0)warnings.push(`蓄一餐至 +${tastyTargetPct}% 约需 ${round(tastyHoursPerMeal,1)} 小时，超过本次推演时长，因此不安排爆锅队。`);
    else if(best.tastyMeals<requestedMeals&&maxTastyMeals>0)warnings.push(`比较上场时间与总能量后，建议只为 ${best.tastyMeals}/${requestedMeals} 餐安排爆锅队，其余餐按自然大成功率计算。`);
    if(best.tastyMeals>1)warnings.push('爆锅时间按每餐从 0% 重新蓄力的保守口径；若上一餐未大成功，保留的累计加成会缩短下一餐实际所需时间。');
    if(cookedMeals<plannedMeals)warnings.push(`按当前库存与盒内产量只能完成 ${cookedMeals}/${plannedMeals} 餐。`);
    const lostTriggers=sum(stageReports.map(stage=>stage.lostTriggers));if(lostTriggers>.005)warnings.push(`本次换队未先收取，预计清空 ${round(lostTriggers,2)} 次已储存技能；勾选“换队前先点击收取”即可避免。`);
    if(context&&context.expert&&teamSettings.exWeeklyEffect==='none')warnings.push('当前是 EX 岛但尚未选择本周追加效果；主／副树果和非匹配惩罚已计入，追加效果暂不加。');
    return {available:true,activity,eventArea,days,totalHours,requestedMeals,plannedMeals,cookedMeals,targetRecipe:recipe,preparationTeam,outputTeam,tastyDeployment,needsPot,capacityReady,basePotFinal,tastyTargetPct,tastyHoursPerMeal:round(tastyHoursPerMeal,2),tastyMeals:best.tastyMeals,boostedMeals:exactBoostedMeals,sundayMealShare:sundayShare,baselineExpectedMultiplier,boostedExpectedMultiplier,stages,dailySchedule:schedule.rows,scheduleStepMinutes:schedule.stepMinutes,ingredientRows,startingEnergy,helperEnergy,baseMealEnergy,mealEnergy,cookingMultiplier,cookingEnergy,finalEnergy,stockSavedPrepareHours:round(stockSavedPrepareHours,2),prepareHoursWithoutStock:round(withoutStock.prepareHours,2),warnings,teamSettings,lostTriggers:round(lostTriggers,2),unmodeled:['大成功的实际随机结果','额外填锅食材能量','活动特殊树果掉落']};
  }
  function buildHuntTargets(pokemon,islandName,options={}){
    const strategyApi=options.strategy||strategy,catalogApi=options.catalog||catalog;
    if(!strategyApi||typeof strategyApi.targetsForIsland!=='function')return [];
    const speciesRows=catalogApi&&Array.isArray(catalogApi.pokemon)?catalogApi.pokemon:[],bySpeciesId=new Map(speciesRows.map(row=>[String(row.id),row]));
    return strategyApi.targetsForIsland(islandName).map(target=>{
      const targetId=String(target.id),species=bySpeciesId.get(targetId),matches=(pokemon||[]).filter(mon=>String(mon.scoreBreakdown&&mon.scoreBreakdown.finalFormId||mon.finalFormId||mon.speciesId||'')===targetId).sort((a,b)=>(Number(b.scoreIndividual)||-Infinity)-(Number(a.scoreIndividual)||-Infinity)||(Number(b.scoreTotal)||-Infinity)-(Number(a.scoreTotal)||-Infinity)),best=matches[0]||null,specialty=best&&best.specialty||species&&species.specialty||'unknown';
      const assessment=best?strategyApi.minimumStandard(best,{finalId:targetId,specialty,strategicProfile:target.profile}):null,rule=strategyApi.ruleFor(targetId,specialty,best),status=!best?'missing':assessment&&assessment.meetsGraduation?'covered':'upgrade';
      return {id:targetId,name:target.profile&&target.profile.name||species&&species.name||`图鉴 #${targetId}`,note:target.note,profile:target.profile||null,status,count:matches.length,best,assessment,minimum:rule&&rule.minimum||'依照定位与Lv.50前三栏人工判断'};
    }).sort((a,b)=>({missing:0,upgrade:1,covered:2}[a.status]-{missing:0,upgrade:1,covered:2}[b.status]));
  }
  function huntTargetIconIdentity(target){return {speciesId:String(target&&target.id||''),name:String(target&&target.name||'')}}
  function calculatePlan(options){
    const activity=ACTIVITY_PROFILES[options.activityKey]||ACTIVITY_PROFILES.normal,recipeEnergy=typeof options.recipeEnergy==='function'?options.recipeEnergy:recipe=>Number(recipe.energy)||0,targetGoodCamp=options.weekMode==='preparation'?options.eventGoodCamp!==false:options.goodCamp!==false,pot=effectivePot(options.basePot,targetGoodCamp),now=dateValue(options.now),daysRemaining=daysRemainingInWeek(now),mealGoal=clamp(Math.round(options.mealGoal||activity.defaultMealGoal),1,21),completedMeals=Array.isArray(options.completedMeals)?options.completedMeals.length:Number(options.completedMeals)||0,context=applyActivityContext(options.context,activity),preparationTypes=[...new Set((options.preparationRecipeTypes||[]).filter(type=>RECIPE_TYPES.includes(type)))],multiRoute=options.weekMode==='preparation'&&preparationTypes.length>1;
    const planningType=options.weekMode==='preparation'&&preparationTypes.length===1?preparationTypes[0]:options.recipeType,manualCandidates=recipeRows(options.recipes,planningType,Infinity,recipeEnergy),singleTarget=manualCandidates.find(recipe=>String(recipe.id)===String(options.targetRecipeId))||chooseTargetRecipe(options.recipes,planningType,pot,{},options.inventory,mealGoal,recipeEnergy),targetRecipes=multiRoute?preparationTypes.map(type=>chooseTargetRecipe(options.recipes,type,pot,{},options.inventory,mealGoal,recipeEnergy)).filter(Boolean):singleTarget?[singleTarget]:[],targetRecipe=multiRoute?mergeTargetRecipes(targetRecipes):singleTarget,remainingMeals=Math.max(0,mealGoal-Math.min(mealGoal,completedMeals));
    const teamSettings={islandBonusPct:Math.max(0,Number(options.islandBonusPct)||0),islandProfile:String(options.islandProfile||'none'),favoriteBerries:[...(context&&context.berries||[])],startEnergy:100,sleepScore:100,skillCollectionHours:clamp(Number(options.skillCollectionHours)||4,.5,24),collectBeforeSwap:options.collectBeforeSwap!==false,exWeeklyEffect:String(options.exWeeklyEffect||'none')},capacityBudget=ingredientBudget(targetRecipe,{},options.inventory,mealGoal,completedMeals,daysRemaining,options.inventoryLimit||INVENTORY_LIMIT),preparationTeam=buildPreparationTeam({...options,context,activity,targetRecipe,remainingMeals:capacityBudget.batchMeals,daysRemaining,teamSettings}),outputTeam=buildOutputTeam({...options,context,activity,carryBonus:preparationTeam.carryBonus,fallbackMembers:preparationTeam.members,teamSettings}),budget=ingredientBudget(targetRecipe,preparationTeam.daily,options.inventory,mealGoal,completedMeals,daysRemaining,options.inventoryLimit||INVENTORY_LIMIT),action=createActionPlan(budget,targetRecipe,preparationTeam,outputTeam,now,{weekMode:options.weekMode,targetGoodCamp,travelTicketPlanned:options.travelTicketPlanned,targetRecipes}),currentTeam=['output','complete'].includes(action.phase)?outputTeam:preparationTeam;
    const islandName=context&&context.island&&context.island.name,huntTargets=buildHuntTargets(options.pokemon,islandName,{strategy:options.strategy,catalog:options.catalog}).map(target=>({...target,sleepTarget:sleepResearch.targetInfo(target.id,islandName)})),sleepBonus=sleepMultiplierForTeam(activity,options.sleepTeam,activityApplies(activity,context)),currentSleepEnergy=Math.max(0,Math.round(Number(options.currentSnorlaxStrength)||0)),targetObjective=sleepResearch.TARGET_OBJECTIVES.has(options.sleepObjective),requestedTarget=sleepResearch.targetDefinition(options.sleepTargetId),selectedSleepTarget=huntTargets.find(target=>String(target.id)===String(options.sleepTargetId))||(requestedTarget?{id:String(requestedTarget.id),name:requestedTarget.name,custom:true}:null)||huntTargets.find(target=>target.status==='missing')||huntTargets[0]||null,sleepOptions={area:islandName,currentStrength:currentSleepEnergy,bedtimeStrength:currentSleepEnergy,multiplier:sleepBonus.multiplier,sleepType:options.sleepType,objective:options.sleepObjective,targetId:selectedSleepTarget&&selectedSleepTarget.id,goodCamp:options.goodCamp===true},sleepSlowdown=sleepResearch.slowdownReference({...sleepOptions,objective:targetObjective?'combined':options.sleepObjective}),sleepThresholdReached=Boolean(currentSleepEnergy&&sleepSlowdown&&currentSleepEnergy>=sleepSlowdown.energy),shouldCalculate=targetObjective||options.sleepObjective==='spawns'||sleepThresholdReached,sleepPlan=shouldCalculate?calculateSleepPlan(sleepOptions):{available:false,reason:currentSleepEnergy?'尚未达到当前岛屿的惩罚线。':'请先填写当前卡比兽能量。',currentStrength:currentSleepEnergy,bedtimeStrength:currentSleepEnergy,sleepType:options.sleepType,objective:options.sleepObjective,target:sleepResearch.targetInfo(selectedSleepTarget&&selectedSleepTarget.id,sleepOptions.area)};
    const simulationActivity=ACTIVITY_PROFILES[options.simulationActivityKey]||activity,simulationContext=applyActivityContext(options.context,simulationActivity),simulationRecipes=targetRecipes.length?targetRecipes:targetRecipe?[targetRecipe]:[],simulations=simulationRecipes.map(recipe=>simulateActivityWeek({...options,activity:simulationActivity,context:simulationContext,targetRecipe:recipe,recipeEnergy,days:options.simulationDays,mealGoal:options.simulationMealGoal||mealGoal,goodCamp:targetGoodCamp,autoTasty:options.simulationAutoTasty,tastyTargetPct:options.simulationTastyTarget,currentSnorlaxStrength:currentSleepEnergy,teamSettings}));
    return {activity,simulationActivity,pot,targetGoodCamp,targetRecipe,targetRecipes,preparationTeam,outputTeam,currentTeam,budget,action,huntTargets,context,sleepBonus,currentSleepEnergy,sleepThresholdReached,sleepPlan,sleepSlowdown,sleepTarget:selectedSleepTarget,targetObjective,sleepDataset:sleepResearch.datasetInfo(),simulations,weekKey:weekKey(now)};
  }
  function defaults(ingredients,now){
    return {schemaVersion:10,islandIndex:0,berries:[],recipeType:'咖喱／浓汤',preparationRecipeTypes:['咖喱／浓汤','沙拉'],activityKey:'normal',goodCamp:false,eventGoodCamp:true,travelTicketPlanned:true,basePot:LIMITS.permanentPot,mealGoal:15,targetRecipeId:'',currentSnorlaxStrength:0,sleepType:'balanced',sleepObjective:'combined',sleepTargetId:'',simulationDays:7,simulationAutoTasty:true,simulationTastyTarget:70,skillCollectionHours:4,collectBeforeSwitch:true,exWeeklyEffect:'none',completedMeals:[],weekKey:weekKey(now),inventory:Object.fromEntries(ingredients.map(name=>[name,0]))};
  }
  function normalizeState(value,ingredients,islandCount,now=new Date()){
    const base=defaults(ingredients,now),source=value&&typeof value==='object'?value:{},recipeType=[...RECIPE_TYPES,'全部'].includes(source.recipeType)?source.recipeType:base.recipeType,activityKey=Object.hasOwn(ACTIVITY_PROFILES,source.activityKey)?source.activityKey:base.activityKey,currentWeek=weekKey(now),completed=source.weekKey===currentWeek&&Array.isArray(source.completedMeals)?[...new Set(source.completedMeals.filter(key=>VALID_MEAL_KEYS.has(key)))]:[],preparationRecipeTypes=[...new Set((Array.isArray(source.preparationRecipeTypes)?source.preparationRecipeTypes:base.preparationRecipeTypes).filter(type=>RECIPE_TYPES.includes(type)))];
    const targetSetting=Number(source.simulationTastyTarget),legacyEnergy=Math.max(0,Math.round(Number(source.bedtimeSnorlaxStrength)||0)),currentEnergy=Math.max(0,Math.round(Number(source.currentSnorlaxStrength)||legacyEnergy)),normalized={...base,...source,schemaVersion:10,recipeType,preparationRecipeTypes:preparationRecipeTypes.length?preparationRecipeTypes:base.preparationRecipeTypes,activityKey,goodCamp:source.schemaVersion>=3?source.goodCamp===true:false,eventGoodCamp:source.eventGoodCamp!==false,travelTicketPlanned:source.travelTicketPlanned!==false,basePot:clamp(Math.round(source.basePot||base.basePot),1,LIMITS.permanentPot),mealGoal:clamp(Math.round(source.mealGoal||base.mealGoal),1,21),targetRecipeId:String(source.targetRecipeId||''),currentSnorlaxStrength:currentEnergy,sleepType:Object.hasOwn(sleepResearch.SLEEP_TYPES,source.sleepType)?source.sleepType:base.sleepType,sleepObjective:Object.hasOwn(sleepResearch.OBJECTIVES,source.sleepObjective)?source.sleepObjective:base.sleepObjective,sleepTargetId:String(source.sleepTargetId||''),simulationDays:clamp(Math.round(source.simulationDays||base.simulationDays),1,14),simulationAutoTasty:source.simulationAutoTasty!==false,simulationTastyTarget:clamp(Math.round(Number.isFinite(targetSetting)?targetSetting:70),0,70),skillCollectionHours:clamp(Number(source.skillCollectionHours)||4,.5,24),collectBeforeSwitch:source.collectBeforeSwitch!==false,exWeeklyEffect:['none','berry','ingredient','skill'].includes(source.exWeeklyEffect)?source.exWeeklyEffect:'none',islandIndex:clamp(Math.round(source.islandIndex),0,Math.max(0,islandCount-1)),completedMeals:completed,weekKey:currentWeek,inventory:{...base.inventory,...(source.inventory&&typeof source.inventory==='object'?source.inventory:{})}};
    delete normalized.penaltyLines;delete normalized.bedtimeSnorlaxStrength;delete normalized.simulationAutoPot;return normalized;
  }
  function mount(options={}){
    if(typeof document==='undefined')return null;const rootNode=document.querySelector('#weeklyPlanner');if(!rootNode)return null;
    let browserStorage=null;try{browserStorage=window.localStorage}catch(_error){}
    const pokemon=options.pokemon||[],islands=options.islands||[],recipes=options.recipes||[],ingredients=options.ingredients||[],storage=options.storage||browserStorage,teamPlanner=options.teamPlanner,production=options.production&&options.production.byBoxId||options.production||{},profile=options.profile||null,pokemonPicker=options.picker||null,controls={island:document.querySelector('#weeklyIsland'),berries:document.querySelector('#weeklyBerries'),recipeType:document.querySelector('#weeklyRecipeType'),activity:document.querySelector('#weeklyActivity'),targetRecipe:document.querySelector('#weeklyTargetRecipe'),preparationRoutes:document.querySelector('#weeklyPreparationRoutes'),mealGoal:document.querySelector('#weeklyMealGoal'),camp:document.querySelector('#weeklyGoodCamp'),eventCamp:document.querySelector('#weeklyEventGoodCamp'),travelTicket:document.querySelector('#weeklyTravelTicket'),pot:document.querySelector('#weeklyPot'),simulationDays:document.querySelector('#weeklySimulationDays'),simulationAutoTasty:document.querySelector('#weeklySimulationAutoTasty'),simulationTastyTarget:document.querySelector('#weeklySimulationTastyTarget'),skillCollectionHours:document.querySelector('#weeklySkillCollectionHours'),collectBeforeSwitch:document.querySelector('#weeklyCollectBeforeSwitch'),exWeeklyEffect:document.querySelector('#weeklyExEffect'),currentStrength:document.querySelector('#weeklyCurrentStrength'),sleepType:document.querySelector('#weeklySleepType'),sleepObjective:document.querySelector('#weeklySleepObjective'),sleepTarget:document.querySelector('#weeklySleepTarget'),sleepTargetSelect:document.querySelector('#weeklySleepTargetSelect'),sleepTargetField:document.querySelector('#weeklySleepTargetField'),inventory:document.querySelector('#weeklyInventory'),result:document.querySelector('#weeklyResult'),stamp:document.querySelector('#weeklySaveStamp'),profileSummary:document.querySelector('#weeklyProfileSummary'),settingsOpen:document.querySelector('#weeklySettingsOpen')};
    let state=normalizeState(readJson(storage,STORAGE_KEY,{}),ingredients,islands.length),resetArmed=false,resetTimer=null,sleepInputTimer=null;
    islands.forEach((island,index)=>{const item=document.createElement('option');item.value=String(index);item.textContent=island.name;controls.island.append(item)});
    Object.entries(ACTIVITY_PROFILES).forEach(([key,item])=>{const option=document.createElement('option');option.value=key;option.textContent=item.label;controls.activity.append(option)});
    function selectedBerries(){const island=islands[state.islandIndex],selects=[...controls.berries.querySelectorAll('select')];return selects.length?selects.map(select=>select.value):island.defaultBerries||String(island.berries||'').split('／')}
    function renderBerryControls(){
      const island=islands[state.islandIndex];controls.berries.replaceChildren();if(!island||!island.berryMode){controls.berries.hidden=true;return}controls.berries.hidden=false;
      const activity=ACTIVITY_PROFILES[state.activityKey]||ACTIVITY_PROFILES.normal,forced=isEventArea({island})&&activity.favoriteBerry?activity.favoriteBerry:'',saved=Array.isArray(state.berries)&&state.berries.length===3?state.berries:[...(island.defaultBerries||[])],current=forced?[forced,...saved.filter(name=>name!==forced)].slice(0,3):saved,all=options.allBerries||[];
      ['树果 1','树果 2','树果 3'].forEach((label,index)=>{const wrap=document.createElement('label');wrap.textContent=forced&&index===0?`${island.kind==='EX'?'主树果':'喜爱树果 1'}（活动固定）`:island.kind==='EX'&&index===0?'主树果':label;const select=document.createElement('select'),allowed=forced&&index===0?[forced]:island.berryMode==='cyan-expert'&&index===0?['橙橙果','桃桃果','椰木果']:all;allowed.forEach(name=>{const option=document.createElement('option');option.value=name;option.textContent=name;select.append(option)});select.value=current[index]||allowed[index]||allowed[0];select.disabled=Boolean(forced&&index===0);select.addEventListener('change',()=>{state.berries=selectedBerries();persist();render()});wrap.append(select);controls.berries.append(wrap)});state.berries=selectedBerries();
    }
    function availableRecipes(){return recipeRows(recipes,state.recipeType,Infinity,options.recipeEnergy)}
    function renderRecipeOptions(clearProgress=false){
      const rows=availableRecipes(),previous=state.targetRecipeId,current=profileState(),targetCamp=current&&current.weekMode==='preparation'?state.eventGoodCamp:state.goodCamp,directPot=effectivePot(state.basePot,targetCamp);controls.targetRecipe.replaceChildren();
      if(!rows.length){const option=document.createElement('option');option.value='';option.textContent='当前类别没有已做食谱';controls.targetRecipe.append(option);controls.targetRecipe.disabled=true;state.targetRecipeId='';return}
      controls.targetRecipe.disabled=false;const automatic=document.createElement('option');automatic.value='';automatic.textContent='自动：结合当前库存与食谱等级推荐';controls.targetRecipe.append(automatic);rows.forEach(recipe=>{const option=document.createElement('option');option.value=String(recipe.id);option.textContent=`${recipe.name}｜${recipe.total} 格${Number(recipe.total)>directPot?'｜需扩锅':''}${typeof options.recipeEnergy==='function'?`｜${Math.round(options.recipeEnergy(recipe)).toLocaleString('zh-CN')} 能量`:''}`;controls.targetRecipe.append(option)});
      if(state.targetRecipeId&&!rows.some(recipe=>String(recipe.id)===String(state.targetRecipeId)))state.targetRecipeId='';controls.targetRecipe.value=state.targetRecipeId;
      if(clearProgress&&previous&&previous!==state.targetRecipeId)state.completedMeals=[];
    }
    function profileState(){return profile&&typeof profile.getState==='function'?profile.getState():null}
    function renderPreparationControls(current=profileState()){
      const preparing=Boolean(current&&current.weekMode==='preparation');if(controls.preparationRoutes){controls.preparationRoutes.hidden=!preparing;controls.preparationRoutes.querySelectorAll('input[type="checkbox"]').forEach(input=>{input.checked=state.preparationRecipeTypes.includes(input.value)})}
      controls.recipeType.closest('.weekly-field')?.toggleAttribute('hidden',preparing);controls.targetRecipe.closest('.weekly-field')?.toggleAttribute('hidden',preparing);
    }
    function syncProfile(){
      const current=profileState();if(!current)return null;state.islandIndex=typeof profile.islandIndex==='function'?profile.islandIndex(islands):state.islandIndex;state.inventory={...state.inventory,...current.ingredientStock};state.basePot=clamp(Math.round(current.permanentPot||state.basePot),1,LIMITS.permanentPot);state.activityKey=current.weekMode==='event'&&Object.hasOwn(ACTIVITY_PROFILES,current.activityKey)?current.activityKey:'normal';
      if(controls.profileSummary){const island=profile.currentIsland?profile.currentIsland():null,mode={normal:'普通周',preparation:'活动前准备周',event:'活动周'}[current.weekMode]||'普通周',total=Object.values(current.ingredientStock||{}).reduce((sum,value)=>sum+Math.max(0,Number(value)||0),0),strong=controls.profileSummary.querySelector('strong');if(strong)strong.textContent=`${island&&island.label||islands[state.islandIndex]?.name||'当前岛屿'} · ${mode} · 库存 ${Math.round(total)} / ${current.inventoryLimit||INVENTORY_LIMIT}`}
      return current;
    }
    function renderInventory(){
      if(profile){controls.inventory.replaceChildren();return}
      controls.inventory.replaceChildren();ingredients.forEach(name=>{const label=document.createElement('label'),input=document.createElement('input');label.textContent=name;input.type='number';input.min='0';input.step='1';input.inputMode='numeric';input.value=String(Number(state.inventory[name])||0);input.dataset.ingredient=name;input.addEventListener('change',()=>{state.inventory[name]=Math.max(0,Number(input.value)||0);persist();render()});label.append(input);controls.inventory.append(label)});
    }
    function syncSleepControls(){
      if(!controls.currentStrength)return;controls.currentStrength.value=String(state.currentSnorlaxStrength||0);if(controls.sleepType)controls.sleepType.value=state.sleepType;if(controls.sleepObjective)controls.sleepObjective.value=state.sleepObjective;if(controls.sleepTargetField)controls.sleepTargetField.hidden=!sleepResearch.TARGET_OBJECTIVES.has(state.sleepObjective);
    }
    function renderSleepTargets(report){
      if(!controls.sleepTarget||!controls.sleepTargetField)return;
      const targetMode=sleepResearch.TARGET_OBJECTIVES.has(state.sleepObjective);controls.sleepTargetField.hidden=!targetMode;controls.sleepTarget.replaceChildren();
      if(!targetMode)return;
      if(report.sleepTarget&&!state.sleepTargetId)state.sleepTargetId=String(report.sleepTarget.id);
      if(controls.sleepTargetSelect){
        const rows=sleepResearch.targetDefinitions(report.context&&report.context.island&&report.context.island.name),previous=String(state.sleepTargetId||'');controls.sleepTargetSelect.replaceChildren();
        rows.forEach(target=>{const option=document.createElement('option');option.value=String(target.id);option.textContent=`${target.name}${target.available?'':'（本岛不出现）'}`;controls.sleepTargetSelect.append(option)});
        if(rows.some(target=>String(target.id)===previous))controls.sleepTargetSelect.value=previous;else if(report.sleepTarget)controls.sleepTargetSelect.value=String(report.sleepTarget.id);
      }
      (report.huntTargets||[]).forEach(target=>{const button=document.createElement('button'),label=document.createElement('span');button.type='button';button.className=String(target.id)===String(report.sleepTarget&&report.sleepTarget.id)?'selected':'';button.setAttribute('aria-pressed',button.className==='selected'?'true':'false');label.textContent=target.name;button.append(pokemonIcon(huntTargetIconIdentity(target),'small'),label);button.addEventListener('click',()=>{state.sleepTargetId=String(target.id);persist();render()});controls.sleepTarget.append(button)});
    }
    function syncControls(){const current=syncProfile();controls.island.value=String(state.islandIndex);controls.recipeType.value=state.recipeType;controls.activity.value=state.activityKey;controls.camp.checked=Boolean(state.goodCamp);controls.eventCamp.checked=Boolean(state.eventGoodCamp);controls.travelTicket.checked=Boolean(state.travelTicketPlanned);controls.pot.value=String(state.basePot);controls.mealGoal.value=String(state.mealGoal);if(controls.simulationDays)controls.simulationDays.value=String(state.simulationDays);if(controls.simulationAutoTasty)controls.simulationAutoTasty.checked=Boolean(state.simulationAutoTasty);if(controls.simulationTastyTarget)controls.simulationTastyTarget.value=String(state.simulationTastyTarget);if(controls.skillCollectionHours)controls.skillCollectionHours.value=String(state.skillCollectionHours);if(controls.collectBeforeSwitch)controls.collectBeforeSwitch.checked=Boolean(state.collectBeforeSwitch);if(controls.exWeeklyEffect)controls.exWeeklyEffect.value=state.exWeeklyEffect;renderPreparationControls(current);renderBerryControls();renderRecipeOptions();renderInventory();syncSleepControls()}
    function persist(){state.weekKey=weekKey();writeJson(storage,STORAGE_KEY,state);controls.stamp.textContent=`已保存 · ${new Date().toLocaleTimeString('zh-CN',{hour:'2-digit',minute:'2-digit'})}`;window.dispatchEvent(new CustomEvent('pokemon-sleep:local-change',{detail:{type:'weekly-plan'}}))}
    function context(){const island=islands[state.islandIndex];return {island,index:state.islandIndex,berries:selectedBerries(),expert:island.kind==='EX'}}
    function icon(name){const api=window.POKEMON_SLEEP_INGREDIENTS;return api&&api.create?api.create(name,{label:name}):document.createTextNode(name)}
    function pokemonIcon(mon,size='medium'){return pokemonPicker&&typeof pokemonPicker.createIcon==='function'?pokemonPicker.createIcon(mon,{size}):window.POKEMON_SLEEP_POKEMON_PICKER?.createIcon(mon,{catalog:options.catalog,document,size})||document.createTextNode('')}
    function teamCards(team){
      const grid=document.createElement('div');grid.className='weekly-team';(team.members||[]).forEach((mon,index)=>{const card=document.createElement('article'),display=mon.nickname||mon.name,copy=document.createElement('div'),position=document.createElement('span'),name=document.createElement('b'),meta=document.createElement('small');position.textContent=`位置 ${index+1}`;name.textContent=`#${mon.id} ${display}`;meta.textContent=`${mon.nickname?`${mon.name} · `:''}Lv.${mon.lv} · ${mon.specialtyLabel||''}`;copy.append(position,name,meta);card.append(pokemonIcon(mon),copy);grid.append(card)});return grid;
    }
    function overviewSection(report){
      const section=document.createElement('section');section.className='weekly-overview';const activityNote=Array.isArray(report.activity.eventAreas)&&report.activity.eventAreas.length&&!report.preparationTeam.eventArea?`${report.activity.note} 当前岛屿不在活动区域，因此不套用活动成员加成。`:report.activity.note;
      const routes=report.targetRecipes&&report.targetRecipes.length>1?`<p>候选路线：${report.targetRecipes.map(recipe=>`${recipe.type}「${recipe.name}」`).join('；')}。活动周确定料理后只执行其中一条。</p>`:'';
      section.innerHTML=`<div><span>WEEK TARGET</span><h3>${report.targetRecipe?report.targetRecipe.name:'尚无可用目标食谱'} × ${report.budget.goal}</h3><p>${islands[state.islandIndex].name}｜${activityNote}</p>${routes}</div><div class="weekly-overview-stats"><span><small>目标进度</small><b>${report.budget.completed} / ${report.budget.goal}</b></span><span><small>本批规划</small><b>${report.budget.batchMeals} 餐</b></span><span><small>食材缺口</small><b>${report.budget.rows.filter(row=>row.gapNow>.05).length} 种</b></span><span><small>仓库占用</small><b>${Math.ceil(report.budget.inventoryTotal)} / ${report.budget.inventoryLimit}</b></span></div>`;return section;
    }
    function simulationTeam(team){
      const row=document.createElement('div');row.className='weekly-simulation-team';(team||[]).slice(0,5).forEach(mon=>{const iconNode=pokemonIcon(mon,'small');iconNode.title=`#${mon.id} ${mon.nickname||mon.name}`;row.append(iconNode)});return row;
    }
    function simulationSection(report){
      const simulations=report.simulations||[],section=document.createElement('section');section.className='weekly-section weekly-simulation';const head=document.createElement('div');head.className='weekly-section-head';head.innerHTML=`<div><span>ACTIVITY WEEK SIMULATOR</span><h3>活动周完整推演</h3></div><small>${report.simulationActivity.label} · ${state.simulationDays} 天 · ${state.mealGoal} 餐</small>`;section.append(head);
      if(!simulations.length){const empty=document.createElement('p');empty.className='weekly-empty';empty.textContent='先选择一个已经做过的食谱；准备周可勾选多条料理路线分别比较。锅容量不足会单独提示扩锅。';section.append(empty);return section}
      const maxEnergy=Math.max(...simulations.filter(item=>item.available).map(item=>item.finalEnergy),-Infinity),grid=document.createElement('div');grid.className=`weekly-simulation-grid${simulations.length>1?' compare':''}`;
      simulations.forEach(sim=>{
        const card=document.createElement('article');card.className=`weekly-simulation-card${sim.finalEnergy===maxEnergy&&simulations.length>1?' best':''}`;
        if(!sim.available){card.innerHTML=`<h4>${sim.targetRecipe&&sim.targetRecipe.name||'当前路线'}</h4><p>${sim.reason}</p>`;grid.append(card);return}
        const title=document.createElement('div');title.className='weekly-simulation-title';const copy=document.createElement('div');copy.innerHTML=`<span>${sim.targetRecipe.type}${sim.finalEnergy===maxEnergy&&simulations.length>1?' · 当前较高':''}</span><h4>${sim.targetRecipe.name}</h4><small>完成 ${sim.cookedMeals}/${sim.requestedMeals} 餐${sim.cookingMultiplier!==1?` · 活动料理 ×${sim.cookingMultiplier}`:''}</small>`;const final=document.createElement('strong');final.innerHTML=`<small>期末卡比兽能量</small>${Math.round(sim.finalEnergy).toLocaleString('zh-CN')}`;title.append(copy,final);
        const stats=document.createElement('div');stats.className='weekly-simulation-stats';[
          ['起始能量',sim.startingEnergy],['队伍纯能量',sim.helperEnergy],['料理能量（期望）',sim.cookingEnergy],['每餐期望能量',sim.mealEnergy]
        ].forEach(([label,value])=>{const item=document.createElement('span');item.innerHTML=`<small>${label}</small><b>${Math.round(value).toLocaleString('zh-CN')}</b>`;stats.append(item)});
        const timeline=document.createElement('div');timeline.className='weekly-simulation-timeline';if(!sim.stages.length){const empty=document.createElement('p');empty.textContent='当前条件没有可执行的上场阶段。';timeline.append(empty)}sim.stages.forEach((stage,index)=>{const item=document.createElement('div');item.className=`weekly-simulation-stage stage-${stage.kind}`;const marker=document.createElement('span');marker.textContent=String(index+1).padStart(2,'0');const stageCopy=document.createElement('div');stageCopy.innerHTML=`<b>${stage.label}</b><small>${stage.scheduleText||''} · 合计 ${teamPlanner.formatHours(stage.hours)} · 约 ${stage.energy.toLocaleString('zh-CN')} 纯能量${stage.lostTriggers?` · 换队损失 ${stage.lostTriggers} 次技能`:''}</small>`;stageCopy.append(simulationTeam(stage.team));item.append(marker,stageCopy);timeline.append(item)});
        if(sim.stockSavedPrepareHours>0){const stockNote=document.createElement('p');stockNote.className='weekly-simulation-audit';stockNote.textContent=`库存已参与优化：若从 0 库存开始，食材队约需 ${teamPlanner.formatHours(sim.prepareHoursWithoutStock)}；当前存货节省约 ${teamPlanner.formatHours(sim.stockSavedPrepareHours)}。`;timeline.append(stockNote)}
        if(sim.dailySchedule&&sim.dailySchedule.length){const details=document.createElement('details');details.className='weekly-shift-details';details.open=true;const summary=document.createElement('summary');summary.textContent=`每日换队表（${sim.scheduleStepMinutes||15} 分钟粒度）`;const rows=document.createElement('div');rows.className='weekly-shift-list';const labels={prepare:'食材队',tasty:'爆锅队',output:'输出队'};sim.dailySchedule.forEach(day=>{const row=document.createElement('div'),date=document.createElement('b'),windows=document.createElement('p');date.textContent=day.label;day.entries.forEach(entry=>{const chip=document.createElement('span');chip.className=`shift-${entry.kind}`;chip.textContent=`${entry.start}～${entry.end} ${labels[entry.kind]||entry.kind}`;windows.append(chip)});row.append(date,windows);rows.append(row)});details.append(summary,rows);timeline.append(details)}
        const ingredients=document.createElement('div');ingredients.className='weekly-simulation-ingredients';sim.ingredientRows.forEach(row=>{const item=document.createElement('span');const name=document.createElement('b');name.append(icon(row.name),document.createTextNode(row.name));const values=document.createElement('small');values.textContent=`库存 ${row.stock} ＋ 产出 ${row.produced} － 料理 ${row.consumed} ＝ 剩余 ${row.end}${row.shortage>0?` · 总目标仍缺 ${row.shortage}`:''}`;item.className=row.shortage>0?'short':'';item.append(name,values);ingredients.append(item)});
        const audit=document.createElement('p');audit.className='weekly-simulation-audit';audit.textContent=`已调用：岛屿加成 ${sim.teamSettings.islandBonusPct}% · 本周喜爱树果 ${sim.teamSettings.favoriteBerries.join('／')||'未指定'}${report.context&&report.context.expert?` · EX追加 ${sim.teamSettings.exWeeklyEffect==='none'?'未选择':{berry:'树果强化',ingredient:'食材＋1',skill:'技能率×1.25'}[sim.teamSettings.exWeeklyEffect]}`:''} · 每 ${sim.teamSettings.skillCollectionHours} 小时点击 · 换队前${sim.teamSettings.collectBeforeSwap?'已':'未'}收取 · 食谱 Lv.${profile&&typeof profile.recipeLevel==='function'?profile.recipeLevel(sim.targetRecipe.id):1} · ${sim.needsPot?`当前锅 ${sim.basePotFinal} 格，需另行扩锅`:`当前锅可直接制作${sim.tastyMeals?` · 爆锅 ${sim.tastyMeals} 餐，每餐约 ${sim.tastyHoursPerMeal} 小时`:''}`}。`;
        card.append(title,stats,timeline,ingredients,audit);
        if(sim.warnings.length){const warnings=document.createElement('ul');warnings.className='weekly-simulation-warnings';sim.warnings.forEach(text=>{const item=document.createElement('li');item.textContent=text;warnings.append(item)});card.append(warnings)}
        const excluded=document.createElement('p');excluded.className='weekly-simulation-excluded';excluded.textContent=`未写入精确总数：${sim.unmodeled.join('、')}。`;card.append(excluded);grid.append(card)
      });
      section.append(grid);return section;
    }
    function actionSection(report){
      const section=document.createElement('section');section.className=`weekly-action phase-${report.action.phase}`;const top=document.createElement('div');top.className='weekly-action-head';top.innerHTML=`<div><span>NOW｜当前行动</span><h3>${report.action.title}</h3></div><b>${teamPlanner.formatHours(report.action.collectionHours)} 收菜</b>`;const detail=document.createElement('p');detail.textContent=report.action.detail;const thresholds=document.createElement('div');thresholds.className='weekly-action-thresholds';report.action.thresholds.forEach(text=>{const chip=document.createElement('span');chip.textContent=text;thresholds.append(chip)});const timing=document.createElement('small');timing.textContent=`建议下一次收菜：约 ${report.action.collectAt}`;section.append(top,detail);if(report.action.thresholds.length)section.append(thresholds);section.append(timing);return section;
    }
    function sleepPlanSection(report){
      const plan=report.sleepPlan,slowdown=report.sleepSlowdown,currentEnergy=Math.max(0,Number(report.currentSleepEnergy)||0),targetMode=report.targetObjective,format=value=>Math.round(Number(value)||0).toLocaleString('zh-CN'),decimal=value=>Number(value||0).toFixed(3),section=document.createElement('section');section.className='weekly-section weekly-sleep-plan';
      const head=document.createElement('div');head.className='weekly-section-head';const bonus=report.sleepBonus.active?`${report.sleepBonus.matched}随队 ×${report.sleepBonus.multiplier}`:report.sleepBonus.required.length?`当前队伍未带${report.sleepBonus.required.join('／')}，按 ×1`:'无活动睡意之力倍率';head.innerHTML=`<div><span>SLEEP OPTIMIZER</span><h3>睡眠方案优化器</h3></div><small>${bonus}</small>`;
      const explainer=document.createElement('p');explainer.className='weekly-sleep-explainer';explainer.textContent=targetMode?'严选目标会直接参与期望值计算：比较一次睡满与全部两段方案，不需要先达到惩罚线。':'“惩罚线”只是当前岛屿研究奖励曲线开始明显变平的社区参考点，不是游戏中的官方减益。';section.append(head,explainer);
      const source=document.createElement('p');source.className='weekly-sleep-source';const generated=report.sleepDataset&&report.sleepDataset.generatedAt?new Date(report.sleepDataset.generatedAt).toLocaleDateString('zh-CN'):'未知日期';source.innerHTML=`曲线数据：PokéSleep Super Wiki 社区模拟（${generated}），属于期望值而非官方保证结果。<a href="${report.sleepDataset&&report.sleepDataset.sourcePage||'https://wiki.pokesleep.com/en/sleep-optimizer'}" target="_blank" rel="noreferrer">查看模型说明</a>`;
      const lineEnergy=slowdown?Math.round(slowdown.energy):0,reached=Boolean(lineEnergy&&currentEnergy>=lineEnergy),status=document.createElement('div');status.className=`weekly-sleep-status ${!currentEnergy?'waiting':reached?'reached':'below'}`;
      if(!currentEnergy){status.innerHTML=`<span>${targetMode?'等待计算':'当前岛屿惩罚线'}</span><b>${targetMode?'填写当前卡比兽能量':format(lineEnergy)+' 能量'}</b><p>${targetMode?'填写后会立刻比较目标的一次睡满与分段期望。':'未到线时只显示还差多少；达到后再规划研究奖励分睡。'}</p>`;section.append(status,source);return section}
      if(targetMode&&!plan.available){
        const target=plan.target&&plan.target.definition,areas=plan.target&&plan.target.availableAreas||[],name=target&&target.name||report.sleepTarget&&report.sleepTarget.name||'该目标';status.className='weekly-sleep-status unavailable';status.innerHTML=`<span>当前岛屿无法规划</span><b>${name}在本岛不会出现</b><p>${areas.length?`可出现岛屿：${areas.map(area=>area.name).join('、')}。请切换岛屿，或改选本岛严选目标。`:plan.reason||'当前研究曲线中没有这个目标。'}</p>`;section.append(status,source);return section;
      }
      const stats=document.createElement('div');stats.className='weekly-sleep-stats';
      if(targetMode){
        const name=plan.target&&plan.target.pokemonName||report.sleepTarget&&report.sleepTarget.name||'严选目标',singleValue=plan.single&&plan.single.objectiveValue||0,splitValue=plan.bestSplit&&plan.bestSplit.objectiveValue||0;[
          ['当前能量',format(currentEnergy)],
          [plan.objective==='candy'?'目标糖果':'指定宝可梦',plan.objective==='candy'?`${name}进化系`:name],
          ['睡满／最佳分段',`${decimal(singleValue)} / ${decimal(splitValue)}`]
        ].forEach(([label,value])=>{const item=document.createElement('span');item.innerHTML=`<small>${label}</small><b>${value}</b>`;stats.append(item)});
      }else if(slowdown){[
        ['当前能量',format(currentEnergy)],['本岛惩罚线',format(lineEnergy)],[reached?'已超过':'还差',format(Math.abs(currentEnergy-lineEnergy))]
      ].forEach(([label,value])=>{const item=document.createElement('span');item.innerHTML=`<small>${label}</small><b>${value}</b>`;stats.append(item)})}
      if(!targetMode&&plan.objective!=='spawns'&&!reached){status.innerHTML=`<span>尚未达到惩罚线</span><b>今天正常睡满即可</b><p>距离当前岛屿参考线还差 ${format(lineEnergy-currentEnergy)} 能量，研究奖励目标暂时无需分睡；如需严选，可改选“严选目标出现”。</p>`;section.append(stats,status,source);return section}
      if(!plan.available||!plan.bestSplit){status.innerHTML=`<span>暂时无法计算</span><b>研究曲线数据不完整</b><p>${plan.reason||'请稍后再试。'}</p>`;section.append(stats,status,source);return section}
      const selectedPlan=plan.recommendation==='split'?plan.bestSplit:plan.single,first=selectedPlan.sessions[0],second=selectedPlan.sessions[1],objectiveLabel=sleepResearch.OBJECTIVES[plan.objective]||'研究收益';
      function duration(session){const hours=Math.floor(session.minutes/60),minutes=session.minutes%60;return `${hours?`${hours}小时`:''}${minutes?`${minutes}分`:''}`||'0分'}
      if(plan.recommendation==='split')status.innerHTML=`<span>${targetMode?'目标期望更高':'建议分两段'}</span><b>第一段先睡 ${duration(first)}</b><p>第一段 ${first.score} 分；第二段 ${duration(second)}（${second.score} 分），两段合计 100 分。</p>`;
      else status.innerHTML=`<span>${plan.recommendation==='either'?'两种方案相同':'一次睡满更优'}</span><b>今晚睡满 8小时30分</b><p>${plan.recommendation==='either'?'分睡没有增加目标期望，优先完整睡眠。':'最佳分段的目标期望低于一次睡满。'}</p>`;
      const sessions=document.createElement('div');sessions.className='weekly-sleep-sessions';selectedPlan.sessions.forEach(session=>{const item=document.createElement('article'),reduced=session.reducedRewardSpawns>0?` · ${session.reducedRewardSpawns}只奖励调整`:'';item.className=session.index===1&&selectedPlan.sessions.length>1?'primary':'';const metric=targetMode?(plan.objective==='candy'?`${decimal(session.candy)} 个目标糖果`:`${decimal(session.pokemonAppearances)} 只${plan.target&&plan.target.pokemonName||'目标'}期望`):`${session.totalSpawns}只研究 · 碎片 ${format(session.shards)} · EXP ${format(session.researchExp)}`;item.innerHTML=`<span>第 ${session.index} 段${session.index===1&&selectedPlan.sessions.length>1?' · 先睡这一段':''}</span><b>${duration(session)} · ${session.score} 分</b><small>按当前 ${format(session.energy)} 能量估算</small><strong>${metric}</strong><em>${session.campExtra?`含露营券＋${session.campExtra}只`:session.naturalSpawns+'只自然遇见'}${reduced}</em>`;sessions.append(item)});
      const note=document.createElement('p');note.className='weekly-sleep-note';const gain=Number.isFinite(plan.gainPercent)?`${plan.gainPercent>=0?'+':''}${plan.gainPercent.toFixed(targetMode?2:1)}%`:'从 0 提升',dayRule=targetMode&&plan.objective==='candy'?'第 11 只起每只目标宝可梦按 1 个糖果计算。':targetMode?'第 11 只起不会减少目标出现期望，只会改变研究奖励。':'第二次研究会计入每日第 11 只起的奖励变化。';note.textContent=`优化目标：${objectiveLabel}。最佳分段相对一次睡满为 ${gain}；系统已比较 18＋82 至 99＋1 的全部组合。${dayRule}好露营券额外遇见只计第一段。`;
      section.append(stats,status,sessions,note,source);return section;
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
      (report.huntTargets||[]).forEach(target=>{
        const card=document.createElement('article');card.className=`weekly-hunt-card status-${target.status}`;const status={missing:'盒内缺失',upgrade:'继续严选',covered:'已有达标'}[target.status]||'人工判断',best=target.best?`当前最好：#${target.best.id} ${target.best.name} · 个体 ${Number(target.best.scoreIndividual).toFixed(1)}${target.assessment?` · ${target.assessment.label}`:''}`:'盒内尚无该最终形态',head=document.createElement('div'),identity=document.createElement('div'),statusChip=document.createElement('span'),name=document.createElement('b'),note=document.createElement('p'),bestLine=document.createElement('small'),availability=document.createElement('small'),details=document.createElement('details'),summary=document.createElement('summary'),minimum=document.createElement('p'),actions=document.createElement('div'),appearance=document.createElement('button'),candy=document.createElement('button');
        identity.className='weekly-hunt-identity';statusChip.textContent=status;name.textContent=target.name;identity.append(pokemonIcon(huntTargetIconIdentity(target),'small'),name);head.append(statusChip,identity);note.textContent=target.note;bestLine.textContent=best;summary.textContent='查看最低入盒标准';minimum.textContent=target.minimum;details.append(summary,minimum);if(target.assessment&&target.assessment.missing.length){const missing=document.createElement('p');missing.textContent=`当前还缺：${target.assessment.missing.join('、')}`;details.append(missing)}
        if(target.sleepTarget&&!target.sleepTarget.available){availability.className='weekly-hunt-availability';availability.textContent=`本岛研究不出现 · 可前往 ${target.sleepTarget.availableAreas.map(area=>area.name).join('／')||'其他岛屿'}`}
        actions.className='weekly-hunt-actions';appearance.type='button';appearance.textContent='规划严选出现';candy.type='button';candy.textContent='规划进化系糖果';[[appearance,'pokemon'],[candy,'candy']].forEach(([button,objective])=>button.addEventListener('click',()=>{state.sleepTargetId=String(target.id);state.sleepObjective=objective;const panel=document.querySelector('.weekly-sleep-settings');if(panel)panel.open=true;persist();render();document.querySelector('.weekly-sleep-plan')?.scrollIntoView({behavior:'smooth',block:'start'})}));actions.append(appearance,candy);card.append(head,note,bestLine);if(availability.textContent)card.append(availability);card.append(actions,details);grid.append(card)
      });
      if(!report.huntTargets||!report.huntTargets.length){const empty=document.createElement('p');empty.className='weekly-empty';empty.textContent='这个岛屿的攻略严选清单仍在整理中。';grid.append(empty)}
      section.append(grid);return section;
    }
    function budgetSection(report){
      const section=document.createElement('section');section.className='weekly-section';section.innerHTML=`<div class="weekly-section-head"><div><span>INGREDIENT BUDGET</span><h3>仓库可容纳的下一批食材</h3></div><small>全库存硬上限 ${report.budget.inventoryLimit}；本批最多规划 ${report.budget.batchMeals} 餐，用掉后再滚动计算</small></div>`;const grid=document.createElement('div');grid.className='weekly-budget';
      if(!report.budget.rows.length){const empty=document.createElement('p');empty.className='weekly-empty';empty.textContent='选择目标食谱后会显示食材预算。';grid.append(empty)}
      report.budget.rows.forEach(row=>{const card=document.createElement('article');card.className=`weekly-budget-row ${row.projectedGap>.05?'short':row.gapNow>.05?'working':'ready'}`;const identity=document.createElement('div');identity.className='weekly-budget-name';identity.append(icon(row.name));const copy=document.createElement('div');copy.innerHTML=`<b>${row.name}</b><small>每餐 ${row.perMeal}</small>`;identity.append(copy);const stats=document.createElement('div');stats.className='weekly-budget-stats';[['剩余需求',row.need],['当前库存',row.stock],['准备队／日',row.perDay],['周末预计',row.projected]].forEach(([label,value])=>{const item=document.createElement('span');item.innerHTML=`<small>${label}</small><b>${value}</b>`;stats.append(item)});const status=document.createElement('strong');status.className='weekly-budget-state';status.textContent=row.projectedGap>.05?`预计仍缺 ${Math.ceil(row.projectedGap)}`:row.gapNow>.05?`约 ${row.daysToStock} 天补齐`:'库存已够';card.append(identity,stats,status);grid.append(card)});section.append(grid);return section;
    }
    function progressSection(report){
      const section=document.createElement('section');section.className='weekly-section';const head=document.createElement('div');head.className='weekly-section-head weekly-progress-head';head.innerHTML=`<div><span>MEAL CHECK</span><h3>目标料理完成记录 · ${report.budget.completed}/${report.budget.goal}</h3></div>`;const reset=document.createElement('button');reset.type='button';reset.className='weekly-reset';reset.textContent='清空本周勾选';reset.addEventListener('click',()=>{if(!resetArmed){resetArmed=true;reset.textContent='再点一次确认清空';if(resetTimer)clearTimeout(resetTimer);resetTimer=setTimeout(()=>{resetArmed=false;reset.textContent='清空本周勾选'},3000);return}resetArmed=false;if(resetTimer)clearTimeout(resetTimer);state.completedMeals=[];persist();render()});head.append(reset);const grid=document.createElement('div');grid.className='weekly-progress';
      DAY_NAMES.forEach((dayName,day)=>{const card=document.createElement('article');card.className='weekly-progress-day';const title=document.createElement('b');title.textContent=dayName;const meals=document.createElement('div');meals.className='weekly-progress-meals';MEAL_NAMES.forEach((mealName,meal)=>{const key=`d${day}-m${meal}`,label=document.createElement('label'),input=document.createElement('input');input.type='checkbox';input.checked=state.completedMeals.includes(key);label.className=input.checked?'done':'';input.setAttribute('aria-label',`${dayName}${mealName}餐已完成目标食谱`);input.addEventListener('change',()=>{const keys=new Set(state.completedMeals);input.checked?keys.add(key):keys.delete(key);state.completedMeals=[...keys].filter(value=>VALID_MEAL_KEYS.has(value));persist();render()});label.append(input,document.createTextNode(`${mealName}餐`));meals.append(label)});card.append(title,meals);grid.append(card)});section.append(head,grid);return section;
    }
    function logisticsDetails(report){const details=document.createElement('details');details.className='weekly-logistics';const summary=document.createElement('summary');summary.innerHTML=`<span>食材预算与料理记录</span><small>${report.budget.rows.filter(row=>row.gapNow>.05).length} 种缺口 · 已完成 ${report.budget.completed}/${report.budget.goal} 餐</small>`;const body=document.createElement('div');body.className='weekly-logistics-body';body.append(budgetSection(report),progressSection(report));details.append(summary,body);return details}
    function render(){
      if(!pokemon.length||!islands.length)return null;const previousIsland=state.islandIndex,previousActivity=state.activityKey,currentProfile=syncProfile();renderPreparationControls(currentProfile);if(previousIsland!==state.islandIndex||previousActivity!==state.activityKey)renderBerryControls();syncSleepControls();if(state.weekKey!==weekKey()){state.weekKey=weekKey();state.completedMeals=[];persist()}
      const personalIsland=profile&&typeof profile.currentIsland==='function'?profile.currentIsland():null,islandBonusPct=profile&&typeof profile.islandBonus==='function'?profile.islandBonus(personalIsland&&personalIsland.key):0,weekMode=currentProfile&&currentProfile.weekMode||'normal',simulationActivityKey=weekMode==='preparation'&&currentProfile&&Object.hasOwn(ACTIVITY_PROFILES,currentProfile.activityKey)?currentProfile.activityKey:state.activityKey,report=calculatePlan({pokemon,context:context(),recommendTeams:options.recommendTeams,individualProductionScore:options.individualProductionScore,isFullTeamHealer:options.isFullTeamHealer,isSpecialPokemon:options.isSpecialPokemon,planner:teamPlanner,production,goodCamp:state.goodCamp,eventGoodCamp:state.eventGoodCamp,travelTicketPlanned:state.travelTicketPlanned,preparationRecipeTypes:state.preparationRecipeTypes,activityKey:state.activityKey,simulationActivityKey,simulationDays:state.simulationDays,simulationAutoTasty:state.simulationAutoTasty,simulationTastyTarget:state.simulationTastyTarget,skillCollectionHours:state.skillCollectionHours,collectBeforeSwap:state.collectBeforeSwitch,exWeeklyEffect:state.exWeeklyEffect,weekMode,islandBonusPct,islandProfile:personalIsland&&personalIsland.teamProfile||'none',inventoryLimit:currentProfile&&currentProfile.inventoryLimit||INVENTORY_LIMIT,recipes,recipeEnergy:options.recipeEnergy,recipeType:state.recipeType,targetRecipeId:state.targetRecipeId,basePot:state.basePot,mealGoal:state.mealGoal,completedMeals:state.completedMeals,inventory:state.inventory,currentSnorlaxStrength:state.currentSnorlaxStrength,sleepType:state.sleepType,sleepObjective:state.sleepObjective,sleepTargetId:state.sleepTargetId,sleepTeam:typeof options.currentTeam==='function'?options.currentTeam():[],strategy:options.strategy,catalog:options.catalog});renderSleepTargets(report);controls.result.replaceChildren(overviewSection(report),actionSection(report),simulationSection(report),sleepPlanSection(report),huntSection(report),teamSection(report),logisticsDetails(report));return report;
    }
    controls.island.addEventListener('change',()=>{state.islandIndex=Number(controls.island.value);state.berries=[];state.sleepTargetId='';renderBerryControls();persist();render()});
    controls.recipeType.addEventListener('change',()=>{state.recipeType=controls.recipeType.value;renderRecipeOptions(true);persist();render()});
    controls.activity.addEventListener('change',()=>{const previous=ACTIVITY_PROFILES[state.activityKey]||ACTIVITY_PROFILES.normal;state.activityKey=controls.activity.value;if(state.mealGoal===previous.defaultMealGoal){state.mealGoal=ACTIVITY_PROFILES[state.activityKey].defaultMealGoal;controls.mealGoal.value=String(state.mealGoal)}persist();render()});
    controls.targetRecipe.addEventListener('change',()=>{state.targetRecipeId=controls.targetRecipe.value;state.completedMeals=[];persist();render()});
    controls.preparationRoutes?.querySelectorAll('input[type="checkbox"]').forEach(input=>input.addEventListener('change',()=>{const selected=[...controls.preparationRoutes.querySelectorAll('input[type="checkbox"]:checked')].map(item=>item.value);if(!selected.length){input.checked=true;return}state.preparationRecipeTypes=selected;state.completedMeals=[];persist();render()}));
    controls.mealGoal.addEventListener('change',()=>{state.mealGoal=clamp(Math.round(controls.mealGoal.value),1,21);controls.mealGoal.value=String(state.mealGoal);persist();render()});
    controls.camp.addEventListener('change',()=>{state.goodCamp=controls.camp.checked;renderRecipeOptions(true);persist();render()});
    controls.eventCamp.addEventListener('change',()=>{state.eventGoodCamp=controls.eventCamp.checked;renderRecipeOptions(true);persist();render()});
    controls.travelTicket.addEventListener('change',()=>{state.travelTicketPlanned=controls.travelTicket.checked;persist();render()});
    controls.pot.addEventListener('change',()=>{state.basePot=clamp(Math.round(controls.pot.value),1,LIMITS.permanentPot);controls.pot.value=String(state.basePot);renderRecipeOptions(true);persist();render()});
    controls.simulationDays?.addEventListener('change',()=>{state.simulationDays=clamp(Math.round(controls.simulationDays.value),1,14);controls.simulationDays.value=String(state.simulationDays);persist();render()});
    controls.simulationAutoTasty?.addEventListener('change',()=>{state.simulationAutoTasty=controls.simulationAutoTasty.checked;persist();render()});
    controls.simulationTastyTarget?.addEventListener('change',()=>{const value=Number(controls.simulationTastyTarget.value);state.simulationTastyTarget=clamp(Math.round(Number.isFinite(value)?value:70),0,70);controls.simulationTastyTarget.value=String(state.simulationTastyTarget);persist();render()});
    controls.skillCollectionHours?.addEventListener('change',()=>{state.skillCollectionHours=clamp(Number(controls.skillCollectionHours.value)||4,.5,24);persist();render()});
    controls.collectBeforeSwitch?.addEventListener('change',()=>{state.collectBeforeSwitch=controls.collectBeforeSwitch.checked;persist();render()});
    controls.exWeeklyEffect?.addEventListener('change',()=>{state.exWeeklyEffect=controls.exWeeklyEffect.value;persist();render()});
    function queueSleepInputRender(){if(sleepInputTimer)clearTimeout(sleepInputTimer);sleepInputTimer=setTimeout(()=>{sleepInputTimer=null;persist();render()},180)}
    controls.currentStrength?.addEventListener('input',()=>{state.currentSnorlaxStrength=Math.max(0,Math.round(Number(controls.currentStrength.value)||0));queueSleepInputRender()});
    controls.sleepType?.addEventListener('change',()=>{state.sleepType=controls.sleepType.value;persist();render()});
    controls.sleepObjective?.addEventListener('change',()=>{state.sleepObjective=controls.sleepObjective.value;if(sleepResearch.TARGET_OBJECTIVES.has(state.sleepObjective)&&!state.sleepTargetId)state.sleepTargetId='';persist();render()});
    controls.sleepTargetSelect?.addEventListener('change',()=>{state.sleepTargetId=controls.sleepTargetSelect.value;persist();render()});
    controls.settingsOpen?.addEventListener('click',()=>profile&&typeof profile.open==='function'&&profile.open());window.addEventListener('pokemon-sleep:personal-settings-change',render);
    syncControls();render();return {render,getState:()=>({...state}),calculatePlan};
  }
  return Object.freeze({STORAGE_KEY,INVENTORY_LIMIT,ACTIVITY_PROFILES,MEAL_NAMES,DAY_NAMES,weekKey,daysRemainingInWeek,calculateDrowsyPower,sleepMultiplierForTeam,calculateSleepPlan,effectivePot,recipeRows,chooseTargetRecipe,isEventArea,isPsychic,activityApplies,activityEligibleMember,activityMemberModifier,applyActivityContext,mergeTargetRecipes,individualIngredientProduction,buildPreparationTeam,buildOutputTeam,ingredientBudget,createActionPlan,teamRates,teamBreakdown,activityCookingMultiplier,finalPotCapacity,ingredientTotals,craftableMeals,sundayMealShare,expectedCookingMultiplier,buildShiftSchedule,simulateActivityWeek,buildHuntTargets,huntTargetIconIdentity,calculatePlan,normalizeState,mount});
});
