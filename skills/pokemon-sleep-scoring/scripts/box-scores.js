#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const core = require('./scoring-core.js');
const allRounderRules = require('../../../all-rounder-rules.js');
const speciesTiers = require('./species-tiers.js');

const TARGET_LEVEL = 70;
const SUBSKILL_WEIGHT = core.weights.subskill;
const NATURE_WEIGHT = core.weights.nature;
const INGREDIENT_PATTERN_COEFFICIENTS = core.ingredientPatternCoefficients;
const LEGAL_SUBSKILL_MAX_BUILDS = core.legalSubskillMaxBuilds;

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

const round = core.round;
const clamp = core.clamp;

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

const seedMaximizedSubskills = core.seedMaximizedSubskills;
const ingredientPattern = core.ingredientPattern;
const interactionBonus = core.interactionBonus;
const scoreSubskillSlots = core.scoreSubskillSlots;
const legalSubskillMaximum = core.legalSubskillMaximum;
const individualScore = core.individualScore;

function targetForBox(box, recordsById) {
  if (box.name === '伊布') {
    const routes = EEVEE_ROUTE_IDS.map(([id, nameZh]) => {
      const record=recordsById.get(id),entry=speciesTiers.entryFor({finalFormId:id,name:nameZh,specialty:record&&record.specialty});
      return { id, nameZh, speciesTier:entry.tier };
    }).sort((left, right) => speciesTiers.compare(left.speciesTier,right.speciesTier) || left.id.localeCompare(right.id));
    const best = routes[0];
    return {
      id: best.id,
      nameZh: best.nameZh,
      routeReason: `按用户梯级表采用当前最高路线：${best.nameZh}（${best.speciesTier}级）`,
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
  const rows = boxRows.map(box => {
    const target = targetForBox(box, recordsById);
    const finalRecord = recordsById.get(target.id);
    const catalogRole = finalRecord.specialty;
    const berryBurst=catalogRole==='skill'&&core.berryBurstSkillIds.has(Number(finalRecord.mainSkill&&finalRecord.mainSkill.id));
    const role=berryBurst?'berry':catalogRole,evaluationRole=berryBurst?'berry-burst':catalogRole;
    const selectedAllRounderSkillId = catalogRole === 'all'
      ? (allRounderRules.isMew(box) ? allRounderRules.selectedId(box) : 'nightmare')
      : null;
    const tier=speciesTiers.entryFor({finalFormId:target.id,name:target.nameZh,specialty:role,selectedAllRounderSkillId});
    const individual = individualScore(box, evaluationRole, finalRecord,{berryBurst});
    const finalScore = individual.score;
    return {
      id: box.id,
      name: box.name,
      specialty: role,
      catalogSpecialty:catalogRole,
      evaluationRole,
      berryBurst,
      finalFormId: target.id,
      finalFormNameZh: target.nameZh,
      speciesTier:tier.tier,
      speciesTierCategory:tier.category,
      speciesTierListed:tier.listed,
      speciesTierSource:tier.source,
      selectedAllRounderSkillId,
      selectedAllRounderSkillNameZh: catalogRole === 'all' ? allRounderRules.BY_ID[selectedAllRounderSkillId]?.label || '梦魇' : null,
      individualScore: individual.score,
      individualGrade: individual.grade,
      individual,
      finalScore,
      scoreModel:'species-tier-plus-blank-output-multiplier',
      rank: null,
      routeReason: target.routeReason,
      routeCandidates: target.routeCandidates,
      status: individual.provisional ? 'scored-with-provisional-subskill-bridges' : 'scored-confirmed-components'
    };
  });
  const ranked = rows.filter(row => Number.isFinite(row.finalScore)).sort((left, right) => (
    speciesTiers.compare(left.speciesTier,right.speciesTier)
    || right.finalScore - left.finalScore
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
  const legalSubskillMaximums = Object.fromEntries(['berry', 'ingredient', 'skill', 'all'].map(role => {
    const representative = records.find(record => record.specialty === role);
    return [role, legalSubskillMaximum(role, representative).raw];
  }));
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      targetLevel: TARGET_LEVEL,
      formula: '物种强度采用用户维护的S/A/B/C梯级；个体评价以同种白板为1.00，按定位比较食材、树果能量或技能触发产出。',
      scoreModel:'species-tier-plus-blank-output-multiplier',
      subskillWeight: SUBSKILL_WEIGHT,
      natureWeight: NATURE_WEIGHT,
      legalSubskillMaximums,
      tierSource: speciesTiers.SOURCE,
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
  const result=buildOutput(boxRows,records),scoredRows=Object.values(result.scores);
  if(scoredRows.length!==97||result.meta.scored!==97||result.meta.pending!==0)throw new Error(`盒子倍率完成数量错误：${result.meta.scored}/97，待定${result.meta.pending}/0`);
  if(!scoredRows.every(row=>Number.isFinite(row.finalScore)&&row.finalScore>0&&row.finalScore<4&&['S','A','B','C'].includes(row.speciesTier)&&['S','A','B','C'].includes(row.individualGrade)))throw new Error('盒子个体倍率或梯级异常');
  const recordById=new Map(records.map(record=>[String(record.id),record]));
  const gardevoir=core.individualScore({nature:'慎重',subs:'帮手奖励；技能概率M；技能概率S；帮忙速度M；帮忙速度S',ingredients:'A×1／A×1／A×1'},'skill',recordById.get('282'));
  const typhlosion=core.individualScore({nature:'固执',subs:'树果数量S；帮手奖励；帮忙速度M；帮忙速度S；技能概率M',ingredients:'A×1／A×1／A×1'},'berry',recordById.get('157'));
  const sceptile=core.individualScore({nature:'固执',subs:'树果数量S；帮手奖励；帮忙速度M；技能概率M；技能概率S',ingredients:'A×1／A×1／A×1'},'berry-burst',recordById.get('254'));
  if(gardevoir.score!==2.33||gardevoir.grade!=='S')throw new Error(`沙奈朵白板倍率异常：${JSON.stringify(gardevoir)}`);
  if(typhlosion.score!==2.37||typhlosion.grade!=='S')throw new Error(`火爆兽白板倍率异常：${JSON.stringify(typhlosion)}`);
  if(sceptile.score!==2.24||sceptile.grade!=='S')throw new Error(`蜥蜴王树果骤增倍率异常：${JSON.stringify(sceptile)}`);
  return {checks:7,rows:scoredRows.length,scored:result.meta.scored,pending:result.meta.pending,gardevoirMultiplier:gardevoir.score,typhlosionMultiplier:typhlosion.score,sceptileMultiplier:sceptile.score};
}

function javascript(output) {
  return `(function(root){\n  'use strict';\n  root.POKEMON_SLEEP_BOX_SCORES=Object.freeze(${JSON.stringify(output, null, 2)});\n})(typeof globalThis!=='undefined'?globalThis:this);\n`;
}

module.exports = Object.freeze({
  targetLevel: TARGET_LEVEL,
  weights: Object.freeze({
    individual: 1,
    subskill: SUBSKILL_WEIGHT,
    nature: NATURE_WEIGHT
  }),
  ingredientPatternCoefficients: INGREDIENT_PATTERN_COEFFICIENTS,
  subskillFit: core.subskillFitTable,
  resourceSubskillFit: core.resourceSubskillFit,
  boxFinalForm: BOX_FINAL_FORM,
  legalSubskillMaxBuilds: LEGAL_SUBSKILL_MAX_BUILDS,
  parseBoxRows,
  seedMaximizedSubskills,
  ingredientPattern,
  interactionBonus,
  scoreSubskillSlots,
  legalSubskillMaximum,
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
