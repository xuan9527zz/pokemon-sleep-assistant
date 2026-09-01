'use strict';

const assert = require('node:assert/strict');
const retention = require('../retention-advisor.js');

const scores = {
  candidate:{finalScore:72,speciesScore:70,individualScore:78,finalFormId:'3',specialty:'ingredient'},
  old:{finalScore:68,speciesScore:70,individualScore:62,finalFormId:'3',specialty:'ingredient'},
  roleBest:{finalScore:85,speciesScore:85,individualScore:85,finalFormId:'9',specialty:'ingredient'},
  weak:{finalScore:24,speciesScore:30,individualScore:20,finalFormId:'3',specialty:'ingredient'},
  same1:{finalScore:90,speciesScore:75,individualScore:95,finalFormId:'25',finalFormNameZh:'雷丘',specialty:'berry'},
  same2:{finalScore:80,speciesScore:75,individualScore:75,finalFormId:'25',finalFormNameZh:'雷丘',specialty:'berry'},
  same3:{finalScore:70,speciesScore:75,individualScore:55,finalFormId:'25',finalFormNameZh:'雷丘',specialty:'berry'},
  same4:{finalScore:60,speciesScore:75,individualScore:35,finalFormId:'25',finalFormNameZh:'雷丘',specialty:'berry'},
  same5:{finalScore:50,speciesScore:75,individualScore:15,finalFormId:'25',finalFormNameZh:'雷丘',specialty:'berry'},
  suicune1:{finalScore:80,speciesScore:78,individualScore:86,finalFormId:'245',finalFormNameZh:'水君',specialty:'skill'},
  suicune2:{finalScore:70,speciesScore:78,individualScore:46,finalFormId:'245',finalFormNameZh:'水君',specialty:'skill'}
};
const scoring={scorePokemon:mon=>scores[mon.key]};
const candidate={id:'new',recordId:'new',key:'candidate',shiny:'否'},old={id:'1',recordId:'old',key:'old',shiny:'否'},roleBest={id:'2',recordId:'role',key:'roleBest',shiny:'否'};
const strong=retention.assessCandidate(candidate,[old,roleBest],scoring);
assert.equal(strong.verdict,'替换候选');
assert.equal(strong.sameSpecies.rank,1);

const weak={id:'3',recordId:'weak',key:'weak',shiny:'否'};
const release=retention.assessCandidate(weak,[old,roleBest],scoring);
assert.equal(release.verdict,'放生候选');
const shiny=retention.assessCandidate({...weak,id:'4',recordId:'shiny',shiny:'是'},[old],scoring);
assert.equal(shiny.verdict,'闪光收藏');

const ordinaryRows=['same1','same2','same3','same4'].map((key,index)=>({id:`r${index}`,recordId:`r${index}`,key,name:'雷丘',shiny:'否'}));
const fifth=retention.assessCandidate({id:'r5',recordId:'r5',key:'same5',name:'雷丘',shiny:'否'},ordinaryRows,scoring);
assert.equal(fifth.sameSpecies.rank,5);
assert.equal(fifth.retentionLimit,4);
assert.equal(fifth.exceedsLimit,true);
assert.equal(fifth.verdict,'放生候选');

const secondSpecial=retention.assessCandidate({id:'s2',recordId:'s2',key:'suicune2',name:'水君',shiny:'否'},[{id:'s1',recordId:'s1',key:'suicune1',name:'水君',shiny:'否'}],scoring);
assert.equal(secondSpecial.sameSpecies.rank,2);
assert.equal(secondSpecial.retentionLimit,1);
assert.equal(secondSpecial.verdict,'放生候选');
const shinySpecial=retention.assessCandidate({id:'s3',recordId:'s3',key:'suicune2',name:'水君',shiny:'是'},[{id:'s1',recordId:'s1',key:'suicune1',name:'水君',shiny:'否'}],scoring);
assert.equal(shinySpecial.verdict,'闪光收藏');

const flygonStrategy={role:'高阶酪梨专职',ingredient:'嫩亮酪梨'};
const strategicScores=Object.fromEntries(['f1','f2','f3','f4','f5'].map((key,index)=>[key,{finalScore:90-index*5,speciesScore:75,individualScore:90-index*8,finalFormId:'330',finalFormNameZh:'沙漠蜻蜓',specialty:'ingredient',strategy:flygonStrategy}]));
const strategicScoring={scorePokemon:mon=>strategicScores[mon.key]};
const otherFlygons=['f1','f2','f3','f4'].map((key,index)=>({id:key,recordId:key,key,name:'沙漠蜻蜓',shiny:'否',ingredients:'特选苹果×2／特选苹果×5／特选苹果×7',subs:'食材概率M；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'}));
const avocadoFlygon={id:'f5',recordId:'f5',key:'f5',name:'沙漠蜻蜓',shiny:'否',ingredients:'嫩亮酪梨×2／嫩亮酪梨×5／嫩亮酪梨×7',subs:'食材概率M；帮手奖励；帮忙速度M；研究EXP奖励；睡眠EXP奖励',nature:'认真'};
const strategicGuard=retention.assessCandidate(avocadoFlygon,otherFlygons,strategicScoring);
assert.equal(strategicGuard.exceedsLimit,true);
assert.equal(strategicGuard.uniqueStrategicRoute,true);
assert.equal(strategicGuard.verdict,'战略岗位复核');

console.log('retention advisor tests passed');
