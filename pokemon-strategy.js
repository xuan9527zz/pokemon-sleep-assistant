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
      minimum:'Lv.50内食材概率M（或可合法升级的S）＋一个主增益，食材路线能承担目标岗位。',
      graduation:'Lv.50内本职概率＋帮手奖励＋另一主增益；成熟账号长期优先AAA。'
    }),
    skill:Object.freeze({
      label:'技能手',required:Object.freeze(['技能概率M']),
      primary:Object.freeze(['帮手奖励','帮忙速度M','技能概率S']),secondary:Object.freeze(['帮忙速度S']),
      nature:Object.freeze(['慎重','自大','温顺','温和','固执','勇敢','怕寂寞']),
      minimum:'Lv.50内技能概率M（或可合法升级的S）＋一个主增益。',
      graduation:'Lv.50内本职概率＋帮手奖励＋另一主增益；回复手优先追求帮手奖励。'
    }),
    berrySkill:Object.freeze({
      label:'树果定位技能手',required:Object.freeze(['树果数量S']),
      primary:Object.freeze(['帮手奖励','帮忙速度M','技能概率M']),secondary:Object.freeze(['帮忙速度S']),
      nature:Object.freeze(['固执','勇敢','怕寂寞','慎重','自大','温顺']),
      minimum:'Lv.50内树果数量S，并至少有帮手奖励、速度或技能概率增益之一。',
      graduation:'Lv.50内树果数量S＋帮手奖励，再有帮忙速度或技能概率M。'
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

  const BERRY_SKILL_IDS=new Set(['254','392','628']);
  const HEALER_IDS=new Set(['282','389','923','40','700']);
  const LEVELS=Object.freeze([10,25,50,70,80]);
  const normalizeSkill=value=>String(value||'').replace('食材概率提升','食材概率').replace('技能概率提升','技能概率');
  const skillsAt50=mon=>String(mon&&mon.effectiveSubs||mon&&mon.subs||'').split('；').map(normalizeSkill).filter((skill,index)=>skill&&skill!=='—'&&LEVELS[index]<=50);
  const hasPositiveNature=(mon,role)=>{
    const value=String(mon&&mon.nature||'');
    if(value.includes('速度↑'))return true;
    if(role==='ingredient'&&value.includes('食材↑'))return true;
    if(role==='skill'&&value.includes('技能↑'))return true;
    return false;
  };
  const hasSeedableCore=(skills,prefix)=>skills.includes(`${prefix}M`)||(!skills.includes(`${prefix}M`)&&skills.includes(`${prefix}S`));

  function strategicAdjustment(id,mechanicalScore){
    const profile=SPECIES_ROLES[String(id)]||null,base=Number(mechanicalScore);
    if(!Number.isFinite(base)||!profile||!profile.scorePolicy)return {mechanicalScore:base,strategicRoleScore:profile&&profile.scorePolicy?profile.scorePolicy.value:null,strategicBonus:0,adjustedScore:base,profile};
    const policy=profile.scorePolicy,bonus=Math.max(0,Math.min(Number(policy.maxBonus)||0,(Number(policy.targetFloor)||base)-base));
    return {mechanicalScore:Math.round(base*10)/10,strategicRoleScore:Number(policy.value),strategicBonus:Math.round(bonus*10)/10,adjustedScore:Math.round(Math.min(100,base+bonus)*10)/10,profile};
  }

  function ruleFor(finalId,specialty){
    if(BERRY_SKILL_IDS.has(String(finalId)))return ROLE_RULES.berrySkill;
    return ROLE_RULES[specialty]||null;
  }

  function minimumStandard(mon,{finalId,specialty,strategicProfile}={}){
    const id=String(finalId||mon&&mon.finalFormId||mon&&mon.scoreBreakdown&&mon.scoreBreakdown.finalFormId||''),role=specialty||mon&&mon.specialty||mon&&mon.scoreBreakdown&&mon.scoreBreakdown.specialty,rule=ruleFor(id,role);
    if(!rule)return {status:'manual',label:'人工判断',meetsMinimum:false,meetsGraduation:false,rule:null,missing:['评分定位尚未完成']};
    const skills=skillsAt50(mon),speed=skills.some(skill=>['帮忙速度M','帮忙速度S'].includes(skill))||hasPositiveNature(mon,role),helpingBonus=skills.includes('帮手奖励');
    let core=false,boosts=[];
    if(rule===ROLE_RULES.berry||rule===ROLE_RULES.berrySkill){
      core=skills.includes('树果数量S');
      boosts=[helpingBonus,speed,rule===ROLE_RULES.berrySkill&&hasSeedableCore(skills,'技能概率')].filter(Boolean);
    }else if(role==='ingredient'){
      core=hasSeedableCore(skills,'食材概率');
      boosts=[helpingBonus,speed,skills.includes('食材概率S')&&skills.includes('食材概率M')].filter(Boolean);
    }else{
      core=hasSeedableCore(skills,'技能概率');
      boosts=[helpingBonus,speed,skills.includes('技能概率S')&&skills.includes('技能概率M')].filter(Boolean);
    }
    const profile=strategicProfile||SPECIES_ROLES[id]||null,routeMatch=!profile||!profile.ingredient||String(mon&&mon.ingredients||'').includes(profile.ingredient),meetsMinimum=core&&boosts.length>=1&&routeMatch,meetsGraduation=core&&helpingBonus&&boosts.length>=2&&routeMatch;
    const missing=[];
    if(!core)missing.push(rule.required[0]);
    if(!helpingBonus)missing.push('帮手奖励（毕业）');
    if(!speed&&boosts.length<1)missing.push('帮忙速度／对应概率主增益');
    if(!routeMatch)missing.push(`${profile.ingredient}路线`);
    const status=meetsGraduation?'graduation':meetsMinimum?'keep':core||boosts.length?'borderline':'pass';
    const labels={graduation:'毕业候选',keep:'达到入盒线',borderline:'边缘保留',pass:'继续严选'};
    return {status,label:labels[status],meetsMinimum,meetsGraduation,rule,skills,routeMatch,missing:[...new Set(missing)],profile,healer:HEALER_IDS.has(id)};
  }

  function targetsForIsland(name){
    return [...(ISLAND_TARGETS[String(name)]||[])].map(id=>({id,note:ISLAND_ROLE_NOTES[id]||SPECIES_ROLES[id]?.role||'攻略推荐岗位',profile:SPECIES_ROLES[id]||null}));
  }

  function islandRolesForSpecies(id){
    const key=String(id),roles=[];
    Object.entries(ISLAND_TARGETS).forEach(([island,ids])=>{if(ids.includes(key))roles.push({island,note:ISLAND_ROLE_NOTES[key]||SPECIES_ROLES[key]?.role||'攻略推荐岗位'})});
    return roles;
  }

  return Object.freeze({SOURCE,ROLE_RULES,SPECIES_ROLES,ISLAND_TARGETS,ISLAND_ROLE_NOTES,strategicAdjustment,ruleFor,minimumStandard,targetsForIsland,islandRolesForSpecies});
});
