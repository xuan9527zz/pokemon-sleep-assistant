(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_INVESTMENT_PLANNER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const BASE_EXP=Object.freeze([0,0,54,71,108,128,164,202,244,274,315,345,376,407,419,429,440,454,469,483,497,515,537,558,579,600,622,643,665,686,708,729,748,766,785,803,821,839,857,875,893,910,928,945,963,980,997,1015,1032,1049,1066,1362,1562,1747,1946,2195,2279,2404,2533,2666,2806,2865,2922,2977,3029,3077,3095,3116,3144,3189,3255]);
  const SHARDS_PER_CANDY=Object.freeze([0,0,14,18,22,27,30,34,39,44,48,50,52,53,56,59,62,66,68,71,74,78,81,85,88,92,95,100,105,111,117,122,126,130,136,143,151,160,167,174,184,192,201,211,221,227,236,250,264,279,295,309,323,338,356,372,391,437,486,538,593,651,698,750,804,866,932,1004,1084,1173,1272]);
  const EXP_FACTORS=Object.freeze({1:1,2:1.5,3:1.8,4:2.2});
  const SUBSKILL_LEVELS=Object.freeze([10,25,50,70,80]);
  const SPEED=Object.freeze({'帮忙速度S':.07,'帮忙速度M':.14});
  const PROBABILITY=Object.freeze({'食材概率S':.18,'食材概率M':.36,'技能概率S':.18,'技能概率M':.36});
  const INVENTORY=Object.freeze({'持有上限S':6,'持有上限M':12,'持有上限L':18});
  const UPGRADE_FAMILIES=Object.freeze([['帮忙速度S','帮忙速度M'],['食材概率S','食材概率M'],['技能概率S','技能概率M'],['技能等级S','技能等级M'],['持有上限S','持有上限M','持有上限L']]);
  const ITEM_NAMES=Object.freeze({21:'连接绳',22:'火之石',23:'水之石',24:'雷之石',25:'叶之石',26:'冰之石',27:'月之石',28:'光之石',29:'金属膜',30:'浑圆之石',31:'王者之证',35:'觉醒之石',97:'锐利之爪',102:'暗之石'});
  const MAIN_SKILL_TABLES=Object.freeze({
    1:{label:'每次能量',values:[400,569,785,1083,1496,2066,3212]},
    2:{label:'每次能量',values:[880,1251,1726,2383,3290,4546,6858]},
    3:{label:'每次梦之碎片',values:[240,340,480,670,920,1260,1800,2500]},
    4:{label:'单体活力',values:[12,15,20,25,33,44]},
    7:{label:'自身活力',values:[12,16.2,21.2,26.6,33.6,43.4]},
    8:{label:'全队每只活力',values:[5,7,9,11.4,15,18.1]},
    9:{label:'全队额外帮忙',values:[6,7,8,9,10,11,12]},
    10:{label:'随机食材',values:[6,8,11,14,17,21,24]},
    11:{label:'扩锅格数',values:[7,10,12,17,22,27,31]},
    14:{label:'料理大成功率',values:[4,5,6,7,8,10],suffix:'%'},
    15:{label:'标准4种同属性时每只帮忙',values:[4,5,6,7,8,9]},
    21:{label:'自身树果',values:[11,14,21,24,27,30]},
    23:{label:'正面能量（未扣队友活力）',values:[2640,3753,5178,7149,9870,13638,18515]},
    24:{label:'指定池食材',values:[5,6,8,11,13,16,18]},
    25:{label:'指定池食材',values:[5,6,8,11,13,16,18]},
    26:{label:'随机食材',values:[5,7,9,11,13,16,18]},
    28:{label:'指定池食材',values:[5,6,8,11,13,16,18]},
    29:{label:'食材（或糖果结果）',values:[4,6,8,10,12,15,17]},
    36:{label:'额外能量',values:[200,285,393,542,748,1033,1501,2042]}
  });
  const ROLE_LABELS=Object.freeze({berry:'树果手',ingredient:'食材手',skill:'技能手',all:'全能手'});
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,Number(value)||0));
  const round=(value,digits=1)=>{const scale=10**digits;return Math.round((Number(value)+Number.EPSILON)*scale)/scale};
  const parseLevel=value=>clamp(Math.round(Number(value)||1),1,70);
  const parseSkills=mon=>{const result=String(mon&&mon.effectiveSubs||mon&&mon.subs||'').split('；').slice(0,5);while(result.length<5)result.push('—');return result};
  const natureName=value=>String(value||'').split(/[：:]/)[0].trim();
  function natureModifiers(value,natureApi){
    const item=(natureApi&&natureApi.natures||[]).find(row=>row.name===natureName(value))||{};
    return {help:item.up==='speed'?.9:item.down==='speed'?1.075:1,ingredient:item.up==='ingredient'?1.2:item.down==='ingredient'?.8:1,skill:item.up==='skill'?1.2:item.down==='skill'?.8:1,exp:item.up==='exp'?1.18:item.down==='exp'?.82:1};
  }
  function candyXpForLevel(level){return level<25?40:level<30?35:25}
  function simulateLevelInvestment(currentLevel,targetLevel,expType,natureValue,natureApi){
    const current=parseLevel(currentLevel),target=Math.max(current,parseLevel(targetLevel)),factor=EXP_FACTORS[Number(expType)]||1,nature=natureModifiers(natureValue,natureApi);
    let candies=0,shards=0,carry=0,totalExp=0;
    for(let next=current+1;next<=target;next++){
      const need=BASE_EXP[next]*factor;totalExp+=need;
      const candyXp=candyXpForLevel(next-1)*nature.exp;
      while(carry+1e-9<need){carry+=candyXp;candies++;shards+=SHARDS_PER_CANDY[next]||0}
      carry-=need;
    }
    return {currentLevel:current,targetLevel:target,expType:Number(expType)||1,expFactor:factor,natureExpMultiplier:nature.exp,totalExp:Math.round(totalExp),candies,shards,remainingCandyExp:round(carry)};
  }
  function parseIngredients(value,level){
    const unlocks=[1,30,60];return String(value||'').split('／').map((raw,index)=>{const match=raw.trim().match(/^(.+?)×(\d+)$/);return {name:match?match[1].trim():raw.trim(),quantity:match?Number(match[2]):0,unlockLevel:unlocks[index]||60}}).filter(item=>item.quantity>0&&item.unlockLevel<=level);
  }
  function activeSkills(skills,level){return skills.filter((skill,index)=>skill!=='—'&&SUBSKILL_LEVELS[index]<=level)}
  function productionSnapshot(mon,species,level,skills,natureApi){
    const safeLevel=parseLevel(level),active=activeSkills(skills,safeLevel),nature=natureModifiers(mon.nature,natureApi);
    const speedReduction=clamp(active.reduce((sum,skill)=>sum+(SPEED[skill]||0),0),0,.35),interval=Number(species.helpFrequencyBaseSec)*(501-safeLevel)/500*nature.help*(1-speedReduction),helpsPerDay=interval>0?86400/interval:0;
    const ingredientBoost=active.reduce((sum,skill)=>sum+(/^食材概率/.test(skill)?PROBABILITY[skill]||0:0),0),skillBoost=active.reduce((sum,skill)=>sum+(/^技能概率/.test(skill)?PROBABILITY[skill]||0:0),0);
    const ingredientRate=clamp(Number(species.ingredientRate)*nature.ingredient*(1+ingredientBoost),0,.95),skillRate=clamp(Number(species.skillRatePct)/100*nature.skill*(1+skillBoost),0,.95),slots=parseIngredients(mon.ingredients,safeLevel),averageQuantity=slots.length?slots.reduce((sum,item)=>sum+item.quantity,0)/slots.length:0;
    const berryCount=Number(species.baseBerryCount||1)+(active.includes('树果数量S')?1:0),carry=Number(species.carryLimitRaisedFromFirstStage||species.carryLimitBase||0)+active.reduce((sum,skill)=>sum+(INVENTORY[skill]||0),0);
    return {level:safeLevel,intervalSec:round(interval),helpsPerDay:round(helpsPerDay,2),carry:Math.round(carry),ingredientRate:round(ingredientRate*100,2),skillRate:round(skillRate*100,2),triggersPerDay:round(helpsPerDay*skillRate,2),berryItemsPerDay:round(helpsPerDay*(1-ingredientRate)*berryCount,1),ingredientItemsPerDay:round(helpsPerDay*ingredientRate*averageQuantity,1),ordinaryItemsPerDay:round(helpsPerDay*((1-ingredientRate)*berryCount+ingredientRate*averageQuantity),1),activeSkills,unlockedIngredients:slots};
  }
  function legalUpgrades(skills,level){
    const active=skills.map((skill,index)=>({skill,index})).filter(row=>row.skill!=='—'&&SUBSKILL_LEVELS[row.index]<=level),present=new Set(skills),rows=[];
    active.forEach(row=>{const family=UPGRADE_FAMILIES.find(items=>items.includes(row.skill));if(!family)return;const rank=family.indexOf(row.skill),next=family[rank+1];if(next&&!present.has(next))rows.push({...row,to:next})});return rows;
  }
  function roleUtility(snapshot,role){return role==='berry'?snapshot.berryItemsPerDay:role==='ingredient'?snapshot.ingredientItemsPerDay:role==='skill'?snapshot.triggersPerDay:snapshot.ordinaryItemsPerDay}
  function optimizeSubskillSeeds(mon,species,targetLevel,seedCount,natureApi){
    const before=parseSkills(mon),skills=[...before],upgrades=[];let remaining=clamp(Math.round(seedCount),0,5);
    while(remaining>0){
      const options=legalUpgrades(skills,targetLevel).map(option=>{const next=[...skills];next[option.index]=option.to;return {...option,next,utility:roleUtility(productionSnapshot(mon,species,targetLevel,next,natureApi),species.specialty)}}).sort((a,b)=>b.utility-a.utility||a.index-b.index);
      if(!options.length)break;const best=options[0];upgrades.push({level:SUBSKILL_LEVELS[best.index],from:best.skill,to:best.to});skills.splice(0,skills.length,...best.next);remaining--;
    }
    return {before,after:skills,upgrades,used:upgrades.length,unused:remaining};
  }
  function findEvolutionPath(sourceId,targetId,catalog){
    const byId=new Map((catalog&&catalog.pokemon||[]).map(item=>[String(item.id),item])),start=String(sourceId),target=String(targetId||sourceId);if(start===target)return [];
    const queue=[{id:start,path:[]}],seen=new Set([start]);
    while(queue.length){const current=queue.shift(),record=byId.get(current.id);for(const edge of record&&record.evolution&&record.evolution.next||[]){const id=String(edge.id),step={from:current.id,to:id,conditions:edge.conditions||[]},path=[...current.path,step];if(id===target)return path;if(!seen.has(id)){seen.add(id);queue.push({id,path})}}}return [];
  }
  function summarizeEvolution(path,catalog){
    const byId=new Map((catalog&&catalog.pokemon||[]).map(item=>[String(item.id),item])),requirements={candy:0,items:[],sleepHours:0,minimumLevel:1,other:[]};
    const steps=path.map(step=>{const labels=(step.conditions||[]).map(condition=>{
      if(condition.type==='candy'){requirements.candy+=Number(condition.count)||0;return `${condition.count} 个糖果`}
      if(condition.type==='level'){requirements.minimumLevel=Math.max(requirements.minimumLevel,Number(condition.level)||1);return `Lv.${condition.level}`}
      if(condition.type==='item'){const name=ITEM_NAMES[condition.item]||`进化道具 #${condition.item}`;requirements.items.push({id:condition.item,name,count:Number(condition.count)||1});return `${name}×${condition.count||1}`}
      if(condition.type==='sleepTime'){requirements.sleepHours+=Number(condition.hours)||0;return `共同睡眠 ${condition.hours} 小时`}
      if(condition.type==='timing'){const label=`${condition.startHour}:00–${condition.endHour}:00`;requirements.other.push(label);return label}
      if(condition.type==='gender'){const label=condition.gender==='male'?'雄性':'雌性';requirements.other.push(label);return label}
      if(condition.type==='nature'){requirements.other.push('指定性格组');return '指定性格组'}
      requirements.other.push(condition.type);return condition.type;
    });return {from:byId.get(step.from)?.name||step.from,to:byId.get(step.to)?.name||step.to,labels}});
    return {steps,requirements};
  }
  function eligibleEvolutionPath(path,targetLevel){
    const result=[];for(const step of path){const minimum=(step.conditions||[]).filter(item=>item.type==='level').reduce((max,item)=>Math.max(max,Number(item.level)||1),1);if(minimum>targetLevel)break;result.push(step)}return result;
  }
  function mainSkillCap(name){if(/梦之碎片获取S|波导弹|十项全能/.test(name))return 8;if(/帮手支援S|能量填充[SM]|蓄力|噩梦|食材获取S|食材精选S|料理强化S|料理辅助S/.test(name))return 7;return 6}
  function mainSkillEffect(mainSkillId,level){
    const safe=Math.max(1,Math.round(Number(level)||1)),table=MAIN_SKILL_TABLES[Number(mainSkillId)];if(table){const value=table.values[Math.min(safe,table.values.length)-1];return `${table.label} ${Number(value).toLocaleString('zh-CN')}${table.suffix||''}`}
    if(Number(mainSkillId)===5){const rows=[[200,800],[285,1138],[393,1570],[542,2166],[748,2992],[1033,4132],[1606,6424]],row=rows[Math.min(safe,rows.length)-1];return `随机能量 ${row[0].toLocaleString('zh-CN')}–${row[1].toLocaleString('zh-CN')}`}
    if(Number(mainSkillId)===6){const rows=[[120,480],[170,680],[240,960],[335,1340],[460,1840],[630,2520],[900,3600],[1150,4600]],row=rows[Math.min(safe,rows.length)-1];return `随机梦之碎片 ${row[0].toLocaleString('zh-CN')}–${row[1].toLocaleString('zh-CN')}`}
    if(Number(mainSkillId)===17){const own=[8,10,15,17,19,21],team=[1,2,2,3,4,5],index=Math.min(safe,6)-1;return `自身树果 ${own[index]}＋队友各 ${team[index]}`}
    if(Number(mainSkillId)===18){const own=[12,16.2,21.2,26.6,33.6,43.4],bonus=[6.3,7.7,10.1,13,17.2,22.8],index=Math.min(safe,6)-1;return `自身活力 ${own[index]}＋45%追加 ${bonus[index]}`}
    if(Number(mainSkillId)===27){const pot=[5,7,9,12,16,20,24],heal=[8,10,13,17,23,30,35],index=Math.min(safe,7)-1;return `扩锅 ${pot[index]}＋自身活力 ${heal[index]}`}
    if(Number(mainSkillId)===30){const heal=[9,12,16,20,27,35],draws=[2,3,4,5,6,7],index=Math.min(safe,6)-1;return `单体活力 ${heal[index]}＋追加抽选 ${draws[index]}`}
    if(Number(mainSkillId)===31){const food=[6,8,11,14,17,21,24],bonus=[1,2,2,3,3,4,5],index=Math.min(safe,7)-1;return `食材 ${food[index]}＋大成功率 ${bonus[index]}%`}
    if(Number(mainSkillId)===34){const heal=[6,8,10,13,17,22],helps=[1,2,2,3,4,4],index=Math.min(safe,6)-1;return `两目标活力 ${heal[index]}＋额外帮忙 ${helps[index]}`}
    if(Number(mainSkillId)===35){const own=[20,33,41,49,53,58],team=[2,2,3,4,5,5],index=Math.min(safe,6)-1;return `标准5种龙：自身 ${own[index]}＋队友各 ${team[index]} 树果`}
    if([13,19,20].includes(Number(mainSkillId)))return `复制／随机技能按 Lv.${safe} 发动`;
    return `复杂技能效果 Lv.${safe}`;
  }
  function calculateInvestment(mon,targetLevel,options){
    const {catalog,scoring,natureApi,mainSeeds=0,subSeeds=0,includeEvolution=true}=options||{},source=scoring.recordForPokemon(mon),final=scoring.targetForPokemon(mon)||source;if(!source||!final)return {ok:false,reason:'missing-catalog'};
    const target=Math.max(parseLevel(mon.lv),parseLevel(targetLevel)),fullPath=includeEvolution?findEvolutionPath(source.id,final.id,catalog):[],path=eligibleEvolutionPath(fullPath,target),evolution=summarizeEvolution(path,catalog),targetId=path.length?path[path.length-1].to:source.id,targetSpecies=(catalog.pokemon||[]).find(item=>String(item.id)===String(targetId))||source,level=simulateLevelInvestment(mon.lv,target,targetSpecies.expType||source.expType,mon.nature,natureApi),seedPlan=optimizeSubskillSeeds(mon,targetSpecies,target,subSeeds,natureApi),before=productionSnapshot(mon,source,mon.lv,parseSkills(mon),natureApi),after=productionSnapshot(mon,targetSpecies,target,seedPlan.after,natureApi),currentMain=Number(String(mon.main||'').match(/Lv\.(\d+)/)?.[1]||1),cap=mainSkillCap(targetSpecies.mainSkill&&targetSpecies.mainSkill.name||mon.main),evolutionMain=Math.min(cap,currentMain+path.length),targetMain=Math.min(cap,evolutionMain+clamp(Math.round(mainSeeds),0,8));
    const sourceMainSkillId=Number(source.mainSkill&&source.mainSkill.id||0),mainSkillId=Number(targetSpecies.mainSkill&&targetSpecies.mainSkill.id||0);return {ok:true,source,final,targetSpecies,fullEvolutionAvailable:path.length===fullPath.length,level,evolution,seedPlan,before,after,mainSkill:{id:mainSkillId,sourceId:sourceMainSkillId,sourceName:source.mainSkill&&source.mainSkill.name||String(mon.main).replace(/\s*Lv\.\d+.*/,''),name:targetSpecies.mainSkill&&targetSpecies.mainSkill.name||String(mon.main).replace(/\s*Lv\.\d+.*/,''),current:currentMain,afterEvolution:evolutionMain,target:targetMain,cap,evolutionLevels:evolutionMain-currentMain,seedsUsed:targetMain-evolutionMain,currentEffect:mainSkillEffect(sourceMainSkillId,currentMain),targetEffect:mainSkillEffect(mainSkillId,targetMain)},cost:{levelCandies:level.candies,evolutionCandies:evolution.requirements.candy,totalCandies:level.candies+evolution.requirements.candy,shards:level.shards,items:evolution.requirements.items},gains:{intervalPct:round((1-after.intervalSec/before.intervalSec)*100),helpsPct:round((after.helpsPerDay/before.helpsPerDay-1)*100),ordinaryPct:round((after.ordinaryItemsPerDay/before.ordinaryItemsPerDay-1)*100),ingredientPct:round((after.ingredientItemsPerDay/Math.max(before.ingredientItemsPerDay,.01)-1)*100),triggersPct:round((after.triggersPerDay/Math.max(before.triggersPerDay,.01)-1)*100)}};
  }
  function formatNumber(value){return Number(value||0).toLocaleString('zh-CN',{maximumFractionDigits:1})}
  function formatInterval(seconds){const total=Math.round(seconds),minutes=Math.floor(total/60),rest=total%60;return `${minutes}分${String(rest).padStart(2,'0')}秒`}
  function mount(options={}){
    if(typeof document==='undefined')return null;const pokemon=options.pokemon||[],catalog=options.catalog,scoring=options.scoring,natureApi=options.natureApi||window.POKEMON_SLEEP_SCORING;
    const open=document.querySelector('#investmentPlannerOpen'),dialog=document.querySelector('#investmentPlannerDialog');if(!open||!dialog)return null;
    const close=document.querySelector('#investmentPlannerClose'),cancel=document.querySelector('#investmentPlannerCancel'),monSelect=document.querySelector('#investmentPokemon'),target=document.querySelector('#investmentTargetLevel'),mainSeeds=document.querySelector('#investmentMainSeeds'),subSeeds=document.querySelector('#investmentSubSeeds'),evolve=document.querySelector('#investmentEvolution'),resultRoot=document.querySelector('#investmentResult');
    pokemon.slice().sort((a,b)=>Number(a.id)-Number(b.id)).forEach(mon=>{const option=document.createElement('option');option.value=mon.id;option.textContent=`#${mon.id} ${mon.name} · Lv.${mon.lv}`;monSelect.append(option)});
    const show=()=>{if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal()}else dialog.setAttribute('open','');render()};const hide=()=>{if(typeof dialog.close==='function'&&dialog.open)dialog.close();else dialog.removeAttribute('open')};
    function render(){const mon=pokemon.find(item=>String(item.id)===monSelect.value);if(!mon)return;const report=calculateInvestment(mon,target.value,{catalog,scoring,natureApi,mainSeeds:mainSeeds.value,subSeeds:subSeeds.value,includeEvolution:evolve.checked});resultRoot.replaceChildren();if(!report.ok){resultRoot.textContent='缺少这只宝可梦的图鉴资料。';return}
      const heading=document.createElement('div');heading.className='investment-result-head';heading.innerHTML=`<div><span>${ROLE_LABELS[report.targetSpecies.specialty]||'待分类'} · ${report.source.name}${report.source.id!==report.targetSpecies.id?` → ${report.targetSpecies.name}`:''}</span><h3>Lv.${report.before.level} → Lv.${report.after.level}</h3></div><strong>${formatNumber(report.cost.totalCandies)} 糖果</strong>`;
      const costs=document.createElement('div');costs.className='investment-cost-grid';[['升级糖果',formatNumber(report.cost.levelCandies)],['进化糖果',formatNumber(report.cost.evolutionCandies)],['梦之碎片',formatNumber(report.cost.shards)],['主／副种子',`${report.mainSkill.seedsUsed}／${report.seedPlan.used}`]].forEach(([label,value])=>{const item=document.createElement('span');item.innerHTML=`<small>${label}</small><b>${value}</b>`;costs.append(item)});
      const compare=document.createElement('div');compare.className='investment-compare';compare.innerHTML=`<div><span>帮忙间隔</span><b>${formatInterval(report.before.intervalSec)} → ${formatInterval(report.after.intervalSec)}</b><small>${report.gains.intervalPct>=0?'-':'+'}${Math.abs(report.gains.intervalPct).toFixed(1)}%</small></div><div><span>普通产出指数／日</span><b>${formatNumber(report.before.ordinaryItemsPerDay)} → ${formatNumber(report.after.ordinaryItemsPerDay)}</b><small>+${report.gains.ordinaryPct.toFixed(1)}%</small></div><div><span>食材数量估算／日</span><b>${formatNumber(report.before.ingredientItemsPerDay)} → ${formatNumber(report.after.ingredientItemsPerDay)}</b><small>${report.gains.ingredientPct>=0?'+':''}${report.gains.ingredientPct.toFixed(1)}%</small></div><div><span>主技能触发估算／日</span><b>${report.before.triggersPerDay.toFixed(2)} → ${report.after.triggersPerDay.toFixed(2)}</b><small>${report.gains.triggersPct>=0?'+':''}${report.gains.triggersPct.toFixed(1)}%</small></div>`;
      const details=document.createElement('div');details.className='investment-details';const evo=report.evolution.steps.length?report.evolution.steps.map(step=>`${step.from} → ${step.to}（${step.labels.join('＋')}）`).join('；'):'不需要进化或本次未计入进化';const seeds=report.seedPlan.upgrades.length?report.seedPlan.upgrades.map(item=>`Lv.${item.level} ${item.from}→${item.to}`).join('；'):'没有可用或已选择 0 颗副技能种子';const skillName=report.mainSkill.sourceName===report.mainSkill.name?report.mainSkill.name:`${report.mainSkill.sourceName} → ${report.mainSkill.name}`;details.innerHTML=`<p><b>进化路径：</b>${evo}${report.fullEvolutionAvailable?'':'；目标等级不足以到最终形态，本档只计算可达到的阶段'}</p><p><b>副技能种子：</b>${seeds}</p><p><b>主技能：</b>${skillName} Lv.${report.mainSkill.current} → Lv.${report.mainSkill.target}${report.mainSkill.evolutionLevels?`（进化＋${report.mainSkill.evolutionLevels}）`:''}${report.mainSkill.target===report.mainSkill.cap?'（已到上限）':''}</p><p><b>每次主技能效果：</b>${report.mainSkill.currentEffect} → ${report.mainSkill.targetEffect}</p><p class="investment-caveat">糖果按当前等级 0 进度估算；等级 EXP 性格、成长类型、进化糖果和进化道具均已计入。普通产出与触发次数是基于图鉴概率的透明估算，不包含活动周临时加成、睡眠经验或主技能保底机制。</p>`;
      resultRoot.append(heading,costs,compare,details);
    }
    open.addEventListener('click',show);close.addEventListener('click',hide);cancel.addEventListener('click',hide);[monSelect,target,mainSeeds,subSeeds,evolve].forEach(control=>control.addEventListener('change',render));dialog.addEventListener('cancel',event=>{event.preventDefault();hide()});dialog.addEventListener('click',event=>{if(event.target===dialog)hide()});document.addEventListener('pokemon-sleep:invest-pokemon',event=>{if(event.detail&&event.detail.id)monSelect.value=String(event.detail.id);show()});return {open:show,render,calculateInvestment};
  }
  return Object.freeze({BASE_EXP,SHARDS_PER_CANDY,EXP_FACTORS,ITEM_NAMES,MAIN_SKILL_TABLES,natureModifiers,candyXpForLevel,simulateLevelInvestment,productionSnapshot,legalUpgrades,optimizeSubskillSeeds,findEvolutionPath,summarizeEvolution,eligibleEvolutionPath,mainSkillEffect,calculateInvestment,mount});
});
