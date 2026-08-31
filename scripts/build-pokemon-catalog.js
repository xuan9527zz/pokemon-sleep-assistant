#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const speciesScoring = require('../skills/pokemon-sleep-scoring/scripts/species-scores.js');
const skillSpeciesScoring = require('../skills/pokemon-sleep-scoring/scripts/skill-team-species-scores.js');
const boxScoring = require('../skills/pokemon-sleep-scoring/scripts/box-scores.js');

const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, 'data', 'raenonx-species.json');
const simplifiedPath = path.join(projectRoot, 'data', 'species-name-simplified.json');
const outputPath = path.join(projectRoot, 'pokemon-catalog.generated.js');

const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const records = source.pokemon || source;
const simplifiedNames = fs.existsSync(simplifiedPath)
  ? JSON.parse(fs.readFileSync(simplifiedPath, 'utf8'))
  : {};
const byId = new Map(records.map(record => [String(record.id), record]));
const ingredientNames = Object.freeze({
  1: '粗枝大葱', 2: '品鲜蘑菇', 3: '特选蛋', 4: '窝心洋芋', 5: '特选苹果',
  6: '火辣香草', 7: '豆制肉', 8: '哞哞鲜奶', 9: '甜甜蜜', 10: '纯粹油',
  11: '暖暖姜', 12: '好眠番茄', 13: '放松可可', 14: '美味尾巴', 15: '萌绿大豆',
  16: '萌绿玉米', 17: '醒脑咖啡豆', 18: '沉甸甸南瓜', 19: '嫩亮酪梨'
});

const ingredientRows = speciesScoring.ingredientProductionRows(records);
const berryRows = speciesScoring.berryProductionRows(records);
const skillRows = skillSpeciesScoring.skillTeamSpeciesScoreRows(records, {
  collectionIntervalHours: 4,
  ingredientAvailability: 0.5,
  goodCamp: true
});

const speciesScores = {};
ingredientRows.forEach(row => {
  speciesScores[String(row.id)] = {
    specialty: 'ingredient',
    score: row.speciesScore,
    source: 'ingredient-species-score'
  };
});
berryRows.forEach(row => {
  speciesScores[String(row.id)] = {
    specialty: 'berry',
    score: row.speciesScore,
    source: 'berry-species-score'
  };
});
skillRows.forEach(row => {
  speciesScores[String(row.id)] = {
    specialty: 'skill',
    score: row.finalSpeciesScore,
    source: 'team-calibrated-final-species-score'
  };
});
records.filter(record => record.specialty === 'all' && record.isFinalEvolution).forEach(record => {
  speciesScores[String(record.id)] = {
    specialty: 'all',
    score: null,
    source: 'pending-all-rounder-formula'
  };
});

function finalOptions(id, trail = new Set()) {
  const key = String(id);
  if (trail.has(key)) throw new Error(`Evolution cycle detected at ${key}`);
  const record = byId.get(key);
  if (!record) return [];
  const next = Array.isArray(record.evolution?.next) ? record.evolution.next : [];
  if (record.isFinalEvolution || !next.length) return [key];
  const nextTrail = new Set(trail);
  nextTrail.add(key);
  return [...new Set(next.flatMap(item => finalOptions(item.id, nextTrail)))];
}

function bestFinal(options) {
  return [...options].sort((left, right) => {
    const leftScore = speciesScores[left]?.score;
    const rightScore = speciesScores[right]?.score;
    const leftValue = Number.isFinite(leftScore) ? leftScore : -1;
    const rightValue = Number.isFinite(rightScore) ? rightScore : -1;
    return rightValue - leftValue || String(left).localeCompare(String(right), 'en', { numeric: true });
  })[0] || null;
}

function compactIngredient(option) {
  return {
    id: Number(option.id),
    code: String(option.code || ''),
    quantity: Number(option.quantity || 0),
    name: String(ingredientNames[Number(option.id)] || option.nameZh || option.nameEn || ''),
    nameEn: String(option.nameEn || '')
  };
}

const catalog = records.map(record => {
  const id = String(record.id);
  const options = finalOptions(id);
  return {
    id,
    pokedexId: Number(record.pokedexId),
    name: String(simplifiedNames[id] || record.nameZh || record.nameEn),
    sourceNameZh: String(record.nameZh || ''),
    nameEn: String(record.nameEn || ''),
    specialty: String(record.specialty || 'unknown'),
    typeId: Number(record.typeId),
    berryId: Number(record.berryId),
    baseBerryCount: Number(record.baseBerryCount || 1),
    helpFrequencyBaseSec: Number(record.helpFrequencyBaseSec || 0),
    carryLimitBase: Number(record.carryLimitBase || 0),
    carryLimitRaisedFromFirstStage: Number(record.carryLimitRaisedFromFirstStage || record.carryLimitBase || 0),
    ingredientRate: Number(record.ingredientRate || 0),
    skillRatePct: Number(record.skillRatePct || 0),
    expType: Number(record.expType || 1),
    stage: Number(record.evolution?.stage || 1),
    evolution: {
      stage: Number(record.evolution?.stage || 1),
      stageToFinal: Number(record.evolution?.stageToFinal || 0),
      lineId: String(record.evolution?.lineId || id),
      previous: record.evolution?.previous ? {
        id: String(typeof record.evolution.previous === 'object' ? record.evolution.previous.id : record.evolution.previous),
        conditions: typeof record.evolution.previous === 'object' && Array.isArray(record.evolution.previous.conditions) ? record.evolution.previous.conditions : []
      } : null,
      next: Array.isArray(record.evolution?.next) ? record.evolution.next.map(next => ({
        id: String(next.id),
        conditions: Array.isArray(next.conditions) ? next.conditions : []
      })) : []
    },
    isFinalEvolution: Boolean(record.isFinalEvolution),
    finalOptions: options,
    defaultFinalId: bestFinal(options),
    mainSkill: {
      id: Number(record.mainSkill?.id || 0),
      name: String(record.mainSkill?.nameZh || record.mainSkill?.nameEn || ''),
      nameEn: String(record.mainSkill?.nameEn || '')
    },
    ingredients: {
      1: (record.ingredients?.['1'] || []).map(compactIngredient),
      30: (record.ingredients?.['30'] || []).map(compactIngredient),
      60: (record.ingredients?.['60'] || []).map(compactIngredient)
    }
  };
});

const existingNameTargets = Object.fromEntries(Object.entries(boxScoring.boxFinalForm).map(([name, target]) => [
  name,
  { id: String(target[0]), name: String(target[1]) }
]));

const output = {
  meta: {
    generatedAt: new Date().toISOString(),
    sourceUpdatedAt: source.generatedAt || source.source?.generatedAt || null,
    count: catalog.length,
    speciesScoreCount: Object.keys(speciesScores).length,
    collectionProfile: 'Lv.70; skill species use 4-hour collection, Good Camp, 50% extra-ingredient availability'
  },
  pokemon: catalog,
  speciesScores,
  existingNameTargets
};

const rendered = `(function(root,factory){\n  'use strict';\n  const api=factory();\n  if(typeof module==='object'&&module.exports)module.exports=api;\n  if(root)root.POKEMON_SLEEP_CATALOG=api;\n})(typeof globalThis!=='undefined'?globalThis:this,function(){\n  'use strict';\n  return Object.freeze(${JSON.stringify(output, null, 2)});\n});\n`;

fs.writeFileSync(outputPath, rendered, 'utf8');
process.stdout.write(`${JSON.stringify(output.meta, null, 2)}\n`);
