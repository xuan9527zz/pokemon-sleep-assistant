#!/usr/bin/env node

'use strict';

const fs = require('node:fs');
const path = require('node:path');

const TARGET_LEVEL = 70;
const UNATTENDED_HOURS = 8;
const AVERAGE_ENERGY_SPEED_MULTIPLIER = 2;
const INGREDIENT_SPECIES_WEIGHTS = Object.freeze({ production: 0.8, inventory: 0.1, mainSkill: 0.1 });
const BERRY_SPECIES_WEIGHTS = Object.freeze({ production: 0.9, mainSkill: 0.1 });
const SKILL_SPECIALIST_LEGACY_SPECIES_WEIGHTS = Object.freeze({
  mainSkill: 0.85,
  ordinaryProduction: 0.1,
  naturalLevel: 0.05
});
const SKILL_SPECIALIST_FINAL_SPECIES_WEIGHTS = Object.freeze({
  skillPerformance: 0.95,
  naturalLevel: 0.05
});
const SKILL_SPECIALIST_MAIN_WEIGHTS = Object.freeze({
  theoreticalOutput: 0.7,
  stability: 0.1,
  operation: 0.1,
  versatility: 0.1
});
const SKILL_SPECIALIST_ORDINARY_FAVORITE_SHARE = 0.5;
const SKILL_SPECIALIST_STANDARD_PRODUCER_COUNT = 4;
const SKILL_SPECIALIST_SLOT_ROLES = Object.freeze({
  HEALER: 'healer',
  EXTRA_SKILL: 'extra-skill',
  CONDITIONAL_HEALER: 'conditional-healer'
});
const SKILL_PITY_SECONDS = 144000;
const MAX_STORED_SKILL_TRIGGERS = 2;
const NON_SKILL_PITY_HELP_COUNT = 78;
const NON_SKILL_MAX_STORED_SKILL_TRIGGERS = 1;
const STANDARD_E4E = Object.freeze({
  mainSkillId: 8,
  maxLevel: 6,
  healingPerHelper: 18.1,
  singleUsePracticalValue: 100,
  stabilityScore: 100,
  operationCeilingScore: 80,
  versatilityScore: 100
});
const STANDARD_HEALER_TEAM = Object.freeze({
  teamSize: 5,
  healerTargetCount: 1,
  productiveTargetCount: 4,
  healerRecoveryWeight: 0,
  productiveRecoveryWeight: 1
});
const BERRY_JUICE = Object.freeze({
  mainSkillId: 32,
  maxLevel: 6,
  healingPerHelper: 18.1,
  juiceRecovery: 20,
  juiceProbability: 0.25,
  juiceBagLimit: 5,
  bonusOperationScore: 100,
  versatilityScore: 100
});
const PRODUCTIVE_HEALING_VALUE_PER_ENERGY = (
  STANDARD_E4E.singleUsePracticalValue
  / (STANDARD_E4E.healingPerHelper * STANDARD_HEALER_TEAM.productiveTargetCount)
);
const SELF_RECOVERY_VALUE_PER_ENERGY = (
  STANDARD_E4E.singleUsePracticalValue
  / (STANDARD_E4E.healingPerHelper * STANDARD_HEALER_TEAM.teamSize)
);
const STANDARD_RANDOM_PRODUCTIVE_TARGET_SHARE = (
  STANDARD_HEALER_TEAM.productiveTargetCount / STANDARD_HEALER_TEAM.teamSize
);
const RANDOM_SINGLE_TARGET_UTILITY = STANDARD_RANDOM_PRODUCTIVE_TARGET_SHARE;
const RANDOM_TWO_TARGET_UTILITY = 0.9;
const ENERGIZING_CHEER = Object.freeze({
  mainSkillId: 4,
  maxLevel: 6,
  healingByLevel: Object.freeze({ 1: 12, 2: 15, 3: 20, 4: 25, 5: 33, 6: 44 }),
  stabilityScore: RANDOM_SINGLE_TARGET_UTILITY * 100,
  operationCeilingScore: STANDARD_E4E.operationCeilingScore,
  versatilityScore: 100
});
const CHARGE_ENERGY_S = Object.freeze({
  mainSkillId: 7,
  maxLevel: 6,
  healingByLevel: Object.freeze({ 1: 12, 2: 16.2, 3: 21.2, 4: 26.6, 5: 33.6, 6: 43.4 }),
  stabilityScore: 100,
  operationCeilingScore: STANDARD_E4E.operationCeilingScore,
  versatilityScore: 100
});
const MOONLIGHT = Object.freeze({
  mainSkillId: 18,
  maxLevel: 6,
  selfHealingByLevel: CHARGE_ENERGY_S.healingByLevel,
  bonusHealingByLevel: Object.freeze({ 1: 6.3, 2: 7.7, 3: 10.1, 4: 13, 5: 17.2, 6: 22.8 }),
  bonusProbability: 0.45,
  operationCeilingScore: STANDARD_E4E.operationCeilingScore,
  versatilityScore: 100
});
const NUZZLE = Object.freeze({
  mainSkillId: 30,
  maxLevel: 6,
  healingByLevel: Object.freeze({ 1: 9, 2: 12, 3: 16, 4: 20, 5: 27, 6: 35 }),
  bonusDrawsByLevel: Object.freeze({ 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7 }),
  defaultTargetSkillProbability: 0.04,
  lowTargetSkillProbability: 0.02,
  defaultTargetSkillPracticalValue: 82,
  bonusOperationCeilingScore: 60
});
const HEAL_PULSE = Object.freeze({
  mainSkillId: 34,
  maxLevel: 6,
  targetCount: 2,
  healingByLevel: Object.freeze({ 1: 6, 2: 8, 3: 10, 4: 13, 5: 17, 6: 22 }),
  helpsByLevel: Object.freeze({ 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4 }),
  latiosBonusHelpsByLevel: Object.freeze({ 1: 1, 2: 1, 3: 2, 4: 2, 5: 2, 6: 3 }),
  stabilityScore: RANDOM_TWO_TARGET_UTILITY * 100,
  healingOperationCeilingScore: STANDARD_E4E.operationCeilingScore,
  helpingOperationCeilingScore: 100,
  standardFavoriteShare: 0.5,
  standardTargetCount: 4
});
const HELPING_SUPPORT_S = Object.freeze({
  mainSkillId: 9,
  maxLevel: 7,
  helpsByLevel: Object.freeze({ 1: 6, 2: 7, 3: 8, 4: 9, 5: 10, 6: 11, 7: 12 }),
  operationCeilingScore: 100,
  standardFavoriteShare: 0.5,
  standardBerryTargetCount: 3,
  standardHealerPokedexId: 282,
  teamSize: 5
});
const HELPER_BOOST = Object.freeze({
  mainSkillId: 15,
  maxLevel: 6,
  helpsByLevelAndDistinctSpecies: Object.freeze({
    1: Object.freeze({ 1: 2, 2: 2, 3: 3, 4: 4, 5: 6 }),
    2: Object.freeze({ 1: 3, 2: 3, 3: 4, 4: 5, 5: 7 }),
    3: Object.freeze({ 1: 3, 2: 3, 3: 5, 4: 6, 5: 8 }),
    4: Object.freeze({ 1: 4, 2: 4, 3: 6, 4: 7, 5: 9 }),
    5: Object.freeze({ 1: 4, 2: 5, 3: 7, 4: 8, 5: 10 }),
    6: Object.freeze({ 1: 5, 2: 6, 3: 8, 4: 9, 5: 11 })
  }),
  standardDistinctSpecies: 4,
  standardSameTypeTeammates: 3,
  standardFavoriteShare: 0.5,
  standardHealerPokedexId: 282,
  operationCeilingScore: 100,
  stabilityScore: 100
});
const BERRY_BURST = Object.freeze({
  mainSkillId: 21,
  maxLevel: 6,
  selfBerryByLevel: Object.freeze({ 1: 11, 2: 14, 3: 21, 4: 24, 5: 27, 6: 30 }),
  teammateBerryByLevel: Object.freeze({ 1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 5 }),
  standardFavoriteShare: 0.5,
  standardBerryTeammates: 3,
  standardHealerPokedexId: 282,
  operationCeilingScore: 100,
  stabilityScore: 100
});
const DISGUISE_BERRY_BURST = Object.freeze({
  mainSkillId: 17,
  maxLevel: 6,
  selfBerryByLevel: Object.freeze({ 1: 8, 2: 10, 3: 15, 4: 17, 5: 19, 6: 21 }),
  teammateBerryByLevel: BERRY_BURST.teammateBerryByLevel,
  largeSuccessProbability: 0.186,
  largeSuccessMultiplier: 3,
  operationCeilingScore: 100
});
const METEOR_SHOWER = Object.freeze({
  mainSkillId: 35,
  maxLevel: 6,
  selfBerryByLevelAndDistinctSpecies: Object.freeze({
    1: Object.freeze({ 1: 12, 2: 14, 3: 18, 4: 18, 5: 20 }),
    2: Object.freeze({ 1: 21, 2: 24, 3: 29, 4: 30, 5: 33 }),
    3: Object.freeze({ 1: 29, 2: 29, 3: 35, 4: 37, 5: 41 }),
    4: Object.freeze({ 1: 38, 2: 39, 3: 42, 4: 45, 5: 49 }),
    5: Object.freeze({ 1: 43, 2: 44, 3: 48, 4: 49, 5: 53 }),
    6: Object.freeze({ 1: 48, 2: 50, 3: 55, 4: 55, 5: 58 })
  }),
  teammateBerryByLevelAndDistinctSpecies: Object.freeze({
    1: Object.freeze({ 1: 1, 2: 1, 3: 1, 4: 2, 5: 2 }),
    2: Object.freeze({ 1: 1, 2: 1, 3: 1, 4: 2, 5: 2 }),
    3: Object.freeze({ 1: 1, 2: 2, 3: 2, 4: 3, 5: 3 }),
    4: Object.freeze({ 1: 1, 2: 2, 3: 3, 4: 4, 5: 4 }),
    5: Object.freeze({ 1: 2, 2: 3, 3: 4, 4: 5, 5: 5 }),
    6: Object.freeze({ 1: 3, 2: 4, 3: 4, 4: 5, 5: 5 })
  }),
  latiasSelfBonusByLevel: Object.freeze({ 1: 2, 2: 4, 3: 6, 4: 8, 5: 9, 6: 10 }),
  standardDistinctDragonSpecies: 5,
  standardDragonTeammatesBesidesLatias: 3,
  latiasPokedexId: 380,
  dragonBerryId: 15,
  operationCeilingScore: 100,
  stabilityScore: 100
});
const ENERGY_CHARGE_S_FIXED = Object.freeze({
  mainSkillId: 1,
  maxLevel: 7,
  energyByLevel: Object.freeze({
    1: 400,
    2: 569,
    3: 785,
    4: 1083,
    5: 1496,
    6: 2066,
    7: 3212
  }),
  stabilityScore: 100,
  operationCeilingScore: 100,
  versatilityScore: 100
});
const ENERGY_CHARGE_S_RANDOM = Object.freeze({
  mainSkillId: 5,
  maxLevel: 7,
  outcomeCount: 151,
  rangeByLevel: Object.freeze({
    1: Object.freeze([200, 800]),
    2: Object.freeze([285, 1138]),
    3: Object.freeze([393, 1570]),
    4: Object.freeze([542, 2166]),
    5: Object.freeze([748, 2992]),
    6: Object.freeze([1033, 4132]),
    7: Object.freeze([1606, 6424])
  }),
  operationCeilingScore: 100,
  versatilityScore: 100
});
const ENERGY_CHARGE_M = Object.freeze({
  mainSkillId: 2,
  maxLevel: 7,
  mechanicsStatus: 'confirmed',
  scoringStatus: 'confirmed',
  energyByLevel: Object.freeze({
    1: 880,
    2: 1251,
    3: 1726,
    4: 2383,
    5: 3290,
    6: 4546,
    7: 6858
  }),
  singleUsePracticalValue: 82,
  stabilityScore: 100,
  operationCeilingScore: 100,
  versatilityScore: 100
});
const TASTY_CHANCE_S = Object.freeze({
  mainSkillId: 14,
  maxLevel: 6,
  bonusPctByLevel: Object.freeze({ 1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 10 }),
  maximumAccumulatedBonusPct: 70,
  mealsPerDay: 3,
  mealsPerWeek: 21,
  weekdayMeals: 18,
  sundayMeals: 3,
  weekdayBaseCritProbability: 0.1,
  sundayBaseCritProbability: 0.3,
  weekdayCritMultiplier: 2,
  sundayCritMultiplier: 3,
  recipeSnapshotDate: '2026-08-23',
  standardRecipeLevel: 60,
  recipeLevelBonusPct: 203,
  recipeBonus148AverageBaseEnergy: 11706.8,
  recipeBonus178AverageBaseEnergy: 24105.6666666667,
  operationCeilingScore: 100,
  versatilityScore: 100,
  profiles: Object.freeze({
    'mature-standard': Object.freeze({
      id: 'mature-standard',
      nameZh: '成熟食谱通用情景',
      bonus148Meals: 10.5,
      bonus178Meals: 10.5,
      personalScenario: false
    }),
    'user-activity': Object.freeze({
      id: 'user-activity',
      nameZh: '个人活动周15餐1.78＋好露营券情景',
      bonus148Meals: 6,
      bonus178Meals: 15,
      personalScenario: true,
      defaultGoodCamp: true
    })
  })
});
const COOKING_POWER_UP = Object.freeze({
  ordinaryMainSkillId: 11,
  minusMainSkillId: 27,
  maxLevel: 7,
  ordinaryPotSlotsByLevel: Object.freeze({ 1: 7, 2: 10, 3: 12, 4: 17, 5: 22, 6: 27, 7: 31 }),
  minusPotSlotsByLevel: Object.freeze({ 1: 5, 2: 7, 3: 9, 4: 12, 5: 16, 6: 20, 7: 24 }),
  minusRecoveryByLevel: Object.freeze({ 1: 8, 2: 10, 3: 13, 4: 17, 5: 23, 6: 30, 7: 35 }),
  maximumAccumulatedPotSlots: 200,
  basePotCapacity: 81,
  goodCampMultiplier: 1.5,
  mealsPerDay: 3,
  mealsPerWeek: 21,
  weekdayMeals: 18,
  weekdayBaseCritProbability: 0.1,
  sundayBaseCritProbability: 0.3,
  weekdayCritMultiplier: 2,
  sundayCritMultiplier: 3,
  recipeSnapshotDate: '2026-08-23',
  standardRecipeLevel: 60,
  recipeLevelBonusPct: 203,
  averageFillerIngredientBaseEnergy: 144.78947368421052,
  recipeGroups: Object.freeze({
    148: Object.freeze({ coefficient: 1.48, averageIngredientCount: 64, averageBaseEnergy: 11706.8 }),
    178: Object.freeze({
      coefficient: 1.78,
      averageIngredientCount: 109,
      averageBaseEnergy: 24105.6666666667,
      recipes: Object.freeze([
        Object.freeze({
          nameZh: '弹跳咖哩乌龙面', category: '咖喱／浓汤', ingredientCount: 112,
          baseEnergy: 25539, fallbackIngredientCount: 64.75, fallbackBaseEnergy: 12425.25
        }),
        Object.freeze({
          nameZh: '茂盛焗烤酪梨', category: '咖喱／浓汤', ingredientCount: 115,
          baseEnergy: 24802, fallbackIngredientCount: 64.75, fallbackBaseEnergy: 12425.25
        }),
        Object.freeze({
          nameZh: '重踏酪梨酱脆片', category: '沙拉', ingredientCount: 105,
          baseEnergy: 25162, fallbackIngredientCount: 59.25, fallbackBaseEnergy: 10652
        }),
        Object.freeze({
          nameZh: '苹果酸优格沙拉', category: '沙拉', ingredientCount: 104,
          baseEnergy: 19293, fallbackIngredientCount: 59.25, fallbackBaseEnergy: 10652
        }),
        Object.freeze({
          nameZh: '采蜜巧克力格子松饼', category: '点心／饮料', ingredientCount: 115,
          baseEnergy: 25484, fallbackIngredientCount: 72, fallbackBaseEnergy: 12379.5
        }),
        Object.freeze({
          nameZh: '心跳加速鬼面松饼', category: '点心／饮料', ingredientCount: 103,
          baseEnergy: 24354, fallbackIngredientCount: 72, fallbackBaseEnergy: 12379.5
        })
      ])
    })
  }),
  profiles: TASTY_CHANCE_S.profiles
});
const DREAM_SHARD_SKILL = Object.freeze({
  fixedMainSkillId: 3,
  randomMainSkillId: 6,
  auraSphereMainSkillId: 36,
  maxLevel: 8,
  outcomeCount: 151,
  neutralDemandCoefficient: 1,
  fixedInternalSkillSpAtMaxLevel: 7303,
  energyChargeMInternalSkillSpAtMaxLevel: 6252,
  fixedShardsByLevel: Object.freeze({
    1: 240,
    2: 340,
    3: 480,
    4: 670,
    5: 920,
    6: 1260,
    7: 1800,
    8: 2500
  }),
  randomRangeByLevel: Object.freeze({
    1: Object.freeze([120, 480]),
    2: Object.freeze([170, 680]),
    3: Object.freeze([240, 960]),
    4: Object.freeze([335, 1340]),
    5: Object.freeze([460, 1840]),
    6: Object.freeze([630, 2520]),
    7: Object.freeze([900, 3600]),
    8: Object.freeze([1150, 4600])
  }),
  operationCeilingScore: 100,
  versatilityScore: 100
});
const AURA_SPHERE = Object.freeze({
  mainSkillId: DREAM_SHARD_SKILL.auraSphereMainSkillId,
  maxLevel: DREAM_SHARD_SKILL.maxLevel,
  energyByLevel: Object.freeze({
    1: 200,
    2: 285,
    3: 393,
    4: 542,
    5: 748,
    6: 1033,
    7: 1501,
    8: 2042
  }),
  stabilityScore: 100,
  operationCeilingScore: 100,
  versatilityScore: 100
});
const STOCKPILE = Object.freeze({
  mainSkillId: 16,
  maxLevel: 7,
  stockpileProbability: 0.75,
  spitUpProbability: 0.25,
  maximumStockpiles: 10,
  energyByLevelAndStockpiles: Object.freeze({
    1: Object.freeze([600, 1020, 1500, 2040, 2640, 3300, 4020, 4920, 6480, 8880, 12120]),
    2: Object.freeze([853, 1450, 2132, 2900, 3753, 4691, 5715, 6995, 9213, 12625, 17231]),
    3: Object.freeze([1177, 2001, 2943, 4002, 5179, 6474, 7886, 9652, 12712, 17420, 23776]),
    4: Object.freeze([1625, 2763, 4063, 5526, 7151, 8939, 10889, 13327, 17552, 24052, 32827]),
    5: Object.freeze([2243, 3813, 5607, 7626, 9869, 12336, 15028, 18393, 24225, 33197, 45309]),
    6: Object.freeze([3099, 5268, 7747, 10536, 13635, 17044, 20763, 25412, 33469, 45865, 62600]),
    7: Object.freeze([4502, 7653, 11255, 15307, 19809, 24761, 30163, 36916, 48621, 66629, 90940])
  }),
  operationCeilingScore: 100,
  versatilityScore: 100
});
const NIGHTMARE = Object.freeze({
  mainSkillId: 23,
  maxLevel: 7,
  energyByLevel: Object.freeze({
    1: 2640,
    2: 3753,
    3: 5178,
    4: 7149,
    5: 9870,
    6: 13638,
    7: 18515
  }),
  energyPenaltyPerNonDarkHelper: 12,
  stabilityScore: 100,
  operationCeilingScore: 100
});
const CRESCENT_PRAYER = Object.freeze({
  mainSkillId: 22,
  maxLevel: 6,
  healingPerHelper: 11,
  psychicBerryId: 11,
  stabilityScore: 100,
  healingOperationCeilingScore: STANDARD_E4E.operationCeilingScore,
  berryOperationCeilingScore: 100,
  berryCountsByDistinctPsychicSpecies: Object.freeze({
    1: Object.freeze({ cresselia: 25, eachTeammate: 1, total: 29 }),
    2: Object.freeze({ cresselia: 29, eachTeammate: 2, total: 37 }),
    3: Object.freeze({ cresselia: 30, eachTeammate: 4, total: 46 }),
    4: Object.freeze({ cresselia: 31, eachTeammate: 6, total: 55 }),
    5: Object.freeze({ cresselia: 32, eachTeammate: 9, total: 68 })
  })
});
const FORMAL_HEALER_MAIN_SKILL_IDS = Object.freeze([
  STANDARD_E4E.mainSkillId,
  BERRY_JUICE.mainSkillId
]);
const CONDITIONAL_HEALER_MAIN_SKILL_IDS = Object.freeze([
  ENERGIZING_CHEER.mainSkillId,
  MOONLIGHT.mainSkillId,
  NUZZLE.mainSkillId,
  HEAL_PULSE.mainSkillId,
  CRESCENT_PRAYER.mainSkillId
]);
const INGREDIENT_SKILL_COMMON = Object.freeze({
  maxLevel: 7,
  recipeSnapshotDate: '2026-08-23',
  fixedRecipeCount: 78,
  ingredientWeightedLv1RecipeMultiplier: 1.4718151001540831,
  operationCeilingScore: 100,
  versatilityScore: 100,
  randomIngredientTypesPerTrigger: 3
});
const INGREDIENT_MAGNET_S = Object.freeze({
  mainSkillId: 10,
  countByLevel: Object.freeze({ 1: 6, 2: 8, 3: 11, 4: 14, 5: 17, 6: 21, 7: 24 })
});
const INGREDIENT_DRAW_S = Object.freeze({
  mainSkillId: 28,
  countByLevel: Object.freeze({ 1: 5, 2: 6, 3: 8, 4: 11, 5: 13, 6: 16, 7: 18 })
});
const PLUS_INGREDIENT_MAGNET_S = Object.freeze({
  mainSkillId: 26,
  randomCountByLevel: Object.freeze({ 1: 5, 2: 7, 3: 9, 4: 11, 5: 13, 6: 16, 7: 18 }),
  additionalCountByFirstIngredientIdAtLevel7: Object.freeze({
    8: 14, // Moomoo Milk / Toxtricity (Amped Form)
    17: 12 // Rousing Coffee / Plusle
  })
});
const SUPER_LUCK_INGREDIENT_DRAW_S = Object.freeze({
  mainSkillId: 24,
  ingredientIds: Object.freeze([2, 7, 15, 17]),
  ingredientCountByLevel: INGREDIENT_DRAW_S.countByLevel,
  provisionalOutcomeProbability: Object.freeze({
    ingredient: 0.842,
    smallDreamShards: 0.1308,
    largeDreamShards: 0.0272
  }),
  smallDreamShardsByLevel: Object.freeze({
    1: 500, 2: 720, 3: 1030, 4: 1440, 5: 2000, 6: 2800, 7: 4000
  }),
  largeDreamShardsByLevel: Object.freeze({
    1: 2500, 2: 3600, 3: 5150, 4: 7200, 5: 10000, 6: 14000, 7: 20000
  })
});
const HYPER_CUTTER_INGREDIENT_DRAW_S = Object.freeze({
  mainSkillId: 25,
  maxLevel: 7,
  ingredientIds: Object.freeze([4, 10, 12, 16]),
  ingredientCountByLevel: INGREDIENT_DRAW_S.countByLevel,
  largeSuccessMultiplier: 2,
  provisionalLargeSuccessProbability: 53 / 328,
  probabilitySample: Object.freeze({ largeSuccesses: 53, totalTriggers: 328 })
});
const PRESENT_INGREDIENT_MAGNET_S = Object.freeze({
  mainSkillId: 29,
  maxLevel: 7,
  ingredientCountByLevel: Object.freeze({ 1: 4, 2: 6, 3: 8, 4: 10, 5: 12, 6: 15, 7: 17 }),
  candyCount: 4,
  candyProbability: null
});
const COOKING_ASSIST_S = Object.freeze({
  mainSkillId: 31,
  maxLevel: 7,
  ingredientCountByLevel: INGREDIENT_MAGNET_S.countByLevel,
  tastyBonusPctByLevel: Object.freeze({ 1: 1, 2: 2, 3: 2, 4: 3, 5: 3, 6: 4, 7: 5 }),
  maximumAccumulatedBonusPct: 70,
  operationCeilingScore: 100,
  versatilityScore: 100
});
const METRONOME = Object.freeze({
  mainSkillId: 13,
  maxLevel: 6,
  outcomeProbabilityStatus: 'provisional-equal-25-outcome-pool',
  outcomeIds: Object.freeze([
    'energy-s-fixed', 'energy-s-random', 'energy-m',
    'dream-shard-fixed', 'dream-shard-random',
    'energizing-cheer', 'charge-energy', 'e4e',
    'helping-support', 'ingredient-magnet', 'cooking-power', 'tasty-chance',
    'helper-boost', 'stockpile-zero', 'moonlight', 'berry-burst',
    'super-luck', 'hyper-cutter', 'plus-standalone', 'minus-standalone',
    'present', 'nuzzle', 'berry-juice', 'cooking-assist', 'aura-sphere'
  ])
});
const SKILL_COPY = Object.freeze({
  mainSkillIds: Object.freeze([19, 20]),
  maxLevel: 6,
  targetCount: 4,
  fallbackMainSkillId: ENERGY_CHARGE_S_FIXED.mainSkillId,
  defaultTargetNamesZh: Object.freeze(['活力全体疗愈S', '能量填充M①', '能量填充M②', '能量填充M③']),
  defaultTargetValues: Object.freeze([
    STANDARD_E4E.singleUsePracticalValue,
    ...Array(3).fill(
      ENERGY_CHARGE_M.energyByLevel[6]
      / ENERGY_CHARGE_M.energyByLevel[ENERGY_CHARGE_M.maxLevel]
      * ENERGY_CHARGE_M.singleUsePracticalValue
    )
  ])
});
const ALL_MIGHTY = Object.freeze({
  mainSkillId: 33,
  maxLevel: 8,
  selectableSkillIds: Object.freeze([
    'metronome', 'energy-s-fixed', 'energy-m', 'dream-shard-fixed',
    'ingredient-magnet', 'energizing-cheer', 'charge-energy', 'e4e',
    'tasty-chance', 'cooking-power', 'helping-support', 'berry-burst'
  ]),
  guaranteedCandyPerUse: 1,
  possibleCandyByLevel: Object.freeze({ 1: 1, 2: 1, 3: 1, 4: 1, 5: 1, 6: 2, 7: 3, 8: 4 }),
  bonusCandyProbability: null,
  provisionalIngredientQuantitiesByLevel: Object.freeze({
    1: Object.freeze([2, 2, 2, 2, 2, 2, 2]),
    30: Object.freeze([3, 4, 4, 4, 4, 5, 3]),
    60: Object.freeze([4, 6, 5, 7, 6, 7, 4, 2])
  }),
  provisionalIngredientIdsByLevel: Object.freeze({
    1: Object.freeze([1, 3, 6, 7, 10, 15, 19]),
    30: Object.freeze([1, 3, 6, 7, 10, 15, 19]),
    60: Object.freeze([1, 3, 6, 7, 10, 15, 19, 14])
  })
});
const CURRENT_MAIN_SKILL_MODEL_IDS = Object.freeze([
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36
]);
const PRODUCTION_WEIGHTS = Object.freeze({ ingredientCount: 0.6, ingredientStrength: 0.4 });
const MAIN_SKILL_WEIGHTS = Object.freeze({ typeFit: 0.5, triggerEfficiency: 0.4, naturalLevel: 0.1 });
const INGREDIENT_MAIN_SKILL_TYPE_FIT = Object.freeze({
  1: 40,  // Charge Strength S
  2: 55,  // Charge Strength M
  3: 10,  // Dream Shard Magnet S
  4: 55,  // Energizing Cheer S
  5: 40,  // Charge Strength S (variable)
  6: 10,  // Dream Shard Magnet S (random)
  7: 70,  // Charge Energy S
  8: 75,  // Energy for Everyone S
  9: 80,  // Extra Helpful S
  10: 90, // Ingredient Magnet S
  11: 90, // Cooking Power-Up S
  13: 50, // Metronome
  14: 85, // Tasty Chance S
  18: 75, // Moonlight (Charge Energy S)
  19: 65, // Transform (Skill Copy)
  20: 65, // Mimic (Skill Copy)
  24: 100, // Super Luck (Ingredient Draw S)
  25: 100, // Hyper Cutter (Ingredient Draw S)
  26: 90, // Plus (Ingredient Magnet S)
  27: 90, // Minus (Cooking Power-Up S)
  28: 100, // Ingredient Draw S
  29: 90, // Present (Ingredient Magnet S)
  30: 55, // Nuzzle (Energizing Cheer S)
  31: 95, // Bulk Up (Cooking Assist S)
  32: 75, // Berry Juice (Energy for Everyone S)
  33: 50, // Versatile (Metronome)
  34: 55, // Heal Pulse (Energizing Cheer S)
  36: 10 // Aura Sphere (Dream Shard Magnet S)
});
const BERRY_MAIN_SKILL_TYPE_FIT = Object.freeze({
  1: 50,  // Charge Strength S
  2: 80,  // Charge Strength M
  3: 10,  // Dream Shard Magnet S
  4: 60,  // Energizing Cheer S
  5: 50,  // Charge Strength S (variable)
  6: 10,  // Dream Shard Magnet S (variable)
  7: 80,  // Charge Energy S
  9: 90,  // Extra Helpful S
  10: 75, // Ingredient Magnet S
  11: 75, // Cooking Power-Up S
  12: 100, // Type Boost S
  13: 55, // Metronome
  14: 75  // Tasty Chance S
});
const BERRY_BASE_STRENGTH = Object.freeze({
  1: 28, // Persim / Normal
  2: 27, // Leppa / Fire
  3: 31, // Oran / Water
  4: 25, // Grepa / Electric
  5: 30, // Durin / Grass
  6: 32, // Rawst / Ice
  7: 27, // Cheri / Fighting
  8: 32, // Chesto / Poison
  9: 29, // Figy / Ground
  10: 24, // Pamtre / Flying
  11: 26, // Mago / Psychic
  12: 24, // Lum / Bug
  13: 30, // Sitrus / Rock
  14: 26, // Bluk / Ghost
  15: 35, // Yache / Dragon
  16: 31, // Wiki / Dark
  17: 33, // Belue / Steel
  18: 26 // Pecha / Fairy
});
const INGREDIENT_STRENGTH = Object.freeze({
  1: 185,
  2: 167,
  3: 115,
  4: 124,
  5: 90,
  6: 130,
  7: 103,
  8: 98,
  9: 101,
  10: 121,
  11: 109,
  12: 110,
  13: 151,
  14: 342,
  15: 100,
  16: 140,
  17: 153,
  18: 250,
  19: 162
});
const INGREDIENT_NAME_ZH = Object.freeze({
  1: '粗枝大葱',
  2: '品鲜蘑菇',
  3: '特选蛋',
  4: '窝心洋芋',
  5: '特选苹果',
  6: '火辣香草',
  7: '豆制肉',
  8: '哞哞鲜奶',
  9: '甜甜蜜',
  10: '纯粹油',
  11: '暖暖姜',
  12: '好眠番茄',
  13: '放松可可',
  14: '美味尾巴',
  15: '萌绿大豆',
  16: '萌绿玉米',
  17: '醒脑咖啡豆',
  18: '沉甸甸南瓜',
  19: '嫩亮酪梨'
});

const round = (value, digits = 1) => {
  const scale = 10 ** digits;
  return Math.round((value + Number.EPSILON) * scale) / scale;
};

function nonNegativeWithFloatingTolerance(value, label, tolerance = 1e-6) {
  if (value >= 0) return value;
  if (value >= -tolerance) return 0;
  throw new Error(`${label}不能为负数：${value}`);
}

function helpIntervalAtLevel(baseSeconds, level = TARGET_LEVEL) {
  if (!(baseSeconds > 0)) throw new Error(`无效基础帮忙间隔：${baseSeconds}`);
  if (!(level >= 1 && level <= 100)) throw new Error(`无效等级：${level}`);
  return baseSeconds * (501 - level) / 500;
}

function aaaAverageQuantity(record) {
  const quantities = [1, 30, 60].map(level => {
    const options = record.ingredients?.[String(level)];
    const ingredientA = options?.find(option => option.code === 'A');
    if (!ingredientA) throw new Error(`${record.id} ${record.nameZh || record.nameEn} 缺少Lv.${level}食材A`);
    return ingredientA.quantity;
  });
  return quantities.reduce((sum, quantity) => sum + quantity, 0) / quantities.length;
}

function ingredientA(record) {
  const value = record.ingredients?.['1']?.find(option => option.code === 'A');
  if (!value) throw new Error(`${record.id} ${record.nameZh || record.nameEn} 缺少保证食材A`);
  return value;
}

function inventoryMetrics(record, averageQuantity) {
  if (!(record.carryLimitRaisedFromFirstStage > 0)) {
    throw new Error(`${record.id} 缺少有效最终形态持有上限`);
  }
  if (!(record.baseBerryCount > 0)) throw new Error(`${record.id} 缺少有效基础树果数量`);
  const expectedItemsPerHelp = (
    (1 - record.ingredientRate) * record.baseBerryCount
    + record.ingredientRate * averageQuantity
  );
  const effectiveInterval = (
    helpIntervalAtLevel(record.helpFrequencyBaseSec)
    / AVERAGE_ENERGY_SPEED_MULTIPLIER
  );
  const fillHours = (
    record.carryLimitRaisedFromFirstStage
    / expectedItemsPerHelp
    * effectiveInterval
    / 3600
  );
  const score = Math.min(fillHours / UNATTENDED_HOURS, 1) * 100;
  return {
    expectedItemsPerHelp,
    effectiveHelpIntervalSec: effectiveInterval,
    estimatedFillHours: fillHours,
    inventoryScore: score,
    inventoryContribution: score * INGREDIENT_SPECIES_WEIGHTS.inventory
  };
}

function skillPityCeiling(record) {
  return ['skill', 'all'].includes(record.specialty)
    ? Math.ceil(SKILL_PITY_SECONDS / record.helpFrequencyBaseSec)
    : NON_SKILL_PITY_HELP_COUNT;
}

function maximumStoredSkillTriggers(record) {
  return ['skill', 'all'].includes(record.specialty)
    ? MAX_STORED_SKILL_TRIGGERS
    : NON_SKILL_MAX_STORED_SKILL_TRIGGERS;
}

function effectiveSkillProbability(baseProbability, pityCeiling) {
  if (!(baseProbability > 0 && baseProbability < 1)) throw new Error(`无效技能概率：${baseProbability}`);
  if (!(Number.isInteger(pityCeiling) && pityCeiling > 0)) throw new Error(`无效技能天井：${pityCeiling}`);
  return baseProbability / (1 - ((1 - baseProbability) ** pityCeiling));
}

function ingredientQuantityDistribution(record) {
  const levels = ['1', '30', '60'];
  const quantities = new Map();
  for (const level of levels) {
    const options = record.ingredients?.[level];
    if (!options?.length && record.specialty === 'all') {
      const fallbackQuantities = ALL_MIGHTY.provisionalIngredientQuantitiesByLevel[level];
      for (const quantity of fallbackQuantities) {
        const probability = 1 / fallbackQuantities.length / levels.length;
        quantities.set(quantity, (quantities.get(quantity) || 0) + probability);
      }
      continue;
    }
    if (!options?.length) throw new Error(`${record.id} ${record.nameZh || record.nameEn} 缺少Lv.${level}食材数据`);
    const rawProbabilities = options.map(option => Number(option.combinationProbability));
    const probabilityTotal = rawProbabilities.reduce((sum, probability) => sum + probability, 0);
    const hasUsableProbabilities = (
      rawProbabilities.every(probability => Number.isFinite(probability) && probability >= 0)
      && probabilityTotal > 0
    );
    for (const option of options) {
      const optionIndex = options.indexOf(option);
      const optionProbability = hasUsableProbabilities
        ? rawProbabilities[optionIndex] / probabilityTotal
        : 1 / options.length;
      const probability = optionProbability / levels.length;
      quantities.set(option.quantity, (quantities.get(option.quantity) || 0) + probability);
    }
  }
  return [...quantities.entries()]
    .map(([quantity, probability]) => ({ quantity, probability }))
    .sort((left, right) => left.quantity - right.quantity);
}

function itemCountDistributionPerHelp(record) {
  if (!(record.ingredientRate >= 0 && record.ingredientRate < 1)) {
    throw new Error(`${record.id} 缺少有效食材概率`);
  }
  if (!(record.baseBerryCount > 0)) throw new Error(`${record.id} 缺少有效基础树果数量`);
  const counts = new Map([[record.baseBerryCount, 1 - record.ingredientRate]]);
  for (const ingredient of ingredientQuantityDistribution(record)) {
    const probability = record.ingredientRate * ingredient.probability;
    counts.set(ingredient.quantity, (counts.get(ingredient.quantity) || 0) + probability);
  }
  return [...counts.entries()]
    .map(([count, probability]) => ({ count, probability }))
    .sort((left, right) => left.count - right.count);
}

function unattendedSkillStorageMetrics(
  record,
  hours = UNATTENDED_HOURS,
  operationCeilingScore = STANDARD_E4E.operationCeilingScore
) {
  if (!(record.carryLimitRaisedFromFirstStage > 0)) {
    throw new Error(`${record.id} 缺少有效最终形态持有上限`);
  }
  if (!(record.skillRatePct > 0)) throw new Error(`${record.id} 缺少有效技能概率`);
  if (!(hours > 0)) throw new Error(`无效无人收取时长：${hours}`);

  const baseProbability = record.skillRatePct / 100;
  const pityCeiling = skillPityCeiling(record);
  const maximumStoredTriggers = maximumStoredSkillTriggers(record);
  const effectiveProbability = effectiveSkillProbability(baseProbability, pityCeiling);
  const effectiveHelpIntervalSec = helpIntervalAtLevel(record.helpFrequencyBaseSec) / AVERAGE_ENERGY_SPEED_MULTIPLIER;
  const expectedHelps = hours * 3600 / effectiveHelpIntervalSec;
  const fullHelps = Math.floor(expectedHelps);
  const fractionalHelp = expectedHelps - fullHelps;
  const itemDistribution = itemCountDistributionPerHelp(record);
  const capacity = record.carryLimitRaisedFromFirstStage;
  const failureProbability = 1 - baseProbability;
  let states = new Map();

  for (let streak = 0; streak < pityCeiling; streak += 1) {
    const probability = effectiveProbability * (failureProbability ** streak);
    states.set(`0|${streak}|0`, probability);
  }

  const advanceOneHelp = source => {
    const next = new Map();
    const add = (inventory, streak, stock, probability) => {
      const key = `${inventory}|${streak}|${stock}`;
      next.set(key, (next.get(key) || 0) + probability);
    };
    for (const [key, stateProbability] of source) {
      const [inventory, streak, stock] = key.split('|').map(Number);
      if (inventory >= capacity) {
        add(inventory, streak, stock, stateProbability);
        continue;
      }
      const skillOutcomes = stock >= maximumStoredTriggers
        ? [{ probability: 1, streak, stock }]
        : streak === pityCeiling - 1
          ? [{ probability: 1, streak: 0, stock: stock + 1 }]
          : [
              { probability: baseProbability, streak: 0, stock: stock + 1 },
              { probability: failureProbability, streak: streak + 1, stock }
            ];
      for (const skillOutcome of skillOutcomes) {
        for (const itemOutcome of itemDistribution) {
          add(
            Math.min(inventory + itemOutcome.count, capacity),
            skillOutcome.streak,
            skillOutcome.stock,
            stateProbability * skillOutcome.probability * itemOutcome.probability
          );
        }
      }
    }
    return next;
  };

  for (let help = 0; help < fullHelps; help += 1) states = advanceOneHelp(states);
  if (fractionalHelp > 0) {
    const advanced = advanceOneHelp(states);
    const mixed = new Map();
    for (const [key, probability] of states) mixed.set(key, probability * (1 - fractionalHelp));
    for (const [key, probability] of advanced) mixed.set(key, (mixed.get(key) || 0) + probability * fractionalHelp);
    states = mixed;
  }

  let expectedStoredTriggers = 0;
  let fullInventoryProbability = 0;
  for (const [key, probability] of states) {
    const [inventory, , stock] = key.split('|').map(Number);
    expectedStoredTriggers += stock * probability;
    if (inventory >= capacity) fullInventoryProbability += probability;
  }
  const continuousCollectionExpectedTriggers = expectedHelps * effectiveProbability;
  const retentionRatio = Math.min(expectedStoredTriggers / continuousCollectionExpectedTriggers, 1);
  return {
    hours,
    effectiveHelpIntervalSec,
    expectedHelps,
    pityCeiling,
    maximumStoredTriggers,
    baseSkillProbability: baseProbability,
    effectiveSkillProbability: effectiveProbability,
    continuousCollectionExpectedTriggers,
    expectedStoredTriggers,
    retentionRatio,
    fullInventoryProbability,
    operationScore: operationCeilingScore * retentionRatio
  };
}

function berryJuiceAnchor() {
  const guaranteedHealing = BERRY_JUICE.healingPerHelper * 5;
  const expectedBonusRecovery = BERRY_JUICE.juiceRecovery * BERRY_JUICE.juiceProbability;
  const expectedBonusValue = productiveHealingPracticalValue(expectedBonusRecovery);
  const singleUsePracticalValue = STANDARD_E4E.singleUsePracticalValue + expectedBonusValue;
  const stabilityScore = STANDARD_E4E.singleUsePracticalValue / singleUsePracticalValue * 100;
  const operationCeilingScore = (
    STANDARD_E4E.singleUsePracticalValue * STANDARD_E4E.operationCeilingScore
    + expectedBonusValue * BERRY_JUICE.bonusOperationScore
  ) / singleUsePracticalValue;
  return {
    guaranteedHealing,
    expectedBonusRecovery,
    expectedBonusValue,
    singleUsePracticalValue,
    stabilityScore,
    operationCeilingScore,
    versatilityScore: BERRY_JUICE.versatilityScore
  };
}

function berryJuiceRows(records) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === BERRY_JUICE.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态树果汁技能手数据');
  const anchor = berryJuiceAnchor();
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, anchor.operationCeilingScore);
    const triggerIndexPerDay = 86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      carryLimit: record.carryLimitRaisedFromFirstStage,
      skillRatePct: record.skillRatePct,
      expectedBonusRecovery: round(anchor.expectedBonusRecovery, 1),
      singleUsePracticalValue: round(anchor.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalOutputIndex: round(triggerIndexPerDay * anchor.singleUsePracticalValue, 1),
      stabilityScore: round(anchor.stabilityScore, 1),
      versatilityScore: anchor.versatilityScore,
      naturalLevelContribution: record.evolution?.stage === 3 ? 5 : record.evolution?.stage === 2 ? 2.5 : 0,
      effectiveHelpIntervalSec: round(unattended.effectiveHelpIntervalSec),
      expectedHelpsInEightHours: round(unattended.expectedHelps, 2),
      pityCeiling: unattended.pityCeiling,
      effectiveSkillRatePct: round(unattended.effectiveSkillProbability * 100, 3),
      continuousEightHourTriggers: round(unattended.continuousCollectionExpectedTriggers, 3),
      storedEightHourTriggers: round(unattended.expectedStoredTriggers, 3),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationCeilingScore: round(anchor.operationCeilingScore, 1),
      operationScore: round(unattended.operationScore, 1)
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function productiveHealingPracticalValue(
  totalHealing,
  productiveTargetShare = 1
) {
  if (!(totalHealing >= 0)) throw new Error(`无效回复量：${totalHealing}`);
  if (!(productiveTargetShare >= 0 && productiveTargetShare <= 1)) {
    throw new Error(`无效主产能目标占比：${productiveTargetShare}`);
  }
  return totalHealing * productiveTargetShare * PRODUCTIVE_HEALING_VALUE_PER_ENERGY;
}

function selfRecoveryPracticalValue(totalHealing) {
  if (!(totalHealing >= 0)) throw new Error(`无效自身回复量：${totalHealing}`);
  return totalHealing * SELF_RECOVERY_VALUE_PER_ENERGY;
}

function energizingCheerEffect(
  level = ENERGIZING_CHEER.maxLevel,
  { productiveTargetShare = STANDARD_RANDOM_PRODUCTIVE_TARGET_SHARE } = {}
) {
  const healing = ENERGIZING_CHEER.healingByLevel[level];
  if (!(healing > 0)) throw new Error(`无效活力疗愈S等级：${level}`);
  return {
    level,
    totalHealing: healing,
    productiveTargetShare,
    productiveHealing: healing * productiveTargetShare,
    singleUsePracticalValue: productiveHealingPracticalValue(healing, productiveTargetShare),
    stabilityScore: productiveTargetShare * 100,
    operationCeilingScore: ENERGIZING_CHEER.operationCeilingScore,
    versatilityScore: ENERGIZING_CHEER.versatilityScore
  };
}

function chargeEnergySEffect(level = CHARGE_ENERGY_S.maxLevel) {
  const healing = CHARGE_ENERGY_S.healingByLevel[level];
  if (!(healing > 0)) throw new Error(`无效活力填充S等级：${level}`);
  return {
    level,
    totalHealing: healing,
    singleUsePracticalValue: selfRecoveryPracticalValue(healing),
    stabilityScore: CHARGE_ENERGY_S.stabilityScore,
    operationCeilingScore: CHARGE_ENERGY_S.operationCeilingScore,
    versatilityScore: CHARGE_ENERGY_S.versatilityScore
  };
}

function moonlightEffect(
  level = MOONLIGHT.maxLevel,
  { productiveTargetShare = STANDARD_RANDOM_PRODUCTIVE_TARGET_SHARE } = {}
) {
  const selfHealing = MOONLIGHT.selfHealingByLevel[level];
  const bonusHealing = MOONLIGHT.bonusHealingByLevel[level];
  if (!(selfHealing > 0 && bonusHealing > 0)) throw new Error(`无效月光等级：${level}`);
  const expectedBonusHealing = bonusHealing * MOONLIGHT.bonusProbability;
  const guaranteedTeamHealingValue = 0;
  const expectedBonusValue = productiveHealingPracticalValue(
    expectedBonusHealing,
    productiveTargetShare
  );
  const singleUsePracticalValue = guaranteedTeamHealingValue + expectedBonusValue;
  const usefulTeamHealingProbability = MOONLIGHT.bonusProbability * productiveTargetShare;
  return {
    level,
    selfHealing,
    bonusHealing,
    bonusProbability: MOONLIGHT.bonusProbability,
    productiveTargetShare,
    usefulTeamHealingProbability,
    expectedBonusHealing,
    guaranteedTeamHealingValue,
    expectedBonusValue,
    singleUsePracticalValue,
    stabilityScore: usefulTeamHealingProbability * 100,
    operationCeilingScore: MOONLIGHT.operationCeilingScore,
    versatilityScore: MOONLIGHT.versatilityScore
  };
}

function nuzzleScenario({
  level = NUZZLE.maxLevel,
  targetSkillProbability = NUZZLE.defaultTargetSkillProbability,
  targetSkillPracticalValue = NUZZLE.defaultTargetSkillPracticalValue,
  productiveTargetShare = STANDARD_RANDOM_PRODUCTIVE_TARGET_SHARE
} = {}) {
  const healing = NUZZLE.healingByLevel[level];
  const bonusDraws = NUZZLE.bonusDrawsByLevel[level];
  if (!(healing > 0 && bonusDraws > 0)) throw new Error(`无效蹭蹭脸颊等级：${level}`);
  if (!(targetSkillProbability >= 0 && targetSkillProbability <= 1)) {
    throw new Error(`无效目标技能概率：${targetSkillProbability}`);
  }
  if (!(targetSkillPracticalValue >= 0)) throw new Error(`无效目标技能价值：${targetSkillPracticalValue}`);
  const bonusProbability = 1 - ((1 - targetSkillProbability) ** bonusDraws);
  const lowBonusProbability = 1 - ((1 - NUZZLE.lowTargetSkillProbability) ** bonusDraws);
  const healingValue = productiveHealingPracticalValue(healing, productiveTargetShare);
  const expectedBonusValue = bonusProbability * targetSkillPracticalValue;
  const lowTeamBonusValue = lowBonusProbability * targetSkillPracticalValue;
  const singleUsePracticalValue = healingValue + expectedBonusValue;
  const operationCeilingScore = (
    healingValue * STANDARD_E4E.operationCeilingScore
    + expectedBonusValue * NUZZLE.bonusOperationCeilingScore
  ) / singleUsePracticalValue;
  const versatilityScore = Math.min(
    (healingValue + lowTeamBonusValue) / singleUsePracticalValue * 100,
    100
  );
  return {
    level,
    healing,
    bonusDraws,
    targetSkillProbability,
    targetSkillPracticalValue,
    productiveTargetShare,
    bonusProbability,
    healingValue,
    expectedBonusValue,
    singleUsePracticalValue,
    stabilityScore: healingValue * productiveTargetShare / singleUsePracticalValue * 100,
    operationCeilingScore,
    versatilityScore
  };
}

function expectedIngredientBaseEnergyPerHelp(record) {
  const levels = ['1', '30', '60'];
  return levels.reduce((levelSum, level) => {
    const options = record.ingredients?.[level];
    if (!options?.length && record.specialty === 'all') {
      const ids = ALL_MIGHTY.provisionalIngredientIdsByLevel[level];
      const quantities = ALL_MIGHTY.provisionalIngredientQuantitiesByLevel[level];
      const levelEnergy = ids.reduce(
        (sum, ingredientId, index) => sum + INGREDIENT_STRENGTH[ingredientId] * quantities[index],
        0
      ) / ids.length;
      return levelSum + levelEnergy / levels.length;
    }
    if (!options?.length) throw new Error(`${record.id} ${record.nameZh || record.nameEn} 缺少Lv.${level}食材数据`);
    const rawProbabilities = options.map(option => Number(option.combinationProbability));
    const probabilityTotal = rawProbabilities.reduce((sum, probability) => sum + probability, 0);
    const hasUsableProbabilities = (
      rawProbabilities.every(probability => Number.isFinite(probability) && probability >= 0)
      && probabilityTotal > 0
    );
    const levelEnergy = options.reduce((sum, option, index) => {
      const probability = hasUsableProbabilities
        ? rawProbabilities[index] / probabilityTotal
        : 1 / options.length;
      const ingredientStrength = INGREDIENT_STRENGTH[Number(option.id)];
      if (!(ingredientStrength > 0)) throw new Error(`未知食材ID：${option.id}`);
      return sum + option.quantity * ingredientStrength * probability;
    }, 0);
    return levelSum + levelEnergy / levels.length;
  }, 0);
}

function immediateHelpBaseEnergy(record, favoriteShare = HEAL_PULSE.standardFavoriteShare) {
  if (!(favoriteShare >= 0 && favoriteShare <= 1)) throw new Error(`无效喜爱树果占比：${favoriteShare}`);
  if (!(record.ingredientRate >= 0 && record.ingredientRate < 1)) {
    throw new Error(`${record.id} 缺少有效食材概率`);
  }
  const berryEnergy = (
    (1 - record.ingredientRate)
    * record.baseBerryCount
    * berryStrengthAtLevel(record.berryId)
    * (1 + favoriteShare)
  );
  const ingredientEnergy = (
    record.ingredientRate
    * expectedIngredientBaseEnergyPerHelp(record)
  );
  return berryEnergy + ingredientEnergy;
}

function skillSpecialistOrdinaryProductionRows(records, {
  favoriteShare = SKILL_SPECIALIST_ORDINARY_FAVORITE_SHARE
} = {}) {
  if (!(favoriteShare >= 0 && favoriteShare <= 1)) {
    throw new Error(`无效喜爱树果占比：${favoriteShare}`);
  }
  const candidates = records.filter(record => record.specialty === 'skill' && record.isFinalEvolution);
  if (!candidates.length) throw new Error('没有最终形态技能手数据');

  const rows = candidates.map(record => {
    const level70HelpIntervalSec = helpIntervalAtLevel(record.helpFrequencyBaseSec);
    const berryEnergyPerHelp = (
      (1 - record.ingredientRate)
      * record.baseBerryCount
      * berryStrengthAtLevel(record.berryId)
      * (1 + favoriteShare)
    );
    const ingredientEnergyPerHelp = (
      record.ingredientRate
      * expectedIngredientBaseEnergyPerHelp(record)
    );
    const ordinaryBaseEnergyPerHelp = berryEnergyPerHelp + ingredientEnergyPerHelp;
    const ordinaryBaseEnergyPerDay = 86400 / level70HelpIntervalSec * ordinaryBaseEnergyPerHelp;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      favoriteShare,
      level70HelpIntervalSec,
      berryEnergyPerHelp,
      ingredientEnergyPerHelp,
      ordinaryBaseEnergyPerHelp,
      ordinaryBaseEnergyPerDay
    };
  });
  const bestOrdinaryBaseEnergyPerDay = Math.max(...rows.map(row => row.ordinaryBaseEnergyPerDay));
  return rows.map(row => {
    const ordinaryProductionScore = row.ordinaryBaseEnergyPerDay / bestOrdinaryBaseEnergyPerDay * 100;
    return {
      ...row,
      level70HelpIntervalSec: round(row.level70HelpIntervalSec),
      berryEnergyPerHelp: round(row.berryEnergyPerHelp, 2),
      ingredientEnergyPerHelp: round(row.ingredientEnergyPerHelp, 2),
      ordinaryBaseEnergyPerHelp: round(row.ordinaryBaseEnergyPerHelp, 2),
      ordinaryBaseEnergyPerDay: round(row.ordinaryBaseEnergyPerDay, 1),
      ordinaryProductionScore: round(ordinaryProductionScore),
      ordinaryProductionContribution: round(
        ordinaryProductionScore * SKILL_SPECIALIST_LEGACY_SPECIES_WEIGHTS.ordinaryProduction
      )
    };
  }).sort((left, right) => (
    right.ordinaryProductionScore - left.ordinaryProductionScore
    || left.pokedexId - right.pokedexId
  ));
}

function attachSkillSpecialistOrdinaryProduction(rows, records, options = {}) {
  const productionById = new Map(
    skillSpecialistOrdinaryProductionRows(records, options).map(row => [String(row.id), row])
  );
  return rows.map(row => {
    const production = productionById.get(String(row.id));
    return production ? { ...row, ...production } : row;
  });
}

function standardPrimaryProducerSlotBenchmark(records, {
  favoriteShare = SKILL_SPECIALIST_ORDINARY_FAVORITE_SHARE,
  producerCount = SKILL_SPECIALIST_STANDARD_PRODUCER_COUNT
} = {}) {
  if (!(favoriteShare >= 0 && favoriteShare <= 1)) {
    throw new Error(`无效喜爱树果占比：${favoriteShare}`);
  }
  if (!(Number.isInteger(producerCount) && producerCount > 0)) {
    throw new Error(`无效主产能位数量：${producerCount}`);
  }
  const candidates = records
    .filter(record => record.specialty === 'berry' && record.isFinalEvolution)
    .map(record => {
      const level70HelpIntervalSec = helpIntervalAtLevel(record.helpFrequencyBaseSec);
      const ordinaryBaseEnergyPerHelp = immediateHelpBaseEnergy(record, favoriteShare);
      return {
        id: record.id,
        pokedexId: record.pokedexId,
        nameZh: record.nameZh,
        nameEn: record.nameEn,
        level70HelpIntervalSec,
        ordinaryBaseEnergyPerHelp,
        ordinaryBaseEnergyPerDay: 86400 / level70HelpIntervalSec * ordinaryBaseEnergyPerHelp
      };
    })
    .sort((left, right) => (
      right.ordinaryBaseEnergyPerDay - left.ordinaryBaseEnergyPerDay
      || left.pokedexId - right.pokedexId
    ));
  if (candidates.length < producerCount) {
    throw new Error(`树果手不足${producerCount}只，无法建立位置成本基准`);
  }
  const selected = candidates.slice(0, producerCount);
  const replacedProducer = selected[selected.length - 1];
  return {
    status: 'provisional-standard-primary-producer-benchmark',
    favoriteShare,
    producerCount,
    selected: selected.map(row => ({
      ...row,
      level70HelpIntervalSec: round(row.level70HelpIntervalSec),
      ordinaryBaseEnergyPerHelp: round(row.ordinaryBaseEnergyPerHelp, 2),
      ordinaryBaseEnergyPerDay: round(row.ordinaryBaseEnergyPerDay, 1)
    })),
    replacedProducer: {
      ...replacedProducer,
      level70HelpIntervalSec: round(replacedProducer.level70HelpIntervalSec),
      ordinaryBaseEnergyPerHelp: round(replacedProducer.ordinaryBaseEnergyPerHelp, 2),
      ordinaryBaseEnergyPerDay: round(replacedProducer.ordinaryBaseEnergyPerDay, 1)
    },
    replacementEnergyPerDay: replacedProducer.ordinaryBaseEnergyPerDay,
    replacementOutputIndex: directEnergyPracticalValue(replacedProducer.ordinaryBaseEnergyPerDay)
  };
}

function defaultSkillSpecialistSlotRole(record) {
  const mainSkillId = Number(record?.mainSkill?.id);
  if (FORMAL_HEALER_MAIN_SKILL_IDS.includes(mainSkillId)) {
    return SKILL_SPECIALIST_SLOT_ROLES.HEALER;
  }
  if (CONDITIONAL_HEALER_MAIN_SKILL_IDS.includes(mainSkillId)) {
    return SKILL_SPECIALIST_SLOT_ROLES.CONDITIONAL_HEALER;
  }
  return SKILL_SPECIALIST_SLOT_ROLES.EXTRA_SKILL;
}

function attachSkillSpecialistSlotEconomics(rows, records, {
  favoriteShare = SKILL_SPECIALIST_ORDINARY_FAVORITE_SHARE,
  producerCount = SKILL_SPECIALIST_STANDARD_PRODUCER_COUNT,
  slotRole,
  replacementEnergyPerDay,
  replacementNameZh
} = {}) {
  const validRoles = Object.values(SKILL_SPECIALIST_SLOT_ROLES);
  if (slotRole !== undefined && !validRoles.includes(slotRole)) {
    throw new Error(`无效技能手位置角色：${slotRole}`);
  }
  const recordById = new Map(records.map(record => [String(record.id), record]));
  const standardBenchmark = replacementEnergyPerDay === undefined
    ? standardPrimaryProducerSlotBenchmark(records, { favoriteShare, producerCount })
    : null;
  const benchmarkEnergy = replacementEnergyPerDay === undefined
    ? standardBenchmark.replacementEnergyPerDay
    : Number(replacementEnergyPerDay);
  if (!(benchmarkEnergy >= 0)) throw new Error(`无效位置成本基准：${replacementEnergyPerDay}`);
  const benchmarkOutputIndex = directEnergyPracticalValue(benchmarkEnergy);
  const benchmarkName = replacementNameZh
    ?? standardBenchmark?.replacedProducer.nameZh
    ?? '自定义第4主产能手';

  return rows.map(row => {
    const record = recordById.get(String(row.id));
    const ordinaryEnergyPerDay = Number(row.ordinaryBaseEnergyPerDay);
    const ordinaryOutputIndex = Number.isFinite(ordinaryEnergyPerDay)
      ? directEnergyPracticalValue(ordinaryEnergyPerDay)
      : null;
    const grossSkillOutputIndex = Number(row.theoreticalOutputIndex);
    const grossCombinedOutputIndex = (
      Number.isFinite(grossSkillOutputIndex) && Number.isFinite(ordinaryOutputIndex)
    )
      ? grossSkillOutputIndex + ordinaryOutputIndex
      : null;
    const inferredRole = slotRole ?? defaultSkillSpecialistSlotRole(record);
    const netOutputIndexAsExtraSkill = grossCombinedOutputIndex == null
      ? null
      : grossCombinedOutputIndex - benchmarkOutputIndex;
    const netOutputIndexAsHealer = grossCombinedOutputIndex;
    const slotCostAppliedOutputIndex = inferredRole === SKILL_SPECIALIST_SLOT_ROLES.HEALER
      ? 0
      : inferredRole === SKILL_SPECIALIST_SLOT_ROLES.EXTRA_SKILL
        ? benchmarkOutputIndex
        : null;
    const slotAdjustedOutputIndex = inferredRole === SKILL_SPECIALIST_SLOT_ROLES.HEALER
      ? netOutputIndexAsHealer
      : inferredRole === SKILL_SPECIALIST_SLOT_ROLES.EXTRA_SKILL
        ? netOutputIndexAsExtraSkill
        : null;
    return {
      ...row,
      slotRole: inferredRole,
      slotCostStatus: standardBenchmark?.status ?? 'custom-team-benchmark',
      slotBenchmarkNameZh: benchmarkName,
      slotBenchmarkFavoriteShare: favoriteShare,
      slotBenchmarkProducerCount: producerCount,
      slotBenchmarkEnergyPerDay: round(benchmarkEnergy, 1),
      slotBenchmarkOutputIndex: round(benchmarkOutputIndex, 1),
      slotBenchmarkTeam: standardBenchmark?.selected.map(candidate => candidate.nameZh),
      ordinaryOutputIndex: ordinaryOutputIndex == null ? null : round(ordinaryOutputIndex, 1),
      grossSkillOutputIndex: Number.isFinite(grossSkillOutputIndex)
        ? round(grossSkillOutputIndex, 1)
        : null,
      grossCombinedOutputIndex: grossCombinedOutputIndex == null
        ? null
        : round(grossCombinedOutputIndex, 1),
      slotCostAppliedOutputIndex: slotCostAppliedOutputIndex == null
        ? null
        : round(slotCostAppliedOutputIndex, 1),
      netOutputIndexAsExtraSkill: netOutputIndexAsExtraSkill == null
        ? null
        : round(netOutputIndexAsExtraSkill, 1),
      netOutputIndexAsHealer: netOutputIndexAsHealer == null
        ? null
        : round(netOutputIndexAsHealer, 1),
      slotAdjustedOutputIndex: slotAdjustedOutputIndex == null
        ? null
        : round(slotAdjustedOutputIndex, 1),
      slotAdjustedEquivalentEnergyPerDay: slotAdjustedOutputIndex == null
        ? null
        : round(
            slotAdjustedOutputIndex
            / ENERGY_CHARGE_M.singleUsePracticalValue
            * ENERGY_CHARGE_M.energyByLevel[ENERGY_CHARGE_M.maxLevel],
            1
          )
    };
  });
}

function skillSpecialistMainComprehensiveScore({
  theoreticalOutputScore,
  stabilityScore,
  operationScore,
  versatilityScore
}) {
  const values = [theoreticalOutputScore, stabilityScore, operationScore, versatilityScore];
  if (!values.every(value => Number.isFinite(value))) return null;
  if (!values.every(value => value >= 0 && value <= 100)) {
    throw new Error('技能手主技能组件必须先归一化到0至100');
  }
  return round(
    theoreticalOutputScore * SKILL_SPECIALIST_MAIN_WEIGHTS.theoreticalOutput
    + stabilityScore * SKILL_SPECIALIST_MAIN_WEIGHTS.stability
    + operationScore * SKILL_SPECIALIST_MAIN_WEIGHTS.operation
    + versatilityScore * SKILL_SPECIALIST_MAIN_WEIGHTS.versatility
  );
}

function legacySkillSpecialistSpeciesScore({
  mainSkillComprehensiveScore,
  ordinaryProductionScore,
  naturalMainSkillLevelScore
}) {
  const values = [mainSkillComprehensiveScore, ordinaryProductionScore, naturalMainSkillLevelScore];
  if (!values.every(value => Number.isFinite(value))) return null;
  if (!values.every(value => value >= 0 && value <= 100)) {
    throw new Error('技能手种族组件必须是0至100分');
  }
  return round(
    mainSkillComprehensiveScore * SKILL_SPECIALIST_LEGACY_SPECIES_WEIGHTS.mainSkill
    + ordinaryProductionScore * SKILL_SPECIALIST_LEGACY_SPECIES_WEIGHTS.ordinaryProduction
    + naturalMainSkillLevelScore * SKILL_SPECIALIST_LEGACY_SPECIES_WEIGHTS.naturalLevel
  );
}

function skillSpecialistNormalizedOutputScore(outputIndex, maximumOutputIndex) {
  if (!Number.isFinite(outputIndex)) return null;
  if (!(maximumOutputIndex > 0)) throw new Error(`无效技能手净产出归一化上限：${maximumOutputIndex}`);
  return round(Math.min(Math.max(outputIndex, 0) / maximumOutputIndex, 1) * 100);
}

function skillSpecialistSpeciesScore({
  mainSkillComprehensiveScore,
  naturalMainSkillLevelScore
}) {
  const values = [mainSkillComprehensiveScore, naturalMainSkillLevelScore];
  if (!values.every(value => Number.isFinite(value))) return null;
  if (!values.every(value => value >= 0 && value <= 100)) {
    throw new Error('技能手最终种族组件必须是0至100分');
  }
  return round(
    mainSkillComprehensiveScore * SKILL_SPECIALIST_FINAL_SPECIES_WEIGHTS.skillPerformance
    + naturalMainSkillLevelScore * SKILL_SPECIALIST_FINAL_SPECIES_WEIGHTS.naturalLevel
  );
}

function skillSpecialistSpeciesRankingRows(records, {
  favoriteShare = SKILL_SPECIALIST_ORDINARY_FAVORITE_SHARE,
  producerCount = SKILL_SPECIALIST_STANDARD_PRODUCER_COUNT,
  replacementEnergyPerDay,
  replacementNameZh,
  recoveryOptions = {},
  ingredientAcquisitionOptions = {},
  dreamShardOptions = {},
  tastyChanceOptions = {},
  cookingPowerOptions = {},
  cookingAssistOptions = {},
  metronomeOptions = {},
  fieldBonusPct = 0,
  crescentPrayerOptions = {}
} = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill' && record.isFinalEvolution
  ));
  if (!candidates.length) throw new Error('没有最终形态技能手数据');
  const candidateById = new Map(candidates.map(record => [String(record.id), record]));

  const familyRows = [
    ...recoverySkillRows(records, recoveryOptions),
    ...helpingSupportRows(records, { favoriteShare }),
    ...helperBoostRows(records, { favoriteShare }),
    ...berrySkillRows(records, { favoriteShare }),
    ...ingredientAcquisitionRows(records, ingredientAcquisitionOptions),
    ...dreamShardRows(records, dreamShardOptions),
    ...tastyChanceRows(records, tastyChanceOptions),
    ...cookingPowerRows(records, cookingPowerOptions),
    ...cookingAssistRows(records, cookingAssistOptions),
    ...metronomeRows(records, { favoriteShare, ...metronomeOptions }),
    ...energyChargeSRandomRows(records, { fieldBonusPct }),
    ...energyChargeMRows(records, { fieldBonusPct }),
    ...stockpileRows(records, { fieldBonusPct }),
    ...crescentPrayerRows(records, crescentPrayerOptions)
  ];
  const rowById = new Map();
  familyRows.forEach(row => {
    const id = String(row.id);
    if (!candidateById.has(id)) return;
    if (rowById.has(id)) {
      throw new Error(`技能手${row.nameZh || id}被多个主技能家族重复计入`);
    }
    rowById.set(id, row);
  });
  const missing = candidates.filter(record => !rowById.has(String(record.id)));
  if (missing.length) {
    throw new Error(`缺少技能手主技能模型：${missing.map(record => `${record.nameZh}(${record.mainSkill?.id})`).join('、')}`);
  }

  const rowsWithProduction = attachSkillSpecialistOrdinaryProduction(
    [...rowById.values()],
    records,
    { favoriteShare }
  );
  const rowsWithEconomics = attachSkillSpecialistSlotEconomics(rowsWithProduction, records, {
    favoriteShare,
    producerCount,
    ...(replacementEnergyPerDay === undefined ? {} : { replacementEnergyPerDay }),
    ...(replacementNameZh === undefined ? {} : { replacementNameZh })
  });

  const normalizationScenarios = rowsWithEconomics.flatMap(row => {
    if (row.slotRole === SKILL_SPECIALIST_SLOT_ROLES.CONDITIONAL_HEALER) {
      return [
        {
          id: row.id,
          nameZh: row.nameZh,
          role: SKILL_SPECIALIST_SLOT_ROLES.EXTRA_SKILL,
          outputIndex: row.netOutputIndexAsExtraSkill
        },
        {
          id: row.id,
          nameZh: row.nameZh,
          role: SKILL_SPECIALIST_SLOT_ROLES.HEALER,
          outputIndex: row.netOutputIndexAsHealer
        }
      ];
    }
    return [{
      id: row.id,
      nameZh: row.nameZh,
      role: row.slotRole,
      outputIndex: row.slotAdjustedOutputIndex
    }];
  }).filter(scenario => Number.isFinite(scenario.outputIndex));
  const normalizationAnchor = normalizationScenarios.sort((left, right) => (
    right.outputIndex - left.outputIndex
  ))[0];
  if (!(normalizationAnchor?.outputIndex > 0)) {
    throw new Error('技能手位置净产出没有可用的正数归一化上限');
  }

  const scoreScenario = (row, outputIndex) => {
    const normalizedOutputScore = skillSpecialistNormalizedOutputScore(
      outputIndex,
      normalizationAnchor.outputIndex
    );
    const mainSkillComprehensiveScore = skillSpecialistMainComprehensiveScore({
      theoreticalOutputScore: normalizedOutputScore,
      stabilityScore: row.stabilityScore,
      operationScore: row.operationScore,
      versatilityScore: row.versatilityScore
    });
    const naturalMainSkillLevelScore = Number(row.naturalLevelContribution) / 5 * 100;
    const speciesScore = skillSpecialistSpeciesScore({
      mainSkillComprehensiveScore,
      naturalMainSkillLevelScore
    });
    return {
      outputIndex: round(outputIndex, 1),
      normalizedOutputScore,
      mainSkillComprehensiveScore,
      naturalMainSkillLevelScore: round(naturalMainSkillLevelScore, 1),
      speciesScore
    };
  };

  const scoredRows = rowsWithEconomics.map(row => {
    const record = candidateById.get(String(row.id));
    const isConditionalHealer = row.slotRole === SKILL_SPECIALIST_SLOT_ROLES.CONDITIONAL_HEALER;
    const conservativeRole = isConditionalHealer
      ? SKILL_SPECIALIST_SLOT_ROLES.EXTRA_SKILL
      : row.slotRole;
    const conservativeOutputIndex = isConditionalHealer
      ? row.netOutputIndexAsExtraSkill
      : row.slotAdjustedOutputIndex;
    const conservative = scoreScenario(row, conservativeOutputIndex);
    const healerAlternative = isConditionalHealer
      ? scoreScenario(row, row.netOutputIndexAsHealer)
      : null;
    return {
      ...row,
      skillNameZh: row.skillNameZh ?? record.mainSkill?.nameZh ?? '未知主技能',
      speciesScoreRole: conservativeRole,
      speciesScoreStatus: isConditionalHealer
        ? 'confirmed-formula-dual-role-conservative-extra-skill-ranking'
        : 'confirmed-formula-standard-role',
      normalizedOutputScore: conservative.normalizedOutputScore,
      mainSkillComprehensiveScore: conservative.mainSkillComprehensiveScore,
      naturalMainSkillLevelScore: conservative.naturalMainSkillLevelScore,
      speciesScore: conservative.speciesScore,
      conditionalHealerOutputIndex: healerAlternative?.outputIndex ?? null,
      conditionalHealerNormalizedOutputScore: healerAlternative?.normalizedOutputScore ?? null,
      conditionalHealerMainSkillComprehensiveScore: healerAlternative?.mainSkillComprehensiveScore ?? null,
      conditionalHealerSpeciesScore: healerAlternative?.speciesScore ?? null,
      outputNormalizationMaximum: round(normalizationAnchor.outputIndex, 1),
      outputNormalizationAnchorNameZh: normalizationAnchor.nameZh,
      outputNormalizationAnchorRole: normalizationAnchor.role,
      outputNormalizationStatus: 'current-snapshot-maximum-positive-slot-adjusted-output'
    };
  }).sort((left, right) => (
    right.speciesScore - left.speciesScore
    || right.normalizedOutputScore - left.normalizedOutputScore
    || left.pokedexId - right.pokedexId
  ));

  return scoredRows.map((row, index) => ({ ...row, speciesRank: index + 1 }));
}

function standardImmediateHelpBenchmark(records, {
  favoriteShare = HEAL_PULSE.standardFavoriteShare,
  targetCount = HEAL_PULSE.standardTargetCount
} = {}) {
  const candidates = records
    .filter(record => record.specialty === 'berry' && record.isFinalEvolution)
    .map(record => ({
      id: record.id,
      nameZh: record.nameZh,
      energyPerHelp: immediateHelpBaseEnergy(record, favoriteShare)
    }))
    .sort((left, right) => right.energyPerHelp - left.energyPerHelp);
  if (candidates.length < targetCount) throw new Error(`树果手不足${targetCount}只，无法建立即时帮忙基准`);
  const selected = candidates.slice(0, targetCount);
  return {
    favoriteShare,
    targetCount,
    selected,
    energyPerHelp: selected.reduce((sum, row) => sum + row.energyPerHelp, 0) / selected.length
  };
}

function helpingSupportEffect({
  level = HELPING_SUPPORT_S.maxLevel,
  targetEnergyPerHelp,
  referenceEnergyPerHelp
} = {}) {
  const helps = HELPING_SUPPORT_S.helpsByLevel[level];
  if (!(helps > 0)) throw new Error(`无效帮手支援S等级：${level}`);
  if (!Array.isArray(targetEnergyPerHelp) || targetEnergyPerHelp.length !== HELPING_SUPPORT_S.teamSize) {
    throw new Error(`帮手支援S需要${HELPING_SUPPORT_S.teamSize}名目标的单次帮忙能量`);
  }
  const energies = targetEnergyPerHelp.map(Number);
  if (!energies.every(energy => Number.isFinite(energy) && energy >= 0)) {
    throw new Error(`无效帮手支援S目标能量：${targetEnergyPerHelp}`);
  }
  const averageTargetEnergyPerHelp = energies.reduce((sum, energy) => sum + energy, 0) / energies.length;
  const minimumTargetEnergyPerHelp = Math.min(...energies);
  const maximumTargetEnergyPerHelp = Math.max(...energies);
  const reference = referenceEnergyPerHelp === undefined
    ? maximumTargetEnergyPerHelp
    : Number(referenceEnergyPerHelp);
  if (!(reference > 0)) throw new Error(`无效帮手支援S参考能量：${referenceEnergyPerHelp}`);
  const expectedEnergyPerUse = helps * averageTargetEnergyPerHelp;
  return {
    level,
    helps,
    targetEnergyPerHelp: energies,
    averageTargetEnergyPerHelp,
    minimumTargetEnergyPerHelp,
    maximumTargetEnergyPerHelp,
    expectedEnergyPerUse,
    singleUsePracticalValue: directEnergyPracticalValue(expectedEnergyPerUse),
    stabilityScore: averageTargetEnergyPerHelp > 0
      ? minimumTargetEnergyPerHelp / averageTargetEnergyPerHelp * 100
      : 0,
    operationCeilingScore: HELPING_SUPPORT_S.operationCeilingScore,
    versatilityScore: Math.min(averageTargetEnergyPerHelp / reference * 100, 100)
  };
}

function standardHelpingSupportTeam(records, supportRecord, {
  favoriteShare = HELPING_SUPPORT_S.standardFavoriteShare
} = {}) {
  if (!supportRecord) throw new Error('缺少帮手支援S使用者');
  const healer = records.find(record => (
    record.isFinalEvolution
    && Number(record.pokedexId) === HELPING_SUPPORT_S.standardHealerPokedexId
  ));
  if (!healer) throw new Error('缺少标准回复手沙奈朵数据');
  const benchmark = standardImmediateHelpBenchmark(records, {
    favoriteShare,
    targetCount: HELPING_SUPPORT_S.standardBerryTargetCount
  });
  const targets = [
    {
      role: '回复手',
      id: healer.id,
      nameZh: healer.nameZh,
      energyPerHelp: immediateHelpBaseEnergy(healer, favoriteShare)
    },
    {
      role: '使用者',
      id: supportRecord.id,
      nameZh: supportRecord.nameZh,
      energyPerHelp: immediateHelpBaseEnergy(supportRecord, favoriteShare)
    },
    ...benchmark.selected.map(target => ({ ...target, role: '树果手' }))
  ];
  return {
    favoriteShare,
    targets,
    referenceEnergyPerHelp: benchmark.energyPerHelp
  };
}

function helpingSupportRows(records, options = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === HELPING_SUPPORT_S.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态帮手支援S技能手数据');
  return candidates.map(record => {
    const team = standardHelpingSupportTeam(records, record, options);
    const effect = helpingSupportEffect({
      level: options.level,
      targetEnergyPerHelp: team.targets.map(target => target.energyPerHelp),
      referenceEnergyPerHelp: team.referenceEnergyPerHelp
    });
    const unattended = unattendedSkillStorageMetrics(
      record,
      UNATTENDED_HOURS,
      effect.operationCeilingScore
    );
    const theoreticalTriggerIndexPerDay = (
      86400
      / helpIntervalAtLevel(record.helpFrequencyBaseSec)
      * unattended.effectiveSkillProbability
    );
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      skillNameZh: '帮手支援S',
      level: effect.level,
      helpsPerUse: effect.helps,
      targets: team.targets.map(target => ({
        ...target,
        energyPerHelp: round(target.energyPerHelp, 1)
      })),
      averageTargetEnergyPerHelp: round(effect.averageTargetEnergyPerHelp, 1),
      minimumTargetEnergyPerHelp: round(effect.minimumTargetEnergyPerHelp, 1),
      referenceEnergyPerHelp: round(team.referenceEnergyPerHelp, 1),
      expectedEnergyPerUse: round(effect.expectedEnergyPerUse),
      singleUsePracticalValue: round(effect.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(theoreticalTriggerIndexPerDay, 3),
      theoreticalBaseEnergyPerDay: round(theoreticalTriggerIndexPerDay * effect.expectedEnergyPerUse),
      theoreticalOutputIndex: round(theoreticalTriggerIndexPerDay * effect.singleUsePracticalValue, 1),
      stabilityScore: round(effect.stabilityScore, 1),
      operationCeilingScore: effect.operationCeilingScore,
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationScore: round(unattended.operationScore, 1),
      versatilityScore: round(effect.versatilityScore, 1),
      naturalLevelContribution: record.evolution?.stage === 3 ? 5 : record.evolution?.stage === 2 ? 2.5 : 0
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function uniqueRecordsBySpecies(records) {
  const seen = new Set();
  return records.filter(entry => {
    const record = entry.record || entry;
    const key = `${record.pokedexId}|${record.nameEn || record.nameZh}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function berryEnergyPerBerry(record, favoriteShare = BERRY_BURST.standardFavoriteShare) {
  if (!(favoriteShare >= 0 && favoriteShare <= 1)) throw new Error(`无效喜爱树果占比：${favoriteShare}`);
  return berryStrengthAtLevel(record.berryId) * (1 + favoriteShare);
}

function standardHealerRecord(records, pokedexId = BERRY_BURST.standardHealerPokedexId) {
  const healer = records.find(record => record.isFinalEvolution && Number(record.pokedexId) === pokedexId);
  if (!healer) throw new Error(`缺少标准回复手图鉴${pokedexId}数据`);
  return healer;
}

function helperBoostEffect({
  level = HELPER_BOOST.maxLevel,
  distinctSpecies = HELPER_BOOST.standardDistinctSpecies,
  targetEnergyPerHelp
} = {}) {
  const helpsPerHelper = HELPER_BOOST.helpsByLevelAndDistinctSpecies[level]?.[distinctSpecies];
  if (!(helpsPerHelper > 0)) throw new Error(`无效帮手加速情景：Lv.${level}／${distinctSpecies}种`);
  if (!Array.isArray(targetEnergyPerHelp) || targetEnergyPerHelp.length !== 5) {
    throw new Error('帮手加速需要5名队员的单次帮忙能量');
  }
  const energies = targetEnergyPerHelp.map(Number);
  if (!energies.every(energy => Number.isFinite(energy) && energy >= 0)) {
    throw new Error(`无效帮手加速目标能量：${targetEnergyPerHelp}`);
  }
  const totalTargetEnergyPerHelp = energies.reduce((sum, energy) => sum + energy, 0);
  const expectedEnergyPerUse = helpsPerHelper * totalTargetEnergyPerHelp;
  const baseHelpsPerHelper = HELPER_BOOST.helpsByLevelAndDistinctSpecies[level][1];
  return {
    level,
    distinctSpecies,
    helpsPerHelper,
    totalHelps: helpsPerHelper * energies.length,
    targetEnergyPerHelp: energies,
    totalTargetEnergyPerHelp,
    expectedEnergyPerUse,
    singleUsePracticalValue: directEnergyPracticalValue(expectedEnergyPerUse),
    stabilityScore: HELPER_BOOST.stabilityScore,
    operationCeilingScore: HELPER_BOOST.operationCeilingScore,
    versatilityScore: baseHelpsPerHelper / helpsPerHelper * 100
  };
}

function standardHelperBoostTeam(records, supportRecord, {
  favoriteShare = HELPER_BOOST.standardFavoriteShare
} = {}) {
  if (!supportRecord) throw new Error('缺少帮手加速使用者');
  const healer = standardHealerRecord(records, HELPER_BOOST.standardHealerPokedexId);
  const sameTypeCandidates = uniqueRecordsBySpecies(records
    .filter(record => (
      record.isFinalEvolution
      && Number(record.berryId) === Number(supportRecord.berryId)
      && record.id !== supportRecord.id
    ))
    .map(record => ({ record, energyPerHelp: immediateHelpBaseEnergy(record, favoriteShare) }))
    .sort((left, right) => (
      right.energyPerHelp - left.energyPerHelp
      || Number(left.record.pokedexId) - Number(right.record.pokedexId)
    )))
    .slice(0, HELPER_BOOST.standardSameTypeTeammates);
  if (sameTypeCandidates.length < HELPER_BOOST.standardSameTypeTeammates) {
    throw new Error(`${supportRecord.nameZh || supportRecord.nameEn}缺少同属性不同种队友`);
  }
  const targets = [
    {
      role: '回复手',
      id: healer.id,
      nameZh: healer.nameZh,
      energyPerHelp: immediateHelpBaseEnergy(healer, favoriteShare)
    },
    {
      role: '使用者',
      id: supportRecord.id,
      nameZh: supportRecord.nameZh,
      energyPerHelp: immediateHelpBaseEnergy(supportRecord, favoriteShare)
    },
    ...sameTypeCandidates.map(({ record, energyPerHelp }) => ({
      role: '同属性队友',
      id: record.id,
      nameZh: record.nameZh,
      energyPerHelp
    }))
  ];
  return { favoriteShare, targets, distinctSpecies: HELPER_BOOST.standardDistinctSpecies };
}

function helperBoostRows(records, options = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === HELPER_BOOST.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态帮手加速技能手数据');
  return candidates.map(record => {
    const team = standardHelperBoostTeam(records, record, options);
    const effect = helperBoostEffect({
      level: options.level,
      distinctSpecies: team.distinctSpecies,
      targetEnergyPerHelp: team.targets.map(target => target.energyPerHelp)
    });
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, effect.operationCeilingScore);
    const theoreticalTriggerIndexPerDay = (
      86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability
    );
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      skillNameZh: '帮手加速',
      level: effect.level,
      distinctSpecies: effect.distinctSpecies,
      helpsPerHelper: effect.helpsPerHelper,
      totalHelps: effect.totalHelps,
      targets: team.targets.map(target => ({ ...target, energyPerHelp: round(target.energyPerHelp, 1) })),
      expectedEnergyPerUse: round(effect.expectedEnergyPerUse),
      singleUsePracticalValue: round(effect.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(theoreticalTriggerIndexPerDay, 3),
      theoreticalBaseEnergyPerDay: round(theoreticalTriggerIndexPerDay * effect.expectedEnergyPerUse),
      theoreticalOutputIndex: round(theoreticalTriggerIndexPerDay * effect.singleUsePracticalValue, 1),
      stabilityScore: effect.stabilityScore,
      operationCeilingScore: effect.operationCeilingScore,
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationScore: round(unattended.operationScore, 1),
      versatilityScore: round(effect.versatilityScore, 1),
      naturalLevelContribution: 0
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function standardBerrySkillTeam(records, userRecord, {
  favoriteShare = BERRY_BURST.standardFavoriteShare,
  berryTeammates = BERRY_BURST.standardBerryTeammates
} = {}) {
  if (!userRecord) throw new Error('缺少树果类技能使用者');
  const healer = standardHealerRecord(records, BERRY_BURST.standardHealerPokedexId);
  const berryCandidates = uniqueRecordsBySpecies(records
    .filter(record => (
      record.isFinalEvolution
      && record.specialty === 'berry'
      && record.id !== userRecord.id
      && record.id !== healer.id
    ))
    .map(record => ({
      record,
      berryEnergy: berryEnergyPerBerry(record, favoriteShare),
      helpEnergy: immediateHelpBaseEnergy(record, favoriteShare)
    }))
    .sort((left, right) => (
      right.berryEnergy - left.berryEnergy
      || right.helpEnergy - left.helpEnergy
      || Number(left.record.pokedexId) - Number(right.record.pokedexId)
    )))
    .slice(0, berryTeammates);
  if (berryCandidates.length < berryTeammates) throw new Error(`树果手不足${berryTeammates}只`);
  const targets = [
    {
      role: '使用者',
      id: userRecord.id,
      nameZh: userRecord.nameZh,
      berryEnergy: berryEnergyPerBerry(userRecord, favoriteShare)
    },
    {
      role: '回复手',
      id: healer.id,
      nameZh: healer.nameZh,
      berryEnergy: berryEnergyPerBerry(healer, favoriteShare)
    },
    ...berryCandidates.map(({ record, berryEnergy }) => ({
      role: '树果手',
      id: record.id,
      nameZh: record.nameZh,
      berryEnergy
    }))
  ];
  const referenceTeammateBerryEnergy = (
    berryCandidates.reduce((sum, target) => sum + target.berryEnergy, 0) / berryCandidates.length
  );
  return { favoriteShare, targets, referenceTeammateBerryEnergy };
}

function berryBurstEffect({
  selfBerryCount,
  teammateBerryCount,
  userBerryEnergy,
  teammateBerryEnergies,
  referenceTeammateBerryEnergy,
  stabilityScore = BERRY_BURST.stabilityScore,
  operationCeilingScore = BERRY_BURST.operationCeilingScore
} = {}) {
  if (!(selfBerryCount >= 0 && teammateBerryCount >= 0 && userBerryEnergy >= 0)) {
    throw new Error('无效树果类技能效果量');
  }
  if (!Array.isArray(teammateBerryEnergies) || teammateBerryEnergies.length !== 4) {
    throw new Error('树果类技能需要4名队友的树果能量');
  }
  const teammateEnergies = teammateBerryEnergies.map(Number);
  if (!teammateEnergies.every(energy => Number.isFinite(energy) && energy >= 0)) {
    throw new Error(`无效队友树果能量：${teammateBerryEnergies}`);
  }
  const expectedEnergyPerUse = (
    selfBerryCount * userBerryEnergy
    + teammateBerryCount * teammateEnergies.reduce((sum, energy) => sum + energy, 0)
  );
  const reference = Number(referenceTeammateBerryEnergy);
  const idealTeamEnergy = reference > 0
    ? selfBerryCount * userBerryEnergy + teammateBerryCount * reference * 4
    : expectedEnergyPerUse;
  const teamIndependenceScore = idealTeamEnergy > 0
    ? Math.min(expectedEnergyPerUse / idealTeamEnergy * 100, 100)
    : 0;
  const islandIndependenceScore = 50;
  return {
    selfBerryCount,
    teammateBerryCount,
    totalBerryCount: selfBerryCount + teammateBerryCount * teammateEnergies.length,
    userBerryEnergy,
    teammateBerryEnergies,
    expectedEnergyPerUse,
    singleUsePracticalValue: directEnergyPracticalValue(expectedEnergyPerUse),
    stabilityScore,
    operationCeilingScore,
    teamIndependenceScore,
    islandIndependenceScore,
    versatilityScore: (teamIndependenceScore + islandIndependenceScore) / 2
  };
}

function berrySkillBaseRow(record, effect, unattended, theoreticalTriggerIndexPerDay) {
  return {
    id: record.id,
    pokedexId: record.pokedexId,
    nameZh: record.nameZh,
    nameEn: record.nameEn,
    expectedEnergyPerUse: round(effect.expectedEnergyPerUse),
    singleUsePracticalValue: round(effect.singleUsePracticalValue, 1),
    theoreticalTriggerIndexPerDay: round(theoreticalTriggerIndexPerDay, 3),
    theoreticalBaseEnergyPerDay: round(theoreticalTriggerIndexPerDay * effect.expectedEnergyPerUse),
    theoreticalOutputIndex: round(theoreticalTriggerIndexPerDay * effect.singleUsePracticalValue, 1),
    stabilityScore: round(effect.stabilityScore, 1),
    operationCeilingScore: effect.operationCeilingScore,
    eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
    fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
    operationScore: round(unattended.operationScore, 1),
    teamIndependenceScore: round(effect.teamIndependenceScore, 1),
    islandIndependenceScore: round(effect.islandIndependenceScore, 1),
    versatilityScore: round(effect.versatilityScore, 1),
    naturalLevelContribution: record.evolution?.stage === 3 ? 5 : record.evolution?.stage === 2 ? 2.5 : 0
  };
}

function berryBurstRows(records, options = {}) {
  const level = options.level ?? BERRY_BURST.maxLevel;
  const selfBerryCount = BERRY_BURST.selfBerryByLevel[level];
  const teammateBerryCount = BERRY_BURST.teammateBerryByLevel[level];
  if (!(selfBerryCount > 0 && teammateBerryCount > 0)) throw new Error(`无效树果骤增等级：${level}`);
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === BERRY_BURST.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态树果骤增技能手数据');
  return candidates.map(record => {
    const team = standardBerrySkillTeam(records, record, options);
    const effect = berryBurstEffect({
      selfBerryCount,
      teammateBerryCount,
      userBerryEnergy: team.targets[0].berryEnergy,
      teammateBerryEnergies: team.targets.slice(1).map(target => target.berryEnergy),
      referenceTeammateBerryEnergy: team.referenceTeammateBerryEnergy
    });
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, effect.operationCeilingScore);
    const theoreticalTriggerIndexPerDay = (
      86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability
    );
    return {
      ...berrySkillBaseRow(record, effect, unattended, theoreticalTriggerIndexPerDay),
      skillNameZh: '树果骤增',
      level,
      effectLabel: `${selfBerryCount}+${teammateBerryCount}×4`,
      totalBerryCount: effect.totalBerryCount,
      targets: team.targets.map(target => ({ ...target, berryEnergy: round(target.berryEnergy, 1) }))
    };
  });
}

function disguiseBerryBurstRows(records, options = {}) {
  const level = options.level ?? DISGUISE_BERRY_BURST.maxLevel;
  const selfBerryCount = DISGUISE_BERRY_BURST.selfBerryByLevel[level];
  const teammateBerryCount = DISGUISE_BERRY_BURST.teammateBerryByLevel[level];
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === DISGUISE_BERRY_BURST.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态画皮技能手数据');
  return candidates.map(record => {
    const team = standardBerrySkillTeam(records, record, options);
    const ordinaryEffect = berryBurstEffect({
      selfBerryCount,
      teammateBerryCount,
      userBerryEnergy: team.targets[0].berryEnergy,
      teammateBerryEnergies: team.targets.slice(1).map(target => target.berryEnergy),
      referenceTeammateBerryEnergy: team.referenceTeammateBerryEnergy,
      stabilityScore: 100,
      operationCeilingScore: DISGUISE_BERRY_BURST.operationCeilingScore
    });
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, ordinaryEffect.operationCeilingScore);
    const theoreticalTriggerIndexPerDay = (
      86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability
    );
    const probabilityAtLeastOneLargeSuccess = 1 - (
      1 - DISGUISE_BERRY_BURST.largeSuccessProbability
    ) ** theoreticalTriggerIndexPerDay;
    const bonusMultiplier = DISGUISE_BERRY_BURST.largeSuccessMultiplier - 1;
    const expectedBaseEnergyPerDay = (
      ordinaryEffect.expectedEnergyPerUse * theoreticalTriggerIndexPerDay
      + ordinaryEffect.expectedEnergyPerUse * bonusMultiplier * probabilityAtLeastOneLargeSuccess
    );
    const effectiveEnergyPerUse = expectedBaseEnergyPerDay / theoreticalTriggerIndexPerDay;
    const effect = {
      ...ordinaryEffect,
      expectedEnergyPerUse: effectiveEnergyPerUse,
      singleUsePracticalValue: directEnergyPracticalValue(effectiveEnergyPerUse),
      stabilityScore: (
        ordinaryEffect.expectedEnergyPerUse * theoreticalTriggerIndexPerDay / expectedBaseEnergyPerDay * 100
      )
    };
    return {
      ...berrySkillBaseRow(record, effect, unattended, theoreticalTriggerIndexPerDay),
      skillNameZh: '画皮（树果骤增）',
      level,
      effectLabel: `${selfBerryCount}+${teammateBerryCount}×4；大成功3倍`,
      totalBerryCount: ordinaryEffect.totalBerryCount,
      ordinaryEnergyPerUse: round(ordinaryEffect.expectedEnergyPerUse),
      availableExpectedEnergyPerUse: round(
        ordinaryEffect.expectedEnergyPerUse
        * (1 + bonusMultiplier * DISGUISE_BERRY_BURST.largeSuccessProbability)
      ),
      largeSuccessProbabilityPct: round(DISGUISE_BERRY_BURST.largeSuccessProbability * 100, 1),
      probabilityAtLeastOneLargeSuccessPct: round(probabilityAtLeastOneLargeSuccess * 100, 1),
      expectedBaseEnergyPerDay: round(expectedBaseEnergyPerDay),
      theoreticalBaseEnergyPerDay: round(expectedBaseEnergyPerDay),
      theoreticalOutputIndex: round(directEnergyPracticalValue(expectedBaseEnergyPerDay), 1),
      targets: team.targets.map(target => ({ ...target, berryEnergy: round(target.berryEnergy, 1) }))
    };
  });
}

function standardMeteorShowerTeam(records, userRecord, {
  favoriteShare = BERRY_BURST.standardFavoriteShare
} = {}) {
  const latias = records.find(record => (
    record.isFinalEvolution && Number(record.pokedexId) === METEOR_SHOWER.latiasPokedexId
  ));
  if (!latias) throw new Error('缺少拉帝亚斯数据，无法建立流星群标准队');
  const otherDragons = uniqueRecordsBySpecies(records
    .filter(record => (
      record.isFinalEvolution
      && Number(record.berryId) === METEOR_SHOWER.dragonBerryId
      && record.id !== userRecord.id
      && record.id !== latias.id
    ))
    .map(record => ({
      record,
      berryEnergy: berryEnergyPerBerry(record, favoriteShare),
      helpEnergy: immediateHelpBaseEnergy(record, favoriteShare)
    }))
    .sort((left, right) => (
      right.berryEnergy - left.berryEnergy
      || right.helpEnergy - left.helpEnergy
      || Number(left.record.pokedexId) - Number(right.record.pokedexId)
    )))
    .slice(0, METEOR_SHOWER.standardDragonTeammatesBesidesLatias);
  if (otherDragons.length < METEOR_SHOWER.standardDragonTeammatesBesidesLatias) {
    throw new Error('流星群标准队缺少不同种龙属性队友');
  }
  const targets = [
    { role: '使用者', id: userRecord.id, nameZh: userRecord.nameZh, berryEnergy: berryEnergyPerBerry(userRecord, favoriteShare) },
    { role: '回复手／拉帝亚斯', id: latias.id, nameZh: latias.nameZh, berryEnergy: berryEnergyPerBerry(latias, favoriteShare) },
    ...otherDragons.map(({ record, berryEnergy }) => ({
      role: '龙属性队友', id: record.id, nameZh: record.nameZh, berryEnergy
    }))
  ];
  return { favoriteShare, targets };
}

function meteorShowerEffect({
  level = METEOR_SHOWER.maxLevel,
  distinctDragonSpecies = METEOR_SHOWER.standardDistinctDragonSpecies,
  latiasPresent = true,
  userBerryEnergy,
  teammateBerryEnergies,
  baselineDistinctDragonSpecies = 1
} = {}) {
  if (latiasPresent && distinctDragonSpecies < 2) {
    throw new Error('流星群队伍有拉帝亚斯时至少包含2种龙属性宝可梦');
  }
  const baseSelfBerryCount = METEOR_SHOWER.selfBerryByLevelAndDistinctSpecies[level]?.[distinctDragonSpecies];
  const teammateBerryCount = METEOR_SHOWER.teammateBerryByLevelAndDistinctSpecies[level]?.[distinctDragonSpecies];
  if (!(baseSelfBerryCount > 0 && teammateBerryCount > 0)) {
    throw new Error(`无效流星群情景：Lv.${level}／${distinctDragonSpecies}种龙`);
  }
  const latiasBonus = latiasPresent ? METEOR_SHOWER.latiasSelfBonusByLevel[level] : 0;
  const effect = berryBurstEffect({
    selfBerryCount: baseSelfBerryCount + latiasBonus,
    teammateBerryCount,
    userBerryEnergy,
    teammateBerryEnergies,
    referenceTeammateBerryEnergy: Math.max(...teammateBerryEnergies),
    stabilityScore: METEOR_SHOWER.stabilityScore,
    operationCeilingScore: METEOR_SHOWER.operationCeilingScore
  });
  const baselineSelfBerryCount = (
    METEOR_SHOWER.selfBerryByLevelAndDistinctSpecies[level][baselineDistinctDragonSpecies]
  );
  const baselineTeammateBerryCount = (
    METEOR_SHOWER.teammateBerryByLevelAndDistinctSpecies[level][baselineDistinctDragonSpecies]
  );
  const baselineEnergy = (
    baselineSelfBerryCount * userBerryEnergy
    + baselineTeammateBerryCount * teammateBerryEnergies.reduce((sum, energy) => sum + energy, 0)
  );
  const teamIndependenceScore = baselineEnergy / effect.expectedEnergyPerUse * 100;
  return {
    ...effect,
    baseSelfBerryCount,
    latiasBonus,
    selfBerryCount: baseSelfBerryCount + latiasBonus,
    teammateBerryCount,
    teamIndependenceScore,
    islandIndependenceScore: 50,
    versatilityScore: (teamIndependenceScore + 50) / 2
  };
}

function meteorShowerRows(records, options = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === METEOR_SHOWER.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态流星群技能手数据');
  return candidates.map(record => {
    const team = standardMeteorShowerTeam(records, record, options);
    const effect = meteorShowerEffect({
      level: options.level,
      distinctDragonSpecies: options.distinctDragonSpecies,
      latiasPresent: options.latiasPresent ?? true,
      userBerryEnergy: team.targets[0].berryEnergy,
      teammateBerryEnergies: team.targets.slice(1).map(target => target.berryEnergy)
    });
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, effect.operationCeilingScore);
    const theoreticalTriggerIndexPerDay = (
      86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability
    );
    return {
      ...berrySkillBaseRow(record, effect, unattended, theoreticalTriggerIndexPerDay),
      skillNameZh: '流星群（树果骤增）',
      level: options.level ?? METEOR_SHOWER.maxLevel,
      distinctDragonSpecies: options.distinctDragonSpecies ?? METEOR_SHOWER.standardDistinctDragonSpecies,
      latiasPresent: options.latiasPresent ?? true,
      effectLabel: `${effect.selfBerryCount}+${effect.teammateBerryCount}×4`,
      totalBerryCount: effect.totalBerryCount,
      targets: team.targets.map(target => ({ ...target, berryEnergy: round(target.berryEnergy, 1) }))
    };
  });
}

function berrySkillRows(records, options = {}) {
  return [
    ...berryBurstRows(records, options),
    ...disguiseBerryBurstRows(records, options),
    ...meteorShowerRows(records, options)
  ].sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function healPulseScenario({
  level = HEAL_PULSE.maxLevel,
  latiosPresent = true,
  helpEnergyPerHelp = 500.5,
  healerHelpEnergyPerHelp = 0,
  productiveTargetShare = STANDARD_RANDOM_PRODUCTIVE_TARGET_SHARE
} = {}) {
  const healingPerTarget = HEAL_PULSE.healingByLevel[level];
  const helpsPerTarget = HEAL_PULSE.helpsByLevel[level];
  const latiosBonusHelpsPerTarget = HEAL_PULSE.latiosBonusHelpsByLevel[level];
  if (!(healingPerTarget > 0 && helpsPerTarget > 0 && latiosBonusHelpsPerTarget >= 0)) {
    throw new Error(`无效治愈波动等级：${level}`);
  }
  if (!(helpEnergyPerHelp >= 0)) throw new Error(`无效单次帮忙能量：${helpEnergyPerHelp}`);
  if (!(healerHelpEnergyPerHelp >= 0)) throw new Error(`无效回复手单次帮忙能量：${healerHelpEnergyPerHelp}`);
  if (!(productiveTargetShare >= 0 && productiveTargetShare <= 1)) {
    throw new Error(`无效主产能目标占比：${productiveTargetShare}`);
  }
  const totalHealing = healingPerTarget * HEAL_PULSE.targetCount;
  const productiveHealing = totalHealing * productiveTargetShare;
  const actualHelpsPerTarget = helpsPerTarget + (latiosPresent ? latiosBonusHelpsPerTarget : 0);
  const totalHelps = actualHelpsPerTarget * HEAL_PULSE.targetCount;
  const productiveHelps = totalHelps * productiveTargetShare;
  const healerHelps = totalHelps - productiveHelps;
  const weightedHelpEnergyPerHelp = (
    helpEnergyPerHelp * productiveTargetShare
    + healerHelpEnergyPerHelp * (1 - productiveTargetShare)
  );
  const totalHelpEnergy = totalHelps * weightedHelpEnergyPerHelp;
  const healingValue = productiveHealingPracticalValue(totalHealing, productiveTargetShare);
  const helpingValue = directEnergyPracticalValue(totalHelpEnergy);
  const singleUsePracticalValue = healingValue + helpingValue;
  const operationCeilingScore = (
    healingValue * HEAL_PULSE.healingOperationCeilingScore
    + helpingValue * HEAL_PULSE.helpingOperationCeilingScore
  ) / singleUsePracticalValue;
  const standaloneHelpEnergy = (
    helpsPerTarget
    * HEAL_PULSE.targetCount
    * weightedHelpEnergyPerHelp
  );
  const standaloneValue = healingValue + directEnergyPracticalValue(standaloneHelpEnergy);
  const pairedHelpEnergy = (
    (helpsPerTarget + latiosBonusHelpsPerTarget)
    * HEAL_PULSE.targetCount
    * weightedHelpEnergyPerHelp
  );
  const pairedValue = healingValue + directEnergyPracticalValue(pairedHelpEnergy);
  return {
    level,
    latiosPresent,
    targetCount: HEAL_PULSE.targetCount,
    productiveTargetShare,
    healingPerTarget,
    totalHealing,
    productiveHealing,
    helpsPerTarget: actualHelpsPerTarget,
    totalHelps,
    productiveHelps,
    healerHelps,
    helpEnergyPerHelp,
    healerHelpEnergyPerHelp,
    weightedHelpEnergyPerHelp,
    totalHelpEnergy,
    healingValue,
    helpingValue,
    singleUsePracticalValue,
    standaloneValue,
    pairedValue,
    stabilityScore: HEAL_PULSE.stabilityScore,
    operationCeilingScore,
    versatilityScore: standaloneValue / pairedValue * 100
  };
}

function recoveryEffectRows(records, mainSkillId, skillNameZh, effect) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === mainSkillId
  ));
  if (!candidates.length) throw new Error(`没有最终形态${skillNameZh}技能手数据`);
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(
      record,
      UNATTENDED_HOURS,
      effect.operationCeilingScore
    );
    const triggerIndexPerDay = (
      86400
      / helpIntervalAtLevel(record.helpFrequencyBaseSec)
      * unattended.effectiveSkillProbability
    );
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      skillNameZh,
      productiveTargetShare: effect.productiveTargetShare,
      usefulTeamHealingProbabilityPct: effect.usefulTeamHealingProbability === undefined
        ? undefined
        : round(effect.usefulTeamHealingProbability * 100, 1),
      singleUsePracticalValue: round(effect.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalOutputIndex: round(triggerIndexPerDay * effect.singleUsePracticalValue, 1),
      stabilityScore: round(effect.stabilityScore, 1),
      versatilityScore: round(effect.versatilityScore, 1),
      naturalLevelContribution: record.evolution?.stage === 3 ? 5 : record.evolution?.stage === 2 ? 2.5 : 0,
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationCeilingScore: round(effect.operationCeilingScore, 1),
      operationScore: round(unattended.operationScore, 1)
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function energizingCheerRows(records, options = {}) {
  return recoveryEffectRows(records, ENERGIZING_CHEER.mainSkillId, '活力疗愈S', energizingCheerEffect(undefined, options));
}

function moonlightRows(records, options = {}) {
  return recoveryEffectRows(records, MOONLIGHT.mainSkillId, '月光', moonlightEffect(undefined, options));
}

function nuzzleRows(records, options = {}) {
  return recoveryEffectRows(records, NUZZLE.mainSkillId, '蹭蹭脸颊', nuzzleScenario(options));
}

function healPulseRows(records, options = {}) {
  const benchmark = standardImmediateHelpBenchmark(records);
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === HEAL_PULSE.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态治愈波动技能手数据');
  return candidates.flatMap(record => {
    const effect = healPulseScenario({
      ...options,
      helpEnergyPerHelp: options.helpEnergyPerHelp ?? benchmark.energyPerHelp,
      healerHelpEnergyPerHelp: options.healerHelpEnergyPerHelp
        ?? immediateHelpBaseEnergy(record, benchmark.favoriteShare)
    });
    return recoveryEffectRows([record], HEAL_PULSE.mainSkillId, '治愈波动', effect)
      .map(row => ({
        ...row,
        latiosPresent: effect.latiosPresent,
        healingPerTarget: effect.healingPerTarget,
        productiveTargetShare: effect.productiveTargetShare,
        helpsPerTarget: effect.helpsPerTarget,
        productiveHelps: round(effect.productiveHelps, 1),
        healerHelps: round(effect.healerHelps, 1),
        helpEnergyPerHelp: round(effect.helpEnergyPerHelp, 1),
        healerHelpEnergyPerHelp: round(effect.healerHelpEnergyPerHelp, 1),
        weightedHelpEnergyPerHelp: round(effect.weightedHelpEnergyPerHelp, 1),
        standaloneValue: round(effect.standaloneValue, 1),
        pairedValue: round(effect.pairedValue, 1),
        benchmarkTargets: benchmark.selected.map(target => target.nameZh)
      }));
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function recoverySkillRows(records, options = {}) {
  const standardRows = standardE4eRows(records).map(row => ({
    ...row,
    skillNameZh: '活力全体疗愈S',
    operationCeilingScore: STANDARD_E4E.operationCeilingScore
  }));
  const berryJuice = berryJuiceRows(records).map(row => ({ ...row, skillNameZh: '树果汁' }));
  return [
    ...standardRows,
    ...berryJuice,
    ...energizingCheerRows(records, options),
    ...moonlightRows(records, options),
    ...nuzzleRows(records, options),
    ...healPulseRows(records, options)
  ].sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function energyChargeMEffect(level = ENERGY_CHARGE_M.maxLevel, fieldBonusPct = 0) {
  const baseEnergy = ENERGY_CHARGE_M.energyByLevel[level];
  if (!(baseEnergy > 0)) throw new Error(`无效能量填充M等级：${level}`);
  if (!(fieldBonusPct >= 0)) throw new Error(`无效场地加成：${fieldBonusPct}`);
  return {
    level,
    fieldBonusPct,
    baseEnergy,
    actualEnergy: Math.ceil(baseEnergy * (1 + fieldBonusPct / 100))
  };
}

function directEnergyPracticalValue(baseEnergy) {
  if (!(baseEnergy >= 0)) throw new Error(`无效直接能量：${baseEnergy}`);
  return (
    baseEnergy
    / ENERGY_CHARGE_M.energyByLevel[ENERGY_CHARGE_M.maxLevel]
    * ENERGY_CHARGE_M.singleUsePracticalValue
  );
}

function tastyChanceMealProfile({
  profileId = 'mature-standard',
  uniformMealEnergy,
  cookingEnergyMultiplier = 1
} = {}) {
  if (!(Number.isFinite(cookingEnergyMultiplier) && cookingEnergyMultiplier > 0)) {
    throw new Error(`无效料理能量倍率：${cookingEnergyMultiplier}`);
  }
  const profile = TASTY_CHANCE_S.profiles[profileId];
  if (!profile) throw new Error(`未知料理成功S情景：${profileId}`);
  const mealCount = profile.bonus148Meals + profile.bonus178Meals;
  if (Math.abs(mealCount - TASTY_CHANCE_S.mealsPerWeek) > 1e-9) {
    throw new Error(`${profileId}的每周餐数不是${TASTY_CHANCE_S.mealsPerWeek}`);
  }
  const recipeLevelMultiplier = 1 + TASTY_CHANCE_S.recipeLevelBonusPct / 100;
  const calculatedMealEnergy = recipeLevelMultiplier * (
    profile.bonus148Meals * TASTY_CHANCE_S.recipeBonus148AverageBaseEnergy
    + profile.bonus178Meals * TASTY_CHANCE_S.recipeBonus178AverageBaseEnergy
  ) / mealCount;
  const baseMealEnergy = uniformMealEnergy === undefined
    ? calculatedMealEnergy
    : Number(uniformMealEnergy);
  if (!(Number.isFinite(baseMealEnergy) && baseMealEnergy > 0)) {
    throw new Error(`无效单餐能量：${uniformMealEnergy}`);
  }
  const averageMealEnergy = baseMealEnergy * cookingEnergyMultiplier;
  return {
    ...profile,
    recipeSnapshotDate: TASTY_CHANCE_S.recipeSnapshotDate,
    recipeLevel: TASTY_CHANCE_S.standardRecipeLevel,
    recipeLevelMultiplier,
    calculatedMealEnergy,
    baseMealEnergy,
    cookingEnergyMultiplier,
    averageMealEnergy,
    mealEnergies: Array(TASTY_CHANCE_S.mealsPerWeek).fill(averageMealEnergy)
  };
}

function poissonCappedCounts(mean, maximumCount) {
  if (!(Number.isFinite(mean) && mean >= 0)) throw new Error(`无效泊松均值：${mean}`);
  if (!(Number.isInteger(maximumCount) && maximumCount > 0)) {
    throw new Error(`无效泊松封顶：${maximumCount}`);
  }
  const probabilities = Array(maximumCount + 1).fill(0);
  let probability = Math.exp(-mean);
  probabilities[0] = probability;
  let explicitTotal = probability;
  for (let count = 1; count < maximumCount; count += 1) {
    probability *= mean / count;
    probabilities[count] = probability;
    explicitTotal += probability;
  }
  probabilities[maximumCount] = Math.max(0, 1 - explicitTotal);
  return probabilities;
}

function advanceTastyChanceTriggers(state, triggerMean, bonusPctPerTrigger) {
  const maximumBonus = TASTY_CHANCE_S.maximumAccumulatedBonusPct;
  const maximumUsefulTriggers = Math.ceil(maximumBonus / bonusPctPerTrigger);
  const countProbabilities = poissonCappedCounts(triggerMean, maximumUsefulTriggers);
  const next = Array(maximumBonus + 1).fill(0);
  let expectedAcceptedTriggers = 0;
  for (let bonusPct = 0; bonusPct <= maximumBonus; bonusPct += 1) {
    const stateProbability = state[bonusPct] || 0;
    if (!(stateProbability > 0)) continue;
    if (bonusPct >= maximumBonus) {
      next[maximumBonus] += stateProbability;
      continue;
    }
    const availableTriggerSlots = Math.ceil((maximumBonus - bonusPct) / bonusPctPerTrigger);
    for (let triggerCount = 0; triggerCount < countProbabilities.length; triggerCount += 1) {
      const probability = countProbabilities[triggerCount];
      if (!(probability > 0)) continue;
      const acceptedTriggers = Math.min(triggerCount, availableTriggerSlots);
      const nextBonusPct = Math.min(
        maximumBonus,
        bonusPct + acceptedTriggers * bonusPctPerTrigger
      );
      next[nextBonusPct] += stateProbability * probability;
      expectedAcceptedTriggers += stateProbability * probability * acceptedTriggers;
    }
  }
  return { state: next, expectedAcceptedTriggers };
}

function tastyChanceWeeklyScenario({
  triggerMeanPerMeal,
  level = TASTY_CHANCE_S.maxLevel,
  bonusPctPerTrigger: bonusPctPerTriggerOverride,
  mealEnergies,
  profileId = 'mature-standard',
  uniformMealEnergy,
  cookingEnergyMultiplier = 1
} = {}) {
  if (!(Number.isFinite(triggerMeanPerMeal) && triggerMeanPerMeal >= 0)) {
    throw new Error(`无效每餐间隔触发均值：${triggerMeanPerMeal}`);
  }
  const bonusPctPerTrigger = bonusPctPerTriggerOverride
    ?? TASTY_CHANCE_S.bonusPctByLevel[level];
  if (!(bonusPctPerTrigger > 0)) throw new Error(`无效料理成功S等级：${level}`);
  const profile = tastyChanceMealProfile({ profileId, uniformMealEnergy, cookingEnergyMultiplier });
  const energies = mealEnergies === undefined ? profile.mealEnergies : mealEnergies.map(Number);
  if (
    energies.length !== TASTY_CHANCE_S.mealsPerWeek
    || !energies.every(energy => Number.isFinite(energy) && energy > 0)
  ) {
    throw new Error(`料理成功S需要${TASTY_CHANCE_S.mealsPerWeek}餐的有效能量`);
  }

  const maximumBonus = TASTY_CHANCE_S.maximumAccumulatedBonusPct;
  let state = Array(maximumBonus + 1).fill(0);
  let noBonusSuccessState = Array(maximumBonus + 1).fill(0);
  state[0] = 1;
  noBonusSuccessState[0] = 1;
  let expectedWeeklyEnergy = 0;
  let noSkillExpectedWeeklyEnergy = 0;
  let expectedAcceptedTriggers = 0;

  for (let mealIndex = 0; mealIndex < energies.length; mealIndex += 1) {
    const isSunday = mealIndex >= TASTY_CHANCE_S.weekdayMeals;
    const baseCritProbability = isSunday
      ? TASTY_CHANCE_S.sundayBaseCritProbability
      : TASTY_CHANCE_S.weekdayBaseCritProbability;
    const critMultiplier = isSunday
      ? TASTY_CHANCE_S.sundayCritMultiplier
      : TASTY_CHANCE_S.weekdayCritMultiplier;
    const triggered = advanceTastyChanceTriggers(state, triggerMeanPerMeal, bonusPctPerTrigger);
    state = triggered.state;
    expectedAcceptedTriggers += triggered.expectedAcceptedTriggers;
    noBonusSuccessState = advanceTastyChanceTriggers(
      noBonusSuccessState,
      triggerMeanPerMeal,
      bonusPctPerTrigger
    ).state;

    const nextState = Array(maximumBonus + 1).fill(0);
    const nextNoBonusSuccessState = Array(maximumBonus + 1).fill(0);
    const mealEnergy = energies[mealIndex];
    noSkillExpectedWeeklyEnergy += mealEnergy * (
      1 + baseCritProbability * (critMultiplier - 1)
    );

    for (let bonusPct = 0; bonusPct <= maximumBonus; bonusPct += 1) {
      const probability = state[bonusPct] || 0;
      if (probability > 0) {
        const critProbability = Math.min(1, baseCritProbability + bonusPct / 100);
        expectedWeeklyEnergy += probability * mealEnergy * (
          1 + critProbability * (critMultiplier - 1)
        );
        nextState[0] += probability * critProbability;
        nextState[bonusPct] += probability * (1 - critProbability);
      }

      const noBonusSuccessProbability = noBonusSuccessState[bonusPct] || 0;
      if (noBonusSuccessProbability > 0) {
        const bonusOnlyCritProbability = Math.min(1 - baseCritProbability, bonusPct / 100);
        const noCritProbability = 1 - baseCritProbability - bonusOnlyCritProbability;
        nextNoBonusSuccessState[0] += noBonusSuccessProbability * baseCritProbability;
        nextNoBonusSuccessState[bonusPct] += noBonusSuccessProbability * noCritProbability;
      }
    }
    state = nextState;
    noBonusSuccessState = nextNoBonusSuccessState;
  }

  const incrementalWeeklyEnergy = expectedWeeklyEnergy - noSkillExpectedWeeklyEnergy;
  const noBonusSuccessProbability = noBonusSuccessState.reduce((sum, probability) => sum + probability, 0);
  const expectedGeneratedTriggers = triggerMeanPerMeal * TASTY_CHANCE_S.mealsPerWeek;
  const effectiveEnergyPerAcceptedTrigger = expectedAcceptedTriggers > 0
    ? incrementalWeeklyEnergy / expectedAcceptedTriggers
    : 0;
  return {
    level,
    bonusPctPerTrigger,
    maximumAccumulatedBonusPct: maximumBonus,
    profile,
    triggerMeanPerMeal,
    expectedGeneratedTriggers,
    expectedAcceptedTriggers,
    blockedTriggerOpportunities: Math.max(expectedGeneratedTriggers - expectedAcceptedTriggers, 0),
    noSkillExpectedWeeklyEnergy,
    expectedWeeklyEnergy,
    incrementalWeeklyEnergy,
    incrementalPct: noSkillExpectedWeeklyEnergy > 0
      ? incrementalWeeklyEnergy / noSkillExpectedWeeklyEnergy * 100
      : 0,
    effectiveEnergyPerAcceptedTrigger,
    singleUsePracticalValue: directEnergyPracticalValue(effectiveEnergyPerAcceptedTrigger),
    theoreticalOutputIndex: directEnergyPracticalValue(incrementalWeeklyEnergy / 7),
    stabilityScore: (1 - noBonusSuccessProbability) * 100,
    noBonusSuccessProbability
  };
}

function dreamShardUnitPracticalValue() {
  return (
    ENERGY_CHARGE_M.singleUsePracticalValue
    * DREAM_SHARD_SKILL.fixedInternalSkillSpAtMaxLevel
    / DREAM_SHARD_SKILL.energyChargeMInternalSkillSpAtMaxLevel
    / DREAM_SHARD_SKILL.fixedShardsByLevel[DREAM_SHARD_SKILL.maxLevel]
  );
}

function dreamShardPracticalValue(
  dreamShards,
  demandCoefficient = DREAM_SHARD_SKILL.neutralDemandCoefficient
) {
  if (!(dreamShards >= 0)) throw new Error(`无效梦之碎片数量：${dreamShards}`);
  if (!(Number.isFinite(demandCoefficient) && demandCoefficient >= 0)) {
    throw new Error(`无效梦之碎片需求系数：${demandCoefficient}`);
  }
  return dreamShards * dreamShardUnitPracticalValue() * demandCoefficient;
}

function dreamShardFixedEffect(
  level = DREAM_SHARD_SKILL.maxLevel,
  demandCoefficient = DREAM_SHARD_SKILL.neutralDemandCoefficient
) {
  const dreamShards = DREAM_SHARD_SKILL.fixedShardsByLevel[level];
  if (!(dreamShards > 0)) throw new Error(`无效固定梦之碎片技能等级：${level}`);
  const shardPracticalValue = dreamShardPracticalValue(dreamShards, demandCoefficient);
  return {
    level,
    demandCoefficient,
    minimumDreamShards: dreamShards,
    maximumDreamShards: dreamShards,
    expectedDreamShards: dreamShards,
    dreamShardPracticalValue: shardPracticalValue,
    directEnergyPerUse: 0,
    directEnergyPracticalValue: 0,
    singleUsePracticalValue: shardPracticalValue,
    stabilityScore: 100,
    operationCeilingScore: DREAM_SHARD_SKILL.operationCeilingScore,
    versatilityScore: DREAM_SHARD_SKILL.versatilityScore
  };
}

function dreamShardRandomEffect(
  level = DREAM_SHARD_SKILL.maxLevel,
  demandCoefficient = DREAM_SHARD_SKILL.neutralDemandCoefficient
) {
  const range = DREAM_SHARD_SKILL.randomRangeByLevel[level];
  if (!range) throw new Error(`无效随机梦之碎片技能等级：${level}`);
  const [minimumDreamShards, maximumDreamShards] = range;
  const denominator = DREAM_SHARD_SKILL.outcomeCount - 1;
  const outcomes = Array.from({ length: DREAM_SHARD_SKILL.outcomeCount }, (_, rank) => (
    Math.ceil(
      minimumDreamShards
      + (maximumDreamShards - minimumDreamShards) * rank / denominator
    )
  ));
  const expectedDreamShards = outcomes.reduce((sum, value) => sum + value, 0) / outcomes.length;
  const shardPracticalValue = dreamShardPracticalValue(expectedDreamShards, demandCoefficient);
  return {
    level,
    demandCoefficient,
    outcomeCount: outcomes.length,
    minimumDreamShards,
    maximumDreamShards,
    expectedDreamShards,
    dreamShardPracticalValue: shardPracticalValue,
    directEnergyPerUse: 0,
    directEnergyPracticalValue: 0,
    singleUsePracticalValue: shardPracticalValue,
    stabilityScore: minimumDreamShards / expectedDreamShards * 100,
    operationCeilingScore: DREAM_SHARD_SKILL.operationCeilingScore,
    versatilityScore: DREAM_SHARD_SKILL.versatilityScore
  };
}

function auraSphereEffect({
  level = AURA_SPHERE.maxLevel,
  demandCoefficient = DREAM_SHARD_SKILL.neutralDemandCoefficient,
  fieldBonusPct = 0
} = {}) {
  if (!(fieldBonusPct >= 0)) throw new Error(`无效场地加成：${fieldBonusPct}`);
  const shardEffect = dreamShardFixedEffect(level, demandCoefficient);
  const directEnergyPerUse = AURA_SPHERE.energyByLevel[level];
  if (!(directEnergyPerUse > 0)) throw new Error(`无效波导弹技能等级：${level}`);
  const directEnergyValue = directEnergyPracticalValue(directEnergyPerUse);
  return {
    ...shardEffect,
    fieldBonusPct,
    directEnergyPerUse,
    actualDirectEnergyPerUse: Math.ceil(directEnergyPerUse * (1 + fieldBonusPct / 100)),
    directEnergyPracticalValue: directEnergyValue,
    singleUsePracticalValue: shardEffect.dreamShardPracticalValue + directEnergyValue,
    stabilityScore: AURA_SPHERE.stabilityScore,
    operationCeilingScore: AURA_SPHERE.operationCeilingScore,
    versatilityScore: AURA_SPHERE.versatilityScore
  };
}

function normalizedIngredientIds(ingredientIds) {
  if (!Array.isArray(ingredientIds) || !ingredientIds.length) {
    throw new Error('食材池不能为空');
  }
  const normalized = [...new Set(ingredientIds.map(Number))];
  for (const ingredientId of normalized) {
    if (!(INGREDIENT_STRENGTH[ingredientId] > 0)) {
      throw new Error(`未知食材ID：${ingredientId}`);
    }
  }
  return normalized;
}

function ingredientPool(ingredientIds) {
  return normalizedIngredientIds(ingredientIds).map(id => ({
    id,
    nameZh: INGREDIENT_NAME_ZH[id],
    baseEnergy: INGREDIENT_STRENGTH[id]
  }));
}

function ingredientSkillPracticalValue(baseIngredientEnergy) {
  if (!(baseIngredientEnergy >= 0)) throw new Error(`无效食材基础能量：${baseIngredientEnergy}`);
  const recipeRealizedEnergy = (
    baseIngredientEnergy
    * INGREDIENT_SKILL_COMMON.ingredientWeightedLv1RecipeMultiplier
  );
  return {
    baseIngredientEnergy,
    recipeRealizedEnergy,
    practicalValue: directEnergyPracticalValue(recipeRealizedEnergy)
  };
}

function randomIngredientMagnetEffect({
  ingredientCount,
  ingredientIds = Object.keys(INGREDIENT_STRENGTH).map(Number),
  selectedTypeCount = INGREDIENT_SKILL_COMMON.randomIngredientTypesPerTrigger
} = {}) {
  if (!(Number.isInteger(ingredientCount) && ingredientCount > 0)) {
    throw new Error(`无效随机食材数量：${ingredientCount}`);
  }
  const pool = ingredientPool(ingredientIds);
  if (!(Number.isInteger(selectedTypeCount) && selectedTypeCount > 0 && selectedTypeCount <= pool.length)) {
    throw new Error(`无效随机食材种类数：${selectedTypeCount}`);
  }
  const averageBaseEnergyPerIngredient = (
    pool.reduce((sum, ingredient) => sum + ingredient.baseEnergy, 0) / pool.length
  );
  const lowestSelectedAverageBaseEnergy = (
    [...pool]
      .sort((left, right) => left.baseEnergy - right.baseEnergy)
      .slice(0, selectedTypeCount)
      .reduce((sum, ingredient) => sum + ingredient.baseEnergy, 0)
    / selectedTypeCount
  );
  const expectedBaseIngredientEnergy = ingredientCount * averageBaseEnergyPerIngredient;
  const minimumSelectedBaseIngredientEnergy = ingredientCount * lowestSelectedAverageBaseEnergy;
  const realized = ingredientSkillPracticalValue(expectedBaseIngredientEnergy);
  return {
    ingredientCount,
    selectedTypeCount,
    ingredientPool: pool,
    averageBaseEnergyPerIngredient,
    lowestSelectedAverageBaseEnergy,
    expectedBaseIngredientEnergy,
    minimumSelectedBaseIngredientEnergy,
    recipeRealizedEnergy: realized.recipeRealizedEnergy,
    singleUsePracticalValue: realized.practicalValue,
    stabilityScore: minimumSelectedBaseIngredientEnergy / expectedBaseIngredientEnergy * 100,
    operationCeilingScore: INGREDIENT_SKILL_COMMON.operationCeilingScore,
    versatilityScore: INGREDIENT_SKILL_COMMON.versatilityScore
  };
}

function selectedIngredientEffect({ ingredientCount, ingredientIds } = {}) {
  if (!(Number.isInteger(ingredientCount) && ingredientCount > 0)) {
    throw new Error(`无效精选食材数量：${ingredientCount}`);
  }
  const pool = ingredientPool(ingredientIds);
  const averageBaseEnergyPerIngredient = (
    pool.reduce((sum, ingredient) => sum + ingredient.baseEnergy, 0) / pool.length
  );
  const minimumBaseEnergyPerIngredient = Math.min(...pool.map(ingredient => ingredient.baseEnergy));
  const expectedBaseIngredientEnergy = ingredientCount * averageBaseEnergyPerIngredient;
  const minimumBaseIngredientEnergy = ingredientCount * minimumBaseEnergyPerIngredient;
  const realized = ingredientSkillPracticalValue(expectedBaseIngredientEnergy);
  return {
    ingredientCount,
    ingredientPool: pool,
    averageBaseEnergyPerIngredient,
    minimumBaseEnergyPerIngredient,
    expectedBaseIngredientEnergy,
    minimumBaseIngredientEnergy,
    recipeRealizedEnergy: realized.recipeRealizedEnergy,
    singleUsePracticalValue: realized.practicalValue,
    stabilityScore: minimumBaseIngredientEnergy / expectedBaseIngredientEnergy * 100,
    operationCeilingScore: INGREDIENT_SKILL_COMMON.operationCeilingScore,
    versatilityScore: INGREDIENT_SKILL_COMMON.versatilityScore
  };
}

function recordIngredientPoolIds(record) {
  const ids = Object.values(record.ingredients || {})
    .flat()
    .map(option => Number(option.id));
  return normalizedIngredientIds(ids);
}

function plusIngredientMagnetEffect(record, {
  partnerPresent = true,
  ingredientIds = Object.keys(INGREDIENT_STRENGTH).map(Number),
  level = INGREDIENT_SKILL_COMMON.maxLevel
} = {}) {
  const randomEffect = randomIngredientMagnetEffect({
    ingredientCount: PLUS_INGREDIENT_MAGNET_S.randomCountByLevel[level],
    ingredientIds
  });
  const firstIngredient = ingredientA(record);
  const firstIngredientId = Number(firstIngredient.id);
  const additionalIngredientCount = (
    PLUS_INGREDIENT_MAGNET_S.additionalCountByFirstIngredientIdAtLevel7[firstIngredientId]
  );
  if (partnerPresent && !(additionalIngredientCount > 0)) {
    throw new Error(`${record.nameZh || record.nameEn} 的正电追加食材数量尚未核实`);
  }
  const additionalBaseIngredientEnergy = (
    (additionalIngredientCount || 0) * INGREDIENT_STRENGTH[firstIngredientId]
  );
  const standalone = ingredientSkillPracticalValue(randomEffect.expectedBaseIngredientEnergy);
  const pairedBaseIngredientEnergy = (
    randomEffect.expectedBaseIngredientEnergy + additionalBaseIngredientEnergy
  );
  const paired = ingredientSkillPracticalValue(pairedBaseIngredientEnergy);
  const pairedMinimumBaseIngredientEnergy = (
    randomEffect.minimumSelectedBaseIngredientEnergy + additionalBaseIngredientEnergy
  );
  const selectedBaseIngredientEnergy = partnerPresent
    ? pairedBaseIngredientEnergy
    : randomEffect.expectedBaseIngredientEnergy;
  const selectedRealized = ingredientSkillPracticalValue(selectedBaseIngredientEnergy);
  return {
    partnerPresent,
    randomIngredientCount: randomEffect.ingredientCount,
    ingredientPool: randomEffect.ingredientPool,
    firstIngredient: {
      id: firstIngredientId,
      nameZh: INGREDIENT_NAME_ZH[firstIngredientId],
      baseEnergy: INGREDIENT_STRENGTH[firstIngredientId]
    },
    additionalIngredientCount,
    additionalBaseIngredientEnergy,
    standaloneBaseIngredientEnergy: randomEffect.expectedBaseIngredientEnergy,
    standalonePracticalValue: standalone.practicalValue,
    pairedBaseIngredientEnergy,
    pairedPracticalValue: paired.practicalValue,
    expectedBaseIngredientEnergy: selectedBaseIngredientEnergy,
    recipeRealizedEnergy: selectedRealized.recipeRealizedEnergy,
    singleUsePracticalValue: selectedRealized.practicalValue,
    stabilityScore: partnerPresent
      ? pairedMinimumBaseIngredientEnergy / pairedBaseIngredientEnergy * 100
      : randomEffect.stabilityScore,
    operationCeilingScore: INGREDIENT_SKILL_COMMON.operationCeilingScore,
    versatilityScore: partnerPresent
      ? standalone.practicalValue / paired.practicalValue * 100
      : INGREDIENT_SKILL_COMMON.versatilityScore
  };
}

function superLuckIngredientDrawEffect({
  dreamShardDemandCoefficient = DREAM_SHARD_SKILL.neutralDemandCoefficient,
  level = INGREDIENT_SKILL_COMMON.maxLevel
} = {}) {
  const selected = selectedIngredientEffect({
    ingredientCount: SUPER_LUCK_INGREDIENT_DRAW_S.ingredientCountByLevel[level],
    ingredientIds: SUPER_LUCK_INGREDIENT_DRAW_S.ingredientIds
  });
  const probabilities = SUPER_LUCK_INGREDIENT_DRAW_S.provisionalOutcomeProbability;
  const expectedBaseIngredientEnergy = (
    probabilities.ingredient * selected.expectedBaseIngredientEnergy
  );
  const ingredientRealized = ingredientSkillPracticalValue(expectedBaseIngredientEnergy);
  const expectedDreamShardsPerUse = (
    probabilities.smallDreamShards * SUPER_LUCK_INGREDIENT_DRAW_S.smallDreamShardsByLevel[level]
    + probabilities.largeDreamShards * SUPER_LUCK_INGREDIENT_DRAW_S.largeDreamShardsByLevel[level]
  );
  const shardPracticalValue = dreamShardPracticalValue(
    expectedDreamShardsPerUse,
    dreamShardDemandCoefficient
  );
  const minimumIngredientOutcomePracticalValue = ingredientSkillPracticalValue(
    selected.minimumBaseIngredientEnergy
  ).practicalValue;
  const minimumOutcomePracticalValue = Math.min(
    minimumIngredientOutcomePracticalValue,
    dreamShardPracticalValue(
      SUPER_LUCK_INGREDIENT_DRAW_S.smallDreamShardsByLevel[level],
      dreamShardDemandCoefficient
    ),
    dreamShardPracticalValue(
      SUPER_LUCK_INGREDIENT_DRAW_S.largeDreamShardsByLevel[level],
      dreamShardDemandCoefficient
    )
  );
  const singleUsePracticalValue = ingredientRealized.practicalValue + shardPracticalValue;
  return {
    ingredientCountOnIngredientOutcome: selected.ingredientCount,
    ingredientPool: selected.ingredientPool,
    ingredientOutcomeProbability: probabilities.ingredient,
    smallDreamShardProbability: probabilities.smallDreamShards,
    largeDreamShardProbability: probabilities.largeDreamShards,
    expectedBaseIngredientEnergy,
    recipeRealizedIngredientEnergy: ingredientRealized.recipeRealizedEnergy,
    ingredientPracticalValue: ingredientRealized.practicalValue,
    expectedDreamShardsPerUse,
    dreamShardDemandCoefficient,
    dreamShardPracticalValue: shardPracticalValue,
    minimumOutcomePracticalValue,
    singleUsePracticalValue,
    stabilityScore: minimumOutcomePracticalValue / singleUsePracticalValue * 100,
    ingredientSupplyStabilityScore: (
      probabilities.ingredient
      * selected.minimumBaseEnergyPerIngredient
      / selected.averageBaseEnergyPerIngredient
      * 100
    ),
    operationCeilingScore: INGREDIENT_SKILL_COMMON.operationCeilingScore,
    versatilityScore: INGREDIENT_SKILL_COMMON.versatilityScore,
    scoringStatus: 'provisional-outcome-probabilities'
  };
}

function hyperCutterIngredientDrawEffect({
  level = HYPER_CUTTER_INGREDIENT_DRAW_S.maxLevel
} = {}) {
  const ingredientCount = HYPER_CUTTER_INGREDIENT_DRAW_S.ingredientCountByLevel[level];
  if (!(ingredientCount > 0)) throw new Error(`无效怪力钳等级：${level}`);
  const selected = selectedIngredientEffect({
    ingredientCount,
    ingredientIds: HYPER_CUTTER_INGREDIENT_DRAW_S.ingredientIds
  });
  const probability = HYPER_CUTTER_INGREDIENT_DRAW_S.provisionalLargeSuccessProbability;
  const multiplier = HYPER_CUTTER_INGREDIENT_DRAW_S.largeSuccessMultiplier;
  const expectedMultiplier = 1 + probability * (multiplier - 1);
  const expectedBaseIngredientEnergy = selected.expectedBaseIngredientEnergy * expectedMultiplier;
  const realized = ingredientSkillPracticalValue(expectedBaseIngredientEnergy);
  const minimumOutcomePracticalValue = ingredientSkillPracticalValue(
    selected.minimumBaseIngredientEnergy
  ).practicalValue;
  return {
    level,
    ingredientCount,
    ingredientPool: selected.ingredientPool,
    largeSuccessProbability: probability,
    largeSuccessMultiplier: multiplier,
    probabilitySample: HYPER_CUTTER_INGREDIENT_DRAW_S.probabilitySample,
    expectedMultiplier,
    expectedBaseIngredientEnergy,
    recipeRealizedEnergy: realized.recipeRealizedEnergy,
    ingredientPracticalValue: realized.practicalValue,
    singleUsePracticalValue: realized.practicalValue,
    minimumOutcomePracticalValue,
    stabilityScore: minimumOutcomePracticalValue / realized.practicalValue * 100,
    ingredientSupplyStabilityScore: (
      selected.minimumBaseIngredientEnergy / expectedBaseIngredientEnergy * 100
    ),
    operationCeilingScore: INGREDIENT_SKILL_COMMON.operationCeilingScore,
    versatilityScore: INGREDIENT_SKILL_COMMON.versatilityScore,
    scoringStatus: 'confirmed-effects-provisional-53-of-328-large-success-rate'
  };
}

function presentIngredientMagnetEffect({
  level = PRESENT_INGREDIENT_MAGNET_S.maxLevel,
  ingredientIds = Object.keys(INGREDIENT_STRENGTH).map(Number),
  candyProbability = PRESENT_INGREDIENT_MAGNET_S.candyProbability,
  candyUnitPracticalValue
} = {}) {
  const ingredientCount = PRESENT_INGREDIENT_MAGNET_S.ingredientCountByLevel[level];
  if (!(ingredientCount > 0)) throw new Error(`无效礼物等级：${level}`);
  if (candyProbability != null && !(candyProbability >= 0 && candyProbability <= 1)) {
    throw new Error(`无效礼物糖果概率：${candyProbability}`);
  }
  if (candyUnitPracticalValue != null && !(candyUnitPracticalValue >= 0)) {
    throw new Error(`无效糖果单位价值：${candyUnitPracticalValue}`);
  }
  const ingredientEffect = randomIngredientMagnetEffect({ ingredientCount, ingredientIds });
  const candyPracticalValue = candyProbability == null || candyUnitPracticalValue == null
    ? null
    : candyProbability * PRESENT_INGREDIENT_MAGNET_S.candyCount * candyUnitPracticalValue;
  return {
    ...ingredientEffect,
    level,
    ingredientPracticalValue: ingredientEffect.singleUsePracticalValue,
    candyCountOnCandyOutcome: PRESENT_INGREDIENT_MAGNET_S.candyCount,
    candyProbability,
    candyUnitPracticalValue: candyUnitPracticalValue ?? null,
    candyPracticalValue,
    singleUsePracticalValue: ingredientEffect.singleUsePracticalValue + (candyPracticalValue ?? 0),
    completeSingleUsePracticalValue: candyPracticalValue == null
      ? null
      : ingredientEffect.singleUsePracticalValue + candyPracticalValue,
    scoringStatus: candyPracticalValue == null
      ? 'confirmed-ingredient-component-pending-candy-probability-or-value'
      : 'confirmed-with-user-candy-conversion'
  };
}

function ingredientAcquisitionRows(records, {
  plusPartnerPresent = true,
  unlockedIngredientIds = Object.keys(INGREDIENT_STRENGTH).map(Number),
  dreamShardDemandCoefficient = DREAM_SHARD_SKILL.neutralDemandCoefficient,
  presentCandyProbability = PRESENT_INGREDIENT_MAGNET_S.candyProbability,
  candyUnitPracticalValue
} = {}) {
  const supportedSkillIds = new Set([
    INGREDIENT_MAGNET_S.mainSkillId,
    INGREDIENT_DRAW_S.mainSkillId,
    PLUS_INGREDIENT_MAGNET_S.mainSkillId,
    SUPER_LUCK_INGREDIENT_DRAW_S.mainSkillId,
    HYPER_CUTTER_INGREDIENT_DRAW_S.mainSkillId,
    PRESENT_INGREDIENT_MAGNET_S.mainSkillId
  ]);
  const candidates = records.filter(record => (
    record.isFinalEvolution
    && supportedSkillIds.has(Number(record.mainSkill?.id))
  ));
  if (!candidates.length) throw new Error('没有最终形态食材获取类主技能数据');

  return candidates.map(record => {
    const mainSkillId = Number(record.mainSkill.id);
    let effect;
    let skillNameZh;
    let scoringStatus = 'provisional-equal-pool';
    if (mainSkillId === INGREDIENT_MAGNET_S.mainSkillId) {
      effect = randomIngredientMagnetEffect({
        ingredientCount: INGREDIENT_MAGNET_S.countByLevel[INGREDIENT_SKILL_COMMON.maxLevel],
        ingredientIds: unlockedIngredientIds
      });
      skillNameZh = '食材获取S';
    } else if (mainSkillId === INGREDIENT_DRAW_S.mainSkillId) {
      effect = selectedIngredientEffect({
        ingredientCount: INGREDIENT_DRAW_S.countByLevel[INGREDIENT_SKILL_COMMON.maxLevel],
        ingredientIds: recordIngredientPoolIds(record)
      });
      skillNameZh = '食材精选S';
    } else if (mainSkillId === PLUS_INGREDIENT_MAGNET_S.mainSkillId) {
      effect = plusIngredientMagnetEffect(record, {
        partnerPresent: plusPartnerPresent,
        ingredientIds: unlockedIngredientIds
      });
      skillNameZh = '正电（食材获取S）';
    } else if (mainSkillId === SUPER_LUCK_INGREDIENT_DRAW_S.mainSkillId) {
      effect = superLuckIngredientDrawEffect({ dreamShardDemandCoefficient });
      skillNameZh = '超幸运（食材精选S）';
      scoringStatus = effect.scoringStatus;
    } else if (mainSkillId === HYPER_CUTTER_INGREDIENT_DRAW_S.mainSkillId) {
      effect = hyperCutterIngredientDrawEffect();
      skillNameZh = '怪力钳（食材精选S）';
      scoringStatus = effect.scoringStatus;
    } else {
      effect = presentIngredientMagnetEffect({
        ingredientIds: unlockedIngredientIds,
        candyProbability: presentCandyProbability,
        candyUnitPracticalValue
      });
      skillNameZh = '礼物（食材获取S）';
      scoringStatus = effect.scoringStatus;
    }

    const operationCeilingScore = effect.operationCeilingScore;
    const unattended = unattendedSkillStorageMetrics(
      record,
      UNATTENDED_HOURS,
      operationCeilingScore
    );
    const triggerIndexPerDay = (
      86400
      / helpIntervalAtLevel(record.helpFrequencyBaseSec)
      * unattended.effectiveSkillProbability
    );
    const isPending = scoringStatus.startsWith('pending-');
    const singleUsePracticalValue = isPending ? null : effect.singleUsePracticalValue;
    const ingredientPracticalValue = (
      effect.ingredientPracticalValue ?? effect.singleUsePracticalValue
    );
    const stabilityScore = isPending ? null : effect.stabilityScore;
    const versatilityScore = isPending ? null : effect.versatilityScore;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      skillNameZh,
      scoringStatus,
      carryLimit: record.carryLimitRaisedFromFirstStage,
      skillRatePct: record.skillRatePct,
      maxSkillLevel: INGREDIENT_SKILL_COMMON.maxLevel,
      ingredientPool: effect.ingredientPool,
      expectedBaseIngredientEnergyPerUse: round(effect.expectedBaseIngredientEnergy, 1),
      recipeRealizationMultiplier: round(
        INGREDIENT_SKILL_COMMON.ingredientWeightedLv1RecipeMultiplier,
        4
      ),
      recipeRealizedIngredientEnergyPerUse: round(
        effect.recipeRealizedEnergy ?? effect.recipeRealizedIngredientEnergy,
        1
      ),
      ingredientPracticalValue: round(ingredientPracticalValue, 1),
      dreamShardPracticalValue: round(effect.dreamShardPracticalValue ?? 0, 1),
      candyPracticalValue: effect.candyPracticalValue == null
        ? null
        : round(effect.candyPracticalValue, 1),
      singleUsePracticalValue: singleUsePracticalValue == null
        ? null
        : round(singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalIngredientOutputIndex: round(triggerIndexPerDay * ingredientPracticalValue, 1),
      theoreticalOutputIndex: singleUsePracticalValue == null
        ? null
        : round(triggerIndexPerDay * singleUsePracticalValue, 1),
      stabilityScore: stabilityScore == null ? null : round(stabilityScore, 1),
      ingredientSupplyStabilityScore: round(
        effect.ingredientSupplyStabilityScore ?? effect.stabilityScore,
        1
      ),
      operationCeilingScore,
      versatilityScore: versatilityScore == null ? null : round(versatilityScore, 1),
      naturalLevelContribution: record.evolution?.stage === 3
        ? 5
        : record.evolution?.stage === 2
          ? 2.5
          : 0,
      effectiveHelpIntervalSec: round(unattended.effectiveHelpIntervalSec),
      pityCeiling: unattended.pityCeiling,
      effectiveSkillRatePct: round(unattended.effectiveSkillProbability * 100, 3),
      continuousEightHourTriggers: round(unattended.continuousCollectionExpectedTriggers, 3),
      storedEightHourTriggers: round(unattended.expectedStoredTriggers, 3),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationScore: round(unattended.operationScore, 1),
      ...(mainSkillId === PLUS_INGREDIENT_MAGNET_S.mainSkillId ? {
        plusPartnerPresent: effect.partnerPresent,
        randomIngredientCount: effect.randomIngredientCount,
        firstIngredient: effect.firstIngredient,
        additionalIngredientCount: effect.additionalIngredientCount,
        standalonePracticalValue: round(effect.standalonePracticalValue, 1),
        pairedPracticalValue: round(effect.pairedPracticalValue, 1)
      } : {}),
      ...(mainSkillId === SUPER_LUCK_INGREDIENT_DRAW_S.mainSkillId ? {
        ingredientOutcomeProbabilityPct: round(effect.ingredientOutcomeProbability * 100, 1),
        smallDreamShardProbabilityPct: round(effect.smallDreamShardProbability * 100, 2),
        largeDreamShardProbabilityPct: round(effect.largeDreamShardProbability * 100, 2),
        expectedDreamShardsPerUse: round(effect.expectedDreamShardsPerUse, 1),
        dreamShardDemandCoefficient: effect.dreamShardDemandCoefficient,
        minimumOutcomePracticalValue: round(effect.minimumOutcomePracticalValue, 1)
      } : {}),
      ...(mainSkillId === HYPER_CUTTER_INGREDIENT_DRAW_S.mainSkillId ? {
        largeSuccessProbabilityPct: round(effect.largeSuccessProbability * 100, 2),
        largeSuccessMultiplier: effect.largeSuccessMultiplier,
        probabilitySample: effect.probabilitySample,
        minimumOutcomePracticalValue: round(effect.minimumOutcomePracticalValue, 1)
      } : {}),
      ...(mainSkillId === PRESENT_INGREDIENT_MAGNET_S.mainSkillId ? {
        candyCountOnCandyOutcome: effect.candyCountOnCandyOutcome,
        candyProbability: effect.candyProbability,
        candyUnitPracticalValue: effect.candyUnitPracticalValue,
        completeSingleUsePracticalValue: effect.completeSingleUsePracticalValue == null
          ? null
          : round(effect.completeSingleUsePracticalValue, 1)
      } : {})
    };
  }).sort((left, right) => (
    (right.theoreticalOutputIndex ?? right.theoreticalIngredientOutputIndex)
    - (left.theoreticalOutputIndex ?? left.theoreticalIngredientOutputIndex)
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function dreamShardRows(records, {
  demandCoefficient = DREAM_SHARD_SKILL.neutralDemandCoefficient,
  fieldBonusPct = 0
} = {}) {
  const supportedSkillIds = new Set([
    DREAM_SHARD_SKILL.fixedMainSkillId,
    DREAM_SHARD_SKILL.randomMainSkillId,
    DREAM_SHARD_SKILL.auraSphereMainSkillId
  ]);
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && supportedSkillIds.has(Number(record.mainSkill?.id))
  ));
  if (!candidates.length) throw new Error('没有最终形态梦之碎片类技能手数据');

  return candidates.map(record => {
    const mainSkillId = Number(record.mainSkill.id);
    const effect = mainSkillId === DREAM_SHARD_SKILL.fixedMainSkillId
      ? dreamShardFixedEffect(DREAM_SHARD_SKILL.maxLevel, demandCoefficient)
      : mainSkillId === DREAM_SHARD_SKILL.randomMainSkillId
        ? dreamShardRandomEffect(DREAM_SHARD_SKILL.maxLevel, demandCoefficient)
        : auraSphereEffect({ demandCoefficient, fieldBonusPct });
    const unattended = unattendedSkillStorageMetrics(
      record,
      UNATTENDED_HOURS,
      effect.operationCeilingScore
    );
    const triggerIndexPerDay = (
      86400
      / helpIntervalAtLevel(record.helpFrequencyBaseSec)
      * unattended.effectiveSkillProbability
    );
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      skillNameZh: mainSkillId === DREAM_SHARD_SKILL.fixedMainSkillId
        ? '梦之碎片获取S'
        : mainSkillId === DREAM_SHARD_SKILL.randomMainSkillId
          ? '梦之碎片获取S（随机）'
          : '波导弹（梦之碎片获取S）',
      scoringStatus: 'confirmed-neutral-conversion',
      maxSkillLevel: DREAM_SHARD_SKILL.maxLevel,
      dreamShardDemandCoefficient: demandCoefficient,
      minimumDreamShardsPerUse: effect.minimumDreamShards,
      maximumDreamShardsPerUse: effect.maximumDreamShards,
      expectedDreamShardsPerUse: round(effect.expectedDreamShards, 1),
      dreamShardPracticalValue: round(effect.dreamShardPracticalValue, 1),
      directEnergyPerUse: effect.directEnergyPerUse,
      actualDirectEnergyPerUse: effect.actualDirectEnergyPerUse ?? effect.directEnergyPerUse,
      directEnergyPracticalValue: round(effect.directEnergyPracticalValue, 1),
      singleUsePracticalValue: round(effect.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalDreamShardsPerDay: round(triggerIndexPerDay * effect.expectedDreamShards, 1),
      theoreticalDirectEnergyPerDay: round(triggerIndexPerDay * effect.directEnergyPerUse),
      theoreticalOutputIndex: round(triggerIndexPerDay * effect.singleUsePracticalValue, 1),
      stabilityScore: round(effect.stabilityScore, 1),
      operationCeilingScore: effect.operationCeilingScore,
      versatilityScore: round(effect.versatilityScore, 1),
      naturalLevelContribution: record.evolution?.stage === 3
        ? 5
        : record.evolution?.stage === 2
          ? 2.5
          : 0,
      effectiveHelpIntervalSec: round(unattended.effectiveHelpIntervalSec),
      pityCeiling: unattended.pityCeiling,
      effectiveSkillRatePct: round(unattended.effectiveSkillProbability * 100, 3),
      continuousEightHourTriggers: round(unattended.continuousCollectionExpectedTriggers, 3),
      storedEightHourTriggers: round(unattended.expectedStoredTriggers, 3),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationScore: round(unattended.operationScore, 1)
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function tastyChanceRows(records, {
  profileId = 'mature-standard',
  uniformMealEnergy,
  cookingEnergyMultiplier = 1
} = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === TASTY_CHANCE_S.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态料理成功S技能手数据');
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(
      record,
      UNATTENDED_HOURS,
      TASTY_CHANCE_S.operationCeilingScore
    );
    const theoreticalTriggerIndexPerDay = (
      86400
      / helpIntervalAtLevel(record.helpFrequencyBaseSec)
      * unattended.effectiveSkillProbability
    );
    const commonScenario = {
      level: TASTY_CHANCE_S.maxLevel,
      profileId,
      uniformMealEnergy,
      cookingEnergyMultiplier
    };
    const frequentCollection = tastyChanceWeeklyScenario({
      ...commonScenario,
      triggerMeanPerMeal: theoreticalTriggerIndexPerDay / TASTY_CHANCE_S.mealsPerDay
    });
    const eightHourCollection = tastyChanceWeeklyScenario({
      ...commonScenario,
      triggerMeanPerMeal: (
        theoreticalTriggerIndexPerDay
        / TASTY_CHANCE_S.mealsPerDay
        * unattended.retentionRatio
      )
    });
    const operationScore = frequentCollection.incrementalWeeklyEnergy > 0
      ? Math.min(
          eightHourCollection.incrementalWeeklyEnergy
          / frequentCollection.incrementalWeeklyEnergy
          * TASTY_CHANCE_S.operationCeilingScore,
          TASTY_CHANCE_S.operationCeilingScore
        )
      : 0;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      skillNameZh: '料理成功S',
      scoringStatus: 'confirmed-model-provisional-base-crit',
      maxSkillLevel: TASTY_CHANCE_S.maxLevel,
      bonusPctPerTrigger: frequentCollection.bonusPctPerTrigger,
      maximumAccumulatedBonusPct: frequentCollection.maximumAccumulatedBonusPct,
      cookingProfileId: frequentCollection.profile.id,
      cookingProfileNameZh: frequentCollection.profile.nameZh,
      personalScenario: frequentCollection.profile.personalScenario,
      bonus148Meals: frequentCollection.profile.bonus148Meals,
      bonus178Meals: frequentCollection.profile.bonus178Meals,
      averageMealEnergy: round(frequentCollection.profile.averageMealEnergy, 1),
      cookingEnergyMultiplier: frequentCollection.profile.cookingEnergyMultiplier,
      noSkillExpectedWeeklyEnergy: round(frequentCollection.noSkillExpectedWeeklyEnergy),
      expectedWeeklyEnergy: round(frequentCollection.expectedWeeklyEnergy),
      incrementalWeeklyEnergy: round(frequentCollection.incrementalWeeklyEnergy),
      incrementalPct: round(frequentCollection.incrementalPct, 2),
      expectedAcceptedTriggersPerWeek: round(frequentCollection.expectedAcceptedTriggers, 2),
      blockedTriggerOpportunitiesPerWeek: round(frequentCollection.blockedTriggerOpportunities, 2),
      effectiveEnergyPerAcceptedTrigger: round(frequentCollection.effectiveEnergyPerAcceptedTrigger),
      singleUsePracticalValue: round(frequentCollection.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(theoreticalTriggerIndexPerDay, 3),
      theoreticalOutputIndex: round(frequentCollection.theoreticalOutputIndex, 1),
      stabilityScore: round(frequentCollection.stabilityScore, 1),
      operationCeilingScore: TASTY_CHANCE_S.operationCeilingScore,
      eightHourIncrementalWeeklyEnergy: round(eightHourCollection.incrementalWeeklyEnergy),
      eightHourIncrementalPct: round(eightHourCollection.incrementalPct, 2),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      operationScore: round(operationScore, 1),
      versatilityScore: TASTY_CHANCE_S.versatilityScore,
      naturalLevelContribution: record.evolution?.stage === 3
        ? 5
        : record.evolution?.stage === 2
          ? 2.5
          : 0
    };
  }).sort((left, right) => (
    right.incrementalWeeklyEnergy - left.incrementalWeeklyEnergy
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function cookingPowerMealProfile({
  profileId = 'mature-standard',
  basePotCapacity = COOKING_POWER_UP.basePotCapacity,
  ingredientAvailability = 1,
  fillerIngredientBaseEnergy = COOKING_POWER_UP.averageFillerIngredientBaseEnergy,
  cookingEnergyMultiplier = 1,
  goodCamp
} = {}) {
  const profile = COOKING_POWER_UP.profiles[profileId];
  if (!profile) throw new Error(`未知料理强化情景：${profileId}`);
  if (!(Number.isFinite(basePotCapacity) && basePotCapacity >= COOKING_POWER_UP.recipeGroups[148].averageIngredientCount)) {
    throw new Error(`料理强化模型的基础锅容量至少需要${COOKING_POWER_UP.recipeGroups[148].averageIngredientCount}：${basePotCapacity}`);
  }
  if (!(Number.isFinite(ingredientAvailability) && ingredientAvailability >= 0 && ingredientAvailability <= 1)) {
    throw new Error(`无效额外食材满足率：${ingredientAvailability}`);
  }
  if (!(Number.isFinite(fillerIngredientBaseEnergy) && fillerIngredientBaseEnergy >= 0)) {
    throw new Error(`无效填锅食材基础能量：${fillerIngredientBaseEnergy}`);
  }
  if (!(Number.isFinite(cookingEnergyMultiplier) && cookingEnergyMultiplier > 0)) {
    throw new Error(`无效料理能量倍率：${cookingEnergyMultiplier}`);
  }
  const mealCount = profile.bonus148Meals + profile.bonus178Meals;
  if (Math.abs(mealCount - COOKING_POWER_UP.mealsPerWeek) > 1e-9) {
    throw new Error(`${profileId}的每周餐数不是${COOKING_POWER_UP.mealsPerWeek}`);
  }
  const resolvedGoodCamp = goodCamp ?? profile.defaultGoodCamp ?? false;
  return {
    ...profile,
    recipeSnapshotDate: COOKING_POWER_UP.recipeSnapshotDate,
    recipeLevel: COOKING_POWER_UP.standardRecipeLevel,
    recipeLevelMultiplier: 1 + COOKING_POWER_UP.recipeLevelBonusPct / 100,
    basePotCapacity,
    ingredientAvailability,
    fillerIngredientBaseEnergy,
    cookingEnergyMultiplier,
    goodCamp: resolvedGoodCamp,
    capacityMultiplier: resolvedGoodCamp ? COOKING_POWER_UP.goodCampMultiplier : 1,
    highRecipeShare: profile.bonus178Meals / mealCount
  };
}

function cookingPowerRecipeEnergy(capacity, recipeGroup, profile) {
  const ingredientCount = recipeGroup.ingredientCount ?? recipeGroup.averageIngredientCount;
  const baseEnergy = recipeGroup.baseEnergy ?? recipeGroup.averageBaseEnergy;
  if (!(Number.isFinite(capacity) && capacity >= ingredientCount)) {
    throw new Error(`锅容量${capacity}不足以制作${recipeGroup.coefficient}系数食谱`);
  }
  const extraIngredientCount = Math.max(0, capacity - ingredientCount);
  return (
    baseEnergy * profile.recipeLevelMultiplier
    + extraIngredientCount
      * profile.ingredientAvailability
      * profile.fillerIngredientBaseEnergy
  ) * profile.cookingEnergyMultiplier;
}

function cookingPowerMealEnergy(capacity, plannedHighRecipe, profile) {
  const averageHighRecipe = COOKING_POWER_UP.recipeGroups[178];
  const averageLowRecipe = COOKING_POWER_UP.recipeGroups[148];
  const highRecipe = plannedHighRecipe && typeof plannedHighRecipe === 'object'
    ? {
        ...plannedHighRecipe,
        coefficient: averageHighRecipe.coefficient
      }
    : averageHighRecipe;
  const fallbackRecipe = plannedHighRecipe && typeof plannedHighRecipe === 'object'
    ? {
        coefficient: averageLowRecipe.coefficient,
        ingredientCount: plannedHighRecipe.fallbackIngredientCount,
        baseEnergy: plannedHighRecipe.fallbackBaseEnergy
      }
    : averageLowRecipe;
  const selectedRecipe = plannedHighRecipe
    && capacity >= (highRecipe.ingredientCount ?? highRecipe.averageIngredientCount)
    ? highRecipe
    : fallbackRecipe;
  return {
    selectedRecipeCoefficient: selectedRecipe.coefficient,
    energy: cookingPowerRecipeEnergy(capacity, selectedRecipe, profile)
  };
}

function cookingPowerMealExpectation({
  triggerMean,
  potSlotsPerTrigger,
  isSunday,
  plannedHighRecipe,
  profile
}) {
  if (!(Number.isFinite(triggerMean) && triggerMean >= 0)) {
    throw new Error(`无效料理强化每餐触发均值：${triggerMean}`);
  }
  if (!(Number.isFinite(potSlotsPerTrigger) && potSlotsPerTrigger > 0)) {
    throw new Error(`无效料理强化扩锅量：${potSlotsPerTrigger}`);
  }
  const maximumAcceptedTriggers = Math.ceil(
    COOKING_POWER_UP.maximumAccumulatedPotSlots / potSlotsPerTrigger
  );
  const countProbabilities = poissonCappedCounts(triggerMean, maximumAcceptedTriggers);
  const sundayMultiplier = isSunday ? 2 : 1;
  const baseCapacity = Math.floor(
    profile.basePotCapacity * sundayMultiplier * profile.capacityMultiplier
  );
  const noSkill = cookingPowerMealEnergy(baseCapacity, plannedHighRecipe, profile);
  const noSkillLow = cookingPowerMealEnergy(baseCapacity, false, profile);
  let expectedEnergy = 0;
  let fillerOnlyExpectedEnergy = 0;
  let expectedAcceptedTriggers = 0;
  let positiveIncrementProbability = 0;
  for (let count = 0; count < countProbabilities.length; count += 1) {
    const probability = countProbabilities[count];
    if (!(probability > 0)) continue;
    const rawAddedSlots = Math.min(
      COOKING_POWER_UP.maximumAccumulatedPotSlots,
      count * potSlotsPerTrigger
    );
    const effectiveAddedSlots = Math.floor(rawAddedSlots * profile.capacityMultiplier);
    const capacity = baseCapacity + effectiveAddedSlots;
    const outcome = cookingPowerMealEnergy(capacity, plannedHighRecipe, profile);
    const lowOutcome = cookingPowerMealEnergy(capacity, false, profile);
    expectedEnergy += probability * outcome.energy;
    fillerOnlyExpectedEnergy += probability * lowOutcome.energy;
    expectedAcceptedTriggers += probability * count;
    if (outcome.energy > noSkill.energy + 1e-9) positiveIncrementProbability += probability;
  }
  return {
    noSkillEnergy: noSkill.energy,
    expectedEnergy,
    incrementalEnergy: expectedEnergy - noSkill.energy,
    fillerOnlyIncrementalEnergy: fillerOnlyExpectedEnergy - noSkillLow.energy,
    breakpointIncrementalEnergy: Math.max(
      0,
      expectedEnergy - noSkill.energy - (fillerOnlyExpectedEnergy - noSkillLow.energy)
    ),
    expectedAcceptedTriggers,
    positiveIncrementProbability
  };
}

function cookingPowerWeeklyScenario({
  triggerMeanPerMeal,
  skillVariant = 'ordinary',
  level = COOKING_POWER_UP.maxLevel,
  potSlotsPerTrigger: potSlotsPerTriggerOverride,
  partnerPresent = true,
  profileId = 'mature-standard',
  basePotCapacity = COOKING_POWER_UP.basePotCapacity,
  ingredientAvailability = 1,
  fillerIngredientBaseEnergy = COOKING_POWER_UP.averageFillerIngredientBaseEnergy,
  cookingEnergyMultiplier = 1,
  goodCamp
} = {}) {
  if (!['ordinary', 'minus'].includes(skillVariant)) {
    throw new Error(`未知料理强化技能变体：${skillVariant}`);
  }
  const potSlotsByLevel = skillVariant === 'minus'
    ? COOKING_POWER_UP.minusPotSlotsByLevel
    : COOKING_POWER_UP.ordinaryPotSlotsByLevel;
  const potSlotsPerTrigger = potSlotsPerTriggerOverride ?? potSlotsByLevel[level];
  if (!(potSlotsPerTrigger > 0)) throw new Error(`无效料理强化技能等级：${level}`);
  const profile = cookingPowerMealProfile({
    profileId,
    basePotCapacity,
    ingredientAvailability,
    fillerIngredientBaseEnergy,
    cookingEnergyMultiplier,
    goodCamp
  });
  let noSkillExpectedWeeklyEnergy = 0;
  let expectedWeeklyEnergy = 0;
  let fillerOnlyIncrementalWeeklyEnergy = 0;
  let breakpointIncrementalWeeklyEnergy = 0;
  let expectedAcceptedTriggers = 0;
  let noPositiveIncrementProbability = 1;
  for (let mealIndex = 0; mealIndex < COOKING_POWER_UP.mealsPerWeek; mealIndex += 1) {
    const isSunday = mealIndex >= COOKING_POWER_UP.weekdayMeals;
    const baseCritProbability = isSunday
      ? COOKING_POWER_UP.sundayBaseCritProbability
      : COOKING_POWER_UP.weekdayBaseCritProbability;
    const critMultiplier = isSunday
      ? COOKING_POWER_UP.sundayCritMultiplier
      : COOKING_POWER_UP.weekdayCritMultiplier;
    const expectedCritMultiplier = 1 + baseCritProbability * (critMultiplier - 1);
    const low = cookingPowerMealExpectation({
      triggerMean: triggerMeanPerMeal,
      potSlotsPerTrigger,
      isSunday,
      plannedHighRecipe: false,
      profile
    });
    const highExpectations = COOKING_POWER_UP.recipeGroups[178].recipes.map(recipe => (
      cookingPowerMealExpectation({
        triggerMean: triggerMeanPerMeal,
        potSlotsPerTrigger,
        isSunday,
        plannedHighRecipe: recipe,
        profile
      })
    ));
    const highShare = profile.highRecipeShare;
    const highAverage = key => (
      highExpectations.reduce((sum, expectation) => sum + expectation[key], 0)
      / highExpectations.length
    );
    const weighted = key => low[key] * (1 - highShare) + highAverage(key) * highShare;
    noSkillExpectedWeeklyEnergy += weighted('noSkillEnergy') * expectedCritMultiplier;
    expectedWeeklyEnergy += weighted('expectedEnergy') * expectedCritMultiplier;
    fillerOnlyIncrementalWeeklyEnergy += (
      weighted('fillerOnlyIncrementalEnergy') * expectedCritMultiplier
    );
    breakpointIncrementalWeeklyEnergy += (
      weighted('breakpointIncrementalEnergy') * expectedCritMultiplier
    );
    expectedAcceptedTriggers += weighted('expectedAcceptedTriggers');
    const positiveProbability = weighted('positiveIncrementProbability');
    noPositiveIncrementProbability *= 1 - positiveProbability;
  }
  const incrementalWeeklyEnergy = nonNegativeWithFloatingTolerance(
    expectedWeeklyEnergy - noSkillExpectedWeeklyEnergy,
    '料理强化周增能'
  );
  fillerOnlyIncrementalWeeklyEnergy = nonNegativeWithFloatingTolerance(
    fillerOnlyIncrementalWeeklyEnergy,
    '料理强化纯填锅周增能'
  );
  breakpointIncrementalWeeklyEnergy = nonNegativeWithFloatingTolerance(
    breakpointIncrementalWeeklyEnergy,
    '料理强化跨档周增能'
  );
  const cookingOutputIndex = directEnergyPracticalValue(incrementalWeeklyEnergy / 7);
  const fillerOnlyCookingOutputIndex = directEnergyPracticalValue(
    fillerOnlyIncrementalWeeklyEnergy / 7
  );
  const recoveryPerTrigger = skillVariant === 'minus' && partnerPresent
    ? COOKING_POWER_UP.minusRecoveryByLevel[level]
    : 0;
  const recoveryPracticalValuePerTrigger = productiveHealingPracticalValue(
    recoveryPerTrigger,
    STANDARD_RANDOM_PRODUCTIVE_TARGET_SHARE
  );
  const recoveryOutputIndex = (
    expectedAcceptedTriggers / 7 * recoveryPracticalValuePerTrigger
  );
  const theoreticalOutputIndex = cookingOutputIndex + recoveryOutputIndex;
  const dailyAcceptedTriggers = expectedAcceptedTriggers / 7;
  const singleUsePracticalValue = dailyAcceptedTriggers > 0
    ? theoreticalOutputIndex / dailyAcceptedTriggers
    : 0;
  const stabilityScore = theoreticalOutputIndex > 0
    ? (
        cookingOutputIndex * 100
        + recoveryOutputIndex * STANDARD_RANDOM_PRODUCTIVE_TARGET_SHARE * 100
      ) / theoreticalOutputIndex
    : 0;
  return {
    skillVariant,
    partnerPresent,
    level,
    potSlotsPerTrigger,
    maximumAccumulatedPotSlots: COOKING_POWER_UP.maximumAccumulatedPotSlots,
    profile,
    noSkillExpectedWeeklyEnergy,
    expectedWeeklyEnergy,
    incrementalWeeklyEnergy,
    fillerOnlyIncrementalWeeklyEnergy,
    breakpointIncrementalWeeklyEnergy,
    incrementalPct: noSkillExpectedWeeklyEnergy > 0
      ? incrementalWeeklyEnergy / noSkillExpectedWeeklyEnergy * 100
      : 0,
    expectedGeneratedTriggers: triggerMeanPerMeal * COOKING_POWER_UP.mealsPerWeek,
    expectedAcceptedTriggers,
    blockedTriggerOpportunities: Math.max(
      0,
      triggerMeanPerMeal * COOKING_POWER_UP.mealsPerWeek - expectedAcceptedTriggers
    ),
    weeklyPayoutProbability: 1 - noPositiveIncrementProbability,
    recoveryPerTrigger,
    recoveryPracticalValuePerTrigger,
    cookingOutputIndex,
    fillerOnlyCookingOutputIndex,
    recoveryOutputIndex,
    singleUsePracticalValue,
    theoreticalOutputIndex,
    stabilityScore
  };
}

function cookingPowerRows(records, {
  profileId = 'mature-standard',
  basePotCapacity = COOKING_POWER_UP.basePotCapacity,
  ingredientAvailability = 1,
  fillerIngredientBaseEnergy = COOKING_POWER_UP.averageFillerIngredientBaseEnergy,
  cookingEnergyMultiplier = 1,
  goodCamp,
  minusPartnerPresent = true
} = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && [COOKING_POWER_UP.ordinaryMainSkillId, COOKING_POWER_UP.minusMainSkillId]
      .includes(Number(record.mainSkill?.id))
  ));
  if (!candidates.length) throw new Error('没有最终形态料理强化类技能手数据');
  return candidates.map(record => {
    const skillVariant = Number(record.mainSkill.id) === COOKING_POWER_UP.minusMainSkillId
      ? 'minus'
      : 'ordinary';
    const partnerPresent = skillVariant === 'minus' ? minusPartnerPresent : false;
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, 100);
    const theoreticalTriggerIndexPerDay = (
      86400
      / helpIntervalAtLevel(record.helpFrequencyBaseSec)
      * unattended.effectiveSkillProbability
    );
    const common = {
      skillVariant,
      partnerPresent,
      profileId,
      basePotCapacity,
      ingredientAvailability,
      fillerIngredientBaseEnergy,
      cookingEnergyMultiplier,
      goodCamp
    };
    const frequentCollection = cookingPowerWeeklyScenario({
      ...common,
      triggerMeanPerMeal: theoreticalTriggerIndexPerDay / COOKING_POWER_UP.mealsPerDay
    });
    const eightHourCollection = cookingPowerWeeklyScenario({
      ...common,
      triggerMeanPerMeal: (
        theoreticalTriggerIndexPerDay
        / COOKING_POWER_UP.mealsPerDay
        * unattended.retentionRatio
      )
    });
    const recoveryOperationCeiling = STANDARD_E4E.operationCeilingScore / 100;
    const operationalEightHourOutput = (
      eightHourCollection.cookingOutputIndex
      + eightHourCollection.recoveryOutputIndex * recoveryOperationCeiling
    );
    const operationScore = frequentCollection.theoreticalOutputIndex > 0
      ? Math.min(
          operationalEightHourOutput / frequentCollection.theoreticalOutputIndex * 100,
          100
        )
      : 0;
    const portableOutputIndex = (
      frequentCollection.fillerOnlyCookingOutputIndex
      + frequentCollection.recoveryOutputIndex
    );
    const breakpointIndependenceScore = frequentCollection.theoreticalOutputIndex > 0
      ? Math.min(portableOutputIndex / frequentCollection.theoreticalOutputIndex * 100, 100)
      : 0;
    const standalone = skillVariant === 'minus' && partnerPresent
      ? cookingPowerWeeklyScenario({
          ...common,
          partnerPresent: false,
          triggerMeanPerMeal: theoreticalTriggerIndexPerDay / COOKING_POWER_UP.mealsPerDay
        })
      : frequentCollection;
    const teamIndependenceScore = frequentCollection.theoreticalOutputIndex > 0
      ? Math.min(
          standalone.theoreticalOutputIndex / frequentCollection.theoreticalOutputIndex * 100,
          100
        )
      : 0;
    const versatilityDimensions = skillVariant === 'minus'
      ? [100, breakpointIndependenceScore, teamIndependenceScore]
      : [100, breakpointIndependenceScore];
    const versatilityScore = versatilityDimensions.reduce((sum, score) => sum + score, 0)
      / versatilityDimensions.length;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      skillNameZh: skillVariant === 'minus' ? '负电（料理强化S）' : '料理强化S',
      scoringStatus: 'confirmed-effects-model-provisional-recipe-profile-and-base-crit',
      maxSkillLevel: COOKING_POWER_UP.maxLevel,
      skillVariant,
      partnerPresent,
      potSlotsPerTrigger: frequentCollection.potSlotsPerTrigger,
      recoveryPerTrigger: frequentCollection.recoveryPerTrigger,
      cookingProfileId: frequentCollection.profile.id,
      cookingProfileNameZh: frequentCollection.profile.nameZh,
      personalScenario: frequentCollection.profile.personalScenario,
      basePotCapacity: frequentCollection.profile.basePotCapacity,
      effectiveBasePotCapacity: Math.floor(
        frequentCollection.profile.basePotCapacity
        * frequentCollection.profile.capacityMultiplier
      ),
      goodCamp: frequentCollection.profile.goodCamp,
      ingredientAvailability,
      fillerIngredientBaseEnergy: round(fillerIngredientBaseEnergy, 1),
      noSkillExpectedWeeklyEnergy: round(frequentCollection.noSkillExpectedWeeklyEnergy),
      expectedWeeklyEnergy: round(frequentCollection.expectedWeeklyEnergy),
      incrementalWeeklyEnergy: round(frequentCollection.incrementalWeeklyEnergy),
      fillerOnlyIncrementalWeeklyEnergy: round(
        frequentCollection.fillerOnlyIncrementalWeeklyEnergy
      ),
      breakpointIncrementalWeeklyEnergy: round(
        frequentCollection.breakpointIncrementalWeeklyEnergy
      ),
      incrementalPct: round(frequentCollection.incrementalPct, 2),
      expectedAcceptedTriggersPerWeek: round(frequentCollection.expectedAcceptedTriggers, 2),
      blockedTriggerOpportunitiesPerWeek: round(
        frequentCollection.blockedTriggerOpportunities,
        2
      ),
      weeklyPayoutProbabilityPct: round(frequentCollection.weeklyPayoutProbability * 100, 1),
      recoveryPracticalValuePerTrigger: round(
        frequentCollection.recoveryPracticalValuePerTrigger,
        1
      ),
      cookingOutputIndex: round(frequentCollection.cookingOutputIndex, 1),
      recoveryOutputIndex: round(frequentCollection.recoveryOutputIndex, 1),
      singleUsePracticalValue: round(frequentCollection.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(theoreticalTriggerIndexPerDay, 3),
      theoreticalOutputIndex: round(frequentCollection.theoreticalOutputIndex, 1),
      stabilityScore: round(frequentCollection.stabilityScore, 1),
      operationCeilingScore: 100,
      eightHourIncrementalWeeklyEnergy: round(eightHourCollection.incrementalWeeklyEnergy),
      eightHourRecoveryOutputIndex: round(eightHourCollection.recoveryOutputIndex, 1),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      operationScore: round(operationScore, 1),
      breakpointIndependenceScore: round(breakpointIndependenceScore, 1),
      teamIndependenceScore: round(teamIndependenceScore, 1),
      versatilityScore: round(versatilityScore, 1),
      standaloneTheoreticalOutputIndex: round(standalone.theoreticalOutputIndex, 1),
      naturalLevelContribution: record.evolution?.stage === 3
        ? 5
        : record.evolution?.stage === 2
          ? 2.5
          : 0
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function cookingAssistWeeklyScenario({
  triggerMeanPerMeal,
  level = COOKING_ASSIST_S.maxLevel,
  ingredientIds = Object.keys(INGREDIENT_STRENGTH).map(Number),
  profileId = 'mature-standard',
  uniformMealEnergy,
  cookingEnergyMultiplier = 1
} = {}) {
  const ingredientCount = COOKING_ASSIST_S.ingredientCountByLevel[level];
  const bonusPctPerTrigger = COOKING_ASSIST_S.tastyBonusPctByLevel[level];
  if (!(ingredientCount > 0 && bonusPctPerTrigger > 0)) {
    throw new Error(`无效料理辅助S等级：${level}`);
  }
  const tasty = tastyChanceWeeklyScenario({
    triggerMeanPerMeal,
    level,
    bonusPctPerTrigger,
    profileId,
    cookingEnergyMultiplier,
    ...(uniformMealEnergy === undefined ? {} : { uniformMealEnergy })
  });
  const ingredient = randomIngredientMagnetEffect({ ingredientCount, ingredientIds });
  const dailyAcceptedTriggers = tasty.expectedAcceptedTriggers / 7;
  const ingredientOutputIndex = dailyAcceptedTriggers * ingredient.singleUsePracticalValue;
  const cookingOutputIndex = tasty.theoreticalOutputIndex;
  const theoreticalOutputIndex = ingredientOutputIndex + cookingOutputIndex;
  const stabilityScore = theoreticalOutputIndex > 0
    ? (
        ingredientOutputIndex * ingredient.stabilityScore
        + cookingOutputIndex * tasty.stabilityScore
      ) / theoreticalOutputIndex
    : 0;
  return {
    level,
    ingredientCount,
    bonusPctPerTrigger,
    ingredientPool: ingredient.ingredientPool,
    expectedGeneratedTriggers: tasty.expectedGeneratedTriggers,
    expectedAcceptedTriggers: tasty.expectedAcceptedTriggers,
    blockedTriggerOpportunities: tasty.blockedTriggerOpportunities,
    expectedIngredientsPerWeek: tasty.expectedAcceptedTriggers * ingredientCount,
    expectedBaseIngredientEnergyPerAcceptedTrigger: ingredient.expectedBaseIngredientEnergy,
    ingredientPracticalValuePerAcceptedTrigger: ingredient.singleUsePracticalValue,
    incrementalWeeklyCookingEnergy: tasty.incrementalWeeklyEnergy,
    ingredientOutputIndex,
    cookingOutputIndex,
    theoreticalOutputIndex,
    singleUsePracticalValue: dailyAcceptedTriggers > 0
      ? theoreticalOutputIndex / dailyAcceptedTriggers
      : 0,
    stabilityScore,
    ingredientSupplyStabilityScore: ingredient.stabilityScore,
    cookingPayoutProbability: 1 - tasty.noBonusSuccessProbability,
    operationCeilingScore: COOKING_ASSIST_S.operationCeilingScore,
    versatilityScore: COOKING_ASSIST_S.versatilityScore,
    profile: tasty.profile
  };
}

function cookingAssistRows(records, {
  profileId = 'mature-standard',
  cookingEnergyMultiplier = 1,
  uniformMealEnergy,
  unlockedIngredientIds = Object.keys(INGREDIENT_STRENGTH).map(Number)
} = {}) {
  const candidates = records.filter(record => (
    record.isFinalEvolution
    && Number(record.mainSkill?.id) === COOKING_ASSIST_S.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态料理辅助S数据');
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, 100);
    const theoreticalTriggerIndexPerDay = (
      86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability
    );
    const common = {
      profileId,
      cookingEnergyMultiplier,
      ingredientIds: unlockedIngredientIds,
      ...(uniformMealEnergy === undefined ? {} : { uniformMealEnergy })
    };
    const frequent = cookingAssistWeeklyScenario({
      ...common,
      triggerMeanPerMeal: theoreticalTriggerIndexPerDay / TASTY_CHANCE_S.mealsPerDay
    });
    const eightHour = cookingAssistWeeklyScenario({
      ...common,
      triggerMeanPerMeal: (
        theoreticalTriggerIndexPerDay
        * unattended.retentionRatio
        / TASTY_CHANCE_S.mealsPerDay
      )
    });
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      skillNameZh: '健美（料理辅助S）',
      scoringStatus: 'confirmed-effects-provisional-equal-ingredient-pool-and-base-crit',
      maxSkillLevel: COOKING_ASSIST_S.maxLevel,
      ingredientCountPerAcceptedTrigger: frequent.ingredientCount,
      tastyBonusPctPerAcceptedTrigger: frequent.bonusPctPerTrigger,
      ingredientPool: frequent.ingredientPool,
      theoreticalTriggerIndexPerDay: round(theoreticalTriggerIndexPerDay, 3),
      expectedAcceptedTriggersPerWeek: round(frequent.expectedAcceptedTriggers, 2),
      blockedTriggerOpportunitiesPerWeek: round(frequent.blockedTriggerOpportunities, 2),
      expectedIngredientsPerWeek: round(frequent.expectedIngredientsPerWeek, 1),
      incrementalWeeklyCookingEnergy: round(frequent.incrementalWeeklyCookingEnergy),
      ingredientOutputIndex: round(frequent.ingredientOutputIndex, 1),
      cookingOutputIndex: round(frequent.cookingOutputIndex, 1),
      singleUsePracticalValue: round(frequent.singleUsePracticalValue, 1),
      theoreticalOutputIndex: round(frequent.theoreticalOutputIndex, 1),
      stabilityScore: round(frequent.stabilityScore, 1),
      ingredientSupplyStabilityScore: round(frequent.ingredientSupplyStabilityScore, 1),
      weeklyCookingPayoutProbabilityPct: round(frequent.cookingPayoutProbability * 100, 1),
      operationCeilingScore: frequent.operationCeilingScore,
      eightHourTheoreticalOutputIndex: round(eightHour.theoreticalOutputIndex, 1),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      operationScore: frequent.theoreticalOutputIndex > 0
        ? round(Math.min(eightHour.theoreticalOutputIndex / frequent.theoreticalOutputIndex * 100, 100), 1)
        : 0,
      versatilityScore: frequent.versatilityScore,
      cookingProfileId: frequent.profile.id,
      cookingProfileNameZh: frequent.profile.nameZh,
      naturalLevelContribution: record.evolution?.stage === 3
        ? 5
        : record.evolution?.stage === 2
          ? 2.5
          : 0
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function metronomeScenario(records, userRecord, {
  level = METRONOME.maxLevel,
  theoreticalTriggerIndexPerDay,
  eightHourRetention = 1,
  favoriteShare = BERRY_BURST.standardFavoriteShare,
  profileId = 'mature-standard',
  cookingEnergyMultiplier = 1,
  uniformMealEnergy,
  basePotCapacity = COOKING_POWER_UP.basePotCapacity,
  ingredientAvailability = 1,
  fillerIngredientBaseEnergy = COOKING_POWER_UP.averageFillerIngredientBaseEnergy,
  goodCamp,
  unlockedIngredientIds = Object.keys(INGREDIENT_STRENGTH).map(Number),
  dreamShardDemandCoefficient = DREAM_SHARD_SKILL.neutralDemandCoefficient,
  candyUnitPracticalValue,
  presentCandyProbability = PRESENT_INGREDIENT_MAGNET_S.candyProbability
} = {}) {
  if (!(Number.isFinite(theoreticalTriggerIndexPerDay) && theoreticalTriggerIndexPerDay >= 0)) {
    throw new Error(`无效挥指理论触发：${theoreticalTriggerIndexPerDay}`);
  }
  if (!(eightHourRetention >= 0 && eightHourRetention <= 1)) {
    throw new Error(`无效挥指8小时留存：${eightHourRetention}`);
  }
  const activeLevel = Math.min(level, METRONOME.maxLevel);
  const outcomeProbability = 1 / METRONOME.outcomeIds.length;
  const outcomeTriggerIndexPerDay = theoreticalTriggerIndexPerDay * outcomeProbability;
  const eightHourOutcomeTriggerIndexPerDay = outcomeTriggerIndexPerDay * eightHourRetention;
  const ordinary = [];
  const nonlinear = [];
  const addOrdinary = (id, nameZh, effect, details = {}) => ordinary.push({
    id,
    nameZh,
    singleUsePracticalValue: effect.singleUsePracticalValue,
    stabilityScore: effect.stabilityScore,
    operationCeilingScore: effect.operationCeilingScore,
    versatilityScore: effect.versatilityScore,
    ...details
  });
  const addNonlinear = (id, nameZh, frequent, eightHour, versatilityScore = 100, details = {}) => {
    const effectiveSingleUsePracticalValue = outcomeTriggerIndexPerDay > 0
      ? frequent.theoreticalOutputIndex / outcomeTriggerIndexPerDay
      : 0;
    nonlinear.push({
      id,
      nameZh,
      singleUsePracticalValue: effectiveSingleUsePracticalValue,
      dailyOutputIndex: frequent.theoreticalOutputIndex,
      eightHourOperationalOutputIndex: eightHour.theoreticalOutputIndex,
      stabilityScore: frequent.stabilityScore,
      operationCeilingScore: 100,
      versatilityScore,
      ...details
    });
  };

  addOrdinary('energy-s-fixed', '能量填充S', energyChargeSFixedEffect(activeLevel));
  addOrdinary('energy-s-random', '能量填充S（随机）', energyChargeSRandomEffect(activeLevel));
  const energyM = energyChargeMEffect(activeLevel);
  addOrdinary('energy-m', '能量填充M', {
    singleUsePracticalValue: directEnergyPracticalValue(energyM.baseEnergy),
    stabilityScore: ENERGY_CHARGE_M.stabilityScore,
    operationCeilingScore: ENERGY_CHARGE_M.operationCeilingScore,
    versatilityScore: ENERGY_CHARGE_M.versatilityScore
  });
  addOrdinary(
    'dream-shard-fixed',
    '梦之碎片获取S',
    dreamShardFixedEffect(activeLevel, dreamShardDemandCoefficient)
  );
  addOrdinary(
    'dream-shard-random',
    '梦之碎片获取S（随机）',
    dreamShardRandomEffect(activeLevel, dreamShardDemandCoefficient)
  );
  addOrdinary('energizing-cheer', '活力疗愈S', energizingCheerEffect(activeLevel));
  addOrdinary('charge-energy', '活力填充S', chargeEnergySEffect(activeLevel));
  addOrdinary('e4e', '活力全体疗愈S', {
    singleUsePracticalValue: STANDARD_E4E.singleUsePracticalValue,
    stabilityScore: STANDARD_E4E.stabilityScore,
    operationCeilingScore: STANDARD_E4E.operationCeilingScore,
    versatilityScore: STANDARD_E4E.versatilityScore
  });
  const supportTeam = standardHelpingSupportTeam(records, userRecord, { favoriteShare });
  addOrdinary('helping-support', '帮手支援S', helpingSupportEffect({
    level: activeLevel,
    targetEnergyPerHelp: supportTeam.targets.map(target => target.energyPerHelp),
    referenceEnergyPerHelp: supportTeam.referenceEnergyPerHelp
  }));
  addOrdinary('ingredient-magnet', '食材获取S', randomIngredientMagnetEffect({
    ingredientCount: INGREDIENT_MAGNET_S.countByLevel[activeLevel],
    ingredientIds: unlockedIngredientIds
  }));

  const cookingCommon = {
    profileId,
    basePotCapacity,
    ingredientAvailability,
    fillerIngredientBaseEnergy,
    cookingEnergyMultiplier,
    goodCamp,
    level: activeLevel
  };
  const ordinaryCooking = cookingPowerWeeklyScenario({
    ...cookingCommon,
    triggerMeanPerMeal: outcomeTriggerIndexPerDay / COOKING_POWER_UP.mealsPerDay
  });
  const ordinaryCooking8h = cookingPowerWeeklyScenario({
    ...cookingCommon,
    triggerMeanPerMeal: eightHourOutcomeTriggerIndexPerDay / COOKING_POWER_UP.mealsPerDay
  });
  const cookingPortability = ordinaryCooking.theoreticalOutputIndex > 0
    ? Math.min(ordinaryCooking.fillerOnlyCookingOutputIndex / ordinaryCooking.theoreticalOutputIndex * 100, 100)
    : 0;
  addNonlinear(
    'cooking-power',
    '料理强化S',
    ordinaryCooking,
    ordinaryCooking8h,
    (100 + cookingPortability) / 2
  );
  const tastyCommon = {
    level: activeLevel,
    profileId,
    cookingEnergyMultiplier,
    ...(uniformMealEnergy === undefined ? {} : { uniformMealEnergy })
  };
  const tasty = tastyChanceWeeklyScenario({
    ...tastyCommon,
    triggerMeanPerMeal: outcomeTriggerIndexPerDay / TASTY_CHANCE_S.mealsPerDay
  });
  const tasty8h = tastyChanceWeeklyScenario({
    ...tastyCommon,
    triggerMeanPerMeal: eightHourOutcomeTriggerIndexPerDay / TASTY_CHANCE_S.mealsPerDay
  });
  addNonlinear('tasty-chance', '料理大成功S', tasty, tasty8h, TASTY_CHANCE_S.versatilityScore);

  const boostTeam = standardHelperBoostTeam(records, userRecord, { favoriteShare });
  addOrdinary('helper-boost', '帮手加速', helperBoostEffect({
    level: activeLevel,
    distinctSpecies: boostTeam.distinctSpecies,
    targetEnergyPerHelp: boostTeam.targets.map(target => target.energyPerHelp)
  }));
  const stockpileZeroEnergy = STOCKPILE.energyByLevelAndStockpiles[activeLevel][0];
  addOrdinary('stockpile-zero', '蓄力（0层直接吐出）', {
    singleUsePracticalValue: directEnergyPracticalValue(stockpileZeroEnergy),
    stabilityScore: 100,
    operationCeilingScore: STOCKPILE.operationCeilingScore,
    versatilityScore: STOCKPILE.versatilityScore
  });
  addOrdinary('moonlight', '月光', moonlightEffect(activeLevel));
  const berryTeam = standardBerrySkillTeam(records, userRecord, { favoriteShare });
  addOrdinary('berry-burst', '树果骤增', berryBurstEffect({
    selfBerryCount: BERRY_BURST.selfBerryByLevel[activeLevel],
    teammateBerryCount: BERRY_BURST.teammateBerryByLevel[activeLevel],
    userBerryEnergy: berryTeam.targets[0].berryEnergy,
    teammateBerryEnergies: berryTeam.targets.slice(1).map(target => target.berryEnergy),
    referenceTeammateBerryEnergy: berryTeam.referenceTeammateBerryEnergy
  }));
  addOrdinary('super-luck', '超幸运', superLuckIngredientDrawEffect({
    level: activeLevel,
    dreamShardDemandCoefficient
  }));
  addOrdinary('hyper-cutter', '怪力钳', hyperCutterIngredientDrawEffect({ level: activeLevel }));
  addOrdinary('plus-standalone', '正电（无搭档）', randomIngredientMagnetEffect({
    ingredientCount: PLUS_INGREDIENT_MAGNET_S.randomCountByLevel[activeLevel],
    ingredientIds: unlockedIngredientIds
  }));
  const minusCooking = cookingPowerWeeklyScenario({
    ...cookingCommon,
    skillVariant: 'minus',
    partnerPresent: false,
    triggerMeanPerMeal: outcomeTriggerIndexPerDay / COOKING_POWER_UP.mealsPerDay
  });
  const minusCooking8h = cookingPowerWeeklyScenario({
    ...cookingCommon,
    skillVariant: 'minus',
    partnerPresent: false,
    triggerMeanPerMeal: eightHourOutcomeTriggerIndexPerDay / COOKING_POWER_UP.mealsPerDay
  });
  const minusPortability = minusCooking.theoreticalOutputIndex > 0
    ? Math.min(minusCooking.fillerOnlyCookingOutputIndex / minusCooking.theoreticalOutputIndex * 100, 100)
    : 0;
  addNonlinear(
    'minus-standalone',
    '负电（无搭档）',
    minusCooking,
    minusCooking8h,
    (100 + minusPortability) / 2
  );
  const present = presentIngredientMagnetEffect({
    level: activeLevel,
    ingredientIds: unlockedIngredientIds,
    candyProbability: presentCandyProbability,
    candyUnitPracticalValue
  });
  addOrdinary('present', '礼物', present, {
    excludedResourceComponents: present.candyPracticalValue == null ? ['teammate-candy'] : []
  });
  addOrdinary('nuzzle', '蹭蹭脸颊', nuzzleScenario({ level: activeLevel }));
  addOrdinary('berry-juice', '树果汁', berryJuiceAnchor());
  const assistCommon = {
    level: activeLevel,
    ingredientIds: unlockedIngredientIds,
    profileId,
    cookingEnergyMultiplier,
    ...(uniformMealEnergy === undefined ? {} : { uniformMealEnergy })
  };
  const assist = cookingAssistWeeklyScenario({
    ...assistCommon,
    triggerMeanPerMeal: outcomeTriggerIndexPerDay / TASTY_CHANCE_S.mealsPerDay
  });
  const assist8h = cookingAssistWeeklyScenario({
    ...assistCommon,
    triggerMeanPerMeal: eightHourOutcomeTriggerIndexPerDay / TASTY_CHANCE_S.mealsPerDay
  });
  addNonlinear('cooking-assist', '料理辅助S', assist, assist8h, COOKING_ASSIST_S.versatilityScore);
  addOrdinary('aura-sphere', '波导弹', auraSphereEffect({
    level: activeLevel,
    demandCoefficient: dreamShardDemandCoefficient
  }));

  const outcomes = [
    ...ordinary.map(outcome => ({
      ...outcome,
      probability: outcomeProbability,
      dailyOutputIndex: outcomeTriggerIndexPerDay * outcome.singleUsePracticalValue,
      eightHourOperationalOutputIndex: (
        eightHourOutcomeTriggerIndexPerDay
        * outcome.singleUsePracticalValue
        * outcome.operationCeilingScore / 100
      )
    })),
    ...nonlinear.map(outcome => ({ ...outcome, probability: outcomeProbability }))
  ];
  const missingOutcomes = METRONOME.outcomeIds.filter(
    id => !outcomes.some(outcome => outcome.id === id)
  );
  if (missingOutcomes.length || outcomes.length !== METRONOME.outcomeIds.length) {
    throw new Error(`挥指结果池不完整：${missingOutcomes.join(',') || outcomes.length}`);
  }
  const theoreticalOutputIndex = outcomes.reduce((sum, outcome) => sum + outcome.dailyOutputIndex, 0);
  const operationalEightHourOutputIndex = outcomes.reduce(
    (sum, outcome) => sum + outcome.eightHourOperationalOutputIndex,
    0
  );
  const singleUsePracticalValue = theoreticalTriggerIndexPerDay > 0
    ? theoreticalOutputIndex / theoreticalTriggerIndexPerDay
    : 0;
  const minimumOutcomePracticalValue = Math.min(
    ...outcomes.map(outcome => outcome.singleUsePracticalValue)
  );
  const stabilityScore = singleUsePracticalValue > 0
    ? minimumOutcomePracticalValue / singleUsePracticalValue * 100
    : 0;
  const weightedVersatility = theoreticalOutputIndex > 0
    ? outcomes.reduce(
        (sum, outcome) => sum + outcome.dailyOutputIndex * outcome.versatilityScore,
        0
      ) / theoreticalOutputIndex
    : 0;
  return {
    level: activeLevel,
    outcomeCount: outcomes.length,
    outcomeProbability,
    outcomeProbabilityStatus: METRONOME.outcomeProbabilityStatus,
    theoreticalTriggerIndexPerDay,
    singleUsePracticalValue,
    minimumOutcomePracticalValue,
    theoreticalOutputIndex,
    operationalEightHourOutputIndex,
    stabilityScore,
    operationScore: theoreticalOutputIndex > 0
      ? Math.min(operationalEightHourOutputIndex / theoreticalOutputIndex * 100, 100)
      : 0,
    versatilityScore: weightedVersatility,
    outcomes
  };
}

function metronomeRows(records, options = {}) {
  const candidates = records.filter(record => (
    record.isFinalEvolution
    && Number(record.mainSkill?.id) === METRONOME.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态挥指数据');
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, 100);
    const theoreticalTriggerIndexPerDay = (
      86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability
    );
    const scenario = metronomeScenario(records, record, {
      ...options,
      theoreticalTriggerIndexPerDay,
      eightHourRetention: unattended.retentionRatio
    });
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      specialty: record.specialty,
      skillNameZh: '挥指',
      scoringStatus: scenario.outcomeProbabilityStatus,
      maxSkillLevel: METRONOME.maxLevel,
      outcomeCount: scenario.outcomeCount,
      outcomeProbabilityPct: round(scenario.outcomeProbability * 100, 2),
      theoreticalTriggerIndexPerDay: round(theoreticalTriggerIndexPerDay, 3),
      singleUsePracticalValue: round(scenario.singleUsePracticalValue, 1),
      minimumOutcomePracticalValue: round(scenario.minimumOutcomePracticalValue, 1),
      theoreticalOutputIndex: round(scenario.theoreticalOutputIndex, 1),
      stabilityScore: round(scenario.stabilityScore, 1),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      operationScore: round(scenario.operationScore, 1),
      versatilityScore: round(scenario.versatilityScore, 1),
      excludedResourceComponents: scenario.outcomes
        .flatMap(outcome => outcome.excludedResourceComponents || []),
      outcomes: scenario.outcomes.map(outcome => ({
        id: outcome.id,
        nameZh: outcome.nameZh,
        probabilityPct: round(outcome.probability * 100, 2),
        effectiveSingleUsePracticalValue: round(outcome.singleUsePracticalValue, 1),
        dailyOutputIndex: round(outcome.dailyOutputIndex, 2),
        stabilityScore: round(outcome.stabilityScore, 1),
        operationCeilingScore: round(outcome.operationCeilingScore, 1),
        versatilityScore: round(outcome.versatilityScore, 1)
      })),
      naturalLevelContribution: record.evolution?.stage === 3
        ? 5
        : record.evolution?.stage === 2
          ? 2.5
          : 0
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function skillCopyScenario({
  level = SKILL_COPY.maxLevel,
  targetNamesZh = SKILL_COPY.defaultTargetNamesZh,
  targetValues = SKILL_COPY.defaultTargetValues,
  targetCopyable,
  targetModes,
  targetOperationCeilings = [STANDARD_E4E.operationCeilingScore, 100, 100, 100]
} = {}) {
  const normalizedNames = [...targetNamesZh];
  const normalizedValues = targetValues.map(Number);
  const normalizedModes = targetModes === undefined
    ? (targetCopyable ?? Array(SKILL_COPY.targetCount).fill(true))
        .map(value => (Boolean(value) ? 'copyable' : 'fallback'))
    : targetModes.map(value => String(value).trim().toLowerCase());
  const normalizedOperationCeilings = targetOperationCeilings.map(Number);
  for (const [label, values] of [
    ['名称', normalizedNames],
    ['价值', normalizedValues],
    ['复制模式', normalizedModes],
    ['操作上限', normalizedOperationCeilings]
  ]) {
    if (values.length !== SKILL_COPY.targetCount) {
      throw new Error(`技能复制需要${SKILL_COPY.targetCount}个目标${label}`);
    }
  }
  if (!normalizedValues.every(value => Number.isFinite(value) && value >= 0)) {
    throw new Error(`无效技能复制目标价值：${targetValues}`);
  }
  if (!normalizedOperationCeilings.every(value => value >= 0 && value <= 100)) {
    throw new Error(`无效技能复制操作上限：${targetOperationCeilings}`);
  }
  if (!normalizedModes.every(mode => ['copyable', 'fallback', 'excluded'].includes(mode))) {
    throw new Error(`技能复制模式只能是copyable、fallback或excluded：${targetModes}`);
  }
  const fallback = energyChargeSFixedEffect(Math.min(level, ENERGY_CHARGE_S_FIXED.maxLevel));
  const targets = normalizedValues.map((value, index) => {
    const mode = normalizedModes[index];
    return {
      nameZh: String(normalizedNames[index]),
      configuredPracticalValue: value,
      mode,
      copyable: mode === 'copyable',
      selectable: mode !== 'excluded',
      effectivePracticalValue: mode === 'copyable'
        ? value
        : mode === 'fallback'
          ? fallback.singleUsePracticalValue
          : null,
      operationCeilingScore: mode === 'copyable'
        ? normalizedOperationCeilings[index]
        : mode === 'fallback'
          ? fallback.operationCeilingScore
          : null
    };
  });
  let selectableTargets = targets.filter(target => target.selectable);
  const allTargetsExcluded = selectableTargets.length === 0;
  if (allTargetsExcluded) {
    selectableTargets = [{
      nameZh: '没有可选复制目标时的回退',
      mode: 'fallback',
      copyable: false,
      selectable: true,
      configuredPracticalValue: 0,
      effectivePracticalValue: fallback.singleUsePracticalValue,
      operationCeilingScore: fallback.operationCeilingScore
    }];
    targets.push(selectableTargets[0]);
  }
  const targetProbability = 1 / selectableTargets.length;
  for (const target of targets) {
    target.selectionProbability = target.selectable ? targetProbability : 0;
  }
  const singleUsePracticalValue = selectableTargets.reduce(
    (sum, target) => sum + target.effectivePracticalValue,
    0
  ) / selectableTargets.length;
  const minimumOutcomePracticalValue = Math.min(
    ...selectableTargets.map(target => target.effectivePracticalValue)
  );
  const operationCeilingScore = singleUsePracticalValue > 0
    ? selectableTargets.reduce(
        (sum, target) => sum + target.effectivePracticalValue * target.operationCeilingScore,
        0
      ) / selectableTargets.length / singleUsePracticalValue
    : 0;
  return {
    level,
    configuredTargetCount: targets.length,
    selectableTargetCount: selectableTargets.length,
    allTargetsExcluded,
    targetProbability,
    targets,
    fallbackPracticalValue: fallback.singleUsePracticalValue,
    singleUsePracticalValue,
    minimumOutcomePracticalValue,
    stabilityScore: singleUsePracticalValue > 0
      ? minimumOutcomePracticalValue / singleUsePracticalValue * 100
      : 0,
    operationCeilingScore,
    versatilityScore: singleUsePracticalValue > 0
      ? Math.min(fallback.singleUsePracticalValue / singleUsePracticalValue * 100, 100)
      : 0,
    scoringStatus: 'confirmed-uniform-eligible-teammate-selection-dynamic-target-values'
  };
}

function skillCopyRows(records, options = {}) {
  const candidates = records.filter(record => (
    record.isFinalEvolution
    && SKILL_COPY.mainSkillIds.includes(Number(record.mainSkill?.id))
  ));
  if (!candidates.length) throw new Error('没有最终形态技能复制数据');
  const effect = skillCopyScenario(options);
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(
      record,
      UNATTENDED_HOURS,
      effect.operationCeilingScore
    );
    const theoreticalTriggerIndexPerDay = (
      86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability
    );
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      specialty: record.specialty,
      skillNameZh: Number(record.mainSkill.id) === 19 ? '变身（技能复制）' : '模仿（技能复制）',
      scoringStatus: effect.scoringStatus,
      maxSkillLevel: SKILL_COPY.maxLevel,
      targetProbabilityPct: round(effect.targetProbability * 100, 1),
      targets: effect.targets.map(target => ({
        ...target,
        configuredPracticalValue: round(target.configuredPracticalValue, 1),
        effectivePracticalValue: target.effectivePracticalValue == null
          ? null
          : round(target.effectivePracticalValue, 1),
        operationCeilingScore: target.operationCeilingScore == null
          ? null
          : round(target.operationCeilingScore, 1),
        selectionProbabilityPct: round(target.selectionProbability * 100, 1)
      })),
      fallbackPracticalValue: round(effect.fallbackPracticalValue, 1),
      singleUsePracticalValue: round(effect.singleUsePracticalValue, 1),
      minimumOutcomePracticalValue: round(effect.minimumOutcomePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(theoreticalTriggerIndexPerDay, 3),
      theoreticalOutputIndex: round(theoreticalTriggerIndexPerDay * effect.singleUsePracticalValue, 1),
      stabilityScore: round(effect.stabilityScore, 1),
      operationCeilingScore: round(effect.operationCeilingScore, 1),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      operationScore: round(unattended.operationScore, 1),
      versatilityScore: round(effect.versatilityScore, 1),
      naturalLevelContribution: record.evolution?.stage === 3
        ? 5
        : record.evolution?.stage === 2
          ? 2.5
          : 0
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function allMightyRows(records, {
  selectedSkillId,
  level = ALL_MIGHTY.maxLevel,
  selectedSkillRatePct,
  bonusCandyProbability = ALL_MIGHTY.bonusCandyProbability,
  candyUnitPracticalValue,
  favoriteShare = BERRY_BURST.standardFavoriteShare,
  profileId = 'mature-standard',
  cookingEnergyMultiplier = 1,
  uniformMealEnergy,
  basePotCapacity = COOKING_POWER_UP.basePotCapacity,
  ingredientAvailability = 1,
  fillerIngredientBaseEnergy = COOKING_POWER_UP.averageFillerIngredientBaseEnergy,
  goodCamp,
  unlockedIngredientIds = Object.keys(INGREDIENT_STRENGTH).map(Number),
  dreamShardDemandCoefficient = DREAM_SHARD_SKILL.neutralDemandCoefficient
} = {}) {
  const candidates = records.filter(record => (
    record.isFinalEvolution
    && Number(record.mainSkill?.id) === ALL_MIGHTY.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态十项全能数据');
  if (selectedSkillId !== undefined && !ALL_MIGHTY.selectableSkillIds.includes(selectedSkillId)) {
    throw new Error(`十项全能不可选择：${selectedSkillId}`);
  }
  if (bonusCandyProbability != null && !(bonusCandyProbability >= 0 && bonusCandyProbability <= 1)) {
    throw new Error(`无效十项全能额外糖果概率：${bonusCandyProbability}`);
  }
  if (candyUnitPracticalValue != null && !(candyUnitPracticalValue >= 0)) {
    throw new Error(`无效糖果单位价值：${candyUnitPracticalValue}`);
  }
  const selectedSkills = selectedSkillId === undefined
    ? ALL_MIGHTY.selectableSkillIds
    : [selectedSkillId];
  const skillNameById = Object.freeze({
    metronome: '挥指',
    'energy-s-fixed': '能量填充S',
    'energy-m': '能量填充M',
    'dream-shard-fixed': '梦之碎片获取S',
    'ingredient-magnet': '食材获取S',
    'energizing-cheer': '活力疗愈S',
    'charge-energy': '活力填充S',
    e4e: '活力全体疗愈S',
    'tasty-chance': '料理大成功S',
    'cooking-power': '料理强化S',
    'helping-support': '帮手支援S',
    'berry-burst': '树果骤增'
  });
  return candidates.flatMap(record => selectedSkills.map(skillId => {
    const ratePct = selectedSkillRatePct === undefined
      ? Number(record.skillRatePct)
      : Number(selectedSkillRatePct);
    if (!(ratePct > 0 && ratePct <= 100)) throw new Error(`无效十项全能技能率：${ratePct}`);
    const recordForRate = { ...record, skillRatePct: ratePct };
    const unattended = unattendedSkillStorageMetrics(recordForRate, UNATTENDED_HOURS, 100);
    const theoreticalTriggerIndexPerDay = (
      86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability
    );
    const capped = maximum => Math.min(level, maximum);
    let effectOutputIndex;
    let eightHourOperationalOutputIndex;
    let singleUsePracticalValue;
    let stabilityScore;
    let operationCeilingScore;
    let versatilityScore;
    let effectDetails = {};
    if (skillId === 'metronome') {
      const metronome = metronomeScenario(records, record, {
        level: capped(METRONOME.maxLevel),
        theoreticalTriggerIndexPerDay,
        eightHourRetention: unattended.retentionRatio,
        favoriteShare,
        profileId,
        cookingEnergyMultiplier,
        uniformMealEnergy,
        basePotCapacity,
        ingredientAvailability,
        fillerIngredientBaseEnergy,
        goodCamp,
        unlockedIngredientIds,
        dreamShardDemandCoefficient,
        candyUnitPracticalValue
      });
      effectOutputIndex = metronome.theoreticalOutputIndex;
      eightHourOperationalOutputIndex = metronome.operationalEightHourOutputIndex;
      singleUsePracticalValue = metronome.singleUsePracticalValue;
      stabilityScore = metronome.stabilityScore;
      operationCeilingScore = 100;
      versatilityScore = metronome.versatilityScore;
      effectDetails = { metronomeOutcomeCount: metronome.outcomeCount };
    } else if (skillId === 'tasty-chance') {
      const common = {
        level: capped(TASTY_CHANCE_S.maxLevel),
        profileId,
        cookingEnergyMultiplier,
        ...(uniformMealEnergy === undefined ? {} : { uniformMealEnergy })
      };
      const frequent = tastyChanceWeeklyScenario({
        ...common,
        triggerMeanPerMeal: theoreticalTriggerIndexPerDay / TASTY_CHANCE_S.mealsPerDay
      });
      const eightHour = tastyChanceWeeklyScenario({
        ...common,
        triggerMeanPerMeal: (
          theoreticalTriggerIndexPerDay * unattended.retentionRatio / TASTY_CHANCE_S.mealsPerDay
        )
      });
      effectOutputIndex = frequent.theoreticalOutputIndex;
      eightHourOperationalOutputIndex = eightHour.theoreticalOutputIndex;
      singleUsePracticalValue = theoreticalTriggerIndexPerDay > 0
        ? effectOutputIndex / theoreticalTriggerIndexPerDay
        : 0;
      stabilityScore = frequent.stabilityScore;
      operationCeilingScore = 100;
      versatilityScore = TASTY_CHANCE_S.versatilityScore;
      effectDetails = { incrementalWeeklyEnergy: round(frequent.incrementalWeeklyEnergy) };
    } else if (skillId === 'cooking-power') {
      const common = {
        level: capped(COOKING_POWER_UP.maxLevel),
        profileId,
        basePotCapacity,
        ingredientAvailability,
        fillerIngredientBaseEnergy,
        cookingEnergyMultiplier,
        goodCamp
      };
      const frequent = cookingPowerWeeklyScenario({
        ...common,
        triggerMeanPerMeal: theoreticalTriggerIndexPerDay / COOKING_POWER_UP.mealsPerDay
      });
      const eightHour = cookingPowerWeeklyScenario({
        ...common,
        triggerMeanPerMeal: (
          theoreticalTriggerIndexPerDay * unattended.retentionRatio / COOKING_POWER_UP.mealsPerDay
        )
      });
      effectOutputIndex = frequent.theoreticalOutputIndex;
      eightHourOperationalOutputIndex = eightHour.theoreticalOutputIndex;
      singleUsePracticalValue = frequent.singleUsePracticalValue;
      stabilityScore = frequent.stabilityScore;
      operationCeilingScore = 100;
      const portability = effectOutputIndex > 0
        ? Math.min(frequent.fillerOnlyCookingOutputIndex / effectOutputIndex * 100, 100)
        : 0;
      versatilityScore = (100 + portability) / 2;
      effectDetails = { incrementalWeeklyEnergy: round(frequent.incrementalWeeklyEnergy) };
    } else {
      let effect;
      if (skillId === 'energy-s-fixed') {
        effect = energyChargeSFixedEffect(capped(ENERGY_CHARGE_S_FIXED.maxLevel));
      } else if (skillId === 'energy-m') {
        const energy = energyChargeMEffect(capped(ENERGY_CHARGE_M.maxLevel));
        effect = {
          singleUsePracticalValue: directEnergyPracticalValue(energy.baseEnergy),
          stabilityScore: ENERGY_CHARGE_M.stabilityScore,
          operationCeilingScore: ENERGY_CHARGE_M.operationCeilingScore,
          versatilityScore: ENERGY_CHARGE_M.versatilityScore
        };
      } else if (skillId === 'dream-shard-fixed') {
        effect = dreamShardFixedEffect(
          capped(DREAM_SHARD_SKILL.maxLevel),
          dreamShardDemandCoefficient
        );
      } else if (skillId === 'ingredient-magnet') {
        effect = randomIngredientMagnetEffect({
          ingredientCount: INGREDIENT_MAGNET_S.countByLevel[capped(INGREDIENT_SKILL_COMMON.maxLevel)],
          ingredientIds: unlockedIngredientIds
        });
      } else if (skillId === 'energizing-cheer') {
        effect = energizingCheerEffect(capped(ENERGIZING_CHEER.maxLevel));
      } else if (skillId === 'charge-energy') {
        effect = chargeEnergySEffect(capped(CHARGE_ENERGY_S.maxLevel));
      } else if (skillId === 'e4e') {
        effect = {
          singleUsePracticalValue: STANDARD_E4E.singleUsePracticalValue,
          stabilityScore: STANDARD_E4E.stabilityScore,
          operationCeilingScore: STANDARD_E4E.operationCeilingScore,
          versatilityScore: STANDARD_E4E.versatilityScore
        };
      } else if (skillId === 'helping-support') {
        const team = standardHelpingSupportTeam(records, record, { favoriteShare });
        effect = helpingSupportEffect({
          level: capped(HELPING_SUPPORT_S.maxLevel),
          targetEnergyPerHelp: team.targets.map(target => target.energyPerHelp),
          referenceEnergyPerHelp: team.referenceEnergyPerHelp
        });
      } else if (skillId === 'berry-burst') {
        const team = standardBerrySkillTeam(records, record, { favoriteShare });
        const effectLevel = capped(BERRY_BURST.maxLevel);
        effect = berryBurstEffect({
          selfBerryCount: BERRY_BURST.selfBerryByLevel[effectLevel],
          teammateBerryCount: BERRY_BURST.teammateBerryByLevel[effectLevel],
          userBerryEnergy: team.targets[0].berryEnergy,
          teammateBerryEnergies: team.targets.slice(1).map(target => target.berryEnergy),
          referenceTeammateBerryEnergy: team.referenceTeammateBerryEnergy
        });
      } else {
        throw new Error(`十项全能尚未实现：${skillId}`);
      }
      singleUsePracticalValue = effect.singleUsePracticalValue;
      effectOutputIndex = theoreticalTriggerIndexPerDay * singleUsePracticalValue;
      stabilityScore = effect.stabilityScore;
      operationCeilingScore = effect.operationCeilingScore;
      versatilityScore = effect.versatilityScore;
      eightHourOperationalOutputIndex = (
        effectOutputIndex * unattended.retentionRatio * operationCeilingScore / 100
      );
    }
    const possibleCandyPerUse = ALL_MIGHTY.possibleCandyByLevel[level];
    if (!(possibleCandyPerUse >= ALL_MIGHTY.guaranteedCandyPerUse)) {
      throw new Error(`无效十项全能糖果等级：${level}`);
    }
    const expectedCandyPerUse = bonusCandyProbability == null
      ? null
      : (
          ALL_MIGHTY.guaranteedCandyPerUse
          + bonusCandyProbability * (possibleCandyPerUse - ALL_MIGHTY.guaranteedCandyPerUse)
        );
    const candyPracticalValuePerUse = expectedCandyPerUse == null || candyUnitPracticalValue == null
      ? null
      : expectedCandyPerUse * candyUnitPracticalValue;
    const completeTheoreticalOutputIndex = candyPracticalValuePerUse == null
      ? null
      : effectOutputIndex + theoreticalTriggerIndexPerDay * candyPracticalValuePerUse;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      specialty: record.specialty,
      skillNameZh: `十项全能→${skillNameById[skillId]}`,
      selectedSkillId: skillId,
      selectedSkillNameZh: skillNameById[skillId],
      scoringStatus: selectedSkillRatePct === undefined
        ? 'confirmed-effects-provisional-record-rate-not-selected-skill-specific'
        : 'confirmed-effects-user-selected-skill-rate',
      allMightyLevel: level,
      selectedEffectLevel: capped({
        metronome: METRONOME.maxLevel,
        'energy-s-fixed': ENERGY_CHARGE_S_FIXED.maxLevel,
        'energy-m': ENERGY_CHARGE_M.maxLevel,
        'dream-shard-fixed': DREAM_SHARD_SKILL.maxLevel,
        'ingredient-magnet': INGREDIENT_SKILL_COMMON.maxLevel,
        'energizing-cheer': ENERGIZING_CHEER.maxLevel,
        'charge-energy': CHARGE_ENERGY_S.maxLevel,
        e4e: STANDARD_E4E.maxLevel,
        'tasty-chance': TASTY_CHANCE_S.maxLevel,
        'cooking-power': COOKING_POWER_UP.maxLevel,
        'helping-support': HELPING_SUPPORT_S.maxLevel,
        'berry-burst': BERRY_BURST.maxLevel
      }[skillId]),
      selectedSkillRatePct: ratePct,
      theoreticalTriggerIndexPerDay: round(theoreticalTriggerIndexPerDay, 3),
      singleUsePracticalValue: round(singleUsePracticalValue, 1),
      theoreticalEffectOutputIndex: round(effectOutputIndex, 1),
      theoreticalOutputIndex: round(effectOutputIndex, 1),
      guaranteedCandyPerUse: ALL_MIGHTY.guaranteedCandyPerUse,
      possibleCandyPerUse,
      bonusCandyProbability,
      expectedCandyPerUse: expectedCandyPerUse == null ? null : round(expectedCandyPerUse, 3),
      candyUnitPracticalValue: candyUnitPracticalValue ?? null,
      candyPracticalValuePerUse: candyPracticalValuePerUse == null
        ? null
        : round(candyPracticalValuePerUse, 1),
      completeTheoreticalOutputIndex: completeTheoreticalOutputIndex == null
        ? null
        : round(completeTheoreticalOutputIndex, 1),
      stabilityScore: round(stabilityScore, 1),
      operationCeilingScore: round(operationCeilingScore, 1),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      operationScore: effectOutputIndex > 0
        ? round(Math.min(eightHourOperationalOutputIndex / effectOutputIndex * 100, 100), 1)
        : 0,
      versatilityScore: round(versatilityScore, 1),
      finalAllRounderScore: null,
      finalAllRounderScoreStatus: 'pending-all-rounder-weight-formula',
      ...effectDetails
    };
  })).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || left.selectedSkillId.localeCompare(right.selectedSkillId)
  ));
}

function energyChargeSFixedEffect(level = ENERGY_CHARGE_S_FIXED.maxLevel, fieldBonusPct = 0) {
  const baseEnergy = ENERGY_CHARGE_S_FIXED.energyByLevel[level];
  if (!(baseEnergy > 0)) throw new Error(`无效固定能量填充S等级：${level}`);
  if (!(fieldBonusPct >= 0)) throw new Error(`无效场地加成：${fieldBonusPct}`);
  return {
    level,
    fieldBonusPct,
    baseEnergy,
    actualEnergy: Math.ceil(baseEnergy * (1 + fieldBonusPct / 100)),
    singleUsePracticalValue: directEnergyPracticalValue(baseEnergy),
    stabilityScore: ENERGY_CHARGE_S_FIXED.stabilityScore,
    operationCeilingScore: ENERGY_CHARGE_S_FIXED.operationCeilingScore,
    versatilityScore: ENERGY_CHARGE_S_FIXED.versatilityScore
  };
}

function energyChargeSRandomEffect(level = ENERGY_CHARGE_S_RANDOM.maxLevel, fieldBonusPct = 0) {
  const range = ENERGY_CHARGE_S_RANDOM.rangeByLevel[level];
  if (!range) throw new Error(`无效随机能量填充S等级：${level}`);
  if (!(fieldBonusPct >= 0)) throw new Error(`无效场地加成：${fieldBonusPct}`);
  const [minimumEnergy, maximumEnergy] = range;
  const denominator = ENERGY_CHARGE_S_RANDOM.outcomeCount - 1;
  const baseOutcomes = Array.from({ length: ENERGY_CHARGE_S_RANDOM.outcomeCount }, (_, rank) => (
    Math.ceil(minimumEnergy + (maximumEnergy - minimumEnergy) * rank / denominator)
  ));
  const actualOutcomes = Array.from({ length: ENERGY_CHARGE_S_RANDOM.outcomeCount }, (_, rank) => (
    Math.ceil(
      (minimumEnergy + (maximumEnergy - minimumEnergy) * rank / denominator)
      * (1 + fieldBonusPct / 100)
    )
  ));
  const expectedBaseEnergy = baseOutcomes.reduce((sum, energy) => sum + energy, 0) / baseOutcomes.length;
  const expectedActualEnergy = actualOutcomes.reduce((sum, energy) => sum + energy, 0) / actualOutcomes.length;
  return {
    level,
    fieldBonusPct,
    outcomeCount: ENERGY_CHARGE_S_RANDOM.outcomeCount,
    minimumEnergy,
    maximumEnergy,
    expectedBaseEnergy,
    expectedActualEnergy,
    singleUsePracticalValue: directEnergyPracticalValue(expectedBaseEnergy),
    stabilityScore: minimumEnergy / expectedBaseEnergy * 100,
    operationCeilingScore: ENERGY_CHARGE_S_RANDOM.operationCeilingScore,
    versatilityScore: ENERGY_CHARGE_S_RANDOM.versatilityScore
  };
}

function stockpileScenario(level = STOCKPILE.maxLevel, fieldBonusPct = 0) {
  const baseEnergyByStockpiles = STOCKPILE.energyByLevelAndStockpiles[level];
  if (!baseEnergyByStockpiles) throw new Error(`无效蓄力等级：${level}`);
  if (!(fieldBonusPct >= 0)) throw new Error(`无效场地加成：${fieldBonusPct}`);

  let expectedCycleBaseEnergy = 0;
  let expectedCycleActualEnergy = 0;
  let expectedTriggersPerCycle = 0;
  const outcomes = baseEnergyByStockpiles.map((baseEnergy, stockpiles) => {
    const probability = stockpiles < STOCKPILE.maximumStockpiles
      ? STOCKPILE.stockpileProbability ** stockpiles * STOCKPILE.spitUpProbability
      : STOCKPILE.stockpileProbability ** STOCKPILE.maximumStockpiles;
    const triggerCount = stockpiles + 1;
    const actualEnergy = Math.ceil(baseEnergy * (1 + fieldBonusPct / 100));
    expectedCycleBaseEnergy += probability * baseEnergy;
    expectedCycleActualEnergy += probability * actualEnergy;
    expectedTriggersPerCycle += probability * triggerCount;
    return {
      stockpiles,
      probability,
      triggerCount,
      baseEnergy,
      actualEnergy,
      completedCycleEnergyPerTrigger: baseEnergy / triggerCount
    };
  });
  const expectedBaseEnergyPerTrigger = expectedCycleBaseEnergy / expectedTriggersPerCycle;
  const expectedActualEnergyPerTrigger = expectedCycleActualEnergy / expectedTriggersPerCycle;
  const worstCompletedCycleEnergyPerTrigger = Math.min(
    ...outcomes.map(outcome => outcome.completedCycleEnergyPerTrigger)
  );
  return {
    level,
    fieldBonusPct,
    stockpileProbability: STOCKPILE.stockpileProbability,
    spitUpProbability: STOCKPILE.spitUpProbability,
    expectedStockpilesBeforeSpitUp: expectedTriggersPerCycle - 1,
    expectedTriggersPerCycle,
    expectedCycleBaseEnergy,
    expectedCycleActualEnergy,
    expectedBaseEnergyPerTrigger,
    expectedActualEnergyPerTrigger,
    worstCompletedCycleEnergyPerTrigger,
    probabilityOfTenStockpiles: STOCKPILE.stockpileProbability ** STOCKPILE.maximumStockpiles,
    singleUsePracticalValue: directEnergyPracticalValue(expectedBaseEnergyPerTrigger),
    stabilityScore: worstCompletedCycleEnergyPerTrigger / expectedBaseEnergyPerTrigger * 100,
    operationCeilingScore: STOCKPILE.operationCeilingScore,
    versatilityScore: STOCKPILE.versatilityScore,
    outcomes
  };
}

function energyChargeSRandomRows(records, { fieldBonusPct = 0 } = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === ENERGY_CHARGE_S_RANDOM.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态随机能量填充S技能手数据');
  const effect = energyChargeSRandomEffect(ENERGY_CHARGE_S_RANDOM.maxLevel, fieldBonusPct);
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, effect.operationCeilingScore);
    const triggerIndexPerDay = 86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      carryLimit: record.carryLimitRaisedFromFirstStage,
      skillRatePct: record.skillRatePct,
      maxSkillLevel: ENERGY_CHARGE_S_RANDOM.maxLevel,
      outcomeCount: effect.outcomeCount,
      minimumEnergyPerUse: effect.minimumEnergy,
      maximumEnergyPerUse: effect.maximumEnergy,
      expectedBaseEnergyPerUse: round(effect.expectedBaseEnergy, 1),
      fieldBonusPct: effect.fieldBonusPct,
      expectedActualEnergyPerUse: round(effect.expectedActualEnergy, 1),
      singleUsePracticalValue: round(effect.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalBaseEnergyPerDay: round(triggerIndexPerDay * effect.expectedBaseEnergy),
      theoreticalActualEnergyPerDay: round(triggerIndexPerDay * effect.expectedActualEnergy),
      theoreticalOutputIndex: round(triggerIndexPerDay * effect.singleUsePracticalValue, 1),
      stabilityScore: round(effect.stabilityScore, 1),
      versatilityScore: effect.versatilityScore,
      naturalLevelContribution: record.evolution?.stage === 3 ? 5 : record.evolution?.stage === 2 ? 2.5 : 0,
      effectiveHelpIntervalSec: round(unattended.effectiveHelpIntervalSec),
      expectedHelpsInEightHours: round(unattended.expectedHelps, 2),
      pityCeiling: unattended.pityCeiling,
      effectiveSkillRatePct: round(unattended.effectiveSkillProbability * 100, 3),
      continuousEightHourTriggers: round(unattended.continuousCollectionExpectedTriggers, 3),
      storedEightHourTriggers: round(unattended.expectedStoredTriggers, 3),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationScore: round(unattended.operationScore, 1)
    };
  }).sort((left, right) => (
    right.theoreticalBaseEnergyPerDay - left.theoreticalBaseEnergyPerDay
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function stockpileRows(records, { fieldBonusPct = 0 } = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === STOCKPILE.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态蓄力技能手数据');
  const scenario = stockpileScenario(STOCKPILE.maxLevel, fieldBonusPct);
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, scenario.operationCeilingScore);
    const triggerIndexPerDay = 86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      carryLimit: record.carryLimitRaisedFromFirstStage,
      skillRatePct: record.skillRatePct,
      maxSkillLevel: STOCKPILE.maxLevel,
      stockpileProbabilityPct: round(scenario.stockpileProbability * 100, 1),
      spitUpProbabilityPct: round(scenario.spitUpProbability * 100, 1),
      expectedStockpilesBeforeSpitUp: round(scenario.expectedStockpilesBeforeSpitUp, 3),
      expectedTriggersPerCycle: round(scenario.expectedTriggersPerCycle, 3),
      expectedCycleBaseEnergy: round(scenario.expectedCycleBaseEnergy, 1),
      expectedBaseEnergyPerTrigger: round(scenario.expectedBaseEnergyPerTrigger, 1),
      fieldBonusPct: scenario.fieldBonusPct,
      expectedActualEnergyPerTrigger: round(scenario.expectedActualEnergyPerTrigger, 1),
      probabilityOfTenStockpilesPct: round(scenario.probabilityOfTenStockpiles * 100, 1),
      worstCompletedCycleEnergyPerTrigger: round(scenario.worstCompletedCycleEnergyPerTrigger, 1),
      singleUsePracticalValue: round(scenario.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalBaseEnergyPerDay: round(triggerIndexPerDay * scenario.expectedBaseEnergyPerTrigger),
      theoreticalActualEnergyPerDay: round(triggerIndexPerDay * scenario.expectedActualEnergyPerTrigger),
      theoreticalOutputIndex: round(triggerIndexPerDay * scenario.singleUsePracticalValue, 1),
      stabilityScore: round(scenario.stabilityScore, 1),
      versatilityScore: scenario.versatilityScore,
      naturalLevelContribution: record.evolution?.stage === 3 ? 5 : record.evolution?.stage === 2 ? 2.5 : 0,
      effectiveHelpIntervalSec: round(unattended.effectiveHelpIntervalSec),
      expectedHelpsInEightHours: round(unattended.expectedHelps, 2),
      pityCeiling: unattended.pityCeiling,
      effectiveSkillRatePct: round(unattended.effectiveSkillProbability * 100, 3),
      continuousEightHourTriggers: round(unattended.continuousCollectionExpectedTriggers, 3),
      storedEightHourTriggers: round(unattended.expectedStoredTriggers, 3),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationScore: round(unattended.operationScore, 1)
    };
  }).sort((left, right) => (
    right.theoreticalBaseEnergyPerDay - left.theoreticalBaseEnergyPerDay
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function energyChargeMRows(records, { fieldBonusPct = 0 } = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === ENERGY_CHARGE_M.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态能量填充M技能手数据');
  const effect = energyChargeMEffect(ENERGY_CHARGE_M.maxLevel, fieldBonusPct);
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(
      record,
      UNATTENDED_HOURS,
      ENERGY_CHARGE_M.operationCeilingScore
    );
    const triggerIndexPerDay = 86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      carryLimit: record.carryLimitRaisedFromFirstStage,
      skillRatePct: record.skillRatePct,
      maxSkillLevel: ENERGY_CHARGE_M.maxLevel,
      baseEnergyPerUse: effect.baseEnergy,
      fieldBonusPct: effect.fieldBonusPct,
      actualEnergyPerUse: effect.actualEnergy,
      singleUsePracticalValue: ENERGY_CHARGE_M.singleUsePracticalValue,
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalBaseEnergyPerDay: round(triggerIndexPerDay * effect.baseEnergy),
      theoreticalActualEnergyPerDay: round(triggerIndexPerDay * effect.actualEnergy),
      theoreticalOutputIndex: round(triggerIndexPerDay * ENERGY_CHARGE_M.singleUsePracticalValue, 1),
      stabilityScore: ENERGY_CHARGE_M.stabilityScore,
      versatilityScore: ENERGY_CHARGE_M.versatilityScore,
      naturalLevelContribution: record.evolution?.stage === 3 ? 5 : record.evolution?.stage === 2 ? 2.5 : 0,
      effectiveHelpIntervalSec: round(unattended.effectiveHelpIntervalSec),
      expectedHelpsInEightHours: round(unattended.expectedHelps, 2),
      pityCeiling: unattended.pityCeiling,
      effectiveSkillRatePct: round(unattended.effectiveSkillProbability * 100, 3),
      continuousEightHourTriggers: round(unattended.continuousCollectionExpectedTriggers, 3),
      storedEightHourTriggers: round(unattended.expectedStoredTriggers, 3),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationScore: round(unattended.operationScore, 1)
    };
  }).sort((left, right) => (
    right.theoreticalBaseEnergyPerDay - left.theoreticalBaseEnergyPerDay
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function nightmareScenario(nonDarkTeammates = 2) {
  if (!(Number.isInteger(nonDarkTeammates) && nonDarkTeammates >= 0 && nonDarkTeammates <= 4)) {
    throw new Error(`噩梦的非恶属性队友数必须为0至4：${nonDarkTeammates}`);
  }
  const baseEnergy = NIGHTMARE.energyByLevel[NIGHTMARE.maxLevel];
  const positivePracticalValue = directEnergyPracticalValue(baseEnergy);
  const penaltyPerNonDarkTeammate = (
    STANDARD_E4E.singleUsePracticalValue
    * NIGHTMARE.energyPenaltyPerNonDarkHelper
    / (STANDARD_E4E.healingPerHelper * 5)
  );
  const energyPenaltyPracticalValue = penaltyPerNonDarkTeammate * nonDarkTeammates;
  const netSingleUsePracticalValue = positivePracticalValue - energyPenaltyPracticalValue;
  const worstCasePenalty = penaltyPerNonDarkTeammate * 4;
  const versatilityScore = (positivePracticalValue - worstCasePenalty) / positivePracticalValue * 100;
  return {
    nonDarkTeammates,
    baseEnergy,
    positivePracticalValue,
    penaltyPerNonDarkTeammate,
    energyPenaltyPracticalValue,
    netSingleUsePracticalValue,
    stabilityScore: NIGHTMARE.stabilityScore,
    operationCeilingScore: NIGHTMARE.operationCeilingScore,
    versatilityScore
  };
}

function nightmareRows(records, { nonDarkTeammates = 2 } = {}) {
  const candidates = records.filter(record => (
    record.isFinalEvolution
    && Number(record.mainSkill?.id) === NIGHTMARE.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态噩梦技能数据');
  const scenario = nightmareScenario(nonDarkTeammates);
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(
      record,
      UNATTENDED_HOURS,
      scenario.operationCeilingScore
    );
    const triggerIndexPerDay = 86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      specialty: record.specialty,
      carryLimit: record.carryLimitRaisedFromFirstStage,
      skillRatePct: record.skillRatePct,
      nonDarkTeammates: scenario.nonDarkTeammates,
      baseEnergyPerUse: scenario.baseEnergy,
      positivePracticalValue: round(scenario.positivePracticalValue, 1),
      penaltyPerNonDarkTeammate: round(scenario.penaltyPerNonDarkTeammate, 1),
      energyPenaltyPracticalValue: round(scenario.energyPenaltyPracticalValue, 1),
      singleUsePracticalValue: round(scenario.netSingleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalBaseEnergyPerDay: round(triggerIndexPerDay * scenario.baseEnergy),
      theoreticalOutputIndex: round(triggerIndexPerDay * scenario.netSingleUsePracticalValue, 1),
      stabilityScore: scenario.stabilityScore,
      versatilityScore: round(scenario.versatilityScore, 1),
      naturalLevelContribution: 0,
      effectiveHelpIntervalSec: round(unattended.effectiveHelpIntervalSec),
      expectedHelpsInEightHours: round(unattended.expectedHelps, 2),
      pityCeiling: unattended.pityCeiling,
      effectiveSkillRatePct: round(unattended.effectiveSkillProbability * 100, 3),
      continuousEightHourTriggers: round(unattended.continuousCollectionExpectedTriggers, 3),
      storedEightHourTriggers: round(unattended.expectedStoredTriggers, 3),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationInputAssumption: Object.values(record.ingredients || {})
        .flat()
        .some(option => !Number.isFinite(Number(option.combinationProbability)))
        ? 'uniform-flexible-ingredient-fallback'
        : 'reported-ingredient-probabilities',
      operationScore: round(unattended.operationScore, 1)
    };
  });
}

function crescentPrayerScenario({
  distinctPsychicSpecies = 3,
  cresseliaLevel = TARGET_LEVEL,
  cresseliaBerryFavorite = false,
  favoriteBerryShare = 0.5,
  teammates = Array.from({ length: 4 }, () => ({
    berryId: CRESCENT_PRAYER.psychicBerryId,
    level: TARGET_LEVEL,
    favorite: false
  }))
} = {}) {
  const berryCounts = CRESCENT_PRAYER.berryCountsByDistinctPsychicSpecies[distinctPsychicSpecies];
  if (!berryCounts) throw new Error(`新月祈祷的超能系宝可梦种类数必须为1至5：${distinctPsychicSpecies}`);
  if (!Array.isArray(teammates) || teammates.length !== 4) {
    throw new Error('新月祈祷情景必须提供4名队友的树果与等级');
  }
  if (!(favoriteBerryShare == null || (favoriteBerryShare >= 0 && favoriteBerryShare <= 1))) {
    throw new Error(`无效喜爱树果占比：${favoriteBerryShare}`);
  }

  const cresseliaBerryStrength = berryStrengthAtLevel(CRESCENT_PRAYER.psychicBerryId, cresseliaLevel);
  const standardizedFavoriteMultiplier = favoriteBerryShare == null ? null : 1 + favoriteBerryShare;
  const cresseliaBerryEnergy = (
    berryCounts.cresselia
    * cresseliaBerryStrength
    * (standardizedFavoriteMultiplier ?? (cresseliaBerryFavorite ? 2 : 1))
  );
  const teammateBerryEnergy = teammates.reduce((sum, teammate) => {
    const strength = berryStrengthAtLevel(teammate.berryId, teammate.level);
    return sum + berryCounts.eachTeammate * strength * (
      standardizedFavoriteMultiplier ?? (teammate.favorite ? 2 : 1)
    );
  }, 0);
  const totalHealing = CRESCENT_PRAYER.healingPerHelper * 5;
  const productiveHealing = (
    CRESCENT_PRAYER.healingPerHelper
    * STANDARD_HEALER_TEAM.productiveTargetCount
  );
  const healingEquivalentIndex = productiveHealingPracticalValue(productiveHealing);
  const totalBerryEnergy = cresseliaBerryEnergy + teammateBerryEnergy;
  const berryPracticalValue = directEnergyPracticalValue(totalBerryEnergy);
  const singleUsePracticalValue = healingEquivalentIndex + berryPracticalValue;
  const operationCeilingScore = (
    healingEquivalentIndex * CRESCENT_PRAYER.healingOperationCeilingScore
    + berryPracticalValue * CRESCENT_PRAYER.berryOperationCeilingScore
  ) / singleUsePracticalValue;

  return {
    distinctPsychicSpecies,
    favoriteBerryShare,
    totalHealing,
    productiveHealing,
    healingEquivalentIndex,
    cresseliaBerryCount: berryCounts.cresselia,
    berriesPerTeammate: berryCounts.eachTeammate,
    totalBerryCount: berryCounts.total,
    cresseliaBerryEnergy,
    teammateBerryEnergy,
    totalBerryEnergy,
    berryPracticalValue,
    singleUsePracticalValue,
    stabilityScore: CRESCENT_PRAYER.stabilityScore,
    healingOperationCeilingScore: CRESCENT_PRAYER.healingOperationCeilingScore,
    berryOperationCeilingScore: CRESCENT_PRAYER.berryOperationCeilingScore,
    operationCeilingScore
  };
}

function crescentPrayerVersatilityScore() {
  const teamFloor = crescentPrayerScenario({ distinctPsychicSpecies: 1, favoriteBerryShare: 0.5 });
  const teamCeiling = crescentPrayerScenario({ distinctPsychicSpecies: 5, favoriteBerryShare: 0.5 });
  const islandFloor = crescentPrayerScenario({ distinctPsychicSpecies: 3, favoriteBerryShare: 0 });
  const islandCeiling = crescentPrayerScenario({ distinctPsychicSpecies: 3, favoriteBerryShare: 1 });
  const teamIndependence = teamFloor.singleUsePracticalValue / teamCeiling.singleUsePracticalValue;
  const islandIndependence = islandFloor.singleUsePracticalValue / islandCeiling.singleUsePracticalValue;
  return (teamIndependence + islandIndependence) / 2 * 100;
}

function crescentPrayerRows(records, scenarioOptions = {}) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === CRESCENT_PRAYER.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态新月祈祷技能手数据');
  const scenario = crescentPrayerScenario(scenarioOptions);
  const versatilityScore = crescentPrayerVersatilityScore();
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(record, UNATTENDED_HOURS, scenario.operationCeilingScore);
    const triggerIndexPerDay = 86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      carryLimit: record.carryLimitRaisedFromFirstStage,
      skillRatePct: record.skillRatePct,
      distinctPsychicSpecies: scenario.distinctPsychicSpecies,
      totalHealing: scenario.totalHealing,
      healingEquivalentIndexPerUse: round(scenario.healingEquivalentIndex, 1),
      cresseliaBerryCount: scenario.cresseliaBerryCount,
      berriesPerTeammate: scenario.berriesPerTeammate,
      totalBerryCount: scenario.totalBerryCount,
      berryEnergyPerUse: scenario.totalBerryEnergy,
      berryPracticalValuePerUse: round(scenario.berryPracticalValue, 1),
      singleUsePracticalValue: round(scenario.singleUsePracticalValue, 1),
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalHealingEquivalentIndexPerDay: round(triggerIndexPerDay * scenario.healingEquivalentIndex, 1),
      theoreticalBerryEnergyPerDay: round(triggerIndexPerDay * scenario.totalBerryEnergy),
      theoreticalOutputIndex: round(triggerIndexPerDay * scenario.singleUsePracticalValue, 1),
      stabilityScore: scenario.stabilityScore,
      versatilityScore: round(versatilityScore, 1),
      naturalLevelContribution: record.evolution?.stage === 3 ? 5 : record.evolution?.stage === 2 ? 2.5 : 0,
      effectiveHelpIntervalSec: round(unattended.effectiveHelpIntervalSec),
      expectedHelpsInEightHours: round(unattended.expectedHelps, 2),
      pityCeiling: unattended.pityCeiling,
      effectiveSkillRatePct: round(unattended.effectiveSkillProbability * 100, 3),
      continuousEightHourTriggers: round(unattended.continuousCollectionExpectedTriggers, 3),
      storedEightHourTriggers: round(unattended.expectedStoredTriggers, 3),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationCeilingScore: round(scenario.operationCeilingScore, 1),
      operationScore: round(unattended.operationScore, 1)
    };
  }).sort((left, right) => (
    right.theoreticalBerryEnergyPerDay - left.theoreticalBerryEnergyPerDay
    || left.pokedexId - right.pokedexId
  ));
}

function standardE4eRows(records) {
  const candidates = records.filter(record => (
    record.specialty === 'skill'
    && record.isFinalEvolution
    && Number(record.mainSkill?.id) === STANDARD_E4E.mainSkillId
  ));
  if (!candidates.length) throw new Error('没有最终形态普通活力全体疗愈技能手数据');
  return candidates.map(record => {
    const unattended = unattendedSkillStorageMetrics(record);
    const triggerIndexPerDay = 86400 / helpIntervalAtLevel(record.helpFrequencyBaseSec) * unattended.effectiveSkillProbability;
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      carryLimit: record.carryLimitRaisedFromFirstStage,
      skillRatePct: record.skillRatePct,
      singleUsePracticalValue: STANDARD_E4E.singleUsePracticalValue,
      theoreticalTriggerIndexPerDay: round(triggerIndexPerDay, 3),
      theoreticalOutputIndex: round(triggerIndexPerDay * STANDARD_E4E.singleUsePracticalValue, 1),
      stabilityScore: STANDARD_E4E.stabilityScore,
      versatilityScore: STANDARD_E4E.versatilityScore,
      naturalLevelContribution: record.evolution?.stage === 3 ? 5 : record.evolution?.stage === 2 ? 2.5 : 0,
      effectiveHelpIntervalSec: round(unattended.effectiveHelpIntervalSec),
      expectedHelpsInEightHours: round(unattended.expectedHelps, 2),
      pityCeiling: unattended.pityCeiling,
      effectiveSkillRatePct: round(unattended.effectiveSkillProbability * 100, 3),
      continuousEightHourTriggers: round(unattended.continuousCollectionExpectedTriggers, 3),
      storedEightHourTriggers: round(unattended.expectedStoredTriggers, 3),
      eightHourRetentionPct: round(unattended.retentionRatio * 100, 1),
      fullInventoryProbabilityPct: round(unattended.fullInventoryProbability * 100, 1),
      operationScore: round(unattended.operationScore, 1)
    };
  }).sort((left, right) => (
    right.theoreticalOutputIndex - left.theoreticalOutputIndex
    || right.operationScore - left.operationScore
    || left.pokedexId - right.pokedexId
  ));
}

function mainSkillModelCoverage(records) {
  const presentIds = [...new Set(records.map(record => Number(record.mainSkill?.id)))]
    .filter(Number.isFinite)
    .sort((left, right) => left - right);
  const modeledIds = presentIds.filter(id => CURRENT_MAIN_SKILL_MODEL_IDS.includes(id));
  const unmodeledIds = presentIds.filter(id => !CURRENT_MAIN_SKILL_MODEL_IDS.includes(id));
  return {
    presentIds,
    modeledIds,
    unmodeledIds,
    complete: unmodeledIds.length === 0
  };
}

function mainSkillTypeFit(mainSkill) {
  const skillId = Number(mainSkill?.id);
  return Object.hasOwn(INGREDIENT_MAIN_SKILL_TYPE_FIT, skillId) ? INGREDIENT_MAIN_SKILL_TYPE_FIT[skillId] : null;
}

function berryMainSkillTypeFit(mainSkill) {
  const skillId = Number(mainSkill?.id);
  return Object.hasOwn(BERRY_MAIN_SKILL_TYPE_FIT, skillId) ? BERRY_MAIN_SKILL_TYPE_FIT[skillId] : null;
}

function berryStrengthAtLevel(berryId, level = TARGET_LEVEL) {
  const baseStrength = BERRY_BASE_STRENGTH[Number(berryId)];
  if (!(baseStrength > 0)) throw new Error(`未知树果ID：${berryId}`);
  if (!(level >= 1 && level <= 100)) throw new Error(`无效等级：${level}`);
  return Math.round(Math.max(
    baseStrength + level - 1,
    baseStrength * (1.025 ** (level - 1))
  ));
}

function ingredientProductionRows(records) {
  const candidates = records.filter(record => record.specialty === 'ingredient' && record.isFinalEvolution);
  if (!candidates.length) throw new Error('没有最终形态食材手数据');

  const rows = candidates.map(record => {
    if (!(record.ingredientRate > 0)) throw new Error(`${record.id} 缺少有效食材概率`);
    const ingredient = ingredientA(record);
    const strength = INGREDIENT_STRENGTH[ingredient.id];
    if (!strength) throw new Error(`${record.id} 使用未知食材ID：${ingredient.id}`);
    const averageQuantity = aaaAverageQuantity(record);
    const interval = helpIntervalAtLevel(record.helpFrequencyBaseSec);
    const standardCount = 86400 / interval * record.ingredientRate * averageQuantity;
    const inventory = inventoryMetrics(record, averageQuantity);
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      ingredientId: ingredient.id,
      ingredientNameZh: ingredient.nameZh,
      ingredientNameEn: ingredient.nameEn,
      ingredientRate: record.ingredientRate,
      level70HelpIntervalSec: interval,
      aaaAverageQuantity: averageQuantity,
      standardIngredientCount: standardCount,
      standardIngredientStrength: standardCount * strength,
      carryLimit: record.carryLimitRaisedFromFirstStage,
      ...inventory,
      mainSkill: record.mainSkill,
      skillRatePct: record.skillRatePct,
      standardSkillTriggerIndex: 86400 / interval * record.skillRatePct / 100,
      naturalMainSkillLevel: record.evolution?.stage ?? 1
    };
  });

  const bestCount = Math.max(...rows.map(row => row.standardIngredientCount));
  const bestStrength = Math.max(...rows.map(row => row.standardIngredientStrength));
  const bestSkillTriggerIndex = Math.max(...rows.map(row => row.standardSkillTriggerIndex));
  return rows.map(row => {
    const ingredientCountScore = row.standardIngredientCount / bestCount * 100;
    const ingredientStrengthScore = row.standardIngredientStrength / bestStrength * 100;
    const productionScore = (
      ingredientCountScore * PRODUCTION_WEIGHTS.ingredientCount
      + ingredientStrengthScore * PRODUCTION_WEIGHTS.ingredientStrength
    );
    const skillTriggerEfficiencyScore = row.standardSkillTriggerIndex / bestSkillTriggerIndex * 100;
    const naturalMainSkillLevelScore = Math.min(Math.max(row.naturalMainSkillLevel - 1, 0) / 2, 1) * 100;
    const mainSkillTypeFitScore = mainSkillTypeFit(row.mainSkill);
    const mainSkillScore = mainSkillTypeFitScore === null ? null : (
      mainSkillTypeFitScore * MAIN_SKILL_WEIGHTS.typeFit
      + skillTriggerEfficiencyScore * MAIN_SKILL_WEIGHTS.triggerEfficiency
      + naturalMainSkillLevelScore * MAIN_SKILL_WEIGHTS.naturalLevel
    );
    const mainSkillContribution = mainSkillScore === null ? null : mainSkillScore * INGREDIENT_SPECIES_WEIGHTS.mainSkill;
    const confirmedSubtotal = (
      productionScore * INGREDIENT_SPECIES_WEIGHTS.production
      + row.inventoryContribution
    );
    return {
      ...row,
      ingredientCountScore: round(ingredientCountScore),
      ingredientStrengthScore: round(ingredientStrengthScore),
      productionScore: round(productionScore),
      productionContribution: round(productionScore * INGREDIENT_SPECIES_WEIGHTS.production),
      expectedItemsPerHelp: round(row.expectedItemsPerHelp, 3),
      effectiveHelpIntervalSec: round(row.effectiveHelpIntervalSec),
      estimatedFillHours: round(row.estimatedFillHours, 2),
      inventoryScore: round(row.inventoryScore),
      inventoryContribution: round(row.inventoryContribution),
      confirmedSubtotal: round(confirmedSubtotal),
      skillTriggerEfficiencyScore: round(skillTriggerEfficiencyScore),
      naturalMainSkillLevelScore: round(naturalMainSkillLevelScore),
      mainSkillTypeFitScore,
      mainSkillScore: mainSkillScore === null ? null : round(mainSkillScore),
      mainSkillContribution: mainSkillContribution === null ? null : round(mainSkillContribution),
      speciesScore: mainSkillContribution === null ? null : round(confirmedSubtotal + mainSkillContribution)
    };
  }).sort((left, right) => (
    (right.speciesScore ?? right.confirmedSubtotal) - (left.speciesScore ?? left.confirmedSubtotal)
    || right.productionScore - left.productionScore
    || left.pokedexId - right.pokedexId
  ));
}

function berryProductionRows(records) {
  const candidates = records.filter(record => record.specialty === 'berry' && record.isFinalEvolution);
  if (!candidates.length) throw new Error('没有最终形态树果手数据');

  const rows = candidates.map(record => {
    if (!(record.ingredientRate >= 0 && record.ingredientRate < 1)) {
      throw new Error(`${record.id} 缺少有效食材概率`);
    }
    if (!(record.baseBerryCount > 0)) throw new Error(`${record.id} 缺少有效基础树果数量`);
    if (!(record.skillRatePct >= 0)) throw new Error(`${record.id} 缺少有效技能概率`);
    const interval = helpIntervalAtLevel(record.helpFrequencyBaseSec);
    const berryStrength = berryStrengthAtLevel(record.berryId);
    const standardCount = (
      86400 / interval
      * (1 - record.ingredientRate)
      * record.baseBerryCount
    );
    const fullBagCount = (
      86400 / interval
      * record.baseBerryCount
    );
    return {
      id: record.id,
      pokedexId: record.pokedexId,
      nameZh: record.nameZh,
      nameEn: record.nameEn,
      berryId: record.berryId,
      baseBerryCount: record.baseBerryCount,
      ingredientRate: record.ingredientRate,
      level70HelpIntervalSec: interval,
      level70BerryStrength: berryStrength,
      standardBerryCount: standardCount,
      standardBerryStrength: standardCount * berryStrength,
      fullBagBerryCount: fullBagCount,
      fullBagBerryStrength: fullBagCount * berryStrength,
      mainSkill: record.mainSkill,
      skillRatePct: record.skillRatePct,
      standardSkillTriggerIndex: 86400 / interval * record.skillRatePct / 100,
      naturalMainSkillLevel: record.evolution?.stage ?? 1
    };
  });

  const bestProduction = Math.max(...rows.map(row => row.standardBerryStrength));
  const bestFullBagProduction = Math.max(...rows.map(row => row.fullBagBerryStrength));
  const bestSkillTriggerIndex = Math.max(...rows.map(row => row.standardSkillTriggerIndex));
  const scoredRows = rows.map(row => {
    const productionScore = row.standardBerryStrength / bestProduction * 100;
    const fullBagProductionScore = row.fullBagBerryStrength / bestFullBagProduction * 100;
    const productionContribution = productionScore * BERRY_SPECIES_WEIGHTS.production;
    const skillTriggerEfficiencyScore = row.standardSkillTriggerIndex / bestSkillTriggerIndex * 100;
    const naturalMainSkillLevelScore = Math.min(Math.max(row.naturalMainSkillLevel - 1, 0) / 2, 1) * 100;
    const mainSkillTypeFitScore = berryMainSkillTypeFit(row.mainSkill);
    const mainSkillScore = mainSkillTypeFitScore === null ? null : (
      mainSkillTypeFitScore * MAIN_SKILL_WEIGHTS.typeFit
      + skillTriggerEfficiencyScore * MAIN_SKILL_WEIGHTS.triggerEfficiency
      + naturalMainSkillLevelScore * MAIN_SKILL_WEIGHTS.naturalLevel
    );
    const mainSkillContribution = mainSkillScore === null ? null : mainSkillScore * BERRY_SPECIES_WEIGHTS.mainSkill;
    return {
      ...row,
      level70HelpIntervalSec: round(row.level70HelpIntervalSec),
      standardBerryCount: round(row.standardBerryCount, 2),
      standardBerryStrength: round(row.standardBerryStrength),
      fullBagBerryCount: round(row.fullBagBerryCount, 2),
      fullBagBerryStrength: round(row.fullBagBerryStrength),
      fullBagProductionScore: round(fullBagProductionScore),
      productionScore: round(productionScore),
      productionContribution: round(productionContribution),
      confirmedSubtotal: round(productionContribution),
      skillTriggerEfficiencyScore: round(skillTriggerEfficiencyScore),
      naturalMainSkillLevelScore: round(naturalMainSkillLevelScore),
      mainSkillTypeFitScore,
      mainSkillScore: mainSkillScore === null ? null : round(mainSkillScore),
      mainSkillContribution: mainSkillContribution === null ? null : round(mainSkillContribution),
      speciesScore: mainSkillContribution === null ? null : round(productionContribution + mainSkillContribution)
    };
  });
  const normalRankById = new Map([...scoredRows].sort((left, right) => (
    right.standardBerryStrength - left.standardBerryStrength
    || left.pokedexId - right.pokedexId
  )).map((row, index) => [String(row.id), index + 1]));
  const fullBagRankById = new Map([...scoredRows].sort((left, right) => (
    right.fullBagBerryStrength - left.fullBagBerryStrength
    || left.pokedexId - right.pokedexId
  )).map((row, index) => [String(row.id), index + 1]));
  return scoredRows.map(row => {
    const normalRank = normalRankById.get(String(row.id));
    const fullBagRank = fullBagRankById.get(String(row.id));
    return {
      ...row,
      berryScenarios: {
        status: 'confirmed-separate-species-baselines',
        targetLevel: TARGET_LEVEL,
        normalCollection: {
          berryCountPerDay: row.standardBerryCount,
          berryStrengthPerDay: row.standardBerryStrength,
          productionScore: row.productionScore,
          rank: normalRank
        },
        fullBagSneakySnacking: {
          berryCountPerDay: row.fullBagBerryCount,
          berryStrengthPerDay: row.fullBagBerryStrength,
          productionScore: row.fullBagProductionScore,
          rank: fullBagRank
        },
        rankChangeWhenFull: normalRank - fullBagRank,
        scope: 'Lv.70 final-form species baseline; no nature, subskills, favorite-Berry bonus, Energy-speed multiplier, ingredients, or main-skill output'
      }
    };
  }).sort((left, right) => (
    (right.speciesScore ?? right.confirmedSubtotal) - (left.speciesScore ?? left.confirmedSubtotal)
    || right.productionScore - left.productionScore
    || left.pokedexId - right.pokedexId
  ));
}

function selfTest() {
  const ingredientSlots = id => ({
    1: [{ id, code: 'A', quantity: 2, combinationProbability: 1, nameZh: 'A', nameEn: 'A' }],
    30: [{ id, code: 'A', quantity: 5, combinationProbability: 1, nameZh: 'A', nameEn: 'A' }],
    60: [{ id, code: 'A', quantity: 7, combinationProbability: 1, nameZh: 'A', nameEn: 'A' }]
  });
  const ingredientFixture = [
    { id: 'fast', pokedexId: 1, nameZh: '快', nameEn: 'Fast', specialty: 'ingredient', isFinalEvolution: true, ingredientRate: 0.25, skillRatePct: 4, helpFrequencyBaseSec: 2000, baseBerryCount: 1, carryLimitRaisedFromFirstStage: 20, evolution: { stage: 3 }, ingredients: ingredientSlots(1), mainSkill: { id: 10 } },
    { id: 'slow', pokedexId: 2, nameZh: '慢', nameEn: 'Slow', specialty: 'ingredient', isFinalEvolution: true, ingredientRate: 0.20, skillRatePct: 2, helpFrequencyBaseSec: 2500, baseBerryCount: 1, carryLimitRaisedFromFirstStage: 20, evolution: { stage: 2 }, ingredients: ingredientSlots(1), mainSkill: { id: 5 } },
    { id: 'light', pokedexId: 3, nameZh: '轻', nameEn: 'Light', specialty: 'ingredient', isFinalEvolution: true, ingredientRate: 0.25, skillRatePct: 4, helpFrequencyBaseSec: 2000, baseBerryCount: 1, carryLimitRaisedFromFirstStage: 20, evolution: { stage: 1 }, ingredients: ingredientSlots(5), mainSkill: { id: 14 } },
    { id: 'roomy', pokedexId: 4, nameZh: '宽', nameEn: 'Roomy', specialty: 'ingredient', isFinalEvolution: true, ingredientRate: 0.25, skillRatePct: 4, helpFrequencyBaseSec: 2000, baseBerryCount: 1, carryLimitRaisedFromFirstStage: 1000, evolution: { stage: 3 }, ingredients: ingredientSlots(1), mainSkill: {} }
  ];
  const ingredientById = Object.fromEntries(ingredientProductionRows(ingredientFixture).map(row => [row.id, row]));
  const berryFixture = [
    { id: 'berry-fast', pokedexId: 11, nameZh: '快树果', nameEn: 'Fast Berry', specialty: 'berry', isFinalEvolution: true, ingredientRate: 0.20, skillRatePct: 4, helpFrequencyBaseSec: 2000, baseBerryCount: 2, berryId: 15, evolution: { stage: 3 }, mainSkill: { id: 9 } },
    { id: 'berry-slow', pokedexId: 12, nameZh: '慢树果', nameEn: 'Slow Berry', specialty: 'berry', isFinalEvolution: true, ingredientRate: 0.20, skillRatePct: 2, helpFrequencyBaseSec: 2500, baseBerryCount: 2, berryId: 15, evolution: { stage: 2 }, mainSkill: { id: 4 } },
    { id: 'berry-unknown', pokedexId: 13, nameZh: '未知树果', nameEn: 'Unknown Berry', specialty: 'berry', isFinalEvolution: true, ingredientRate: 0.20, skillRatePct: 4, helpFrequencyBaseSec: 2000, baseBerryCount: 2, berryId: 15, evolution: { stage: 3 }, mainSkill: { id: 999 } }
  ];
  const berryById = Object.fromEntries(berryProductionRows(berryFixture).map(row => [row.id, row]));
  const skillFixture = {
    id: 'healer',
    pokedexId: 21,
    nameZh: '治疗',
    nameEn: 'Healer',
    specialty: 'skill',
    isFinalEvolution: true,
    ingredientRate: 0.2,
    skillRatePct: 4,
    helpFrequencyBaseSec: 2400,
    baseBerryCount: 1,
    berryId: 15,
    carryLimitRaisedFromFirstStage: 1000,
    evolution: { stage: 3 },
    ingredients: ingredientSlots(1),
    mainSkill: { id: STANDARD_E4E.mainSkillId }
  };
  const skillOrdinaryById = Object.fromEntries(skillSpecialistOrdinaryProductionRows([
    { ...skillFixture, id: 'skill-fast', pokedexId: 22, helpFrequencyBaseSec: 2000 },
    { ...skillFixture, id: 'skill-slow', pokedexId: 23, helpFrequencyBaseSec: 2500 }
  ]).map(row => [row.id, row]));
  const slotProducerFixture = [2000, 2100, 2200, 2300, 2400].map((helpFrequencyBaseSec, index) => ({
    id: `slot-producer-${index + 1}`,
    pokedexId: 30 + index,
    nameZh: `产能${index + 1}`,
    nameEn: `Producer ${index + 1}`,
    specialty: 'berry',
    isFinalEvolution: true,
    ingredientRate: 0.2,
    skillRatePct: 2,
    helpFrequencyBaseSec,
    baseBerryCount: 2,
    berryId: 15,
    evolution: { stage: 3 },
    ingredients: ingredientSlots(1),
    mainSkill: { id: 9 }
  }));
  const slotSkillFixture = { ...skillFixture, id: 'skill-fast', pokedexId: 22, helpFrequencyBaseSec: 2000 };
  const slotRecords = [slotSkillFixture, ...slotProducerFixture];
  const slotBenchmark = standardPrimaryProducerSlotBenchmark(slotRecords);
  const slotBaseRow = attachSkillSpecialistOrdinaryProduction([
    { id: slotSkillFixture.id, theoreticalOutputIndex: 100 }
  ], slotRecords)[0];
  const slotEconomicsExtra = attachSkillSpecialistSlotEconomics([slotBaseRow], slotRecords, {
    slotRole: SKILL_SPECIALIST_SLOT_ROLES.EXTRA_SKILL
  })[0];
  const slotEconomicsHealer = attachSkillSpecialistSlotEconomics([slotBaseRow], slotRecords, {
    slotRole: SKILL_SPECIALIST_SLOT_ROLES.HEALER
  })[0];
  const slotEconomicsConditional = attachSkillSpecialistSlotEconomics([slotBaseRow], slotRecords, {
    slotRole: SKILL_SPECIALIST_SLOT_ROLES.CONDITIONAL_HEALER
  })[0];
  const skillFixtureMetrics = unattendedSkillStorageMetrics(skillFixture);
  const skillFixtureItemProbability = itemCountDistributionPerHelp(skillFixture)
    .reduce((sum, outcome) => sum + outcome.probability, 0);
  const berryJuice = berryJuiceAnchor();
  const energizingCheer = energizingCheerEffect();
  const chargeEnergyS = chargeEnergySEffect();
  const moonlight = moonlightEffect();
  const nuzzle = nuzzleScenario();
  const healPulseSolo = healPulseScenario({
    latiosPresent: false,
    helpEnergyPerHelp: 500.5,
    healerHelpEnergyPerHelp: 250
  });
  const healPulsePair = healPulseScenario({
    latiosPresent: true,
    helpEnergyPerHelp: 500.5,
    healerHelpEnergyPerHelp: 250
  });
  const helpingSupport = helpingSupportEffect({
    targetEnergyPerHelp: [200, 300, 400, 500, 600],
    referenceEnergyPerHelp: 500
  });
  const helperBoost = helperBoostEffect({ targetEnergyPerHelp: [100, 200, 300, 400, 500] });
  const berryBurst = berryBurstEffect({
    selfBerryCount: 30,
    teammateBerryCount: 5,
    userBerryEnergy: 200,
    teammateBerryEnergies: [100, 200, 300, 400],
    referenceTeammateBerryEnergy: 300
  });
  const meteorShower = meteorShowerEffect({
    userBerryEnergy: 200,
    teammateBerryEnergies: [100, 200, 300, 400]
  });
  const energyChargeSFixed = energyChargeSFixedEffect(7, 60);
  const energyChargeSRandom = energyChargeSRandomEffect(7, 60);
  const energyChargeM = energyChargeMEffect(7, 60);
  const dreamShardFixed = dreamShardFixedEffect();
  const dreamShardRandom = dreamShardRandomEffect();
  const auraSphere = auraSphereEffect();
  const auraSphereScarce = auraSphereEffect({ demandCoefficient: 1.5 });
  const stockpile = stockpileScenario(7, 0);
  const crescentPrayer = crescentPrayerScenario({ distinctPsychicSpecies: 3, favoriteBerryShare: 0 });
  const crescentPrayerStandard = crescentPrayerScenario({ distinctPsychicSpecies: 3 });
  const nightmare = nightmareScenario(2);
  const ingredientMagnet = randomIngredientMagnetEffect({ ingredientCount: 24 });
  const ingredientDraw = selectedIngredientEffect({
    ingredientCount: 18,
    ingredientIds: [18, 16, 4]
  });
  const plusFixture = {
    nameZh: '正电测试',
    ingredients: { 1: [{ id: 17, code: 'A', quantity: 1 }] }
  };
  const plusIngredientMagnet = plusIngredientMagnetEffect(plusFixture);
  const plusIngredientMagnetStandalone = plusIngredientMagnetEffect(plusFixture, {
    partnerPresent: false
  });
  const superLuckIngredientDraw = superLuckIngredientDrawEffect();
  const hyperCutterIngredientDraw = hyperCutterIngredientDrawEffect();
  const presentIngredientMagnet = presentIngredientMagnetEffect();
  const presentIngredientMagnetWithCandy = presentIngredientMagnetEffect({
    candyProbability: 0.2,
    candyUnitPracticalValue: 10
  });
  const cookingAssistNoTriggers = cookingAssistWeeklyScenario({ triggerMeanPerMeal: 0 });
  const cookingAssistStandard = cookingAssistWeeklyScenario({ triggerMeanPerMeal: 0.7 });
  const skillCopyDefault = skillCopyScenario();
  const skillCopyWithExcluded = skillCopyScenario({
    targetModes: ['copyable', 'copyable', 'copyable', 'excluded']
  });
  const skillCopyWithFallback = skillCopyScenario({
    targetModes: ['copyable', 'copyable', 'copyable', 'fallback']
  });
  const tastyMatureProfile = tastyChanceMealProfile();
  const tastyActivityProfile = tastyChanceMealProfile({ profileId: 'user-activity' });
  const tastyNoTriggers = tastyChanceWeeklyScenario({
    triggerMeanPerMeal: 0,
    profileId: 'user-activity'
  });
  const tastyDedenneActivity = tastyChanceWeeklyScenario({
    triggerMeanPerMeal: 1.938336878 / TASTY_CHANCE_S.mealsPerDay,
    profileId: 'user-activity'
  });
  const cookingPowerNoTriggers = cookingPowerWeeklyScenario({ triggerMeanPerMeal: 0 });
  const cookingPowerOrdinary = cookingPowerWeeklyScenario({ triggerMeanPerMeal: 0.7 });
  const cookingPowerMinus = cookingPowerWeeklyScenario({
    triggerMeanPerMeal: 0.7,
    skillVariant: 'minus'
  });
  const cookingPowerMinusStandalone = cookingPowerWeeklyScenario({
    triggerMeanPerMeal: 0.7,
    skillVariant: 'minus',
    partnerPresent: false
  });
  const cookingPowerGoodCamp = cookingPowerWeeklyScenario({
    triggerMeanPerMeal: 0.7,
    goodCamp: true
  });
  const cookingPowerUserActivityDefault = cookingPowerWeeklyScenario({
    triggerMeanPerMeal: 0.7,
    profileId: 'user-activity'
  });
  const cookingPowerUserActivityNoCamp = cookingPowerWeeklyScenario({
    triggerMeanPerMeal: 0.7,
    profileId: 'user-activity',
    goodCamp: false
  });
  const cookingPowerUserActivityNoFiller = cookingPowerWeeklyScenario({
    triggerMeanPerMeal: 0.7,
    profileId: 'user-activity',
    ingredientAvailability: 0
  });
  const assertions = [
    ['最佳数量分', ingredientById.fast.ingredientCountScore, 100],
    ['同产量低能量食材的数量分', ingredientById.light.ingredientCountScore, 100],
    ['慢速同食材数量分', ingredientById.slow.ingredientCountScore, 64],
    ['生产分按60/40合成', ingredientById.light.productionScore, 79.5],
    ['生产模块只贡献80分', ingredientById.fast.productionContribution, 80],
    ['8小时持有线性换算', ingredientById.fast.inventoryScore, 31.2],
    ['达到8小时封顶', ingredientById.roomy.inventoryContribution, 10],
    ['已确认90分小计', ingredientById.fast.confirmedSubtotal, 83.1],
    ['触发效率按概率除以间隔', ingredientById.slow.skillTriggerEfficiencyScore, 40],
    ['二阶自然主技能等级得分', ingredientById.slow.naturalMainSkillLevelScore, 50],
    ['食材获取类型适配', ingredientById.fast.mainSkillTypeFitScore, 90],
    ['非技能手主技能内部50/40/10合成', ingredientById.fast.mainSkillScore, 95],
    ['食材手主技能贡献只占10分', ingredientById.fast.mainSkillContribution, 9.5],
    ['完整食材手种族分', ingredientById.fast.speciesScore, 92.6],
    ['食材手未知主技能保持待定', ingredientById.roomy.speciesScore, null],
    ['Lv.70龙树果基础能量', berryStrengthAtLevel(15), 192],
    ['树果手最佳生产得分', berryById['berry-fast'].productionScore, 100],
    ['树果手生产贡献占90分', berryById['berry-fast'].productionContribution, 90],
    ['树果手慢速生产得分', berryById['berry-slow'].productionScore, 80],
    ['树果手触发效率按概率除以间隔', berryById['berry-slow'].skillTriggerEfficiencyScore, 40],
    ['树果手主技能内部50/40/10合成', berryById['berry-fast'].mainSkillScore, 95],
    ['完整树果手种族分', berryById['berry-fast'].speciesScore, 99.5],
    ['慢速树果手种族分', berryById['berry-slow'].speciesScore, 77.1],
    ['树果手未知主技能保持待定', berryById['berry-unknown'].speciesScore, null],
    ['技能手旧种族权重合计', round(Object.values(SKILL_SPECIALIST_LEGACY_SPECIES_WEIGHTS).reduce((sum, value) => sum + value, 0), 4), 1],
    ['技能手最终种族权重合计', round(Object.values(SKILL_SPECIALIST_FINAL_SPECIES_WEIGHTS).reduce((sum, value) => sum + value, 0), 4), 1],
    ['技能手主技能内部权重合计', round(Object.values(SKILL_SPECIALIST_MAIN_WEIGHTS).reduce((sum, value) => sum + value, 0), 4), 1],
    ['技能手普通生产最佳得分', skillOrdinaryById['skill-fast'].ordinaryProductionScore, 100],
    ['技能手普通生产贡献占10分', skillOrdinaryById['skill-fast'].ordinaryProductionContribution, 10],
    ['技能手普通生产按帮忙间隔反比', skillOrdinaryById['skill-slow'].ordinaryProductionScore, 80],
    ['位置成本取标准四主产能手中的第4只', slotBenchmark.replacedProducer.nameZh, '产能4'],
    ['额外技能位扣除第4主产能手', slotEconomicsExtra.slotCostAppliedOutputIndex, slotEconomicsExtra.slotBenchmarkOutputIndex],
    ['额外技能位净指数只计一次自身普通生产', slotEconomicsExtra.netOutputIndexAsExtraSkill, round(100 + slotEconomicsExtra.ordinaryOutputIndex - slotEconomicsExtra.slotBenchmarkOutputIndex, 1)],
    ['正式回复位位置成本为0', slotEconomicsHealer.slotCostAppliedOutputIndex, 0],
    ['正式回复位采用含自身普通生产的净指数', slotEconomicsHealer.slotAdjustedOutputIndex, slotEconomicsHealer.grossCombinedOutputIndex],
    ['条件回复位保留双情景而不擅自选边', slotEconomicsConditional.slotAdjustedOutputIndex, null],
    ['技能手主技能综合70/10/10/10合成', skillSpecialistMainComprehensiveScore({ theoreticalOutputScore: 100, stabilityScore: 80, operationScore: 60, versatilityScore: 40 }), 88],
    ['负净产出在最终归一化中记0分', skillSpecialistNormalizedOutputScore(-20, 400), 0],
    ['最高净产出在最终归一化中记100分', skillSpecialistNormalizedOutputScore(400, 400), 100],
    ['技能手最终种族分95/5合成', skillSpecialistSpeciesScore({ mainSkillComprehensiveScore: 88, naturalMainSkillLevelScore: 100 }), 88.6],
    ['旧技能手种族分仅保留诊断', legacySkillSpecialistSpeciesScore({ mainSkillComprehensiveScore: 88, ordinaryProductionScore: 80, naturalMainSkillLevelScore: 100 }), 87.8],
    ['活力全体疗愈单次实用价值锚点', STANDARD_E4E.singleUsePracticalValue, 100],
    ['活力全体疗愈稳定性锚点', STANDARD_E4E.stabilityScore, 100],
    ['活力全体疗愈操作上限锚点', STANDARD_E4E.operationCeilingScore, 80],
    ['活力全体疗愈泛用性锚点', STANDARD_E4E.versatilityScore, 100],
    ['固定回复队伍只计4个主产能位', STANDARD_HEALER_TEAM.productiveTargetCount, 4],
    ['随机单目标命中主产能位比例', STANDARD_RANDOM_PRODUCTIVE_TARGET_SHARE, 0.8],
    ['治疗手自身回复不计团队回复价值', productiveHealingPracticalValue(18.1, 0), 0],
    ['4%技能率、50次天井的有效概率', round(effectiveSkillProbability(0.04, 50) * 100, 2), 4.6],
    ['技能手每次帮忙物品概率合计', round(skillFixtureItemProbability, 4), 1],
    ['两次储存使8小时留存不超过连续收取', skillFixtureMetrics.retentionRatio <= 1, true],
    ['技能手最多储存两次主技能', maximumStoredSkillTriggers(skillFixture), 2],
    ['树果／食材手连续不触发天井为78次帮忙', skillPityCeiling(ingredientFixture[0]), 78],
    ['树果／食材手最多储存一次主技能', maximumStoredSkillTriggers(ingredientFixture[0]), 1],
    ['普通活力全体疗愈操作分不超过80', skillFixtureMetrics.operationScore <= STANDARD_E4E.operationCeilingScore, true],
    ['树果汁每次触发期望额外回复', berryJuice.expectedBonusRecovery, 5],
    ['树果汁单次实用价值', round(berryJuice.singleUsePracticalValue, 1), 106.9],
    ['树果汁稳定性', round(berryJuice.stabilityScore, 1), 93.5],
    ['树果汁理想操作上限', round(berryJuice.operationCeilingScore, 1), 81.3],
    ['活力疗愈S Lv.6回复量', energizingCheer.totalHealing, 44],
    ['活力疗愈S单次价值', round(energizingCheer.singleUsePracticalValue, 1), 48.6],
    ['活力疗愈S随机单目标稳定性', round(energizingCheer.stabilityScore, 1), 80],
    ['活力填充S Lv.6回复量', chargeEnergyS.totalHealing, 43.4],
    ['活力填充S单次价值', round(chargeEnergyS.singleUsePracticalValue, 1), 48],
    ['月光45%大成功的期望额外回复', round(moonlight.expectedBonusHealing, 2), 10.26],
    ['月光单次团队回复价值', round(moonlight.singleUsePracticalValue, 1), 11.3],
    ['月光有效回复主产能位的概率', round(moonlight.stabilityScore, 1), 36],
    ['蹭蹭脸颊Lv.6奖励抽选次数', nuzzle.bonusDraws, 7],
    ['蹭蹭脸颊4%目标技能率的奖励概率', round(nuzzle.bonusProbability * 100, 1), 24.9],
    ['蹭蹭脸颊单次价值', round(nuzzle.singleUsePracticalValue, 1), 59.1],
    ['蹭蹭脸颊稳定性', round(nuzzle.stabilityScore, 1), 52.4],
    ['治愈波动无拉帝欧斯总帮忙次数', healPulseSolo.totalHelps, 8],
    ['治愈波动有拉帝欧斯总帮忙次数', healPulsePair.totalHelps, 14],
    ['治愈波动无拉帝欧斯有效主产能帮忙数', round(healPulseSolo.productiveHelps, 1), 6.4],
    ['治愈波动有拉帝欧斯有效主产能帮忙数', round(healPulsePair.productiveHelps, 1), 11.2],
    ['治愈波动无拉帝欧斯回复手帮忙数', round(healPulseSolo.healerHelps, 1), 1.6],
    ['治愈波动有拉帝欧斯回复手帮忙数', round(healPulsePair.healerHelps, 1), 2.8],
    ['治愈波动无拉帝欧斯单次价值', round(healPulseSolo.singleUsePracticalValue, 1), 91.7],
    ['治愈波动有拉帝欧斯单次价值', round(healPulsePair.singleUsePracticalValue, 1), 124],
    ['治愈波动拉帝欧斯依赖泛用性', round(healPulsePair.versatilityScore, 1), 73.9],
    ['帮手支援S Lv.7额外帮忙数', helpingSupport.helps, 12],
    ['帮手支援S随机目标平均单帮能量', helpingSupport.averageTargetEnergyPerHelp, 400],
    ['帮手支援S期望单次能量', helpingSupport.expectedEnergyPerUse, 4800],
    ['帮手支援S单次价值', round(helpingSupport.singleUsePracticalValue, 1), 57.4],
    ['帮手支援S随机目标稳定性', round(helpingSupport.stabilityScore, 1), 50],
    ['帮手支援S队伍泛用性', round(helpingSupport.versatilityScore, 1), 80],
    ['帮手加速Lv.6四种同属性每人帮忙数', helperBoost.helpsPerHelper, 9],
    ['帮手加速全队总帮忙数', helperBoost.totalHelps, 45],
    ['帮手加速期望单次能量', helperBoost.expectedEnergyPerUse, 13500],
    ['帮手加速单次价值', round(helperBoost.singleUsePracticalValue, 1), 161.4],
    ['帮手加速同属性依赖泛用性', round(helperBoost.versatilityScore, 1), 55.6],
    ['树果骤增Lv.6总树果数', berryBurst.totalBerryCount, 50],
    ['树果骤增期望单次能量', berryBurst.expectedEnergyPerUse, 11000],
    ['树果骤增单次价值', round(berryBurst.singleUsePracticalValue, 1), 131.5],
    ['树果骤增队伍独立性', round(berryBurst.teamIndependenceScore, 1), 91.7],
    ['树果骤增泛用性', round(berryBurst.versatilityScore, 1), 70.8],
    ['流星群Lv.6五种龙加拉帝亚斯自身树果数', meteorShower.selfBerryCount, 68],
    ['流星群Lv.6总树果数', meteorShower.totalBerryCount, 88],
    ['流星群队伍独立性', round(meteorShower.teamIndependenceScore, 1), 67.7],
    ['流星群泛用性', round(meteorShower.versatilityScore, 1), 58.9],
    ['固定能量填充S Lv.7基础能量', energyChargeSFixed.baseEnergy, 3212],
    ['固定能量填充S场地加成60%后能量', energyChargeSFixed.actualEnergy, 5140],
    ['固定能量填充S单次价值', round(energyChargeSFixed.singleUsePracticalValue, 1), 38.4],
    ['随机能量填充S Lv.7结果数', energyChargeSRandom.outcomeCount, 151],
    ['随机能量填充S Lv.7期望能量', round(energyChargeSRandom.expectedBaseEnergy, 1), 4015.5],
    ['随机能量填充S场地加成60%后期望能量', round(energyChargeSRandom.expectedActualEnergy, 1), 6424.5],
    ['随机能量填充S单次价值', round(energyChargeSRandom.singleUsePracticalValue, 1), 48],
    ['随机能量填充S稳定性', round(energyChargeSRandom.stabilityScore, 1), 40],
    ['能量填充M Lv.7基础能量', energyChargeM.baseEnergy, 6858],
    ['能量填充M场地加成60%后能量', energyChargeM.actualEnergy, 10973],
    ['能量填充M单次价值锚点', ENERGY_CHARGE_M.singleUsePracticalValue, 82],
    ['能量填充M稳定性锚点', ENERGY_CHARGE_M.stabilityScore, 100],
    ['能量填充M操作上限锚点', ENERGY_CHARGE_M.operationCeilingScore, 100],
    ['能量填充M泛用性锚点', ENERGY_CHARGE_M.versatilityScore, 100],
    ['料理成功S Lv.6每次增加概率', TASTY_CHANCE_S.bonusPctByLevel[6], 10],
    ['料理成功S累计上限', TASTY_CHANCE_S.maximumAccumulatedBonusPct, 70],
    ['成熟食谱通用情景平均餐能', round(tastyMatureProfile.averageMealEnergy, 1), 54255.9],
    ['个人活动周15餐1.78平均餐能', round(tastyActivityProfile.averageMealEnergy, 1), 62306.3],
    ['个人活动周无技能期望周料理能量', round(tastyNoTriggers.noSkillExpectedWeeklyEnergy, 1), 1532734.8],
    ['零触发不会增加料理能量', round(tastyNoTriggers.incrementalWeeklyEnergy, 6), 0],
    ['咚咚鼠活动周标准触发周增能', round(tastyDedenneActivity.incrementalWeeklyEnergy, 1), 222402.9],
    ['咚咚鼠活动周标准触发提升比例', round(tastyDedenneActivity.incrementalPct, 2), 14.51],
    ['料理成功S周内至少一次兑现稳定性', round(tastyDedenneActivity.stabilityScore, 1), 98.9],
    ['料理强化S Lv.7扩锅量', COOKING_POWER_UP.ordinaryPotSlotsByLevel[7], 31],
    ['负电Lv.7扩锅量', COOKING_POWER_UP.minusPotSlotsByLevel[7], 24],
    ['负电Lv.7随机回复量', COOKING_POWER_UP.minusRecoveryByLevel[7], 35],
    ['料理强化累计扩锅上限', COOKING_POWER_UP.maximumAccumulatedPotSlots, 200],
    ['1.78组食谱数量', COOKING_POWER_UP.recipeGroups[178].recipes.length, 6],
    ['1.78组最低容量门槛', Math.min(...COOKING_POWER_UP.recipeGroups[178].recipes.map(recipe => recipe.ingredientCount)), 103],
    ['1.78组最高容量门槛', Math.max(...COOKING_POWER_UP.recipeGroups[178].recipes.map(recipe => recipe.ingredientCount)), 115],
    ['料理强化零触发不增加料理能量', round(cookingPowerNoTriggers.incrementalWeeklyEnergy, 6), 0],
    ['普通料理强化标准0.7每餐周增能', round(cookingPowerOrdinary.incrementalWeeklyEnergy, 1), 194783],
    ['普通料理强化拆分相加等于总周增能', round(cookingPowerOrdinary.fillerOnlyIncrementalWeeklyEnergy + cookingPowerOrdinary.breakpointIncrementalWeeklyEnergy, 1), round(cookingPowerOrdinary.incrementalWeeklyEnergy, 1)],
    ['负电有搭档回复理论指数', round(cookingPowerMinus.recoveryOutputIndex, 1), 81.2],
    ['负电无搭档没有回复理论指数', cookingPowerMinusStandalone.recoveryOutputIndex, 0],
    ['负电有搭档理论指数高于单独使用', cookingPowerMinus.theoreticalOutputIndex > cookingPowerMinusStandalone.theoreticalOutputIndex, true],
    ['好露营81格已跨过全部1.78门槛', round(cookingPowerGoodCamp.breakpointIncrementalWeeklyEnergy, 6), 0],
    ['个人活动周默认使用好露营券', cookingPowerUserActivityDefault.profile.goodCamp, true],
    ['个人活动周好露营券使跨档收益归零', round(cookingPowerUserActivityDefault.breakpointIncrementalWeeklyEnergy, 6), 0],
    ['个人活动周可显式关闭好露营券', cookingPowerUserActivityNoCamp.profile.goodCamp, false],
    ['关闭好露营券后恢复跨档收益', cookingPowerUserActivityNoCamp.breakpointIncrementalWeeklyEnergy > 0, true],
    ['没有额外食材时料理强化周增能归零', round(cookingPowerUserActivityNoFiller.incrementalWeeklyEnergy, 6), 0],
    ['梦之碎片中性单位价值', round(dreamShardUnitPracticalValue(), 4), 0.0383],
    ['固定梦碎Lv.8数量', dreamShardFixed.expectedDreamShards, 2500],
    ['固定梦碎Lv.8单次价值', round(dreamShardFixed.singleUsePracticalValue, 1), 95.8],
    ['随机梦碎Lv.8结果数', dreamShardRandom.outcomeCount, 151],
    ['随机梦碎Lv.8期望数量', dreamShardRandom.expectedDreamShards, 2875],
    ['随机梦碎Lv.8单次价值', round(dreamShardRandom.singleUsePracticalValue, 1), 110.2],
    ['随机梦碎Lv.8稳定性', round(dreamShardRandom.stabilityScore, 1), 40],
    ['波导弹Lv.8直接能量', auraSphere.directEnergyPerUse, 2042],
    ['波导弹Lv.8单次总价值', round(auraSphere.singleUsePracticalValue, 1), 120.2],
    ['波导弹紧缺情景只放大碎片后的总价值', round(auraSphereScarce.singleUsePracticalValue, 1), 168.1],
    ['波导弹紧缺情景不放大直接能量', round(auraSphereScarce.directEnergyPracticalValue, 1), 24.4],
    ['蓄力25%吐出概率的期望周期触发数', round(stockpile.expectedTriggersPerCycle, 3), 3.831],
    ['蓄力Lv.7长期每触发期望能量', round(stockpile.expectedBaseEnergyPerTrigger, 1), 4948],
    ['蓄力Lv.7单次价值', round(stockpile.singleUsePracticalValue, 1), 59.2],
    ['蓄力最差完整周期稳定性', round(stockpile.stabilityScore, 1), 75.8],
    ['蓄力达到10层的周期概率', round(stockpile.probabilityOfTenStockpiles * 100, 1), 5.6],
    ['新月祈祷1种超能系的总树果数', CRESCENT_PRAYER.berryCountsByDistinctPsychicSpecies[1].total, 29],
    ['新月祈祷5种超能系的总树果数', CRESCENT_PRAYER.berryCountsByDistinctPsychicSpecies[5].total, 68],
    ['新月祈祷Lv.6全队总回复', crescentPrayer.totalHealing, 55],
    ['新月祈祷Lv.6有效主产能位回复', crescentPrayer.productiveHealing, 44],
    ['新月祈祷回复等价指数', round(crescentPrayer.healingEquivalentIndex, 1), 60.8],
    ['新月祈祷3种超能系总树果数', crescentPrayer.totalBerryCount, 46],
    ['新月祈祷Lv.70玛果非喜爱情景能量', crescentPrayer.totalBerryEnergy, 6578],
    ['新月祈祷3种超能、50%喜爱树果单次价值', round(crescentPrayerStandard.singleUsePracticalValue, 1), 178.8],
    ['新月祈祷3种超能操作上限', round(crescentPrayerStandard.operationCeilingScore, 1), 93.2],
    ['新月祈祷泛用性', round(crescentPrayerVersatilityScore(), 1), 60.7],
    ['噩梦Lv.7基础能量', nightmare.baseEnergy, 18515],
    ['噩梦正面单次价值', round(nightmare.positivePracticalValue, 1), 221.4],
    ['噩梦每只非恶属性队友代价', round(nightmare.penaltyPerNonDarkTeammate, 1), 13.3],
    ['噩梦2只非恶属性队友净单次价值', round(nightmare.netSingleUsePracticalValue, 1), 194.9],
    ['噩梦泛用性', round(nightmare.versatilityScore, 1), 76],
    ['食材技能Lv.1食谱加权系数', round(INGREDIENT_SKILL_COMMON.ingredientWeightedLv1RecipeMultiplier, 4), 1.4718],
    ['食材获取S Lv.7食材数量', INGREDIENT_MAGNET_S.countByLevel[7], 24],
    ['食材获取S全食材池基础能量', round(ingredientMagnet.expectedBaseIngredientEnergy, 1), 3474.9],
    ['食材获取S食谱折算单次价值', round(ingredientMagnet.singleUsePracticalValue, 1), 61.2],
    ['食材获取S三种最低食材稳定性', round(ingredientMagnet.stabilityScore, 1), 66.3],
    ['食材精选S Lv.7食材数量', INGREDIENT_DRAW_S.countByLevel[7], 18],
    ['穿山王食材精选池基础能量', round(ingredientDraw.expectedBaseIngredientEnergy, 1), 3084],
    ['穿山王食材精选稳定性', round(ingredientDraw.stabilityScore, 1), 72.4],
    ['正电有搭档追加咖啡数量', plusIngredientMagnet.additionalIngredientCount, 12],
    ['正电有搭档单次价值', round(plusIngredientMagnet.singleUsePracticalValue, 1), 78.2],
    ['正电有搭档条件泛用性', round(plusIngredientMagnet.versatilityScore, 1), 58.7],
    ['正电无搭档单次价值', round(plusIngredientMagnetStandalone.singleUsePracticalValue, 1), 45.9],
    ['正电无搭档泛用性', round(plusIngredientMagnetStandalone.versatilityScore, 1), 100],
    ['超幸运食材结果概率', round(superLuckIngredientDraw.ingredientOutcomeProbability * 100, 1), 84.2],
    ['超幸运食材部分单次价值', round(superLuckIngredientDraw.ingredientPracticalValue, 1), 34.9],
    ['超幸运期望梦之碎片', round(superLuckIngredientDraw.expectedDreamShardsPerUse, 1), 1067.2],
    ['超幸运梦碎部分单次价值', round(superLuckIngredientDraw.dreamShardPracticalValue, 1), 40.9],
    ['超幸运完整单次价值', round(superLuckIngredientDraw.singleUsePracticalValue, 1), 75.8],
    ['超幸运完整稳定性', round(superLuckIngredientDraw.stabilityScore, 1), 41.8],
    ['超幸运结果概率仍为暂定', superLuckIngredientDraw.scoringStatus, 'provisional-outcome-probabilities'],
    ['怪力钳Lv.7标准食材数量', hyperCutterIngredientDraw.ingredientCount, 18],
    ['怪力钳大成功率样本为53/328', round(hyperCutterIngredientDraw.largeSuccessProbability * 100, 2), 16.16],
    ['怪力钳样本大成功率仍为暂定', hyperCutterIngredientDraw.scoringStatus, 'confirmed-effects-provisional-53-of-328-large-success-rate'],
    ['礼物Lv.7标准食材数量', presentIngredientMagnet.ingredientCount, 17],
    ['礼物未给糖果概率时完整价值保持待定', presentIngredientMagnet.completeSingleUsePracticalValue, null],
    ['礼物自定义20%糖果概率的糖果价值', presentIngredientMagnetWithCandy.candyPracticalValue, 8],
    ['料理辅助Lv.7食材数量', cookingAssistStandard.ingredientCount, 24],
    ['料理辅助Lv.7每次大成功加成', cookingAssistStandard.bonusPctPerTrigger, 5],
    ['料理辅助零触发的总指数为0', cookingAssistNoTriggers.theoreticalOutputIndex, 0],
    ['技能复制默认四目标等效单次价值', round(skillCopyDefault.singleUsePracticalValue, 1), 65.8],
    ['技能复制不可复制回退值使用Lv.6能量填充S', round(skillCopyDefault.fallbackPracticalValue, 1), 24.7],
    ['技能复制对象外技能从抽选池移除', skillCopyWithExcluded.selectableTargetCount, 3],
    ['技能复制本身不可复制技能仍以回退参与抽选', skillCopyWithFallback.selectableTargetCount, 4],
    ['技能复制回退目标采用能量填充S价值', round(skillCopyWithFallback.targets[3].effectivePracticalValue, 1), 24.7],
    ['挥指结果池正好25项', METRONOME.outcomeIds.length, 25],
    ['挥指结果池没有重复项', new Set(METRONOME.outcomeIds).size, 25],
    ['十项全能可选主技能正好12项', ALL_MIGHTY.selectableSkillIds.length, 12],
    ['十项全能Lv.8可能取得4颗糖果', ALL_MIGHTY.possibleCandyByLevel[8], 4],
    ['当前主技能模型覆盖35个有效ID', CURRENT_MAIN_SKILL_MODEL_IDS.length, 35],
    ['当前主技能模型ID没有重复', new Set(CURRENT_MAIN_SKILL_MODEL_IDS).size, 35]
  ];
  const failures = assertions.filter(([, actual, expected]) => actual !== expected);
  return { ok: failures.length === 0, assertions, failures };
}

function ingredientMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 保证食材A | 生产/80 | 持有/10 | 类型适配 | 触发效率 | 自然等级 | 主技能/10 | 种族分/100 |',
    '|---:|---|---|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.ingredientNameZh} | ${row.productionContribution.toFixed(1)} | ${row.inventoryContribution.toFixed(1)} | ${row.mainSkillTypeFitScore ?? '待定'} | ${row.skillTriggerEfficiencyScore.toFixed(1)} | ${row.naturalMainSkillLevelScore.toFixed(1)} | ${row.mainSkillContribution?.toFixed(1) ?? '待定'} | ${row.speciesScore?.toFixed(1) ?? '待定'} |`)
  ].join('\n');
}

function berryMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | Lv.70树果能量 | 生产/90 | 类型适配 | 触发效率 | 自然等级 | 主技能/10 | 种族分/100 |',
    '|---:|---|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.level70BerryStrength} | ${row.productionContribution.toFixed(1)} | ${row.mainSkillTypeFitScore ?? '待定'} | ${row.skillTriggerEfficiencyScore.toFixed(1)} | ${row.naturalMainSkillLevelScore.toFixed(1)} | ${row.mainSkillContribution?.toFixed(1) ?? '待定'} | ${row.speciesScore?.toFixed(1) ?? '待定'} |`)
  ].join('\n');
}

function skillSpecialistOrdinaryProductionMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | Lv.70间隔 | 树果能量/帮 | 食材能量/帮 | 普通能量/帮 | 普通能量/日 | 普通生产/100 | 种族贡献/10 |',
    '|---:|---|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.level70HelpIntervalSec}秒 | ${row.berryEnergyPerHelp.toFixed(2)} | ${row.ingredientEnergyPerHelp.toFixed(2)} | ${row.ordinaryBaseEnergyPerHelp.toFixed(2)} | ${row.ordinaryBaseEnergyPerDay.toFixed(1)} | ${row.ordinaryProductionScore.toFixed(1)} | ${row.ordinaryProductionContribution.toFixed(1)} |`)
  ].join('\n');
}

function skillSpecialistSlotEconomicsMarkdown(rows) {
  const roleLabel = role => ({
    [SKILL_SPECIALIST_SLOT_ROLES.HEALER]: '正式回复位',
    [SKILL_SPECIALIST_SLOT_ROLES.EXTRA_SKILL]: '额外技能位',
    [SKILL_SPECIALIST_SLOT_ROLES.CONDITIONAL_HEALER]: '条件回复位'
  })[role] ?? role;
  const value = number => Number.isFinite(number) ? number.toFixed(1) : '待定';
  return [
    '#### 位置成本审计',
    '',
    '| 宝可梦 | 位置角色 | 技能毛指数 | 自身普通指数 | 第4主产能手成本 | 额外技能位净指数 | 回复位净指数 | 当前采用净指数 |',
    '|---|---|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.nameZh} | ${roleLabel(row.slotRole)} | ${value(row.grossSkillOutputIndex)} | ${value(row.ordinaryOutputIndex)} | ${value(row.slotBenchmarkOutputIndex)} | ${value(row.netOutputIndexAsExtraSkill)} | ${value(row.netOutputIndexAsHealer)} | ${value(row.slotAdjustedOutputIndex)} |`),
    '',
    `基准：${rows[0]?.slotBenchmarkNameZh ?? '待定'}，${value(rows[0]?.slotBenchmarkEnergyPerDay)}基础能量／日。条件回复位在确认能否独立承担回复职责前不自动选择净指数。`
  ].join('\n');
}

function skillSpecialistSpeciesRankingMarkdown(rows) {
  const roleLabel = role => ({
    [SKILL_SPECIALIST_SLOT_ROLES.HEALER]: '正式回复位',
    [SKILL_SPECIALIST_SLOT_ROLES.EXTRA_SKILL]: '额外技能位'
  })[role] ?? role;
  const value = number => Number.isFinite(number) ? number.toFixed(1) : '—';
  const anchorRole = roleLabel(rows[0]?.outputNormalizationAnchorRole);
  return [
    '| 排名 | 宝可梦 | 主技能 | 评分位置 | 净产出分/100 | 稳定性 | 操作 | 泛用性 | 自然等级/5 | 种族分/100 | 若独立回复 |',
    '|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.speciesRank} | ${row.nameZh} | ${row.skillNameZh} | ${row.slotRole === SKILL_SPECIALIST_SLOT_ROLES.CONDITIONAL_HEALER ? '额外技能位（保守）' : roleLabel(row.speciesScoreRole)} | ${value(row.normalizedOutputScore)} | ${value(row.stabilityScore)} | ${value(row.operationScore)} | ${value(row.versatilityScore)} | ${value(row.naturalLevelContribution)} | ${value(row.speciesScore)} | ${value(row.conditionalHealerSpeciesScore)} |`),
    '',
    `净产出归一化上限：${rows[0]?.outputNormalizationAnchorNameZh ?? '待定'}（${anchorRole}）${value(rows[0]?.outputNormalizationMaximum)}。条件回复手在主排名中按仍需正式回复手的保守情景计分，并在最后一列保留其独立承担回复位的备选分。`
  ].join('\n');
}

function standardE4eMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 理论触发/日 | 8小时连续收取触发 | 8小时可领取触发 | 留存率 | 满仓概率 | 操作分/100 | 自然等级/5 |',
    '|---:|---|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.continuousEightHourTriggers.toFixed(3)} | ${row.storedEightHourTriggers.toFixed(3)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.fullInventoryProbabilityPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.naturalLevelContribution.toFixed(1)} |`)
  ].join('\n');
}

function berryJuiceMarkdown(rows) {
  return [
    '| 宝可梦 | 单次价值 | 理论触发/日 | 理论产出指数 | 稳定性 | 8小时留存率 | 满仓概率 | 操作分/100 | 泛用性 | 自然等级/5 |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.nameZh} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.fullInventoryProbabilityPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} | ${row.naturalLevelContribution.toFixed(1)} |`)
  ].join('\n');
}

function recoverySkillMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 回复类主技能 | 单次价值 | 理论触发/日 | 理论产出指数 | 稳定性 | 操作上限 | 8小时留存 | 操作分 | 泛用性 | 自然等级/5 |',
    '|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.skillNameZh} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.operationCeilingScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} | ${row.naturalLevelContribution.toFixed(1)} |`)
  ].join('\n');
}

function helpingSupportMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 标准队目标 | 帮忙/次 | 平均单帮能量 | 期望能量/次 | 单次价值 | 理论触发/日 | 理论产出指数 | 稳定性 | 8小时留存 | 操作分 | 泛用性 | 自然等级/5 |',
    '|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.targets.map(target => `${target.nameZh}(${target.role})`).join('、')} | ${row.helpsPerUse} | ${row.averageTargetEnergyPerHelp.toFixed(1)} | ${row.expectedEnergyPerUse} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} | ${row.naturalLevelContribution.toFixed(1)} |`)
  ].join('\n');
}

function helperBoostMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 标准队 | 同属性种类 | 每人帮忙 | 总帮忙 | 期望能量/次 | 单次价值 | 理论触发/日 | 能量/日 | 理论产出指数 | 稳定性 | 8小时留存 | 操作分 | 泛用性 |',
    '|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.targets.map(target => target.nameZh).join('、')} | ${row.distinctSpecies} | ${row.helpsPerHelper} | ${row.totalHelps} | ${row.expectedEnergyPerUse} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalBaseEnergyPerDay} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} |`)
  ].join('\n');
}

function berrySkillMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 树果类主技能 | Lv.6效果 | 标准队 | 期望能量/次 | 单次价值 | 理论触发/日 | 能量/日 | 理论产出指数 | 稳定性 | 8小时留存 | 操作分 | 泛用性 | 自然等级/5 |',
    '|---:|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.skillNameZh} | ${row.effectLabel} | ${row.targets.map(target => target.nameZh).join('、')} | ${row.expectedEnergyPerUse} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalBaseEnergyPerDay} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} | ${row.naturalLevelContribution.toFixed(1)} |`)
  ].join('\n');
}

function ingredientAcquisitionMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 食材类主技能 | 食材池／条件 | 食材基础能量/次 | 食材价值/次 | 梦碎价值/次 | 糖果价值/次 | 当前可计价值/次 | 理论触发/日 | 理论产出指数 | 稳定性 | 8小时留存 | 操作分 | 泛用性 | 状态 |',
    '|---:|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|',
    ...rows.map((row, index) => {
      const pool = row.ingredientPool.length > 4
        ? `已解锁${row.ingredientPool.length}种食材`
        : row.ingredientPool.map(ingredient => ingredient.nameZh).join('、');
      const condition = row.plusPartnerPresent === undefined
        ? pool
        : `${pool}；${row.plusPartnerPresent ? '已有正电／负电搭档' : '无搭档'}`;
      const status = ({
        'provisional-outcome-probabilities': '结果概率暂定',
        'confirmed-effects-provisional-53-of-328-large-success-rate': '大成功率暂用53/328',
        'confirmed-ingredient-component-pending-candy-probability-or-value': '糖果概率／价值待定',
        'confirmed-with-user-candy-conversion': '使用自定义糖果换算'
      })[row.scoringStatus] ?? '食材池概率暂定';
      return `| ${index + 1} | ${row.nameZh} | ${row.skillNameZh} | ${condition} | ${row.expectedBaseIngredientEnergyPerUse.toFixed(1)} | ${row.ingredientPracticalValue.toFixed(1)} | ${row.dreamShardPracticalValue.toFixed(1)} | ${row.candyPracticalValue?.toFixed(1) ?? '待定'} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} | ${status} |`;
    })
  ].join('\n');
}

function dreamShardMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 梦碎类主技能 | Lv.8碎片/次 | 直接能量/次 | 碎片价值/次 | 总价值/次 | 理论触发/日 | 碎片/日 | 当周能量/日 | 理论产出指数 | 稳定性 | 8小时留存 | 操作分 | 泛用性 |',
    '|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => {
      const shards = row.minimumDreamShardsPerUse === row.maximumDreamShardsPerUse
        ? row.expectedDreamShardsPerUse.toFixed(1)
        : `${row.minimumDreamShardsPerUse}–${row.maximumDreamShardsPerUse}（均${row.expectedDreamShardsPerUse.toFixed(1)}）`;
      return `| ${index + 1} | ${row.nameZh} | ${row.skillNameZh} | ${shards} | ${row.directEnergyPerUse} | ${row.dreamShardPracticalValue.toFixed(1)} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalDreamShardsPerDay.toFixed(1)} | ${row.theoreticalDirectEnergyPerDay.toFixed(0)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} |`;
    })
  ].join('\n');
}

function tastyChanceMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 情景 | 平均餐能 | 理论触发/日 | 周增能 | 周提升 | 等效价值/次 | 理论产出指数 | 周兑现率 | 8小时周增能 | 操作分 | 泛用性 |',
    '|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.cookingProfileNameZh} | ${row.averageMealEnergy.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.incrementalWeeklyEnergy} | ${row.incrementalPct.toFixed(2)}% | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)}% | ${row.eightHourIncrementalWeeklyEnergy} | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} |`)
  ].join('\n');
}

function cookingPowerMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 技能／条件 | 扩锅/次 | 回复/次 | 理论触发/日 | 纯填锅周增能 | 跨档周增能 | 总周增能 | 料理指数 | 回复指数 | 理论产出指数 | 稳定性 | 8小时周增能 | 操作分 | 泛用性 |',
    '|---:|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => {
      const condition = row.skillVariant === 'minus'
        ? `${row.skillNameZh}；${row.partnerPresent ? '有正电／负电搭档' : '无搭档'}`
        : row.skillNameZh;
      return `| ${index + 1} | ${row.nameZh} | ${condition} | +${row.potSlotsPerTrigger} | ${row.recoveryPerTrigger} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.fillerOnlyIncrementalWeeklyEnergy} | ${row.breakpointIncrementalWeeklyEnergy} | ${row.incrementalWeeklyEnergy} | ${row.cookingOutputIndex.toFixed(1)} | ${row.recoveryOutputIndex.toFixed(1)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourIncrementalWeeklyEnergy} | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} |`;
    })
  ].join('\n');
}

function cookingAssistMarkdown(rows) {
  return [
    '| 宝可梦 | 食材/次 | 大成功加成/次 | 理论触发/日 | 周可接受触发 | 食材/周 | 料理周增能 | 食材指数 | 料理指数 | 总指数 | 稳定性 | 操作分 | 泛用性 |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.nameZh} | ${row.ingredientCountPerAcceptedTrigger} | +${row.tastyBonusPctPerAcceptedTrigger}% | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.expectedAcceptedTriggersPerWeek.toFixed(2)} | ${row.expectedIngredientsPerWeek.toFixed(1)} | ${row.incrementalWeeklyCookingEnergy} | ${row.ingredientOutputIndex.toFixed(1)} | ${row.cookingOutputIndex.toFixed(1)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} |`)
  ].join('\n');
}

function metronomeMarkdown(rows) {
  return [
    '| 宝可梦 | 定位 | 结果池 | 单项概率 | 等效价值/次 | 最低结果价值 | 理论触发/日 | 理论产出指数 | 稳定性 | 操作分 | 泛用性 | 未折算资源 |',
    '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|',
    ...rows.map(row => `| ${row.nameZh} | ${row.specialty} | ${row.outcomeCount} | ${row.outcomeProbabilityPct.toFixed(2)}% | ${row.singleUsePracticalValue.toFixed(1)} | ${row.minimumOutcomePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} | ${row.excludedResourceComponents.length ? row.excludedResourceComponents.join('、') : '无'} |`)
  ].join('\n');
}

function skillCopyMarkdown(rows) {
  return [
    '| 宝可梦 | 技能 | 标准四目标 | 等效价值/次 | 最低结果价值 | 理论触发/日 | 理论产出指数 | 稳定性 | 操作分 | 队伍独立性 |',
    '|---|---|---|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.nameZh} | ${row.skillNameZh} | ${row.targets.map(target => target.mode === 'excluded' ? `${target.nameZh}:排除` : `${target.nameZh}:${target.effectivePracticalValue.toFixed(1)}${target.mode === 'fallback' ? '（回退）' : ''}`).join('、')} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.minimumOutcomePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} |`)
  ].join('\n');
}

function allMightyMarkdown(rows) {
  return [
    '| 宝可梦 | 选择技能 | 技能率 | 理论触发/日 | 单次价值 | 技能产出指数 | 糖果/次 | 完整指数 | 稳定性 | 操作分 | 泛用性 | 状态 |',
    '|---|---|---:|---:|---:|---:|---|---:|---:|---:|---:|---|',
    ...rows.map(row => {
      const candy = row.expectedCandyPerUse == null
        ? `${row.guaranteedCandyPerUse}～${row.possibleCandyPerUse}（概率待定）`
        : row.expectedCandyPerUse.toFixed(3);
      return `| ${row.nameZh} | ${row.selectedSkillNameZh} | ${row.selectedSkillRatePct.toFixed(2)}% | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalEffectOutputIndex.toFixed(1)} | ${candy} | ${row.completeTheoreticalOutputIndex?.toFixed(1) ?? '待定'} | ${row.stabilityScore.toFixed(1)} | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} | ${row.scoringStatus} |`;
    })
  ].join('\n');
}

function energyChargeSRandomMarkdown(rows) {
  return [
    '| 宝可梦 | Lv.7范围 | 期望能量/次 | 单次价值 | 理论触发/日 | 期望能量/日 | 理论产出指数 | 稳定性 | 8小时留存 | 操作分 | 泛用性 | 自然等级/5 |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.nameZh} | ${row.minimumEnergyPerUse}–${row.maximumEnergyPerUse} | ${row.expectedBaseEnergyPerUse.toFixed(1)} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalBaseEnergyPerDay} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} | ${row.naturalLevelContribution.toFixed(1)} |`)
  ].join('\n');
}

function stockpileMarkdown(rows) {
  return [
    '| 宝可梦 | 吐出率 | 期望周期触发 | 期望能量/触发 | 单次价值 | 理论触发/日 | 期望能量/日 | 理论产出指数 | 稳定性 | 8小时留存 | 操作分 | 泛用性 |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.nameZh} | ${row.spitUpProbabilityPct.toFixed(1)}% | ${row.expectedTriggersPerCycle.toFixed(3)} | ${row.expectedBaseEnergyPerTrigger.toFixed(1)} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalBaseEnergyPerDay} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} |`)
  ].join('\n');
}

function energyChargeMMarkdown(rows) {
  return [
    '| 排名 | 宝可梦 | 单次基础能量 | 理论触发/日 | 基础能量/日 | 理论产出指数 | 稳定性 | 8小时留存 | 满仓概率 | 操作分 | 泛用性 | 自然等级/5 |',
    '|---:|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map((row, index) => `| ${index + 1} | ${row.nameZh} | ${row.baseEnergyPerUse} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalBaseEnergyPerDay} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.fullInventoryProbabilityPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} | ${row.naturalLevelContribution.toFixed(1)} |`)
  ].join('\n');
}

function crescentPrayerMarkdown(rows) {
  return [
    '| 宝可梦 | 超能种类 | 总回复 | 树果数 | 树果能量 | 单次价值 | 理论触发/日 | 理论产出指数 | 8小时留存 | 操作上限 | 操作分 | 稳定性 | 泛用性 |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.nameZh} | ${row.distinctPsychicSpecies} | ${row.totalHealing.toFixed(1)} | ${row.totalBerryCount} | ${row.berryEnergyPerUse} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationCeilingScore.toFixed(1)} | ${row.operationScore.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} |`)
  ].join('\n');
}

function nightmareMarkdown(rows) {
  return [
    '| 宝可梦 | 非恶队友 | Lv.7能量 | 正面价值 | 活力代价 | 净单次价值 | 理论触发/日 | 理论产出指数 | 8小时留存 | 操作分 | 稳定性 | 泛用性 |',
    '|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|',
    ...rows.map(row => `| ${row.nameZh} | ${row.nonDarkTeammates} | ${row.baseEnergyPerUse} | ${row.positivePracticalValue.toFixed(1)} | -${row.energyPenaltyPracticalValue.toFixed(1)} | ${row.singleUsePracticalValue.toFixed(1)} | ${row.theoreticalTriggerIndexPerDay.toFixed(3)} | ${row.theoreticalOutputIndex.toFixed(1)} | ${row.eightHourRetentionPct.toFixed(1)}% | ${row.operationScore.toFixed(1)} | ${row.stabilityScore.toFixed(1)} | ${row.versatilityScore.toFixed(1)} |`)
  ].join('\n');
}

module.exports = Object.freeze({
  targetLevel: TARGET_LEVEL,
  unattendedHours: UNATTENDED_HOURS,
  averageEnergySpeedMultiplier: AVERAGE_ENERGY_SPEED_MULTIPLIER,
  ingredientSpeciesWeights: INGREDIENT_SPECIES_WEIGHTS,
  berrySpeciesWeights: BERRY_SPECIES_WEIGHTS,
  skillSpecialistLegacySpeciesWeights: SKILL_SPECIALIST_LEGACY_SPECIES_WEIGHTS,
  skillSpecialistFinalSpeciesWeights: SKILL_SPECIALIST_FINAL_SPECIES_WEIGHTS,
  skillSpecialistMainWeights: SKILL_SPECIALIST_MAIN_WEIGHTS,
  skillSpecialistOrdinaryFavoriteShare: SKILL_SPECIALIST_ORDINARY_FAVORITE_SHARE,
  skillSpecialistStandardProducerCount: SKILL_SPECIALIST_STANDARD_PRODUCER_COUNT,
  skillSpecialistSlotRoles: SKILL_SPECIALIST_SLOT_ROLES,
  skillPitySeconds: SKILL_PITY_SECONDS,
  maxStoredSkillTriggers: MAX_STORED_SKILL_TRIGGERS,
  standardE4e: STANDARD_E4E,
  standardHealerTeam: STANDARD_HEALER_TEAM,
  berryJuice: BERRY_JUICE,
  energizingCheer: ENERGIZING_CHEER,
  chargeEnergyS: CHARGE_ENERGY_S,
  moonlight: MOONLIGHT,
  nuzzle: NUZZLE,
  healPulse: HEAL_PULSE,
  helpingSupportS: HELPING_SUPPORT_S,
  helperBoost: HELPER_BOOST,
  berryBurst: BERRY_BURST,
  disguiseBerryBurst: DISGUISE_BERRY_BURST,
  meteorShower: METEOR_SHOWER,
  energyChargeSFixed: ENERGY_CHARGE_S_FIXED,
  energyChargeSRandom: ENERGY_CHARGE_S_RANDOM,
  energyChargeM: ENERGY_CHARGE_M,
  tastyChanceS: TASTY_CHANCE_S,
  cookingPowerUp: COOKING_POWER_UP,
  dreamShardSkill: DREAM_SHARD_SKILL,
  auraSphere: AURA_SPHERE,
  stockpile: STOCKPILE,
  nightmare: NIGHTMARE,
  crescentPrayer: CRESCENT_PRAYER,
  ingredientSkillCommon: INGREDIENT_SKILL_COMMON,
  ingredientMagnetS: INGREDIENT_MAGNET_S,
  ingredientDrawS: INGREDIENT_DRAW_S,
  plusIngredientMagnetS: PLUS_INGREDIENT_MAGNET_S,
  superLuckIngredientDrawS: SUPER_LUCK_INGREDIENT_DRAW_S,
  hyperCutterIngredientDrawS: HYPER_CUTTER_INGREDIENT_DRAW_S,
  presentIngredientMagnetS: PRESENT_INGREDIENT_MAGNET_S,
  cookingAssistS: COOKING_ASSIST_S,
  metronome: METRONOME,
  skillCopy: SKILL_COPY,
  allMighty: ALL_MIGHTY,
  currentMainSkillModelIds: CURRENT_MAIN_SKILL_MODEL_IDS,
  productionWeights: PRODUCTION_WEIGHTS,
  mainSkillWeights: MAIN_SKILL_WEIGHTS,
  ingredientMainSkillTypeFitScores: INGREDIENT_MAIN_SKILL_TYPE_FIT,
  berryMainSkillTypeFitScores: BERRY_MAIN_SKILL_TYPE_FIT,
  berryBaseStrength: BERRY_BASE_STRENGTH,
  ingredientStrength: INGREDIENT_STRENGTH,
  helpIntervalAtLevel,
  aaaAverageQuantity,
  inventoryMetrics,
  skillPityCeiling,
  maximumStoredSkillTriggers,
  effectiveSkillProbability,
  ingredientQuantityDistribution,
  itemCountDistributionPerHelp,
  unattendedSkillStorageMetrics,
  berryJuiceAnchor,
  berryJuiceRows,
  productiveHealingPracticalValue,
  selfRecoveryPracticalValue,
  energizingCheerEffect,
  energizingCheerRows,
  chargeEnergySEffect,
  moonlightEffect,
  moonlightRows,
  nuzzleScenario,
  nuzzleRows,
  expectedIngredientBaseEnergyPerHelp,
  immediateHelpBaseEnergy,
  standardImmediateHelpBenchmark,
  helpingSupportEffect,
  standardHelpingSupportTeam,
  helpingSupportRows,
  berryEnergyPerBerry,
  helperBoostEffect,
  standardHelperBoostTeam,
  helperBoostRows,
  berryBurstEffect,
  standardBerrySkillTeam,
  berryBurstRows,
  disguiseBerryBurstRows,
  meteorShowerEffect,
  standardMeteorShowerTeam,
  meteorShowerRows,
  berrySkillRows,
  healPulseScenario,
  healPulseRows,
  recoverySkillRows,
  energyChargeSFixedEffect,
  energyChargeSRandomEffect,
  energyChargeSRandomRows,
  energyChargeMEffect,
  directEnergyPracticalValue,
  tastyChanceMealProfile,
  poissonCappedCounts,
  advanceTastyChanceTriggers,
  tastyChanceWeeklyScenario,
  tastyChanceRows,
  cookingPowerMealProfile,
  cookingPowerRecipeEnergy,
  cookingPowerMealEnergy,
  cookingPowerMealExpectation,
  cookingPowerWeeklyScenario,
  cookingPowerRows,
  ingredientSkillPracticalValue,
  dreamShardUnitPracticalValue,
  dreamShardPracticalValue,
  dreamShardFixedEffect,
  dreamShardRandomEffect,
  auraSphereEffect,
  dreamShardRows,
  randomIngredientMagnetEffect,
  selectedIngredientEffect,
  plusIngredientMagnetEffect,
  superLuckIngredientDrawEffect,
  hyperCutterIngredientDrawEffect,
  presentIngredientMagnetEffect,
  ingredientAcquisitionRows,
  cookingAssistWeeklyScenario,
  cookingAssistRows,
  metronomeScenario,
  metronomeRows,
  skillCopyScenario,
  skillCopyRows,
  allMightyRows,
  energyChargeMRows,
  stockpileScenario,
  stockpileRows,
  nightmareScenario,
  nightmareRows,
  crescentPrayerScenario,
  crescentPrayerVersatilityScore,
  crescentPrayerRows,
  standardE4eRows,
  mainSkillModelCoverage,
  mainSkillTypeFit,
  berryMainSkillTypeFit,
  berryStrengthAtLevel,
  skillSpecialistOrdinaryProductionRows,
  attachSkillSpecialistOrdinaryProduction,
  standardPrimaryProducerSlotBenchmark,
  defaultSkillSpecialistSlotRole,
  attachSkillSpecialistSlotEconomics,
  skillSpecialistMainComprehensiveScore,
  skillSpecialistNormalizedOutputScore,
  legacySkillSpecialistSpeciesScore,
  skillSpecialistSpeciesScore,
  skillSpecialistSpeciesRankingRows,
  ingredientProductionRows,
  berryProductionRows,
  selfTest
});

if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.includes('--self-test')) {
    const result = selfTest();
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    if (!result.ok) process.exitCode = 1;
  } else {
    const option = name => {
      const index = args.indexOf(name);
      return index >= 0 ? args[index + 1] : undefined;
    };
    const dataPath = option('--data');
    if (!dataPath) throw new Error('需要 --data <raenonx-species.json>');
    const format = option('--format') || 'markdown';
    const specialty = option('--specialty') || 'ingredient';
    if (!['ingredient', 'berry', 'skill-species', 'skill-production', 'skill-recovery', 'skill-healer', 'skill-berry-juice', 'skill-helping-support', 'skill-helper-boost', 'skill-berry', 'skill-ingredient-acquisition', 'skill-dream-shard', 'skill-tasty-chance', 'skill-cooking-power', 'skill-cooking-assist', 'skill-metronome', 'skill-copy', 'skill-all-mighty', 'skill-energy-charge-s-random', 'skill-energy-charge-m', 'skill-stockpile', 'skill-crescent-prayer', 'skill-nightmare'].includes(specialty)) {
      throw new Error('未知 --specialty；请使用脚本已实现的 ingredient、berry 或 skill-* 模式');
    }
    const showAll = args.includes('--all');
    const input = JSON.parse(fs.readFileSync(path.resolve(dataPath), 'utf8'));
    const psychicSpecies = Number(option('--psychic-species') || 3);
    const favoriteBerry = args.includes('--favorite-berry');
    const favoriteShareOption = option('--favorite-share');
    const favoriteBerryShare = favoriteBerry
      ? 1
      : favoriteShareOption === undefined
        ? 0.5
        : Number(favoriteShareOption);
    const slotRoleOption = option('--slot-role');
    if (
      slotRoleOption !== undefined
      && !Object.values(SKILL_SPECIALIST_SLOT_ROLES).includes(slotRoleOption)
    ) {
      throw new Error('需要 --slot-role healer、extra-skill 或 conditional-healer');
    }
    const slotBenchmarkEnergyOption = option('--slot-benchmark-energy');
    const slotBenchmarkNameOption = option('--slot-benchmark-name');
    const nonDarkTeammates = Number(option('--non-dark-teammates') || 2);
    const fieldBonusPct = Number(option('--field-bonus') || 0);
    const dreamShardDemandCoefficient = Number(
      option('--dream-shard-demand') ?? DREAM_SHARD_SKILL.neutralDemandCoefficient
    );
    const cookingProfileId = option('--cooking-profile') || 'mature-standard';
    if (args.includes('--good-camp') && args.includes('--no-good-camp')) {
      throw new Error('--good-camp 与 --no-good-camp 不能同时使用');
    }
    const goodCampOption = args.includes('--good-camp')
      ? true
      : args.includes('--no-good-camp')
        ? false
        : undefined;
    const mealEnergyOption = option('--meal-energy');
    const cookingEnergyMultiplier = Number(option('--cooking-energy-multiplier') || 1);
    const basePotCapacity = Number(
      option('--base-pot-capacity') || COOKING_POWER_UP.basePotCapacity
    );
    const ingredientAvailability = Number(option('--ingredient-availability') ?? 1);
    const fillerIngredientBaseEnergy = Number(
      option('--filler-energy') ?? COOKING_POWER_UP.averageFillerIngredientBaseEnergy
    );
    const targetSkillRatePct = Number(option('--target-skill-rate') || 4);
    const targetSkillPracticalValue = Number(option('--target-skill-value') || NUZZLE.defaultTargetSkillPracticalValue);
    const teamSize = Number(option('--team-size') || STANDARD_HEALER_TEAM.teamSize);
    const productiveTargetCount = Number(option('--productive-targets') || STANDARD_HEALER_TEAM.productiveTargetCount);
    if (!(teamSize > 0 && productiveTargetCount >= 0 && productiveTargetCount <= teamSize)) {
      throw new Error(`无效回复队伍结构：${productiveTargetCount}/${teamSize}`);
    }
    const productiveTargetShare = productiveTargetCount / teamSize;
    const helpEnergyOption = option('--help-energy');
    const unlockedIngredientOption = option('--unlocked-ingredients');
    const unlockedIngredientIds = unlockedIngredientOption === undefined
      ? Object.keys(INGREDIENT_STRENGTH).map(Number)
      : unlockedIngredientOption.split(',').map(value => Number(value.trim()));
    const candyUnitValueOption = option('--candy-unit-value');
    const candyUnitPracticalValue = candyUnitValueOption === undefined
      ? undefined
      : Number(candyUnitValueOption);
    const presentCandyProbabilityOption = option('--present-candy-probability');
    const presentCandyProbability = presentCandyProbabilityOption === undefined
      ? PRESENT_INGREDIENT_MAGNET_S.candyProbability
      : Number(presentCandyProbabilityOption);
    const copyTargetValuesOption = option('--copy-target-values');
    const copyTargetNamesOption = option('--copy-target-names');
    const copyTargetCopyableOption = option('--copy-target-copyable');
    const copyTargetModesOption = option('--copy-target-modes');
    const copyOptions = {
      ...(copyTargetValuesOption === undefined
        ? {}
        : { targetValues: copyTargetValuesOption.split(',').map(value => Number(value.trim())) }),
      ...(copyTargetNamesOption === undefined
        ? {}
        : { targetNamesZh: copyTargetNamesOption.split(',').map(value => value.trim()) }),
      ...(copyTargetCopyableOption === undefined
        ? {}
        : {
            targetCopyable: copyTargetCopyableOption.split(',').map(value => (
              !['0', 'false', 'no', '否'].includes(value.trim().toLowerCase())
            ))
          }),
      ...(copyTargetModesOption === undefined
        ? {}
        : { targetModes: copyTargetModesOption.split(',').map(value => value.trim()) })
    };
    const allMightyBonusCandyProbabilityOption = option('--all-mighty-bonus-candy-probability');
    const allMightySkillRateOption = option('--all-mighty-skill-rate');
    const recoveryOptions = {
      latiosPresent: !args.includes('--without-latios'),
      targetSkillProbability: targetSkillRatePct / 100,
      targetSkillPracticalValue,
      productiveTargetShare,
      ...(helpEnergyOption === undefined ? {} : { helpEnergyPerHelp: Number(helpEnergyOption) })
    };
    const crescentOptions = {
      distinctPsychicSpecies: psychicSpecies,
      favoriteBerryShare,
      cresseliaBerryFavorite: favoriteBerry,
      teammates: Array.from({ length: 4 }, () => ({
        berryId: CRESCENT_PRAYER.psychicBerryId,
        level: TARGET_LEVEL,
        favorite: favoriteBerry
      }))
    };
    const records = input.pokemon || input;
    const rawRows = specialty === 'berry'
      ? berryProductionRows(input.pokemon || input)
      : specialty === 'skill-species'
        ? skillSpecialistSpeciesRankingRows(records, {
            favoriteShare: favoriteBerryShare,
            ...(slotBenchmarkEnergyOption === undefined
              ? {}
              : { replacementEnergyPerDay: Number(slotBenchmarkEnergyOption) }),
            ...(slotBenchmarkNameOption === undefined
              ? {}
              : { replacementNameZh: slotBenchmarkNameOption }),
            recoveryOptions,
            ingredientAcquisitionOptions: {
              plusPartnerPresent: !args.includes('--plus-standalone'),
              unlockedIngredientIds,
              dreamShardDemandCoefficient,
              presentCandyProbability,
              candyUnitPracticalValue
            },
            dreamShardOptions: {
              demandCoefficient: dreamShardDemandCoefficient,
              fieldBonusPct
            },
            tastyChanceOptions: {
              profileId: cookingProfileId,
              cookingEnergyMultiplier,
              ...(mealEnergyOption === undefined ? {} : { uniformMealEnergy: Number(mealEnergyOption) })
            },
            cookingPowerOptions: {
              profileId: cookingProfileId,
              basePotCapacity,
              ingredientAvailability,
              fillerIngredientBaseEnergy,
              cookingEnergyMultiplier,
              goodCamp: goodCampOption,
              minusPartnerPresent: !args.includes('--minus-standalone')
            },
            cookingAssistOptions: {
              profileId: cookingProfileId,
              cookingEnergyMultiplier,
              unlockedIngredientIds,
              ...(mealEnergyOption === undefined ? {} : { uniformMealEnergy: Number(mealEnergyOption) })
            },
            metronomeOptions: {
              profileId: cookingProfileId,
              cookingEnergyMultiplier,
              basePotCapacity,
              ingredientAvailability,
              fillerIngredientBaseEnergy,
              goodCamp: goodCampOption,
              unlockedIngredientIds,
              dreamShardDemandCoefficient,
              presentCandyProbability,
              candyUnitPracticalValue,
              ...(mealEnergyOption === undefined ? {} : { uniformMealEnergy: Number(mealEnergyOption) })
            },
            fieldBonusPct,
            crescentPrayerOptions: crescentOptions
          })
      : specialty === 'skill-production'
        ? skillSpecialistOrdinaryProductionRows(records, { favoriteShare: favoriteBerryShare })
      : specialty === 'skill-recovery'
        ? recoverySkillRows(input.pokemon || input, recoveryOptions)
      : specialty === 'skill-healer'
        ? standardE4eRows(input.pokemon || input)
      : specialty === 'skill-berry-juice'
          ? berryJuiceRows(input.pokemon || input)
        : specialty === 'skill-helping-support'
          ? helpingSupportRows(input.pokemon || input, { favoriteShare: favoriteBerryShare })
        : specialty === 'skill-helper-boost'
          ? helperBoostRows(input.pokemon || input, { favoriteShare: favoriteBerryShare })
        : specialty === 'skill-berry'
          ? berrySkillRows(input.pokemon || input, { favoriteShare: favoriteBerryShare })
        : specialty === 'skill-ingredient-acquisition'
          ? ingredientAcquisitionRows(input.pokemon || input, {
              plusPartnerPresent: !args.includes('--plus-standalone'),
              unlockedIngredientIds,
              dreamShardDemandCoefficient,
              presentCandyProbability,
              candyUnitPracticalValue
            })
        : specialty === 'skill-dream-shard'
          ? dreamShardRows(input.pokemon || input, {
              demandCoefficient: dreamShardDemandCoefficient,
              fieldBonusPct
            })
        : specialty === 'skill-tasty-chance'
          ? tastyChanceRows(input.pokemon || input, {
              profileId: cookingProfileId,
              cookingEnergyMultiplier,
              ...(mealEnergyOption === undefined ? {} : { uniformMealEnergy: Number(mealEnergyOption) })
            })
        : specialty === 'skill-cooking-power'
          ? cookingPowerRows(input.pokemon || input, {
              profileId: cookingProfileId,
              basePotCapacity,
              ingredientAvailability,
              fillerIngredientBaseEnergy,
              cookingEnergyMultiplier,
              goodCamp: goodCampOption,
              minusPartnerPresent: !args.includes('--minus-standalone')
            })
        : specialty === 'skill-cooking-assist'
          ? cookingAssistRows(input.pokemon || input, {
              profileId: cookingProfileId,
              cookingEnergyMultiplier,
              unlockedIngredientIds,
              ...(mealEnergyOption === undefined ? {} : { uniformMealEnergy: Number(mealEnergyOption) })
            })
        : specialty === 'skill-metronome'
          ? metronomeRows(input.pokemon || input, {
              favoriteShare: favoriteBerryShare,
              profileId: cookingProfileId,
              cookingEnergyMultiplier,
              basePotCapacity,
              ingredientAvailability,
              fillerIngredientBaseEnergy,
              goodCamp: goodCampOption,
              unlockedIngredientIds,
              dreamShardDemandCoefficient,
              presentCandyProbability,
              candyUnitPracticalValue,
              ...(mealEnergyOption === undefined ? {} : { uniformMealEnergy: Number(mealEnergyOption) })
            })
        : specialty === 'skill-copy'
          ? skillCopyRows(input.pokemon || input, copyOptions)
        : specialty === 'skill-all-mighty'
          ? allMightyRows(input.pokemon || input, {
              selectedSkillId: option('--all-mighty-selected'),
              level: Number(option('--all-mighty-level') || ALL_MIGHTY.maxLevel),
              selectedSkillRatePct: allMightySkillRateOption === undefined
                ? undefined
                : Number(allMightySkillRateOption),
              bonusCandyProbability: allMightyBonusCandyProbabilityOption === undefined
                ? ALL_MIGHTY.bonusCandyProbability
                : Number(allMightyBonusCandyProbabilityOption),
              candyUnitPracticalValue,
              favoriteShare: favoriteBerryShare,
              profileId: cookingProfileId,
              cookingEnergyMultiplier,
              basePotCapacity,
              ingredientAvailability,
              fillerIngredientBaseEnergy,
              goodCamp: goodCampOption,
              unlockedIngredientIds,
              dreamShardDemandCoefficient,
              ...(mealEnergyOption === undefined ? {} : { uniformMealEnergy: Number(mealEnergyOption) })
            })
        : specialty === 'skill-energy-charge-s-random'
          ? energyChargeSRandomRows(input.pokemon || input, { fieldBonusPct })
        : specialty === 'skill-energy-charge-m'
          ? energyChargeMRows(input.pokemon || input, { fieldBonusPct })
        : specialty === 'skill-stockpile'
          ? stockpileRows(input.pokemon || input, { fieldBonusPct })
        : specialty === 'skill-crescent-prayer'
          ? crescentPrayerRows(input.pokemon || input, crescentOptions)
        : specialty === 'skill-nightmare'
          ? nightmareRows(input.pokemon || input, { nonDarkTeammates })
        : ingredientProductionRows(input.pokemon || input);
    const recordById = new Map(records.map(record => [String(record.id), record]));
    const usesSkillSpecialistLayers = (
      specialty.startsWith('skill-')
      && specialty !== 'skill-species'
      && specialty !== 'skill-production'
      && rawRows.some(row => recordById.get(String(row.id))?.specialty === 'skill')
    );
    const specialistRows = usesSkillSpecialistLayers
      ? rawRows.filter(row => recordById.get(String(row.id))?.specialty === 'skill')
      : [];
    const specialistRowsWithOrdinaryProduction = usesSkillSpecialistLayers
      ? attachSkillSpecialistOrdinaryProduction(
          specialistRows,
          records,
          { favoriteShare: favoriteBerryShare }
        )
      : [];
    const specialistRowsWithEconomics = usesSkillSpecialistLayers
      ? attachSkillSpecialistSlotEconomics(specialistRowsWithOrdinaryProduction, records, {
          favoriteShare: favoriteBerryShare,
          ...(slotRoleOption === undefined ? {} : { slotRole: slotRoleOption }),
          ...(slotBenchmarkEnergyOption === undefined
            ? {}
            : { replacementEnergyPerDay: Number(slotBenchmarkEnergyOption) }),
          ...(slotBenchmarkNameOption === undefined
            ? {}
            : { replacementNameZh: slotBenchmarkNameOption })
        })
      : [];
    const specialistById = new Map(
      specialistRowsWithEconomics.map(row => [String(row.id), row])
    );
    const rows = usesSkillSpecialistLayers
      ? rawRows.map(row => specialistById.get(String(row.id)) || row)
      : rawRows;
    const output = showAll ? rows : rows.slice(0, 15);
    const renderMarkdown = specialty === 'berry'
      ? berryMarkdown
      : specialty === 'skill-species'
        ? skillSpecialistSpeciesRankingMarkdown
      : specialty === 'skill-production'
        ? skillSpecialistOrdinaryProductionMarkdown
      : specialty === 'skill-recovery'
        ? recoverySkillMarkdown
      : specialty === 'skill-healer'
        ? standardE4eMarkdown
      : specialty === 'skill-berry-juice'
          ? berryJuiceMarkdown
        : specialty === 'skill-helping-support'
          ? helpingSupportMarkdown
        : specialty === 'skill-helper-boost'
          ? helperBoostMarkdown
        : specialty === 'skill-berry'
          ? berrySkillMarkdown
        : specialty === 'skill-ingredient-acquisition'
          ? ingredientAcquisitionMarkdown
        : specialty === 'skill-dream-shard'
          ? dreamShardMarkdown
        : specialty === 'skill-tasty-chance'
          ? tastyChanceMarkdown
        : specialty === 'skill-cooking-power'
          ? cookingPowerMarkdown
        : specialty === 'skill-cooking-assist'
          ? cookingAssistMarkdown
        : specialty === 'skill-metronome'
          ? metronomeMarkdown
        : specialty === 'skill-copy'
          ? skillCopyMarkdown
        : specialty === 'skill-all-mighty'
          ? allMightyMarkdown
        : specialty === 'skill-energy-charge-s-random'
          ? energyChargeSRandomMarkdown
        : specialty === 'skill-energy-charge-m'
          ? energyChargeMMarkdown
        : specialty === 'skill-stockpile'
          ? stockpileMarkdown
        : specialty === 'skill-crescent-prayer'
          ? crescentPrayerMarkdown
        : specialty === 'skill-nightmare'
          ? nightmareMarkdown
        : ingredientMarkdown;
    const outputSpecialistRows = output.filter(row => Number.isFinite(row.slotAdjustedOutputIndex));
    const markdown = usesSkillSpecialistLayers && outputSpecialistRows.length
      ? `${renderMarkdown(output)}\n\n${skillSpecialistSlotEconomicsMarkdown(outputSpecialistRows)}`
      : renderMarkdown(output);
    process.stdout.write(format === 'json' ? `${JSON.stringify(output, null, 2)}\n` : `${markdown}\n`);
  }
}
