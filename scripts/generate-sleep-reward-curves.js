'use strict';

const fs=require('node:fs');
const path=require('node:path');

const DATA_ROOT='https://wiki.pokesleep.com/data/sleep-expectations';
const outputPath=path.resolve(__dirname,'..','sleep-reward-curves.generated.js');

function decodeSeries(encoded,magic){
  const buffer=Buffer.from(encoded,'base64');
  if(buffer.subarray(0,4).toString('ascii')!==magic)throw new Error(`Unexpected series format: ${magic}`);
  const length=buffer.readUInt32LE(4),values=new Array(length);
  for(let index=0;index<length;index+=1){
    values[index]=magic==='U32L'?buffer.readUInt32LE(8+index*4):buffer.readFloatLE(8+index*4);
  }
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
  const areas=[];
  for(const areaIndex of optimizerManifest.areas){
    const areaMeta=manifest.areas.find(area=>area.id===areaIndex.id);
    if(!areaMeta)throw new Error(`Missing area metadata: ${areaIndex.id}`);
    const source=await readJson(`${DATA_ROOT}/optimizer/${areaIndex.dataFile}`);
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
      })
    });
  }
  const data={
    schemaVersion:1,
    datasetId:manifest.datasetId,
    generatedAt:manifest.generatedAt,
    algorithmVersion:manifest.algorithmVersion,
    drowsyPowerMax:manifest.drowsyPowerMax,
    source:`${DATA_ROOT}/optimizer/manifest.json`,
    sourcePage:'https://wiki.pokesleep.com/en/sleep-optimizer',
    areas
  };
  const body=`/* Generated from PokéSleep Super Wiki expectation curves. Do not edit by hand.\n * Source: ${data.sourcePage}\n * Dataset: ${data.datasetId} (${data.generatedAt})\n */\n(function(root,factory){\n  'use strict';\n  const api=factory();\n  if(typeof module==='object'&&module.exports)module.exports=api;\n  if(root)root.POKEMON_SLEEP_REWARD_CURVES=api;\n})(typeof globalThis!=='undefined'?globalThis:this,function(){\n  'use strict';\n  return Object.freeze(${JSON.stringify(data)});\n});\n`;
  fs.writeFileSync(outputPath,body,'utf8');
  console.log(`Wrote ${path.basename(outputPath)} (${Buffer.byteLength(body).toLocaleString()} bytes)`);
}

main().catch(error=>{console.error(error);process.exitCode=1});
