(function(root,factory){
  'use strict';
  const catalog=typeof module==='object'&&module.exports
    ?require('./pokemon-catalog.generated.js')
    :root.POKEMON_SLEEP_CATALOG;
  const strategy=typeof module==='object'&&module.exports?require('./pokemon-strategy.js'):root.POKEMON_SLEEP_STRATEGY;
  const speciesTiers=typeof module==='object'&&module.exports?require('./skills/pokemon-sleep-scoring/scripts/species-tiers.js'):root.POKEMON_SLEEP_SPECIES_TIERS;
  const api=factory(catalog,strategy,speciesTiers);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_CULTIVATION_ADVISOR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(catalog,strategy,speciesTiers){
  'use strict';

  const ACCOUNT_STAGES=Object.freeze({
    starter:Object.freeze({id:'starter',label:'新手起步',coreIndividual:40,stageIndividual:20,aCoreIndividual:60,aStageIndividual:30,description:'先建立能稳定工作的树果、食材与回复骨架，允许实用过渡。'}),
    forming:Object.freeze({id:'forming',label:'队伍成型',coreIndividual:48,stageIndividual:30,aCoreIndividual:68,aStageIndividual:40,description:'围绕稳定料理和固定岛屿队继续补强，开始减少过渡投资。'}),
    mature:Object.freeze({id:'mature',label:'成熟补强',coreIndividual:55,stageIndividual:38,aCoreIndividual:75,aStageIndividual:50,description:'已有成熟料理与队伍，优先长期上限、稀缺覆盖和明确的队伍增益。'})
  });
  const TIERS=Object.freeze({
    core:Object.freeze({id:'core',label:'核心培养',tone:'core',sort:60,nextAction:'可以投入长期糖果与稀缺种子。'}),
    stage:Object.freeze({id:'stage',label:'阶段性培养',tone:'stage',sort:50,nextAction:'先培养到关键等级，再根据替代品决定是否重投入。'}),
    transition:Object.freeze({id:'transition',label:'过渡使用',tone:'transition',sort:40,nextAction:'可以继续上场，但暂缓稀缺资源并继续筛选。'}),
    niche:Object.freeze({id:'niche',label:'限定用途',tone:'niche',sort:30,nextAction:'只在满足注明的岛屿、队友或技能条件时编入。'}),
    avoid:Object.freeze({id:'avoid',label:'暂不建议',tone:'avoid',sort:20,nextAction:'不建议继续投入；去留仍按同最终形态席位单独判断。'}),
    manual:Object.freeze({id:'manual',label:'人工判断',tone:'manual',sort:0,nextAction:'资料补齐后再自动判断。'})
  });

  // These are cultivation-layer judgments, not changes to species output scores.
  const DIRECT_SUPERIORS=Object.freeze({
    '9007':Object.freeze({superiorId:'26',superiorName:'雷丘',matureTier:'niche',formingTier:'niche',starterTier:'transition',reason:'常规电系树果产出已有雷丘这一直接上位。',exception:'雷公队需要不同种类电系成员时，可作为队伍拼图。',evidence:'攻略作者经验判断，并由当前 Game8 定性复核'}),
    '36':Object.freeze({superiorId:'959',superiorName:'巨锻匠',matureTier:'transition',formingTier:'stage',starterTier:'stage',reason:'同为妖精树果位时，巨锻匠的长期种族基准更高。',exception:'尚未获得巨锻匠，或皮可西已经高练度时，仍可继续承担妖精树果位。',evidence:'攻略作者经验判断与当前物种产出模型'}),
    '389':Object.freeze({superiorId:'282',superiorName:'沙奈朵',matureTier:'transition',formingTier:'stage',starterTier:'stage',reason:'攻略将土台龟定位为前期过渡回复手；成熟回复位仍以沙奈朵为长期目标。',exception:'尚未获得可用沙奈朵时，土台龟可以继续承担过渡回复。',evidence:'2026-08-17攻略图与本站回复队模型'}),
    '923':Object.freeze({superiorId:'282',superiorName:'沙奈朵',matureTier:'transition',formingTier:'stage',starterTier:'stage',reason:'攻略将巴布土拨定位为前期过渡回复手；成熟回复位仍以沙奈朵为长期目标。',exception:'尚未获得可用沙奈朵时，巴布土拨可以继续承担过渡回复。',evidence:'2026-08-17攻略图与本站回复队模型'}),
    '40':Object.freeze({superiorId:'282',superiorName:'沙奈朵',matureTier:'transition',formingTier:'transition',starterTier:'stage',reason:'成熟回复位以稳定全队回复的沙奈朵为长期目标。',exception:'尚未获得可用沙奈朵时，胖可丁可以作为过渡回复手。',evidence:'攻略作者的账号阶段建议与本站回复队模型'}),
    '700':Object.freeze({superiorId:'282',superiorName:'沙奈朵',matureTier:'transition',formingTier:'transition',starterTier:'stage',reason:'成熟回复位以稳定全队回复的沙奈朵为长期目标。',exception:'尚未获得可用沙奈朵时，仙子伊布可以作为过渡回复手。',evidence:'攻略作者的账号阶段建议与本站回复队模型'})
  });

  const byId=new Map((catalog&&catalog.pokemon||[]).map(record=>[String(record.id),record]));
  const finite=value=>value!==null&&value!==''&&value!==undefined&&Number.isFinite(Number(value));
  const number=value=>finite(value)?Number(value):null;
  const tier=id=>TIERS[id]||TIERS.manual;
  const stageProfile=id=>ACCOUNT_STAGES[id]||ACCOUNT_STAGES.mature;

  function courseTierCap(minimum){
    if(!minimum||minimum.status==='manual'||minimum.meetsGraduation)return null;
    if(['keep','compromise'].includes(minimum.status))return 'stage';
    return 'transition';
  }

  function capTierByCourse(tierId,minimum){
    const capId=courseTierCap(minimum);
    return capId&&tier(tierId).sort>tier(capId).sort?capId:tierId;
  }

  function scoreFor(mon,override){
    return override||mon&&mon.scoreBreakdown||null;
  }

  function finalFormId(mon,score){
    if(score&&score.finalFormId)return String(score.finalFormId);
    if(mon&&mon.finalFormId)return String(mon.finalFormId);
    if(mon&&mon.speciesId){
      const record=byId.get(String(mon.speciesId));
      if(record)return String(record.defaultFinalId||record.id);
    }
    const target=catalog&&catalog.existingNameTargets&&catalog.existingNameTargets[mon&&mon.name];
    return target?String(target.id):'';
  }

  function scoredMembers(box){
    return (Array.isArray(box)?box:[]).map(mon=>({mon,score:scoreFor(mon)}));
  }

  function superiorInBox(rule,box){
    return scoredMembers(box).filter(row=>row.mon&&finalFormId(row.mon,row.score)===rule.superiorId&&finite(row.score&&row.score.finalScore)).sort((left,right)=>Number(right.score.finalScore)-Number(left.score.finalScore))[0]||null;
  }

  function baseTier(profile,speciesTier,individualScore){
    if(speciesTier==='S'){
      if(individualScore>=profile.coreIndividual)return 'core';
      if(individualScore>=profile.stageIndividual)return 'stage';
      return individualScore>=15?'transition':'avoid';
    }
    if(speciesTier==='A'){
      if(individualScore>=profile.aCoreIndividual)return 'core';
      if(individualScore>=profile.aStageIndividual)return 'stage';
      return individualScore>=20?'transition':'avoid';
    }
    if(speciesTier==='B')return individualScore>=20?'transition':'avoid';
    return 'avoid';
  }

  function result(tierId,fields={}){
    const definition=tier(tierId);
    return {
      tier:tierId,
      label:definition.label,
      tone:definition.tone,
      sort:definition.sort,
      nextAction:fields.nextAction||definition.nextAction,
      reason:fields.reason||'',
      details:Array.isArray(fields.details)?fields.details:[],
      directSuperior:fields.directSuperior||null,
      exception:fields.exception||'',
      evidence:fields.evidence||'本站透明阈值建议层',
      accountStage:fields.accountStage||ACCOUNT_STAGES.mature,
      teamModel:fields.teamModel||null
    };
  }

  function assess(mon,box,options={}){
    const profile=stageProfile(options.accountStage),score=scoreFor(mon,options.score),finalId=finalFormId(mon,score);
    if(!score||!finite(score.individualScore)||!score.speciesTier)return result('manual',{accountStage:profile,reason:'梯级或个体质量尚未完成，不能用缺失数据自动判断。'});

    const speciesTier=String(score.speciesTier),individualScore=Number(score.individualScore),level=Math.max(1,Number(mon&&mon.lv||mon&&mon.level||1)),pattern=score.individual&&score.individual.ingredientPattern,islandRoles=strategy&&strategy.islandRolesForSpecies?strategy.islandRolesForSpecies(finalId):[],islandRole=islandRoles[0]||null,strategicProfile=score.strategy||strategy&&strategy.SPECIES_ROLES&&strategy.SPECIES_ROLES[finalId]||null,minimum=strategy&&strategy.minimumStandard?strategy.minimumStandard(mon,{finalId,specialty:score.specialty,strategicProfile}):null;
    const details=[`物种梯级 ${speciesTier}；个体质量 ${individualScore.toFixed(1)}；按“${profile.label}”投入线判断。`];
    if(strategicProfile)details.push(`战略岗位：${strategicProfile.role}；岗位说明用于解释用途，不会修改梯级。`);
    if(islandRole)details.push(`岛屿定位：${islandRoles.map(item=>`${item.island}·${item.note}`).join('；')}；用途证据不替代个体毕业线。`);
    if(minimum){
      details.push(`课程严选线：${minimum.label}${minimum.missing.length?`；仍缺 ${minimum.missing.join('、')}`:''}。`);
      if(minimum.routePattern&&minimum.routePattern!=='不适用')details.push(`课程路线判定：${minimum.routePattern}（${minimum.routeStatus}）。`);
      if(minimum.courseNote)details.push(`课程提醒：${minimum.courseNote}`);
      if(minimum.investmentLimit)details.push(`投入边界：${minimum.investmentLimit}。`);
    }
    let tierId=baseTier(profile,speciesTier,individualScore),reason='';
    if(speciesTier==='C')reason='该最终形态未列入当前严选梯级，按约定默认 C 级，不建议为其实战强度继续投入；收藏、闪光、限定和已有投入另行判断。';
    else if(speciesTier==='B')reason=tierId==='transition'?'B级定位为堪堪可用，只建议按现有缺口过渡，不投入稀缺资源。':'B级且当前个体质量偏低，暂不建议投入。';
    else if(tierId==='core')reason=`${speciesTier}级物种且个体质量达到“${profile.label}”长期投入线。`;
    else if(tierId==='stage')reason=`${speciesTier}级物种可用，但个体质量尚未达到当前账号阶段的核心投入线。`;
    else if(tierId==='transition')reason=`${speciesTier}级物种仍有培养价值，但这个体当前只适合作为过渡。`;
    else reason=`${speciesTier}级物种的当前个体质量过低，建议继续严选。`;

    if(score.specialty==='ingredient'&&pattern&&pattern!=='不适用'){
      details.push(`食材路线 ${pattern}；组合系数 ${Number(score.individual.ingredientPatternCoefficient).toFixed(2)}。`);
      if(minimum&&['lv30-worker','review-abb','unverified'].includes(minimum.routeStatus)&&['core','stage'].includes(tierId)){
        tierId='transition';reason=minimum.routeStatus==='lv30-worker'?'AAB／AAC只作为Lv.30食材工使用；不应为个体百分分继续解锁错误的Lv.60路线。':'当前食材路线尚未获得课程认可的长期毕业资格，只能先作过渡。';
      }
    }
    const uncappedTier=tierId;
    tierId=capTierByCourse(tierId,minimum);
    if(tierId!==uncappedTier){
      details.push(`课程资格把培养上限从“${tier(uncappedTier).label}”限制为“${tier(tierId).label}”。`);
      reason=`梯级与个体质量达到“${tier(uncappedTier).label}”区间，但课程的词条、路线或关键等级条件未毕业，因此暂不允许长期核心投入。`;
    }
    if(mon&&mon.shiny==='是')details.push('闪光默认保留；这里的培养结论不等于收藏去留结论。');
    const evidence=[`用户梯级表（${speciesTiers&&speciesTiers.SOURCE||'当前版本'}）`,minimum&&strategy&&strategy.SELECTION_SOURCE&&strategy.SELECTION_SOURCE.label,(strategicProfile||islandRole)&&strategy&&strategy.SOURCE&&strategy.SOURCE.label,'个体面板质量与账号阶段投入线'].filter(Boolean).join('；');
    return result(tierId,{accountStage:profile,reason,details,evidence,teamModel:null});
  }

  function explanation(value){
    const lines=[`${value.label}｜${value.accountStage.label}`,value.reason,...value.details];
    if(value.directSuperior)lines.push(`直接上位：${value.directSuperior.name}${value.directSuperior.present?'（盒内已有）':'（盒内未检出）'}`);
    if(value.exception)lines.push(`例外用途：${value.exception}`);
    lines.push(`建议动作：${value.nextAction}`,`依据：${value.evidence}`,'培养判断、收藏状态与实战资格彼此独立；这里不会修改物种梯级或个体质量，也不会自动放生。');
    return lines.filter(Boolean).join('\n');
  }

  return Object.freeze({ACCOUNT_STAGES,TIERS,DIRECT_SUPERIORS,stageProfile,finalFormId,courseTierCap,capTierByCourse,assess,explanation});
});
