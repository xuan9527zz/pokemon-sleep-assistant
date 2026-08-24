#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const natureScoring = require('./nature-scores.js');
const speciesScoring = require('./species-scores.js');
const skillSpeciesScoring = require('./skill-team-species-scores.js');

const TARGET_LEVEL = 70;
const SPECIES_WEIGHT = 0.5;
const INDIVIDUAL_WEIGHT = 0.5;
const SUBSKILL_WEIGHT = 0.7;
const NATURE_WEIGHT = 0.3;
const NATURE_POSITIVE_BENCHMARK = 55.6;
const SLOT_LEVELS = Object.freeze([10, 25, 50, 70, 80]);
const SLOT_WEIGHTS = Object.freeze([0.25, 0.25, 0.25, 0.15, 0.10]);
const INGREDIENT_PATTERN_COEFFICIENTS = Object.freeze({
  AAA: 1,
  ABB: 0.85,
  ABA: 0.80,
  AAB: 0.70,
  AAC: 0.70,
  ABC: 0.50
});

const SUBSKILL_UPGRADE_FAMILIES = Object.freeze([
  Object.freeze(['帮忙速度S', '帮忙速度M']),
  Object.freeze(['食材概率S', '食材概率M']),
  Object.freeze(['技能概率S', '技能概率M']),
  Object.freeze(['技能等级S', '技能等级M']),
  Object.freeze(['持有上限S', '持有上限M', '持有上限L'])
]);

// Confirmed values come from scoring-rules.md. The remaining values are explicit
// provisional bridges so the user's box can be ranked before those low-impact
// secondary cases receive their own mechanism model.
const SUBSKILL_FIT = Object.freeze({
  berry: Object.freeze({
    '树果数量S': [100, 'confirmed'],
    '帮手奖励': [75, 'confirmed'],
    '帮忙速度M': [47, 'confirmed'],
    '帮忙速度S': [22, 'confirmed'],
    '技能概率M': [30, 'provisional'],
    '技能概率S': [15, 'provisional'],
    '技能等级M': [8, 'provisional'],
    '技能等级S': [4, 'provisional'],
    '持有上限L': [8, 'provisional'],
    '持有上限M': [5, 'provisional'],
    '持有上限S': [3, 'provisional']
  }),
  ingredient: Object.freeze({
    '树果数量S': [25, 'provisional'],
    '食材概率M': [100, 'confirmed'],
    '食材概率S': [50, 'confirmed'],
    '帮手奖励': [75, 'confirmed'],
    '帮忙速度M': [45, 'confirmed'],
    '帮忙速度S': [21, 'confirmed'],
    '技能概率M': [25, 'provisional'],
    '技能概率S': [12.5, 'provisional'],
    '技能等级M': [8, 'provisional'],
    '技能等级S': [4, 'provisional'],
    '持有上限L': [25, 'provisional'],
    '持有上限M': [12, 'provisional'],
    '持有上限S': [6, 'provisional']
  }),
  skill: Object.freeze({
    '树果数量S': [10, 'provisional'],
    '食材概率M': [0, 'confirmed-not-applicable-before-cap'],
    '食材概率S': [0, 'confirmed-not-applicable-before-cap'],
    '技能概率M': [100, 'confirmed'],
    '技能概率S': [50, 'confirmed'],
    '帮手奖励': [75, 'confirmed'],
    '帮忙速度M': [45, 'confirmed'],
    '帮忙速度S': [21, 'confirmed'],
    '技能等级M': [8, 'confirmed'],
    '技能等级S': [4, 'confirmed'],
    '持有上限L': [0, 'confirmed-no-separate-individual-score'],
    '持有上限M': [0, 'confirmed-no-separate-individual-score'],
    '持有上限S': [0, 'confirmed-no-separate-individual-score']
  })
});

const RESOURCE_SUBSKILL_FIT = Object.freeze({
  '睡眠EXP奖励': [20, 'confirmed'],
  '活力恢复奖励': [12, 'confirmed'],
  '梦之碎片奖励': [10, 'confirmed'],
  '研究EXP奖励': [8, 'confirmed'],
  '—': [0, 'not-present']
});

const HELP_SPEED_REDUCTION = Object.freeze({
  '帮忙速度S': 0.07,
  '帮忙速度M': 0.14
});
const PROBABILITY_BOOST = Object.freeze({
  '食材概率S': 0.18,
  '食材概率M': 0.36,
  '技能概率S': 0.18,
  '技能概率M': 0.36
});

const BOX_FINAL_FORM = Object.freeze({
  '巴大蝶': ['12', '巴大蝶'],
  '冰伊布': ['471', '冰伊布'],
  '波克基斯': ['468', '波克基斯'],
  '草苗龟': ['389', '土台龟'],
  '达克莱伊': ['491', '达克莱伊'],
  '大葱鸭': ['83', '大葱鸭'],
  '大食花': ['71', '大食花'],
  '呆呆王': ['199', '呆呆王'],
  '戴鲁比': ['229', '黑鲁加'],
  '帝牙海狮': ['365', '帝牙海狮'],
  '电龙': ['181', '电龙'],
  '咚咚鼠': ['702', '咚咚鼠'],
  '风速狗': ['59', '风速狗'],
  '古月鸟': ['845', '古月鸟'],
  '骨纹巨声鳄': ['911', '骨纹巨声鳄'],
  '鬼斯': ['94', '耿鬼'],
  '果然翁': ['202', '果然翁'],
  '海豹球': ['365', '帝牙海狮'],
  '海豹球（节日）': ['9006', '海豹球（佳节）'],
  '猴怪': ['57', '火暴猴'],
  '花疗环环': ['764', '花疗环环'],
  '火爆兽': ['157', '火爆兽'],
  '火稚鸡': ['257', '火焰鸡'],
  '杰尼龟': ['9', '水箭龟'],
  '卡拉卡拉': ['105', '嘎啦嘎啦'],
  '凯罗斯': ['127', '凯罗斯'],
  '可达鸭': ['55', '哥达鸭'],
  '可可多拉': ['306', '波士可多拉'],
  '克雷色利亚': ['488', '克雷色利亚'],
  '快龙': ['149', '快龙'],
  '拉达': ['20', '拉达'],
  '拉帝欧斯': ['381', '拉帝欧斯'],
  '拉帝亚斯': ['380', '拉帝亚斯'],
  '蓝鳄': ['160', '大力鳄'],
  '雷公': ['243', '雷公'],
  '雷丘': ['26', '雷丘'],
  '隆隆岩': ['76', '隆隆岩'],
  '玛狃拉': ['461', '玛狃拉'],
  '毛头小鹰': ['628', '勇士雄鹰'],
  '梦幻': ['151', '梦幻'],
  '妙蛙花': ['3', '妙蛙花'],
  '魔墙人偶': ['122', '魔墙人偶'],
  '胖丁': ['40', '胖可丁'],
  '胖可丁': ['40', '胖可丁'],
  '皮宝宝': ['36', '皮可西'],
  '皮卡丘（圣诞）': ['9002', '皮卡丘（佳节）'],
  '皮卡丘（巫师帽）': ['9001-1', '皮卡丘（巫师帽）'],
  '飘飘球': ['426', '随风球'],
  '七夕青鸟': ['334', '七夕青鸟'],
  '奇鲁莉安': ['282', '沙奈朵'],
  '三合一磁怪': ['462', '自爆磁怪'],
  '森林蜥蜴': ['254', '蜥蜴王'],
  '沙基拉斯': ['248', '班基拉斯'],
  '沙漠蜻蜓': ['330', '沙漠蜻蜓'],
  '沙奈朵': ['282', '沙奈朵'],
  '树才怪': ['185', '树才怪'],
  '摔角鹰人': ['701', '摔角鹰人'],
  '水箭龟': ['9', '水箭龟'],
  '水君': ['245', '水君'],
  '水伊布': ['134', '水伊布'],
  '太阳伊布': ['196', '太阳伊布'],
  '童偶熊': ['760', '穿着熊'],
  '吞食兽': ['317', '吞食兽'],
  '乌波（城都）': ['195', '沼王'],
  '乌波（帕底亚）': ['980', '土王'],
  '蜥蜴王': ['254', '蜥蜴王'],
  '仙子伊布': ['700', '仙子伊布'],
  '小磁怪': ['462', '自爆磁怪'],
  '雪笠怪': ['460', '暴雪王'],
  '炎帝': ['244', '炎帝'],
  '伊布（圣诞）': ['9004', '伊布（佳节）'],
  '伊布（万圣节）': ['9005', '伊布（万圣节）'],
  '勇士雄鹰': ['628', '勇士雄鹰'],
  '幼基拉斯': ['248', '班基拉斯'],
  '沼跃鱼': ['260', '巨沼怪'],
  '自爆磁怪': ['462', '自爆磁怪']
});

const EEVEE_ROUTE_IDS = Object.freeze([
  ['134', '水伊布'],
  ['135', '雷伊布'],
  ['136', '火伊布'],
  ['196', '太阳伊布'],
  ['197', '月亮伊布'],
  ['470', '叶伊布'],
  ['471', '冰伊布'],
  ['700', '仙子伊布']
]);

function round(value, digits = 1) {
  const scale = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * scale) / scale;
}

function clamp(value, minimum = 0, maximum = 100) {
  return Math.min(maximum, Math.max(minimum, value));
}

function option(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function parseBoxRows(html) {
  const match = html.match(/const raw=`([\s\S]*?)`;/);
  if (!match) throw new Error('index.html中没有找到盒子原始数据');
  const columns = [
    'id', 'name', 'sp', 'level', 'shiny', 'ingredients', 'interval', 'carry',
    'mainSkill', 'subskills', 'nature', 'priority', 'note'
  ];
  return match[1].trim().split(/\r?\n/).map(line => {
    const values = line.split('|');
    return Object.fromEntries(columns.map((column, index) => [column, values[index] || '']));
  });
}

function seedMaximizedSubskills(skills) {
  const slots = skills.map(skill => ({
    skill,
    scoredSkill: skill,
    seedUpgraded: false,
    seedNote: ''
  }));
  for (const family of SUBSKILL_UPGRADE_FAMILIES) {
    const members = slots.map((slot, index) => ({
      slot,
      index,
      rank: family.indexOf(slot.skill)
    })).filter(member => member.rank >= 0).sort((left, right) => left.rank - right.rank);
    if (!members.length) continue;
    const firstTargetRank = family.length - members.length;
    members.forEach((member, order) => {
      const targetSkill = family[firstTargetRank + order];
      member.slot.scoredSkill = targetSkill;
      member.slot.seedUpgraded = targetSkill !== member.slot.skill;
      if (member.slot.seedUpgraded) member.slot.seedNote = '按副技能种子最高合法形态计分';
    });
    if (members.length > 1) {
      members.forEach(member => {
        member.slot.seedNote = [member.slot.seedNote, '同系技能分别占位并叠加'].filter(Boolean).join('；');
      });
    }
  }
  return slots;
}

function ingredientPattern(ingredients) {
  const names = String(ingredients).split('／').map(slot => slot.replace(/×\d+$/, '').trim());
  const letters = new Map();
  let next = 0;
  return names.map(name => {
    if (!letters.has(name)) letters.set(name, String.fromCharCode(65 + next++));
    return letters.get(name);
  }).join('');
}

function subskillFit(role, skill, finalRecord) {
  if (Object.hasOwn(RESOURCE_SUBSKILL_FIT, skill)) {
    const [score, status] = RESOURCE_SUBSKILL_FIT[skill];
    return { score, status };
  }
  if (role === 'berry' && (skill === '食材概率M' || skill === '食材概率S')) {
    const probabilityBoost = PROBABILITY_BOOST[skill];
    const p = Number(finalRecord.ingredientRate);
    const score = -(p * probabilityBoost / (1 - p)) / 0.5 * 100;
    return { score: round(score), status: 'confirmed-dynamic-negative' };
  }
  const entry = SUBSKILL_FIT[role]?.[skill];
  if (!entry) return { score: 0, status: 'provisional-unlisted-zero' };
  return { score: entry[0], status: entry[1] };
}

function interactionBonus(role, slots, finalRecord) {
  const relevant = [];
  const speedEffects = [];
  let speedReduction = 0;
  let probabilityBoost = 0;
  let berryFinding = 0;
  slots.forEach((slot, index) => {
    const speed = HELP_SPEED_REDUCTION[slot.scoredSkill] || 0;
    if (speed) {
      speedReduction += speed;
      speedEffects.push(speed / (1 - speed));
      relevant.push(index);
    }
    const isRoleProbability = (
      (role === 'ingredient' && slot.scoredSkill.startsWith('食材概率'))
      || (role === 'skill' && slot.scoredSkill.startsWith('技能概率'))
      || (role === 'berry' && slot.scoredSkill.startsWith('食材概率'))
    );
    if (isRoleProbability) {
      probabilityBoost += PROBABILITY_BOOST[slot.scoredSkill] || 0;
      relevant.push(index);
    }
    if (role === 'berry' && slot.scoredSkill === '树果数量S') {
      berryFinding = 1;
      relevant.push(index);
    }
  });
  if (relevant.length < 2) return { score: 0, slotIndex: null, multiplier: 1 };

  let multiplier;
  let separateEffect;
  let scale;
  if (role === 'berry') {
    const p = Number(finalRecord.ingredientRate);
    multiplier = (
      1 / (1 - speedReduction)
      * (1 - p * (1 + probabilityBoost)) / (1 - p)
      * (1 + berryFinding * 0.5)
    );
    separateEffect = (
      speedEffects.reduce((sum, value) => sum + value, 0)
      - p * probabilityBoost / (1 - p)
      + berryFinding * 0.5
    );
    scale = 200;
  } else {
    multiplier = (1 + probabilityBoost) / (1 - speedReduction);
    separateEffect = probabilityBoost + speedEffects.reduce((sum, value) => sum + value, 0);
    scale = 277.78;
  }
  const synergyEffect = multiplier - 1 - separateEffect;
  return {
    score: round(synergyEffect * scale),
    slotIndex: Math.max(...relevant),
    multiplier: round(multiplier, 4)
  };
}

function individualScore(box, role, finalRecord) {
  if (!['berry', 'ingredient', 'skill'].includes(role)) return null;
  const rawSkills = box.subskills.split('；');
  const slots = seedMaximizedSubskills(rawSkills);
  const interaction = interactionBonus(role, slots, finalRecord);
  const scoredSlots = slots.map((slot, index) => {
    const fit = subskillFit(role, slot.scoredSkill, finalRecord);
    const interactionScore = interaction.slotIndex === index ? interaction.score : 0;
    const effectiveFit = fit.score + interactionScore;
    return {
      level: SLOT_LEVELS[index],
      weight: SLOT_WEIGHTS[index],
      ...slot,
      fitScore: round(fit.score),
      fitStatus: fit.status,
      interactionScore: round(interactionScore),
      effectiveFitScore: round(effectiveFit),
      contribution: round(effectiveFit * SLOT_WEIGHTS[index])
    };
  });
  const subskillRawBeforeClamp = scoredSlots.reduce((sum, slot) => sum + slot.contribution, 0);
  const subskillRaw = round(clamp(subskillRawBeforeClamp));
  const subskillContribution = round(subskillRaw * SUBSKILL_WEIGHT);
  const natureRaw = natureScoring.scoreNatureText(role, box.nature, box.name);
  const natureContribution = round(clamp(
    natureRaw / NATURE_POSITIVE_BENCHMARK * NATURE_WEIGHT * 100,
    -NATURE_WEIGHT * 100,
    NATURE_WEIGHT * 100
  ));
  const individualBeforePattern = round(clamp(subskillContribution + natureContribution));
  const pattern = role === 'ingredient' ? ingredientPattern(box.ingredients) : '不适用';
  const patternCoefficient = role === 'ingredient'
    ? (INGREDIENT_PATTERN_COEFFICIENTS[pattern] ?? INGREDIENT_PATTERN_COEFFICIENTS.ABC)
    : 1;
  const score = round(individualBeforePattern * patternCoefficient);
  const provisionalSlots = scoredSlots.filter(slot => slot.fitStatus.startsWith('provisional'));
  return {
    score,
    subskillRaw,
    subskillRawBeforeClamp: round(subskillRawBeforeClamp),
    subskillContribution,
    natureRaw,
    natureContribution,
    individualBeforePattern,
    ingredientPattern: pattern,
    ingredientPatternCoefficient: patternCoefficient,
    interactionMultiplier: interaction.multiplier,
    interactionBonus: interaction.score,
    slots: scoredSlots,
    provisional: provisionalSlots.length > 0,
    provisionalItems: [...new Set(provisionalSlots.map(slot => slot.scoredSkill))]
  };
}

function buildSpeciesSources(records) {
  const ingredient = speciesScoring.ingredientProductionRows(records);
  const berry = speciesScoring.berryProductionRows(records);
  const skill = skillSpeciesScoring.skillTeamSpeciesScoreRows(records, {
    collectionIntervalHours: 4,
    ingredientAvailability: 0.5,
    goodCamp: true
  });
  return {
    ingredient: new Map(ingredient.map(row => [String(row.id), row])),
    berry: new Map(berry.map(row => [String(row.id), row])),
    skill: new Map(skill.map(row => [String(row.id), row]))
  };
}

function targetForBox(box, sources, recordsById) {
  if (box.name === '伊布') {
    const routes = EEVEE_ROUTE_IDS.map(([id, nameZh]) => {
      const row = sources.skill.get(id);
      if (!row) throw new Error(`缺少伊布进化路线${nameZh}的技能手种族分`);
      return { id, nameZh, speciesScore: row.finalSpeciesScore };
    }).sort((left, right) => right.speciesScore - left.speciesScore || left.id.localeCompare(right.id));
    const best = routes[0];
    return {
      id: best.id,
      nameZh: best.nameZh,
      routeReason: `按纯综合分采用当前最高种族分路线：${best.nameZh}`,
      routeCandidates: routes
    };
  }
  const target = BOX_FINAL_FORM[box.name];
  if (!target) throw new Error(`缺少盒子物种的最终形态映射：${box.name}`);
  if (!recordsById.has(target[0])) throw new Error(`最终形态记录不存在：${box.name}→${target[0]}`);
  return { id: target[0], nameZh: target[1], routeReason: null, routeCandidates: null };
}

function boxScoreRows(boxRows, records) {
  const recordsById = new Map(records.map(record => [String(record.id), record]));
  const sources = buildSpeciesSources(records);
  const rows = boxRows.map(box => {
    const target = targetForBox(box, sources, recordsById);
    const finalRecord = recordsById.get(target.id);
    const role = finalRecord.specialty;
    if (role === 'all') {
      return {
        id: box.id,
        name: box.name,
        specialty: role,
        finalFormId: target.id,
        finalFormNameZh: target.nameZh,
        speciesScore: null,
        individualScore: null,
        finalScore: null,
        rank: null,
        routeReason: target.routeReason,
        routeCandidates: target.routeCandidates,
        status: 'pending-all-rounder-formula'
      };
    }
    const source = sources[role]?.get(target.id);
    if (!source) throw new Error(`缺少${box.name}→${target.nameZh}的${role}种族分`);
    const speciesScore = role === 'skill' ? source.finalSpeciesScore : source.speciesScore;
    if (!Number.isFinite(speciesScore)) throw new Error(`${target.nameZh}种族分待定`);
    const individual = individualScore(box, role, finalRecord);
    const finalScore = round(
      speciesScore * SPECIES_WEIGHT
      + individual.score * INDIVIDUAL_WEIGHT
    );
    return {
      id: box.id,
      name: box.name,
      specialty: role,
      finalFormId: target.id,
      finalFormNameZh: target.nameZh,
      speciesScore,
      speciesContribution: round(speciesScore * SPECIES_WEIGHT),
      speciesSource: role === 'skill' ? 'team-calibrated-final-species-score' : `${role}-species-score`,
      individualScore: individual.score,
      individualContribution: round(individual.score * INDIVIDUAL_WEIGHT),
      individual,
      finalScore,
      rank: null,
      routeReason: target.routeReason,
      routeCandidates: target.routeCandidates,
      status: individual.provisional ? 'scored-with-provisional-subskill-bridges' : 'scored-confirmed-components'
    };
  });
  const ranked = rows.filter(row => Number.isFinite(row.finalScore)).sort((left, right) => (
    right.finalScore - left.finalScore
    || right.speciesScore - left.speciesScore
    || Number(left.id) - Number(right.id)
  ));
  ranked.forEach((row, index) => { row.rank = index + 1; });
  return rows.sort((left, right) => Number(left.id) - Number(right.id));
}

function buildOutput(boxRows, records) {
  const rows = boxScoreRows(boxRows, records);
  const scored = rows.filter(row => Number.isFinite(row.finalScore));
  const pending = rows.filter(row => !Number.isFinite(row.finalScore));
  const ranked = [...scored].sort((left, right) => left.rank - right.rank);
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      targetLevel: TARGET_LEVEL,
      formula: '最终综合分=种族分×50%+个体分×50%；个体分=(副技能原始分×70%+性格修正×30%)×食材组合系数',
      speciesWeight: SPECIES_WEIGHT,
      individualWeight: INDIVIDUAL_WEIGHT,
      subskillWeight: SUBSKILL_WEIGHT,
      natureWeight: NATURE_WEIGHT,
      collectionProfile: '技能手种族分使用4小时收菜、好露营券、50%额外食材满足率；操作韧性保留8小时模型',
      scored: scored.length,
      pending: pending.length,
      pendingIds: pending.map(row => row.id),
      provisionalCount: scored.filter(row => row.individual?.provisional).length,
      highest: ranked[0] ? { id: ranked[0].id, name: ranked[0].name, score: ranked[0].finalScore } : null
    },
    scores: Object.fromEntries(rows.map(row => [row.id, row]))
  };
}

function selfTest(boxRows, records) {
  const output = buildOutput(boxRows, records);
  const rows = Object.values(output.scores);
  if (rows.length !== 97) throw new Error(`盒子数量错误：${rows.length}`);
  if (new Set(rows.map(row => row.id)).size !== rows.length) throw new Error('盒子评分存在重复ID');
  if (output.meta.scored !== 95 || output.meta.pending !== 2) {
    throw new Error(`盒子完成数量错误：${output.meta.scored}/95，待定${output.meta.pending}/2`);
  }
  if (!rows.filter(row => Number.isFinite(row.finalScore)).every(row => (
    row.speciesScore >= 0 && row.speciesScore <= 100
    && row.individualScore >= 0 && row.individualScore <= 100
    && row.finalScore >= 0 && row.finalScore <= 100
  ))) throw new Error('盒子评分超出0至100');
  if (!['62', '91'].every(id => output.scores[id]?.status === 'pending-all-rounder-formula')) {
    throw new Error('梦幻／达克莱伊没有保持全能型待定');
  }
  if (output.scores['48'].finalFormId !== '282' || output.scores['73'].finalFormId !== '282') {
    throw new Error('奇鲁莉安与沙奈朵没有共用沙奈朵最终形态种族分');
  }
  const eeveeRows = rows.filter(row => row.name === '伊布');
  if (eeveeRows.length !== 4 || !eeveeRows.every(row => row.finalFormId === '700')) {
    throw new Error('伊布没有按当前最高综合分路线采用仙子伊布');
  }
  if (!rows.filter(row => row.individual).every(row => row.individual.slots.length === 5)) {
    throw new Error('个体副技能栏位数量错误');
  }
  return {
    checks: 7,
    rows: rows.length,
    scored: output.meta.scored,
    pending: output.meta.pending,
    provisional: output.meta.provisionalCount,
    highest: output.meta.highest,
    kirliaSpeciesScore: output.scores['48'].speciesScore,
    gardevoirSpeciesScore: output.scores['73'].speciesScore,
    eeveeRoute: output.scores['25'].finalFormNameZh
  };
}

function javascript(output) {
  return `(function(root){\n  'use strict';\n  root.POKEMON_SLEEP_BOX_SCORES=Object.freeze(${JSON.stringify(output, null, 2)});\n})(typeof globalThis!=='undefined'?globalThis:this);\n`;
}

module.exports = Object.freeze({
  targetLevel: TARGET_LEVEL,
  weights: Object.freeze({
    species: SPECIES_WEIGHT,
    individual: INDIVIDUAL_WEIGHT,
    subskill: SUBSKILL_WEIGHT,
    nature: NATURE_WEIGHT
  }),
  ingredientPatternCoefficients: INGREDIENT_PATTERN_COEFFICIENTS,
  subskillFit: SUBSKILL_FIT,
  resourceSubskillFit: RESOURCE_SUBSKILL_FIT,
  boxFinalForm: BOX_FINAL_FORM,
  parseBoxRows,
  seedMaximizedSubskills,
  ingredientPattern,
  interactionBonus,
  individualScore,
  boxScoreRows,
  buildOutput,
  selfTest
});

if (require.main === module) {
  const args = process.argv.slice(2);
  const projectRoot = path.resolve(__dirname, '../../..');
  const htmlPath = path.resolve(option(args, '--html') || path.join(projectRoot, 'index.html'));
  const dataPath = path.resolve(option(args, '--data') || path.join(projectRoot, 'data/raenonx-species.json'));
  const html = fs.readFileSync(htmlPath, 'utf8');
  const input = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const records = input.pokemon || input;
  const boxRows = parseBoxRows(html);
  if (args.includes('--self-test')) {
    process.stdout.write(`${JSON.stringify(selfTest(boxRows, records), null, 2)}\n`);
  } else {
    const output = buildOutput(boxRows, records);
    const format = option(args, '--format') || 'json';
    const rendered = format === 'js' ? javascript(output) : `${JSON.stringify(output, null, 2)}\n`;
    const outputPath = option(args, '--output');
    if (outputPath) fs.writeFileSync(path.resolve(outputPath), rendered, 'utf8');
    else process.stdout.write(rendered);
  }
}
