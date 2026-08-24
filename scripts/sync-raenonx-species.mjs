#!/usr/bin/env node

import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const BASE_URL = 'https://pks.raenonx.cc';
const MAIN_SKILL_VERIFICATION_URL = 'https://wikiwiki.jp/poke_sleep/?cmd=source&page=%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%81%AE%E4%B8%80%E8%A6%A7';
const MAIN_SKILL_REFERENCE_URL = 'https://wikiwiki.jp/poke_sleep/%E3%83%9D%E3%82%B1%E3%83%A2%E3%83%B3%E3%81%AE%E4%B8%80%E8%A6%A7/%E3%83%A1%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%AD%E3%83%AB%E5%88%A5';
const DEFAULT_OUTPUT = resolve('data/raenonx-species.json');
const USER_AGENT = 'pokemon-sleep-assistant-data-sync/1.0 (+local personal project; source credited)';
const MAIN_SKILL_DEFINITIONS = Object.freeze({
  1: { nameEn: 'Charge Strength S', nameZh: '能量填充S' },
  2: { nameEn: 'Charge Strength M', nameZh: '能量填充M' },
  3: { nameEn: 'Dream Shard Magnet S', nameZh: '梦之碎片获取S' },
  4: { nameEn: 'Energizing Cheer S', nameZh: '活力疗愈S' },
  5: { nameEn: 'Charge Strength S (Random)', nameZh: '能量填充S（随机）' },
  6: { nameEn: 'Dream Shard Magnet S (Random)', nameZh: '梦之碎片获取S（随机）' },
  7: { nameEn: 'Charge Energy S', nameZh: '活力填充S' },
  8: { nameEn: 'Energy for Everyone S', nameZh: '活力全体疗愈S' },
  9: { nameEn: 'Extra Helpful S', nameZh: '帮手支援S' },
  10: { nameEn: 'Ingredient Magnet S', nameZh: '食材获取S' },
  11: { nameEn: 'Cooking Power-Up S', nameZh: '料理强化S' },
  12: { nameEn: 'Type Boost S', nameZh: '属性加速S' },
  13: { nameEn: 'Metronome', nameZh: '挥指' },
  14: { nameEn: 'Tasty Chance S', nameZh: '料理成功S' },
  15: { nameEn: 'Helper Boost', nameZh: '帮手加速' },
  16: { nameEn: 'Stockpile (Charge Strength S)', nameZh: '蓄力（能量填充S）' },
  17: { nameEn: 'Disguise (Berry Burst)', nameZh: '画皮（树果骤增）' },
  18: { nameEn: 'Moonlight (Charge Energy S)', nameZh: '月光（活力填充S）' },
  19: { nameEn: 'Transform (Skill Copy)', nameZh: '变身（技能复制）' },
  20: { nameEn: 'Mimic (Skill Copy)', nameZh: '模仿（技能复制）' },
  21: { nameEn: 'Berry Burst', nameZh: '树果骤增' },
  22: { nameEn: 'Crescent Prayer (Energy for Everyone S)', nameZh: '新月祈祷（活力全体疗愈S）' },
  23: { nameEn: 'Nightmare (Charge Strength M)', nameZh: '噩梦（能量填充M）' },
  24: { nameEn: 'Super Luck (Ingredient Draw S)', nameZh: '超幸运（食材精选S）' },
  25: { nameEn: 'Hyper Cutter (Ingredient Draw S)', nameZh: '怪力钳（食材精选S）' },
  26: { nameEn: 'Plus (Ingredient Magnet S)', nameZh: '正电（食材获取S）' },
  27: { nameEn: 'Minus (Cooking Power-Up S)', nameZh: '负电（料理强化S）' },
  28: { nameEn: 'Ingredient Draw S', nameZh: '食材精选S' },
  29: { nameEn: 'Present (Ingredient Magnet S)', nameZh: '礼物（食材获取S）' },
  30: { nameEn: 'Nuzzle (Energizing Cheer S)', nameZh: '蹭蹭脸颊（活力疗愈S）' },
  31: { nameEn: 'Bulk Up (Cooking Assist S)', nameZh: '健美（料理辅助S）' },
  32: { nameEn: 'Berry Juice (Energy for Everyone S)', nameZh: '树果汁（活力全体疗愈S）' },
  33: { nameEn: 'Versatile', nameZh: '十项全能' },
  34: { nameEn: 'Heal Pulse (Energizing Cheer S)', nameZh: '治愈波动（活力疗愈S）' },
  35: { nameEn: 'Draco Meteor (Berry Burst)', nameZh: '流星群（树果骤增）' },
  36: { nameEn: 'Aura Sphere (Dream Shard Magnet S)', nameZh: '波导弹（梦之碎片获取S）' },
});

const NORMALIZED_WIKI_SKILL_TO_ID = Object.freeze({
  'エナジーチャージs': 1,
  'エナジーチャージm': 2,
  'ゆめのかけらゲットs': 3,
  'げんきエールs': 4,
  'エナジーチャージsランダム': 5,
  'ゆめのかけらゲットsランダム': 6,
  'げんきチャージs': 7,
  'げんきオールs': 8,
  'おてつだいサポートs': 9,
  '食材ゲットs': 10,
  '料理パワーアップs': 11,
  'タイプブーストs': 12,
  'ゆびをふる': 13,
  '料理チャンスs': 14,
  'おてつだいブーストでんき': 15,
  'おてつだいブーストほのお': 15,
  'おてつだいブーストみず': 15,
  'たくわえるエナジーチャージs': 16,
  'ばけのかわきのみバースト': 17,
  'つきのひかりげんきチャージs': 18,
  'へんしんスキルコピー': 19,
  'ものまねスキルコピー': 20,
  'きのみバースト': 21,
  'みかづきのいのりげんきオールs': 22,
  'ナイトメアエナジーチャージm': 23,
  'きょううん食材セレクトs': 24,
  'かいりきバサミ食材セレクトs': 25,
  'プラス食材ゲットs': 26,
  'マイナス料理パワーアップs': 27,
  '食材セレクトs': 28,
  'プレゼント食材ゲットs': 29,
  'ほっぺすりすりげんきエールs': 30,
  'ビルドアップ料理アシストs': 31,
  'きのみジュースげんきオールs': 32,
  'オールマイティー': 33,
  'いやしのはどうげんきエールs': 34,
  'りゅうせいぐんきのみバースト': 35,
  'はどうだんゆめのかけらゲットs': 36,
});

const args = new Map(
  process.argv.slice(2).map(argument => {
    const [key, ...rest] = argument.split('=');
    return [key, rest.length ? rest.join('=') : true];
  }),
);

const outputPath = resolve(String(args.get('--output') || DEFAULT_OUTPUT));
const concurrency = Math.max(1, Math.min(8, Number(args.get('--concurrency') || 4)));
const selfTestOnly = args.has('--self-test');

const wait = milliseconds => new Promise(resolvePromise => setTimeout(resolvePromise, milliseconds));

async function fetchText(url, attempts = 3) {
  let lastError;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          accept: 'text/html,application/xhtml+xml',
          'user-agent': USER_AGENT,
        },
      });
      if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
      return await response.text();
    } catch (error) {
      lastError = error;
      if (attempt < attempts) await wait(500 * attempt);
    }
  }
  throw new Error(`Failed to fetch ${url}: ${lastError?.message || lastError}`);
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&(amp|lt|gt|quot|apos|#39);/g, entity => ({
      '&amp;': '&',
      '&lt;': '<',
      '&gt;': '>',
      '&quot;': '"',
      '&apos;': "'",
      '&#39;': "'",
    })[entity])
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(Number.parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number.parseInt(decimal, 10)));
}

function stripWikiCell(cell) {
  return String(cell)
    .replace(/BGCOLOR\([^)]*\):/gi, '')
    .replace(/COLOR\([^)]*\):/gi, '')
    .replace(/\[\[([^\]]+)\]\]/g, (_, link) => link.split('>')[0])
    .trim();
}

function normalizeWikiText(value) {
  return stripWikiCell(value)
    .normalize('NFKC')
    .replace(/&br;/gi, '')
    .replace(/[（）()\s・･]/g, '')
    .toLowerCase();
}

function normalizeJapanesePokemonName(value) {
  return normalizeWikiText(value)
    .replace(/のすがた|なすがた/g, '')
    .replace(/[\[\]]/g, '');
}

function canonicalSkillIdFromWiki(rawSkill) {
  const normalized = normalizeWikiText(rawSkill);
  const skillId = NORMALIZED_WIKI_SKILL_TO_ID[normalized];
  if (!skillId) throw new Error(`Unknown Wiki main skill: ${rawSkill} (normalized: ${normalized})`);
  return skillId;
}

async function loadMainSkillVerificationRows() {
  const html = await fetchText(MAIN_SKILL_VERIFICATION_URL);
  const sourceMatch = html.match(/<pre id="source"[^>]*><code>([\s\S]*?)<\/code><\/pre>/);
  if (!sourceMatch) throw new Error('Wiki source block for the Pokémon list is missing');
  const source = decodeHtmlEntities(sourceMatch[1]);
  const rows = [];

  for (const rawLine of source.split(/\r?\n/)) {
    if (!rawLine.startsWith('|')) continue;
    const cells = rawLine.slice(1).split('|');
    if (cells.at(-1) === '') cells.pop();
    if (cells.length !== 12) continue;
    const pokedexText = stripWikiCell(cells[1]);
    if (!/^\d{4}$/.test(pokedexText)) continue;

    const rawName = stripWikiCell(cells[2]);
    const rawSkill = stripWikiCell(cells[9]);
    rows.push({
      basePokedexId: Number(pokedexText),
      nameJa: rawName.replace(/&br;/gi, ' '),
      normalizedNameJa: normalizeJapanesePokemonName(rawName),
      skillNameJa: rawSkill.replace(/&br;/gi, ' '),
      mainSkillId: canonicalSkillIdFromWiki(rawSkill),
    });
  }

  if (!rows.length) throw new Error('No Pokémon rows found in the Wiki verification source');
  return rows;
}

function buildMainSkillAudit(catalogEn, catalogJa, verificationRows) {
  const jaById = new Map(catalogJa.pokemon.map(pokemon => [pokemon.id, pokemon]));
  const rowsByPokedexId = new Map();
  for (const row of verificationRows) {
    const rows = rowsByPokedexId.get(row.basePokedexId) || [];
    rows.push(row);
    rowsByPokedexId.set(row.basePokedexId, rows);
  }

  const resolutions = new Map();
  const unmatched = [];
  const corrections = [];

  for (const pokemon of catalogEn.pokemon) {
    const jaPokemon = jaById.get(pokemon.id);
    const nameJa = jaPokemon ? localizedName(catalogJa.pokemonNames, jaPokemon) : '';
    const basePokedexId = Number(pokemon.basePokedexId || pokemon.pokedexId);
    const candidates = rowsByPokedexId.get(basePokedexId) || [];
    const normalizedName = normalizeJapanesePokemonName(nameJa);
    const exactMatches = candidates.filter(row => row.normalizedNameJa === normalizedName);
    let matchedRows = exactMatches;

    if (!matchedRows.length) {
      const uniqueCandidateSkillIds = [...new Set(candidates.map(row => row.mainSkillId))];
      if (uniqueCandidateSkillIds.length === 1) matchedRows = candidates;
    }

    const uniqueSkillIds = [...new Set(matchedRows.map(row => row.mainSkillId))];
    if (!matchedRows.length || uniqueSkillIds.length !== 1) {
      unmatched.push({
        pokemonId: pokemon.id,
        basePokedexId,
        nameJa,
        candidateNames: candidates.map(row => row.nameJa),
        candidateSkillIds: [...new Set(candidates.map(row => row.mainSkillId))],
      });
      continue;
    }

    const mainSkillId = uniqueSkillIds[0];
    const definition = MAIN_SKILL_DEFINITIONS[mainSkillId];
    if (!definition) throw new Error(`Missing canonical definition for main skill ${mainSkillId}`);
    const serverMainSkillId = Number(pokemon.serverSideData.mainSkillId);
    const verifiedSkillNamesJa = [...new Set(matchedRows.map(row => row.skillNameJa))];
    const resolution = {
      id: mainSkillId,
      ...definition,
      nameJa: verifiedSkillNamesJa.join(' / '),
      source: serverMainSkillId === mainSkillId ? 'raenonxVerified' : 'verifiedWikiOverride',
      serverMainSkillId,
    };
    resolutions.set(pokemon.id, resolution);

    if (serverMainSkillId !== mainSkillId) {
      corrections.push({
        pokemonId: pokemon.id,
        pokedexId: pokemon.pokedexId,
        basePokedexId,
        nameEn: localizedName(catalogEn.pokemonNames, pokemon),
        nameJa,
        raenonxMainSkillId: serverMainSkillId,
        mainSkillId,
        mainSkillNameEn: definition.nameEn,
        mainSkillNameZh: definition.nameZh,
        verifiedSkillNameJa: resolution.nameJa,
        reason: `RaenonX Pokémon record exposes mainSkillId ${serverMainSkillId}; the current verification list maps this Pokémon to canonical main-skill id ${mainSkillId}.`,
        source: MAIN_SKILL_REFERENCE_URL,
      });
    }
  }

  if (unmatched.length) {
    throw new Error(`Main-skill verification failed for ${unmatched.length} Pokémon:\n${JSON.stringify(unmatched, null, 2)}`);
  }
  if (resolutions.size !== catalogEn.pokemon.length) {
    throw new Error(`Verified ${resolutions.size}/${catalogEn.pokemon.length} Pokémon main skills`);
  }

  return { resolutions, corrections };
}

function decodeNextFlight(html) {
  const chunks = [];
  const pattern = /self\.__next_f\.push\(\[1,("(?:\\.|[^"\\])*")\]\)/g;
  for (const match of html.matchAll(pattern)) chunks.push(JSON.parse(match[1]));
  if (!chunks.length) throw new Error('No Next.js data chunks found');
  return chunks.join('\n');
}

function extractJsonAfter(text, marker) {
  const markerIndex = text.indexOf(marker);
  if (markerIndex < 0) throw new Error(`Missing marker: ${marker}`);

  let index = markerIndex + marker.length;
  while (/\s/.test(text[index])) index += 1;
  const first = text[index];
  if (first !== '[' && first !== '{') throw new Error(`Marker ${marker} is not followed by JSON`);

  const start = index;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (; index < text.length; index += 1) {
    const character = text[index];
    if (inString) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === '"') inString = false;
      continue;
    }
    if (character === '"') inString = true;
    else if (character === '[' || character === '{') depth += 1;
    else if (character === ']' || character === '}') {
      depth -= 1;
      if (depth === 0) return JSON.parse(text.slice(start, index + 1));
    }
  }
  throw new Error(`Unterminated JSON after marker: ${marker}`);
}

async function loadCatalog(locale) {
  const html = await fetchText(`${BASE_URL}/${locale}/pokedex`);
  const data = decodeNextFlight(html);
  return {
    pokemon: extractJsonAfter(data, '"pokedexData":'),
    pokemonNames: extractJsonAfter(data, '"PokemonName":'),
    ingredientNames: extractJsonAfter(data, '"Food":{"Name":'),
    mainSkillNames: extractJsonAfter(data, '"MainSkill":{"Name":'),
  };
}

async function loadProducingParams(id) {
  const html = await fetchText(`${BASE_URL}/en/pokedex/${encodeURIComponent(id)}`);
  const data = decodeNextFlight(html);
  return extractJsonAfter(data, '"pokemonProducingParams":');
}

async function mapConcurrent(items, mapper, workerCount) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

function localizedName(nameMap, pokemon) {
  return (
    nameMap[pokemon.id]
    || nameMap[String(pokemon.pokedexId)]
    || nameMap[String(pokemon.basePokedexId)]
    || `#${pokemon.pokedexId}`
  );
}

function mapIngredients(ingredients, namesEn, namesZh) {
  return Object.fromEntries(
    Object.entries(ingredients).map(([level, options]) => [
      level,
      options.map(option => ({
        id: option.id,
        code: option.codeName,
        quantity: option.qty,
        combinationProbability: option.probabilityAtLevel,
        nameEn: namesEn[String(option.id)] || String(option.id),
        nameZh: namesZh[String(option.id)] || String(option.id),
      })),
    ]),
  );
}

async function runSelfTest() {
  const [catalog, catalogZh, catalogJa, verificationRows] = await Promise.all([
    loadCatalog('en'),
    loadCatalog('zh'),
    loadCatalog('ja'),
    loadMainSkillVerificationRows(),
  ]);
  const mainSkillAudit = buildMainSkillAudit(catalog, catalogJa, verificationRows);
  const gardevoir = catalog.pokemon.find(pokemon => pokemon.id === '282');
  if (!gardevoir) throw new Error('Gardevoir missing from Pokédex catalog');
  const rates = await loadProducingParams('282');
  const skillId = id => mainSkillAudit.resolutions.get(id)?.id;
  const checks = {
    catalogCount: catalog.pokemon.length,
    wikiRowCount: verificationRows.length,
    verifiedMainSkillCount: mainSkillAudit.resolutions.size,
    mainSkillCorrectionCount: mainSkillAudit.corrections.length,
    name: localizedName(catalog.pokemonNames, gardevoir),
    frequency: gardevoir.serverSideData.helpFrequencyBaseSec,
    baseCarry: gardevoir.stats.maxCarry,
    ingredientRate: rates.ingredientSplit,
    skillRatePct: rates.skillPercent,
    clefairyLineMainSkillIds: ['173', '35', '36'].map(skillId),
    raikouMainSkillId: skillId('243'),
    honchkrowMainSkillId: skillId('430'),
    mimikyuMainSkillId: skillId('778'),
    cresseliaMainSkillId: skillId('488'),
    cresseliaMainSkillName: mainSkillAudit.resolutions.get('488')?.nameEn,
    darkraiMainSkillId: skillId('491'),
    darkraiMainSkillName: mainSkillAudit.resolutions.get('491')?.nameEn,
    latiasMainSkillId: skillId('380'),
    latiosMainSkillId: skillId('381'),
    hawluchaMainSkillId: skillId('701'),
    lucarioMainSkillId: skillId('448'),
    chineseCatalogLoaded: catalogZh.pokemon.length,
  };
  if (checks.name !== 'Gardevoir') throw new Error(`Unexpected name: ${checks.name}`);
  if (checks.frequency !== 2400) throw new Error(`Unexpected frequency: ${checks.frequency}`);
  if (Math.abs(checks.ingredientRate - 0.144) > 1e-9) throw new Error('Unexpected ingredient rate');
  if (Math.abs(checks.skillRatePct - 4.2) > 1e-9) throw new Error('Unexpected skill rate');
  if (checks.wikiRowCount !== checks.catalogCount || checks.verifiedMainSkillCount !== checks.catalogCount) {
    throw new Error('Full-Pokédex main-skill verification is incomplete');
  }
  if (checks.raikouMainSkillId !== 15) throw new Error('Raikou main-skill correction missing');
  if (checks.honchkrowMainSkillId !== 24) throw new Error('Honchkrow main-skill correction missing');
  if (checks.mimikyuMainSkillId !== 17) throw new Error('Mimikyu main-skill correction missing');
  if (checks.cresseliaMainSkillId !== 22) throw new Error('Cresselia main-skill id correction missing');
  if (checks.cresseliaMainSkillName !== 'Crescent Prayer (Energy for Everyone S)') {
    throw new Error('Cresselia main-skill name correction missing');
  }
  if (checks.darkraiMainSkillId !== 23) throw new Error('Darkrai main-skill id correction missing');
  if (checks.darkraiMainSkillName !== 'Nightmare (Charge Strength M)') {
    throw new Error('Darkrai main-skill name correction missing');
  }
  if (checks.latiasMainSkillId !== 34) throw new Error('Latias main-skill correction missing');
  if (checks.latiosMainSkillId !== 35) throw new Error('Latios main-skill correction missing');
  if (checks.hawluchaMainSkillId !== 28) throw new Error('Hawlucha main-skill correction missing');
  if (checks.lucarioMainSkillId !== 36) throw new Error('Lucario main-skill correction missing');
  if (checks.clefairyLineMainSkillIds.some(mainSkillId => mainSkillId !== 13)) {
    throw new Error('Clefairy-line main-skill correction missing');
  }
  process.stdout.write(`${JSON.stringify(checks, null, 2)}\nSelf-test passed.\n`);
}

async function sync() {
  const [catalogEn, catalogZh, catalogJa, verificationRows] = await Promise.all([
    loadCatalog('en'),
    loadCatalog('zh'),
    loadCatalog('ja'),
    loadMainSkillVerificationRows(),
  ]);
  const mainSkillAudit = buildMainSkillAudit(catalogEn, catalogJa, verificationRows);
  const zhById = new Map(catalogZh.pokemon.map(pokemon => [pokemon.id, pokemon]));
  const failures = [];

  process.stderr.write(`Fetching production rates for ${catalogEn.pokemon.length} Pokémon...\n`);
  const rates = await mapConcurrent(
    catalogEn.pokemon,
    async (pokemon, index) => {
      try {
        const value = await loadProducingParams(pokemon.id);
        if ((index + 1) % 25 === 0 || index + 1 === catalogEn.pokemon.length) {
          process.stderr.write(`  ${index + 1}/${catalogEn.pokemon.length}\n`);
        }
        return value;
      } catch (error) {
        failures.push({ id: pokemon.id, message: error.message });
        return null;
      }
    },
    concurrency,
  );

  const records = catalogEn.pokemon.map((pokemon, index) => {
    const server = pokemon.serverSideData;
    const zhPokemon = zhById.get(pokemon.id) || pokemon;
    const rate = rates[index];
    const evolutionCount = Math.max(0, Number(pokemon.evolution?.stage || 1) - 1);
    const mainSkill = mainSkillAudit.resolutions.get(pokemon.id);
    if (!mainSkill) throw new Error(`Missing verified main skill for Pokémon ${pokemon.id}`);

    return {
      id: pokemon.id,
      pokedexId: pokemon.pokedexId,
      basePokedexId: pokemon.basePokedexId,
      nameEn: localizedName(catalogEn.pokemonNames, pokemon),
      nameZh: localizedName(catalogZh.pokemonNames, zhPokemon),
      patternId: pokemon.currentPattern?.patternId ?? null,
      patternI18nId: pokemon.currentPattern?.i18nId ?? null,
      typeId: pokemon.type,
      sleepTypeId: pokemon.sleepType,
      specialty: server.specialty,
      berryId: pokemon.berry,
      baseBerryCount: server.baseBerryCount,
      helpFrequencyBaseSec: server.helpFrequencyBaseSec,
      carryLimitBase: pokemon.stats.maxCarry,
      carryLimitRaisedFromFirstStage: pokemon.stats.maxCarry + evolutionCount * 5,
      friendshipPoints: pokemon.stats.friendshipPoints,
      expType: pokemon.expType,
      evolution: {
        stage: pokemon.evolution?.stage ?? null,
        stageToFinal: pokemon.evolution?.stageToFinal ?? null,
        previous: pokemon.evolution?.previous ?? null,
        next: pokemon.evolution?.next ?? [],
        lineId: pokemon.evolution?.evoLineId ?? null,
      },
      mainSkill: {
        id: mainSkill.id,
        nameEn: mainSkill.nameEn,
        nameZh: mainSkill.nameZh,
        nameJa: mainSkill.nameJa,
        source: mainSkill.source,
        raenonxMainSkillId: mainSkill.serverMainSkillId,
      },
      ingredients: mapIngredients(
        server.ingredients,
        catalogEn.ingredientNames,
        catalogZh.ingredientNames,
      ),
      ingredientRate: rate?.ingredientSplit ?? null,
      skillRatePct: rate?.skillPercent ?? null,
      rateSampleCount: rate?.dataCount ?? null,
      rateSettled: rate?.settled ?? null,
      releasedAt: server.releasedAt,
      isFinalEvolution: pokemon.evolution?.stageToFinal === 0,
    };
  });

  records.sort((a, b) => a.pokedexId - b.pokedexId || a.id.localeCompare(b.id));

  const output = {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    source: {
      provider: 'RaenonX Pokémon Sleep Wiki',
      pokedexUrl: `${BASE_URL}/en/pokedex`,
      ratesUrl: `${BASE_URL}/en/stats/base-rates`,
      mainSkillVerificationUrl: MAIN_SKILL_REFERENCE_URL,
      note: 'Ingredient and skill rates are RaenonX research estimates, not official in-game disclosures. Every main skill is cross-checked against the current Japanese verification list before export.',
      corrections: mainSkillAudit.corrections,
    },
    comparisonPolicy: {
      targetLevel: 70,
      nature: 'neutral',
      subskills: 'none',
      scoringWeightsFinalized: false,
    },
    counts: {
      all: records.length,
      finalEvolutions: records.filter(record => record.isFinalEvolution).length,
      missingRates: records.filter(record => record.ingredientRate == null || record.skillRatePct == null).length,
      verifiedMainSkills: mainSkillAudit.resolutions.size,
      mainSkillCorrections: mainSkillAudit.corrections.length,
    },
    failures,
    pokemon: records,
  };

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, 'utf8');
  process.stdout.write(`${outputPath}\n${JSON.stringify(output.counts)}\n`);
  if (failures.length) {
    process.stderr.write(`Completed with ${failures.length} failed rate pages; snapshot is incomplete.\n`);
    process.exitCode = 1;
  }
}

if (selfTestOnly) await runSelfTest();
else await sync();
