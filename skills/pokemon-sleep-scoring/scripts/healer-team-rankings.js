#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');
const scoring = require('./species-scores.js');
const standardTeams = require('./standard-team-rankings.js');

const TYPE_NAMES_ZH = Object.freeze({
  1: '一般', 2: '火', 3: '水', 4: '电', 5: '草', 6: '冰',
  7: '格斗', 8: '毒', 9: '地面', 10: '飞行', 11: '超能',
  12: '虫', 13: '岩石', 14: '幽灵', 15: '龙', 16: '恶',
  17: '钢', 18: '妖精'
});

const DISPLAY_NAME_OVERRIDES = Object.freeze({
  '呆殼獸': '呆壳兽',
  '葉伊布': '叶伊布',
  '土台龜': '土台龟',
  '巴布土撥': '巴布土拨',
  '克雷色利亞': '克雷色利亚',
  '托戈德瑪爾': '托戈德玛尔',
  '壺壺': '壶壶',
  '拉帝亞斯': '拉帝亚斯',
  '大竺葵': '大竺葵',
  '火爆獸': '火爆兽',
  '大力鱷': '大力鳄',
  '暴飛龍': '暴飞龙',
  '九尾（阿羅拉的樣子）': '阿罗拉九尾'
});

const HEALER_MAIN_SKILL_IDS = new Set([
  scoring.energizingCheer.mainSkillId,
  scoring.standardE4e.mainSkillId,
  scoring.moonlight.mainSkillId,
  scoring.crescentPrayer.mainSkillId,
  scoring.nuzzle.mainSkillId,
  scoring.berryJuice.mainSkillId,
  scoring.healPulse.mainSkillId
]);

const DEFAULTS = Object.freeze({
  days: 7,
  level: 70,
  collectionIntervalHours: 4,
  startingEnergy: 100,
  maximumEnergy: 150,
  goodCamp: true,
  goodCampSpeedMultiplier: 1.2,
  goodCampCarryMultiplier: 1.2,
  includeMealRecovery: true,
  // Standard comparison clock: wake at 06:00, meals at 08:00/12:00/20:00.
  mealMinutesAfterWake: Object.freeze([120, 360, 840]),
  basePotCapacity: 81,
  ingredientAvailability: 0.5,
  cookingProfileId: 'user-activity',
  startingBerryJuice: 0,
  berryJuiceUseThreshold: 80
});

const BERRY_JUICE_ITEM = Object.freeze({
  maximumInventory: 5,
  usableBelowEnergy: 100,
  maximumRecoveredEnergy: 123
});

const ENERGY_INTERVAL_MULTIPLIERS = Object.freeze([
  Object.freeze({ above: 80, intervalMultiplier: 0.45 }),
  Object.freeze({ above: 60, intervalMultiplier: 0.52 }),
  Object.freeze({ above: 40, intervalMultiplier: 0.58 }),
  Object.freeze({ above: 1, intervalMultiplier: 0.66 }),
  Object.freeze({ above: -Infinity, intervalMultiplier: 1 })
]);

const RETAINED_TRIGGER_CACHE = new Map();

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

function energyIntervalMultiplier(energy) {
  return ENERGY_INTERVAL_MULTIPLIERS.find(row => energy > row.above).intervalMultiplier;
}

function mealRecoveryAtEnergy(energy) {
  if (energy >= 81) return 1;
  if (energy >= 71) return 2;
  if (energy >= 61) return 3;
  if (energy >= 51) return 4;
  if (energy >= 41) return 5;
  if (energy >= 31) return 6;
  if (energy >= 21) return 7;
  if (energy >= 11) return 8;
  return 9;
}

function naturalMainSkillLevel(record) {
  return Math.max(1, Number(record.evolution?.stage) || 1);
}

function maximumHealerSkillLevel(record) {
  const skillId = Number(record.mainSkill?.id);
  if (skillId === scoring.energizingCheer.mainSkillId) return scoring.energizingCheer.maxLevel;
  if (skillId === scoring.standardE4e.mainSkillId) return scoring.standardE4e.maxLevel;
  if (skillId === scoring.moonlight.mainSkillId) return scoring.moonlight.maxLevel;
  if (skillId === scoring.crescentPrayer.mainSkillId) return scoring.crescentPrayer.maxLevel;
  if (skillId === scoring.nuzzle.mainSkillId) return scoring.nuzzle.maxLevel;
  if (skillId === scoring.berryJuice.mainSkillId) return scoring.berryJuice.maxLevel;
  if (skillId === scoring.healPulse.mainSkillId) return scoring.healPulse.maxLevel;
  throw new Error(`${displayName(record)}不是当前回复手候选`);
}

function campAdjustedRecord(record, settings) {
  if (!settings.goodCamp) return record;
  return {
    ...record,
    carryLimitRaisedFromFirstStage: Math.ceil(
      Number(record.carryLimitRaisedFromFirstStage) * settings.goodCampCarryMultiplier
    )
  };
}

function expectedItemsPerHelp(record) {
  return scoring.itemCountDistributionPerHelp(record).reduce(
    (sum, outcome) => sum + outcome.count * outcome.probability,
    0
  );
}

function retainedTriggersForHelps(record, expectedHelps, settings) {
  if (!(expectedHelps > 0)) {
    return { expectedStoredTriggers: 0, retentionRatio: 1, fullInventoryProbability: 0 };
  }
  const cacheKey = [
    record.id,
    round(expectedHelps, 6),
    settings.level,
    settings.goodCamp ? 1 : 0,
    settings.goodCampCarryMultiplier
  ].join('|');
  const cached = RETAINED_TRIGGER_CACHE.get(cacheKey);
  if (cached) return cached;
  const levelInterval = scoring.helpIntervalAtLevel(record.helpFrequencyBaseSec, settings.level);
  const equivalentHoursAtStandardTwoTimesEnergy = (
    expectedHelps * levelInterval / scoring.averageEnergySpeedMultiplier / 3600
  );
  const metrics = scoring.unattendedSkillStorageMetrics(
    campAdjustedRecord(record, settings),
    equivalentHoursAtStandardTwoTimesEnergy,
    100
  );
  RETAINED_TRIGGER_CACHE.set(cacheKey, metrics);
  return metrics;
}

function ordinaryEnergyForInterval(member, expectedHelps, settings) {
  if (!(expectedHelps > 0)) return 0;
  const adjusted = campAdjustedRecord(member.record, settings);
  const itemsPerHelp = expectedItemsPerHelp(member.record);
  const beforeFullHelps = Math.min(
    expectedHelps,
    adjusted.carryLimitRaisedFromFirstStage / itemsPerHelp
  );
  const sneakySnackingHelps = Math.max(expectedHelps - beforeFullHelps, 0);
  const normalEnergyPerHelp = scoring.immediateHelpBaseEnergy(
    member.record,
    member.favoriteShare
  );
  const sneakyEnergyPerHelp = (
    scoring.berryEnergyPerBerry(member.record, member.favoriteShare)
    * Number(member.record.baseBerryCount)
  );
  return (
    beforeFullHelps * normalEnergyPerHelp
    + sneakySnackingHelps * sneakyEnergyPerHelp
  );
}

function createMember(record, favoriteShare, role) {
  return {
    record,
    favoriteShare,
    role,
    energy: DEFAULTS.startingEnergy,
    intervalHelps: 0,
    totalHelps: 0,
    totalTriggers: 0,
    ordinaryEnergy: 0,
    directSkillEnergy: 0,
    energyMinuteSum: 0,
    minutesAbove80: 0,
    fullInventoryProbabilitySum: 0,
    collectionCount: 0
  };
}

function addHealing(member, amount, settings) {
  member.energy = Math.min(settings.maximumEnergy, member.energy + Math.max(amount, 0));
}

function addAllHealing(members, amountPerMember, settings) {
  members.forEach(member => addHealing(member, amountPerMember, settings));
}

function addUniformRandomTargetHealing(members, totalHealing, settings) {
  addAllHealing(members, totalHealing / members.length, settings);
}

function createBerryJuiceState(candidate, settings) {
  if (Number(candidate?.mainSkill?.id) !== scoring.berryJuice.mainSkillId) return null;
  const startingInventory = Number(settings.startingBerryJuice);
  if (!(startingInventory >= 0 && startingInventory <= BERRY_JUICE_ITEM.maximumInventory)) {
    throw new Error(`树果汁期初库存必须在0到${BERRY_JUICE_ITEM.maximumInventory}之间`);
  }
  const useThreshold = Number(settings.berryJuiceUseThreshold);
  if (!(useThreshold >= 0 && useThreshold < BERRY_JUICE_ITEM.usableBelowEnergy)) {
    throw new Error('树果汁使用阈值必须在0到99之间');
  }
  return {
    startingInventory,
    inventory: startingInventory,
    useThreshold,
    generatedBottles: 0,
    blockedAtCapBottles: 0,
    usedBottles: 0,
    effectiveRecovery: 0
  };
}

function generateBerryJuice(state, triggers) {
  if (!state || !(triggers > 0)) return;
  const potential = scoring.berryJuice.juiceProbability * triggers;
  const accepted = Math.min(
    potential,
    Math.max(BERRY_JUICE_ITEM.maximumInventory - state.inventory, 0)
  );
  state.inventory += accepted;
  state.generatedBottles += accepted;
  state.blockedAtCapBottles += potential - accepted;
}

function useStoredBerryJuice(state, members) {
  if (!state || !(state.inventory > 1e-9)) return;
  while (state.inventory > 1e-9) {
    const eligible = members
      .filter(member => (
        member.role === 'berry'
        && member.energy <= state.useThreshold
        && member.energy < BERRY_JUICE_ITEM.usableBelowEnergy
      ))
      .sort((left, right) => left.energy - right.energy);
    if (!eligible.length) break;
    const target = eligible[0];
    const bottleFraction = Math.min(state.inventory, 1);
    const recovery = Math.min(
      scoring.berryJuice.juiceRecovery * bottleFraction,
      BERRY_JUICE_ITEM.maximumRecoveredEnergy - target.energy
    );
    if (!(recovery > 1e-9)) break;
    target.energy += recovery;
    state.inventory -= bottleFraction;
    state.usedBottles += bottleFraction;
    state.effectiveRecovery += recovery;
  }
}

function energyFromPracticalValue(value) {
  return (
    value
    / scoring.energyChargeM.singleUsePracticalValue
    * scoring.energyChargeM.energyByLevel[scoring.energyChargeM.maxLevel]
  );
}

function helperSkillEnergy(record, triggers, members, settings, cookingSources) {
  if (!(triggers > 0)) return 0;
  const skillId = Number(record.mainSkill?.id);
  const naturalLevel = naturalMainSkillLevel(record);
  if (skillId === scoring.energyChargeSFixed.mainSkillId) {
    const level = Math.min(naturalLevel, scoring.energyChargeSFixed.maxLevel);
    return triggers * scoring.energyChargeSFixedEffect(level).baseEnergy;
  }
  if (skillId === scoring.energyChargeSRandom.mainSkillId) {
    const level = Math.min(naturalLevel, scoring.energyChargeSRandom.maxLevel);
    return triggers * scoring.energyChargeSRandomEffect(level).expectedBaseEnergy;
  }
  if (skillId === scoring.helpingSupportS.mainSkillId) {
    const level = Math.min(naturalLevel, scoring.helpingSupportS.maxLevel);
    const averageTargetEnergy = members.reduce((sum, member) => (
      sum + scoring.immediateHelpBaseEnergy(member.record, member.favoriteShare)
    ), 0) / members.length;
    return triggers * scoring.helpingSupportS.helpsByLevel[level] * averageTargetEnergy;
  }
  if (skillId === scoring.cookingPowerUp.ordinaryMainSkillId) {
    const level = Math.min(naturalLevel, scoring.cookingPowerUp.maxLevel);
    cookingSources.push({ triggers, level });
    return 0;
  }
  throw new Error(`尚未实现岛屿树果手${displayName(record)}的主技能#${skillId}`);
}

function applyNuzzleBonus(candidate, triggers, members, settings, cookingSources) {
  const level = scoring.nuzzle.maxLevel;
  const draws = scoring.nuzzle.bonusDrawsByLevel[level];
  let directEnergy = 0;
  for (const member of members) {
    const baseProbability = Number(member.record.skillRatePct) / 100;
    const successProbability = 1 - ((1 - baseProbability) ** draws);
    const bonusTriggers = Math.min(triggers * successProbability / members.length, 1);
    if (!(bonusTriggers > 0)) continue;
    if (member.record.id === candidate.id) {
      // One-generation expectation: the bonus Nuzzle restores Energy but does
      // not recursively create another Nuzzle bonus chain.
      addUniformRandomTargetHealing(
        members,
        scoring.nuzzle.healingByLevel[level] * bonusTriggers,
        settings
      );
    } else {
      directEnergy += helperSkillEnergy(
        member.record,
        bonusTriggers,
        members,
        settings,
        cookingSources
      );
    }
  }
  return directEnergy;
}

function applyHealerSkill(candidate, triggers, members, settings, cookingSources, teamState) {
  if (!(triggers > 0)) return 0;
  const skillId = Number(candidate.mainSkill?.id);
  const level = maximumHealerSkillLevel(candidate);
  let directEnergy = 0;

  if (skillId === scoring.standardE4e.mainSkillId) {
    addAllHealing(members, scoring.standardE4e.healingPerHelper * triggers, settings);
  } else if (skillId === scoring.berryJuice.mainSkillId) {
    addAllHealing(members, scoring.berryJuice.healingPerHelper * triggers, settings);
    generateBerryJuice(teamState.berryJuice, triggers);
  } else if (skillId === scoring.energizingCheer.mainSkillId) {
    addUniformRandomTargetHealing(
      members,
      scoring.energizingCheer.healingByLevel[level] * triggers,
      settings
    );
  } else if (skillId === scoring.moonlight.mainSkillId) {
    addHealing(members[0], scoring.moonlight.selfHealingByLevel[level] * triggers, settings);
    addUniformRandomTargetHealing(
      members,
      scoring.moonlight.bonusHealingByLevel[level]
        * scoring.moonlight.bonusProbability
        * triggers,
      settings
    );
  } else if (skillId === scoring.nuzzle.mainSkillId) {
    addUniformRandomTargetHealing(
      members,
      scoring.nuzzle.healingByLevel[level] * triggers,
      settings
    );
    directEnergy += applyNuzzleBonus(candidate, triggers, members, settings, cookingSources);
  } else if (skillId === scoring.healPulse.mainSkillId) {
    const totalHealing = (
      scoring.healPulse.targetCount
      * scoring.healPulse.healingByLevel[level]
      * triggers
    );
    addUniformRandomTargetHealing(members, totalHealing, settings);
    const helpsPerTarget = scoring.healPulse.helpsByLevel[level];
    const expectedHelpsPerMember = (
      scoring.healPulse.targetCount / members.length * helpsPerTarget * triggers
    );
    directEnergy += members.reduce((sum, member) => (
      sum
      + expectedHelpsPerMember
        * scoring.immediateHelpBaseEnergy(member.record, member.favoriteShare)
    ), 0);
  } else if (skillId === scoring.crescentPrayer.mainSkillId) {
    addAllHealing(members, scoring.crescentPrayer.healingPerHelper * triggers, settings);
    const counts = scoring.crescentPrayer.berryCountsByDistinctPsychicSpecies[1];
    directEnergy += triggers * (
      counts.cresselia * scoring.berryEnergyPerBerry(candidate, members[0].favoriteShare)
      + counts.eachTeammate * members.slice(1).reduce((sum, member) => (
        sum + scoring.berryEnergyPerBerry(member.record, member.favoriteShare)
      ), 0)
    );
  } else {
    throw new Error(`尚未实现回复技能#${skillId}`);
  }

  return directEnergy;
}

function cookingEnergyFromSources(sources, settings) {
  if (!sources.length) return 0;
  const totalTriggers = sources.reduce((sum, source) => sum + source.triggers, 0);
  if (!(totalTriggers > 0)) return 0;
  const weightedLevel = sources.reduce(
    (sum, source) => sum + source.triggers * source.level,
    0
  ) / totalTriggers;
  const roundedLevel = Math.max(1, Math.min(
    scoring.cookingPowerUp.maxLevel,
    Math.round(weightedLevel)
  ));
  const scenario = scoring.cookingPowerWeeklyScenario({
    triggerMeanPerMeal: totalTriggers / settings.days / scoring.cookingPowerUp.mealsPerDay,
    level: roundedLevel,
    profileId: settings.cookingProfileId,
    basePotCapacity: settings.basePotCapacity,
    ingredientAvailability: settings.ingredientAvailability,
    goodCamp: settings.goodCamp
  });
  return energyFromPracticalValue(scenario.theoreticalOutputIndex) * settings.days;
}

function collectTeam(members, candidate, settings, cookingSources, teamState) {
  const triggerRows = members.map(member => {
    member.ordinaryEnergy += ordinaryEnergyForInterval(
      member,
      member.intervalHelps,
      settings
    );
    const metrics = retainedTriggersForHelps(member.record, member.intervalHelps, settings);
    member.intervalHelps = 0;
    member.totalTriggers += metrics.expectedStoredTriggers;
    member.fullInventoryProbabilitySum += metrics.fullInventoryProbability;
    member.collectionCount += 1;
    return { member, triggers: metrics.expectedStoredTriggers };
  });

  let directEnergy = 0;
  for (const row of triggerRows) {
    if (row.member.role === 'healer') continue;
    const output = helperSkillEnergy(
      row.member.record,
      row.triggers,
      members,
      settings,
      cookingSources
    );
    row.member.directSkillEnergy += output;
    directEnergy += output;
  }

  if (candidate) {
    const healerRow = triggerRows.find(row => row.member.role === 'healer');
    const output = applyHealerSkill(
      candidate,
      healerRow.triggers,
      members,
      settings,
      cookingSources,
      teamState
    );
    healerRow.member.directSkillEnergy += output;
    directEnergy += output;
  }
  return directEnergy;
}

function simulateTeam({ candidate = null, berryHelper, berryCount, settings }) {
  const members = [
    ...(candidate ? [createMember(candidate, 1, 'healer')] : []),
    ...Array.from({ length: berryCount }, () => createMember(berryHelper, 1, 'berry'))
  ];
  if (members.length !== 5) throw new Error('标准队必须正好有5只宝可梦');

  const collectionMinutes = Math.round(settings.collectionIntervalHours * 60);
  if (1440 % collectionMinutes !== 0) {
    throw new Error('当前动态模型要求收菜间隔能整除24小时');
  }
  const mealMinutes = new Set(settings.includeMealRecovery ? settings.mealMinutesAfterWake : []);
  const cookingSources = [];
  const teamState = { berryJuice: createBerryJuiceState(candidate, settings) };
  let directSkillEnergy = 0;

  for (let day = 0; day < settings.days; day += 1) {
    for (let minute = 1; minute <= 1440; minute += 1) {
      for (const member of members) {
        member.energyMinuteSum += member.energy;
        if (member.energy > 80) member.minutesAbove80 += 1;
        const goodCampSpeed = settings.goodCamp ? settings.goodCampSpeedMultiplier : 1;
        const helpsThisMinute = (
          60
          * goodCampSpeed
          / scoring.helpIntervalAtLevel(member.record.helpFrequencyBaseSec, settings.level)
          / energyIntervalMultiplier(member.energy)
        );
        member.intervalHelps += helpsThisMinute;
        member.totalHelps += helpsThisMinute;
      }

      if (minute % 10 === 0) {
        members.forEach(member => { member.energy = Math.max(0, member.energy - 1); });
      }

      if (mealMinutes.has(minute)) {
        members.forEach(member => addHealing(
          member,
          mealRecoveryAtEnergy(member.energy),
          settings
        ));
      }

      if (minute % collectionMinutes === 0) {
        if (minute === 1440) {
          // With Sleep Score 100, sleep recovery first restores every active
          // helper to 100; the morning collection can then push Energy above 100.
          members.forEach(member => { member.energy = settings.startingEnergy; });
        }
        directSkillEnergy += collectTeam(
          members,
          candidate,
          settings,
          cookingSources,
          teamState
        );
      }

      // Berry Juice is a stored item, not automatic healing. The default
      // policy holds it until a Berry specialist leaves the fastest Energy
      // bracket, then targets the lowest-Energy Berry specialist. Running this
      // after skill collection lets normal team healing resolve first and
      // avoids spending a bottle immediately before the daily sleep reset.
      useStoredBerryJuice(teamState.berryJuice, members);
    }
  }

  const cookingEnergy = cookingEnergyFromSources(cookingSources, settings);
  const ordinaryEnergy = members.reduce((sum, member) => sum + member.ordinaryEnergy, 0);
  const totalSkillEnergy = directSkillEnergy + cookingEnergy;
  const totalEnergy = ordinaryEnergy + totalSkillEnergy;
  const totalMinutes = settings.days * 1440;
  const berryMembers = members.filter(member => member.role === 'berry');
  const averageBerry = metric => berryMembers.reduce((sum, member) => sum + metric(member), 0) / berryMembers.length;
  const healer = members.find(member => member.role === 'healer');

  return {
    members,
    ordinaryEnergy,
    directSkillEnergy,
    cookingEnergy,
    totalSkillEnergy,
    totalEnergy,
    totalEnergyPerDay: totalEnergy / settings.days,
    berryHelpCountPerDayEach: averageBerry(member => member.totalHelps) / settings.days,
    berryTriggerCountPerDayEach: averageBerry(member => member.totalTriggers) / settings.days,
    berryAverageEnergy: averageBerry(member => member.energyMinuteSum / totalMinutes),
    berryAbove80Pct: averageBerry(member => member.minutesAbove80 / totalMinutes * 100),
    berryFullInventoryProbabilityPct: averageBerry(member => (
      member.fullInventoryProbabilitySum / member.collectionCount * 100
    )),
    healerHelpCountPerDay: healer ? healer.totalHelps / settings.days : null,
    healerTriggerCountPerDay: healer ? healer.totalTriggers / settings.days : null,
    healerAverageEnergy: healer ? healer.energyMinuteSum / totalMinutes : null,
    healerAbove80Pct: healer ? healer.minutesAbove80 / totalMinutes * 100 : null,
    healerFullInventoryProbabilityPct: healer ? (
      healer.fullInventoryProbabilitySum / healer.collectionCount * 100
    ) : null,
    berryJuice: teamState.berryJuice ? {
      ...teamState.berryJuice,
      endingInventory: teamState.berryJuice.inventory,
      reserveRecovery: teamState.berryJuice.inventory * scoring.berryJuice.juiceRecovery
    } : null
  };
}

function healerTeamRankingRows(records, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  const islandByType = new Map();
  standardTeams.islandStandards.forEach(island => {
    island.typeIds.forEach(typeId => islandByType.set(Number(typeId), island));
  });
  const recordByPokedexId = new Map(
    records.filter(record => record.isFinalEvolution).map(record => [Number(record.pokedexId), record])
  );
  const baselineByIsland = new Map();

  const candidates = records.filter(record => (
    record.isFinalEvolution
    && record.specialty === 'skill'
    && HEALER_MAIN_SKILL_IDS.has(Number(record.mainSkill?.id))
  ));

  const rows = candidates.map(candidate => {
    const island = islandByType.get(Number(candidate.typeId));
    if (!island) throw new Error(`${displayName(candidate)}没有固定岛屿映射`);
    const berryHelper = recordByPokedexId.get(Number(island.berryHelperPokedexId));
    if (!berryHelper) throw new Error(`${island.nameZh}缺少指定树果手#${island.berryHelperPokedexId}`);

    let baseline = baselineByIsland.get(island.id);
    if (!baseline) {
      baseline = simulateTeam({ candidate: null, berryHelper, berryCount: 5, settings });
      baselineByIsland.set(island.id, baseline);
    }
    const candidateTeam = simulateTeam({ candidate, berryHelper, berryCount: 4, settings });
    const coefficient = candidateTeam.totalEnergy / baseline.totalEnergy;
    const randomTargetApproximation = [
      scoring.energizingCheer.mainSkillId,
      scoring.moonlight.mainSkillId,
      scoring.nuzzle.mainSkillId,
      scoring.healPulse.mainSkillId
    ].includes(Number(candidate.mainSkill?.id));
    const status = [
      ...(randomTargetApproximation ? ['random-target-uniform-expectation'] : []),
      ...(Number(candidate.mainSkill?.id) === scoring.nuzzle.mainSkillId
        ? ['nuzzle-one-generation-bonus']
        : []),
      ...(Number(candidate.mainSkill?.id) === scoring.berryJuice.mainSkillId
        ? [
          'berry-juice-25pct-provisional',
          'berry-juice-stateful-expected-inventory',
          `berry-juice-use-at-${settings.berryJuiceUseThreshold}-or-lower`
        ]
        : []),
      'dynamic-energy-confirmed-brackets'
    ].join(';');

    return {
      id: candidate.id,
      pokedexId: candidate.pokedexId,
      nameZh: displayName(candidate),
      nameEn: candidate.nameEn,
      typeId: candidate.typeId,
      typeNameZh: TYPE_NAMES_ZH[candidate.typeId] || `类型${candidate.typeId}`,
      mainSkillId: candidate.mainSkill.id,
      skillNameZh: candidate.mainSkill.nameZh,
      islandId: island.id,
      islandNameZh: island.nameZh,
      berryHelperNameZh: displayName(berryHelper),
      candidateTeam: `${displayName(candidate)}＋${displayName(berryHelper)}×4`,
      baselineTeam: `${displayName(berryHelper)}×5`,
      candidateEnergyPerDay: round(candidateTeam.totalEnergyPerDay),
      baselineEnergyPerDay: round(baseline.totalEnergyPerDay),
      netEnergyPerDay: round(candidateTeam.totalEnergyPerDay - baseline.totalEnergyPerDay),
      yieldCoefficient: round(coefficient, 4),
      netYieldPct: round((coefficient - 1) * 100, 2),
      healerTriggerCountPerDay: round(candidateTeam.healerTriggerCountPerDay, 3),
      healerHelpCountPerDay: round(candidateTeam.healerHelpCountPerDay, 2),
      healerAverageEnergy: round(candidateTeam.healerAverageEnergy, 1),
      healerAbove80Pct: round(candidateTeam.healerAbove80Pct, 1),
      candidateBerryHelpCountPerDayEach: round(candidateTeam.berryHelpCountPerDayEach, 2),
      baselineBerryHelpCountPerDayEach: round(baseline.berryHelpCountPerDayEach, 2),
      berryHelpGainPct: round(
        (candidateTeam.berryHelpCountPerDayEach / baseline.berryHelpCountPerDayEach - 1) * 100,
        2
      ),
      candidateBerryAverageEnergy: round(candidateTeam.berryAverageEnergy, 1),
      baselineBerryAverageEnergy: round(baseline.berryAverageEnergy, 1),
      candidateBerryAbove80Pct: round(candidateTeam.berryAbove80Pct, 1),
      baselineBerryAbove80Pct: round(baseline.berryAbove80Pct, 1),
      candidateOrdinaryEnergyPerDay: round(candidateTeam.ordinaryEnergy / settings.days),
      candidateSkillEnergyPerDay: round(candidateTeam.totalSkillEnergy / settings.days),
      baselineOrdinaryEnergyPerDay: round(baseline.ordinaryEnergy / settings.days),
      baselineSkillEnergyPerDay: round(baseline.totalSkillEnergy / settings.days),
      berryJuiceStartingInventory: candidateTeam.berryJuice
        ? round(candidateTeam.berryJuice.startingInventory, 3)
        : null,
      berryJuiceGeneratedPerWeek: candidateTeam.berryJuice
        ? round(candidateTeam.berryJuice.generatedBottles, 3)
        : null,
      berryJuiceUsedPerWeek: candidateTeam.berryJuice
        ? round(candidateTeam.berryJuice.usedBottles, 3)
        : null,
      berryJuiceEndingInventory: candidateTeam.berryJuice
        ? round(candidateTeam.berryJuice.endingInventory, 3)
        : null,
      berryJuiceBlockedAtCapPerWeek: candidateTeam.berryJuice
        ? round(candidateTeam.berryJuice.blockedAtCapBottles, 3)
        : null,
      berryJuiceEffectiveRecoveryPerWeek: candidateTeam.berryJuice
        ? round(candidateTeam.berryJuice.effectiveRecovery, 1)
        : null,
      berryJuiceReserveRecovery: candidateTeam.berryJuice
        ? round(candidateTeam.berryJuice.reserveRecovery, 1)
        : null,
      collectionIntervalHours: settings.collectionIntervalHours,
      days: settings.days,
      goodCamp: settings.goodCamp,
      mealRecovery: settings.includeMealRecovery,
      status
    };
  }).sort((left, right) => (
    right.yieldCoefficient - left.yieldCoefficient
    || right.candidateEnergyPerDay - left.candidateEnergyPerDay
    || Number(left.pokedexId) - Number(right.pokedexId)
  ));

  return rows.map((row, index) => ({ rank: index + 1, ...row }));
}

function markdown(rows) {
  return [
    '| 排名 | 回复手X | 属性 | 岛屿 | 对比队伍 | X队能量/日 | 五树果基准/日 | 净增能/日 | 系数 | 净收益 | X触发/日 | 树果手帮忙增幅 | X队/基准树果手均活力 | 树果汁周状态（生成/使用/期末） | 状态 |',
    '|---:|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|',
    ...rows.map(row => `| ${row.rank} | ${row.nameZh} | ${row.typeNameZh} | ${row.islandNameZh} | ${row.candidateTeam} vs ${row.baselineTeam} | ${row.candidateEnergyPerDay} | ${row.baselineEnergyPerDay} | ${row.netEnergyPerDay} | ${row.yieldCoefficient.toFixed(4)} | ${row.netYieldPct.toFixed(2)}% | ${row.healerTriggerCountPerDay.toFixed(3)} | ${row.berryHelpGainPct.toFixed(2)}% | ${row.candidateBerryAverageEnergy.toFixed(1)} / ${row.baselineBerryAverageEnergy.toFixed(1)} | ${row.berryJuiceGeneratedPerWeek === null ? '—' : `${row.berryJuiceGeneratedPerWeek.toFixed(3)} / ${row.berryJuiceUsedPerWeek.toFixed(3)} / ${row.berryJuiceEndingInventory.toFixed(3)}`} | ${row.status} |`)
  ].join('\n');
}

function selfTest(records) {
  const checks = [
    ['活力81的间隔倍率', energyIntervalMultiplier(81), 0.45],
    ['活力80的间隔倍率', energyIntervalMultiplier(80), 0.52],
    ['活力60的间隔倍率', energyIntervalMultiplier(60), 0.58],
    ['活力40的间隔倍率', energyIntervalMultiplier(40), 0.66],
    ['活力1的间隔倍率', energyIntervalMultiplier(1), 1],
    ['活力0的间隔倍率', energyIntervalMultiplier(0), 1],
    ['活力10料理回复', mealRecoveryAtEnergy(10), 9],
    ['活力81料理回复', mealRecoveryAtEnergy(81), 1]
  ];
  checks.forEach(([label, actual, expected]) => {
    if (actual !== expected) throw new Error(`${label}失败：${actual} !== ${expected}`);
  });
  const rows = healerTeamRankingRows(records);
  if (!rows.length) throw new Error('回复手动态排名为空');
  if (!rows.every(row => Number.isFinite(row.yieldCoefficient) && row.yieldCoefficient > 0)) {
    throw new Error('回复手动态排名存在无效系数');
  }
  const gardevoir = rows.find(row => Number(row.pokedexId) === 282);
  if (!gardevoir) throw new Error('回复手动态排名缺少沙奈朵');
  if (gardevoir.islandId !== 'lapis-lakeside' || gardevoir.berryHelperNameZh !== '大竺葵') {
    throw new Error('沙奈朵没有使用宝蓝湖畔＋大竺葵标准队');
  }
  if (!(gardevoir.candidateBerryHelpCountPerDayEach > gardevoir.baselineBerryHelpCountPerDayEach)) {
    throw new Error('沙奈朵没有提升四只大竺葵的动态帮忙次数');
  }
  const shuckle = rows.find(row => Number(row.pokedexId) === 213);
  if (!shuckle) throw new Error('回复手动态排名缺少壶壶');
  if (!(shuckle.berryJuiceEndingInventory >= 0
    && shuckle.berryJuiceEndingInventory <= BERRY_JUICE_ITEM.maximumInventory)) {
    throw new Error('壶壶树果汁期末库存越界');
  }
  if (!(shuckle.berryJuiceGeneratedPerWeek + shuckle.berryJuiceBlockedAtCapPerWeek > 0)) {
    throw new Error('壶壶没有产生树果汁期望');
  }
  return {
    checks: checks.length + 7,
    healerRows: rows.length,
    gardevoirCoefficient: gardevoir.yieldCoefficient,
    shuckleCoefficient: shuckle.yieldCoefficient,
    shuckleEndingBerryJuice: shuckle.berryJuiceEndingInventory
  };
}

module.exports = Object.freeze({
  defaults: DEFAULTS,
  energyIntervalMultipliers: ENERGY_INTERVAL_MULTIPLIERS,
  energyIntervalMultiplier,
  mealRecoveryAtEnergy,
  retainedTriggersForHelps,
  simulateTeam,
  healerTeamRankingRows,
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
    days: Number(option(args, '--days') ?? DEFAULTS.days),
    goodCamp: !args.includes('--no-good-camp'),
    includeMealRecovery: !args.includes('--no-meal-recovery'),
    startingBerryJuice: Number(
      option(args, '--starting-berry-juice') ?? DEFAULTS.startingBerryJuice
    ),
    berryJuiceUseThreshold: Number(
      option(args, '--berry-juice-threshold') ?? DEFAULTS.berryJuiceUseThreshold
    )
  };
  if (args.includes('--self-test')) {
    process.stdout.write(`${JSON.stringify(selfTest(records), null, 2)}\n`);
  } else {
    const rows = healerTeamRankingRows(records, settings);
    const format = option(args, '--format') || 'markdown';
    process.stdout.write(`${format === 'json' ? JSON.stringify(rows, null, 2) : markdown(rows)}\n`);
  }
}
