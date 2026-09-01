(function(root,factory){
  'use strict';
  const catalog=typeof module==='object'&&module.exports
    ?require('./pokemon-catalog.generated.js')
    :root.POKEMON_SLEEP_CATALOG;
  const strategy=typeof module==='object'&&module.exports?require('./pokemon-strategy.js'):root.POKEMON_SLEEP_STRATEGY;
  const api=factory(catalog,strategy);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_CULTIVATION_ADVISOR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(catalog,strategy){
  'use strict';

  const ACCOUNT_STAGES=Object.freeze({
    starter:Object.freeze({id:'starter',label:'新手起步',coreSpecies:78,coreIndividual:40,stageSpecies:66,stageIndividual:20,transitionSpecies:55,description:'先建立能稳定工作的树果、食材与回复骨架，允许实用过渡。'}),
    forming:Object.freeze({id:'forming',label:'队伍成型',coreSpecies:82,coreIndividual:48,stageSpecies:72,stageIndividual:30,transitionSpecies:62,description:'围绕稳定料理和固定岛屿队继续补强，开始减少过渡投资。'}),
    mature:Object.freeze({id:'mature',label:'成熟补强',coreSpecies:85,coreIndividual:55,eliteCoreSpecies:80,eliteCoreIndividual:75,eliteCoreFinal:80,stageSpecies:76,stageIndividual:38,transitionSpecies:68,description:'已有成熟料理与队伍，优先长期上限、稀缺覆盖和明确的队伍增益。'})
  });
  const TIERS=Object.freeze({
    core:Object.freeze({id:'core',label:'核心培养',tone:'core',sort:60,nextAction:'可以投入长期糖果与稀缺种子。'}),
    stage:Object.freeze({id:'stage',label:'阶段性培养',tone:'stage',sort:50,nextAction:'先培养到关键等级，再根据替代品决定是否重投入。'}),
    transition:Object.freeze({id:'transition',label:'过渡使用',tone:'transition',sort:40,nextAction:'可以继续上场，但暂缓稀缺资源并继续筛选。'}),
    niche:Object.freeze({id:'niche',label:'限定用途',tone:'niche',sort:30,nextAction:'只在满足注明的岛屿、队友或技能条件时编入。'}),
    avoid:Object.freeze({id:'avoid',label:'暂不建议',tone:'avoid',sort:20,nextAction:'不建议继续投入；去留仍按同最终形态席位单独判断。'}),
    collection:Object.freeze({id:'collection',label:'收藏用途',tone:'collection',sort:10,nextAction:'保留收藏，但不进入自动实战与培养队列。'}),
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
    return scoredMembers(box).filter(row=>row.mon&&row.mon.battleEligible!==false&&finalFormId(row.mon,row.score)===rule.superiorId&&finite(row.score&&row.score.finalScore)).sort((left,right)=>Number(right.score.finalScore)-Number(left.score.finalScore))[0]||null;
  }

  function baseTier(profile,speciesScore,individualScore,finalScore,level){
    if(profile.eliteCoreSpecies!==undefined&&speciesScore>=profile.eliteCoreSpecies&&individualScore>=profile.eliteCoreIndividual&&finalScore>=profile.eliteCoreFinal){
      return 'core';
    }
    if(speciesScore>=profile.coreSpecies){
      if(individualScore>=profile.coreIndividual)return 'core';
      if(individualScore>=profile.stageIndividual)return 'stage';
      return level>=45?'transition':'avoid';
    }
    if(speciesScore>=profile.stageSpecies){
      if(individualScore>=profile.stageIndividual)return 'stage';
      return level>=45?'transition':profile.id==='starter'?'transition':'avoid';
    }
    if(speciesScore>=profile.transitionSpecies||individualScore>=profile.coreIndividual){
      return 'transition';
    }
    return level>=50?'transition':'avoid';
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
    if(mon&&mon.battleEligible===false)return result('collection',{accountStage:profile,reason:'这只已被标记为“仅收藏”，因此不参与实战培养排序。'});
    if(!score||!finite(score.speciesScore)||!finite(score.individualScore))return result('manual',{accountStage:profile,reason:'种族分或个体分尚未完成，不能用缺失数据自动判断。'});

    const speciesScore=Number(score.speciesScore),individualScore=Number(score.individualScore),level=Math.max(1,Number(mon&&mon.lv||mon&&mon.level||1)),pattern=score.individual&&score.individual.ingredientPattern,teamModel=score.teamModel||catalog&&catalog.speciesScores&&catalog.speciesScores[finalId]&&catalog.speciesScores[finalId].teamModel||null,islandRoles=strategy&&strategy.islandRolesForSpecies?strategy.islandRolesForSpecies(finalId):[],islandRole=islandRoles[0]||null,strategicProfile=score.strategy||strategy&&strategy.SPECIES_ROLES&&strategy.SPECIES_ROLES[finalId]||null,minimum=strategy&&strategy.minimumStandard?strategy.minimumStandard(mon,{finalId,specialty:score.specialty,strategicProfile}):null;
    const details=[`种族分 ${speciesScore.toFixed(1)}；个体分 ${individualScore.toFixed(1)}；按“${profile.label}”阈值判断。`];
    if(Number(score.strategicBonus)>0)details.push(`战略岗位补正：机械种族分 ${Number(score.mechanicalSpeciesScore).toFixed(1)} ＋ ${Number(score.strategicBonus).toFixed(1)}；岗位为“${strategicProfile.role}”。`);
    else if(strategicProfile)details.push(`战略岗位：${strategicProfile.role}；机械种族分已足够，因此未追加补正。`);
    if(islandRole)details.push(`岛屿定位：${islandRoles.map(item=>`${item.island}·${item.note}`).join('；')}；用途证据不替代个体毕业线。`);
    if(minimum)details.push(`攻略入盒线：${minimum.label}${minimum.missing.length?`；仍缺 ${minimum.missing.join('、')}`:''}。`);
    const direct=DIRECT_SUPERIORS[finalId];
    if(direct){
      const present=superiorInBox(direct,box),tierId=profile.id==='starter'?direct.starterTier:profile.id==='forming'?direct.formingTier:direct.matureTier;
      details.push(present?`盒内已有 ${direct.superiorName}（综合分 ${Number(present.score.finalScore).toFixed(1)}）。`:`盒内尚未检出可评分的 ${direct.superiorName}，可先保留过渡。`);
      return result(tierId,{accountStage:profile,reason:direct.reason,details,directSuperior:{id:direct.superiorId,name:direct.superiorName,present:Boolean(present),boxId:present&&String(present.mon.id)},exception:direct.exception,evidence:direct.evidence,teamModel});
    }

    if(teamModel&&['special-fixed-team','latios-latias-shapley-attribution'].includes(teamModel.sourceType)){
      const condition=teamModel.sourceType==='special-fixed-team'?'属性联动和指定同属性队伍':'拉帝亚斯与拉帝欧斯的双龙组合';
      details.push(`标准替换队收益系数 ${Number(teamModel.yieldCoefficient).toFixed(4)}；条件：${teamModel.candidateTeam}。`);
      return result('niche',{accountStage:profile,reason:`理论收益依赖${condition}，不能当作任意队伍的通用位置。`,details,exception:'满足标准队条件时仍可获得很高的实际价值。',evidence:'本站四小时标准队替换模型',teamModel});
    }

    if(teamModel&&teamModel.role==='额外技能位'){
      const coefficient=number(teamModel.yieldCoefficient),unstable=number(teamModel.stabilityScore)!==null&&Number(teamModel.stabilityScore)<50,operationHeavy=number(teamModel.operationScore)!==null&&Number(teamModel.operationScore)<55;
      if(coefficient!==null)details.push(`标准替换队收益系数 ${coefficient.toFixed(4)}（大于 1 才表示替换第四产能位后仍为正收益）。`);
      if(coefficient!==null&&coefficient<=1){
        const tierId=level>=45||profile.id==='starter'?'transition':'avoid';
        return result(tierId,{accountStage:profile,reason:'在当前标准队替换模型中没有覆盖被替换产能位的机会成本。',details,exception:'活动加成、特殊料理缺口或实际队友改变时应重新计算。',evidence:'本站四小时标准队替换模型',teamModel});
      }
      if(unstable||operationHeavy){
        details.push(`稳定性 ${Number(teamModel.stabilityScore).toFixed(1)}；操作友好度 ${Number(teamModel.operationScore).toFixed(1)}。`);
        return result('niche',{accountStage:profile,reason:'理论产出可用，但波动或收菜操作要求较高，不适合作为无条件固定位置。',details,exception:'能满足收菜频率或接受波动时可以使用。',evidence:'本站主技能稳定性与操作成本模型',teamModel});
      }
    }

    const finalScore=Number(score.finalScore),eliteCore=profile.eliteCoreSpecies!==undefined&&speciesScore<profile.coreSpecies&&speciesScore>=profile.eliteCoreSpecies&&individualScore>=profile.eliteCoreIndividual&&finalScore>=profile.eliteCoreFinal;
    let tierId=baseTier(profile,speciesScore,individualScore,finalScore,level),reason='';
    if(tierId==='core')reason=eliteCore?(islandRole?`该物种具备${islandRole.island}明确岗位，且这个个体与综合表现均达到毕业个体补偿线，可作为现有核心长期使用。`:'种族基础已属强势区间，且这个个体与综合表现均达到毕业个体补偿线，可作为现有核心长期使用。'):'种族基础与个体配置同时达到当前账号阶段的长期投入线。';
    else if(tierId==='stage')reason=speciesScore>=profile.coreSpecies?'种族上限很高，但这个个体尚未达到核心毕业线。':'种族与个体已达到可培养区间，但仍应保留升级空间。';
    else if(tierId==='transition')reason=level>=45?'已有练度能继续产生价值，但不建议因为沉没成本继续投入稀缺资源。':'当前可以补位，但长期上限或个体质量尚不足以进入核心培养。';
    else reason=speciesScore>=profile.coreSpecies?'物种很强，但这个个体离当前账号阶段的投入线较远，建议继续筛选。':'种族基础与个体质量均未达到当前账号阶段的投入线。';

    if(score.specialty==='ingredient'&&pattern&&pattern!=='不适用'){
      details.push(`食材路线 ${pattern}；组合系数 ${Number(score.individual.ingredientPatternCoefficient).toFixed(2)}。`);
      if(profile.id==='mature'&&tierId==='core'&&pattern!=='AAA'){
        tierId='stage';reason='整体配置优秀，但成熟账号的长期食材核心仍优先 AAA；先作为阶段性主力。';
      }else if(profile.id==='mature'&&pattern==='ABC'&&['core','stage'].includes(tierId)){
        tierId='transition';reason='ABC 只能覆盖分散食材，长期组合系数较低；更适合作为过渡或特定食谱补位。';
      }
    }
    if(strategicProfile&&minimum&&minimum.meetsMinimum&&['avoid','transition'].includes(tierId)){
      const strategicStage=strategicProfile.stage==='required'&&individualScore>=profile.stageIndividual&&pattern==='AAA';
      tierId=strategicStage?'stage':'transition';
      reason=strategicStage?`这个个体达到攻略入盒线，并能承担“${strategicProfile.role}”这一明确缺口，可作为阶段性岗位手培养。`:`物种有“${strategicProfile.role}”这一明确缺口价值，但当前个体只达到保留线，先作过渡并继续筛选。`;
    }
    if(mon&&mon.shiny==='是')details.push('闪光默认保留；这里的培养结论不等于收藏去留结论。');
    return result(tierId,{accountStage:profile,reason,details,evidence:strategicProfile||islandRole?`${strategy.SOURCE.label}；本站机械种族分、战略岗位补正、个体分与账号阶段阈值`:'本站种族分、个体分与账号阶段阈值',teamModel});
  }

  function explanation(value){
    const lines=[`${value.label}｜${value.accountStage.label}`,value.reason,...value.details];
    if(value.directSuperior)lines.push(`直接上位：${value.directSuperior.name}${value.directSuperior.present?'（盒内已有）':'（盒内未检出）'}`);
    if(value.exception)lines.push(`例外用途：${value.exception}`);
    lines.push(`建议动作：${value.nextAction}`,`依据：${value.evidence}`,'培养判断与种族分／个体分分开，不会反向修改综合评分，也不会自动放生。');
    return lines.filter(Boolean).join('\n');
  }

  return Object.freeze({ACCOUNT_STAGES,TIERS,DIRECT_SUPERIORS,stageProfile,finalFormId,assess,explanation});
});
