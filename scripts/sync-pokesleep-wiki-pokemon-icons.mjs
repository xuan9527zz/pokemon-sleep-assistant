import fs from 'node:fs/promises';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const catalog = require(path.join(projectRoot, 'pokemon-catalog.generated.js'));
const outputDir = path.join(projectRoot, 'assets', 'pokemon');
const indexPage = 'https://wiki.pokesleep.com/zhs/pokemon';
const wikiFallbackIds = new Map([
  ['710-2', '710-1'], ['710-3', '710-1'], ['710-4', '710-1'],
  ['711-2', '711-1'], ['711-3', '711-1'], ['711-4', '711-1']
]);

async function responseOrThrow(url) {
  const response = await fetch(url, { headers: { 'user-agent': 'pokemon-sleep-helper-icon-sync/1.0' } });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response;
}

const page = await (await responseOrThrow(indexPage)).text();
const dataPath = page.match(/\/assets\/pokemon-index-zh-cn-[^"']+\.json/)?.[0];
if (!dataPath) throw new Error('未找到 PokéSleep Super Wiki 图鉴数据文件。');

const dataUrl = new URL(dataPath, indexPage).href;
const wikiData = await (await responseOrThrow(dataUrl)).json();
const wikiById = new Map((wikiData.pokemon || []).map(row => [String(row.id), row]));
const missing = catalog.pokemon.filter(row => !wikiById.has(String(row.id)) && !wikiById.has(wikiFallbackIds.get(String(row.id))));
if (missing.length) throw new Error(`Wiki 缺少本站图鉴 ID：${missing.map(row => row.id).join('、')}`);

await fs.mkdir(outputDir, { recursive: true });
const queue = [...catalog.pokemon];
let downloaded = 0;

async function worker() {
  while (queue.length) {
    const record = queue.shift();
    const wikiRecord = wikiById.get(String(record.id)) || wikiById.get(wikiFallbackIds.get(String(record.id)));
    const imageUrl = new URL(wikiRecord.image, indexPage).href;
    const response = await responseOrThrow(imageUrl);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.startsWith('image/')) throw new Error(`非图像响应：${imageUrl}`);
    const extension = path.extname(new URL(imageUrl).pathname).toLowerCase() === '.webp' ? '.webp' : '.png';
    await fs.writeFile(path.join(outputDir, `${record.id}${extension}`), Buffer.from(await response.arrayBuffer()));
    downloaded += 1;
  }
}

await Promise.all(Array.from({ length: 8 }, worker));
console.log(`Downloaded ${downloaded} Pokémon icons from ${dataUrl}`);
