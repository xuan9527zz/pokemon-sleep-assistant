'use strict';

const fs=require('fs');

const SIMPLE_FIELDS=new Set(['cookingEnergyMultiplier','potCapacityMultiplier','universalSleepMultiplier','carryBonus','skillIngredientMultiplier','dishEnergyRecoveryBonus']);
const OFFSET_DATE=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:Z|[+-]\d{2}:\d{2})$/;

function auditAnnouncement(brief){
  const errors=[],unmodeled=[],modeledByCore=[],suggestedProfile={};
  if(!brief||typeof brief!=='object'||Array.isArray(brief))return {ok:false,errors:['公告简表必须是 JSON 对象。'],unmodeled,suggestedProfile};
  if(typeof brief.title!=='string'||!brief.title.trim())errors.push('缺少活动标题。');
  if(typeof brief.sourceUrl!=='string'||!/^https:\/\/(?:www\.)?pokemonsleep\.net\/(?:en\/)?news\/[^/]+\/?$/.test(brief.sourceUrl))errors.push('sourceUrl 必须是 Pokémon Sleep 官方公告链接。');
  for(const key of ['start','end'])if(typeof brief[key]!=='string'||!OFFSET_DATE.test(brief[key])||!Number.isFinite(Date.parse(brief[key])))errors.push(`${key} 必须是带时区的完整时间。`);
  if(!errors.some(error=>/start|end/.test(error))&&Date.parse(brief.start)>=Date.parse(brief.end))errors.push('活动结束时间必须晚于开始时间。');
  if(brief.areas!=='all'&&(!Array.isArray(brief.areas)||!brief.areas.length||brief.areas.some(area=>typeof area!=='string'||!area.trim())))errors.push('areas 必须是 all 或非空岛屿名称数组。');
  if(!Array.isArray(brief.effects)||!brief.effects.length)errors.push('effects 至少需要一项公告效果。');
  if(Array.isArray(brief.effects))brief.effects.forEach((effect,index)=>{
    if(!effect||typeof effect!=='object'||Array.isArray(effect)){errors.push(`effects[${index}] 必须是对象。`);return}
    if(typeof effect.type!=='string'||!effect.type.trim())errors.push(`effects[${index}] 缺少 type。`);
    if(typeof effect.when!=='string'||!effect.when.trim())errors.push(`effects[${index}] 缺少 when。`);
    if(typeof effect.target!=='string'||!effect.target.trim())errors.push(`effects[${index}] 缺少 target。`);
    if(typeof effect.value!=='number'||!Number.isFinite(effect.value)||effect.value<=0)errors.push(`effects[${index}] 的 value 必须是正数。`);
    if(typeof effect.type!=='string'||typeof effect.when!=='string'||typeof effect.target!=='string'||typeof effect.value!=='number'||!Number.isFinite(effect.value)||effect.value<=0)return;
    let profileField=null;
    if(SIMPLE_FIELDS.has(effect.type)&&effect.when==='all'&&effect.target==='all')profileField=effect.type;
    else if(effect.type==='potCapacityMultiplier'&&effect.when==='weekday'&&effect.target==='all')profileField='potCapacityMultiplier';
    else if(effect.type==='potCapacityMultiplier'&&effect.when==='sunday'&&effect.target==='all')profileField='sundayPotCapacityMultiplier';
    else if(effect.type==='ingredientHelpBonus'&&effect.when==='all'&&effect.target==='ingredient-specialist')profileField='ingredientSpecialistHelpBonus';
    else if(effect.type==='skillIngredientMultiplier'&&effect.when==='all'&&effect.target==='ingredient-output-only')profileField='skillIngredientMultiplier';
    if(profileField){
      if(Object.hasOwn(suggestedProfile,profileField))errors.push(`${profileField} 有重复效果，需要先处理叠加规则。`);
      else suggestedProfile[profileField]=effect.value;
    }else if(effect.type==='extraTastyMultiplier'&&effect.target==='all'&&((effect.when==='weekday'&&effect.value===2)||(effect.when==='sunday'&&effect.value===3)))modeledByCore.push({index,type:effect.type,when:effect.when,value:effect.value});
    else unmodeled.push({index,type:effect.type,when:effect.when,target:effect.target,value:effect.value,reason:SIMPLE_FIELDS.has(effect.type)?'当前模型不能直接表示这个日期／对象条件。':'当前活动档案没有这个效果的计算字段。'});
  });
  if(typeof brief.title==='string'&&brief.title.trim())suggestedProfile.label=brief.title.trim();
  if(Array.isArray(brief.areas)&&brief.areas.length)suggestedProfile.eventAreas=[...brief.areas];
  return {ok:errors.length===0,errors,sourceUrl:brief.sourceUrl,start:brief.start,end:brief.end,suggestedProfile,modeledByCore,unmodeled,fullyModeled:errors.length===0&&unmodeled.length===0};
}

if(require.main===module){
  const file=process.argv[2];
  if(!file){process.stderr.write('用法：node audit-announcement.js <brief.json>\n');process.exitCode=2}
  else try{const report=auditAnnouncement(JSON.parse(fs.readFileSync(file,'utf8')));process.stdout.write(`${JSON.stringify(report,null,2)}\n`);if(!report.ok)process.exitCode=1}catch(error){process.stderr.write(`无法读取公告简表：${error.message}\n`);process.exitCode=1}
}

module.exports={auditAnnouncement};
