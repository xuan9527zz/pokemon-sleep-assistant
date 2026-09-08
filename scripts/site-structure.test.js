'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectRoot = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
assert.deepStrictEqual(duplicateIds, [], `存在重复 id：${duplicateIds.join('、')}`);

const localRefs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map(match => match[1])
  .filter(ref => !/^(?:https?:|data:|#|mailto:|javascript:)/i.test(ref))
  .map(ref => ref.replace(/^\.\//, '').split(/[?#]/)[0]);
const missingRefs = [...new Set(localRefs)].filter(ref => !fs.existsSync(path.join(projectRoot, ref)));
assert.deepStrictEqual(missingRefs, [], `缺少本地资源：${missingRefs.join('、')}`);

const inlineScripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]).filter(Boolean);
inlineScripts.forEach((source, index) => new vm.Script(source, { filename: `index-inline-${index}.js` }));
assert.ok(html.includes('id="currentTeamIslandBonus"'), '当前队伍页缺少岛屿加成输入');
assert.ok(html.includes('id="currentTeamDuration"'), '当前队伍页缺少纯能量计算时长输入');
assert.ok(html.includes('id="recipeLevelBonus"'), '食谱页缺少当前食谱等级加成输入');
assert.ok(html.includes("title.dataset.noIngredientIcons=''"), '食谱名称必须显式禁止食材图标装饰');

console.log(`site structure tests passed (${ids.length} ids, ${new Set(localRefs).size} local refs)`);
