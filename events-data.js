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
    cooking150:Object.freeze({label:'料理能量＋50%',carryBonus:0,cookingEnergyMultiplier:1.5,note:'活动料理能量＋50%；完整推演会把倍率计入每餐能量。',defaultMealGoal:15}),
    cookingWeek3:Object.freeze({label:'大份料理周 vol.3（已结束）',startsAt:'2026-10-05T04:00:00+09:00',endsAt:'2026-10-12T04:00:00+09:00',carryBonus:0,potCapacityMultiplier:2,sundayPotCapacityMultiplier:4,cookingEnergyMultiplier:1.25,ingredientSpecialistHelpBonus:1,skillIngredientMultiplier:1.5,dishEnergyRecoveryBonus:5,note:'历史档案：全部岛屿；工作日锅 ×2、周日锅 ×4，料理最终能量 ×1.25，食材手普通食材＋1，技能食材数量 ×1.5，三餐回复各额外＋5。',defaultMealGoal:21,archived:true}),
    mealPrep1:Object.freeze({label:'备料周 vol.1（已结束）',startsAt:'2026-11-09T04:00:00+09:00',endsAt:'2026-11-16T04:00:00+09:00',cookingEnergyMultiplier:1.25,note:'历史档案：全部岛屿；料理能量 ×1.25 已计入。食材专长及食材精选 S 的睡眠研究糖果、梦之碎片 ×1.5，迷你糖果增强和出现率仅作公告展示。',defaultMealGoal:21,archived:true}),
    banquet1:Object.freeze({label:'来什么都吃光光！大餐周 vol.1',startsAt:'2026-11-16T04:00:00+09:00',endsAt:'2026-11-23T04:00:00+09:00',allDishes:true,potCapacityFlatBonus:30,ingredientSpecialistHelpBonus:1,ingredientSpecialistCarryBonus:10,extraIngredientOnIngredientHelp:'一口坚果',extraIngredientAmount:1,bonusRecipeIngredient:'一口坚果',bonusRecipeEnergyMultiplier:1.5,extraNutEnergyMultiplier:1.5,note:'全部岛屿；所有料理类别可制作，食材手每次食材帮忙原食材＋1、另得一口坚果×1且持有上限＋10；锅容量＋30。含坚果配方的指定食材能量 ×1.5；额外填锅坚果的能量尚未计入推演。',defaultMealGoal:21})
  });

  const SOURCES=Object.freeze({
    goodSleep39:'https://www.pokemonsleep.net/news/343430323231373034343933343635363034/',
    cookingWeek3:'https://www.pokemonsleep.net/en/news/343430323735323936303334323236313832/',
    halloween2026:'https://www.pokemonsleep.net/zh/news/343433383634343334323138313036383834/',
    mealPrep1:'https://www.pokemonsleep.net/zh/news/343537333139333632303937383430313332/',
    banquet1:'https://www.pokemonsleep.net/zh/news/343537333535313639333033313031343531/',
    goodSleep41:'https://www.pokemonsleep.net/zh/news/343537373035343036333435353130393133/',
    mewtwoEvent:'https://www.pokemonsleep.net/en/news/343239383235333132393938353535363534/',
    mewtwo:'https://www.pokemonsleep.net/en/news/343333373536323134383333313834373731/',
    mewtwoResearch:'https://wikiwiki.jp/poke_sleep/%E3%83%9F%E3%83%A5%E3%82%A6%E3%83%84%E3%83%BC'
  });

  const EVENT_GUIDE=Object.freeze({
    updatedAt:'2026-11-16',
    title:'近期活动｜当前加成与下一场',
    intro:'按游戏内 04:00 切换活动日；这里是人工核对的公告快照，不会自动获取新公告。',
    current:Object.freeze({
      title:'来什么都吃光光！大餐周 vol.1',
      date:'11 月 16 日 04:00—11 月 23 日 03:59 · 全部岛屿'
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
      Object.freeze({id:'cooking-prep',title:'下期预告｜料理周',items:Object.freeze([['10 月 5 日 04:00 开始：','全部岛屿举办料理周；先备好高容量料理与对应食材，活动周可在个人设置中选“大份料理周 vol.3”推演。'],['模型边界：','迷你糖果加速与睡眠研究出现率只作公告展示；随机技能食材尚不能分配给指定食谱。']])}),
      Object.freeze({id:'cooking',title:'料理周进行中',items:Object.freeze([['料理与食材：','工作日锅容量 ×2，周日 ×4；料理最终能量 ×1.25，食材手普通帮忙食材＋1。'],['本周作战：','选择“大份料理周 vol.3”后会计入技能食材 ×1.5 和三餐活力额外＋5；随机技能食材仍不虚构成指定食材库存。'],['糖果与研究：','迷你糖果加速的经验 ×2、碎片消耗 ×4、每日最多 50 颗，以及研究出现率变化只在这里展示，不折算为卡比兽能量。']])}),
      Object.freeze({id:'halloween2026',title:'万圣节 2026（已结束）',items:Object.freeze([['10 月 26 日—11 月 2 日：','幽灵系帮忙食材＋1、技能率 ×1.25、技能等级＋3，睡眠研究糖果加倍；相关活动现已结束。']])}),
      Object.freeze({id:'meal-prep1',title:'备料周 vol.1',items:Object.freeze([['11 月 9 日—16 日：','料理能量 ×1.25；食材手及食材精选 S 的研究糖果、梦之碎片 ×1.5。'],['睡姿目标：','已新增 570 种睡姿目标；达成后可继续永久扩锅。']])}),
      Object.freeze({id:'banquet1',title:'本周行动｜大餐周',items:Object.freeze([['料理：','本周所有类别都可做；一口坚果配方的指定食材能量 ×1.5，额外填入的坚果能量 ×1.5。'],['食材与锅：','食材手每次食材帮忙原食材＋1、另得坚果×1，持有上限＋10；锅容量＋30。'],['本周作战：','在个人设置选“活动周”和“大餐周 vol.1”后，可推演已建模的食材、锅与配方加成；额外填锅食材仍单独提示。']])}),
      Object.freeze({id:'good-sleep41',title:'第 41 次好眠日',items:Object.freeze([['11 月 23 日—26 日：','梦幻有特别出现加成；11 月 24 日满月夜睡意之力 ×3、帮手睡眠 EXP ×3、睡眠点数＋1000。'],['前后夜：','睡意之力 ×1.5、帮手睡眠 EXP ×2、睡眠点数＋500。只对活动期间开始测量的睡眠生效。']])}),
      Object.freeze({id:'permanent',title:'超梦后续培养',items:Object.freeze([['图鉴已并入：','新建或导入超梦个体后，会读取技能手面板与你指定的幻之／传说 B 梯级。'],['组队思路：','可在本周作战台的可选“树果领域”模型中安排超梦先上场、叠层后换成芒芒果产手。']])})
    ])
  });

  const PHASES=Object.freeze([
    Object.freeze({id:'before',until:'2026-09-26T04:00:00+09:00',title:'第 39 回好眠日',date:EVENT_GUIDE.current.date,countdown:'距离好眠日开始',status:'<b>即将开始：</b>第 39 回好眠日将在 9 月 26 日 04:00 开始。',link:SOURCES.goodSleep39,linkLabel:'好眠日公告'}),
    Object.freeze({id:'good-sleep',until:'2026-09-29T04:00:00+09:00',title:'第 39 回好眠日',date:EVENT_GUIDE.current.date,countdown:'好眠日进行中 · 距离结束',status:'<b>当前：</b>第 39 回好眠日进行中；加成按活动日切换。',link:SOURCES.goodSleep39,linkLabel:'好眠日公告'}),
    Object.freeze({id:'exchange',until:'2026-10-01T04:00:00+09:00',title:'超梦兑换所',date:'截至 10 月 1 日 03:59',countdown:'距超梦兑换所关闭',status:'<b>收尾：</b>好眠日已结束；超梦活动兑换所仍开放至 10 月 1 日 03:59。',link:SOURCES.mewtwoEvent,linkLabel:'超梦兑换说明'}),
    Object.freeze({id:'conversion',until:'2026-10-03T19:00:00+09:00',title:'超梦饼干转换',date:'10 月 3 日 19:00 自动转换',countdown:'距超梦饼干转换',status:'<b>提醒：</b>超梦兑换所已关闭；剩余超梦饼干将在 10 月 3 日 19:00 转为超级沙布蕾。',link:SOURCES.mewtwoEvent,linkLabel:'转换说明'}),
    Object.freeze({id:'cooking-before',until:'2026-10-05T04:00:00+09:00',title:'大份料理周 vol.3',date:'10 月 5 日 04:00—10 月 12 日 03:59 · 全部岛屿',countdown:'距离料理周开始',status:'<b>下期预告：</b>料理周将于 10 月 5 日 04:00 开始；当前尚无料理周加成。',link:SOURCES.cookingWeek3,linkLabel:'料理周公告'}),
    Object.freeze({id:'cooking',until:'2026-10-12T04:00:00+09:00',title:'大份料理周 vol.3',date:'10 月 5 日 04:00—10 月 12 日 03:59 · 全部岛屿',countdown:'料理周进行中 · 距离结束',status:'<b>当前：</b>料理周进行中；在个人设置选择活动周及“大份料理周 vol.3”即可推演已建模加成。',link:SOURCES.cookingWeek3,linkLabel:'料理周公告'}),
    Object.freeze({id:'october-next',until:'2026-10-26T04:00:00+09:00',title:'万圣节 2026',date:'10 月 26 日 04:00—11 月 2 日 03:59 · 萌绿之岛及 EX',countdown:'距离万圣节活动开始',status:'<b>下期预告：</b>万圣节活动尚未开始；当前不套用万圣节加成。',link:SOURCES.halloween2026,linkLabel:'万圣节公告'}),
    Object.freeze({id:'halloween',until:'2026-11-02T04:00:00+09:00',title:'万圣节 2026',date:'10 月 26 日 04:00—11 月 2 日 03:59 · 萌绿之岛及 EX',countdown:'万圣节活动进行中 · 距离结束',status:'<b>当前：</b>万圣节活动进行中；幽灵系专属加成仅限活动营地。',link:SOURCES.halloween2026,linkLabel:'万圣节公告'}),
    Object.freeze({id:'meal-prep-before',until:'2026-11-09T04:00:00+09:00',title:'备料周 vol.1',date:'11 月 9 日 04:00—11 月 16 日 03:59 · 全部岛屿',countdown:'距离备料周开始',status:'<b>下期预告：</b>备料周即将开始；当前没有备料周加成。',link:SOURCES.mealPrep1,linkLabel:'备料周公告'}),
    Object.freeze({id:'meal-prep',until:'2026-11-16T04:00:00+09:00',title:'备料周 vol.1',date:'11 月 9 日 04:00—11 月 16 日 03:59 · 全部岛屿',countdown:'备料周进行中 · 距离结束',status:'<b>当前：</b>备料周进行中；料理能量 ×1.25，研究糖果、梦之碎片加成请看公告。',link:SOURCES.mealPrep1,linkLabel:'备料周公告'}),
    Object.freeze({id:'banquet',until:'2026-11-23T04:00:00+09:00',title:EVENT_GUIDE.current.title,date:EVENT_GUIDE.current.date,countdown:'大餐周进行中 · 距离结束',status:'<b>当前：</b>大餐周进行中；个人设置选择活动周及“大餐周 vol.1”即可推演坚果配方与食材加成。',link:SOURCES.banquet1,linkLabel:'大餐周公告'}),
    Object.freeze({id:'good-sleep41',until:'2026-11-26T04:00:00+09:00',title:'第 41 次好眠日',date:'11 月 23 日 04:00—11 月 26 日 03:59 · 全部岛屿',countdown:'好眠日进行中 · 距离结束',status:'<b>当前：</b>第 41 次好眠日进行中；满月夜与前后夜加成不同，梦幻有特别出现加成。',link:SOURCES.goodSleep41,linkLabel:'好眠日公告'}),
    Object.freeze({id:'ended',until:null,title:'公告快照待更新',date:'当前快照覆盖至 11 月 26 日 03:59',countdown:'已收录的活动已结束',status:'<b>资料提示：</b>已收录活动均已结束；此页不会自动获取新公告，请核对官方最新资讯。',link:'https://www.pokemonsleep.net/zh/news/',linkLabel:'查看官方最新资讯'})
  ]);

  const EVENT_BONUSES=Object.freeze([
    Object.freeze({id:'sleep-first',start:'2026-09-26T04:00:00+09:00',until:'2026-09-27T04:00:00+09:00',title:'9 月 26 日｜满月前一夜',badges:Object.freeze(['全部岛屿','睡意之力 ×1.5','帮手睡眠 EXP ×2','睡眠点数＋500']),facts:Object.freeze(['睡眠研究中更易遇见未登录的睡姿；皮宝宝进化系有机会闪光出现。','游戏内活动日从 04:00 开始；加成只适用于活动期间开始的睡眠测量。'])}),
    Object.freeze({id:'sleep-full',start:'2026-09-27T04:00:00+09:00',until:'2026-09-28T04:00:00+09:00',title:'9 月 27 日｜满月夜',badges:Object.freeze(['全部岛屿','睡意之力 ×2','帮手睡眠 EXP ×3','睡眠点数＋1000']),facts:Object.freeze(['满月夜加成高于前后夜；皮宝宝进化系出现率上升。','游戏内活动日从 04:00 开始；加成只适用于活动期间开始的睡眠测量。'])}),
    Object.freeze({id:'sleep-last',start:'2026-09-28T04:00:00+09:00',until:'2026-09-29T04:00:00+09:00',title:'9 月 28 日｜满月后一夜',badges:Object.freeze(['全部岛屿','睡意之力 ×1.5','帮手睡眠 EXP ×2','睡眠点数＋500']),facts:Object.freeze(['睡眠研究中更易遇见未登录的睡姿；皮宝宝进化系有机会闪光出现。','9 月 27 日满月夜的 ×2、EXP ×3 与＋1000 点不再适用。'])}),
    Object.freeze({id:'cooking-normal',start:'2026-10-05T04:00:00+09:00',until:'2026-10-11T04:00:00+09:00',title:'料理周｜普通活动日',badges:Object.freeze(['全部岛屿','锅容量 ×2','料理最终能量 ×1.25','食材手食材＋1']),facts:Object.freeze(['料理回复活力额外＋5；食材类主技能带来的食材数量 ×1.5。','周日活动日锅容量改为 ×4；本周作战台可选活动档案推演。'])}),
    Object.freeze({id:'cooking-sunday',start:'2026-10-11T04:00:00+09:00',until:'2026-10-12T04:00:00+09:00',title:'10 月 11 日｜料理周周日',badges:Object.freeze(['全部岛屿','锅容量 ×4','料理最终能量 ×1.25','食材手食材＋1']),facts:Object.freeze(['料理回复活力额外＋5；食材类主技能带来的食材数量 ×1.5。','大成功最终能量为 ×3.75；本周作战台可选活动档案推演。'])}),
    Object.freeze({id:'halloween2026',start:'2026-10-26T04:00:00+09:00',until:'2026-11-02T04:00:00+09:00',title:'万圣节 2026',badges:Object.freeze(['萌绿之岛及 EX','幽灵系食材＋1','幽灵系技能率 ×1.25','技能等级＋3']),facts:Object.freeze(['首次睡眠研究糖果通常 ×2；10 月 31 日与 11 月 1 日 ×3。','本活动是历史展示，没有放入可计算的整周活动档案。'])}),
    Object.freeze({id:'meal-prep1',start:'2026-11-09T04:00:00+09:00',until:'2026-11-16T04:00:00+09:00',title:'备料周 vol.1',badges:Object.freeze(['全部岛屿','料理能量 ×1.25','特定研究糖果／碎片 ×1.5']),facts:Object.freeze(['食材专长及食材精选 S 的研究奖励提高；迷你糖果增强可用。','糖果、梦之碎片和出现率不折算成卡比兽能量。'])}),
    Object.freeze({id:'banquet1',start:'2026-11-16T04:00:00+09:00',until:'2026-11-23T04:00:00+09:00',title:'大餐周 vol.1',badges:Object.freeze(['全部岛屿','所有料理类别','锅容量＋30','坚果配方指定食材 ×1.5']),facts:Object.freeze(['食材手每次食材帮忙原食材＋1、另得一口坚果×1，持有上限＋10。','额外填锅的坚果能量 ×1.5；当前推演仍不计额外填锅食材。'])}),
    Object.freeze({id:'good-sleep41-first',start:'2026-11-23T04:00:00+09:00',until:'2026-11-24T04:00:00+09:00',title:'11 月 23 日｜满月前一夜',badges:Object.freeze(['全部岛屿','睡意之力 ×1.5','帮手睡眠 EXP ×2','睡眠点数＋500']),facts:Object.freeze(['梦幻有特别出现加成；只在当日第一次睡眠研究中可能出现。'])}),
    Object.freeze({id:'good-sleep41-full',start:'2026-11-24T04:00:00+09:00',until:'2026-11-25T04:00:00+09:00',title:'11 月 24 日｜满月夜',badges:Object.freeze(['全部岛屿','睡意之力 ×3','帮手睡眠 EXP ×3','睡眠点数＋1000']),facts:Object.freeze(['梦幻有特别出现加成；满月夜倍率高于前后夜。'])}),
    Object.freeze({id:'good-sleep41-last',start:'2026-11-25T04:00:00+09:00',until:'2026-11-26T04:00:00+09:00',title:'11 月 25 日｜满月后一夜',badges:Object.freeze(['全部岛屿','睡意之力 ×1.5','帮手睡眠 EXP ×2','睡眠点数＋500']),facts:Object.freeze(['梦幻有特别出现加成；只对活动期间开始测量的睡眠生效。'])})
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
    if(['exchange','conversion','cooking-before'].includes(phase.id))return {id:'cooking-upcoming',step:'02 · 下期预告',title:'10 月 5 日｜大份料理周 vol.3',badges:['全部岛屿','锅容量 ×2 · 周日 ×4','料理最终能量 ×1.25'],facts:['10 月 5 日 04:00 前没有料理周加成。','可在个人设置选活动周与“大份料理周 vol.3”预先推演；不会自动修改当前周模式。']};
    if(phase.id==='october-next')return {id:'halloween-upcoming',step:'02 · 下期预告',title:'万圣节 2026 即将开始',badges:['10 月 26 日 04:00 开始'],facts:['幽灵系加成只在活动营地、活动期间生效。']};
    if(phase.id==='meal-prep-before')return {id:'meal-prep-upcoming',step:'02 · 下期预告',title:'备料周 vol.1 即将开始',badges:['11 月 9 日 04:00 开始'],facts:['料理 ×1.25 与研究奖励在活动开始后才生效。']};
    return {id:'snapshot-ended',step:'02 · 快照状态',title:'已收录活动均已结束',badges:['请核对官方最新公告'],facts:[`本页公告快照更新于 ${EVENT_GUIDE.updatedAt}；不会自动发现后来公布的活动。`]};
  }

  function plansAt(value=Date.now()){
    const id=phaseAt(value).id,visible={before:['sleep','exchange','cooking-prep','permanent'],'good-sleep':['sleep','exchange','cooking-prep','permanent'],exchange:['exchange','cooking-prep','permanent'],conversion:['conversion','cooking-prep','permanent'],'cooking-before':['cooking-prep','permanent'],cooking:['cooking','permanent'],'october-next':['halloween2026','meal-prep1'],'halloween':['halloween2026','meal-prep1'],'meal-prep-before':['meal-prep1','banquet1'],'meal-prep':['meal-prep1','banquet1'],banquet:['banquet1','good-sleep41'],'good-sleep41':['good-sleep41'],ended:['good-sleep41']}[id]||[];
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
      <div class="event-plan" id="eventPlans"></div>
      <p class="event-snapshot-note">此页是人工核对的公告快照，不会自动同步新活动；时间与加成请以 <a href="https://www.pokemonsleep.net/zh/news/" target="_blank" rel="noreferrer">官方最新资讯</a>为准。</p>
      <div class="event-sources">官方资料：<a href="${SOURCES.halloween2026}" target="_blank" rel="noreferrer">万圣节 2026</a>、<a href="${SOURCES.mealPrep1}" target="_blank" rel="noreferrer">备料周 vol.1</a>、<a href="${SOURCES.banquet1}" target="_blank" rel="noreferrer">大餐周 vol.1</a>、<a href="${SOURCES.goodSleep41}" target="_blank" rel="noreferrer">第 41 次好眠日</a>。</div>`;
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
