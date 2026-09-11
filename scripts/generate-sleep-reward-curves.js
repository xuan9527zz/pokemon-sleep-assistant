'use strict';

const fs=require('node:fs');
const path=require('node:path');
const strategy=require('../pokemon-strategy.js');

const DATA_ROOT='https://wiki.pokesleep.com/data/sleep-expectations';
const outputPath=path.resolve(__dirname,'..','sleep-reward-curves.generated.js');

// Keep target identity sourced from the same strategy table used by the weekly
// hunt UI. The generated subset avoids a 100+ MB cross-origin download in the
// browser while remaining reproducible when that table changes.
const AREA_IDS=Object.freeze({'萌绿之岛':'greengrass','萌绿之岛 EX':'greengrass-expert','天青沙滩':'cyan','天青沙滩 EX':'cyan-expert','灰褐洞窟':'taupe','白花雪原':'snowdrop','宝蓝湖畔':'lapis','黄金旧发电厂':'old-gold','黄金发电厂':'old-gold','琥珀溪谷':'amber-canyon'});
const targetSets={};
for(const [name,ids] of Object.entries(strategy.ISLAND_TARGETS||{})){
  const areaId=AREA_IDS[name];if(!areaId)continue;
  targetSets[areaId]=[...new Set([...(targetSets[areaId]||[]),...ids.map(String)])];
}
const STRATEGY_TARGETS=Object.freeze(Object.fromEntries(Object.entries(targetSets).map(([areaId,ids])=>[areaId,Object.freeze(ids)])));

function decodeSeries(encoded,magic){
  const buffer=Buffer.from(encoded,'base64');
  if(buffer.subarray(0,4).toString('ascii')!==magic)throw new Error(`Unexpected series format: ${magic}`);
  const length=buffer.readUInt32LE(4),values=new Array(length);
  for(let index=0;index<length;index+=1){
    values[index]=magic==='U32L'?buffer.readUInt32LE(8+index*4):magic==='U16L'?buffer.readUInt16LE(8+index*2):buffer.readFloatLE(8+index*4);
  }
  return values;
}

function decodeExpectationSeries(encoded){
  const buffer=Buffer.from(encoded,'base64');
  if(buffer.subarray(0,4).toString('ascii')!=='E16L')throw new Error('Unexpected expectation series format');
  const length=buffer.readUInt32LE(4),values=new Array(length);
  for(let index=0;index<length;index+=1)values[index]=buffer.readUInt16LE(8+index*2)/8192;
  return values;
}

function insertionIndex(values,target){
  let low=0,high=values.length;
  while(low<high){const middle=(low+high)>>1;if(values[middle]<target)low=middle+1;else high=middle}
  return low;
}

function simplifyRewards(encoded,spawnThresholds){
  const powers=decodeSeries(encoded.powers,'U32L');
  const researchExp=decodeSeries(encoded.researchExp,'F32L');
  const shards=decodeSeries(encoded.shards,'F32L');
  const maxExp=Math.max(...researchExp),maxShards=Math.max(...shards);
  const toleranceExp=Math.max(0.5,maxExp*0.0015),toleranceShards=Math.max(1,maxShards*0.0015);
  const mandatory=new Set([0,powers.length-1]);
  for(const threshold of spawnThresholds.slice(1)){
    const index=insertionIndex(powers,threshold.minDrowsyPower);
    for(const candidate of [index-1,index,index+1])if(candidate>0&&candidate<powers.length-1)mandatory.add(candidate);
  }
  const anchors=[...mandatory].sort((a,b)=>a-b),keep=new Set(anchors),stack=[];
  for(let index=1;index<anchors.length;index+=1)stack.push([anchors[index-1],anchors[index]]);
  while(stack.length){
    const [start,end]=stack.pop();
    if(end-start<2)continue;
    const span=powers[end]-powers[start];
    let worstIndex=-1,worstError=0;
    for(let index=start+1;index<end;index+=1){
      const ratio=span>0?(powers[index]-powers[start])/span:0;
      const expEstimate=researchExp[start]+(researchExp[end]-researchExp[start])*ratio;
      const shardEstimate=shards[start]+(shards[end]-shards[start])*ratio;
      const error=Math.max(Math.abs(researchExp[index]-expEstimate)/toleranceExp,Math.abs(shards[index]-shardEstimate)/toleranceShards);
      if(error>worstError){worstError=error;worstIndex=index}
    }
    if(worstError>1&&worstIndex>start){keep.add(worstIndex);stack.push([start,worstIndex],[worstIndex,end])}
  }
  const indices=[...keep].sort((a,b)=>a-b);
  return {
    powers:indices.map(index=>powers[index]),
    researchExp:indices.map(index=>Math.round(researchExp[index]*10)/10),
    shards:indices.map(index=>Math.round(shards[index]*10)/10),
    sourcePointCount:powers.length
  };
}

function spawnCountFor(spawnThresholds,drowsyPower){
  let count=3;
  for(const row of spawnThresholds)if(drowsyPower>=row.minDrowsyPower)count=row.spawnCount;
  return count;
}

// Matches PokéSleep Super Wiki's expectation interpolation: interpolation is
// isolated inside one spawn-count band and uses 38,000-DP cells.
function interpolateExpectation(powers,values,drowsyPower,saturationPower,spawnThresholds){
  const target=saturationPower==null?drowsyPower:Math.min(drowsyPower,saturationPower);
  let bandMin=-Infinity,bandMax=Infinity;
  for(let index=0;index<spawnThresholds.length;index+=1){
    const row=spawnThresholds[index],next=spawnThresholds[index+1];
    if(target>=row.minDrowsyPower&&(!next||target<next.minDrowsyPower)){
      bandMin=row.minDrowsyPower;
      bandMax=next?next.minDrowsyPower-1:Infinity;
      break;
    }
  }
  const start=Number.isFinite(bandMin)?insertionIndex(powers,bandMin):0;
  let end=powers.length;
  if(Number.isFinite(bandMax)){
    end=insertionIndex(powers,bandMax);
    while(end<powers.length&&powers[end]<=bandMax)end+=1;
  }
  let high=insertionIndex(powers,target);
  high=Math.max(start,Math.min(high,end));
  if(high<end&&powers[high]===target)return values[high];
  const low=high>start?high-1:-1,right=high<end?high:-1;
  if(low<0&&right<0)return 0;
  if(low<0)return values[right];
  if(right<0)return values[low];
  const lowCell=Math.floor(powers[low]/38000),highCell=Math.floor(powers[right]/38000),targetCell=Math.floor(target/38000);
  const ratio=targetCell<=lowCell?0:targetCell>=highCell?1:(targetCell-lowCell)/(highCell-lowCell);
  return values[low]+(values[right]-values[low])*ratio;
}

function decodedGroup(group,singleSleep,rewardPowers){
  let powers=null,values=null;
  if(group.powers&&group.values){powers=decodeSeries(group.powers,'U32L');values=decodeSeries(group.values,'F32L')}
  else if(singleSleep.powers&&group.values){powers=decodeSeries(singleSleep.powers,'U32L');values=decodeSeries(group.values,'F32L')}
  else if(group.splitIndexes&&group.splitValues16){
    powers=decodeSeries(group.splitIndexes,'U16L').map(index=>rewardPowers[index]);
    values=decodeExpectationSeries(group.splitValues16);
  }else if(group.indexes&&group.values16){
    powers=decodeSeries(group.indexes,'U16L').map(index=>rewardPowers[index]);
    values=decodeExpectationSeries(group.values16);
  }
  return powers&&values?{powers,values,saturationPower:group.saturationPower,members:group.members}:null;
}

function simplifyTargetSeries(points,mandatoryPowers){
  if(points.length<3)return points;
  const mandatory=new Set([0,points.length-1]);
  for(const power of mandatoryPowers){
    const index=insertionIndex(points.map(point=>point.power),power);
    for(const candidate of [index-1,index,index+1])if(candidate>0&&candidate<points.length-1)mandatory.add(candidate);
  }
  const anchors=[...mandatory].sort((a,b)=>a-b),keep=new Set(anchors),stack=[];
  for(let index=1;index<anchors.length;index+=1)stack.push([anchors[index-1],anchors[index]]);
  while(stack.length){
    const [start,end]=stack.pop();
    if(end-start<2)continue;
    const span=points[end].power-points[start].power;
    let worst=-1,worstError=0;
    for(let index=start+1;index<end;index+=1){
      const ratio=span>0?(points[index].power-points[start].power)/span:0;
      const metrics=['pokemonAppearances','familyAppearances','candy'];
      const error=Math.max(...metrics.map(metric=>{
        const estimate=points[start][metric]+(points[end][metric]-points[start][metric])*ratio;
        const tolerance=metric==='candy'?.002:.0002;
        return Math.abs(points[index][metric]-estimate)/tolerance;
      }));
      if(error>worstError){worstError=error;worst=index}
    }
    if(worstError>1&&worst>start){keep.add(worst);stack.push([start,worst],[worst,end])}
  }
  return [...keep].sort((a,b)=>a-b).map(index=>points[index]);
}

function targetDefinitions(optimizerManifest){
  const styles=optimizerManifest.styles,byPokemon=new Map;
  for(const style of styles){
    const id=String(style.pokemonId);
    if(!byPokemon.has(id))byPokemon.set(id,[]);
    byPokemon.get(id).push(style);
  }
  const finalIds=[...new Set(Object.values(STRATEGY_TARGETS).flat())],definitions=[];
  for(const finalId of finalIds){
    const finalStyles=byPokemon.get(finalId)||[],familyId=String(finalStyles[0]&&finalStyles[0].candyFamilyId||'');
    if(!familyId)throw new Error(`Missing optimizer style metadata for strategy target ${finalId}`);
    const memberMap=new Map;
    for(const style of styles){
      if(String(style.candyFamilyId)!==familyId)continue;
      const id=String(style.pokemonId),current=memberMap.get(id)||{id,name:style.pokemonNames['zh-cn'],dexNumber:style.dexNumber,areas:new Set(),minimumDpr:Infinity};
      style.areas.forEach(area=>current.areas.add(area));
      current.minimumDpr=Math.min(current.minimumDpr,Number(style.dpr)||Infinity);
      memberMap.set(id,current);
    }
    const members=[...memberMap.values()].map(member=>({...member,areas:[...member.areas]})).sort((left,right)=>left.dexNumber-right.dexNumber||left.id.localeCompare(right.id));
    const areas=[...new Set(members.flatMap(member=>member.areas))];
    definitions.push({id:finalId,name:finalStyles[0].pokemonNames['zh-cn'],familyId,members,areas});
  }
  return definitions;
}

function huntPokemonFor(definition,areaId){
  const available=definition.members.filter(member=>member.areas.includes(areaId));
  if(!available.length)return null;
  const ordinary=available.filter(member=>!/^9/.test(member.id));
  return (ordinary.length?ordinary:available).sort((left,right)=>left.minimumDpr-right.minimumDpr||left.dexNumber-right.dexNumber)[0];
}

function buildTargetSegments(source,areaDetail,optimizerManifest,definitions){
  const stylesById=new Map(optimizerManifest.styles.map(style=>[style.id,style]));
  const targets=(STRATEGY_TARGETS[source.areaId]||[]).map(id=>{
    const definition=definitions.find(item=>item.id===id),huntPokemon=huntPokemonFor(definition,source.areaId);
    return definition&&huntPokemon?{definition,huntPokemon}:null;
  }).filter(Boolean),segments=[];
  for(const segment of source.segments){
    const rank=areaDetail.ranks.find(item=>item.order===segment.rankOrder);
    if(!rank||!segment.singleSleep)continue;
    const rewardPowers=decodeSeries(segment.rewards.powers,'U32L'),groups=segment.singleSleep.groups.map(group=>decodedGroup(group,segment.singleSleep,rewardPowers)).filter(Boolean).map(group=>{
      const coefficients={};
      for(const target of targets)coefficients[target.definition.id]={pokemon:0,family:0,candy:0};
      let denominator=0;
      for(const [styleId,weightValue] of group.members){
        const style=stylesById.get(styleId),weight=Number(weightValue)||0;
        if(!style)continue;
        denominator+=weight;
        for(const target of targets){
          const coefficient=coefficients[target.definition.id];
          if(String(style.pokemonId)===target.huntPokemon.id)coefficient.pokemon+=weight;
          if(String(style.candyFamilyId)===target.definition.familyId){coefficient.family+=weight;coefficient.candy+=weight*Number(style.rewards.candy||0)}
        }
      }
      return {...group,denominator,coefficients};
    });
    const candidatePowers=new Set(rank.anchors||[]);
    for(const group of groups){group.powers.forEach(power=>candidatePowers.add(power));if(group.saturationPower!=null)candidatePowers.add(group.saturationPower)}
    for(const row of areaDetail.spawnThresholds){candidatePowers.add(row.minDrowsyPower);if(row.minDrowsyPower>1)candidatePowers.add(row.minDrowsyPower-1)}
    const powers=[...candidatePowers].filter(power=>power>=rank.minDrowsyPower&&power<=rank.maxDrowsyPower).sort((a,b)=>a-b);
    for(const target of targets){
      const points=[];
      for(const power of powers){
        let denominator=0,pokemon=0,family=0,candy=0;
        for(const group of groups){
          const value=interpolateExpectation(group.powers,group.values,power,group.saturationPower,areaDetail.spawnThresholds),coefficient=group.coefficients[target.definition.id];
          denominator+=value*group.denominator;
          pokemon+=value*coefficient.pokemon;
          family+=value*coefficient.family;
          candy+=value*coefficient.candy;
        }
        const scale=denominator>0?spawnCountFor(areaDetail.spawnThresholds,power)/denominator:0;
        points.push({power,pokemonAppearances:pokemon*scale,familyAppearances:family*scale,candy:candy*scale});
      }
      const simplified=simplifyTargetSeries(points,areaDetail.spawnThresholds.flatMap(row=>[row.minDrowsyPower,row.minDrowsyPower-1]));
      segments.push({targetId:target.definition.id,pokemonId:target.huntPokemon.id,pokemonName:target.huntPokemon.name,rankOrder:segment.rankOrder,sleepType:segment.actualSleepType,powers:simplified.map(point=>point.power),pokemonAppearances:simplified.map(point=>Math.round(point.pokemonAppearances*100000)/100000),familyAppearances:simplified.map(point=>Math.round(point.familyAppearances*100000)/100000),candy:simplified.map(point=>Math.round(point.candy*10000)/10000),sourcePointCount:points.length});
    }
  }
  return segments;
}

async function readJson(url){
  const response=await fetch(url);
  if(!response.ok)throw new Error(`${response.status} ${response.statusText}: ${url}`);
  return response.json();
}

async function main(){
  const [manifest,optimizerManifest]=await Promise.all([
    readJson(`${DATA_ROOT}/manifest.json`),
    readJson(`${DATA_ROOT}/optimizer/manifest.json`)
  ]);
  if(manifest.datasetId!==optimizerManifest.datasetId)throw new Error('Sleep expectation dataset mismatch');
  const definitions=targetDefinitions(optimizerManifest),areas=[];
  for(const areaIndex of optimizerManifest.areas){
    const areaMeta=manifest.areas.find(area=>area.id===areaIndex.id);
    if(!areaMeta)throw new Error(`Missing area metadata: ${areaIndex.id}`);
    const [source,areaEnvelope]=await Promise.all([
      readJson(`${DATA_ROOT}/optimizer/${areaIndex.dataFile}`),
      readJson(`${DATA_ROOT}/areas/${areaIndex.id}.json`)
    ]),areaDetail=areaEnvelope.area;
    if(source.datasetId!==manifest.datasetId)throw new Error(`Area dataset mismatch: ${areaIndex.id}`);
    areas.push({
      id:areaIndex.id,
      name:areaMeta.names['zh-cn'],
      spawnThresholds:areaMeta.spawnThresholds,
      ranks:areaMeta.ranks.map(rank=>({order:rank.order,minEnergy:rank.minEnergy,maxEnergy:rank.maxEnergy})),
      segments:source.segments.map(segment=>{
        const rewards=simplifyRewards({
          powers:segment.rewards.powers,
          researchExp:segment.rewards.values.researchExp,
          shards:segment.rewards.values.shards
        },areaMeta.spawnThresholds);
        return {rankOrder:segment.rankOrder,sleepType:segment.actualSleepType,saturationPower:segment.rewards.saturationPower,...rewards};
      }),
      targetSegments:buildTargetSegments(source,areaDetail,optimizerManifest,definitions)
    });
  }
  const data={
    schemaVersion:2,
    datasetId:manifest.datasetId,
    generatedAt:manifest.generatedAt,
    algorithmVersion:manifest.algorithmVersion,
    drowsyPowerMax:manifest.drowsyPowerMax,
    source:`${DATA_ROOT}/optimizer/manifest.json`,
    sourcePage:'https://wiki.pokesleep.com/en/sleep-optimizer',
    targetDefinitions:definitions.map(definition=>({...definition,members:definition.members.map(member=>({id:member.id,name:member.name,dexNumber:member.dexNumber,areas:member.areas}))})),
    strategyTargets:STRATEGY_TARGETS,
    areas
  };
  const body=`/* Generated from PokéSleep Super Wiki expectation curves. Do not edit by hand.\n * Source: ${data.sourcePage}\n * Dataset: ${data.datasetId} (${data.generatedAt})\n */\n(function(root,factory){\n  'use strict';\n  const api=factory();\n  if(typeof module==='object'&&module.exports)module.exports=api;\n  if(root)root.POKEMON_SLEEP_REWARD_CURVES=api;\n})(typeof globalThis!=='undefined'?globalThis:this,function(){\n  'use strict';\n  return Object.freeze(${JSON.stringify(data)});\n});\n`;
  fs.writeFileSync(outputPath,body,'utf8');
  console.log(`Wrote ${path.basename(outputPath)} (${Buffer.byteLength(body).toLocaleString()} bytes)`);
}

main().catch(error=>{console.error(error);process.exitCode=1});
