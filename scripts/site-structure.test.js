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
assert.ok(!html.includes('id="currentTeamIslandBonus"'), '当前队伍页不应再保留会与个人设置冲突的岛屿加成输入');
assert.ok(html.includes('id="currentTeamDuration"'), '当前队伍页缺少纯能量计算时长输入');
assert.ok(!html.includes('id="recipeLevelBonus"'), '食谱页不应再保留单一全局等级加成输入');
assert.ok(html.includes('id="personalSettingsDialog"'), '缺少统一个人设置侧栏');
assert.ok(html.includes('id="profileIslandBonuses"'), '个人设置缺少岛屿加成资料');
assert.ok(html.includes('id="profileIngredientStock"'), '个人设置缺少共用食材库存');
assert.ok(html.includes('id="profileRecipeList"'), '个人设置缺少逐食谱加成与完成状态');
assert.ok(html.includes('id="profileRecipeBulk" type="number" min="0" max="70"'), '食谱等级输入必须允许0表示未做过，并限制到Lv.70');
assert.ok(!html.includes('data-recipe-cooked'), '食谱是否做过不应保留独立开关');
assert.ok(html.includes('recipeEnergy:plannedRecipeEnergy'), '本周计划不得推荐食谱等级为0的未解锁料理');
assert.ok(html.includes('官方公告快照 · 2026-09-10'), '活动页资料快照未更新');
assert.ok(!html.includes('梦幻迷你拍照惊喜任务进行中'), '活动页仍把已经结束的梦幻拍照活动显示为进行中');
assert.ok(html.includes('超能力系主技能触发率 ×1.5'), '活动页缺少超梦活动的技能触发率细节');
assert.ok(html.includes('id="recipeIngredient" multiple'), '食谱页必须支持多食材交集筛选');
assert.ok(html.includes('id="recipeCookedFilter"'), '食谱页缺少未做过筛选');
assert.ok(html.includes('id="currentTeamDrawer"'), '当前队伍缺少切换侧栏');
assert.ok(html.includes('id="pokemonPickerDialog"'), '缺少可搜索的宝可梦图标选择器');
assert.ok(html.includes('id="selectionOddsTool"'), '本周作战页缺少友情徽章与严选概率小工具');
const weeklyMarkup=html.slice(html.indexOf('id="weeklyPlanner"'),html.indexOf('data-page="team"'));
assert.ok(weeklyMarkup.includes('id="selectionOddsTool"'), '友情徽章与严选概率应放在本周作战，而不是宝可梦盒子');
assert.ok(!html.includes('id="selectionOddsTool" data-page="box"'), '友情徽章与严选概率不应继续归属盒子页');
assert.ok(html.includes('id="weeklyActivityTools"'), '本周作战缺少按周模式显隐的活动设置容器');
assert.ok(html.includes('id="selectionLockedGold"'), '严选概率工具缺少实际锁金格数');
assert.ok(html.includes('id="selectionGraduationRole"'), '严选概率工具缺少本站毕业定位选择');
assert.ok(html.includes('id="pokemonCompareRole"'), '个体生产对比缺少定位选择');
assert.ok(html.includes('<option value="berry">树果位（含树果骤增）</option>'), '树果骤增技能手必须明确归入树果位对比');
assert.ok(html.includes("title.dataset.noIngredientIcons=''"), '食谱名称必须显式禁止食材图标装饰');

console.log(`site structure tests passed (${ids.length} ids, ${new Set(localRefs).size} local refs)`);
