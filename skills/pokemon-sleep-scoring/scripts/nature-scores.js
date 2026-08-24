(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.POKEMON_SLEEP_SCORING = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const NATURES = [
    { name: '勤奋' },
    { name: '怕寂寞', up: 'speed', down: 'energy' },
    { name: '固执', up: 'speed', down: 'ingredient' },
    { name: '顽皮', up: 'speed', down: 'skill' },
    { name: '勇敢', up: 'speed', down: 'exp' },
    { name: '大胆', up: 'energy', down: 'speed' },
    { name: '坦率' },
    { name: '淘气', up: 'energy', down: 'ingredient' },
    { name: '乐天', up: 'energy', down: 'skill' },
    { name: '悠闲', up: 'energy', down: 'exp' },
    { name: '内敛', up: 'ingredient', down: 'speed' },
    { name: '慢吞吞', up: 'ingredient', down: 'energy' },
    { name: '害羞' },
    { name: '马虎', up: 'ingredient', down: 'skill' },
    { name: '冷静', up: 'ingredient', down: 'exp' },
    { name: '温和', up: 'skill', down: 'speed' },
    { name: '温顺', up: 'skill', down: 'energy' },
    { name: '慎重', up: 'skill', down: 'ingredient' },
    { name: '浮躁' },
    { name: '自大', up: 'skill', down: 'exp' },
    { name: '胆小', up: 'exp', down: 'speed' },
    { name: '急躁', up: 'exp', down: 'energy' },
    { name: '爽朗', up: 'exp', down: 'ingredient' },
    { name: '天真', up: 'exp', down: 'skill' },
    { name: '认真' }
  ];

  const BERRY_FINAL_FORM_RATES = {
    '巴大蝶': { rate: 0.197, sourceName: 'バタフリー' },
    '拉达': { rate: 0.237, sourceName: 'ラッタ' },
    '皮卡丘（巫师帽）': { rate: 0.218, sourceName: 'ピカチュウ (ハロウィン)' },
    '雷丘': { rate: 0.224, sourceName: 'ライチュウ' },
    '火暴猴': { rate: 0.200, sourceName: 'オコリザル' },
    '嘎啦嘎啦': { rate: 0.225, sourceName: 'ガラガラ' },
    '大力鳄': { rate: 0.257, sourceName: 'オーダイル' },
    '黑鲁加': { rate: 0.203, sourceName: 'ヘルガー' },
    '七夕青鸟': { rate: 0.258, sourceName: 'チルタリス' },
    '帝牙海狮': { rate: 0.223, sourceName: 'トドゼルガ' },
    '火爆兽': { rate: 0.208, sourceName: 'バクフーン' },
    '火焰鸡': { rate: 0.153, sourceName: 'バシャーモ' },
    '巨沼怪': { rate: 0.146, sourceName: 'ラグラージ' },
    '玛狃拉': { rate: 0.251, sourceName: 'マニューラ' },
    '皮可西': { rate: 0.168, sourceName: 'ピクシー' },
    '伊布（圣诞）': { rate: 0.156, sourceName: 'イーブイ (ホリデー)' }
  };

  const BOX_BERRY_FINAL_FORMS = {
    '巴大蝶': '巴大蝶',
    '拉达': '拉达',
    '皮卡丘（巫师帽）': '皮卡丘（巫师帽）',
    '雷丘': '雷丘',
    '猴怪': '火暴猴',
    '卡拉卡拉': '嘎啦嘎啦',
    '蓝鳄': '大力鳄',
    '戴鲁比': '黑鲁加',
    '七夕青鸟': '七夕青鸟',
    '海豹球': '帝牙海狮',
    '帝牙海狮': '帝牙海狮',
    '火爆兽': '火爆兽',
    '火稚鸡': '火焰鸡',
    '沼跃鱼': '巨沼怪',
    '玛狃拉': '玛狃拉',
    '皮宝宝': '皮可西',
    '伊布（圣诞）': '伊布（圣诞）'
  };

  const RESOURCE_POINTS = {
    energyUp: 20 / (14 * 5) * 12,
    energyDown: -12 / (14 * 5) * 12,
    expUp: 18 / (14 * 5) * 20,
    expDown: -18 / (14 * 5) * 20
  };

  const round = (value, digits = 1) => {
    const scale = 10 ** digits;
    return Math.round((value + Number.EPSILON) * scale) / scale;
  };

  const natureName = value => String(value || '').split(/[：:]/)[0].trim();
  const natureByName = value => NATURES.find(nature => nature.name === natureName(value));

  function natureModifiers(value) {
    const nature = typeof value === 'string' ? natureByName(value) : value;
    if (!nature) throw new Error(`未知性格：${value}`);
    return {
      nature,
      helpInterval: nature.up === 'speed' ? 0.9 : nature.down === 'speed' ? 1.075 : 1,
      ingredientChance: nature.up === 'ingredient' ? 1.2 : nature.down === 'ingredient' ? 0.8 : 1,
      skillChance: nature.up === 'skill' ? 1.2 : nature.down === 'skill' ? 0.8 : 1
    };
  }

  function resourceScore(value) {
    const nature = typeof value === 'string' ? natureByName(value) : value;
    if (!nature) throw new Error(`未知性格：${value}`);
    let score = 0;
    if (nature.up === 'energy') score += RESOURCE_POINTS.energyUp;
    if (nature.down === 'energy') score += RESOURCE_POINTS.energyDown;
    if (nature.up === 'exp') score += RESOURCE_POINTS.expUp;
    if (nature.down === 'exp') score += RESOURCE_POINTS.expDown;
    return score;
  }

  function coreMultiplier(role, value, baseIngredientRate) {
    const modifiers = natureModifiers(value);
    const speed = 1 / modifiers.helpInterval;
    if (role === 'ingredient') return speed * modifiers.ingredientChance;
    if (role === 'skill') return speed * modifiers.skillChance;
    if (role === 'berry') {
      if (!(baseIngredientRate > 0 && baseIngredientRate < 1)) {
        throw new Error('树果手必须提供0到1之间的最终形态基础食材概率');
      }
      const berryShare = (1 - baseIngredientRate * modifiers.ingredientChance) / (1 - baseIngredientRate);
      return speed * berryShare;
    }
    throw new Error(`未知定位：${role}`);
  }

  function natureScore(role, value, baseIngredientRate) {
    const benchmark = role === 'berry' ? 0.5 : 0.36;
    const core = (coreMultiplier(role, value, baseIngredientRate) - 1) / benchmark * 100;
    return round(core + resourceScore(value));
  }

  function natureTable(role, baseIngredientRate) {
    return NATURES.map(nature => ({
      name: nature.name,
      up: nature.up || 'none',
      down: nature.down || 'none',
      score: natureScore(role, nature, baseIngredientRate)
    }));
  }

  const ingredientNatureScores = natureTable('ingredient');
  const skillNatureScores = natureTable('skill');
  const berryNatureScoresByFinalForm = Object.fromEntries(Object.entries(BERRY_FINAL_FORM_RATES).map(([name, data]) => [
    name,
    {
      ingredientRate: data.rate,
      sourceName: data.sourceName,
      scores: natureTable('berry', data.rate)
    }
  ]));

  function finalFormForBoxName(name) {
    return BOX_BERRY_FINAL_FORMS[name] || name;
  }

  function berryTableForPokemon(name) {
    const finalForm = finalFormForBoxName(name);
    const data = berryNatureScoresByFinalForm[finalForm];
    if (!data) throw new Error(`缺少树果手最终形态食材概率：${name}`);
    return { finalForm, ...data };
  }

  function scoreNatureText(role, natureText, boxPokemonName) {
    if (role !== 'berry') return natureScore(role, natureText);
    const finalForm = finalFormForBoxName(boxPokemonName);
    const data = BERRY_FINAL_FORM_RATES[finalForm];
    if (!data) throw new Error(`缺少树果手最终形态食材概率：${boxPokemonName}`);
    return natureScore(role, natureText, data.rate);
  }

  function selfTest() {
    const assertions = [
      ['食材手无补正', natureScore('ingredient', '认真'), 0],
      ['食材手食材上升', natureScore('ingredient', '马虎'), 55.6],
      ['食材手食材上升速度下降', natureScore('ingredient', '内敛'), 32.3],
      ['技能手技能上升', natureScore('skill', '慎重'), 55.6],
      ['技能手技能上升速度下降', natureScore('skill', '温和'), 32.3],
      ['巴大蝶无补正', natureScore('berry', '认真', 0.197), 0]
    ];
    const failures = assertions.filter(([, actual, expected]) => actual !== expected);
    return { ok: failures.length === 0, assertions, failures };
  }

  return Object.freeze({
    version: '2026-08-24',
    source: 'RaenonX-referenced verification estimates; nature multipliers from current game verification',
    natures: NATURES,
    resourcePoints: RESOURCE_POINTS,
    berryFinalFormRates: BERRY_FINAL_FORM_RATES,
    boxBerryFinalForms: BOX_BERRY_FINAL_FORMS,
    ingredientNatureScores,
    skillNatureScores,
    berryNatureScoresByFinalForm,
    natureName,
    natureScore,
    natureTable,
    finalFormForBoxName,
    berryTableForPokemon,
    scoreNatureText,
    selfTest
  });
});

if (typeof module === 'object' && module.exports && require.main === module) {
  const api = module.exports;
  const args = process.argv.slice(2);
  const role = args[0] || 'ingredient';
  const option = name => {
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : undefined;
  };
  const format = option('--format') || 'markdown';
  const signed = value => `${value > 0 ? '+' : ''}${value.toFixed(1)}`;
  const statLabels = { none: '无补正', speed: '帮忙速度', energy: '活力回复', ingredient: '食材概率', skill: '主技能概率', exp: 'EXP' };
  const markdown = (title, rows) => [
    `## ${title}`,
    '',
    '| 性格 | 上升 | 下降 | 原始修正分 |',
    '|---|---|---|---:|',
    ...rows.map(row => `| ${row.name} | ${statLabels[row.up]} | ${statLabels[row.down]} | ${signed(row.score)} |`)
  ].join('\n');

  let result;
  if (args.includes('--self-test')) {
    result = api.selfTest();
  } else if (role === 'ingredient' || role === 'skill') {
    const rows = role === 'ingredient' ? api.ingredientNatureScores : api.skillNatureScores;
    result = format === 'json' ? rows : markdown(`${role === 'ingredient' ? '食材手' : '技能手'}25种性格`, rows);
  } else if (role === 'berry' && args.includes('--all')) {
    result = api.berryNatureScoresByFinalForm;
  } else if (role === 'berry') {
    const pokemon = option('--pokemon');
    if (!pokemon) throw new Error('树果手模式需要 --pokemon <盒中名称>，或使用 --all');
    const table = api.berryTableForPokemon(pokemon);
    result = format === 'json' ? table : markdown(`${table.finalForm}｜基础食材概率 ${(table.ingredientRate * 100).toFixed(1)}%`, table.scores);
  } else {
    throw new Error(`未知模式：${role}`);
  }

  process.stdout.write(typeof result === 'string' ? `${result}\n` : `${JSON.stringify(result, null, 2)}\n`);
}
