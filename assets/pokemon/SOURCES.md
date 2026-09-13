# 宝可梦图标来源

本目录的宝可梦图标于 2026-09-13 从 PokéSleep Super Wiki 的简体中文图鉴下载并保存在项目内，页面运行时不再热链 PokeAPI 或 Wiki。

- 来源页面：https://wiki.pokesleep.com/zhs/pokemon
- 图像地址：读取 Wiki 图鉴数据中的 `image` 字段（PNG／WebP）
- 同步脚本：`scripts/sync-pokesleep-wiki-pokemon-icons.mjs`

下载范围与 `pokemon-catalog.generated.js` 保持一致；地区形态和节日形态保留各自的内部 ID 与独立图标。Wiki 当前只提供一套南瓜精／南瓜怪人图标，因此四种体型共用对应物种图标。

PokéSleep Super Wiki 声明其为非商业、非官方资料站，并注明 Pokémon 媒体属于各自权利人、Wiki 不主张所有权。本项目同样不主张这些图像的所有权，仅作为个人 Pokémon Sleep 辅助工具使用；如权利人要求移除，应删除对应资源。
