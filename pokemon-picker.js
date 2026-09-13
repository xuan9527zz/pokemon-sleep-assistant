(function(root,factory){
  'use strict';
  const api=factory(root);
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_POKEMON_PICKER=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(root){
  'use strict';
  const ROLE_LABELS={berry:'树果手',ingredient:'食材手',skill:'技能手',all:'全能手',unknown:'待核对'};
  // PokéSleep Super Wiki uses the same internal IDs as the generated local
  // catalogue, so regional, size and event forms can keep their own artwork.
  const LOCAL_NAME_IDS=Object.freeze({
    '皮卡丘（巫师帽）':'9001-1',
    '皮卡丘（万圣节）':'9001-1',
    '皮卡丘（圣诞）':'9002',
    '皮卡丘（佳节）':'9002',
    '皮卡丘（船长）':'9007',
    '伊布（圣诞）':'9004',
    '伊布（佳节）':'9004',
    '伊布（万圣节）':'9005',
    '乌波（城都）':'194',
    '乌波（帕底亚）':'7054',
    '乌波（帕底亚的样子）':'7054',
    '六尾（阿罗拉的样子）':'7006',
    '九尾（阿罗拉的样子）':'7007',
    '颤弦蝾螈（低调的样子）':'8001',
    '海豹球（节日）':'9006',
    '海豹球（佳节）':'9006'
  });
  const LOCAL_EXTENSIONS=Object.freeze({'701':'webp','957':'webp','958':'webp','959':'webp','9007':'webp'});
  const normalize=value=>String(value||'').trim().toLowerCase();
  function recordFor(mon,catalog){
    const rows=catalog&&Array.isArray(catalog.pokemon)?catalog.pokemon:[];
    return rows.find(row=>String(row.id)===String(mon&&mon.speciesId||''))||rows.find(row=>row.name===mon.name)||rows.find(row=>String(row.id)===String(mon&&mon.finalFormId||''))||null;
  }
  function iconUrl(mon,catalog){
    const record=recordFor(mon,catalog),speciesId=String(record&&record.id||mon&&mon.speciesId||LOCAL_NAME_IDS[String(mon&&mon.name||'')]||'').trim();
    const extension=LOCAL_EXTENSIONS[speciesId]||'png';
    return /^[\w-]+$/.test(speciesId)?`./assets/pokemon/${speciesId}.${extension}`:'';
  }
  function displayName(mon){return String(mon&&mon.nickname||'').trim()||String(mon&&mon.name||'未命名')}
  function searchableText(mon){return normalize([mon.id,`#${mon.id}`,mon.name,mon.nickname,mon.customNumber,mon.boxName,mon.specialtyLabel,ROLE_LABELS[mon.specialty],mon.ingredients,mon.subs,mon.note].join(' '))}
  function createIcon(mon,{catalog,size='medium',document:doc=(root&&root.document)}={}){
    if(!doc)return null;const wrap=doc.createElement('span');wrap.className=`pokemon-sprite pokemon-sprite-${size}`;wrap.setAttribute('aria-hidden','true');const url=iconUrl(mon,catalog);
    if(url){const img=doc.createElement('img');img.src=url;img.alt='';img.loading='lazy';img.addEventListener('error',()=>{img.remove();wrap.textContent=String(mon&&mon.name||'?').slice(0,1)});wrap.append(img)}else wrap.textContent=String(mon&&mon.name||'?').slice(0,1);return wrap;
  }
  function setButton(button,mon,options={}){
    if(!button)return;button.replaceChildren();if(!mon){button.classList.add('is-empty');button.textContent=options.emptyLabel||'选择宝可梦';return}button.classList.remove('is-empty');button.append(createIcon(mon,options));const copy=button.ownerDocument.createElement('span'),strong=button.ownerDocument.createElement('strong'),small=button.ownerDocument.createElement('small');strong.textContent=displayName(mon);small.textContent=`#${mon.id}${mon.nickname?` · ${mon.name}`:''} · Lv.${mon.lv}`;copy.append(strong,small);button.append(copy);
  }
  function mount(options={}){
    const doc=options.document||root&&root.document,dialog=doc&&doc.querySelector('#pokemonPickerDialog');if(!dialog)return null;
    const close=doc.querySelector('#pokemonPickerClose'),title=doc.querySelector('#pokemonPickerTitle'),search=doc.querySelector('#pokemonPickerSearch'),role=doc.querySelector('#pokemonPickerRole'),box=doc.querySelector('#pokemonPickerBox'),status=doc.querySelector('#pokemonPickerStatus'),grid=doc.querySelector('#pokemonPickerGrid');
    const catalog=options.catalog||root.POKEMON_SLEEP_CATALOG;let current={pokemon:[],selectedIds:[],disabledIds:[],onSelect:null,title:'选择宝可梦',allowCollection:false};
    function boxesFor(rows){return [...new Map(rows.filter(mon=>mon.boxId).map(mon=>[mon.boxId,mon.boxName||mon.boxId])).entries()]}
    function renderFilters(){
      const roles=[['','全部定位'],['berry','树果手'],['ingredient','食材手'],['skill','技能手'],['all','全能手']];role.replaceChildren(...roles.map(([value,label])=>{const option=doc.createElement('option');option.value=value;option.textContent=label;return option}));
      box.replaceChildren();const all=doc.createElement('option');all.value='';all.textContent='全部盒子';box.append(all);boxesFor(current.pokemon).forEach(([value,label])=>{const option=doc.createElement('option');option.value=value;option.textContent=label;box.append(option)});
    }
    function render(){
      const query=normalize(search.value),selected=new Set(current.selectedIds.map(String)),disabled=new Set(current.disabledIds.map(String));
      const rows=current.pokemon.filter(mon=>(current.allowCollection||mon.battleEligible!==false)&&(!role.value||mon.specialty===role.value)&&(!box.value||mon.boxId===box.value)&&(!query||searchableText(mon).includes(query))).sort((a,b)=>Number(Boolean(b.nickname))-Number(Boolean(a.nickname))||displayName(a).localeCompare(displayName(b),'zh-CN')||Number(a.id)-Number(b.id));
      grid.replaceChildren();rows.forEach(mon=>{const button=doc.createElement('button'),copy=doc.createElement('span'),name=doc.createElement('strong'),meta=doc.createElement('small');button.type='button';button.className=`pokemon-picker-card role-${mon.specialty||'unknown'}${selected.has(String(mon.id))?' is-selected':''}`;button.disabled=disabled.has(String(mon.id));button.append(createIcon(mon,{catalog,document:doc,size:'large'}));name.textContent=displayName(mon);meta.textContent=`#${mon.id}${mon.nickname?` · ${mon.name}`:''} · Lv.${mon.lv} · ${ROLE_LABELS[mon.specialty]||'待核对'}`;copy.append(name,meta);button.append(copy);button.addEventListener('click',()=>{if(typeof current.onSelect==='function')current.onSelect(String(mon.id),mon);dialog.close&&dialog.close()});grid.append(button)});status.textContent=`找到 ${rows.length} 只${current.allowCollection?'':'可实战'}个体`;
      if(!rows.length){const empty=doc.createElement('p');empty.className='pokemon-picker-empty';empty.textContent='没有符合这些筛选条件的个体。';grid.append(empty)}
    }
    function open(config={}){current={...current,...config,pokemon:Array.isArray(config.pokemon)?config.pokemon:current.pokemon,selectedIds:config.selectedIds||[],disabledIds:config.disabledIds||[]};title.textContent=current.title||'选择宝可梦';search.value='';renderFilters();render();dialog.showModal?dialog.showModal():dialog.setAttribute('open','');setTimeout(()=>search.focus(),20)}
    search.addEventListener('input',render);role.addEventListener('change',render);box.addEventListener('change',render);close.addEventListener('click',()=>dialog.close?dialog.close():dialog.removeAttribute('open'));dialog.addEventListener('click',event=>{if(event.target===dialog&&dialog.close)dialog.close()});
    return {open,close:()=>dialog.close&&dialog.close(),render,createIcon:(mon,config={})=>createIcon(mon,{catalog,document:doc,...config}),setButton:(button,mon,config={})=>setButton(button,mon,{catalog,document:doc,...config})};
  }
  return Object.freeze({ROLE_LABELS,LOCAL_NAME_IDS,LOCAL_EXTENSIONS,recordFor,iconUrl,displayName,searchableText,createIcon,setButton,mount});
});
