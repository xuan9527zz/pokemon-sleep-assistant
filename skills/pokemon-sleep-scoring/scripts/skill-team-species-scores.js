#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const scoring = require('./species-scores.js');
const standardTeams = require('./standard-team-rankings.js');
const healerTeams = require('./healer-team-rankings.js');
const specialTeams = require('./special-team-rankings.js');

const DEFAULTS = Object.freeze({
  collectionIntervalHours: 4,
  ingredientAvailability: 0.5,
  goodCamp: true
});
const SKILL_ROLE_GAP_COMPENSATION = 0.5;

// User-confirmed subjective calibration. These adjustments are deliberately applied
// after the mechanism score and cross-specialty gap compensation so they remain
// auditable and never alter the underlying team-yield coefficients.
const MANUAL_SPECIES_ADJUSTMENTS_BY_ID = Object.freeze({
  '53': -2.5,   // 猫老大
  '196': 10,    // 太阳伊布
  '199': -10,   // 呆呆王
  '213': 10,    // 壶壶
  '214': -2.5,  // 赫拉克罗斯
  '243': 10,    // 雷公
  '244': 10,    // 炎帝
  '245': 10,    // 水君
  '448': -10,   // 路卡利欧
  '468': -10,   // 波克基斯
  '470': -10,   // 叶伊布
  '558': 10,    // 岩殿居蟹
  '628': -2.5,  // 勇士雄鹰
  '715': 10,    // 音波龙
  '778': -2.5,  // 谜拟丘
  '923': -2.5,  // 巴布土拨
  '9002': -10,  // 皮卡丘（佳节）
  '9006': -2.5  // 海豹球（佳节）
});

const DISPLAY_NAME_OVERRIDES = Object.freeze({
  '赫拉克羅斯': '赫拉克罗斯',
  '巴布土撥': '巴布土拨',
  '海豹球（佳節）': '海豹球（佳节）',
  '克雷色利亞': '克雷色利亚',
  '土台龜': '土台龟',
  '拉帝亞斯': '拉帝亚斯',
  '壺壺': '壶壶',
  '電龍': '电龙',
  '葉伊布': '叶伊布',
  '呆殼獸': '呆壳兽',
  '托戈德瑪爾': '托戈德玛尔',
  '風速狗': '风速狗',
  '正電拍拍': '正电拍拍',
  '路卡利歐': '路卡利欧',
  '吞食獸': '吞食兽',
  '音波龍': '音波龙',
  '謎擬Ｑ': '谜拟丘',
  '勇士雄鷹': '勇士雄鹰',
  '太陽伊布': '太阳伊布',
  '勾魂眼': '勾魂眼',
  '艾路雷朵': '艾路雷朵',
  '烏鴉頭頭': '乌鸦头头',
  '貓老大': '猫老大',
  '顫弦蠑螈（高調的樣子）': '颤弦蝾螈（高调的样子）',
  '顫弦蠑螈（低調的樣子）': '颤弦蝾螈（低调的样子）',
  '皮卡丘（佳節）': '皮卡丘（佳节）',
  '隨風球': '随风球',
  '樹才怪': '树才怪',
  '伊布（萬聖節）': '伊布（万圣节）',
  '哥達鴨': '哥达鸭',
  '負電拍拍': '负电拍拍',
  '摔角鷹人': '摔角鹰人',
  '拉帝歐斯': '拉帝欧斯'
});

function round(value, digits = 1) {
  const scale = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * scale) / scale;
}

function option(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function displayName(value) {
  const name = typeof value === 'string'
    ? value
    : value?.nameZh || value?.nameEn || '未知';
  return DISPLAY_NAME_OVERRIDES[name] || name;
}

function roleCalibratedSpeciesScore(rawSpeciesScore, compensation = SKILL_ROLE_GAP_COMPENSATION) {
  if (!(compensation >= 0 && compensation <= 1)) {
    throw new Error('技能手定位补偿系数必须是0至1');
  }
  const raw = Number(rawSpeciesScore);
  if (!(raw >= 0 && raw <= 100)) throw new Error('技能手原始种族分必须是0至100');
  return round(raw + (100 - raw) * compensation);
}

function manuallyAdjustedSpeciesScore(calibratedSpeciesScore, adjustment = 0) {
  const calibrated = Number(calibratedSpeciesScore);
  const delta = Number(adjustment);
  if (!(calibrated >= 0 && calibrated <= 100)) {
    throw new Error('技能手补偿后种族分必须是0至100');
  }
  if (!Number.isFinite(delta)) throw new Error('技能手人工校准必须是有限数字');
  return round(Math.min(Math.max(calibrated + delta, 0), 100));
}

function sourceEntry(row, sourceType, role) {
  const berryHelperName = displayName(row.berryHelperNameZh || row.berryHelperNameEn || '岛屿树果手');
  const candidateName = displayName(row);
  return {
    id: String(row.id),
    pokedexId: Number(row.pokedexId),
    sourceType,
    role,
    islandNameZh: row.islandNameZh,
    candidateTeam: row.candidateTeam || `沙奈朵＋${candidateName}＋${berryHelperName}×3`,
    baselineTeam: row.baselineTeam || `沙奈朵＋${berryHelperName}×4`,
    yieldCoefficient: Number(row.yieldCoefficient),
    netYieldPct: Number(row.netYieldPct),
    sourceStatus: row.status
  };
}

function skillTeamSpeciesScoreRows(records, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  if (!(settings.collectionIntervalHours > 0)) throw new Error('收菜间隔必须大于0小时');
  if (!(settings.ingredientAvailability >= 0 && settings.ingredientAvailability <= 1)) {
    throw new Error('食材满足率必须是0至1');
  }

  const standardRows = standardTeams.standardTeamRankingRows(records, settings);
  const healerRows = healerTeams.healerTeamRankingRows(records, {
    collectionIntervalHours: settings.collectionIntervalHours,
    goodCamp: settings.goodCamp
  });
  const specialRows = specialTeams.specialTeamComparisonRows(records, settings);
  const twinAttribution = specialTeams.latiosLatiasCoalitionAttribution(records, settings);
  const finalSkillRecords = records.filter(record => (
    record.specialty === 'skill' && record.isFinalEvolution
  ));
  const recordById = new Map(finalSkillRecords.map(record => [String(record.id), record]));
  const recordByPokedexId = new Map(
    finalSkillRecords.map(record => [Number(record.pokedexId), record])
  );

  const primarySources = new Map();
  const addPrimary = entry => {
    if (!recordById.has(entry.id)) throw new Error(`系数来源不是最终形态技能手：${entry.id}`);
    if (primarySources.has(entry.id)) {
      throw new Error(`技能手${displayName(recordById.get(entry.id))}出现多个主系数来源`);
    }
    primarySources.set(entry.id, entry);
  };

  standardRows.forEach(row => addPrimary(sourceEntry(row, 'ordinary-fixed-team', '额外技能位')));
  healerRows.forEach(row => addPrimary(sourceEntry(row, 'dynamic-healer-team', '回复位')));
  specialRows
    .filter(row => row.id !== 'latios-latias-amber-canyon')
    .forEach(row => {
      const record = recordByPokedexId.get(Number(row.primarySpecialPokedexId));
      if (!record) throw new Error(`缺少特殊宝可梦#${row.primarySpecialPokedexId}`);
      addPrimary(sourceEntry({ ...row, id: record.id, pokedexId: record.pokedexId }, 'special-fixed-team', '特殊额外技能位'));
    });
  const latios = recordByPokedexId.get(Number(twinAttribution.latiosPokedexId));
  if (!latios) throw new Error('缺少拉帝欧斯技能手记录');
  addPrimary({
    id: String(latios.id),
    pokedexId: Number(latios.pokedexId),
    sourceType: 'latios-latias-shapley-attribution',
    role: '拉帝双龙组合归因',
    islandNameZh: twinAttribution.islandNameZh,
    candidateTeam: twinAttribution.pairTeam,
    baselineTeam: twinAttribution.baselineTeam,
    yieldCoefficient: twinAttribution.latiosAttributedYieldCoefficient,
    netYieldPct: round((twinAttribution.latiosAttributedYieldCoefficient - 1) * 100, 2),
    sourceStatus: twinAttribution.status
  });

  const missingSources = finalSkillRecords.filter(record => !primarySources.has(String(record.id)));
  if (missingSources.length) {
    throw new Error(`缺少技能手队伍系数：${missingSources.map(displayName).join('、')}`);
  }
  if (primarySources.size !== finalSkillRecords.length) {
    throw new Error(`技能手系数覆盖数量错误：${primarySources.size}/${finalSkillRecords.length}`);
  }

  const genericRows = scoring.skillSpecialistSpeciesRankingRows(records, {
    recoveryOptions: { latiosPresent: false }
  });
  const genericById = new Map(genericRows.map(row => [String(row.id), row]));
  const pairedGenericById = new Map(
    scoring.skillSpecialistSpeciesRankingRows(records, {
      recoveryOptions: { latiosPresent: true }
    }).map(row => [String(row.id), row])
  );
  const positiveDeltas = [...primarySources.values()].map(source => (
    Math.max(source.yieldCoefficient - 1, 0)
  ));
  const normalizationDelta = Math.max(...positiveDeltas);
  if (!(normalizationDelta > 0)) throw new Error('没有正收益技能手，无法归一化');
  const normalizationSource = [...primarySources.values()].sort((left, right) => (
    right.yieldCoefficient - left.yieldCoefficient
  ))[0];

  const scoreWithCoefficient = (generic, coefficient) => {
    const positiveDelta = Math.max(coefficient - 1, 0);
    const teamYieldScore = round(Math.min(positiveDelta / normalizationDelta, 1) * 100);
    const mainSkillComprehensiveScore = scoring.skillSpecialistMainComprehensiveScore({
      theoreticalOutputScore: teamYieldScore,
      stabilityScore: Number(generic.stabilityScore),
      operationScore: Number(generic.operationScore),
      versatilityScore: Number(generic.versatilityScore)
    });
    const naturalMainSkillLevelScore = Number(generic.naturalLevelContribution) / 5 * 100;
    const speciesScore = scoring.skillSpecialistSpeciesScore({
      mainSkillComprehensiveScore,
      naturalMainSkillLevelScore
    });
    const calibratedSpeciesScore = roleCalibratedSpeciesScore(speciesScore);
    return {
      positiveTeamYieldDelta: round(positiveDelta, 4),
      teamYieldScore,
      teamYieldContribution: round(
        teamYieldScore * scoring.skillSpecialistMainWeights.theoreticalOutput
      ),
      stabilityScore: round(generic.stabilityScore),
      stabilityContribution: round(
        Number(generic.stabilityScore) * scoring.skillSpecialistMainWeights.stability
      ),
      operationScore: round(generic.operationScore),
      operationContribution: round(
        Number(generic.operationScore) * scoring.skillSpecialistMainWeights.operation
      ),
      versatilityScore: round(generic.versatilityScore),
      versatilityContribution: round(
        Number(generic.versatilityScore) * scoring.skillSpecialistMainWeights.versatility
      ),
      mainSkillComprehensiveScore,
      naturalMainSkillLevelScore: round(naturalMainSkillLevelScore),
      naturalLevelContribution: round(
        naturalMainSkillLevelScore * scoring.skillSpecialistFinalSpeciesWeights.naturalLevel
      ),
      speciesScore,
      roleGapCompensation: SKILL_ROLE_GAP_COMPENSATION,
      calibratedSpeciesScore
    };
  };

  const latias = recordByPokedexId.get(Number(twinAttribution.latiasPokedexId));
  const rows = finalSkillRecords.map(record => {
    const id = String(record.id);
    const source = primarySources.get(id);
    const generic = genericById.get(id);
    if (!generic) throw new Error(`缺少${displayName(record)}旧种族组件`);
    const scored = scoreWithCoefficient(generic, source.yieldCoefficient);
    const manualSpeciesAdjustment = MANUAL_SPECIES_ADJUSTMENTS_BY_ID[id] || 0;
    const finalSpeciesScore = manuallyAdjustedSpeciesScore(
      scored.calibratedSpeciesScore,
      manualSpeciesAdjustment
    );
    let pairedAlternative = null;
    if (latias && id === String(latias.id)) {
      const pairedGeneric = pairedGenericById.get(id);
      const pairedCoefficient = twinAttribution.latiasAttributedYieldCoefficient;
      const pairedScored = scoreWithCoefficient(pairedGeneric, pairedCoefficient);
      pairedAlternative = {
        role: '拉帝双龙组合归因',
        yieldCoefficient: pairedCoefficient,
        netYieldPct: round((pairedCoefficient - 1) * 100, 2),
        ...pairedScored,
        manualSpeciesAdjustment,
        finalSpeciesScore: manuallyAdjustedSpeciesScore(
          pairedScored.calibratedSpeciesScore,
          manualSpeciesAdjustment
        )
      };
    }
    return {
      id,
      pokedexId: Number(record.pokedexId),
      nameZh: displayName(record),
      skillNameZh: displayName(generic.skillNameZh || record.mainSkill?.nameZh),
      typeId: record.typeId,
      sourceType: source.sourceType,
      role: source.role,
      islandNameZh: source.islandNameZh,
      candidateTeam: source.candidateTeam,
      baselineTeam: source.baselineTeam,
      yieldCoefficient: round(source.yieldCoefficient, 4),
      netYieldPct: round((source.yieldCoefficient - 1) * 100, 2),
      ...scored,
      manualSpeciesAdjustment,
      finalSpeciesScore,
      pairedAlternative,
      normalizationAnchorNameZh: displayName(recordById.get(normalizationSource.id)),
      normalizationAnchorYieldCoefficient: round(normalizationSource.yieldCoefficient, 4),
      normalizationPositiveDelta: round(normalizationDelta, 4),
      scoringStatus: [
        'team-yield-coefficient-normalized-above-one',
        'main-skill-70-10-10-10',
        'species-95-5',
        'skill-role-gap-compensation-0.5',
        manualSpeciesAdjustment ? 'user-manual-species-adjustment' : null,
        source.sourceStatus
      ].filter(Boolean).join(';')
    };
  }).sort((left, right) => (
    right.finalSpeciesScore - left.finalSpeciesScore
    || right.calibratedSpeciesScore - left.calibratedSpeciesScore
    || right.speciesScore - left.speciesScore
    || right.yieldCoefficient - left.yieldCoefficient
    || left.pokedexId - right.pokedexId
  ));

  return rows.map((row, index) => ({ rank: index + 1, ...row }));
}

function markdown(rows) {
  const value = number => Number(number).toFixed(1);
  return [
    '| 排名 | 宝可梦 | 队伍身份 | 使用岛屿 | 收益系数 | 净收益 | 收益标准分 | 稳定 | 操作 | 泛用 | 自然/5 | 技能表现 | 原始机制分 | 补偿后种族分 | 人工校准 | 最终种族分/100 |',
    '|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.rank} | ${row.nameZh} | ${row.role} | ${row.islandNameZh || '—'} | ${row.yieldCoefficient.toFixed(4)} | ${row.netYieldPct.toFixed(2)}% | ${value(row.teamYieldScore)} | ${value(row.stabilityScore)} | ${value(row.operationScore)} | ${value(row.versatilityScore)} | ${value(row.naturalLevelContribution)} | ${value(row.mainSkillComprehensiveScore)} | ${value(row.speciesScore)} | ${value(row.calibratedSpeciesScore)} | ${row.manualSpeciesAdjustment > 0 ? '+' : ''}${value(row.manualSpeciesAdjustment)} | ${value(row.finalSpeciesScore)} |`)
  ].join('\n');
}

function selfTest(records) {
  const rows = skillTeamSpeciesScoreRows(records);
  if (rows.length !== 53) throw new Error(`技能手数量错误：${rows.length}`);
  if (new Set(rows.map(row => row.id)).size !== rows.length) {
    throw new Error('技能手最终评分存在重复ID');
  }
  if (!rows.every(row => (
    row.teamYieldScore >= 0 && row.teamYieldScore <= 100
    && row.speciesScore >= 0 && row.speciesScore <= 100
    && row.calibratedSpeciesScore >= 0 && row.calibratedSpeciesScore <= 100
    && row.finalSpeciesScore >= 0 && row.finalSpeciesScore <= 100
  ))) {
    throw new Error('技能手标准分超出0至100');
  }
  if (!rows.some(row => row.teamYieldScore === 100)) {
    throw new Error('没有技能手达到收益标准分100锚点');
  }
  if (!rows.filter(row => row.yieldCoefficient <= 1).every(row => row.teamYieldScore === 0)) {
    throw new Error('非正收益技能手没有按0分处理收益组件');
  }
  const latios = rows.find(row => row.pokedexId === 381);
  const latias = rows.find(row => row.pokedexId === 380);
  if (!latios || latios.sourceType !== 'latios-latias-shapley-attribution') {
    throw new Error('拉帝欧斯没有使用双龙组合归因');
  }
  if (!latias?.pairedAlternative) throw new Error('拉帝亚斯缺少双龙组合备选分');
  if (!rows.every(row => (
    row.calibratedSpeciesScore === roleCalibratedSpeciesScore(row.speciesScore)
  ))) {
    throw new Error('技能手定位补偿计算不一致');
  }
  const manualRows = rows.filter(row => row.manualSpeciesAdjustment !== 0);
  if (manualRows.length !== Object.keys(MANUAL_SPECIES_ADJUSTMENTS_BY_ID).length) {
    throw new Error(`技能手人工校准覆盖数量错误：${manualRows.length}`);
  }
  if (!rows.every(row => (
    row.manualSpeciesAdjustment === (MANUAL_SPECIES_ADJUSTMENTS_BY_ID[row.id] || 0)
    && row.finalSpeciesScore === manuallyAdjustedSpeciesScore(
      row.calibratedSpeciesScore,
      row.manualSpeciesAdjustment
    )
  ))) {
    throw new Error('技能手人工校准计算不一致');
  }
  return {
    checks: 10,
    rows: rows.length,
    normalizationAnchor: rows.find(row => row.teamYieldScore === 100)?.nameZh,
    highestSpeciesScore: rows[0].speciesScore,
    highestCalibratedSpeciesScore: rows[0].calibratedSpeciesScore,
    highestFinalSpeciesScore: rows[0].finalSpeciesScore,
    highestSpecies: rows[0].nameZh,
    manualAdjustments: manualRows.length,
    latiosSpeciesScore: latios.speciesScore,
    latiasHealerSpeciesScore: latias.speciesScore,
    latiasPairAlternativeSpeciesScore: latias.pairedAlternative.speciesScore
  };
}

module.exports = Object.freeze({
  defaults: DEFAULTS,
  skillRoleGapCompensation: SKILL_ROLE_GAP_COMPENSATION,
  manualSpeciesAdjustmentsById: MANUAL_SPECIES_ADJUSTMENTS_BY_ID,
  roleCalibratedSpeciesScore,
  manuallyAdjustedSpeciesScore,
  skillTeamSpeciesScoreRows,
  selfTest
});

if (require.main === module) {
  const args = process.argv.slice(2);
  const dataPath = option(args, '--data');
  if (!dataPath) throw new Error('需要 --data <raenonx-species.json>');
  const input = JSON.parse(fs.readFileSync(path.resolve(dataPath), 'utf8'));
  const records = input.pokemon || input;
  const settings = {
    collectionIntervalHours: Number(
      option(args, '--collection-hours') ?? DEFAULTS.collectionIntervalHours
    ),
    ingredientAvailability: Number(
      option(args, '--ingredient-availability') ?? DEFAULTS.ingredientAvailability
    ),
    goodCamp: !args.includes('--no-good-camp')
  };
  if (args.includes('--self-test')) {
    process.stdout.write(`${JSON.stringify(selfTest(records), null, 2)}\n`);
  } else {
    const rows = skillTeamSpeciesScoreRows(records, settings);
    const format = option(args, '--format') || 'markdown';
    process.stdout.write(`${format === 'json' ? JSON.stringify(rows, null, 2) : markdown(rows)}\n`);
  }
}
