'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ingredients = require('../ingredients.js');
const { parseBoxRows } = require('../skills/pokemon-sleep-scoring/scripts/box-scores.js');

assert.strictEqual(Object.keys(ingredients.INGREDIENTS).length, 19);
assert.strictEqual(ingredients.canonicalize('甜甜蜜'), '甜甜蜜');
assert.strictEqual(ingredients.canonicalize('蜂蜜'), '甜甜蜜');
assert.strictEqual(ingredients.canonicalize('青色果实'), '嫩亮酪梨');
assert.strictEqual(ingredients.canonicalize('不存在的食材'), null);
assert.strictEqual(ingredients.iconPath('牛奶'), './assets/ingredients/milk.png');

for (const [name, filename] of Object.entries(ingredients.INGREDIENTS)) {
  const assetPath = path.resolve(__dirname, '..', 'assets', 'ingredients', filename);
  assert.ok(fs.existsSync(assetPath), `${name} 缺少图标 ${filename}`);
  assert.ok(fs.statSync(assetPath).size > 1000, `${name} 图标文件异常`);
  const header = fs.readFileSync(assetPath).subarray(0, 12);
  if (filename.endsWith('.png')) assert.strictEqual(header.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `${name} 不是有效 PNG`);
  else assert.strictEqual(`${header.subarray(0, 4).toString()}${header.subarray(8, 12).toString()}`, 'RIFFWEBP', `${name} 不是有效 WebP`);
}

const recipeContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.resolve(__dirname, '..', 'recipes.js'), 'utf8'), recipeContext);
const recipeIngredientNames = new Set(recipeContext.window.POKEMON_SLEEP_RECIPES.flatMap(recipe => recipe.ingredients.map(item => item.name)));
assert.deepStrictEqual([...recipeIngredientNames].filter(name => !ingredients.canonicalize(name)), []);

const boxRows = parseBoxRows(fs.readFileSync(path.resolve(__dirname, '..', 'index.html'), 'utf8'));
const boxIngredientNames = new Set(boxRows.flatMap(row => row.ingredients.split('／').map(slot => slot.replace(/×\d+$/, '')).filter(name => name && name !== '—')));
assert.deepStrictEqual([...boxIngredientNames].filter(name => !ingredients.canonicalize(name)), []);

console.log('ingredient icon tests passed');
