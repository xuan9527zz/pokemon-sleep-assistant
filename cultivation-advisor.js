(function(root,factory){
  'use strict';
  const catalog=typeof module==='object'&&module.exports?require('./pokemon-catalog.generated.js'):root.POKEMON_SLEEP_CATALOG;
  const api=factory(catalog);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_CULTIVATION_ADVISOR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(catalog){
  'use strict';

  const ACCOUNT_STAGES=Object.freeze({
    starter:Object.freeze({id:'starter',label:'新手起步',description:'培养判断统一按物种梯级 × 个体梯级矩阵计算，账号阶段不再改变结论。'}),
    forming:Object.freeze({id:'forming',label:'队伍成型',description:'培养判断统一按物种梯级 × 个体梯级矩阵计算，账号阶段不再改变结论。'}),
    mature:Object.freeze({id:'mature',label:'成熟补强',description:'培养判断统一按物种梯级 × 个体梯级矩阵计算，账号阶段不再改变结论。'})
  });
  const TIERS=Object.freeze({
    core:Object.freeze({id:'core',label:'核心培养',tone:'core',sort:70,nextAction:'可以作为长期核心投入糖果与稀缺资源。'}),
    recommended:Object.freeze({id:'recommended',label:'推荐培养',tone:'recommended',sort:60,nextAction:'达到推荐培养组合，可按队伍需求投入。'}),
    stage:Object.freeze({id:'stage',label:'阶段培养',tone:'stage',sort:50,nextAction:'先培养到关键等级，再决定是否继续重投入。'}),
    transition:Object.freeze({id:'transition',label:'过渡使用',tone:'transition',sort:40,nextAction:'可以上场填补缺口，但暂缓稀缺资源。'}),
    collection:Object.freeze({id:'collection',label:'收藏保护',tone:'collection',sort:30,nextAction:'实战培养线不足，但因闪光或限定属性保留。'}),
    release:Object.freeze({id:'release',label:'放生',tone:'release',sort:20,nextAction:'当前不进入培养或收藏范围；这里只给出建议，不会自动删除。'}),
    manual:Object.freeze({id:'manual',label:'人工复核',tone:'manual',sort:0,nextAction:'补齐物种或个体评价资料后再判断。'})
  });
  const MATRIX=Object.freeze({
    S:Object.freeze({S:'core',A:'recommended',B:'stage',C:'no-train'}),
    A:Object.freeze({S:'recommended',A:'recommended',B:'transition',C:'no-train'}),
    B:Object.freeze({S:'transition',A:'transition',B:'transition',C:'no-train'}),
    C:Object.freeze({S:'no-train',A:'no-train',B:'no-train',C:'no-train'})
  });
  const LIMITED_NAMES=new Set(['梦幻','雷公','炎帝','水君','拉帝亚斯','拉帝欧斯','克雷色利亚','达克莱伊','超梦']);
  const LIMITED_MARKERS=['佳节','节日','圣诞','万圣节','船长','巫师帽'];
  const byId=new Map((catalog&&catalog.pokemon||[]).map(record=>[String(record.id),record]));
  const finite=value=>value!==null&&value!==''&&value!==undefined&&Number.isFinite(Number(value));
  const tier=id=>TIERS[id]||TIERS.manual;
  const stageProfile=id=>ACCOUNT_STAGES[id]||ACCOUNT_STAGES.mature;

  function scoreFor(mon,override){return override||mon&&mon.scoreBreakdown||null}
  function finalFormId(mon,score){
    if(score&&score.finalFormId)return String(score.finalFormId);
    if(mon&&mon.finalFormId)return String(mon.finalFormId);
    if(mon&&mon.speciesId){const record=byId.get(String(mon.speciesId));if(record)return String(record.defaultFinalId||record.id)}
    const target=catalog&&catalog.existingNameTargets&&catalog.existingNameTargets[mon&&mon.name];
    return target?String(target.id):'';
  }
  function individualGrade(score){
    const explicit=score&&((score.individual&&score.individual.grade)||score.individualGrade);
    if(['S','A','B','C'].includes(explicit))return explicit;
    if(!finite(score&&score.individualScore))return null;
    const legacy=Number(score.individualScore);
    return legacy>=80?'S':legacy>=65?'A':legacy>=50?'B':'C';
  }
  function isLimited(mon,score){
    const names=[mon&&mon.name,score&&score.finalFormNameZh].filter(Boolean).map(String),id=finalFormId(mon,score);
    return names.some(name=>LIMITED_NAMES.has(name)||LIMITED_MARKERS.some(marker=>name.includes(marker)))||/^9\d{3}/.test(id);
  }
  function result(tierId,fields={}){
    const definition=tier(tierId);
    return {tier:tierId,label:definition.label,tone:definition.tone,sort:definition.sort,nextAction:definition.nextAction,reason:fields.reason||'',details:fields.details||[],directSuperior:null,exception:'',evidence:'用户确认的物种梯级 × 个体梯级培养矩阵',accountStage:stageProfile(fields.accountStage),teamModel:null};
  }
  function assess(mon,_box,options={}){
    const score=scoreFor(mon,options.score),speciesGrade=String(score&&score.speciesTier||''),individual=individualGrade(score);
    if(!MATRIX[speciesGrade]||!individual)return result('manual',{accountStage:options.accountStage,reason:'缺少可用的物种梯级或个体梯级，暂时不能自动判断。'});
    const base=MATRIX[speciesGrade][individual],shiny=String(mon&&mon.shiny)==='是',limited=isLimited(mon,score),details=[`物种 ${speciesGrade} 级 × 个体 ${individual} 级。`];
    if(base!=='no-train')return result(base,{accountStage:options.accountStage,reason:`基础判断矩阵给出“${tier(base).label}”；闪光、限定和已有投入都不覆盖这条实战结论。`,details});
    if(shiny||limited){
      details.push(shiny?'基础判断为暂不培养，但闪光个体进入收藏保护。':'基础判断为暂不培养，但限定个体进入收藏保护。');
      return result('collection',{accountStage:options.accountStage,reason:`基础矩阵不建议培养；${shiny?'闪光':'限定'}属性触发收藏保护。`,details});
    }
    details.push('已有投入、盒子分类和独特路线不改变放生判断。');
    return result('release',{accountStage:options.accountStage,reason:'基础矩阵为暂不培养，且不属于闪光或限定收藏保护范围。',details});
  }
  function explanation(value){
    return [value.label,value.reason,...value.details,`建议动作：${value.nextAction}`,'这是去留建议标签；网站不会自动放生或删除任何宝可梦。'].filter(Boolean).join('\n');
  }

  return Object.freeze({ACCOUNT_STAGES,TIERS,MATRIX,LIMITED_NAMES,stageProfile,finalFormId,individualGrade,isLimited,assess,explanation});
});
