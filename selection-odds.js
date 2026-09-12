(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_SELECTION_ODDS=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SUBSKILLS=Object.freeze([
    Object.freeze({name:'树果数量S',rarity:'gold',weight:.02}),
    Object.freeze({name:'帮手奖励',rarity:'gold',weight:.02}),
    Object.freeze({name:'睡眠EXP奖励',rarity:'gold',weight:.02}),
    Object.freeze({name:'活力恢复奖励',rarity:'gold',weight:.02}),
    Object.freeze({name:'梦之碎片奖励',rarity:'gold',weight:.02}),
    Object.freeze({name:'研究EXP奖励',rarity:'gold',weight:.02}),
    Object.freeze({name:'技能等级M',rarity:'gold',weight:.02}),
    Object.freeze({name:'帮忙速度M',rarity:'blue',weight:.06}),
    Object.freeze({name:'食材概率M',rarity:'blue',weight:.06}),
    Object.freeze({name:'技能概率M',rarity:'blue',weight:.06}),
    Object.freeze({name:'技能等级S',rarity:'blue',weight:.06}),
    Object.freeze({name:'持有上限M',rarity:'blue',weight:.06}),
    Object.freeze({name:'持有上限L',rarity:'blue',weight:.06}),
    Object.freeze({name:'帮忙速度S',rarity:'white',weight:.125}),
    Object.freeze({name:'食材概率S',rarity:'white',weight:.125}),
    Object.freeze({name:'技能概率S',rarity:'white',weight:.125}),
    Object.freeze({name:'持有上限S',rarity:'white',weight:.125})
  ]);
  const MEDAL_GROUPS=Object.freeze([
    Object.freeze({points:Object.freeze([5,7]),thresholds:Object.freeze([10,40,100])}),
    Object.freeze({points:Object.freeze([10,12]),thresholds:Object.freeze([10,30,60])}),
    Object.freeze({points:Object.freeze([15,16]),thresholds:Object.freeze([10,25,50])}),
    Object.freeze({points:Object.freeze([18,20,22,25,30]),thresholds:Object.freeze([10,20,40])})
  ]);
  const MEDAL_LABELS=Object.freeze(['尚无徽章','铜徽章','银徽章','金徽章']);
  const ROLE_CONFIG=Object.freeze({
    berry:Object.freeze({label:'树果位',natureCount:4,description:'Lv.50内树果数量S＋帮手奖励＋个人速度'}),
    berrySkill:Object.freeze({label:'树果位技能手',natureCount:4,description:'按树果位：树果数量S＋帮手奖励＋个人速度'}),
    ingredient:Object.freeze({label:'食材手',natureCount:7,description:'Lv.50内食材概率M＋任意两个额外有效增益'}),
    healer:Object.freeze({label:'正式群回奶妈',natureCount:7,description:'Lv.50内技能概率M＋帮手奖励＋一个个人增益'}),
    skill:Object.freeze({label:'普通技能手',natureCount:7,description:'Lv.50内技能概率M＋任意两个额外有效增益'}),
    tool:Object.freeze({label:'短驻场工具技能手',natureCount:7,description:'Lv.50内技能概率M＋任意两个额外有效增益'})
  });
  const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
  const unique=value=>[...new Set((Array.isArray(value)?value:[]).map(String).filter(Boolean))];

  function medalStatus(friendshipPoints,friendshipLevel){
    const points=Number(friendshipPoints),level=Math.max(1,Math.floor(Number(friendshipLevel)||1));
    const group=MEDAL_GROUPS.find(item=>item.points.includes(points))||MEDAL_GROUPS[0];
    const thresholds=group.thresholds;
    const rank=level>=thresholds[2]?3:level>=thresholds[1]?2:level>=thresholds[0]?1:0;
    const nextRank=rank<3?rank+1:null;
    return {
      points,level,rank,label:MEDAL_LABELS[rank],maxLockedGold:rank,
      toggleable:rank>=2,thresholds:[...thresholds],
      next:nextRank?{rank:nextRank,label:MEDAL_LABELS[nextRank],level:thresholds[nextRank-1]}:null
    };
  }

  function enumerateSequences(slotCount,lockedGold,visit){
    const slots=clamp(Math.floor(Number(slotCount)||3),1,5),locks=clamp(Math.floor(Number(lockedGold)||0),0,Math.min(3,slots));
    function walk(index,pool,chosen,probability){
      if(index===slots){visit(chosen,probability);return}
      const candidates=index<locks?pool.filter(skill=>skill.rarity==='gold'):pool;
      const total=candidates.reduce((sum,skill)=>sum+skill.weight,0);
      if(!(total>0))return;
      candidates.forEach(skill=>walk(index+1,pool.filter(item=>item.name!==skill.name),[...chosen,skill.name],probability*skill.weight/total));
    }
    walk(0,[...SUBSKILLS],[],1);
  }

  function probabilityOfTargets(targets,{slotCount=3,lockedGold=0,mode='all'}={}){
    const wanted=unique(targets),matchMode=mode==='any'?'any':'all';
    if(!wanted.length)return {probability:0,expectedCatches:null,targets:wanted,slotCount,lockedGold,mode:matchMode};
    let probability=0;
    enumerateSequences(slotCount,lockedGold,(skills,chance)=>{
      const matched=matchMode==='any'?wanted.some(skill=>skills.includes(skill)):wanted.every(skill=>skills.includes(skill));
      if(matched)probability+=chance;
    });
    return {probability,expectedCatches:probability>0?1/probability:null,targets:wanted,slotCount,lockedGold,mode:matchMode};
  }

  function passesGraduation(role,skills,favorableNature){
    const has=skill=>skills.includes(skill);
    if(role==='berry'||role==='berrySkill')return has('树果数量S')&&has('帮手奖励')&&(has('帮忙速度M')||has('帮忙速度S')||favorableNature);
    if(role==='ingredient'){
      if(!has('食材概率M'))return false;
      const gains=[has('帮手奖励'),has('帮忙速度M'),has('食材概率S'),favorableNature].filter(Boolean).length;
      return gains>=2;
    }
    if(role==='healer')return has('技能概率M')&&has('帮手奖励')&&(has('帮忙速度M')||has('技能概率S')||favorableNature);
    if(role==='skill'||role==='tool'){
      if(!has('技能概率M'))return false;
      const gains=[has('帮手奖励'),has('帮忙速度M'),has('技能概率S'),favorableNature].filter(Boolean).length;
      return gains>=2;
    }
    return false;
  }

  function graduationProbability(role,{lockedGold=0,ingredientRoute='panel'}={}){
    const config=ROLE_CONFIG[role]||null;
    if(!config)return {probability:0,panelProbability:0,expectedCatches:null,role,unsupported:true};
    let favorablePanel=0,ordinaryPanel=0;
    enumerateSequences(3,lockedGold,(skills,chance)=>{
      if(passesGraduation(role,skills,true))favorablePanel+=chance;
      if(passesGraduation(role,skills,false))ordinaryPanel+=chance;
    });
    const natureProbability=config.natureCount/25;
    const panelProbability=favorablePanel*natureProbability+ordinaryPanel*(1-natureProbability);
    const routeProbability=role!=='ingredient'||ingredientRoute==='panel'?1:ingredientRoute==='aaa-or-verified-abb'?3/9:1/9;
    const probability=panelProbability*routeProbability;
    return {
      role,label:config.label,description:config.description,lockedGold:Number(lockedGold)||0,
      natureProbability,panelProbability,routeProbability,probability,
      expectedCatches:probability>0?1/probability:null,ingredientRoute,unsupported:false
    };
  }

  function formatPercent(probability){
    const percent=Math.max(0,Number(probability)||0)*100;
    const digits=percent>=1?2:percent>=.01?3:percent>0?5:2;
    return `${percent.toFixed(digits)}%`;
  }
  function formatExpected(value){
    if(!Number.isFinite(value))return '当前条件不可达';
    return `平均约需 ${value>=100?Math.round(value).toLocaleString('zh-CN'):value.toFixed(1)} 只`;
  }
  function option(value,label=value){const node=document.createElement('option');node.value=String(value);node.textContent=label;return node}

  function mount(){
    const root=document.querySelector('#selectionOddsTool');
    if(!root)return null;
    const friendshipPoints=root.querySelector('#selectionFriendshipPoints'),friendshipLevel=root.querySelector('#selectionFriendshipLevel'),medalResult=root.querySelector('#selectionMedalResult'),lockedGold=root.querySelector('#selectionLockedGold');
    const targetSelects=[...root.querySelectorAll('[data-selection-target]')],targetMode=root.querySelector('#selectionTargetMode'),targetSlots=root.querySelector('#selectionTargetSlots'),targetResult=root.querySelector('#selectionTargetResult');
    const role=root.querySelector('#selectionGraduationRole'),route=root.querySelector('#selectionIngredientRoute'),routeField=root.querySelector('#selectionIngredientRouteField'),graduationResult=root.querySelector('#selectionGraduationResult');
    const rarityLabels={gold:'金色',blue:'蓝色',white:'白色'};
    targetSelects.forEach((select,index)=>{
      if(index>0)select.append(option('','不指定'));
      ['gold','blue','white'].forEach(rarity=>{
        const group=document.createElement('optgroup');group.label=rarityLabels[rarity];
        SUBSKILLS.filter(skill=>skill.rarity===rarity).forEach(skill=>group.append(option(skill.name)));
        select.append(group);
      });
    });
    targetSelects[0].value='树果数量S';targetSelects[1].value='帮手奖励';
    let previousMaximumLock=null;

    function updateLockOptions(){
      const status=medalStatus(friendshipPoints.value,friendshipLevel.value),previous=Number(lockedGold.value);
      const allowed=status.toggleable?Array.from({length:status.maxLockedGold+1},(_item,index)=>index):[status.maxLockedGold];
      lockedGold.replaceChildren(...allowed.map(count=>option(count,`${count} 格${count?`（${MEDAL_LABELS[count]}效果）`:''}`)));
      const keptValue=previousMaximumLock===null||previous===previousMaximumLock?status.maxLockedGold:previous;
      lockedGold.value=String(allowed.includes(keptValue)?keptValue:status.maxLockedGold);
      previousMaximumLock=status.maxLockedGold;
      medalResult.innerHTML=`<strong>${status.label} · 最多锁 ${status.maxLockedGold} 格金色</strong><span>${status.next?`下一档：${status.next.label}（友情等级 ${status.next.level}）`:'已达到当前最高金徽章'}${status.toggleable?'；银徽章起可按种类关闭锁金效果':'；当前效果不能单独关闭'}</span>`;
      renderProbabilities();
    }
    function renderProbabilities(){
      const targets=targetSelects.map(select=>select.value).filter(Boolean),locks=Number(lockedGold.value)||0;
      const target=probabilityOfTargets(targets,{slotCount:Number(targetSlots.value),lockedGold:locks,mode:targetMode.value});
      targetResult.innerHTML=`<strong>${formatPercent(target.probability)}</strong><span>${formatExpected(target.expectedCatches)} · ${target.mode==='all'?'全部目标同时出现':'任一目标出现'}</span>`;
      routeField.hidden=role.value!=='ingredient';
      const graduation=graduationProbability(role.value,{lockedGold:locks,ingredientRoute:route.value});
      const routeNote=role.value==='ingredient'&&graduation.routeProbability<1?`，已乘食材路线概率 ${formatPercent(graduation.routeProbability)}`:'';
      graduationResult.innerHTML=`<strong>${formatPercent(graduation.probability)}</strong><span>${formatExpected(graduation.expectedCatches)} · ${graduation.description}${routeNote}</span>`;
    }
    friendshipPoints.addEventListener('change',updateLockOptions);friendshipLevel.addEventListener('input',updateLockOptions);
    [lockedGold,targetMode,targetSlots,...targetSelects,role,route].forEach(control=>control.addEventListener('change',renderProbabilities));
    updateLockOptions();
    return {render:renderProbabilities};
  }

  return Object.freeze({SUBSKILLS,MEDAL_GROUPS,ROLE_CONFIG,medalStatus,probabilityOfTargets,graduationProbability,formatPercent,mount});
});
