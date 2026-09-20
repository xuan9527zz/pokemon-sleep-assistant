(function(root,factory){
  'use strict';
  const cultivation=typeof module==='object'&&module.exports?require('./cultivation-advisor.js'):root.POKEMON_SLEEP_CULTIVATION_ADVISOR;
  const api=factory(cultivation);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_RETENTION_ADVISOR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(cultivation){
  'use strict';

  const SPECIAL_NAMES=cultivation.LIMITED_NAMES;
  const emptyRank=Object.freeze({rank:null,total:0,best:null,rows:[]});
  const retentionLimit=()=>null;

  function assessCandidate(candidate,box,scoring){
    const score=scoring.scorePokemon(candidate),advice=cultivation.assess(candidate,box,{score}),limited=cultivation.isLimited(candidate,score);
    return {
      verdict:advice.label,tone:advice.tone,reason:advice.reason,score,cultivation:advice,retentionLimit:null,exceedsLimit:false,isLimitedSpecial:limited,
      sameSpecies:emptyRank,sameRole:emptyRank,speciesDelta:null,roleDelta:null,strategicStandard:null,uniqueStrategicRoute:false,
      warnings:['先按物种梯级 × 个体梯级矩阵判断；只有基础结果为暂不培养时，闪光或限定才改为收藏保护。已有投入和独特路线不改变放生建议；系统不会自动删除。']
    };
  }
  function render(container,candidate,box,scoring){
    if(!container||typeof document==='undefined')return null;
    const result=assessCandidate(candidate,Array.isArray(box)?box:[],scoring);
    container.replaceChildren();container.className=`retention-preview tone-${result.tone}`;
    const head=document.createElement('div'),badge=document.createElement('strong'),copy=document.createElement('div');
    head.className='retention-preview-head';badge.className='retention-verdict';badge.textContent=result.verdict;
    copy.innerHTML=`<span>培养与去留判断</span><b>${result.reason}</b>`;head.append(copy,badge);
    const ranks=document.createElement('div');ranks.className='retention-ranks';
    [['物种梯级',`${result.score.speciesTier||'C'}级`],['个体梯级',`${result.score.individualGrade||result.score.individual&&result.score.individual.grade||'待定'}级`],['个体倍率',Number.isFinite(result.score.individualScore)?`×${result.score.individualScore.toFixed(2)}`:'待定']].forEach(([label,value])=>{const item=document.createElement('span');item.innerHTML=`<small>${label}</small><b>${value}</b>`;ranks.append(item)});
    const note=document.createElement('p');note.textContent=result.warnings.join(' ');container.append(head,ranks,note);return result;
  }

  return Object.freeze({SPECIAL_NAMES,retentionLimit,assessCandidate,render});
});
