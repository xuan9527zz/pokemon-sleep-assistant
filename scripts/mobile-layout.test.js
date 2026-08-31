'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(projectRoot, 'mobile.css'), 'utf8');

assert.ok(html.includes('href="./mobile.css'), '首页应加载移动端样式');
assert.ok(html.includes('viewport-fit=cover'), 'iPhone安全区域适配缺失');
assert.ok(html.lastIndexOf('mobile.css') > html.lastIndexOf('</style>'), '移动端样式必须在全部内置样式之后加载，否则手机规则会被桌面规则覆盖');
assert.ok(html.includes('id="mobileBoxList"'), '手机盒子卡片容器缺失');
assert.ok(html.includes('id="mobileFilterToggle"'), '手机筛选开关缺失');
assert.ok(html.includes('function mobilePokemonCard(mon)'), '手机盒子卡片渲染器缺失');
assert.ok(html.includes("window.matchMedia?.('(max-width:720px), (max-height:500px)"), '页面切换应识别手机竖屏与横屏断点');

const firstMobileBreakpoint = css.indexOf('@media(max-width:720px),');
assert.ok(firstMobileBreakpoint > 0, '缺少720px手机断点');
assert.strictEqual((css.match(/{/g)||[]).length, (css.match(/}/g)||[]).length, '移动端CSS花括号数量不匹配');
const desktopScope = css.slice(0, firstMobileBreakpoint).replace(/\s+/g, ' ').trim();
assert.strictEqual(
  desktopScope,
  '.mobile-box-list,.mobile-filter-toggle,.mobile-score-note,.box-manager-mobile-back{display:none}',
  '手机样式在断点外只能隐藏新增的手机专用控件'
);
assert.ok(css.includes('.app-nav{position:fixed;inset:auto 0 0'), '手机导航应固定在底部');
assert.ok(css.includes('grid-template-columns:repeat(6,minmax(0,1fr))'), '手机底部导航应容纳六个主页面');
assert.ok(html.includes('data-page-target="weekly"'), '手机和桌面导航都应包含本周计划页');
assert.ok(css.includes('html,body{width:100%;max-width:100%;overflow-x:hidden;overflow-x:clip}'), '页面根节点必须阻止iOS整页横向偏移');
assert.ok(css.includes('.wrap{width:100%;max-width:100%'), '手机主容器必须限制在视口宽度内');
assert.ok(css.includes('.box-page-table{display:none!important}'), '手机端应隐藏桌面宽表格');
assert.ok(css.includes('.mobile-box-list{display:grid'), '手机端应显示卡片列表');
assert.ok(css.includes('.box-manager-dialog{width:100vw;height:100vh;height:100dvh'), '盒子管理应使用手机全屏界面');
assert.ok(css.includes('.level-manager-dialog{width:100vw;height:100vh;height:100dvh'), '等级管理应使用手机全屏界面');
assert.ok(css.includes('min-height:44px'), '主要触控控件应至少44px高');
assert.ok(css.includes('input,select,textarea{font-size:16px!important}'), 'iOS输入控件应避免聚焦时自动放大');
assert.ok(css.includes('@media(min-width:398px) and (max-width:406px)'), '缺少iPhone 16 Pro 402pt宽度专项规则');
assert.ok(css.includes('@media(orientation:landscape) and (max-height:500px)'), '缺少iPhone横屏规则');
assert.ok(css.includes('env(safe-area-inset-top)'), '灵动岛顶部安全区域未处理');
assert.ok(css.includes('env(safe-area-inset-bottom)'), '底部Home指示条安全区域未处理');
assert.ok(css.includes('.island-guide{overflow-x:hidden}'), '岛屿页外层必须阻止内容撑宽整页');
assert.ok(css.includes('.team-grid{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))'), '手机岛屿队伍应在页面内使用两列网格');
assert.ok(!css.includes('.team-grid,.event-team-grid{display:flex!important'), '岛屿队伍不得继续复用横向滑动布局');
assert.ok(css.includes('.weekly-planner{width:100%;max-width:100%;overflow:hidden}'), '本周计划外层必须限制在手机视口内');
assert.ok(css.includes('.weekly-controls{display:grid!important;grid-template-columns:minmax(0,1fr)!important'), '本周计划表单在手机端应改为单列');
assert.ok(css.includes('.weekly-field,.weekly-check,.weekly-berries{grid-column:1!important;width:100%;max-width:100%}'), '本周计划控件不得撑宽网格');
assert.ok(css.includes('.weekly-berries[hidden]{display:none!important}'), '固定树果岛屿不应因手机覆盖规则显示隐藏控件');
assert.ok(css.includes('.weekly-team-pair{grid-template-columns:minmax(0,1fr)!important}'), '作战台的准备队与输出队在手机端应纵向排列');
assert.ok(css.includes('.weekly-budget-row{grid-template-columns:minmax(0,1fr)!important}'), '作战台食材预算不得撑宽手机页面');
assert.ok(css.includes('.weekly-progress{grid-template-columns:repeat(2,minmax(0,1fr))!important}'), '目标料理勾选应使用手机两列布局');

console.log('mobile layout tests passed');
