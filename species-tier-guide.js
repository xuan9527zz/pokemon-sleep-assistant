(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_SPECIES_TIER_GUIDE=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const CATEGORY_ORDER=Object.freeze(['berry','ingredient','skill','special']);
  const TIER_ORDER=Object.freeze(['S','A','B','C']);
  const DYNAMIC_MEW_VARIANTS=Object.freeze([
    Object.freeze({id:'151',name:'梦幻（树果骤增）',selectedAllRounderSkillId:'berry-burst'}),
    Object.freeze({id:'151',name:'梦幻（其他技能）',selectedAllRounderSkillId:'other'})
  ]);

  function catalogIndex(catalog){
    return new Map((catalog&&Array.isArray(catalog.pokemon)?catalog.pokemon:[]).map(mon=>[String(mon.id),mon]));
  }

  function collapseEntries(entries){
    const result=[],byKey=new Map();
    entries.forEach(entry=>{
      const key=entry.name;
      if(byKey.has(key)){
        const target=byKey.get(key);
        target.ids.push(entry.id);
        target.formCount=target.ids.length;
        return;
      }
      const copy={...entry,ids:[entry.id],formCount:1};
      byKey.set(key,copy);
      result.push(copy);
    });
    return result;
  }

  function buildGuide(tiers,catalog){
    if(!tiers||!tiers.LISTS||typeof tiers.entryFor!=='function')throw new Error('缺少物种梯级数据源');
    const catalogById=catalogIndex(catalog);
    const sections=CATEGORY_ORDER.map(category=>{
      const source=tiers.LISTS[category]||{};
      const groups=TIER_ORDER.map(tier=>{
        const entries=(source[tier]||[]).map(id=>{
          const mon=catalogById.get(String(id));
          return {id:String(id),name:mon&&mon.name||`#${id}`,pokedexId:mon&&mon.pokedexId||id,specialty:mon&&mon.specialty||category,tier,category};
        });
        if(category==='special')DYNAMIC_MEW_VARIANTS.forEach(variant=>{
          const resolved=tiers.entryFor({finalFormId:variant.id,selectedAllRounderSkillId:variant.selectedAllRounderSkillId});
          if(resolved.category===category&&resolved.tier===tier){
            const mon=catalogById.get(variant.id);
            entries.push({id:variant.id,name:variant.name,pokedexId:mon&&mon.pokedexId||151,specialty:'all',tier,category,dynamic:true});
          }
        });
        return {tier,definition:tiers.definition(tier),entries:collapseEntries(entries)};
      });
      return {category,label:tiers.CATEGORY_LABELS[category]||category,groups};
    });
    return {source:tiers.SOURCE,sections};
  }

  function element(doc,tag,className,text){
    const node=doc.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  }

  function mount({catalog,tiers,picker,document:doc=(typeof document!=='undefined'?document:null)}={}){
    if(!doc)return null;
    const dialog=doc.querySelector('#speciesTierGuideDialog'),openButton=doc.querySelector('#speciesTierGuideOpen'),closeButton=doc.querySelector('#speciesTierGuideClose'),tabs=doc.querySelector('#speciesTierGuideTabs'),content=doc.querySelector('#speciesTierGuideContent');
    if(!dialog||!openButton||!closeButton||!tabs||!content)return null;
    const guide=buildGuide(tiers,catalog);
    const catalogById=catalogIndex(catalog);
    let active=guide.sections[0].category;

    function iconFor(entry){
      const mon=catalogById.get(entry.id)||entry;
      if(picker&&typeof picker.createIcon==='function')return picker.createIcon(mon,{size:'large'});
      return element(doc,'span','species-tier-guide-fallback',String(entry.name||'?').slice(0,1));
    }
    function render(){
      tabs.replaceChildren();
      guide.sections.forEach(section=>{
        const button=element(doc,'button',section.category===active?'active':'',section.label);
        button.type='button';button.dataset.category=section.category;button.setAttribute('role','tab');button.setAttribute('aria-selected',section.category===active?'true':'false');
        button.addEventListener('click',()=>{active=section.category;render()});tabs.append(button);
      });
      const section=guide.sections.find(item=>item.category===active)||guide.sections[0];
      const fragment=doc.createDocumentFragment();
      section.groups.forEach(group=>{
        const row=element(doc,'section',`species-tier-guide-row tier-${group.tier.toLowerCase()}`);
        const heading=element(doc,'div','species-tier-guide-rank'),badge=element(doc,'strong','',`${group.tier}级`),description=element(doc,'small','',group.definition.description);
        heading.append(badge,description);row.append(heading);
        const cards=element(doc,'div','species-tier-guide-cards');
        if(group.entries.length)group.entries.forEach(entry=>{
          const card=element(doc,'article','species-tier-guide-card'),copy=element(doc,'div',''),name=element(doc,'strong','',entry.name),meta=element(doc,'small','',entry.formCount>1?`${entry.formCount} 种形态共用梯级`:`#${entry.pokedexId}`);
          copy.append(name,meta);card.append(iconFor(entry),copy);cards.append(card);
        });
        else cards.append(element(doc,'p','species-tier-guide-empty','当前没有单独列入这一梯级的宝可梦'));
        row.append(cards);fragment.append(row);
      });
      content.replaceChildren(fragment);
    }
    function open(){render();dialog.showModal?dialog.showModal():dialog.setAttribute('open','')}
    function close(){dialog.close?dialog.close():dialog.removeAttribute('open')}
    openButton.addEventListener('click',open);closeButton.addEventListener('click',close);dialog.addEventListener('click',event=>{if(event.target===dialog)close()});
    return {open,close,render,guide};
  }

  return Object.freeze({CATEGORY_ORDER,TIER_ORDER,DYNAMIC_MEW_VARIANTS,catalogIndex,collapseEntries,buildGuide,mount});
});
