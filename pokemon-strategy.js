(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_STRATEGY=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SOURCE=Object.freeze({
    id:'bilibili-2026-08-17',
    label:'白河夜船_Velpro 2026-08-17 攻略图',
    url:'https://www.bilibili.com/opus/1237353277411033128',
    reviewedAt:'2026-09-01'
  });

  const SELECTION_SOURCE=Object.freeze({
    id:'user-course-screenshots-2026-09-01',
    label:'用户提供的树果／食材／技能型严选课程截图',
    reviewedAt:'2026-09-01'
  });

  const ROLE_RULES=Object.freeze({
    berry:Object.freeze({
      label:'树果手',required:Object.freeze(['树果数量S']),
      primary:Object.freeze(['帮手奖励','帮忙速度M']),secondary:Object.freeze(['帮忙速度S']),
      nature:Object.freeze(['固执','顽皮','勇敢','怕寂寞']),
      minimum:'Lv.50内树果数量S，并至少有帮手奖励、帮忙速度或速度性格之一。',
      graduation:'Lv.50内树果数量S＋帮手奖励，再有帮忙速度M／S或速度性格。'
    }),
    ingredient:Object.freeze({
      label:'食材手',required:Object.freeze(['食材概率M']),
      primary:Object.freeze(['帮手奖励','帮忙速度M','食材概率S']),secondary:Object.freeze(['帮忙速度S']),
      nature:Object.freeze(['马虎','冷静','慢吞吞','内敛','顽皮','勇敢','怕寂寞']),
      minimum:'Lv.50内食材概率M＋至少一个额外有效增益；长期路线须为AAA或已验证物种的ABB。',
      graduation:'Lv.50内食材概率M＋任意两个额外有效增益；帮手奖励是可选增益，不是硬门槛。'
    }),
    skill:Object.freeze({
      label:'普通／常驻技能手',required:Object.freeze(['技能概率M']),
      primary:Object.freeze(['帮手奖励','帮忙速度M','技能概率S']),secondary:Object.freeze(['帮忙速度S']),
      nature:Object.freeze(['慎重','自大','温顺','温和','固执','勇敢','怕寂寞']),
      minimum:'Lv.50内技能概率M＋至少一个额外有效增益；普通易抓个体仍应继续追三有效面板。',
      graduation:'Lv.50内技能概率M＋任意两个额外有效增益；帮手奖励不是硬门槛。'
    }),
    healer:Object.freeze({
      label:'正式群回奶妈',required:Object.freeze(['技能概率M','帮手奖励']),
      primary:Object.freeze(['帮手奖励','帮忙速度M','技能概率S']),secondary:Object.freeze(['帮忙速度S']),
      nature:Object.freeze(['慎重','自大','温顺','温和','固执','勇敢','怕寂寞']),
      minimum:'Lv.50内技能概率M＋帮手奖励＋一个额外个人增益，才符合正式奶妈毕业线。',
      graduation:'Lv.50内技能概率M＋帮手奖励＋帮忙速度M、技能概率S或有效性格之一。'
    }),
    toolSkill:Object.freeze({
      label:'短驻场工具技能手',required:Object.freeze(['技能概率M']),
      primary:Object.freeze(['帮手奖励','帮忙速度M','技能概率S']),secondary:Object.freeze(['帮忙速度S']),
      nature:Object.freeze(['慎重','自大','温顺','温和','固执','勇敢','怕寂寞']),
      minimum:'Lv.50内技能概率M＋至少一个额外有效增益；工具位通常触发数次后下场。',
      graduation:'Lv.50内技能概率M＋任意两个额外有效增益；帮手奖励不是硬门槛。'
    }),
    berrySkill:Object.freeze({
      label:'树果定位技能手',required:Object.freeze(['树果数量S']),
      primary:Object.freeze(['帮手奖励','帮忙速度M']),secondary:Object.freeze(['帮忙速度S']),
      nature:Object.freeze(['固执','顽皮','勇敢','怕寂寞']),
      minimum:'作为长期树果位时，Lv.50内必须有树果数量S，并至少具备帮手奖励或个人速度之一。',
      graduation:'Lv.50内树果数量S＋帮手奖励＋个人速度；技能概率不能替代树果位的个人速度。'
    })
  });

  // Strategic adjustment never replaces the mechanical species score. It only
  // fills a bounded part of a verified role gap. A role with an already healthy
  // mechanical score receives no automatic bonus.
  const SPECIES_ROLES=Object.freeze({
    '330':Object.freeze({name:'沙漠蜻蜓',stage:'required',role:'高阶酪梨专职',ingredient:'嫩亮酪梨',rank:'best',scorePolicy:Object.freeze({targetFloor:75,maxBonus:8,value:100}),reason:'当前食材手中最稳定的酪梨专职；酪梨同时进入两道1.78高系数料理。'}),
    '454':Object.freeze({name:'毒骷蛙',stage:'required',role:'纯粹油专职',ingredient:'纯粹油',rank:'best',scorePolicy:Object.freeze({targetFloor:70,maxBonus:8,value:96}),reason:'纯油岗位的高效率专职；纯粹油进入多道高系数料理。'}),
    '845':Object.freeze({name:'古月鸟',stage:'optional',role:'纯油兼料理功能',ingredient:'纯粹油',rank:'alternative',scorePolicy:Object.freeze({targetFloor:64,maxBonus:6,value:78}),reason:'机械食材底盘偏低，但同时补纯油与料理功能，不能只按AAA基础产量判断。'}),
    '980':Object.freeze({name:'土王',stage:'required',role:'可可替代专职',ingredient:'放松可可',rank:'alternative',scorePolicy:Object.freeze({targetFloor:68,maxBonus:4,value:76}),reason:'水箭龟之外的可可覆盖位，适合补齐高系数点心的可可缺口。'}),
    '83':Object.freeze({name:'大葱鸭',stage:'optional',role:'粗枝大葱补位',ingredient:'粗枝大葱',rank:'alternative',scorePolicy:Object.freeze({targetFloor:63,maxBonus:5,value:70}),reason:'大葱专项补位；机械分低时仍保留明确食谱岗位。'}),
    '242':Object.freeze({name:'幸福蛋',stage:'forming',role:'特选蛋专职',ingredient:'特选蛋',rank:'primary',scorePolicy:Object.freeze({targetFloor:72,maxBonus:2,value:75}),reason:'特选蛋是多道高系数料理的高需求原料。'}),
    '760':Object.freeze({name:'穿着熊',stage:'required',role:'萌绿玉米专职',ingredient:'萌绿玉米',rank:'primary',reason:'玉米长期岗位；当前机械分已能表达其基础价值，不额外加分。'}),
    '908':Object.freeze({name:'魔幻假面喵',stage:'forming',role:'窝心洋芋专职',ingredient:'窝心洋芋',rank:'primary',reason:'土豆岗位明确，但现有机械种族分已经处于可培养区间，不额外补正。'}),
    '975':Object.freeze({name:'浩大鲸',stage:'forming',role:'窝心洋芋替代',ingredient:'窝心洋芋',rank:'alternative',reason:'土豆替代路线；现有机械种族分已经足够，不额外补正。'}),
    '3':Object.freeze({name:'妙蛙花',stage:'required',role:'甜甜蜜专职',ingredient:'甜甜蜜',rank:'primary',reason:'高阶甜甜蜜岗位。'}),
    '9':Object.freeze({name:'水箭龟',stage:'required',role:'鲜奶／可可核心',ingredient:'哞哞鲜奶',rank:'primary',reason:'鲜奶核心，同时可承担可可路线。'}),
    '149':Object.freeze({name:'快龙',stage:'required',role:'火辣香草专职',ingredient:'火辣香草',rank:'primary',reason:'长期香草准神路线。'}),
    '76':Object.freeze({name:'隆隆岩',stage:'required',role:'萌绿大豆专职',ingredient:'萌绿大豆',rank:'primary',reason:'大豆主要供给路线之一。'}),
    '914':Object.freeze({name:'狂欢浪舞鸭',stage:'required',role:'萌绿大豆替代',ingredient:'萌绿大豆',rank:'alternative',reason:'大豆替代供给路线。'}),
    '6':Object.freeze({name:'喷火龙',stage:'required',role:'豆制肉专职',ingredient:'豆制肉',rank:'primary',reason:'豆制肉主要供给路线之一。'}),
    '306':Object.freeze({name:'波士可多拉',stage:'required',role:'豆制肉／咖啡路线',ingredient:'豆制肉',rank:'primary',reason:'肉位核心，并可补咖啡。'}),
    '248':Object.freeze({name:'班基拉斯',stage:'required',role:'暖暖姜专职',ingredient:'暖暖姜',rank:'primary',reason:'长期暖暖姜准神路线。'})
  });

  const ISLAND_TARGETS=Object.freeze({
    '萌绿之岛':Object.freeze(['282','3','9','242','908','975']),
    '萌绿之岛 EX':Object.freeze(['282','3','9','242','908','975']),
    '天青沙滩':Object.freeze(['160','959','628']),
    '天青沙滩 EX':Object.freeze(['160','959','628']),
    '灰褐洞窟':Object.freeze(['157','697','260','38']),
    '白花雪原':Object.freeze(['7007','365']),
    '宝蓝湖畔':Object.freeze(['154','254','392','282']),
    '黄金旧发电厂':Object.freeze(['26','395']),
    '黄金发电厂':Object.freeze(['26','395']),
    '琥珀溪谷':Object.freeze(['373','149','330'])
  });

  const ISLAND_ROLE_NOTES=Object.freeze({
    '160':'天青沙滩主力树果手','959':'天青及天青EX妖精树果主力','628':'天青长期树果骤增方向',
    '157':'灰褐洞窟主力树果手','697':'灰褐洞窟岩石树果方向','260':'灰褐洞窟次线树果选择','38':'灰褐洞窟次线树果选择',
    '7007':'白花雪原冰树果主力','365':'白花雪原（四岛）主力树果手',
    '154':'宝蓝湖畔主力树果手','254':'宝蓝长期树果骤增方向','392':'宝蓝长期树果骤增方向','282':'长期正式回复手',
    '26':'黄金旧发电厂主力树果手','395':'黄金旧发电厂次线树果选择',
    '373':'琥珀溪谷主力树果手','149':'长期香草食材核心','330':'高阶酪梨专职'
  });

  const BERRY_SKILL_IDS=new Set(['254','381','392','628','778']);
  const HEALER_IDS=new Set(['40','213','282','389','488','700','923']);
  const INGREDIENT_ABB_GRADUATION_IDS=new Set(['149','248','405']);
  const DIFFICULT_HUNT_GAUGE=Object.freeze({'702':16});
  const DIRECT_ENERGY_BERRY_SUBSTITUTE_IDS=new Set(['181','196','491','715']);
  const TOOL_SKILL_PATTERN=/料理成功|料理强化|梦之碎片获取|梦碎获取|波导弹/;
  const INGREDIENT_NATURES=new Set(['马虎','冷静','慢吞吞']);
  const INGREDIENT_SPEED_NATURES=new Set(['内敛','顽皮','勇敢','怕寂寞']);
  const SKILL_NATURES=new Set(['慎重','自大','温顺']);
  const SKILL_SPEED_NATURES=new Set(['温和','固执','勇敢','怕寂寞']);
  const BERRY_SPEED_NATURES=new Set(['固执','顽皮','勇敢','怕寂寞']);
  const INGREDIENT_NAME_ALIASES=Object.freeze({
    '蜂蜜':'甜甜蜜','苹果':'特选苹果','牛奶':'哞哞鲜奶','可可':'放松可可','大豆':'萌绿大豆',
    '玉米':'萌绿玉米','大葱':'粗枝大葱','马铃薯':'窝心洋芋','青色果实':'嫩亮酪梨',
    '储存油':'纯粹油','蛋':'特选蛋','咖啡':'醒脑咖啡','番茄':'好眠番茄'
  });
  const LEVELS=Object.freeze([10,25,50,70,80]);
  const normalizeSkill=value=>String(value||'').replace('食材概率提升','食材概率').replace('技能概率提升','技能概率');
  const skillSource=mon=>String(mon&&(
    mon.effectiveSubs||mon.effectiveSubskills||mon.subs||mon.subskills
  )||'');
  const skillsAt=(mon,maxLevel=50)=>skillSource(mon).split('；').map(normalizeSkill).filter((skill,index)=>skill&&skill!=='—'&&LEVELS[index]<=maxLevel);
  const natureName=mon=>String(mon&&mon.nature||'').split(/[：:]/)[0].trim();
  const mainSkillText=mon=>{
    const value=mon&&(
      mon.main||mon.mainSkill||mon.scoreBreakdown&&mon.scoreBreakdown.mainSkill
    );
    return typeof value==='object'&&value?String(value.name||value.nameZh||''):String(value||'');
  };
  const isFormalHealer=(id,mon)=>HEALER_IDS.has(String(id))||/活力全体疗愈|新月祈祷/.test(mainSkillText(mon));
  const isToolSkill=mon=>TOOL_SKILL_PATTERN.test(mainSkillText(mon));
  const normalizeIngredientName=value=>INGREDIENT_NAME_ALIASES[String(value||'').trim()]||String(value||'').trim();
  const ingredientNames=mon=>String(mon&&mon.ingredients||'').split('／').map(value=>normalizeIngredientName(value.replace(/×[\d.]+$/,'').trim())).filter(Boolean);
  const addGain=(list,condition,label)=>{if(condition&&!list.includes(label))list.push(label)};
  const ingredientPattern=mon=>{
    const explicit=mon&&(
      mon.ingredientPattern||mon.scoreBreakdown&&mon.scoreBreakdown.individual&&mon.scoreBreakdown.individual.ingredientPattern
    );
    if(explicit&&explicit!=='不适用')return String(explicit);
    const names=ingredientNames(mon);
    if(names.length<3)return '未知';
    if(names[0]===names[1]&&names[1]===names[2])return 'AAA';
    if(names[0]!==names[1]&&names[1]===names[2])return 'ABB';
    if(names[0]===names[1]&&names[1]!==names[2])return 'AAX';
    if(names[0]===names[2]&&names[0]!==names[1])return 'ABA';
    return 'ABC';
  };
  const routeClass=(id,pattern)=>{
    if(pattern==='AAA')return 'long-term';
    if(pattern==='ABB')return INGREDIENT_ABB_GRADUATION_IDS.has(String(id))?'verified-abb':'review-abb';
    if(['AAB','AAC','AAX'].includes(pattern))return 'lv30-worker';
    return 'unverified';
  };

  function gainList(mon,skills,role){
    const gains=[],nature=natureName(mon);
    addGain(gains,skills.includes('帮手奖励'),'帮手奖励');
    addGain(gains,skills.includes('帮忙速度M'),'帮忙速度M');
    if(role==='ingredient'){
      addGain(gains,skills.includes('食材概率M')&&skills.includes('食材概率S'),'食材概率S');
      addGain(gains,INGREDIENT_NATURES.has(nature),'食材概率性格');
      addGain(gains,INGREDIENT_SPEED_NATURES.has(nature),'速度性格');
    }else if(role==='skill'||role==='healer'||role==='toolSkill'){
      addGain(gains,skills.includes('技能概率M')&&skills.includes('技能概率S'),'技能概率S');
      addGain(gains,SKILL_NATURES.has(nature),'技能概率性格');
      addGain(gains,SKILL_SPEED_NATURES.has(nature),'速度性格');
    }
    return gains;
  }

  function strategicAdjustment(id,mechanicalScore){
    const profile=SPECIES_ROLES[String(id)]||null,base=Number(mechanicalScore);
    if(!Number.isFinite(base)||!profile||!profile.scorePolicy)return {mechanicalScore:base,strategicRoleScore:profile&&profile.scorePolicy?profile.scorePolicy.value:null,strategicBonus:0,adjustedScore:base,profile};
    const policy=profile.scorePolicy,bonus=Math.max(0,Math.min(Number(policy.maxBonus)||0,(Number(policy.targetFloor)||base)-base));
    return {mechanicalScore:Math.round(base*10)/10,strategicRoleScore:Number(policy.value),strategicBonus:Math.round(bonus*10)/10,adjustedScore:Math.round(Math.min(100,base+bonus)*10)/10,profile};
  }

  function ruleFor(finalId,specialty,mon){
    if(BERRY_SKILL_IDS.has(String(finalId)))return ROLE_RULES.berrySkill;
    if(specialty==='skill'&&isFormalHealer(finalId,mon))return ROLE_RULES.healer;
    if(specialty==='skill'&&isToolSkill(mon))return ROLE_RULES.toolSkill;
    return ROLE_RULES[specialty]||null;
  }

  function minimumStandard(mon,{finalId,specialty,strategicProfile}={}){
    const id=String(finalId||mon&&mon.finalFormId||mon&&mon.scoreBreakdown&&mon.scoreBreakdown.finalFormId||''),specialtyRole=specialty||mon&&mon.specialty||mon&&mon.scoreBreakdown&&mon.scoreBreakdown.specialty,rule=ruleFor(id,specialtyRole,mon);
    if(!rule)return {status:'manual',label:'人工判断',meetsMinimum:false,meetsGraduation:false,rule:null,missing:['评分定位尚未完成'],source:SELECTION_SOURCE};
    const skills=skillsAt(mon,50),skills25=skillsAt(mon,25),profile=strategicProfile||SPECIES_ROLES[id]||null,routeMatch=!profile||!profile.ingredient||ingredientNames(mon).includes(normalizeIngredientName(profile.ingredient)),missing=[];
    let status='pass',meetsMinimum=false,meetsGraduation=false,roleKind=specialtyRole,effectiveGains=[],secondaryGains=[],routePattern='不适用',routeStatus='not-applicable',investmentLimit='',courseNote='';

    if(rule===ROLE_RULES.berry||rule===ROLE_RULES.berrySkill){
      roleKind='berry-position';
      const core=skills.includes('树果数量S'),helpingBonus=skills.includes('帮手奖励'),personalSpeed=[];
      addGain(personalSpeed,skills.includes('帮忙速度M'),'帮忙速度M');
      addGain(personalSpeed,skills.includes('帮忙速度S'),'帮忙速度S');
      addGain(personalSpeed,BERRY_SPEED_NATURES.has(natureName(mon)),'速度性格');
      effectiveGains=[...(helpingBonus?['帮手奖励']:[]),...personalSpeed];
      meetsMinimum=core&&(helpingBonus||personalSpeed.length>0);
      meetsGraduation=core&&helpingBonus&&personalSpeed.length>0;
      status=meetsGraduation?'graduation':meetsMinimum?'keep':core||effectiveGains.length?'borderline':'pass';
      if(!core)missing.push('树果数量S');
      if(!helpingBonus)missing.push('帮手奖励（长期毕业）');
      if(!personalSpeed.length)missing.push('个人速度（帮忙速度M／S或有效速度性格）');
      courseNote=rule===ROLE_RULES.berrySkill?'树果骤增在树果位按树果手标准判断，技能概率不能替代个人速度。':'';
    }else if(specialtyRole==='ingredient'){
      roleKind='ingredient';
      const core=skills.includes('食材概率M');
      effectiveGains=gainList(mon,skills,'ingredient');
      secondaryGains=skills.includes('帮忙速度S')?['帮忙速度S（次级，不计毕业主增益）']:[];
      routePattern=ingredientPattern(mon);routeStatus=routeClass(id,routePattern);
      const longTermRoute=['long-term','verified-abb'].includes(routeStatus),workerRoute=routeStatus==='lv30-worker',workerMinimum=core&&effectiveGains.length>=1&&workerRoute&&routeMatch;
      meetsMinimum=(core&&effectiveGains.length>=1&&longTermRoute&&routeMatch)||workerMinimum;
      meetsGraduation=core&&effectiveGains.length>=2&&longTermRoute&&routeMatch;
      if(meetsGraduation)status='graduation';
      else if(workerMinimum)status='worker';
      else if(meetsMinimum)status='keep';
      else if(routeStatus==='review-abb'&&core)status='route-review';
      else status=core||effectiveGains.length?'borderline':'pass';
      if(!core)missing.push('食材概率M（Lv.50内）');
      if(effectiveGains.length<2)missing.push(`额外有效增益还差 ${2-effectiveGains.length} 项`);
      if(!routeMatch)missing.push(`${profile.ingredient}路线`);
      if(workerRoute){missing.push('长期AAA或已验证ABB路线');investmentLimit='Lv.59';courseNote=`${routePattern}仅按Lv.30打工路线保留，不建议解锁Lv.60错误食材。`;}
      else if(routeStatus==='review-abb'){missing.push('该物种ABB的产量验证');courseNote='ABB只在物种产量接近AAA且能快速升到Lv.60时毕业。';}
      else if(routeStatus==='unverified'){missing.push('AAA或已验证ABB路线');courseNote='课程未把该路线列为长期毕业路线，先按过渡处理。';}
      else if(routeStatus==='verified-abb')courseNote='该物种属于课程举例的ABB例外，仍需满足三有效面板并承担Lv.60成本。';
    }else{
      const healer=rule===ROLE_RULES.healer,tool=rule===ROLE_RULES.toolSkill,core=skills.includes('技能概率M'),helpingBonus=skills.includes('帮手奖励');
      roleKind=healer?'formal-healer':tool?'tool-skill':'skill';
      effectiveGains=gainList(mon,skills,healer?'healer':tool?'toolSkill':'skill');
      secondaryGains=skills.includes('帮忙速度S')?['帮忙速度S（次级，不计毕业主增益）']:[];
      if(healer){
        const personalGains=effectiveGains.filter(value=>value!=='帮手奖励'),gains25=gainList(mon,skills25,'healer'),core25=skills25.includes('技能概率M');
        meetsGraduation=core&&helpingBonus&&personalGains.length>=1;
        meetsMinimum=meetsGraduation;
        status=meetsGraduation?'graduation':core25&&gains25.length>=1?'transition':core||effectiveGains.length?'borderline':'pass';
        if(!core)missing.push('技能概率M（Lv.50内）');
        if(!helpingBonus)missing.push('帮手奖励（正式奶妈毕业必需）');
        if(!personalGains.length)missing.push('另一个个人有效增益');
        if(status==='transition'){investmentLimit='过渡投入';courseNote='Lv.25内技能概率M＋一个增益可作过渡奶，但没有帮手奖励不能作为正式毕业奶妈。';}
      }else{
        meetsGraduation=core&&effectiveGains.length>=2;
        const compromise=Boolean(!meetsGraduation&&DIFFICULT_HUNT_GAUGE[id]&&core&&effectiveGains.length>=1);
        meetsMinimum=meetsGraduation||compromise;
        status=meetsGraduation?'graduation':compromise?'compromise':core&&effectiveGains.length>=1?'transition':core||effectiveGains.length?'borderline':'pass';
        if(!core)missing.push('技能概率M（Lv.50内）');
        if(effectiveGains.length<2)missing.push(`额外有效增益还差 ${2-effectiveGains.length} 项`);
        if(compromise)courseNote=`${DIFFICULT_HUNT_GAUGE[id]}格稀有个体按课程可从两有效面板和解起步，但不等于毕业。`;
        else if(status==='transition')courseNote='两有效面板只作起步／过渡；普通易抓技能手应继续追三有效面板。';
        if(tool)courseNote=[courseNote,'工具技能手通常触发数次后下场，帮手奖励不是毕业硬门槛。'].filter(Boolean).join(' ');
      }
      if(DIRECT_ENERGY_BERRY_SUBSTITUTE_IDS.has(id))courseNote=[courseNote,'直接能量技能手仅作二线树果替代，不建议只为树果位专门严选。'].filter(Boolean).join(' ');
    }
    const labels={graduation:'毕业候选',keep:'达到入盒线',worker:'Lv.30打工',transition:'过渡使用',compromise:'高捕获格和解起步','route-review':'ABB待验证',borderline:'边缘保留',pass:'继续严选'};
    return {status,label:labels[status]||'人工判断',meetsMinimum,meetsGraduation,rule,skills,skills25,routeMatch,routePattern,routeStatus,roleKind,effectiveGains,secondaryGains,investmentLimit,courseNote,missing:[...new Set(missing)],profile,healer:roleKind==='formal-healer',source:SELECTION_SOURCE};
  }

  function targetsForIsland(name){
    return [...(ISLAND_TARGETS[String(name)]||[])].map(id=>({id,note:ISLAND_ROLE_NOTES[id]||SPECIES_ROLES[id]?.role||'攻略推荐岗位',profile:SPECIES_ROLES[id]||null}));
  }

  function islandRolesForSpecies(id){
    const key=String(id),roles=[];
    Object.entries(ISLAND_TARGETS).forEach(([island,ids])=>{if(ids.includes(key))roles.push({island,note:ISLAND_ROLE_NOTES[key]||SPECIES_ROLES[key]?.role||'攻略推荐岗位'})});
    return roles;
  }

  return Object.freeze({SOURCE,SELECTION_SOURCE,ROLE_RULES,SPECIES_ROLES,ISLAND_TARGETS,ISLAND_ROLE_NOTES,BERRY_SKILL_IDS,HEALER_IDS,INGREDIENT_ABB_GRADUATION_IDS,DIRECT_ENERGY_BERRY_SUBSTITUTE_IDS,strategicAdjustment,ruleFor,minimumStandard,targetsForIsland,islandRolesForSpecies});
});
