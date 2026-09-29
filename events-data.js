(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_EVENTS=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const ACTIVITY_PROFILES=Object.freeze({
    normal:Object.freeze({label:'普通周',carryBonus:0,cookingEnergyMultiplier:1,note:'无活动临时加成。',defaultMealGoal:21}),
    snapshot:Object.freeze({label:'梦幻拍照活动（已结束）',carryBonus:0,cookingEnergyMultiplier:1,note:'活动已于 2026-09-07 03:59 结束，仅保留历史档案。',defaultMealGoal:15,archived:true}),
    goodSleep39:Object.freeze({label:'第39回好眠日·前后夜',carryBonus:0,cookingEnergyMultiplier:1,universalSleepMultiplier:1.5,note:'9 月 26 日 04:00—29 日 03:59；前后夜睡意之力 ×1.5、帮手睡眠 EXP ×2、睡眠点数＋500。满月夜的 ×2／EXP ×3 仅保留在活动资讯页。',defaultMealGoal:21}),
    mewtwo1:Object.freeze({label:'超梦登场活动·第1周（已结束）',eventAreas:Object.freeze(['萌绿之岛','萌绿之岛 EX']),bonusBerries:Object.freeze(['芒芒果']),carryBonus:8,mainSkillLevelBonus:2,ingredientHelpBonus:1,skillTriggerMultiplier:1.5,cookingEnergyMultiplier:1,sleepDrowsyPowerMultiplier:1.1,sleepBonusSpecies:Object.freeze(['梦幻','超梦']),favoriteBerry:'芒芒果',note:'历史档案：仅萌绿之岛／萌绿之岛 EX；全员持有＋8，超能力系主技能等级＋2、触发率 ×1.5、食材帮忙＋1。',defaultMealGoal:15,archived:true}),
    mewtwo2:Object.freeze({label:'超梦登场活动·第2周（已结束）',eventAreas:Object.freeze(['萌绿之岛','萌绿之岛 EX']),bonusBerries:Object.freeze(['芒芒果']),carryBonus:15,mainSkillLevelBonus:5,ingredientHelpBonus:1,skillTriggerMultiplier:1.5,cookingEnergyMultiplier:1,sleepDrowsyPowerMultiplier:1.3,sleepBonusSpecies:Object.freeze(['超梦']),favoriteBerry:'芒芒果',note:'历史档案：仅萌绿之岛／萌绿之岛 EX；全员持有＋15，超能力系主技能等级＋5、触发率 ×1.5、食材帮忙＋1。',defaultMealGoal:15,archived:true}),
    cooking125:Object.freeze({label:'料理能量＋25%',carryBonus:0,cookingEnergyMultiplier:1.25,note:'活动料理能量＋25%；完整推演会把倍率计入每餐能量。',defaultMealGoal:15}),
    cooking150:Object.freeze({label:'料理能量＋50%',carryBonus:0,cookingEnergyMultiplier:1.5,note:'活动料理能量＋50%；完整推演会把倍率计入每餐能量。',defaultMealGoal:15})
  });

  const SOURCES=Object.freeze({
    goodSleep39:'https://www.pokemonsleep.net/news/343430323231373034343933343635363034/',
    cookingWeek3:'https://www.pokemonsleep.net/news/343430323735323935393230393739393731/',
    mewtwoEvent:'https://www.pokemonsleep.net/en/news/343239383235333132393938353535363534/',
    mewtwo:'https://www.pokemonsleep.net/en/news/343333373536323134383333313834373731/',
    mewtwoResearch:'https://wikiwiki.jp/poke_sleep/%E3%83%9F%E3%83%A5%E3%82%A6%E3%83%84%E3%83%BC'
  });

  const EVENT_GUIDE=Object.freeze({
    updatedAt:'2026-09-29',
    title:'近期活动｜当前加成与下一场',
    intro:'按游戏内 04:00 切换活动日；这里是人工核对的公告快照，不会自动获取新公告。',
    current:Object.freeze({
      title:'第 39 回好眠日',
      date:'9 月 26 日 04:00—9 月 29 日 03:59 · 全部岛屿'
    }),
    mewtwo:Object.freeze({
      title:'#150 超梦',icon:'./assets/pokemon/150.png',badges:Object.freeze(['技能手','芒芒果','安然入睡','特殊宝可梦']),
      summary:'基准帮忙 2300 秒，持有上限 24，食材率 16.0%，技能率 2.9%。食材为萌绿大豆（1／2／4）、萌绿玉米（Lv.30 ×2／Lv.60 ×3）与窝心洋芋（Lv.60 ×3）。',
      facts:Object.freeze([
        '主技能「精神击破（树果领域）」Lv.1—6 直接能量为 1,408／2,002／2,762／3,813／5,264／7,274。',
        '树果领域每次触发提升芒芒果 0.6／0.8／1.0／1.2／1.6／2.0 个百分点；换队不消失、换岛才清除，累计上限 24%。',
        '可常驻遇见于萌绿之岛、萌绿之岛 EX 与天青沙滩 EX；依旧受“队伍只能编入 1 只特殊宝可梦”限制。'
      ])
    }),
    plans:Object.freeze([
      Object.freeze({id:'sleep',title:'好眠日睡眠安排',items:Object.freeze([['睡满优先：','活动期间可利用当日睡意之力和帮手睡眠 EXP 加成；要不要分睡交给本周作战台按目标比较。'],['闪光机会：','想收藏皮宝宝进化系时，不需为了追活动效果改去特定岛屿。']])}),
      Object.freeze({id:'exchange',title:'超梦兑换所',items:Object.freeze([['10 月 1 日 03:59 前：','用完超梦 DNA，优先确认超梦熏香、超梦饼干与限购种子。'],['10 月 3 日 19:00：','剩余超梦饼干自动转换为超级沙布蕾；超梦熏香可继续使用。']])}),
      Object.freeze({id:'conversion',title:'超梦饼干转换',items:Object.freeze([['10 月 3 日 19:00：','剩余超梦饼干自动转换为超级沙布蕾；超梦熏香可继续使用。']])}),
      Object.freeze({id:'cooking-prep',title:'下期预告｜料理周',items:Object.freeze([['10 月 5 日 04:00 开始：','全部岛屿举办料理周；准备高容量料理与对应食材。'],['模型边界：','活动公告已收录；本周作战台尚未自动套用料理周的全部加成，请勿把普通周推演当成活动周总收益。']])}),
      Object.freeze({id:'cooking',title:'料理周进行中',items:Object.freeze([['料理与食材：','工作日锅容量 ×2，周日 ×4；料理最终能量 ×1.25，食材手普通帮忙食材＋1。'],['模型边界：','本周作战台尚未自动套用料理周的全部加成，请以游戏内活动状态和官方公告为准。']])}),
      Object.freeze({id:'permanent',title:'超梦后续培养',items:Object.freeze([['图鉴已并入：','新建或导入超梦个体后，会读取技能手面板与你指定的幻之／传说 B 梯级。'],['组队思路：','可在本周作战台的可选“树果领域”模型中安排超梦先上场、叠层后换成芒芒果产手。']])})
    ])
  });

  const PHASES=Object.freeze([
    Object.freeze({id:'before',until:'2026-09-26T04:00:00+09:00',title:'第 39 回好眠日',date:EVENT_GUIDE.current.date,countdown:'距离好眠日开始',status:'<b>即将开始：</b>第 39 回好眠日将在 9 月 26 日 04:00 开始。',link:SOURCES.goodSleep39,linkLabel:'好眠日公告'}),
    Object.freeze({id:'good-sleep',until:'2026-09-29T04:00:00+09:00',title:'第 39 回好眠日',date:EVENT_GUIDE.current.date,countdown:'好眠日进行中 · 距离结束',status:'<b>当前：</b>第 39 回好眠日进行中；加成按活动日切换。',link:SOURCES.goodSleep39,linkLabel:'好眠日公告'}),
    Object.freeze({id:'exchange',until:'2026-10-01T04:00:00+09:00',title:'超梦兑换所',date:'截至 10 月 1 日 03:59',countdown:'距超梦兑换所关闭',status:'<b>收尾：</b>好眠日已结束；超梦活动兑换所仍开放至 10 月 1 日 03:59。',link:SOURCES.mewtwoEvent,linkLabel:'超梦兑换说明'}),
    Object.freeze({id:'conversion',until:'2026-10-03T19:00:00+09:00',title:'超梦饼干转换',date:'10 月 3 日 19:00 自动转换',countdown:'距超梦饼干转换',status:'<b>提醒：</b>超梦兑换所已关闭；剩余超梦饼干将在 10 月 3 日 19:00 转为超级沙布蕾。',link:SOURCES.mewtwoEvent,linkLabel:'转换说明'}),
    Object.freeze({id:'cooking-before',until:'2026-10-05T04:00:00+09:00',title:'大份料理周 vol.3',date:'10 月 5 日 04:00—10 月 12 日 03:59 · 全部岛屿',countdown:'距离料理周开始',status:'<b>下期预告：</b>料理周将于 10 月 5 日 04:00 开始；当前尚无料理周加成。',link:SOURCES.cookingWeek3,linkLabel:'料理周公告'}),
    Object.freeze({id:'cooking',until:'2026-10-12T04:00:00+09:00',title:'大份料理周 vol.3',date:'10 月 5 日 04:00—10 月 12 日 03:59 · 全部岛屿',countdown:'料理周进行中 · 距离结束',status:'<b>当前：</b>料理周进行中；活动页展示官方加成，但本周作战台尚未自动套用全部料理周效果。',link:SOURCES.cookingWeek3,linkLabel:'料理周公告'}),
    Object.freeze({id:'ended',until:null,title:'公告快照待更新',date:'当前快照覆盖至 10 月 12 日 03:59',countdown:'已收录的活动已结束',status:'<b>资料提示：</b>已收录活动均已结束；此页不会自动获取新公告，请核对官方最新资讯。',link:'https://www.pokemonsleep.net/news/',linkLabel:'查看官方最新资讯'})
  ]);

  const EVENT_BONUSES=Object.freeze([
    Object.freeze({id:'sleep-first',start:'2026-09-26T04:00:00+09:00',until:'2026-09-27T04:00:00+09:00',title:'9 月 26 日｜满月前一夜',badges:Object.freeze(['全部岛屿','睡意之力 ×1.5','帮手睡眠 EXP ×2','睡眠点数＋500']),facts:Object.freeze(['睡眠研究中更易遇见未登录的睡姿；皮宝宝进化系有机会闪光出现。','游戏内活动日从 04:00 开始；加成只适用于活动期间开始的睡眠测量。'])}),
    Object.freeze({id:'sleep-full',start:'2026-09-27T04:00:00+09:00',until:'2026-09-28T04:00:00+09:00',title:'9 月 27 日｜满月夜',badges:Object.freeze(['全部岛屿','睡意之力 ×2','帮手睡眠 EXP ×3','睡眠点数＋1000']),facts:Object.freeze(['满月夜加成高于前后夜；皮宝宝进化系出现率上升。','游戏内活动日从 04:00 开始；加成只适用于活动期间开始的睡眠测量。'])}),
    Object.freeze({id:'sleep-last',start:'2026-09-28T04:00:00+09:00',until:'2026-09-29T04:00:00+09:00',title:'9 月 28 日｜满月后一夜',badges:Object.freeze(['全部岛屿','睡意之力 ×1.5','帮手睡眠 EXP ×2','睡眠点数＋500']),facts:Object.freeze(['睡眠研究中更易遇见未登录的睡姿；皮宝宝进化系有机会闪光出现。','9 月 27 日满月夜的 ×2、EXP ×3 与＋1000 点不再适用。'])}),
    Object.freeze({id:'cooking-normal',start:'2026-10-05T04:00:00+09:00',until:'2026-10-11T04:00:00+09:00',title:'料理周｜普通活动日',badges:Object.freeze(['全部岛屿','锅容量 ×2','料理最终能量 ×1.25','食材手食材＋1']),facts:Object.freeze(['料理回复活力额外＋5；食材类主技能带来的食材数量 ×1.5。','周日活动日锅容量改为 ×4；本周作战台尚未自动套用全部料理周效果。'])}),
    Object.freeze({id:'cooking-sunday',start:'2026-10-11T04:00:00+09:00',until:'2026-10-12T04:00:00+09:00',title:'10 月 11 日｜料理周周日',badges:Object.freeze(['全部岛屿','锅容量 ×4','料理最终能量 ×1.25','食材手食材＋1']),facts:Object.freeze(['料理回复活力额外＋5；食材类主技能带来的食材数量 ×1.5。','官方公告的大成功最终能量为 ×3.75；本周作战台尚未自动套用全部料理周效果。'])})
  ]);

  function phaseAt(value=Date.now()){
    const now=value instanceof Date?value.getTime():new Date(value).getTime();
    return PHASES.find(phase=>phase.until&&now<new Date(phase.until).getTime())||PHASES[PHASES.length-1];
  }

  function countdownAt(value=Date.now()){
    const phase=phaseAt(value),now=value instanceof Date?value.getTime():new Date(value).getTime(),target=phase.until?new Date(phase.until).getTime():now,remaining=Math.max(0,target-now);
    return {phase,remaining,days:Math.floor(remaining/86400000),hours:Math.floor(remaining%86400000/3600000),minutes:Math.floor(remaining%3600000/60000),seconds:Math.floor(remaining%60000/1000)};
  }

  function bonusAt(value=Date.now()){
    const now=value instanceof Date?value.getTime():new Date(value).getTime(),active=EVENT_BONUSES.find(item=>now>=new Date(item.start).getTime()&&now<new Date(item.until).getTime());
    if(active)return {id:active.id,step:'02 · 当前加成',...active};
    const phase=phaseAt(value);
    if(phase.id==='before')return {id:'sleep-upcoming',step:'02 · 下期预告',title:'第 39 回好眠日即将开始',badges:['9 月 26 日 04:00 开始'],facts:['满月前后夜与满月夜加成不同；开始前不应套用活动倍率。']};
    if(['exchange','conversion','cooking-before'].includes(phase.id))return {id:'cooking-upcoming',step:'02 · 下期预告',title:'10 月 5 日｜大份料理周 vol.3',badges:['全部岛屿','锅容量 ×2 · 周日 ×4','料理最终能量 ×1.25'],facts:['10 月 5 日 04:00 前没有料理周加成。','活动公告已收录；本周作战台尚未自动套用料理周的全部加成。']};
    return {id:'snapshot-ended',step:'02 · 快照状态',title:'已收录活动均已结束',badges:['请核对官方最新公告'],facts:[`本页公告快照更新于 ${EVENT_GUIDE.updatedAt}；不会自动发现后来公布的活动。`]};
  }

  function plansAt(value=Date.now()){
    const id=phaseAt(value).id,visible={before:['sleep','exchange','cooking-prep','permanent'],'good-sleep':['sleep','exchange','cooking-prep','permanent'],exchange:['exchange','cooking-prep','permanent'],conversion:['conversion','cooking-prep','permanent'],'cooking-before':['cooking-prep','permanent'],cooking:['cooking','permanent'],ended:['permanent']}[id];
    return EVENT_GUIDE.plans.filter(plan=>visible.includes(plan.id));
  }

  function renderEventGuide(document,rootNode,value=Date.now()){
    const root=rootNode||document&&document.querySelector('#eventGuide');if(!root||!document)return null;const data=EVENT_GUIDE;
    root.innerHTML=`
      <div class="guide-head"><div><h2 id="eventGuideTitle">${data.title}</h2><p>${data.intro}</p></div><span class="guide-stamp">官方公告快照 · ${data.updatedAt}</span></div>
      <div class="event-current"><span id="currentEventStatus"></span><a id="currentEventLink" target="_blank" rel="noreferrer"></a></div>
      <div class="event-overview">
        <article class="event-block"><span class="event-step-no">01 · 当前倒计时</span><h3 id="eventCountdownTitle"></h3><div class="event-countdown-state" id="eventCountdownState"></div><div class="event-countdown" id="eventCountdown">${['天','小时','分钟','秒'].map(unit=>`<div class="event-time"><b>--</b><span>${unit}</span></div>`).join('')}</div><div class="event-date" id="eventCountdownDate"></div></article>
        <article class="event-block"><span class="event-step-no" id="eventBonusStep"></span><h3 id="eventBonusTitle"></h3><div class="event-badges" id="eventBonusBadges"></div><ul class="event-facts" id="eventBonusFacts"></ul></article>
      </div>
      <article class="event-block event-mewtwo-wrap"><span class="event-step-no">03 · 图鉴资料</span><div class="event-mewtwo-profile"><img src="${data.mewtwo.icon}" alt="超梦"><div><h3>${data.mewtwo.title}</h3><div class="event-badges">${data.mewtwo.badges.map((badge,index)=>`<span class="event-badge${index===3?' area':''}">${badge}</span>`).join('')}</div><p class="focus-line">${data.mewtwo.summary}</p></div></div><ul class="event-facts">${data.mewtwo.facts.map(fact=>`<li>${fact}</li>`).join('')}</ul></article>
      <div class="event-plan" id="eventPlans"></div>
      <p class="event-snapshot-note">此页是人工核对的公告快照，不会自动同步新活动；时间与加成请以 <a href="https://www.pokemonsleep.net/news/" target="_blank" rel="noreferrer">官方最新资讯</a>为准。</p>
      <div class="event-sources">官方资料：<a href="${SOURCES.goodSleep39}" target="_blank" rel="noreferrer">第 39 回好眠日</a>、<a href="${SOURCES.mewtwoEvent}" target="_blank" rel="noreferrer">超梦活动与兑换截止</a>、<a href="${SOURCES.cookingWeek3}" target="_blank" rel="noreferrer">大份料理周 vol.3</a>、<a href="${SOURCES.mewtwo}" target="_blank" rel="noreferrer">超梦登场公告</a>。概率与技能等级表为社区研究快照：<a href="${SOURCES.mewtwoResearch}" target="_blank" rel="noreferrer">超梦验证页</a>。</div>`;
    root.dataset.eventViewId='';updateEventCountdown(document,value);return root;
  }

  function updateEventCountdown(document,value=Date.now()){
    if(!document)return null;const state=countdownAt(value),bonus=bonusAt(value),root=document.querySelector('#eventGuide');
    if(!root)return state;
    const viewId=`${state.phase.id}:${bonus.id}`;
    if(root.dataset.eventViewId!==viewId){
      root.dataset.eventViewId=viewId;
      const status=document.querySelector('#currentEventStatus'),link=document.querySelector('#currentEventLink');
      if(status)status.innerHTML=state.phase.status;
      if(link){link.href=state.phase.link;link.textContent=state.phase.linkLabel}
      const title=document.querySelector('#eventCountdownTitle'),date=document.querySelector('#eventCountdownDate'),label=document.querySelector('#eventCountdownState');
      if(title)title.textContent=state.phase.title;if(date)date.textContent=state.phase.date;if(label)label.textContent=state.phase.countdown;
      const bonusStep=document.querySelector('#eventBonusStep'),bonusTitle=document.querySelector('#eventBonusTitle'),badges=document.querySelector('#eventBonusBadges'),facts=document.querySelector('#eventBonusFacts');
      if(bonusStep)bonusStep.textContent=bonus.step;if(bonusTitle)bonusTitle.textContent=bonus.title;
      if(badges)badges.innerHTML=bonus.badges.map((badge,index)=>`<span class="event-badge${index===0?' area':''}">${badge}</span>`).join('');
      if(facts)facts.innerHTML=bonus.facts.map(fact=>`<li>${fact}</li>`).join('');
      const plans=document.querySelector('#eventPlans');
      if(plans)plans.innerHTML=plansAt(value).map((plan,index)=>`<article class="event-block"><span class="event-step-no">${String(index+4).padStart(2,'0')} · 行动提示</span><h3>${plan.title}</h3><ol>${plan.items.map(([itemLabel,copy])=>`<li><strong>${itemLabel}</strong>${copy}</li>`).join('')}</ol></article>`).join('');
    }
    const countdown=document.querySelector('#eventCountdown');
    if(countdown)[...countdown.children].forEach((box,index)=>{const target=box.querySelector('b'),values=[state.days,state.hours,state.minutes,state.seconds];if(target)target.textContent=String(values[index]).padStart(2,'0')});
    return {...state,bonus};
  }

  return Object.freeze({ACTIVITY_PROFILES,SOURCES,EVENT_GUIDE,PHASES,EVENT_BONUSES,phaseAt,countdownAt,bonusAt,plansAt,renderEventGuide,updateEventCountdown});
});
