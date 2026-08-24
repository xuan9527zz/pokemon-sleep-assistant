#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const scoring = require('./species-scores.js');
const standard = require('./standard-team-rankings.js');

const DISPLAY_NAME_OVERRIDES = Object.freeze({
  '火爆獸': '火爆兽',
  '大力鱷': '大力鳄',
  '暴飛龍': '暴飞龙',
  '拉帝亞斯': '拉帝亚斯',
  '拉帝歐斯': '拉帝欧斯'
});

const DEFAULTS = Object.freeze({ ...standard.defaults });

const SPECIAL_TEAM_SCENARIOS = Object.freeze([
  Object.freeze({
    id: 'suicune-cyan-beach',
    nameZh: '水君天青队',
    islandId: 'cyan-beach',
    primarySpecialPokedexId: 245,
    berryHelperPokedexId: 160,
    berryHelperCount: 3,
    specialModel: 'helper-boost'
  }),
  Object.freeze({
    id: 'raikou-old-gold-power-plant',
    nameZh: '雷公黄金队',
    islandId: 'old-gold-power-plant',
    primarySpecialPokedexId: 243,
    berryHelperPokedexId: 26,
    berryHelperCount: 3,
    specialModel: 'helper-boost'
  }),
  Object.freeze({
    id: 'entei-taupe-hollow',
    nameZh: '炎帝灰褐队',
    islandId: 'taupe-hollow',
    primarySpecialPokedexId: 244,
    berryHelperPokedexId: 157,
    berryHelperCount: 3,
    specialModel: 'helper-boost'
  }),
  Object.freeze({
    id: 'latios-latias-amber-canyon',
    nameZh: '拉帝双龙琥珀队',
    islandId: 'amber-canyon',
    primarySpecialPokedexId: 381,
    partnerSpecialPokedexId: 380,
    berryHelperPokedexId: 373,
    berryHelperCount: 2,
    specialModel: 'latios-latias-pair'
  })
]);

function round(value, digits = 1) {
  const scale = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * scale) / scale;
}

function option(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function displayName(recordOrName) {
  const name = typeof recordOrName === 'string'
    ? recordOrName
    : recordOrName?.nameZh || recordOrName?.nameEn || '未知';
  return DISPLAY_NAME_OVERRIDES[name] || name;
}

function finalRecordByPokedexId(records, pokedexId) {
  const record = records.find(candidate => (
    candidate.isFinalEvolution && Number(candidate.pokedexId) === Number(pokedexId)
  ));
  if (!record) throw new Error(`缺少最终形态图鉴#${pokedexId}`);
  return record;
}

function validateSpecialTeam(team) {
  const specialPokedexIds = team
    .filter(member => standard.specialPokedexIds.has(Number(member.record.pokedexId)))
    .map(member => Number(member.record.pokedexId));
  const distinct = [...new Set(specialPokedexIds)].sort((left, right) => left - right);
  const isLatiasLatiosException = (
    distinct.length === 2 && distinct[0] === 380 && distinct[1] === 381
  );
  if (distinct.length > 1 && !isLatiasLatiosException) {
    throw new Error(`特殊宝可梦同队非法：${distinct.join('、')}`);
  }
  return {
    specialPokedexIds: distinct,
    ruleStatus: isLatiasLatiosException
      ? 'legal-latias-latios-special-pair-exception'
      : 'legal-one-special-pokemon'
  };
}

function member(record, role, favoriteShare) {
  return { record, role, favoriteShare };
}

function buildScenarioTeams(records, scenario) {
  const island = standard.islandStandards.find(candidate => candidate.id === scenario.islandId);
  if (!island) throw new Error(`缺少岛屿${scenario.islandId}`);
  const gardevoir = finalRecordByPokedexId(records, 282);
  const primarySpecial = finalRecordByPokedexId(records, scenario.primarySpecialPokedexId);
  const partnerSpecial = scenario.partnerSpecialPokedexId
    ? finalRecordByPokedexId(records, scenario.partnerSpecialPokedexId)
    : null;
  const berryHelper = finalRecordByPokedexId(records, scenario.berryHelperPokedexId);
  const gardevoirFavoriteShare = island.typeIds.includes(Number(gardevoir.typeId)) ? 1 : 0;
  const candidateTeam = [
    member(gardevoir, 'healer', gardevoirFavoriteShare),
    member(primarySpecial, 'special', 1),
    ...(partnerSpecial ? [member(partnerSpecial, 'special-partner', 1)] : []),
    ...Array.from(
      { length: scenario.berryHelperCount },
      () => member(berryHelper, 'berry', 1)
    )
  ];
  const baselineTeam = [
    member(gardevoir, 'healer', gardevoirFavoriteShare),
    ...Array.from({ length: 4 }, () => member(berryHelper, 'berry', 1))
  ];
  if (candidateTeam.length !== 5 || baselineTeam.length !== 5) {
    throw new Error(`${scenario.nameZh}没有正好5名队员`);
  }
  return {
    island,
    gardevoir,
    primarySpecial,
    partnerSpecial,
    berryHelper,
    candidateTeam,
    baselineTeam,
    specialRule: validateSpecialTeam(candidateTeam)
  };
}

function teamName(team) {
  const counts = new Map();
  team.forEach(({ record }) => {
    const name = displayName(record);
    counts.set(name, (counts.get(name) || 0) + 1);
  });
  return [...counts.entries()]
    .map(([name, count]) => `${name}${count > 1 ? `×${count}` : ''}`)
    .join('＋');
}

function teamOrdinaryEnergyPerDay(team) {
  return team.reduce((sum, current) => (
    sum + standard.ordinaryEnergyPerDay(current.record, current.favoriteShare)
  ), 0);
}

function gardevoirSkillOutputIndex(records, gardevoir, settings) {
  const row = scoring.standardE4eRows(records).find(candidate => (
    Number(candidate.pokedexId) === Number(gardevoir.pokedexId)
  ));
  if (!row) throw new Error('缺少沙奈朵全体回复模型');
  const triggerMetrics = standard.collectionTriggerMetrics(
    gardevoir,
    settings.collectionIntervalHours
  );
  return {
    outputIndex: Number(row.theoreticalOutputIndex) * triggerMetrics.retentionRatio,
    triggerMetrics
  };
}

function berryHelperSkillOutputIndex(team, settings) {
  const berryMembers = team.filter(current => current.role === 'berry');
  if (!berryMembers.length) return { outputIndex: 0, triggerMetrics: null };
  const record = berryMembers[0].record;
  if (!berryMembers.every(current => current.record.id === record.id)) {
    throw new Error('当前特殊队脚本只支持同种岛屿树果手重复');
  }
  const level = Math.min(
    standard.naturalMainSkillLevel(record),
    scoring.cookingPowerUp.maxLevel
  );
  const isCookingPower = (
    Number(record.mainSkill?.id) === scoring.cookingPowerUp.ordinaryMainSkillId
  );
  const outputIndex = isCookingPower
    ? standard.cookingPowerTeamOutputIndex([{
      record,
      count: berryMembers.length,
      level
    }], settings)
    : berryMembers.length * standard.helperMainSkillOutputIndex(record, team, settings);
  return {
    outputIndex,
    triggerMetrics: standard.collectionTriggerMetrics(
      record,
      settings.collectionIntervalHours
    ),
    aggregationStatus: isCookingPower
      ? 'aggregated-cooking-power-team-state-weighted-slots'
      : 'linear-natural-berry-helper-skills'
  };
}

function helperBoostSpecialOutput(primarySpecial, candidateTeam, settings) {
  const sameTypeDistinctSpecies = new Set(candidateTeam
    .filter(current => Number(current.record.typeId) === Number(primarySpecial.typeId))
    .map(current => Number(current.record.pokedexId))).size;
  const effect = scoring.helperBoostEffect({
    level: scoring.helperBoost.maxLevel,
    distinctSpecies: sameTypeDistinctSpecies,
    targetEnergyPerHelp: standard.actualTeamTargetEnergyPerHelp(candidateTeam)
  });
  const triggerMetrics = standard.collectionTriggerMetrics(
    primarySpecial,
    settings.collectionIntervalHours
  );
  return {
    outputIndex: triggerMetrics.collectedTriggerIndexPerDay * effect.singleUsePracticalValue,
    triggerMetrics,
    effect,
    componentLabel: `${sameTypeDistinctSpecies}种同属性：每人${effect.helpsPerHelper}次／全队${effect.totalHelps}次`
  };
}

function latiosLatiasSpecialOutput(teamParts, settings) {
  const { gardevoir, primarySpecial: latios, partnerSpecial: latias, candidateTeam } = teamParts;
  if (!latias) throw new Error('拉帝双龙队缺少拉帝亚斯');
  const dragonSpecies = new Set(candidateTeam
    .filter(current => Number(current.record.typeId) === 15)
    .map(current => Number(current.record.pokedexId))).size;
  const latiosMember = candidateTeam.find(current => current.record.id === latios.id);
  const latiasMember = candidateTeam.find(current => current.record.id === latias.id);
  const teammateBerryEnergies = candidateTeam
    .filter(current => current.record.id !== latios.id)
    .map(current => scoring.berryEnergyPerBerry(current.record, current.favoriteShare));
  const meteorEffect = scoring.meteorShowerEffect({
    level: scoring.meteorShower.maxLevel,
    distinctDragonSpecies: dragonSpecies,
    latiasPresent: true,
    userBerryEnergy: scoring.berryEnergyPerBerry(latios, latiosMember.favoriteShare),
    teammateBerryEnergies
  });
  const latiosTriggerMetrics = standard.collectionTriggerMetrics(
    latios,
    settings.collectionIntervalHours
  );

  const productiveMembers = candidateTeam.filter(current => current.record.id !== gardevoir.id);
  const productiveHelpEnergy = productiveMembers.reduce((sum, current) => (
    sum + scoring.immediateHelpBaseEnergy(current.record, current.favoriteShare)
  ), 0) / productiveMembers.length;
  const gardevoirMember = candidateTeam.find(current => current.record.id === gardevoir.id);
  const healPulseEffect = scoring.healPulseScenario({
    level: scoring.healPulse.maxLevel,
    latiosPresent: true,
    helpEnergyPerHelp: productiveHelpEnergy,
    healerHelpEnergyPerHelp: scoring.immediateHelpBaseEnergy(
      gardevoir,
      gardevoirMember.favoriteShare
    ),
    productiveTargetShare: productiveMembers.length / candidateTeam.length
  });
  const latiasTriggerMetrics = standard.collectionTriggerMetrics(
    latias,
    settings.collectionIntervalHours
  );
  const meteorOutputIndex = (
    latiosTriggerMetrics.collectedTriggerIndexPerDay
    * meteorEffect.singleUsePracticalValue
  );
  const healPulseOutputIndex = (
    latiasTriggerMetrics.collectedTriggerIndexPerDay
    * healPulseEffect.singleUsePracticalValue
  );
  return {
    outputIndex: meteorOutputIndex + healPulseOutputIndex,
    triggerMetrics: latiosTriggerMetrics,
    secondaryTriggerMetrics: latiasTriggerMetrics,
    meteorEffect,
    healPulseEffect,
    componentLabel: (
      `${dragonSpecies}种龙；流星群${meteorEffect.selfBerryCount}+${meteorEffect.teammateBerryCount}×4`
      + `；治愈波动每目标${healPulseEffect.helpsPerTarget}次帮忙`
    ),
    componentOutputIndexes: {
      latiosMeteor: meteorOutputIndex,
      latiasHealPulse: healPulseOutputIndex
    },
    latiasFavoriteShare: latiasMember.favoriteShare
  };
}

function latiosMeteorOutputForTeam(latios, team, settings) {
  const latiasPresent = team.some(current => Number(current.record.pokedexId) === 380);
  const dragonSpecies = new Set(team
    .filter(current => Number(current.record.typeId) === 15)
    .map(current => Number(current.record.pokedexId))).size;
  const latiosMember = team.find(current => current.record.id === latios.id);
  if (!latiosMember) return { outputIndex: 0, triggerMetrics: null, effect: null };
  const effect = scoring.meteorShowerEffect({
    level: scoring.meteorShower.maxLevel,
    distinctDragonSpecies: dragonSpecies,
    latiasPresent,
    userBerryEnergy: scoring.berryEnergyPerBerry(latios, latiosMember.favoriteShare),
    teammateBerryEnergies: team
      .filter(current => current.record.id !== latios.id)
      .map(current => scoring.berryEnergyPerBerry(current.record, current.favoriteShare))
  });
  const triggerMetrics = standard.collectionTriggerMetrics(
    latios,
    settings.collectionIntervalHours
  );
  return {
    outputIndex: triggerMetrics.collectedTriggerIndexPerDay * effect.singleUsePracticalValue,
    triggerMetrics,
    effect
  };
}

function latiasHealPulseOutputForTeam(gardevoir, latias, team, settings) {
  const latiasMember = team.find(current => current.record.id === latias.id);
  if (!latiasMember) return { outputIndex: 0, triggerMetrics: null, effect: null };
  const latiosPresent = team.some(current => Number(current.record.pokedexId) === 381);
  const productiveMembers = team.filter(current => current.record.id !== gardevoir.id);
  const productiveHelpEnergy = productiveMembers.reduce((sum, current) => (
    sum + scoring.immediateHelpBaseEnergy(current.record, current.favoriteShare)
  ), 0) / productiveMembers.length;
  const gardevoirMember = team.find(current => current.record.id === gardevoir.id);
  const effect = scoring.healPulseScenario({
    level: scoring.healPulse.maxLevel,
    latiosPresent,
    helpEnergyPerHelp: productiveHelpEnergy,
    healerHelpEnergyPerHelp: scoring.immediateHelpBaseEnergy(
      gardevoir,
      gardevoirMember.favoriteShare
    ),
    productiveTargetShare: productiveMembers.length / team.length
  });
  const triggerMetrics = standard.collectionTriggerMetrics(
    latias,
    settings.collectionIntervalHours
  );
  return {
    outputIndex: triggerMetrics.collectedTriggerIndexPerDay * effect.singleUsePracticalValue,
    triggerMetrics,
    effect
  };
}

function latiosLatiasCoalitionAttribution(records, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  const scenario = SPECIAL_TEAM_SCENARIOS.find(candidate => (
    candidate.id === 'latios-latias-amber-canyon'
  ));
  const parts = buildScenarioTeams(records, scenario);
  const coalitionTeam = (includeLatios, includeLatias) => {
    const selected = [
      ...(includeLatios ? [member(parts.primarySpecial, 'special', 1)] : []),
      ...(includeLatias ? [member(parts.partnerSpecial, 'special-partner', 1)] : [])
    ];
    const team = [
      member(parts.gardevoir, 'healer', 0),
      ...selected,
      ...Array.from(
        { length: 4 - selected.length },
        () => member(parts.berryHelper, 'berry', 1)
      )
    ];
    validateSpecialTeam(team);
    return team;
  };
  const gardevoir = gardevoirSkillOutputIndex(records, parts.gardevoir, settings);
  const evaluate = (includeLatios, includeLatias) => {
    const team = coalitionTeam(includeLatios, includeLatias);
    const helper = berryHelperSkillOutputIndex(team, settings);
    const meteor = includeLatios
      ? latiosMeteorOutputForTeam(parts.primarySpecial, team, settings)
      : { outputIndex: 0 };
    const healPulse = includeLatias
      ? latiasHealPulseOutputForTeam(parts.gardevoir, parts.partnerSpecial, team, settings)
      : { outputIndex: 0 };
    const ordinaryEnergy = teamOrdinaryEnergyPerDay(team);
    const outputIndex = (
      scoring.directEnergyPracticalValue(ordinaryEnergy)
      + gardevoir.outputIndex
      + helper.outputIndex
      + meteor.outputIndex
      + healPulse.outputIndex
    );
    return {
      team: teamName(team),
      outputIndex,
      equivalentEnergyPerDay: equivalentEnergyPerDay(outputIndex),
      ordinaryEnergyPerDay: ordinaryEnergy,
      berryHelperSkillOutputIndex: helper.outputIndex,
      meteorOutputIndex: meteor.outputIndex,
      healPulseOutputIndex: healPulse.outputIndex
    };
  };
  const baseline = evaluate(false, false);
  const latiosOnly = evaluate(true, false);
  const latiasOnly = evaluate(false, true);
  const pair = evaluate(true, true);
  const latiosShapleyOutputIndex = 0.5 * (
    latiosOnly.outputIndex - baseline.outputIndex
    + pair.outputIndex - latiasOnly.outputIndex
  );
  const latiasShapleyOutputIndex = 0.5 * (
    latiasOnly.outputIndex - baseline.outputIndex
    + pair.outputIndex - latiosOnly.outputIndex
  );
  const pairNetOutputIndex = pair.outputIndex - baseline.outputIndex;
  const synergyOutputIndex = (
    pair.outputIndex - latiosOnly.outputIndex - latiasOnly.outputIndex + baseline.outputIndex
  );
  return {
    islandId: parts.island.id,
    islandNameZh: parts.island.nameZh,
    baselineTeam: baseline.team,
    latiosOnlyTeam: latiosOnly.team,
    latiasOnlyTeam: latiasOnly.team,
    pairTeam: pair.team,
    baselineOutputIndex: round(baseline.outputIndex),
    latiosOnlyOutputIndex: round(latiosOnly.outputIndex),
    latiasOnlyOutputIndex: round(latiasOnly.outputIndex),
    pairOutputIndex: round(pair.outputIndex),
    pairNetOutputIndex: round(pairNetOutputIndex),
    synergyOutputIndex: round(synergyOutputIndex),
    latiosPokedexId: parts.primarySpecial.pokedexId,
    latiasPokedexId: parts.partnerSpecial.pokedexId,
    latiosShapleyOutputIndex: round(latiosShapleyOutputIndex),
    latiasShapleyOutputIndex: round(latiasShapleyOutputIndex),
    latiosAttributedYieldCoefficient: round(
      1 + latiosShapleyOutputIndex / baseline.outputIndex,
      4
    ),
    latiasAttributedYieldCoefficient: round(
      1 + latiasShapleyOutputIndex / baseline.outputIndex,
      4
    ),
    pairYieldCoefficient: round(pair.outputIndex / baseline.outputIndex, 4),
    status: 'shapley-attribution-of-latios-latias-pair-over-gardevoir-four-salamence'
  };
}

function equivalentEnergyPerDay(outputIndex) {
  return (
    outputIndex
    / scoring.energyChargeM.singleUsePracticalValue
    * scoring.energyChargeM.energyByLevel[scoring.energyChargeM.maxLevel]
  );
}

function specialTeamComparisonRows(records, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  if (!(settings.collectionIntervalHours > 0)) throw new Error('收菜间隔必须大于0小时');
  return SPECIAL_TEAM_SCENARIOS.map(scenario => {
    const parts = buildScenarioTeams(records, scenario);
    const gardevoir = gardevoirSkillOutputIndex(records, parts.gardevoir, settings);
    const candidateHelper = berryHelperSkillOutputIndex(parts.candidateTeam, settings);
    const baselineHelper = berryHelperSkillOutputIndex(parts.baselineTeam, settings);
    const special = scenario.specialModel === 'helper-boost'
      ? helperBoostSpecialOutput(parts.primarySpecial, parts.candidateTeam, settings)
      : latiosLatiasSpecialOutput(parts, settings);
    const candidateOrdinaryEnergy = teamOrdinaryEnergyPerDay(parts.candidateTeam);
    const baselineOrdinaryEnergy = teamOrdinaryEnergyPerDay(parts.baselineTeam);
    const candidateOutputIndex = (
      scoring.directEnergyPracticalValue(candidateOrdinaryEnergy)
      + gardevoir.outputIndex
      + candidateHelper.outputIndex
      + special.outputIndex
    );
    const baselineOutputIndex = (
      scoring.directEnergyPracticalValue(baselineOrdinaryEnergy)
      + gardevoir.outputIndex
      + baselineHelper.outputIndex
    );
    const coefficient = candidateOutputIndex / baselineOutputIndex;
    return {
      id: scenario.id,
      nameZh: scenario.nameZh,
      islandId: parts.island.id,
      islandNameZh: parts.island.nameZh,
      candidateTeam: teamName(parts.candidateTeam),
      baselineTeam: teamName(parts.baselineTeam),
      primarySpecialPokedexId: parts.primarySpecial.pokedexId,
      primarySpecialNameZh: displayName(parts.primarySpecial),
      partnerSpecialPokedexId: parts.partnerSpecial?.pokedexId ?? null,
      partnerSpecialNameZh: parts.partnerSpecial ? displayName(parts.partnerSpecial) : null,
      berryHelperNameZh: displayName(parts.berryHelper),
      specialRuleStatus: parts.specialRule.ruleStatus,
      specialEffect: special.componentLabel,
      specialSkillOutputIndex: round(special.outputIndex),
      specialComponentOutputIndexes: special.componentOutputIndexes
        ? Object.fromEntries(Object.entries(special.componentOutputIndexes).map(
          ([key, value]) => [key, round(value)]
        ))
        : null,
      specialTriggerPerDay: round(special.triggerMetrics.collectedTriggerIndexPerDay, 3),
      specialTriggerRetentionPct: round(special.triggerMetrics.retentionRatio * 100, 1),
      partnerSpecialTriggerPerDay: special.secondaryTriggerMetrics
        ? round(special.secondaryTriggerMetrics.collectedTriggerIndexPerDay, 3)
        : null,
      partnerSpecialTriggerRetentionPct: special.secondaryTriggerMetrics
        ? round(special.secondaryTriggerMetrics.retentionRatio * 100, 1)
        : null,
      helperBoostDistinctSpecies: special.effect?.distinctSpecies ?? null,
      helperBoostHelpsPerHelper: special.effect?.helpsPerHelper ?? null,
      helperBoostTotalHelps: special.effect?.totalHelps ?? null,
      distinctDragonSpecies: special.meteorEffect ? (
        new Set(parts.candidateTeam
          .filter(current => Number(current.record.typeId) === 15)
          .map(current => Number(current.record.pokedexId))).size
      ) : null,
      meteorSelfBerryCount: special.meteorEffect?.selfBerryCount ?? null,
      meteorTeammateBerryCount: special.meteorEffect?.teammateBerryCount ?? null,
      meteorTotalBerryCount: special.meteorEffect?.totalBerryCount ?? null,
      healPulseHelpsPerTarget: special.healPulseEffect?.helpsPerTarget ?? null,
      healPulseTotalHelps: special.healPulseEffect?.totalHelps ?? null,
      candidateOrdinaryEnergyPerDay: round(candidateOrdinaryEnergy),
      baselineOrdinaryEnergyPerDay: round(baselineOrdinaryEnergy),
      candidateBerryHelperSkillOutputIndex: round(candidateHelper.outputIndex),
      baselineBerryHelperSkillOutputIndex: round(baselineHelper.outputIndex),
      candidateTeamOutputIndex: round(candidateOutputIndex),
      baselineTeamOutputIndex: round(baselineOutputIndex),
      candidateTeamEquivalentEnergyPerDay: round(equivalentEnergyPerDay(candidateOutputIndex)),
      baselineTeamEquivalentEnergyPerDay: round(equivalentEnergyPerDay(baselineOutputIndex)),
      netEquivalentEnergyPerDay: round(equivalentEnergyPerDay(candidateOutputIndex - baselineOutputIndex)),
      yieldCoefficient: round(coefficient, 4),
      netYieldPct: round((coefficient - 1) * 100, 2),
      gardevoirSkillRetentionPct: round(gardevoir.triggerMetrics.retentionRatio * 100, 1),
      berryHelperSkillRetentionPct: candidateHelper.triggerMetrics
        ? round(candidateHelper.triggerMetrics.retentionRatio * 100, 1)
        : null,
      collectionIntervalHours: settings.collectionIntervalHours,
      goodCamp: settings.goodCamp,
      ingredientAvailability: settings.ingredientAvailability,
      status: [
        parts.specialRule.ruleStatus,
        candidateHelper.aggregationStatus,
        'fixed-equivalent-yield-not-dynamic-energy-overcap'
      ].filter(Boolean).join(';')
    };
  });
}

function markdown(rows) {
  return [
    '| 特殊队 | 岛屿 | 候选队 | 基准队 | 专属技能实际档位 | 候选等效收益/日 | 基准/日 | 净收益/日 | 系数 | 净收益率 | 特殊触发/日 | 状态 |',
    '|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|',
    ...rows.map(row => `| ${row.nameZh} | ${row.islandNameZh} | ${row.candidateTeam} | ${row.baselineTeam} | ${row.specialEffect} | ${row.candidateTeamEquivalentEnergyPerDay} | ${row.baselineTeamEquivalentEnergyPerDay} | ${row.netEquivalentEnergyPerDay} | ${row.yieldCoefficient.toFixed(4)} | ${row.netYieldPct.toFixed(2)}% | ${row.specialTriggerPerDay.toFixed(3)}${row.partnerSpecialTriggerPerDay == null ? '' : `＋${row.partnerSpecialTriggerPerDay.toFixed(3)}`} | ${row.status} |`)
  ].join('\n');
}

function selfTest(records) {
  const rows = specialTeamComparisonRows(records);
  if (rows.length !== SPECIAL_TEAM_SCENARIOS.length) {
    throw new Error(`特殊队数量错误：${rows.length}`);
  }
  const beasts = rows.filter(row => row.helperBoostDistinctSpecies !== null);
  if (!beasts.every(row => (
    row.helperBoostDistinctSpecies === 2
    && row.helperBoostHelpsPerHelper === 6
    && row.helperBoostTotalHelps === 30
  ))) {
    throw new Error('三圣兽重复树果手队没有按2种同属性／每人6次计算');
  }
  const twins = rows.find(row => row.id === 'latios-latias-amber-canyon');
  if (!twins || twins.specialRuleStatus !== 'legal-latias-latios-special-pair-exception') {
    throw new Error('拉帝亚斯＋拉帝欧斯同队例外没有生效');
  }
  if (!(twins.distinctDragonSpecies === 3
    && twins.meteorSelfBerryCount === 65
    && twins.meteorTeammateBerryCount === 4
    && twins.meteorTotalBerryCount === 81
    && twins.healPulseTotalHelps === 14)) {
    throw new Error('拉帝双龙队专属技能档位计算错误');
  }
  if (!(twins.baselineBerryHelperSkillOutputIndex > 0
    && twins.status.includes('aggregated-cooking-power-team-state-weighted-slots'))) {
    throw new Error('暴飞龙料理强化没有按全队周状态合并');
  }
  if (!rows.every(row => Number.isFinite(row.yieldCoefficient) && row.yieldCoefficient > 0)) {
    throw new Error('特殊队存在无效收益系数');
  }
  const raikou = finalRecordByPokedexId(records, 243);
  const entei = finalRecordByPokedexId(records, 244);
  let illegalRejected = false;
  try {
    validateSpecialTeam([member(raikou, 'special', 1), member(entei, 'special', 1)]);
  } catch {
    illegalRejected = true;
  }
  if (!illegalRejected) throw new Error('普通特殊宝可梦双上场没有被拒绝');
  const attribution = latiosLatiasCoalitionAttribution(records);
  if (Math.abs(
    attribution.latiosShapleyOutputIndex
    + attribution.latiasShapleyOutputIndex
    - attribution.pairNetOutputIndex
  ) > 0.2) {
    throw new Error('拉帝双龙Shapley归因之和不等于组合净收益');
  }
  if (round(
    attribution.latiosAttributedYieldCoefficient
    + attribution.latiasAttributedYieldCoefficient - 1,
    4
  ) !== attribution.pairYieldCoefficient) {
    throw new Error('拉帝双龙归因系数没有还原组合系数');
  }
  return {
    checks: 9,
    rows: rows.length,
    coefficients: Object.fromEntries(rows.map(row => [row.id, row.yieldCoefficient]))
  };
}

module.exports = Object.freeze({
  defaults: DEFAULTS,
  scenarios: SPECIAL_TEAM_SCENARIOS,
  validateSpecialTeam,
  specialTeamComparisonRows,
  latiosLatiasCoalitionAttribution,
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
  if (!(settings.ingredientAvailability >= 0 && settings.ingredientAvailability <= 1)) {
    throw new Error('食材满足率必须是0至1');
  }
  if (args.includes('--self-test')) {
    process.stdout.write(`${JSON.stringify(selfTest(records), null, 2)}\n`);
  } else {
    const rows = specialTeamComparisonRows(records, settings);
    const format = option(args, '--format') || 'markdown';
    process.stdout.write(`${format === 'json' ? JSON.stringify(rows, null, 2) : markdown(rows)}\n`);
  }
}
