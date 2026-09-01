(function(root,factory){
  'use strict';
  const strategy=typeof module==='object'&&module.exports?require('./pokemon-strategy.js'):root.POKEMON_SLEEP_STRATEGY;
  const api=factory(strategy);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_RETENTION_ADVISOR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(strategy){
  'use strict';

  const SPECIAL_NAMES=new Set(['梦幻','雷公','炎帝','水君','拉帝亚斯','拉帝欧斯','克雷色利亚','达克莱伊','超梦']);
  const round=value=>Math.round((Number(value)+Number.EPSILON)*10)/10;
  const finite=value=>Number.isFinite(Number(value));
  const sameIdentity=(left,right)=>String(left&&left.recordId||left&&left.id||'')===String(right&&right.recordId||right&&right.id||'');
  const finalName=(candidate,score)=>String(score&&score.finalFormNameZh||candidate&&candidate.name||'');
  const isLimitedSpecial=(candidate,score)=>SPECIAL_NAMES.has(String(candidate&&candidate.name||''))||SPECIAL_NAMES.has(finalName(candidate,score));
  const retentionLimit=(candidate,score)=>isLimitedSpecial(candidate,score)?1:4;
  const ingredientRoute=candidate=>String(candidate&&candidate.ingredients||'').split('／').map(slot=>slot.replace(/×\d+$/,'').trim()).join('／');

  function ranked(candidate,box,scoring,predicate){
    const rows=[candidate,...box.filter(mon=>!sameIdentity(mon,candidate))]
      .map(mon=>({mon,score:scoring.scorePokemon(mon)}))
      .filter(row=>finite(row.score.finalScore)&&predicate(row.score,row.mon))
      .sort((a,b)=>Number(b.score.finalScore)-Number(a.score.finalScore)||Number(b.score.individualScore)-Number(a.score.individualScore)||String(a.mon.id).localeCompare(String(b.mon.id),'zh-CN',{numeric:true}));
    const index=rows.findIndex(row=>sameIdentity(row.mon,candidate));
    return {rank:index<0?null:index+1,total:rows.length,best:rows.find(row=>!sameIdentity(row.mon,candidate))||null,rows};
  }
  function groupTotal(candidate,box,scoring,score){
    return [candidate,...box.filter(mon=>!sameIdentity(mon,candidate))].reduce((total,mon)=>{const row=scoring.scorePokemon(mon);return total+(String(row&&row.finalFormId||'')===String(score&&score.finalFormId||'')?1:0)},0);
  }

  function assessCandidate(candidate,box,scoring){
    const source=candidate||{},all=Array.isArray(box)?box:[],score=scoring.scorePokemon(source),limit=retentionLimit(source,score),special=limit===1,totalInGroup=score&&score.finalFormId?groupTotal(source,all,scoring,score):0;
    if(!finite(score.finalScore))return {
      verdict:special&&totalInGroup>1?'人工择一':'人工判断',tone:'manual',score,retentionLimit:limit,exceedsLimit:false,isLimitedSpecial:special,
      reason:special&&totalInGroup>1?`同种特殊宝可梦只能保留 1 个实战席位；当前共有 ${totalInGroup} 个，但全能型公式尚未确认，请人工选出最好的一只。`:score.status==='pending-all-rounder-formula'?'全能型评分公式尚未确认，暂不自动给出去留结论。':'缺少可用的种族或个体评分。',
      sameSpecies:{rank:null,total:totalInGroup,best:null},sameRole:{rank:null,total:0,best:null},warnings:['系统只提示，不会自动放生；闪光收藏始终优先保留。']
    };
    const sameSpecies=ranked(source,all,scoring,row=>row.finalFormId===score.finalFormId),sameRole=ranked(source,all,scoring,row=>row.specialty===score.specialty),speciesBest=sameSpecies.best,roleBest=sameRole.best,speciesDelta=speciesBest?round(score.finalScore-speciesBest.score.finalScore):null,roleDelta=roleBest?round(score.finalScore-roleBest.score.finalScore):null,shiny=String(source.shiny)==='是',exceedsLimit=Boolean(sameSpecies.rank&&sameSpecies.rank>limit),lowSpecies=Number(score.speciesScore)<38,lowIndividual=Number(score.individualScore)<38;
    const strategicStandard=strategy&&score.strategy?strategy.minimumStandard(source,{finalId:score.finalFormId,specialty:score.specialty,strategicProfile:score.strategy}):null,route=ingredientRoute(source),topRoutes=new Set(sameSpecies.rows.slice(0,limit).filter(row=>!sameIdentity(row.mon,source)).map(row=>ingredientRoute(row.mon)).filter(Boolean)),uniqueStrategicRoute=Boolean(route&&!topRoutes.has(route)),strategicProtected=Boolean(strategicStandard&&strategicStandard.meetsMinimum&&(!exceedsLimit||uniqueStrategicRoute));
    let verdict='备用观察',tone='keep',reason=`当前位于同最终形态前 ${limit} 个实战席位内，建议先按用途保留。`;

    if(shiny){
      verdict='闪光收藏';tone='collect';
      reason=exceedsLimit?`实战排名已超过 ${limit} 个席位，但闪光个体默认转为收藏，不提示放生。`:speciesBest&&speciesDelta<-3?`同最终形态已有更强实战个体（相差 ${Math.abs(speciesDelta).toFixed(1)} 分），这只更适合作为收藏。`:'闪光个体默认保留；是否投入资源再看同种排名。';
    }else if(exceedsLimit&&strategicProtected){
      verdict='战略岗位复核';tone='manual';reason=`虽然同最终形态排名为 ${sameSpecies.rank}/${sameSpecies.total}，但该个体达到“${score.strategy.role}”入盒线，且前 ${limit} 只没有相同食材路线；请先确认岗位已被覆盖，不自动列为放生候选。`;
    }else if(exceedsLimit){
      verdict='放生候选';tone='release';
      reason=special?`同种特殊宝可梦只保留评分最高的 1 只；该个体排名 ${sameSpecies.rank}/${sameSpecies.total}，属于第 2 只及以后，可在确认未投入稀缺资源后放生。`:`同最终形态最多需要 4 个实战个体；该个体排名 ${sameSpecies.rank}/${sameSpecies.total}，属于第 5 只及以后，可在确认没有独特食材路线或收藏用途后放生。`;
    }else if(speciesBest&&speciesDelta>=1.5){
      verdict='替换候选';tone='replace';reason=`比当前同最终形态最佳个体高 ${speciesDelta.toFixed(1)} 分，可优先培养并占用前 ${limit} 个席位。`;
    }else if(speciesBest&&speciesDelta>=-3){
      verdict='并列保留';tone='keep';reason=`与同最终形态最佳个体仅差 ${Math.abs(speciesDelta).toFixed(1)} 分，且仍在前 ${limit} 个席位内，适合作为不同食材路线、等级曲线或第二队选择。`;
    }else if(strategicProtected){
      verdict='战略岗位保留';tone='keep';reason=`该个体达到“${score.strategy.role}”最低入盒线；机械综合分不是唯一依据，先作为${score.strategy.ingredient||'队伍'}岗位保留。`;
    }else if(lowSpecies&&lowIndividual&&speciesBest&&speciesDelta<=-8){
      verdict='放生候选';tone='release';reason=`种族分与个体分都偏低，且同最终形态已有高 ${Math.abs(speciesDelta).toFixed(1)} 分的个体。确认没有收藏或特殊路线用途后可放生。`;
    }else if(lowSpecies&&lowIndividual&&roleBest&&roleDelta<=-15){
      verdict='放生候选';tone='release';reason=`种族分与个体分都偏低，同定位最佳个体领先 ${Math.abs(roleDelta).toFixed(1)} 分；若没有稀缺食材、活动或收藏用途，可考虑放生。`;
    }else if(Number(score.speciesScore)>=65&&Number(score.individualScore)>=50){
      verdict='值得培养';tone='train';reason=`种族基础和个体配置都达到较好的培养区间，并处于同最终形态前 ${limit} 个席位。`;
    }else if(speciesBest&&speciesDelta<-3){
      verdict='同种备用';tone='keep';reason=`同最终形态已有更高分个体（领先 ${Math.abs(speciesDelta).toFixed(1)} 分），但当前仍在前 ${limit} 个席位内，可保留给多队或不同食材路线。`;
    }
    return {verdict,tone,reason,score,sameSpecies,sameRole,speciesDelta,roleDelta,retentionLimit:limit,exceedsLimit,isLimitedSpecial:special,strategicStandard,uniqueStrategicRoute,warnings:['这里只按同最终形态分配实战席位，不会把所有树果手／食材手混为一组；系统不会自动放生。闪光、独特食材路线、活动限定与已投入资源仍需人工复核。']};
  }

  function rankText(group){return group.rank?`${group.rank} / ${group.total}`:'—'}
  function render(container,candidate,box,scoring){
    if(!container||typeof document==='undefined')return null;
    const result=assessCandidate(candidate,Array.isArray(box)?box:[],scoring);
    container.replaceChildren();container.className=`retention-preview tone-${result.tone}`;
    const head=document.createElement('div'),badge=document.createElement('strong'),copy=document.createElement('div');
    head.className='retention-preview-head';badge.className='retention-verdict';badge.textContent=result.verdict;
    copy.innerHTML=`<span>新个体去留判断</span><b>${result.reason}</b>`;head.append(copy,badge);
    const ranks=document.createElement('div');ranks.className='retention-ranks';
    [['同最终形态排名',rankText(result.sameSpecies)],['同定位参考排名',rankText(result.sameRole)],['实战席位上限',result.isLimitedSpecial?'同种 1 个':`同形态 ${result.retentionLimit} 个`]].forEach(([label,value])=>{const item=document.createElement('span');item.innerHTML=`<small>${label}</small><b>${value}</b>`;ranks.append(item)});
    const note=document.createElement('p');note.textContent=result.warnings.join(' ');container.append(head,ranks,note);return result;
  }

  return Object.freeze({SPECIAL_NAMES,retentionLimit,assessCandidate,render});
});
