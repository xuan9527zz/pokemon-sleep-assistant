(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_ALL_ROUNDER_RULES=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const ALL_MIGHTY_OPTIONS=Object.freeze([
    {id:'metronome',label:'挥指',mainSkillId:13,ratePct:4,resource:'mixed'},
    {id:'energy-s-fixed',label:'能量填充S',mainSkillId:1,ratePct:8,resource:'energy'},
    {id:'energy-m',label:'能量填充M',mainSkillId:2,ratePct:4,resource:'energy'},
    {id:'dream-shard-fixed',label:'梦之碎片获取S',mainSkillId:3,ratePct:4,resource:'shard'},
    {id:'ingredient-magnet',label:'食材获取S',mainSkillId:10,ratePct:4,resource:'ingredient'},
    {id:'energizing-cheer',label:'活力疗愈S',mainSkillId:4,ratePct:4,resource:'recovery'},
    {id:'charge-energy',label:'活力填充S',mainSkillId:7,ratePct:8,resource:'recovery'},
    {id:'e4e',label:'活力全体疗愈S',mainSkillId:8,ratePct:3.2,resource:'recovery'},
    {id:'tasty-chance',label:'料理成功S',mainSkillId:14,ratePct:4,resource:'cooking'},
    {id:'cooking-power',label:'料理强化S',mainSkillId:11,ratePct:4,resource:'pot'},
    {id:'helping-support',label:'帮手支援S',mainSkillId:9,ratePct:4,resource:'help'},
    {id:'berry-burst',label:'树果骤增',mainSkillId:21,ratePct:3.2,resource:'energy'}
  ]);
  const BY_ID=Object.freeze(Object.fromEntries(ALL_MIGHTY_OPTIONS.map(item=>[item.id,item])));
  const GUIDANCE=Object.freeze({
    metronome:{role:'随机工具位',team:'缺口不固定、能接受随机结果的队伍'},
    'energy-s-fixed':{role:'直接能量位',team:'需要稳定补充卡比兽能量的队伍'},
    'energy-m':{role:'直接能量位',team:'需要稳定补充卡比兽能量的队伍'},
    'dream-shard-fixed':{role:'梦之碎片工具位',team:'以碎片获取为目标的短驻场队伍'},
    'ingredient-magnet':{role:'随机食材补充位',team:'食材种类缺口较散的料理队'},
    'energizing-cheer':{role:'单体活力支援位',team:'有一名高价值主力需要续航的队伍'},
    'charge-energy':{role:'自持场工具位',team:'需要梦幻长时间驻场、但不依赖群回的队伍'},
    e4e:{role:'全队治疗位',team:'缺少稳定群回、或高活力收益明显的长期队伍'},
    'tasty-chance':{role:'爆锅支援位',team:'高等级高能量料理的活动冲刺队'},
    'cooking-power':{role:'扩锅支援位',team:'锅容量不足以制作目标食谱的料理队'},
    'helping-support':{role:'额外帮忙支援位',team:'队友单次帮忙价值高的树果／食材队'},
    'berry-burst':{role:'树果联动输出位',team:'队友树果价值高、且尽量命中喜爱树果的输出队'}
  });
  function isMew(mon){return String(mon&&mon.speciesId||'')==='151'||String(mon&&mon.finalFormId||'')==='151'||/梦幻|夢幻/.test(String(mon&&mon.name||''))}
  function isDarkrai(mon){return String(mon&&mon.speciesId||'')==='491'||String(mon&&mon.finalFormId||'')==='491'||/达克莱伊|達克萊伊/.test(String(mon&&mon.name||''))}
  function selectedId(mon){
    const stored=String(mon&&mon.versatileSkillId||'');if(BY_ID[stored])return stored;
    const label=String(mon&&mon.main||'');return ALL_MIGHTY_OPTIONS.find(item=>label.includes(item.label))?.id||'metronome';
  }
  function apply(mon,id){
    if(!isMew(mon))return {...mon};
    const item=BY_ID[id]||BY_ID[selectedId(mon)]||BY_ID.metronome,level=Math.max(1,Math.min(8,Math.round(Number(String(mon.main||'').match(/Lv\.(\d+)/)?.[1])||Number(mon.mainSkillLevel)||1)));
    return {...mon,versatileSkillId:item.id,versatileSkillName:item.label,mainSkillId:item.mainSkillId,skillRatePct:item.ratePct,main:`十项全能→${item.label} Lv.${level}`};
  }
  function assess(mon){
    if(isMew(mon)){const id=selectedId(mon),guide=GUIDANCE[id]||GUIDANCE.metronome,item=BY_ID[id]||BY_ID.metronome;return {role:guide.role,team:guide.team,build:`十项全能：${item.label}（基础触发率档 ${item.ratePct}%）`,warning:item.resource==='energy'||item.resource==='help'?'可与当前五人队直接比较纯能量；仍需结合队友树果价值。':'该技能产出的是资源／活力，不能用固定能量与输出技能直接排名。'}}
    if(isDarkrai(mon)){const nonDarkWarning='非恶属性队友会承受梦魇的活力代价';return {role:'恶属性即时能量位',team:'恶属性成员较多的长期队；混合队必须连同活力损失推演',build:`梦魇（能量填充M） · ${String(mon&&mon.ingredients||'食材栏未记录')}`,warning:nonDarkWarning}}
    return null;
  }
  return Object.freeze({ALL_MIGHTY_OPTIONS,BY_ID,GUIDANCE,isMew,isDarkrai,selectedId,apply,assess});
});
