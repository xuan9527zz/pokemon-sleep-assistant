'use strict';

const fs = require('fs');
const path = require('path');
const { parseBoxRows } = require('../skills/pokemon-sleep-scoring/scripts/box-scores.js');

const projectRoot = path.resolve(__dirname, '..');
const sourcePath = path.join(projectRoot, 'data', 'raenonx-species.json');
const indexPath = path.join(projectRoot, 'index.html');
const outputPath = path.join(projectRoot, 'team-production.generated.js');

const traditionalToSimplified = Object.freeze({
  傑: '杰', 龜: '龟', 達: '达', 鴨: '鸭', 風: '风', 牆: '墙', 凱: '凯', 羅: '罗',
  龍: '龙', 寶: '宝', 電: '电', 樹: '树', 烏: '乌', 陽: '阳', 魯: '鲁', 躍: '跃',
  亞: '亚', 飄: '飘', 鷹: '鹰', 療: '疗', 環: '环', 鳥: '鸟', 獸: '兽', 萊: '莱',
  獅: '狮', 瑪: '玛', 蔥: '葱', 萬: '万', 聖: '圣', 節: '节', 樣: '样', 紋: '纹',
  聲: '声', 麗: '丽', 雞: '鸡', 頭: '头', 魚: '鱼', 夢: '梦', 歐: '欧', 鱷: '鳄',
  藍: '蓝'
});

const boxNameAliases = Object.freeze({
  '皮卡丘（巫师帽）': '皮卡丘（万圣节）',
  '皮卡丘（圣诞）': '皮卡丘（佳节）',
  '伊布（圣诞）': '伊布（佳节）',
  '乌波（城都）': '乌波',
  '乌波（帕底亚）': '乌波（帕底亚的样子）',
  '海豹球（节日）': '海豹球（佳节）'
});

// #36 在盒子中以最终形态名称展示，但备注明确记录截图仍是茸茸羊。
// 两个万圣节皮卡丘形态的生产率相同，固定使用第一个快照记录避免二义性。
const snapshotIdOverrides = Object.freeze({
  '8': '9001-1',
  '36': '180'
});

function simplifyName(value) {
  return [...String(value)].map(char => traditionalToSimplified[char] || char).join('');
}

function resolveSpecies(row, species) {
  const overrideId = snapshotIdOverrides[row.id];
  if (overrideId) return species.find(item => String(item.id) === overrideId) || null;
  const targetName = boxNameAliases[row.name] || row.name;
  const matches = species.filter(item => simplifyName(item.nameZh) === targetName);
  if (matches.length !== 1) {
    throw new Error(`无法唯一匹配盒子 #${row.id} ${row.name}：找到 ${matches.length} 条 RaenonX 记录`);
  }
  return matches[0];
}

function buildSnapshot() {
  const source = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
  const rows = parseBoxRows(fs.readFileSync(indexPath, 'utf8'));
  const byBoxId = {};

  for (const row of rows) {
    const match = resolveSpecies(row, source.pokemon);
    if (!Number.isFinite(match.ingredientRate) || !Number.isFinite(match.baseBerryCount)) {
      throw new Error(`盒子 #${row.id} ${row.name} 缺少食材概率或基础树果数量`);
    }
    byBoxId[row.id] = {
      snapshotId: String(match.id),
      snapshotNameZh: match.nameZh,
      ingredientRate: match.ingredientRate,
      baseBerryCount: match.baseBerryCount,
      rateSampleCount: match.rateSampleCount,
      rateSettled: Boolean(match.rateSettled)
    };
  }

  return {
    meta: {
      schemaVersion: 1,
      generatedAt: source.generatedAt,
      count: rows.length,
      source: 'RaenonX Pokémon Sleep Wiki snapshot',
      note: 'Ingredient rates are research estimates, not official disclosed probabilities. Current interval, level, inventory, nature, subskills, and ingredient slots come from the local box.'
    },
    byBoxId
  };
}

function serialize(snapshot) {
  return `(function(root){\n  'use strict';\n  root.POKEMON_SLEEP_TEAM_PRODUCTION=Object.freeze(${JSON.stringify(snapshot, null, 2)});\n})(typeof window!=='undefined'?window:globalThis);\n`;
}

function main() {
  const output = serialize(buildSnapshot());
  if (process.argv.includes('--check')) {
    const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, 'utf8') : '';
    if (existing !== output) {
      console.error('team-production.generated.js 不是最新，请重新运行生成脚本。');
      process.exitCode = 1;
      return;
    }
    console.log('team-production.generated.js 已是最新。');
    return;
  }
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`已生成 ${path.relative(projectRoot, outputPath)}（${Object.keys(buildSnapshot().byBoxId).length} 只）`);
}

if (require.main === module) main();

module.exports = { buildSnapshot, resolveSpecies, simplifyName, serialize };
