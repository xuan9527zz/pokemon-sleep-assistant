'use strict';

const CACHE_VERSION='pokemon-sleep-assistant-v7';
const APP_SHELL=[
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.svg',
  './assets/app-icon-180.png',
  './assets/app-icon-192.png',
  './assets/app-icon-512.png',
  './all-rounder-rules.js',
  './box-filter.css','./box-filter.js','./box-manager.css','./box-manager.js',
  './cloud-sync.css','./cloud-sync.js','./cooking-success.js','./cultivation-advisor.css','./cultivation-advisor.js',
  './events-data.js','./game-rules.js','./ingredients.css','./ingredients.js','./investment-planner.css','./investment-planner.js',
  './level-manager-evolution.css','./level-manager.css','./level-manager.js','./main-skill-team-effects.js','./mobile.css',
  './personal-settings.css','./personal-settings.js','./pokemon-catalog.generated.js','./pokemon-comparison.css','./pokemon-comparison.js',
  './pokemon-data.js','./pokemon-manager.css','./pokemon-manager.js','./pokemon-picker.css','./pokemon-picker.js',
  './pokemon-scoring.js','./pokemon-strategy.js','./production-calculator.js','./production-timeline.js','./recipes.js',
  './retention-advisor.css','./retention-advisor.js','./selection-odds.css','./selection-odds.js',
  './skills/pokemon-sleep-scoring/scripts/nature-scores.js','./skills/pokemon-sleep-scoring/scripts/scoring-core.js','./skills/pokemon-sleep-scoring/scripts/species-tiers.js',
  './sleep-research-planner.js','./snorlax-energy.js','./species-tier-guide.css','./species-tier-guide.js',
  './supabase-config.js','./team-planner.css','./team-planner.js','./weekly-planner.css','./weekly-planner.js',
  './pwa.css','./pwa.js',
  './assets/ingredients/apple.png','./assets/ingredients/avocado.webp','./assets/ingredients/bean-meat.png','./assets/ingredients/cacao.png',
  './assets/ingredients/coffee.png','./assets/ingredients/corn.png','./assets/ingredients/egg.png','./assets/ingredients/ginger.png',
  './assets/ingredients/herb.png','./assets/ingredients/honey.png','./assets/ingredients/leek.png','./assets/ingredients/milk.png',
  './assets/ingredients/mushroom.png','./assets/ingredients/oil.png','./assets/ingredients/potato.png','./assets/ingredients/pumpkin.webp',
  './assets/ingredients/soybean.png','./assets/ingredients/tail.png','./assets/ingredients/tomato.png'
];

function cacheKey(request){const url=new URL(request.url);url.search='';url.hash='';return url.toString()}

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_VERSION).then(cache=>cache.addAll(APP_SHELL)));
});

self.addEventListener('activate',event=>{
  event.waitUntil(Promise.all([
    caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_VERSION).map(key=>caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('message',event=>{
  if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  if(request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        if(response&&response.ok){const cache=await caches.open(CACHE_VERSION);await cache.put(cacheKey(request),response.clone())}
        return response;
      }catch(error){
        return await caches.match(cacheKey(request))||await caches.match('./index.html')||Response.error();
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_VERSION),key=cacheKey(request),cached=await cache.match(key);
    const network=fetch(request).then(async response=>{
      if(response&&response.ok&&response.type==='basic')await cache.put(key,response.clone());
      return response;
    }).catch(()=>null);
    return cached||await network||Response.error();
  })());
});
