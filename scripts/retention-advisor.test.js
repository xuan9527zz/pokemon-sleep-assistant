'use strict';

const assert = require('node:assert/strict');
const retention = require('../retention-advisor.js');

const scores = {
  candidate:{finalScore:72,speciesScore:70,individualScore:78,finalFormId:'3',specialty:'ingredient'},
  old:{finalScore:68,speciesScore:70,individualScore:62,finalFormId:'3',specialty:'ingredient'},
  roleBest:{finalScore:85,speciesScore:85,individualScore:85,finalFormId:'9',specialty:'ingredient'},
  weak:{finalScore:24,speciesScore:30,individualScore:20,finalFormId:'3',specialty:'ingredient'}
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
console.log('retention advisor tests passed');
