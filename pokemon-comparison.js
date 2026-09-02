(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_POKEMON_COMPARISON=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const STORAGE_KEY='pokemon-sleep-comparison-v1';
  const SLOT_LEVELS=Object.freeze([10,25,50,70,80]);
  const STATUS_RANK=Object.freeze({graduation:90,keep:80,worker:70,compromise:65,transition:60,'route-review':50,borderline:40,pass:30,manual:10});
  const ROLE_LABELS=Object.freeze({berry:'树果手',ingredient:'食材手',skill:'技能手',all:'全能手',unknown:'待核对'});

  const finite=value=>value===null||value===undefined||value===''?null:Number.isFinite(Number(value))?Number(value):null;
  const formatScore=value=>finite(value)===null?'待定':finite(value).toFixed(1);
  const numberId=value=>{const parsed=Number(value);return Number.isFinite(parsed)?parsed:Number.MAX_SAFE_INTEGER};
  const finalFormId=mon=>String(mon&&(
    mon.scoreBreakdown&&mon.scoreBreakdown.finalFormId||mon.finalFormId||mon.speciesId||mon.name
  )||'');
  const finalFormName=mon=>String(mon&&(
    mon.scoreBreakdown&&mon.scoreBreakdown.finalFormNameZh||mon.finalFormName||mon.name
  )||'未知');
  const specialtyOf=mon=>String(mon&&(
    mon.scoreBreakdown&&mon.scoreBreakdown.specialty||mon.specialty
  )||'unknown');
  const scoreOf=(mon,key,fallback)=>{
    const breakdown=mon&&mon.scoreBreakdown||{},value=finite(breakdown[key]);
    return value===null?finite(mon&&mon[fallback]):value;
  };
  const splitSubskills=mon=>{
    const skills=String(mon&&(mon.effectiveSubs||mon.effectiveSubskills||mon.subs||mon.subskills)||'').split('；').slice(0,5);
    while(skills.length<5)skills.push('—');
    return skills;
  };
  const courseFor=(mon,strategy)=>{
    if(mon&&mon.minimumStandard)return mon.minimumStandard;
    if(strategy&&typeof strategy.minimumStandard==='function'){
      const score=mon&&mon.scoreBreakdown||{};
      return strategy.minimumStandard(mon,{finalId:finalFormId(mon),specialty:specialtyOf(mon),strategicProfile:score.strategy});
    }
    return {status:'manual',label:'人工判断',missing:['课程判定尚未生成'],effectiveGains:[],secondaryGains:[],routePattern:'不适用',courseNote:'',investmentLimit:''};
  };
  const ingredientRoute=(mon,course)=>{
    if(course&&course.routePattern&&course.routePattern!=='不适用')return course.routePattern;
    const pattern=mon&&mon.scoreBreakdown&&mon.scoreBreakdown.individual&&mon.scoreBreakdown.individual.ingredientPattern;
    return pattern&&pattern!=='不适用'?String(pattern):'不适用';
  };

  function subskillRows(mon){
    const level=Math.max(1,Number(mon&&mon.lv||mon&&mon.level||1));
    return splitSubskills(mon).map((skill,index)=>({level:SLOT_LEVELS[index],skill,unlocked:level>=SLOT_LEVELS[index]}));
  }

  function ingredientNames(mon,teamPlanner,level=100){
    if(!mon)return [];
    if(teamPlanner&&typeof teamPlanner.parseIngredientSlots==='function'){
      return [...new Set(teamPlanner.parseIngredientSlots(mon.ingredients,level).all.map(item=>item.name))];
    }
    return [...new Set(String(mon.ingredients||'').split('／').map(item=>item.replace(/×\d+$/,'').trim()).filter(item=>item&&item!=='—'))];
  }

  function productionView(mon,targetIngredient,{teamPlanner,production,goodCamp=true,energyProfile='average',teammateHelpingBonusCount=0}={}){
    if(!mon||!targetIngredient||!teamPlanner)return null;
    const productionById=production&&production.byBoxId||production||{},record=productionById[String(mon.id)];
    const result=typeof teamPlanner.calculateMember==='function'
      ?teamPlanner.calculateMember(mon,record,{goodCamp,energyProfile,teammateHelpingBonusCount})
      :null;
    if(!result||!result.valid||!result.member)return {valid:false,id:String(mon.id||''),name:String(mon.name||'未知'),targetIngredient,message:result&&result.message||'当前产出模型不可用。'};
    const member=result.member,targetRows=member.ingredients.filter(item=>item.name===targetIngredient),allRows=teamPlanner.parseIngredientSlots(mon.ingredients,100).all.filter(item=>item.name===targetIngredient),lockedRows=allRows.filter(item=>item.unlockLevel>Number(mon.lv));
    const perDay=targetRows.reduce((sum,item)=>sum+item.perDay,0),perCollection=targetRows.reduce((sum,item)=>sum+item.perCollection,0);
    return {
      valid:true,id:String(mon.id||''),name:String(mon.name||'未知'),level:Number(mon.lv)||1,targetIngredient,
      perDay,perCollection,collectionHours:result.collectionHours,fullHours:member.fullHours,
      ingredientProbability:member.probability.current,effectiveIntervalSec:member.effectiveIntervalSec,
      ownHelpingBonus:result.ownHelpingBonus,teammateHelpingBonusCount:result.teammateHelpingBonusCount,
      unlockedSlots:targetRows.map(item=>({unlockLevel:item.unlockLevel,quantity:item.quantity})),
      lockedSlots:lockedRows.map(item=>({unlockLevel:item.unlockLevel,quantity:item.quantity})),
      rateProvisional:Boolean(member.probability.provisional),goodCamp:result.options.goodCamp,energyProfile:result.energyProfile
    };
  }

  function compareProduction(leftMon,rightMon,targetIngredient,options={}){
    const left=productionView(leftMon,targetIngredient,options),right=productionView(rightMon,targetIngredient,options);
    if(!left||!right)return {left,right,leader:'none',targetIngredient,title:'请选择目标食材',detail:'选择两只宝可梦和目标食材后显示上场产出。'};
    if(!left.valid||!right.valid)return {left,right,leader:left.valid?'left':right.valid?'right':'none',targetIngredient,title:'部分个体无法参与产出计算',detail:[left.message,right.message].filter(Boolean).join(' ')};
    const difference=left.perDay-right.perDay,leader=Math.abs(difference)<.05?'tie':difference>0?'left':'right',winner=leader==='left'?left:leader==='right'?right:null,loser=leader==='left'?right:leader==='right'?left:null;
    const delta=Math.abs(difference),ratio=winner&&loser&&loser.perDay>0?winner.perDay/loser.perDay:null;
    return {
      left,right,leader,targetIngredient,difference,ratio,
      title:winner?`${winner.name}的${targetIngredient}常规产出更高`:`两只的${targetIngredient}产出接近`,
      detail:winner?`按相同队伍条件估算，24小时约多 ${delta.toFixed(1)} 个${ratio?`，约为另一只的 ${ratio.toFixed(2)} 倍`:''}。`:'两只在当前设置下的24小时期望差距不足0.1个。'
    };
  }

  function viewModel(mon,{strategy}={}){
    if(!mon)return null;
    const course=courseFor(mon,strategy),specialty=specialtyOf(mon),cultivation=mon.cultivation||null;
    return {
      raw:mon,
      id:String(mon.id||''),
      name:String(mon.name||'未知'),
      level:Math.max(1,Number(mon.lv||mon.level||1)),
      shiny:mon.shiny==='是'||mon.shiny===true,
      boxName:String(mon.boxName||'未分类'),
      battleEligible:mon.battleEligible!==false,
      finalFormId:finalFormId(mon),
      finalFormName:finalFormName(mon),
      specialty,
      specialtyLabel:String(mon.specialtyLabel||ROLE_LABELS[specialty]||'待核对'),
      totalScore:scoreOf(mon,'finalScore','scoreTotal'),
      speciesScore:scoreOf(mon,'speciesScore','scoreSpecies'),
      individualScore:scoreOf(mon,'individualScore','scoreIndividual'),
      mainSkill:String(mon.main||mon.mainSkill||'—'),
      nature:String(mon.nature||'—'),
      ingredients:String(mon.ingredients||'—'),
      ingredientRoute:ingredientRoute(mon,course),
      course:{
        status:String(course.status||'manual'),
        label:String(course.label||'人工判断'),
        rank:STATUS_RANK[course.status]||0,
        meetsGraduation:Boolean(course.meetsGraduation),
        meetsMinimum:Boolean(course.meetsMinimum),
        missing:Array.isArray(course.missing)?course.missing.map(String):[],
        gains:[...(Array.isArray(course.effectiveGains)?course.effectiveGains:[]),...(Array.isArray(course.secondaryGains)?course.secondaryGains:[])].map(String),
        note:String(course.courseNote||''),
        investmentLimit:String(course.investmentLimit||'')
      },
      cultivation:cultivation?{
        tier:String(cultivation.tier||'manual'),
        label:String(cultivation.label||'人工判断'),
        reason:String(cultivation.reason||''),
        nextAction:String(cultivation.nextAction||'')
      }:null,
      subskills:subskillRows(mon)
    };
  }

  function compareNumeric(left,right,key){
    const a=finite(left&&left[key]),b=finite(right&&right[key]);
    if(a===null||b===null||Math.abs(a-b)<0.05)return 0;
    return a>b?1:-1;
  }

  function safetyWarnings(left,right,sameFinalForm){
    const warnings=['对比结论只用于决定培养先后，不会自动给出放生建议。'];
    if(!sameFinalForm)warnings.push('不同最终形态与岗位的分数口径不同，不能据此直接互相替代。');
    const protectedMons=[left,right].filter(mon=>mon&&(mon.shiny||mon.level>=30||/Lv\.[2-9]/.test(mon.mainSkill)));
    if(protectedMons.length)warnings.push('对比中包含闪光或已有练度／技能投入的个体，请把收藏价值与沉没资源单独纳入判断。');
    return warnings;
  }

  function comparePokemon(leftMon,rightMon,{strategy}={}){
    const left=viewModel(leftMon,{strategy}),right=viewModel(rightMon,{strategy});
    if(!left||!right)return {left,right,leader:'none',sameFinalForm:false,sameSpecialty:false,title:'请选择两只宝可梦',detail:'从盒子中各选一只个体后，这里会显示课程资格、分数和词条差异。',basis:'empty',warnings:[]};
    const sameFinalForm=Boolean(left.finalFormId&&left.finalFormId===right.finalFormId),sameSpecialty=left.specialty===right.specialty;
    const warnings=safetyWarnings(left,right,sameFinalForm);
    if(!sameFinalForm){
      const scoreComparison=compareNumeric(left,right,'totalScore'),scoreText=scoreComparison===0?'两只综合分接近或尚有待定项':`${scoreComparison>0?left.name:right.name}的综合分更高`;
      return {
        left,right,leader:'none',sameFinalForm,sameSpecialty,basis:'different-final-form',warnings,
        title:'不同最终形态：按队伍岗位分别判断',
        detail:`${scoreText}，但综合分包含各自的种族与岗位价值，只能作为资料展示，不能当作直接替换或放生依据。`
      };
    }
    let comparison=left.course.rank-right.course.rank,basis='course';
    if(!comparison){comparison=compareNumeric(left,right,'individualScore');basis='individual';}
    if(!comparison){comparison=compareNumeric(left,right,'totalScore');basis='total';}
    const leader=comparison>0?'left':comparison<0?'right':'tie',winner=leader==='left'?left:leader==='right'?right:null;
    let detail='课程资格、个体分和综合分均无法拉开差距，可结合队伍缺口与已投入资源决定。';
    if(basis==='course'&&winner)detail=`课程资格优先：${left.name}为“${left.course.label}”，${right.name}为“${right.course.label}”。`;
    else if(basis==='individual'&&winner)detail=`课程资格相同，按个体分比较：${left.name} ${formatScore(left.individualScore)}，${right.name} ${formatScore(right.individualScore)}。`;
    else if(basis==='total'&&winner)detail=`课程资格与个体分接近，以综合分作最后参考：${left.name} ${formatScore(left.totalScore)}，${right.name} ${formatScore(right.totalScore)}。`;
    return {
      left,right,leader,sameFinalForm,sameSpecialty,basis,warnings,
      title:winner?`${winner.name}更适合作为当前培养候选`:'两只个体暂时并列',detail
    };
  }

  function comparisonPriority(mon,strategy){
    const view=viewModel(mon,{strategy});
    return [view.course.rank,view.individualScore===null?-1:view.individualScore,view.totalScore===null?-1:view.totalScore,-numberId(view.id)];
  }
  function comparePriority(a,b,strategy){
    const left=comparisonPriority(a,strategy),right=comparisonPriority(b,strategy);
    for(let index=0;index<left.length;index++){if(left[index]!==right[index])return right[index]-left[index]}
    return 0;
  }
  function chooseDefaults(pokemon,strategy){
    const mons=(Array.isArray(pokemon)?pokemon:[]).filter(Boolean),groups=new Map();
    mons.forEach(mon=>{const key=finalFormId(mon);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mon)});
    const comparable=[...groups.values()].filter(group=>group.length>=2).sort((a,b)=>{
      const bestA=[...a].sort((x,y)=>comparePriority(x,y,strategy))[0],bestB=[...b].sort((x,y)=>comparePriority(x,y,strategy))[0];
      return comparePriority(bestA,bestB,strategy);
    })[0];
    const candidates=[...(comparable||mons)].sort((a,b)=>comparePriority(a,b,strategy));
    return {left:candidates[0]||null,right:candidates[1]||null};
  }

  function element(doc,tag,className,text){
    const node=doc.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=String(text);return node;
  }
  function appendTextRow(doc,parent,label,value,className=''){
    const row=element(doc,'div',`pokemon-comparison-row ${className}`.trim());
    row.append(element(doc,'span','',label),element(doc,'strong','',value||'—'));parent.append(row);return row;
  }
  function renderScore(doc,label,value){
    const item=element(doc,'div','pokemon-comparison-score');item.append(element(doc,'span','',label),element(doc,'strong','',formatScore(value)));return item;
  }
  function renderCard(doc,view,side,isLeader){
    const card=element(doc,'article',`pokemon-comparison-card${isLeader?' is-leader':''}`),head=element(doc,'div','pokemon-comparison-card-head'),identity=element(doc,'div','pokemon-comparison-identity'),badges=element(doc,'div','pokemon-comparison-badges');
    identity.append(element(doc,'span','pokemon-comparison-slot',`${side==='left'?'个体 A':'个体 B'} · #${view.id}`),element(doc,'h4','',view.name),element(doc,'p','',`${view.finalFormName} · Lv.${view.level} · ${view.boxName}`));
    if(isLeader)badges.append(element(doc,'span','pokemon-comparison-badge winner','当前优先'));
    if(view.shiny)badges.append(element(doc,'span','pokemon-comparison-badge shiny','闪光'));
    badges.append(element(doc,'span',`pokemon-comparison-badge role ${view.specialty}`,view.specialtyLabel));
    head.append(identity,badges);card.append(head);
    const scores=element(doc,'div','pokemon-comparison-scores');scores.append(renderScore(doc,'综合分',view.totalScore),renderScore(doc,'种族分',view.speciesScore),renderScore(doc,'个体分',view.individualScore));card.append(scores);

    const decisions=element(doc,'div','pokemon-comparison-decisions'),course=element(doc,'section',`pokemon-comparison-decision course ${view.course.status}`),courseHead=element(doc,'div','pokemon-comparison-decision-head');
    courseHead.append(element(doc,'span','','课程严选'),element(doc,'strong','',view.course.label));course.append(courseHead);
    const courseText=view.course.meetsGraduation?'已满足课程毕业面板。':view.course.missing.length?`仍缺：${view.course.missing.join('、')}`:'按当前资料继续人工判断。';
    course.append(element(doc,'p','',courseText));
    if(view.course.gains.length)course.append(element(doc,'small','',`有效增益：${view.course.gains.join('、')}`));
    if(view.course.investmentLimit)course.append(element(doc,'small',' warning',`投入边界：${view.course.investmentLimit}`));
    if(view.course.note)course.append(element(doc,'small','',view.course.note));
    decisions.append(course);
    const cultivation=element(doc,'section',`pokemon-comparison-decision cultivation ${view.cultivation&&view.cultivation.tier||'manual'}`),cultivationHead=element(doc,'div','pokemon-comparison-decision-head');
    cultivationHead.append(element(doc,'span','','培养判断'),element(doc,'strong','',view.cultivation&&view.cultivation.label||'人工判断'));cultivation.append(cultivationHead);
    cultivation.append(element(doc,'p','',view.cultivation&&view.cultivation.reason||'当前账号阶段的培养建议尚未生成。'));
    if(view.cultivation&&view.cultivation.nextAction)cultivation.append(element(doc,'small','',view.cultivation.nextAction));
    decisions.append(cultivation);card.append(decisions);

    const details=element(doc,'div','pokemon-comparison-details');
    appendTextRow(doc,details,'食材路线',view.ingredientRoute);
    appendTextRow(doc,details,'食材栏',view.ingredients);
    appendTextRow(doc,details,'主技能',view.mainSkill);
    appendTextRow(doc,details,'性格',view.nature);
    appendTextRow(doc,details,'实战状态',view.battleEligible?'参与实战':'仅收藏');card.append(details);

    const subSection=element(doc,'section','pokemon-comparison-subskills'),subHead=element(doc,'div','pokemon-comparison-subskills-head');
    subHead.append(element(doc,'strong','','副技能时间轴'),element(doc,'span','','亮色为当前已解锁'));subSection.append(subHead);
    const timeline=element(doc,'div','pokemon-comparison-timeline');
    view.subskills.forEach(item=>{const skill=element(doc,'div',`pokemon-comparison-subskill ${item.unlocked?'unlocked':'locked'}`);skill.append(element(doc,'span','',`Lv.${item.level}`),element(doc,'strong','',item.skill));timeline.append(skill)});
    subSection.append(timeline);card.append(subSection);
    const actions=element(doc,'div','pokemon-comparison-card-actions'),edit=element(doc,'button','','编辑这个体');edit.type='button';edit.addEventListener('click',()=>doc.dispatchEvent(new doc.defaultView.CustomEvent('pokemon-sleep:edit-pokemon',{detail:{id:view.id}})));actions.append(edit);card.append(actions);
    return card;
  }

  function formatHours(value,teamPlanner){
    if(teamPlanner&&typeof teamPlanner.formatHours==='function')return teamPlanner.formatHours(value);
    if(!Number.isFinite(value))return '不会满仓';
    const minutes=Math.max(1,Math.round(value*60)),hours=Math.floor(minutes/60),rest=minutes%60;
    return hours&&rest?`${hours}小时${rest}分`:hours?`${hours}小时`:`${rest}分钟`;
  }

  function renderProductionCard(doc,view,side,isLeader,teamPlanner){
    const card=element(doc,'article',`pokemon-production-card${isLeader?' is-leader':''}`),head=element(doc,'div','pokemon-production-card-head');
    head.append(element(doc,'span','',`${side==='left'?'个体 A':'个体 B'} · #${view.id}`),element(doc,'strong','',view.name));
    if(isLeader)head.append(element(doc,'b','','目标食材领先'));card.append(head);
    if(!view.valid){card.append(element(doc,'p','pokemon-production-error',view.message));return card}
    const amount=element(doc,'div','pokemon-production-amount');amount.append(element(doc,'strong','',view.perDay.toFixed(1)),element(doc,'span','',`个 ${view.targetIngredient}／24h`));card.append(amount);
    const metrics=element(doc,'div','pokemon-production-metrics');
    [[`${view.perCollection.toFixed(1)} 个`,`每次建议收菜`],[`${(view.ingredientProbability*100).toFixed(1)}%`,'当前食材概率'],[formatHours(view.collectionHours,teamPlanner),'建议收菜间隔'],[formatHours(view.fullHours,teamPlanner),'预计满仓']].forEach(([value,label])=>{const item=element(doc,'div','');item.append(element(doc,'strong','',value),element(doc,'span','',label));metrics.append(item)});card.append(metrics);
    const slots=element(doc,'p','pokemon-production-slots');
    const unlocked=view.unlockedSlots.length?view.unlockedSlots.map(item=>`Lv.${item.unlockLevel}×${item.quantity}`).join('、'):'当前等级没有已解锁栏位';
    const locked=view.lockedSlots.length?`；待解锁 ${view.lockedSlots.map(item=>`Lv.${item.unlockLevel}×${item.quantity}`).join('、')}`:'';
    slots.textContent=`目标食材栏：${unlocked}${locked}`;card.append(slots);
    if(view.rateProvisional)card.append(element(doc,'small','pokemon-production-note','该物种缺少已验证食材概率，当前使用暂定值。'));
    return card;
  }

  function readSelection(root){
    try{const value=JSON.parse(root.localStorage.getItem(STORAGE_KEY)||'{}');return {left:String(value.left||''),right:String(value.right||''),ingredient:String(value.ingredient||''),energyProfile:String(value.energyProfile||'average'),teammateHelpingBonusCount:Math.max(0,Math.min(4,Number(value.teammateHelpingBonusCount)||0)),goodCamp:value.goodCamp!==false}}catch(_error){return {left:'',right:'',ingredient:'',energyProfile:'average',teammateHelpingBonusCount:0,goodCamp:true}}
  }
  function writeSelection(root,value){try{root.localStorage.setItem(STORAGE_KEY,JSON.stringify(value))}catch(_error){}}
  function mount(options={}){
    const root=options.root||globalThis,doc=root.document,mons=Array.isArray(options.pokemon)?options.pokemon:[],strategy=options.strategy||root.POKEMON_SLEEP_STRATEGY,teamPlanner=options.teamPlanner||root.POKEMON_SLEEP_TEAM_PLANNER,production=options.production||root.POKEMON_SLEEP_TEAM_PRODUCTION;
    if(!doc)return {render(){},select(){},comparison(){return comparePokemon(null,null,{strategy})}};
    const panel=doc.querySelector(options.panelSelector||'#pokemonComparison'),leftSelect=doc.querySelector(options.leftSelector||'#pokemonCompareLeft'),rightSelect=doc.querySelector(options.rightSelector||'#pokemonCompareRight'),swapButton=doc.querySelector(options.swapSelector||'#pokemonCompareSwap'),matchButton=doc.querySelector(options.matchSelector||'#pokemonCompareMatch'),verdict=doc.querySelector(options.verdictSelector||'#pokemonComparisonVerdict'),grid=doc.querySelector(options.gridSelector||'#pokemonComparisonGrid');
    if(!panel||!leftSelect||!rightSelect||!verdict||!grid)return {render(){},select(){},comparison(){return comparePokemon(null,null,{strategy})}};
    const ingredientSelect=doc.querySelector(options.ingredientSelector||'#pokemonCompareIngredient'),energySelect=doc.querySelector(options.energySelector||'#pokemonCompareEnergy'),helpingBonusSelect=doc.querySelector(options.helpingBonusSelector||'#pokemonCompareHelpingBonus'),campInput=doc.querySelector(options.campSelector||'#pokemonCompareCamp'),productionResult=doc.querySelector(options.productionResultSelector||'#pokemonComparisonProductionResult');
    const saved=readSelection(root),defaults=chooseDefaults(mons,strategy);
    let leftId=mons.some(mon=>String(mon.id)===saved.left)?saved.left:String(defaults.left&&defaults.left.id||''),rightId=mons.some(mon=>String(mon.id)===saved.right&&String(mon.id)!==leftId)?saved.right:String(defaults.right&&defaults.right.id||'');
    let targetIngredient=saved.ingredient,energyProfile=teamPlanner&&teamPlanner.ENERGY_PROFILES&&teamPlanner.ENERGY_PROFILES[saved.energyProfile]?saved.energyProfile:'average',teammateHelpingBonusCount=saved.teammateHelpingBonusCount,goodCamp=saved.goodCamp;
    const byId=id=>mons.find(mon=>String(mon.id)===String(id))||null;
    function optionLabel(mon){const view=viewModel(mon,{strategy});return `#${view.id} ${view.name} · Lv.${view.level} · ${view.specialtyLabel} · 个体 ${formatScore(view.individualScore)}`}
    function renderOptions(){
      const sorted=[...mons].sort((a,b)=>numberId(a.id)-numberId(b.id));
      [leftSelect,rightSelect].forEach((select,index)=>{const selected=index===0?leftId:rightId;select.replaceChildren();sorted.forEach(mon=>{const item=element(doc,'option','',optionLabel(mon));item.value=String(mon.id);select.append(item)});select.value=selected});
    }
    function currentComparison(){return comparePokemon(byId(leftId),byId(rightId),{strategy})}
    function availableIngredients(){
      const left=ingredientNames(byId(leftId),teamPlanner),right=ingredientNames(byId(rightId),teamPlanner),rightSet=new Set(right),common=left.filter(name=>rightSet.has(name));
      return {common,all:[...common,...left.filter(name=>!rightSet.has(name)),...right.filter(name=>!left.includes(name))]};
    }
    function currentProductionComparison(){return compareProduction(byId(leftId),byId(rightId),targetIngredient,{teamPlanner,production,goodCamp,energyProfile,teammateHelpingBonusCount})}
    function persist(){writeSelection(root,{left:leftId,right:rightId,ingredient:targetIngredient,energyProfile,teammateHelpingBonusCount,goodCamp})}
    function renderProduction(){
      if(!ingredientSelect||!productionResult)return;
      const available=availableIngredients();
      if(!available.all.includes(targetIngredient))targetIngredient=available.common[0]||available.all[0]||'';
      ingredientSelect.replaceChildren();available.all.forEach(name=>{const item=element(doc,'option','',`${name}${available.common.includes(name)?'（两只都有）':''}`);item.value=name;ingredientSelect.append(item)});ingredientSelect.value=targetIngredient;
      if(energySelect)energySelect.value=energyProfile;if(helpingBonusSelect)helpingBonusSelect.value=String(teammateHelpingBonusCount);if(campInput)campInput.checked=goodCamp;
      const result=currentProductionComparison();productionResult.className=`pokemon-production-result ${result.leader}`;productionResult.replaceChildren();
      const verdictBox=element(doc,'div','pokemon-production-verdict');verdictBox.append(element(doc,'span','',`${targetIngredient||'目标食材'} · 同条件对比`),element(doc,'h5','',result.title),element(doc,'p','',result.detail));productionResult.append(verdictBox);
      const cards=element(doc,'div','pokemon-production-grid');if(result.left)cards.append(renderProductionCard(doc,result.left,'left',result.leader==='left',teamPlanner));if(result.right)cards.append(renderProductionCard(doc,result.right,'right',result.leader==='right',teamPlanner));productionResult.append(cards);
      productionResult.append(element(doc,'p','pokemon-production-disclosure','24小时按各自建议频率收菜的常规帮忙期望；食材概率为研究估算。主技能带来的额外食材未计入。'));
    }
    function render(){
      if(!mons.length){panel.hidden=false;verdict.className='pokemon-comparison-verdict empty';verdict.replaceChildren(element(doc,'strong','','盒子里还没有可比较的个体'),element(doc,'p','','先录入至少两只宝可梦，再回来进行并排比较。'));grid.replaceChildren();return}
      if(!byId(leftId))leftId=String(mons[0].id);
      if(!byId(rightId)||rightId===leftId)rightId=String(mons.find(mon=>String(mon.id)!==leftId)?.id||'');
      renderOptions();renderProduction();persist();
      const result=currentComparison();verdict.className=`pokemon-comparison-verdict ${result.leader}`;verdict.replaceChildren();
      const verdictCopy=element(doc,'div','pokemon-comparison-verdict-copy');verdictCopy.append(element(doc,'span','',result.sameFinalForm?'同最终形态对比':'跨物种资料对照'),element(doc,'h4','',result.title),element(doc,'p','',result.detail));
      const warningList=element(doc,'ul','pokemon-comparison-warnings');result.warnings.forEach(warning=>warningList.append(element(doc,'li','',warning)));verdict.append(verdictCopy,warningList);
      grid.replaceChildren();if(result.left)grid.append(renderCard(doc,result.left,'left',result.leader==='left'));if(result.right)grid.append(renderCard(doc,result.right,'right',result.leader==='right'));
    }
    function select(side,id){
      const value=String(id||'');if(!byId(value))return false;
      if(side==='left'){leftId=value;if(rightId===value){const alternate=mons.find(mon=>String(mon.id)!==value);rightId=String(alternate&&alternate.id||'')}}
      else{rightId=value;if(leftId===value){const alternate=mons.find(mon=>String(mon.id)!==value);leftId=String(alternate&&alternate.id||'')}}
      render();return true;
    }
    leftSelect.addEventListener('change',()=>select('left',leftSelect.value));rightSelect.addEventListener('change',()=>select('right',rightSelect.value));
    if(ingredientSelect)ingredientSelect.addEventListener('change',()=>{targetIngredient=ingredientSelect.value;render()});
    if(energySelect)energySelect.addEventListener('change',()=>{energyProfile=teamPlanner&&teamPlanner.ENERGY_PROFILES&&teamPlanner.ENERGY_PROFILES[energySelect.value]?energySelect.value:'average';render()});
    if(helpingBonusSelect)helpingBonusSelect.addEventListener('change',()=>{teammateHelpingBonusCount=Math.max(0,Math.min(4,Number(helpingBonusSelect.value)||0));render()});
    if(campInput)campInput.addEventListener('change',()=>{goodCamp=campInput.checked;render()});
    if(swapButton)swapButton.addEventListener('click',()=>{const previous=leftId;leftId=rightId;rightId=previous;render()});
    if(matchButton)matchButton.addEventListener('click',()=>{const left=byId(leftId),matches=mons.filter(mon=>String(mon.id)!==leftId&&finalFormId(mon)===finalFormId(left)).sort((a,b)=>comparePriority(a,b,strategy));if(matches.length){rightId=String(matches[0].id);render();matchButton.dataset.state='matched';matchButton.textContent='已选择同最终形态'}else{matchButton.dataset.state='missing';matchButton.textContent='盒内没有同最终形态';setTimeout(()=>{matchButton.removeAttribute('data-state');matchButton.textContent='找同最终形态'},1600)}});
    render();return {render,select,comparison:currentComparison,productionComparison:currentProductionComparison};
  }

  return Object.freeze({STORAGE_KEY,SLOT_LEVELS,STATUS_RANK,finalFormId,subskillRows,ingredientNames,productionView,compareProduction,viewModel,comparePokemon,chooseDefaults,mount});
});
