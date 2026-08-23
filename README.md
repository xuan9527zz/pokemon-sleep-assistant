# Pokemon Sleep 助手

一个以个人宝可梦盒子为基础的静态 Pokemon Sleep 辅助网站，可直接离线使用，也可通过 GitHub Pages 发布。

## 功能

- **盒子**：查看 97 只宝可梦的树果／食材／技能／全能定位、闪光状态、食材、技能和性格；副技能按解锁等级竖排，可直接按综合评分排序，悬停分数可查看最终形态、Lv.70 副技能、性格、食材组合与成长曲线构成。
- **岛屿推荐**：查看全部普通岛屿与 EX 岛屿的推荐排序及五人队伍；自动比较无特殊宝可梦主队与特殊宝可梦备选，并可为萌绿之岛及两个 EX 选择本周树果后动态重算。
- **料理食谱**：查询料理基础能量、能量系数、锅容量和所需食材，并从当前盒子推荐食材宝可梦。
- **活动资讯**：查看近期活动倒计时、活动效果、推荐队伍和活动前中后计划。
- **特殊宝可梦规则**：通常每队最多一只特殊宝可梦；拉帝亚斯与拉帝欧斯可以作为官方例外同时编队。

## 本地使用

直接双击 `index.html` 即可。网站不需要安装依赖、运行构建命令或连接数据库。

旧入口 `Pokemon_Sleep_97只宝可梦整理.html` 会自动转到 `index.html`，原有书签仍可继续使用。

## 发布到 GitHub Pages

1. 在 GitHub 创建一个仓库，并把本项目推送到 `main` 分支。
2. 打开仓库的 **Settings → Pages**。
3. 在 **Build and deployment → Source** 中选择 **GitHub Actions**。
4. 推送到 `main` 后，`.github/workflows/pages.yml` 会自动部署网站。

部署成功后，可以在工作流的 `deploy` 任务或仓库 Pages 设置中看到网站地址。

## 项目结构

```text
.
├─ index.html                         # GitHub Pages 与本地正式入口
├─ recipes.js                         # 食谱及料理系数数据
├─ favicon.svg                        # 网站图标
├─ Pokemon_Sleep_97只宝可梦整理.html  # 旧文件名兼容跳转
├─ .nojekyll                          # 关闭 Jekyll 处理
└─ .github/workflows/pages.yml        # GitHub Pages 自动部署
```

## 数据说明

- 盒子个体数据来自个人游戏截图和手动校对。
- 攻略、食谱和排序综合参考 Pokemon Sleep 官方公告、新版日文 Game8 与 RaenonX；宝可梦评级使用 Game8 2026-08-20 版本，并按当前 Lv.70 上限评价。
- Lv.80 副技能仍显示在个体资料中，但在官方开放更高等级前不计入培养结论。
- 当前 100 分制属于评分规则草案；食材组合提高为 25 分的定位核心项，暂按 AAA 25、AAB／ABB 15、ABA 11、ABC 7 分计算。AAB 与 ABB 的进一步高低会留给目标食材和料理适配规则判断。
- 活动内容会随官方公告变化，当前页面中的活动资料属于标注日期的数据快照。
- 本项目是个人辅助工具，与 The Pokémon Company、SELECT BUTTON inc. 或 Pokémon Sleep 官方无隶属关系。
