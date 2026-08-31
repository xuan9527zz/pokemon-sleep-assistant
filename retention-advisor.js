(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_RETENTION_ADVISOR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const round=value=>Math.round((Number(value)+Number.EPSILON)*10)/10;
  const finite=value=>Number.isFinite(Number(value));
  const sameIdentity=(left,right)=>String(left&&left.recordId||left&&left.id||'')===String(right&&right.recordId||right&&right.id||'');

  function ranked(candidate,box,scoring,predicate){
    const rows=[candidate,...box.filter(mon=>!sameIdentity(mon,candidate))]
      .map(mon=>({mon,score:scoring.scorePokemon(mon)}))
      .filter(row=>finite(row.score.finalScore)&&predicate(row.score,row.mon))
      .sort((a,b)=>Number(b.score.finalScore)-Number(a.score.finalScore)||Number(b.score.individualScore)-Number(a.score.individualScore));
    const index=rows.findIndex(row=>sameIdentity(row.mon,candidate));
    return {rank:index<0?null:index+1,total:rows.length,best:rows.find(row=>!sameIdentity(row.mon,candidate))||null,rows};
  }

  function assessCandidate(candidate,box,scoring){
    const score=scoring.scorePokemon(candidate||{});
    if(!finite(score.finalScore))return {
      verdict:'人工判断',tone:'manual',score,
      reason:score.status==='pending-all-rounder-formula'?'全能型评分公式尚未确认，暂不自动给出去留结论。':'缺少可用的种族或个体评分。',
      sameSpecies:{rank:null,total:0,best:null},sameRole:{rank:null,total:0,best:null},warnings:['系统不会自动放生任何宝可梦。']
    };
    const sameSpecies=ranked(candidate,box,scoring,row=>row.finalFormId===score.finalFormId);
    const sameRole=ranked(candidate,box,scoring,row=>row.specialty===score.specialty);
    const speciesBest=sameSpecies.best,roleBest=sameRole.best;
    const speciesDelta=speciesBest?round(score.finalScore-speciesBest.score.finalScore):null;
    const roleDelta=roleBest?round(score.finalScore-roleBest.score.finalScore):null;
    const shiny=String(candidate.shiny)==='是';
    const lowSpecies=Number(score.speciesScore)<38,lowIndividual=Number(score.individualScore)<38;
    let verdict='备用观察',tone='keep',reason='目前没有形成明显替换关系，建议先按用途保留。';

    if(shiny){
      verdict='闪光收藏';tone='collect';
      reason=speciesBest&&speciesDelta<-3?`同最终形态已有更强实战个体（相差 ${Math.abs(speciesDelta).toFixed(1)} 分），这只更适合作为收藏。`:'闪光个体默认保留；是否投入资源再看同种与同定位排名。';
    }else if(speciesBest&&speciesDelta>=1.5){
      verdict='替换候选';tone='replace';reason=`比当前同最终形态最佳个体高 ${speciesDelta.toFixed(1)} 分，可优先培养并考虑替换旧个体。`;
    }else if(speciesBest&&speciesDelta>=-3){
      verdict='并列保留';tone='keep';reason=`与同最终形态最佳个体仅差 ${Math.abs(speciesDelta).toFixed(1)} 分，适合作为不同食材路线、等级曲线或第二队选择。`;
    }else if(lowSpecies&&lowIndividual&&speciesBest&&speciesDelta<=-8){
      verdict='放生候选';tone='release';reason=`种族分与个体分都偏低，且同最终形态已有高 ${Math.abs(speciesDelta).toFixed(1)} 分的个体。确认没有收藏或特殊路线用途后可放生。`;
    }else if(lowSpecies&&lowIndividual&&roleBest&&roleDelta<=-15){
      verdict='放生候选';tone='release';reason=`种族分与个体分都偏低，同定位最佳个体领先 ${Math.abs(roleDelta).toFixed(1)} 分；若没有稀缺食材、活动或收藏用途，可考虑放生。`;
    }else if(Number(score.speciesScore)>=65&&Number(score.individualScore)>=50){
      verdict='值得培养';tone='train';reason='种族基础和个体配置都达到较好的培养区间。';
    }else if(speciesBest&&speciesDelta<-3){
      verdict='同种备用';tone='keep';reason=`同最终形态已有更高分个体（领先 ${Math.abs(speciesDelta).toFixed(1)} 分），保留价值主要来自等级、食材路线或多队需求。`;
    }
    return {verdict,tone,reason,score,sameSpecies,sameRole,speciesDelta,roleDelta,warnings:['这是筛选建议，不会自动放生；闪光、稀缺食材路线、活动限定与已投入资源需人工复核。']};
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
    [['同最终形态排名',rankText(result.sameSpecies)],['同定位排名',rankText(result.sameRole)],['系统操作','仅建议，不自动放生']].forEach(([label,value])=>{const item=document.createElement('span');item.innerHTML=`<small>${label}</small><b>${value}</b>`;ranks.append(item)});
    const note=document.createElement('p');note.textContent=result.warnings.join(' ');container.append(head,ranks,note);return result;
  }

  return Object.freeze({assessCandidate,render});
});
