'use strict';

const assert=require('node:assert/strict');
const retention=require('../retention-advisor.js');

const score=(speciesTier,individualGrade,name='测试宝可梦')=>({speciesTier,individualGrade,individualScore:1.8,individual:{grade:individualGrade},finalFormId:name==='梦幻'?'151':'1',finalFormNameZh:name});
const scoring={scorePokemon:mon=>mon.score};

const core=retention.assessCandidate({name:'普通',shiny:'否',score:score('S','S')},[],scoring);
assert.equal(core.verdict,'核心培养');
const release=retention.assessCandidate({name:'普通',shiny:'否',score:score('C','C')},[],scoring);
assert.equal(release.verdict,'放生');
const shiny=retention.assessCandidate({name:'普通',shiny:'是',score:score('C','C')},[],scoring);
assert.equal(shiny.verdict,'收藏保护');
const limited=retention.assessCandidate({name:'梦幻',speciesId:'151',shiny:'否',score:score('C','C','梦幻')},[],scoring);
assert.equal(limited.verdict,'收藏保护');
const shinyCore=retention.assessCandidate({name:'普通',shiny:'是',score:score('S','S')},[],scoring);
assert.equal(shinyCore.verdict,'核心培养');
assert.match(release.warnings.join(''),/不会自动删除/);

console.log('retention advisor tests passed (cultivation matrix parity)');
