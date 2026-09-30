(function(root,factory){
  'use strict';
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_INVENTORY_OCR=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';

  const OCR_CACHE='pokemon-sleep-ocr-v1';
  const BACKUP_KEY='pokemon-sleep-inventory-ocr-backup-v1';
  const ASSETS=['tesseract.min.js','worker.min.js','tesseract-core-lstm.wasm.js','tesseract-core-lstm.wasm','chi_sim.traineddata.gz'];
  const WIDTH=588;
  const GRID_STEP=206;
  const COLUMN_CENTERS=[118,255,391,527];
  const clean=value=>String(value||'').replace(/[^\u3400-\u9fff]/g,'');
  const sum=stock=>Object.values(stock||{}).reduce((total,value)=>total+(Number(value)||0),0);
  const copy=value=>JSON.parse(JSON.stringify(value));

  function distance(left,right){
    const a=[...left],b=[...right],previous=b.map((_,index)=>index+1);previous.unshift(0);
    for(let i=1;i<=a.length;i++){
      const next=[i];for(let j=1;j<=b.length;j++)next[j]=Math.min(next[j-1]+1,previous[j]+1,previous[j-1]+(a[i-1]===b[j-1]?0:1));
      previous.splice(0,previous.length,...next);
    }
    return previous[b.length];
  }
  function matchName(raw,names){
    const label=clean(raw);
    if(label.length<2)return null;
    const scored=names.map(name=>({name,distance:distance(label,name)})).sort((a,b)=>a.distance-b.distance||a.name.localeCompare(b.name,'zh-CN'));
    const best=scored[0],second=scored[1];
    if(!best||best.distance>Math.min(2,Math.floor(best.name.length/2))||second&&second.distance===best.distance)return null;
    return best;
  }
  function ocrLines(data){
    return (data.blocks||[]).flatMap(block=>(block.paragraphs||[]).flatMap(paragraph=>paragraph.lines||[])).filter(line=>line.bbox&&line.words);
  }
  function fullImageCounts(data,rowY){
    const values=Array(4).fill(''),scores=Array(4).fill(Infinity);
    ocrLines(data).forEach(line=>line.words.forEach(word=>{
      const match=String(word.text||'').match(/(\d{1,3})/),bbox=word.bbox;
      if(!match||!bbox)return;
      const yDistance=Math.abs(bbox.y0-(rowY-52));
      if(yDistance>50||bbox.y0>rowY-12)return;
      const x=(bbox.x0+bbox.x1)/2,column=COLUMN_CENTERS.reduce((best,center,index)=>Math.abs(x-center)<Math.abs(x-COLUMN_CENTERS[best])?index:best,0);
      if(Math.abs(x-COLUMN_CENTERS[column])>51||yDistance>=scores[column])return;
      values[column]=Number(match[1]);scores[column]=yDistance;
    }));
    return values;
  }
  function extractNameRows(data,names){
    return ocrLines(data).map(line=>{
      const columns=Array.from({length:4},()=>[]);
      line.words.forEach(word=>{
        if(!word.bbox)return;
        const center=(word.bbox.x0+word.bbox.x1)/2;
        const index=Math.max(0,Math.min(3,Math.floor(center/(WIDTH/4))));
        columns[index].push(word.text);
      });
      const cells=columns.map((words,column)=>{const raw=clean(words.join(''));return {column,raw,match:matchName(raw,names)}});
      const matches=cells.filter(cell=>cell.match).length;
      return {y:line.bbox.y0,cells,matches};
    }).filter(row=>row.matches>=2||row.matches===1&&row.cells.some(cell=>cell.match&&cell.match.distance===0&&cell.raw.length>=3))
      .sort((a,b)=>a.y-b.y)
      .filter((row,index,array)=>index===0||row.y-array[index-1].y>60);
  }
  function mergeObservations(observations){
    const merged=new Map(),unknown=[];
    observations.forEach(item=>{
      if(!item.name){unknown.push({...item});return}
      const prior=merged.get(item.name);
      if(!prior){merged.set(item.name,{...item,sources:[item.source]});return}
      prior.sources.push(item.source);
      if(prior.quantity===''&&item.quantity!=='')prior.quantity=item.quantity;
      else if(item.quantity!==''&&prior.quantity!==item.quantity)prior.conflict=true;
      prior.include=prior.include||item.include;
      prior.review=prior.review||item.review;
      if(prior.alternative===null||prior.alternative===undefined)prior.alternative=item.alternative;
    });
    return [...merged.values(),...unknown];
  }
  function buildStock(current,entries,{clearMissing=false,limit=800}={}){
    const next=clearMissing?Object.fromEntries(Object.keys(current).map(name=>[name,0])):{...current};
    const used=new Set();
    for(const item of entries.filter(entry=>entry.include)){
      if(!item.name||!Object.hasOwn(next,item.name))throw new Error('有食材名称尚未核对。');
      if(used.has(item.name))throw new Error(`${item.name} 出现重复，请只保留一条。`);
      if(item.conflict&&!item.checked)throw new Error(`${item.name} 在截图中数量不同，请核对后修改。`);
      const amount=Number(item.quantity);
      if(item.quantity===''||!Number.isInteger(amount)||amount<0||amount>limit)throw new Error(`${item.name} 的数量无效。`);
      next[item.name]=amount;used.add(item.name);
    }
    if(!used.size)throw new Error('请至少选择一项食材。');
    if(clearMissing&&entries.some(entry=>!entry.include||!entry.name||entry.quantity===''||!Number.isInteger(Number(entry.quantity))))throw new Error('完整背包模式须先核对并勾选全部识别项目。');
    if(sum(next)>limit)throw new Error(`导入后为 ${sum(next)} / ${limit}，已超出背包上限。请核对截图或选择“完整背包”。`);
    return next;
  }

  async function loadScript(url){
    if(root.Tesseract)return;
    await new Promise((resolve,reject)=>{
      const script=document.createElement('script');script.src=url;script.onload=resolve;script.onerror=()=>reject(new Error('离线识别程序未下载成功。'));document.head.append(script);
    });
  }
  async function prepareOfflinePack(progress=()=>{}){
    if(!root.caches)throw new Error('此浏览器不支持离线缓存。请在 Safari 中打开网站。');
    const cache=await caches.open(OCR_CACHE);
    for(let index=0;index<ASSETS.length;index++){
      const url=new URL(`./assets/ocr/${ASSETS[index]}`,location.href);
      progress(`准备离线识别包 ${index+1}/${ASSETS.length}…`);
      if(await cache.match(url))continue;
      const response=await fetch(url,{cache:'reload'});
      if(!response.ok)throw new Error(`识别包下载失败：${ASSETS[index]}`);
      await cache.put(url,response);
    }
    return true;
  }
  async function offlinePackReady(){
    if(!root.caches)return false;
    const cache=await caches.open(OCR_CACHE);
    for(const name of ASSETS)if(!await cache.match(new URL(`./assets/ocr/${name}`,location.href)))return false;
    return true;
  }
  async function imageCanvas(file){
    const objectUrl=URL.createObjectURL(file),image=new Image();
    try{
      await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error(`${file.name} 不是可读取的图片。`));image.src=objectUrl});
      const canvas=document.createElement('canvas');canvas.width=WIDTH;canvas.height=Math.round(image.naturalHeight*WIDTH/image.naturalWidth);
      canvas.getContext('2d',{willReadFrequently:true}).drawImage(image,0,0,canvas.width,canvas.height);
      return canvas;
    }finally{URL.revokeObjectURL(objectUrl)}
  }
  async function recognizeScreenshot(worker,file,names){
    const canvas=await imageCanvas(file);
    await worker.setParameters({tessedit_char_whitelist:'',tessedit_pageseg_mode:root.Tesseract.PSM.AUTO});
    const result=await worker.recognize(canvas,{}, {blocks:true});
    const rows=extractNameRows(result.data,names);
    if(!rows.length)throw new Error(`${file.name}：未找到四列食材名称，请确认是“食材包包”截图。`);
    const firstY=rows[0].y;
    for(let index=1;index<5;index++){
      const expected=firstY+index*GRID_STEP;
      if(expected>canvas.height-170)break;
      if(rows.some(row=>Math.abs(row.y-expected)<30))continue;
      const strip=document.createElement('canvas');strip.width=WIDTH;strip.height=55;
      strip.getContext('2d').drawImage(canvas,0,expected-15,WIDTH,55,0,0,WIDTH,55);
      await worker.setParameters({tessedit_pageseg_mode:root.Tesseract.PSM.SINGLE_BLOCK});
      const fallback=await worker.recognize(strip,{}, {blocks:true});
      const found=extractNameRows(fallback.data,names)[0];
      if(found)rows.push({...found,y:expected});
    }
    rows.sort((a,b)=>a.y-b.y);
    await worker.setParameters({tessedit_char_whitelist:'0123456789',tessedit_pageseg_mode:root.Tesseract.PSM.SINGLE_LINE});
    let bagTotal=null;
    const header=ocrLines(result.data).find(line=>/食材.*包/.test(clean(line.text)));
    if(header){
      const crop=document.createElement('canvas');crop.width=500;crop.height=176;
      crop.getContext('2d').drawImage(canvas,203,Math.max(0,header.bbox.y0-4),125,44,0,0,500,176);
      await worker.setParameters({tessedit_char_whitelist:'0123456789/',tessedit_pageseg_mode:root.Tesseract.PSM.SINGLE_LINE});
      const totalResult=await worker.recognize(crop),match=String(totalResult.data.text||'').match(/(\d{1,3})\s*\/\s*800/);
      if(match)bagTotal=Number(match[1]);
      await worker.setParameters({tessedit_char_whitelist:'0123456789',tessedit_pageseg_mode:root.Tesseract.PSM.SINGLE_LINE});
    }
    async function countAt(x,y){
      const crop=document.createElement('canvas');crop.width=220;crop.height=120;
      const context=crop.getContext('2d');context.imageSmoothingQuality='high';
      context.drawImage(canvas,x-22,y-12,44,24,0,0,220,120);
      const result=await worker.recognize(crop),digits=String(result.data.text||'').replace(/\D/g,'');
      return digits?Number(digits):'';
    }
    const roughY=Math.round(rows[0].y-39);
    let anchorY=roughY,firstCounts=[],bestScore=-1;
    for(const offset of [0,2,4,6,8]){
      const values=[];
      for(const cell of rows[0].cells)values.push(cell.raw.length>=2?await countAt(COLUMN_CENTERS[cell.column],roughY+offset):'');
      const score=values.filter(value=>value!==''&&value<=800).length;
      if(score>bestScore){bestScore=score;anchorY=roughY+offset;firstCounts=values}
      if(score===rows[0].cells.filter(cell=>cell.raw.length>=2).length)break;
    }
    const observations=[];
    for(let rowIndex=0;rowIndex<rows.length;rowIndex++){
      const row=rows[rowIndex],gridIndex=Math.round((row.y-firstY)/GRID_STEP),centerY=anchorY+gridIndex*GRID_STEP;
      const fullCounts=fullImageCounts(result.data,row.y);
      for(const cell of row.cells){
        if(!cell.raw||cell.raw.length<2)continue;
        const x=COLUMN_CENTERS[cell.column];
        if(centerY<12||centerY+12>canvas.height)continue;
        const cropped=rowIndex===0?firstCounts[cell.column]:await countAt(x,centerY);
        const full=fullCounts[cell.column],quantity=full!==''?full:cropped;
        const alternative=full!==''&&cropped!==''&&full!==cropped?cropped:null;
        observations.push({name:cell.match?.name||'',raw:cell.raw,quantity,alternative,source:file.name,include:Boolean(cell.match&&quantity!==''),review:!cell.match||cell.match.distance>0||quantity===''||alternative!==null,checked:false});
      }
    }
    return {observations,bagTotal};
  }
  async function createWorker(){
    await loadScript(new URL('./assets/ocr/tesseract.min.js',location.href));
    const base=new URL('./assets/ocr/',location.href);
    return root.Tesseract.createWorker('chi_sim',1,{
      workerPath:new URL('worker.min.js',base).href,
      corePath:new URL('tesseract-core-lstm.wasm.js',base).href,
      langPath:base.href,
      workerBlobURL:false
    });
  }
  function element(tag,className,textValue){const node=document.createElement(tag);if(className)node.className=className;if(textValue!==undefined)node.textContent=textValue;return node}
  function readBackup(){try{return JSON.parse(localStorage.getItem(BACKUP_KEY)||'null')}catch(_error){return null}}
  function saveBackup(backup){try{localStorage.setItem(BACKUP_KEY,JSON.stringify(backup))}catch(_error){}}
  function mount({profile,ingredients=[]}={}){
    const host=document.querySelector('#inventoryOcr');if(!host||!profile)return null;
    let entries=[],bagTotal=null;
    const toolbar=element('div','inventory-ocr-toolbar'),prepare=element('button','','准备离线识别包'),choose=element('button','','从截图识别库存'),undo=element('button','','撤销上次导入'),input=element('input'),status=element('p','inventory-ocr-status','首次使用需联网准备约 9 MB 识别包；准备后可离线识别，图片不会上传。'),preview=element('div','inventory-ocr-preview');
    prepare.type=choose.type=undo.type='button';input.type='file';input.accept='image/*';input.multiple=true;input.hidden=true;
    toolbar.append(choose,prepare,undo,input);host.append(toolbar,status,preview);
    const setStatus=(message,error=false)=>{status.textContent=message;status.dataset.error=error?'true':'false'};
    const currentStock=()=>profile.getState().ingredientStock;
    const updateUndo=()=>{const backup=readBackup();undo.hidden=!backup||JSON.stringify(currentStock())!==JSON.stringify(backup.after)};
    updateUndo();offlinePackReady().then(ready=>{if(ready)setStatus('离线识别包已就绪。图片只在本机处理，导入前可以核对。')}).catch(()=>{});
    prepare.addEventListener('click',async()=>{
      prepare.disabled=true;
      try{await prepareOfflinePack(setStatus);setStatus('离线识别包已就绪。此后可断网识别截图。')}
      catch(error){setStatus(error.message,true)}finally{prepare.disabled=false}
    });
    choose.addEventListener('click',()=>input.click());
    input.addEventListener('change',async()=>{
      const files=[...input.files||[]];input.value='';if(!files.length)return;
      choose.disabled=true;preview.replaceChildren();entries=[];bagTotal=null;
      let worker;
      try{
        if(!await offlinePackReady())await prepareOfflinePack(setStatus);
        worker=await createWorker();
        const observations=[];
        for(let index=0;index<files.length;index++){
          setStatus(`本机识别截图 ${index+1}/${files.length}：${files[index].name}…`);
          const result=await recognizeScreenshot(worker,files[index],ingredients);
          observations.push(...result.observations);
          if(result.bagTotal!==null)bagTotal=result.bagTotal;
        }
        entries=mergeObservations(observations);
        renderPreview();
        setStatus(`识别出 ${entries.length} 种食材。重叠截图已合并；请逐项核对后再更新库存。`);
      }catch(error){setStatus(`识别失败：${error.message}`,true)}
      finally{if(worker)await worker.terminate();choose.disabled=false}
    });
    undo.addEventListener('click',()=>{
      const backup=readBackup();if(!backup||JSON.stringify(currentStock())!==JSON.stringify(backup.after)){setStatus('库存已发生其他更改，无法安全撤销。',true);updateUndo();return}
      profile.update({ingredientStock:backup.before},'ingredient-stock');saveBackup(null);updateUndo();setStatus('已恢复到导入前的库存。');
    });
    function renderPreview(){
      preview.replaceChildren();
      const title=element('strong','','识别预览'),hint=element('p','','勾选要更新的食材。数量或名称有误可直接修改；未勾选的项目保持原库存。');
      preview.append(title,hint);
      const list=element('div','inventory-ocr-list');
      for(const entry of entries){
        const row=element('div','inventory-ocr-row'),include=element('input'),name=element('select'),quantity=element('input'),source=element('small','',entry.sources?.join('、')||entry.source);
        include.type='checkbox';include.checked=entry.include;include.setAttribute('aria-label','更新此食材');include.addEventListener('change',()=>{entry.include=include.checked;refreshSummary()});
        const blank=element('option','','请选择食材');blank.value='';name.append(blank);
        ingredients.forEach(item=>{const option=element('option','',item);option.value=item;name.append(option)});name.value=entry.name||'';
        name.setAttribute('aria-label','食材名称');name.addEventListener('change',()=>{entry.name=name.value;entry.checked=true;include.checked=entry.include=Boolean(entry.name&&Number.isInteger(Number(entry.quantity)));refreshSummary()});
        quantity.type='number';quantity.min='0';quantity.max='800';quantity.step='1';quantity.inputMode='numeric';quantity.value=String(entry.quantity);quantity.setAttribute('aria-label','识别数量');quantity.addEventListener('change',()=>{entry.quantity=quantity.value;entry.checked=true;include.checked=entry.include=Boolean(entry.name&&quantity.value!=='');refreshSummary()});
        row.append(include,name,quantity,source);
        if(entry.review||entry.conflict)row.append(element('span','inventory-ocr-warning',entry.conflict?'截图数量不一致，请核对':entry.alternative!==null&&entry.alternative!==undefined?`两种读数：${entry.quantity} / ${entry.alternative}，请核对`:`原文：${entry.raw||'未识别'}`));
        list.append(row);
      }
      const clearLabel=element('label','inventory-ocr-clear'),clear=element('input');clear.type='checkbox';clearLabel.append(clear,document.createTextNode(' 完整背包：截图没出现的食材设为 0（默认不清零）'));
      const confirmLabel=element('label','inventory-ocr-confirm'),confirmed=element('input');confirmed.type='checkbox';confirmLabel.append(confirmed,document.createTextNode(' 我已核对名称和数量'));
      const summary=element('p','inventory-ocr-summary'),apply=element('button','inventory-ocr-apply','确认更新库存');apply.type='button';
      const refreshSummary=()=>{
        try{
          const next=buildStock(currentStock(),entries,{clearMissing:clear.checked,limit:800});
          if(clear.checked&&bagTotal!==null&&sum(next)!==bagTotal)throw new Error(`截图显示 ${bagTotal} 个，核对后是 ${sum(next)} 个；请检查漏项或数量。`);
          summary.textContent=`将更新 ${entries.filter(entry=>entry.include).length} 种食材；库存 ${sum(currentStock())} → ${sum(next)} / 800。${bagTotal===null?'':` 截图总数 ${bagTotal}。`}`;
          summary.dataset.error='false';apply.disabled=!confirmed.checked;
        }
        catch(error){summary.textContent=error.message;summary.dataset.error='true';apply.disabled=true}
      };
      clear.addEventListener('change',refreshSummary);confirmed.addEventListener('change',refreshSummary);
      apply.addEventListener('click',()=>{
        try{
          const before=copy(currentStock()),after=buildStock(before,entries,{clearMissing:clear.checked,limit:800});
          if(clear.checked&&bagTotal!==null&&sum(after)!==bagTotal)throw new Error(`截图背包总数为 ${bagTotal}，核对后为 ${sum(after)}；请检查漏识别或数量错误。`);
          if(!confirmed.checked)throw new Error('请先核对识别结果。');
          profile.update({ingredientStock:after},'ingredient-stock');saveBackup({before,after,at:new Date().toISOString()});updateUndo();
          preview.replaceChildren();entries=[];setStatus(`已更新食材库存：${sum(after)} / 800。若有误可撤销。`);
        }catch(error){setStatus(error.message,true)}
      });
      preview.append(list,clearLabel,confirmLabel,summary,apply);refreshSummary();
    }
    return {prepareOfflinePack,offlinePackReady};
  }
  return Object.freeze({OCR_CACHE,ASSETS,distance,matchName,extractNameRows,mergeObservations,buildStock,prepareOfflinePack,offlinePackReady,mount});
});
