'use strict';

const assert=require('assert');
const comparison=require('../pokemon-comparison.js');
const planner=require('../team-planner.js');

function mon(overrides={}){
  return {
    id:'1',name:'测试个体',lv:'25',shiny:'否',boxName:'培养候选',specialty:'skill',specialtyLabel:'技能手',
    ingredients:'特选苹果／特选苹果／特选苹果',main:'活力全体疗愈S Lv.1',subs:'技能概率M；帮手奖励；帮忙速度M；持有上限L；睡眠EXP奖励',nature:'慎重',
    scoreBreakdown:{finalFormId:'282',finalFormNameZh:'沙奈朵',specialty:'skill',finalScore:80,speciesScore:84,individualScore:68,individual:{ingredientPattern:'不适用'}},
    minimumStandard:{status:'transition',label:'过渡使用',meetsMinimum:false,meetsGraduation:false,missing:['帮手奖励（正式奶妈毕业必需）'],effectiveGains:['技能概率M'],secondaryGains:[],routePattern:'不适用',courseNote:'',investmentLimit:'过渡投入'},
    cultivation:{tier:'stage',label:'阶段性培养',reason:'可以承担当前回复位。',nextAction:'先培养到关键等级。'},
    ...overrides
  };
}

{
  const graduation=mon({id:'11',name:'毕业面板',scoreBreakdown:{finalFormId:'282',finalFormNameZh:'沙奈朵',specialty:'skill',finalScore:76,speciesScore:84,individualScore:52,individual:{ingredientPattern:'不适用'}},minimumStandard:{status:'graduation',label:'毕业候选',meetsMinimum:true,meetsGraduation:true,missing:[],effectiveGains:['技能概率M','帮手奖励','速度性格'],secondaryGains:[],routePattern:'不适用'}});
  const highScoreTransition=mon({id:'12',name:'高分过渡',scoreBreakdown:{finalFormId:'282',finalFormNameZh:'沙奈朵',specialty:'skill',finalScore:86,speciesScore:84,individualScore:88,individual:{ingredientPattern:'不适用'}}});
  const result=comparison.comparePokemon(graduation,highScoreTransition);
  assert.strictEqual(result.sameFinalForm,true);
  assert.strictEqual(result.leader,'left','同最终形态应先按课程毕业资格比较');
  assert.strictEqual(result.basis,'course');
  assert.match(result.detail,/课程资格优先/);
}

{
  const left=mon({id:'21',name:'个体甲',scoreBreakdown:{finalFormId:'282',finalFormNameZh:'沙奈朵',specialty:'skill',finalScore:78,speciesScore:84,individualScore:60,individual:{ingredientPattern:'不适用'}}});
  const right=mon({id:'22',name:'个体乙',scoreBreakdown:{finalFormId:'282',finalFormNameZh:'沙奈朵',specialty:'skill',finalScore:83,speciesScore:84,individualScore:80,individual:{ingredientPattern:'不适用'}}});
  const result=comparison.comparePokemon(left,right);
  assert.strictEqual(result.leader,'right','课程资格相同时应优先比较个体分');
  assert.strictEqual(result.basis,'individual');
  assert.match(result.detail,/个体分比较/);
}

{
  const skill=mon({id:'31',name:'沙奈朵'});
  const berry=mon({id:'32',name:'雷丘',specialty:'berry',specialtyLabel:'树果手',scoreBreakdown:{finalFormId:'26',finalFormNameZh:'雷丘',specialty:'berry',finalScore:91,speciesScore:96,individualScore:76,individual:{ingredientPattern:'不适用'}}});
  const result=comparison.comparePokemon(skill,berry);
  assert.strictEqual(result.sameFinalForm,false);
  assert.strictEqual(result.leader,'none','不同最终形态不应给出直接胜负');
  assert.match(result.title,/不同最终形态/);
  assert.ok(result.warnings.some(text=>/不能据此直接互相替代/.test(text)));
  assert.match(result.detail,/不能当作直接替换或放生依据/);
}

{
  const rows=comparison.subskillRows(mon({lv:'25'}));
  assert.deepStrictEqual(rows.map(item=>item.level),[10,25,50,70,80]);
  assert.deepStrictEqual(rows.map(item=>item.unlocked),[true,true,false,false,false]);
  assert.strictEqual(rows[0].skill,'技能概率M');
}

{
  const view=comparison.viewModel(mon({scoreTotal:1,scoreSpecies:2,scoreIndividual:3}));
  assert.strictEqual(view.totalScore,80,'对比页必须复用现有 scoreBreakdown，不能另算一套评分');
  assert.strictEqual(view.speciesScore,84);
  assert.strictEqual(view.individualScore,68);
}

{
  const stufful=mon({
    id:'94',name:'童偶熊',lv:'15',interval:'1:06:25',inv:'13',specialty:'ingredient',specialtyLabel:'食材手',
    ingredients:'玉米×2／豆制肉×6／玉米×7',subs:'树果数量S；食材概率S；食材概率M；持有上限S；持有上限M',nature:'浮躁',main:'能量填充S Lv.1'
  });
  const comfey=mon({
    id:'95',name:'花疗环环',lv:'35',interval:'38:50',inv:'27',specialty:'ingredient',specialtyLabel:'食材手',
    ingredients:'玉米×2／玉米×5／可可×7',subs:'持有上限S；技能概率S；帮忙速度S；食材概率S；食材概率M',nature:'马虎：食材↑ 技能↓',main:'活力疗愈S Lv.1'
  });
  assert.deepStrictEqual(comparison.ingredientNames(stufful,planner),['萌绿玉米','豆制肉']);
  const result=comparison.compareProduction(stufful,comfey,'萌绿玉米',{
    teamPlanner:planner,
    production:{byBoxId:{'94':{ingredientRate:.225,baseBerryCount:1},'95':{ingredientRate:.167,baseBerryCount:1}}},
    goodCamp:true,energyProfile:'average',teammateHelpingBonusCount:0
  });
  assert.strictEqual(result.leader,'right');
  assert.match(result.title,/花疗环环.*萌绿玉米/);
  assert.ok(result.right.perDay>result.left.perDay*2,'当前等级下花疗环环的玉米产量应超过童偶熊两倍');
  assert.ok(result.left.lockedSlots.some(item=>item.unlockLevel===60&&item.quantity===7),'童偶熊60级玉米栏应展示为待解锁');
  assert.ok(result.right.unlockedSlots.some(item=>item.unlockLevel===30&&item.quantity===5),'花疗环环30级玉米栏应计入当前产量');
}

console.log('pokemon comparison tests passed');
