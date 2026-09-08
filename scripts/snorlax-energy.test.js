'use strict';

const assert = require('assert');
const energy = require('../snorlax-energy.js');
const species = require('../skills/pokemon-sleep-scoring/scripts/species-scores.js');

assert.deepStrictEqual(energy.BERRY_BASE_STRENGTH, species.berryBaseStrength, '树果基础能量必须与统一机械模型一致');
assert.deepStrictEqual(energy.ENERGY_CHARGE_S_FIXED, species.energyChargeSFixed.energyByLevel, '固定能量填充S必须与统一机械模型一致');
assert.deepStrictEqual(energy.ENERGY_CHARGE_S_RANDOM, species.energyChargeSRandom.rangeByLevel, '随机能量填充S必须与统一机械模型一致');
assert.deepStrictEqual(energy.ENERGY_CHARGE_M, species.energyChargeM.energyByLevel, '能量填充M必须与统一机械模型一致');
assert.deepStrictEqual(energy.STOCKPILE.energyByLevel, species.stockpile.energyByLevelAndStockpiles, '蓄力必须与统一机械模型一致');
assert.deepStrictEqual(energy.NIGHTMARE, species.nightmare.energyByLevel, '噩梦必须与统一机械模型一致');
assert.deepStrictEqual(energy.AURA_SPHERE, species.auraSphere.energyByLevel, '波导弹必须与统一机械模型一致');

assert.strictEqual(energy.berryStrengthAtLevel(15, 70), 192);
assert.strictEqual(energy.applyPercentageBonus(1000, 60), 1600);
assert.strictEqual(energy.directEnergyPerUse('能量填充M Lv.7', 2, 7, 60).actualEnergy, 10973);
assert.ok(Math.abs(energy.directEnergyPerUse('能量填充S（随机）Lv.7', 5, 7, 0).baseEnergy - 4015.5) < .1);
assert.ok(Math.abs(energy.directEnergyPerUse('蓄力（能量填充S）Lv.7', 16, 7, 0).baseEnergy - 4948) < 1);
assert.strictEqual(energy.directEnergyPerUse('活力全体疗愈S Lv.6', 8, 6, 60).supported, false);

console.log('snorlax energy tests passed');
