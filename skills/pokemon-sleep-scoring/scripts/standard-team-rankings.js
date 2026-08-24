'use strict';

const fs = require('fs');
const path = require('path');
const scoring = require('./species-scores.js');

const TYPE_NAMES_ZH = Object.freeze({
  1: '一般', 2: '火', 3: '水', 4: '电', 5: '草', 6: '冰',
  7: '格斗', 8: '毒', 9: '地面', 10: '飞行', 11: '超能',
  12: '虫', 13: '岩石', 14: '幽灵', 15: '龙', 16: '恶',
  17: '钢', 18: '妖精'
});

// The user-defined fixed-island counterfactual. A candidate is assigned to the
// island whose fixed favorite-Berry set contains its type, then replaces one
// copy of that island's nominated Berry specialist.
const ISLAND_STANDARDS = Object.freeze([
  Object.freeze({
    id: 'cyan-beach',
    nameZh: '天青沙滩',
    typeIds: Object.freeze([3, 10, 18]),
    berryHelperPokedexId: 160
  }),
  Object.freeze({
    id: 'taupe-hollow',
    nameZh: '灰褐洞窟',
    typeIds: Object.freeze([2, 9, 13]),
    berryHelperPokedexId: 157
  }),
  Object.freeze({
    id: 'snowdrop-tundra',
    nameZh: '白花雪原',
    typeIds: Object.freeze([1, 6, 16]),
    berryHelperPokedexId: 7007
  }),
  Object.freeze({
    id: 'lapis-lakeside',
    nameZh: '宝蓝湖畔',
    typeIds: Object.freeze([5, 7, 11]),
    berryHelperPokedexId: 154
  }),
  Object.freeze({
    id: 'old-gold-power-plant',
    nameZh: '黄金发电厂',
    typeIds: Object.freeze([4, 14, 17]),
    berryHelperPokedexId: 26
  }),
  Object.freeze({
    id: 'amber-canyon',
    nameZh: '琥珀溪谷',
    typeIds: Object.freeze([8, 12, 15]),
    berryHelperPokedexId: 373
  })
]);

const ISLAND_BY_TYPE_ID = new Map();
for (const island of ISLAND_STANDARDS) {
  for (const typeId of island.typeIds) {
    if (ISLAND_BY_TYPE_ID.has(typeId)) {
      throw new Error(`属性${typeId}被分配到多个固定岛屿`);
    }
    ISLAND_BY_TYPE_ID.set(typeId, island);
  }
}

// Pokemon Sleep's one-special-Pokemon team group. Some entries are not skill
// specialists in the current snapshot, but keeping the complete known group here
// makes the exclusion explicit and future-safe.
const SPECIAL_POKEDEX_IDS = new Set([
  150, 151, 243, 244, 245, 380, 381, 385, 386, 488, 491
]);

const DEFAULTS = Object.freeze({
  ingredientAvailability: 0.5,
  cookingProfileId: 'user-activity',
  basePotCapacity: 81,
  goodCamp: true,
  favoriteShare: 1,
  collectionIntervalHours: 4
});

function round(value, digits = 1) {
  const factor = 10 ** digits;
  return Math.round((Number(value) + Number.EPSILON) * factor) / factor;
}

function option(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
}

function ordinaryEnergyPerDay(record, favoriteShare) {
  return (
    scoring.immediateHelpBaseEnergy(record, favoriteShare)
    * 86400
    / scoring.helpIntervalAtLevel(record.helpFrequencyBaseSec)
  );
}

function naturalMainSkillLevel(record) {
  return Math.max(1, Number(record.evolution?.stage) || 1);
}

function collectionTriggerMetrics(record, collectionIntervalHours) {
  if (!(Number.isFinite(collectionIntervalHours) && collectionIntervalHours > 0)) {
    throw new Error(`无效收菜间隔：${collectionIntervalHours}`);
  }
  const unattended = scoring.unattendedSkillStorageMetrics(
    record,
    collectionIntervalHours,
    100
  );
  const continuousTriggerIndexPerDay = (
    86400
    / scoring.helpIntervalAtLevel(record.helpFrequencyBaseSec)
    * unattended.effectiveSkillProbability
  );
  return {
    continuousTriggerIndexPerDay,
    collectedTriggerIndexPerDay: continuousTriggerIndexPerDay * unattended.retentionRatio,
    retentionRatio: unattended.retentionRatio
  };
}

function triggerIndexPerDay(record, collectionIntervalHours = DEFAULTS.collectionIntervalHours) {
  return collectionTriggerMetrics(record, collectionIntervalHours).collectedTriggerIndexPerDay;
}

function actualTeamTargetEnergyPerHelp(team) {
  return team.map(member => scoring.immediateHelpBaseEnergy(
    member.record,
    member.favoriteShare
  ));
}

function helperMainSkillOutputIndex(record, team, {
  ingredientAvailability,
  cookingProfileId,
  basePotCapacity,
  goodCamp,
  collectionIntervalHours
}) {
  const skillId = Number(record.mainSkill?.id);
  const level = naturalMainSkillLevel(record);
  const allIngredientIds = Object.keys(scoring.ingredientStrength).map(Number);
  let effect;

  if (skillId === scoring.energyChargeSFixed.mainSkillId) {
    effect = scoring.energyChargeSFixedEffect(
      Math.min(level, scoring.energyChargeSFixed.maxLevel)
    );
  } else if (skillId === scoring.energyChargeM.mainSkillId) {
    const energy = scoring.energyChargeMEffect(
      Math.min(level, scoring.energyChargeM.maxLevel)
    );
    effect = {
      singleUsePracticalValue: scoring.directEnergyPracticalValue(energy.baseEnergy),
      operationCeilingScore: scoring.energyChargeM.operationCeilingScore
    };
  } else if (skillId === scoring.dreamShardSkill.fixedMainSkillId) {
    effect = scoring.dreamShardFixedEffect(
      Math.min(level, scoring.dreamShardSkill.maxLevel),
      scoring.dreamShardSkill.neutralDemandCoefficient
    );
  } else if (skillId === scoring.energyChargeSRandom.mainSkillId) {
    effect = scoring.energyChargeSRandomEffect(
      Math.min(level, scoring.energyChargeSRandom.maxLevel)
    );
  } else if (skillId === scoring.chargeEnergyS.mainSkillId) {
    effect = scoring.chargeEnergySEffect(
      Math.min(level, scoring.chargeEnergyS.maxLevel)
    );
  } else if (skillId === scoring.helpingSupportS.mainSkillId) {
    const targetEnergyPerHelp = actualTeamTargetEnergyPerHelp(team);
    effect = scoring.helpingSupportEffect({
      level: Math.min(level, scoring.helpingSupportS.maxLevel),
      targetEnergyPerHelp,
      referenceEnergyPerHelp: Math.max(...targetEnergyPerHelp)
    });
  } else if (skillId === scoring.ingredientMagnetS.mainSkillId) {
    effect = scoring.randomIngredientMagnetEffect({
      ingredientCount: scoring.ingredientMagnetS.countByLevel[
        Math.min(level, scoring.ingredientSkillCommon.maxLevel)
      ],
      ingredientIds: allIngredientIds
    });
  } else if (skillId === scoring.cookingPowerUp.ordinaryMainSkillId) {
    const triggerMeanPerMeal = triggerIndexPerDay(
      record,
      collectionIntervalHours
    ) / scoring.cookingPowerUp.mealsPerDay;
    return scoring.cookingPowerWeeklyScenario({
      triggerMeanPerMeal,
      level: Math.min(level, scoring.cookingPowerUp.maxLevel),
      profileId: cookingProfileId,
      basePotCapacity,
      ingredientAvailability,
      goodCamp
    }).theoreticalOutputIndex;
  } else if (skillId === scoring.tastyChanceS.mainSkillId) {
    const triggerMeanPerMeal = triggerIndexPerDay(
      record,
      collectionIntervalHours
    ) / scoring.tastyChanceS.mealsPerDay;
    return scoring.tastyChanceWeeklyScenario({
      triggerMeanPerMeal,
      level: Math.min(level, scoring.tastyChanceS.maxLevel),
      profileId: cookingProfileId
    }).theoreticalOutputIndex;
  } else {
    return 0;
  }

  return (
    triggerIndexPerDay(record, collectionIntervalHours)
    * Number(effect.singleUsePracticalValue)
  );
}

function tastyChanceTeamOutputIndex(sources, settings) {
  const active = sources.filter(source => source.count > 0);
  const totalTriggerIndexPerDay = active.reduce(
    (sum, source) => sum + source.count * triggerIndexPerDay(
      source.record,
      settings.collectionIntervalHours
    ),
    0
  );
  if (!(totalTriggerIndexPerDay > 0)) return 0;
  const weightedBonusPct = active.reduce((sum, source) => {
    const triggerWeight = source.count * triggerIndexPerDay(
      source.record,
      settings.collectionIntervalHours
    );
    return sum + triggerWeight * scoring.tastyChanceS.bonusPctByLevel[source.level];
  }, 0) / totalTriggerIndexPerDay;
  const effectiveIntegerBonusPct = Math.max(1, Math.round(weightedBonusPct));
  return scoring.tastyChanceWeeklyScenario({
    triggerMeanPerMeal: totalTriggerIndexPerDay / scoring.tastyChanceS.mealsPerDay,
    bonusPctPerTrigger: effectiveIntegerBonusPct,
    profileId: settings.cookingProfileId
  }).theoreticalOutputIndex;
}

function cookingPowerTeamOutputIndex(sources, settings) {
  const active = sources.filter(source => source.count > 0);
  const totalTriggerIndexPerDay = active.reduce(
    (sum, source) => sum + source.count * triggerIndexPerDay(
      source.record,
      settings.collectionIntervalHours
    ),
    0
  );
  if (!(totalTriggerIndexPerDay > 0)) return 0;
  const weightedPotSlots = active.reduce((sum, source) => {
    const triggerWeight = source.count * triggerIndexPerDay(
      source.record,
      settings.collectionIntervalHours
    );
    return sum + triggerWeight * scoring.cookingPowerUp.ordinaryPotSlotsByLevel[source.level];
  }, 0) / totalTriggerIndexPerDay;
  return scoring.cookingPowerWeeklyScenario({
    triggerMeanPerMeal: totalTriggerIndexPerDay / scoring.cookingPowerUp.mealsPerDay,
    skillVariant: 'ordinary',
    potSlotsPerTrigger: weightedPotSlots,
    profileId: settings.cookingProfileId,
    basePotCapacity: settings.basePotCapacity,
    ingredientAvailability: settings.ingredientAvailability,
    goodCamp: settings.goodCamp
  }).theoreticalOutputIndex;
}

function customCandidateSkillOutputIndex(
  record,
  genericRow,
  team,
  berryHelperRecord,
  records,
  settings
) {
  const skillId = Number(record.mainSkill?.id);
  const triggerMetrics = collectionTriggerMetrics(record, settings.collectionIntervalHours);
  const collectedTriggerIndexPerDay = triggerMetrics.collectedTriggerIndexPerDay;
  const genericTriggerIndexPerDay = Number(genericRow.theoreticalTriggerIndexPerDay);
  const retentionScale = genericTriggerIndexPerDay > 0
    ? collectedTriggerIndexPerDay / genericTriggerIndexPerDay
    : 0;
  if (skillId === scoring.helpingSupportS.mainSkillId) {
    const targetEnergyPerHelp = actualTeamTargetEnergyPerHelp(team);
    const effect = scoring.helpingSupportEffect({
      level: scoring.helpingSupportS.maxLevel,
      targetEnergyPerHelp,
      referenceEnergyPerHelp: scoring.immediateHelpBaseEnergy(berryHelperRecord, 1)
    });
    return collectedTriggerIndexPerDay * effect.singleUsePracticalValue;
  }

  const isOrdinaryBerryBurst = skillId === scoring.berryBurst.mainSkillId;
  const isDisguise = skillId === scoring.disguiseBerryBurst.mainSkillId;
  if (isOrdinaryBerryBurst || isDisguise) {
    const userBerryEnergy = scoring.berryEnergyPerBerry(record, 1);
    const teammateBerryEnergies = team
      .filter(member => member.record.id !== record.id)
      .map(member => scoring.berryEnergyPerBerry(member.record, member.favoriteShare));
    const level = isOrdinaryBerryBurst
      ? scoring.berryBurst.maxLevel
      : scoring.disguiseBerryBurst.maxLevel;
    const selfBerryCount = isOrdinaryBerryBurst
      ? scoring.berryBurst.selfBerryByLevel[level]
      : scoring.disguiseBerryBurst.selfBerryByLevel[level];
    const teammateBerryCount = isOrdinaryBerryBurst
      ? scoring.berryBurst.teammateBerryByLevel[level]
      : scoring.disguiseBerryBurst.teammateBerryByLevel[level];
    const customEffect = scoring.berryBurstEffect({
      selfBerryCount,
      teammateBerryCount,
      userBerryEnergy,
      teammateBerryEnergies,
      referenceTeammateBerryEnergy: scoring.berryEnergyPerBerry(berryHelperRecord, 1)
    });
    if (isOrdinaryBerryBurst) {
      return collectedTriggerIndexPerDay * customEffect.singleUsePracticalValue;
    }
    const probabilityAtLeastOneLargeSuccess = 1 - (
      1 - scoring.disguiseBerryBurst.largeSuccessProbability
    ) ** collectedTriggerIndexPerDay;
    const expectedEnergyPerDay = (
      customEffect.expectedEnergyPerUse * collectedTriggerIndexPerDay
      + customEffect.expectedEnergyPerUse
        * (scoring.disguiseBerryBurst.largeSuccessMultiplier - 1)
        * probabilityAtLeastOneLargeSuccess
    );
    return scoring.directEnergyPracticalValue(expectedEnergyPerDay);
  }

  if (skillId === scoring.cookingAssistS.mainSkillId) {
    return scoring.cookingAssistWeeklyScenario({
      triggerMeanPerMeal: collectedTriggerIndexPerDay / scoring.tastyChanceS.mealsPerDay,
      level: scoring.cookingAssistS.maxLevel,
      ingredientIds: Object.keys(scoring.ingredientStrength).map(Number),
      profileId: settings.cookingProfileId
    }).theoreticalOutputIndex;
  }

  if (skillId === scoring.metronome.mainSkillId) {
    return scoring.metronomeScenario(records, record, {
      theoreticalTriggerIndexPerDay: collectedTriggerIndexPerDay,
      eightHourRetention: 1,
      favoriteShare: settings.favoriteShare,
      profileId: settings.cookingProfileId,
      basePotCapacity: settings.basePotCapacity,
      ingredientAvailability: settings.ingredientAvailability,
      goodCamp: settings.goodCamp,
      unlockedIngredientIds: Object.keys(scoring.ingredientStrength).map(Number),
      dreamShardDemandCoefficient: scoring.dreamShardSkill.neutralDemandCoefficient
    }).theoreticalOutputIndex;
  }

  return Number(genericRow.theoreticalOutputIndex) * retentionScale;
}

function standardTeamRankingRows(records, options = {}) {
  const settings = { ...DEFAULTS, ...options };
  const gardevoir = records.find(record => (
    record.isFinalEvolution && Number(record.pokedexId) === 282
  ));
  if (!gardevoir) throw new Error('缺少沙奈朵数据');

  const genericRows = scoring.skillSpecialistSpeciesRankingRows(records, {
    favoriteShare: settings.favoriteShare,
    ingredientAcquisitionOptions: {
      plusPartnerPresent: false,
      unlockedIngredientIds: Object.keys(scoring.ingredientStrength).map(Number),
      dreamShardDemandCoefficient: scoring.dreamShardSkill.neutralDemandCoefficient
    },
    tastyChanceOptions: { profileId: settings.cookingProfileId },
    cookingPowerOptions: {
      profileId: settings.cookingProfileId,
      basePotCapacity: settings.basePotCapacity,
      ingredientAvailability: settings.ingredientAvailability,
      goodCamp: settings.goodCamp,
      minusPartnerPresent: false
    },
    cookingAssistOptions: {
      profileId: settings.cookingProfileId,
      unlockedIngredientIds: Object.keys(scoring.ingredientStrength).map(Number)
    },
    metronomeOptions: {
      profileId: settings.cookingProfileId,
      basePotCapacity: settings.basePotCapacity,
      ingredientAvailability: settings.ingredientAvailability,
      goodCamp: settings.goodCamp,
      unlockedIngredientIds: Object.keys(scoring.ingredientStrength).map(Number),
      dreamShardDemandCoefficient: scoring.dreamShardSkill.neutralDemandCoefficient
    }
  });
  const genericById = new Map(genericRows.map(row => [String(row.id), row]));
  const gardevoirSkillRow = scoring.standardE4eRows(records).find(row => (
    Number(row.pokedexId) === 282
  ));
  const gardevoirTriggerMetrics = collectionTriggerMetrics(
    gardevoir,
    settings.collectionIntervalHours
  );
  const gardevoirSkillOutputIndex = (
    Number(gardevoirSkillRow.theoreticalOutputIndex)
    * gardevoirTriggerMetrics.retentionRatio
  );

  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && scoring.defaultSkillSpecialistSlotRole(record) === scoring.skillSpecialistSlotRoles.EXTRA_SKILL
    && !SPECIAL_POKEDEX_IDS.has(Number(record.pokedexId))
  ));

  const rows = candidates.map(record => {
    const island = ISLAND_BY_TYPE_ID.get(Number(record.typeId));
    if (!island) {
      return {
        id: record.id,
        pokedexId: record.pokedexId,
        nameZh: record.nameZh,
        nameEn: record.nameEn,
        typeId: record.typeId,
        typeNameZh: TYPE_NAMES_ZH[record.typeId] ?? `类型${record.typeId}`,
        status: 'pending-no-fixed-island-assignment'
      };
    }

    const berryHelperRecord = records.find(candidate => (
      candidate.isFinalEvolution
      && candidate.specialty === 'berry'
      && Number(candidate.pokedexId) === island.berryHelperPokedexId
    ));
    if (!berryHelperRecord) {
      throw new Error(`${island.nameZh}缺少指定树果手#${island.berryHelperPokedexId}`);
    }

    const berryHelper = {
      record: berryHelperRecord,
      ordinaryEnergyPerDay: ordinaryEnergyPerDay(berryHelperRecord, 1)
    };
    const gardevoirFavoriteShare = island.typeIds.includes(Number(gardevoir.typeId)) ? 1 : 0;
    const candidateTeam = [
      { record: gardevoir, favoriteShare: gardevoirFavoriteShare },
      { record, favoriteShare: 1 },
      ...Array.from({ length: 3 }, () => ({ record: berryHelper.record, favoriteShare: 1 }))
    ];
    const baselineTeam = [
      { record: gardevoir, favoriteShare: gardevoirFavoriteShare },
      ...Array.from({ length: 4 }, () => ({ record: berryHelper.record, favoriteShare: 1 }))
    ];

    const candidateOrdinaryEnergyPerDay = candidateTeam.reduce(
      (sum, member) => sum + ordinaryEnergyPerDay(member.record, member.favoriteShare),
      0
    );
    const baselineOrdinaryEnergyPerDay = baselineTeam.reduce(
      (sum, member) => sum + ordinaryEnergyPerDay(member.record, member.favoriteShare),
      0
    );
    const genericRow = genericById.get(String(record.id));
    if (!genericRow) throw new Error(`缺少${record.nameZh}技能模型`);
    let candidateSkillOutputIndex = customCandidateSkillOutputIndex(
      record,
      genericRow,
      candidateTeam,
      berryHelper.record,
      records,
      settings
    );
    let helperSkillOutputIndexCandidateTeam = helperMainSkillOutputIndex(
      berryHelper.record,
      candidateTeam,
      settings
    );
    let helperSkillOutputIndexBaselineTeam = helperMainSkillOutputIndex(
      berryHelper.record,
      baselineTeam,
      settings
    );
    let candidateHelperSkillTotalOutputIndex;
    let baselineHelperSkillTotalOutputIndex;
    let nonlinearAggregationStatus = null;
    const candidateSkillId = Number(record.mainSkill?.id);
    const helperSkillId = Number(berryHelper.record.mainSkill?.id);
    const candidateTriggerMetrics = collectionTriggerMetrics(
      record,
      settings.collectionIntervalHours
    );
    const berryHelperTriggerMetrics = collectionTriggerMetrics(
      berryHelper.record,
      settings.collectionIntervalHours
    );
    const candidateUsesTasty = candidateSkillId === scoring.tastyChanceS.mainSkillId;
    const helperUsesTasty = helperSkillId === scoring.tastyChanceS.mainSkillId;
    const candidateUsesCookingPower = (
      candidateSkillId === scoring.cookingPowerUp.ordinaryMainSkillId
    );
    const helperUsesCookingPower = (
      helperSkillId === scoring.cookingPowerUp.ordinaryMainSkillId
    );

    if (candidateUsesTasty || helperUsesTasty) {
      const candidateSources = [
        ...(candidateUsesTasty ? [{
          record,
          count: 1,
          level: scoring.tastyChanceS.maxLevel
        }] : []),
        ...(helperUsesTasty ? [{
          record: berryHelper.record,
          count: 3,
          level: Math.min(naturalMainSkillLevel(berryHelper.record), scoring.tastyChanceS.maxLevel)
        }] : [])
      ];
      const baselineSources = helperUsesTasty ? [{
        record: berryHelper.record,
        count: 4,
        level: Math.min(naturalMainSkillLevel(berryHelper.record), scoring.tastyChanceS.maxLevel)
      }] : [];
      const candidateCombined = tastyChanceTeamOutputIndex(candidateSources, settings);
      const baselineCombined = tastyChanceTeamOutputIndex(baselineSources, settings);
      if (candidateUsesTasty) candidateSkillOutputIndex = 0;
      candidateHelperSkillTotalOutputIndex = candidateCombined + (
        helperUsesTasty ? 0 : 3 * helperSkillOutputIndexCandidateTeam
      );
      baselineHelperSkillTotalOutputIndex = baselineCombined + (
        helperUsesTasty ? 0 : 4 * helperSkillOutputIndexBaselineTeam
      );
      if (helperUsesTasty) {
        helperSkillOutputIndexCandidateTeam = candidateCombined / 3;
        helperSkillOutputIndexBaselineTeam = baselineCombined / 4;
      }
      nonlinearAggregationStatus = 'aggregated-tasty-chance-team-state';
    } else if (candidateUsesCookingPower || helperUsesCookingPower) {
      const candidateSources = [
        ...(candidateUsesCookingPower ? [{
          record,
          count: 1,
          level: scoring.cookingPowerUp.maxLevel
        }] : []),
        ...(helperUsesCookingPower ? [{
          record: berryHelper.record,
          count: 3,
          level: Math.min(naturalMainSkillLevel(berryHelper.record), scoring.cookingPowerUp.maxLevel)
        }] : [])
      ];
      const baselineSources = helperUsesCookingPower ? [{
        record: berryHelper.record,
        count: 4,
        level: Math.min(naturalMainSkillLevel(berryHelper.record), scoring.cookingPowerUp.maxLevel)
      }] : [];
      const candidateCombined = cookingPowerTeamOutputIndex(candidateSources, settings);
      const baselineCombined = cookingPowerTeamOutputIndex(baselineSources, settings);
      if (candidateUsesCookingPower) candidateSkillOutputIndex = 0;
      candidateHelperSkillTotalOutputIndex = candidateCombined + (
        helperUsesCookingPower ? 0 : 3 * helperSkillOutputIndexCandidateTeam
      );
      baselineHelperSkillTotalOutputIndex = baselineCombined + (
        helperUsesCookingPower ? 0 : 4 * helperSkillOutputIndexBaselineTeam
      );
      if (helperUsesCookingPower) {
        helperSkillOutputIndexCandidateTeam = candidateCombined / 3;
        helperSkillOutputIndexBaselineTeam = baselineCombined / 4;
      }
      nonlinearAggregationStatus = 'aggregated-cooking-power-team-state-weighted-slots';
    } else {
      candidateHelperSkillTotalOutputIndex = 3 * helperSkillOutputIndexCandidateTeam;
      baselineHelperSkillTotalOutputIndex = 4 * helperSkillOutputIndexBaselineTeam;
    }
    const candidateTeamOutputIndex = (
      scoring.directEnergyPracticalValue(candidateOrdinaryEnergyPerDay)
      + gardevoirSkillOutputIndex
      + candidateSkillOutputIndex
      + candidateHelperSkillTotalOutputIndex
    );
    const baselineTeamOutputIndex = (
      scoring.directEnergyPracticalValue(baselineOrdinaryEnergyPerDay)
      + gardevoirSkillOutputIndex
      + baselineHelperSkillTotalOutputIndex
    );
    const yieldCoefficient = candidateTeamOutputIndex / baselineTeamOutputIndex;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      typeId: record.typeId,
      typeNameZh: TYPE_NAMES_ZH[record.typeId] ?? `类型${record.typeId}`,
      islandId: island.id,
      islandNameZh: island.nameZh,
      skillNameZh: genericRow.skillNameZh,
      berryHelperNameZh: berryHelper.record.nameZh,
      berryHelperRepeated: 3,
      candidateOrdinaryEnergyPerDay: round(ordinaryEnergyPerDay(record, 1)),
      berryHelperOrdinaryEnergyPerDay: round(berryHelper.ordinaryEnergyPerDay),
      candidateSkillOutputIndex: round(candidateSkillOutputIndex),
      berryHelperSkillOutputIndexCandidateTeam: round(helperSkillOutputIndexCandidateTeam),
      candidateTeamOutputIndex: round(candidateTeamOutputIndex),
      candidateTeamEquivalentEnergyPerDay: round(
        candidateTeamOutputIndex
        / scoring.energyChargeM.singleUsePracticalValue
        * scoring.energyChargeM.energyByLevel[scoring.energyChargeM.maxLevel]
      ),
      baselineTeamOutputIndex: round(baselineTeamOutputIndex),
      baselineTeamEquivalentEnergyPerDay: round(
        baselineTeamOutputIndex
        / scoring.energyChargeM.singleUsePracticalValue
        * scoring.energyChargeM.energyByLevel[scoring.energyChargeM.maxLevel]
      ),
      yieldCoefficient: round(yieldCoefficient, 4),
      netYieldPct: round((yieldCoefficient - 1) * 100, 2),
      netEquivalentEnergyPerDay: round(
        (candidateTeamOutputIndex - baselineTeamOutputIndex)
        / scoring.energyChargeM.singleUsePracticalValue
        * scoring.energyChargeM.energyByLevel[scoring.energyChargeM.maxLevel]
      ),
      cookingProfileId: settings.cookingProfileId,
      goodCamp: settings.goodCamp,
      ingredientAvailability: settings.ingredientAvailability,
      collectionIntervalHours: settings.collectionIntervalHours,
      candidateSkillRetentionPct: round(candidateTriggerMetrics.retentionRatio * 100, 1),
      berryHelperSkillRetentionPct: round(berryHelperTriggerMetrics.retentionRatio * 100, 1),
      gardevoirSkillRetentionPct: round(gardevoirTriggerMetrics.retentionRatio * 100, 1),
      status: nonlinearAggregationStatus ?? 'computed-standard-team'
    };
  });

  const complete = rows.filter(row => Number.isFinite(row.candidateTeamOutputIndex));
  const maximum = Math.max(...complete.map(row => row.candidateTeamOutputIndex));
  complete.forEach(row => {
    row.absoluteTeamStrength = round(row.candidateTeamOutputIndex / maximum * 100, 2);
  });
  return rows.sort((left, right) => (
    Number(right.candidateTeamOutputIndex ?? -Infinity)
    - Number(left.candidateTeamOutputIndex ?? -Infinity)
    || Number(left.pokedexId) - Number(right.pokedexId)
  )).map((row, index) => ({ rank: index + 1, ...row }));
}

function markdown(rows) {
  return [
    '| 排名 | X | 属性 | 使用岛屿 | 主技能 | 岛屿树果手×3 | 标准队等效收益/日 | 四树果基准/日 | 替换净收益/日 | 收益系数 | 净收益率 | 绝对强度 | 状态 |',
    '|---:|---|---|---|---|---|---:|---:|---:|---:|---:|---:|---|',
    ...rows.map(row => `| ${row.rank} | ${row.nameZh} | ${row.typeNameZh} | ${row.islandNameZh ?? '待定'} | ${row.skillNameZh ?? '待定'} | ${row.berryHelperNameZh ?? '无'}×3 | ${row.candidateTeamEquivalentEnergyPerDay ?? '待定'} | ${row.baselineTeamEquivalentEnergyPerDay ?? '待定'} | ${row.netEquivalentEnergyPerDay ?? '待定'} | ${row.yieldCoefficient ?? '待定'} | ${row.netYieldPct == null ? '待定' : `${row.netYieldPct}%`} | ${row.absoluteTeamStrength ?? '待定'} | ${row.status} |`)
  ].join('\n');
}

module.exports = Object.freeze({
  specialPokedexIds: SPECIAL_POKEDEX_IDS,
  islandStandards: ISLAND_STANDARDS,
  defaults: DEFAULTS,
  ordinaryEnergyPerDay,
  naturalMainSkillLevel,
  collectionTriggerMetrics,
  actualTeamTargetEnergyPerHelp,
  helperMainSkillOutputIndex,
  cookingPowerTeamOutputIndex,
  standardTeamRankingRows
});

if (require.main === module) {
  const args = process.argv.slice(2);
  const dataPath = option(args, '--data');
  if (!dataPath) throw new Error('需要 --data <raenonx-species.json>');
  const format = option(args, '--format') || 'markdown';
  const ingredientAvailability = Number(
    option(args, '--ingredient-availability') ?? DEFAULTS.ingredientAvailability
  );
  if (!(ingredientAvailability >= 0 && ingredientAvailability <= 1)) {
    throw new Error('食材满足率必须是0至1');
  }
  const collectionIntervalHours = Number(
    option(args, '--collection-hours') ?? DEFAULTS.collectionIntervalHours
  );
  if (!(Number.isFinite(collectionIntervalHours) && collectionIntervalHours > 0)) {
    throw new Error('收菜间隔必须大于0小时');
  }
  const input = JSON.parse(fs.readFileSync(path.resolve(dataPath), 'utf8'));
  const rows = standardTeamRankingRows(input.pokemon || input, {
    ingredientAvailability,
    collectionIntervalHours
  });
  process.stdout.write(`${format === 'json' ? JSON.stringify(rows, null, 2) : markdown(rows)}\n`);
}
