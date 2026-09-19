(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  if(root)root.POKEMON_SLEEP_SPECIES_TIERS=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';

  const SOURCE='user-tier-list-2026-09-20';
  const TIER_ORDER=Object.freeze({S:0,A:1,B:2,C:3});
  const TIER_DEFINITIONS=Object.freeze({
    S:Object.freeze({tier:'S',label:'S级',description:'同定位中最强，作为主要严选目标。'}),
    A:Object.freeze({tier:'A',label:'A级',description:'同岛屿有更好替代，或食材需求不高但仍是该食材的优秀产手。'}),
    B:Object.freeze({tier:'B',label:'B级',description:'堪堪可用，按缺口和已有投入决定。'}),
    C:Object.freeze({tier:'C',label:'C级',description:'不列入主动严选范围；收藏、限定、闪光和已有投入仍单独保留判断。'})
  });
  const CATEGORY_LABELS=Object.freeze({berry:'树果手',ingredient:'食材手',skill:'技能手',special:'幻之／传说'});

  const LISTS=Object.freeze({
    berry:Object.freeze({
      S:Object.freeze(['365','154','254','26','160','157','395','373']),
      A:Object.freeze(['959','7007','697','260','461','392','208']),
      B:Object.freeze(['628','85','38','229','178','257']),
      C:Object.freeze(['36','105','20','289','9004','57','518','354','778','9007','9001-1','9001-2','334','24','12'])
    }),
    ingredient:Object.freeze({
      S:Object.freeze(['738','3','248','330','9','760','149','6','454','711-1','711-2','711-3','711-4']),
      A:Object.freeze(['908','743','242','442','76','911','405','980','306','83','845']),
      B:Object.freeze(['975','225','195','764','780','94','71','303']),
      C:Object.freeze(['127','115','914','51','460','122','359','132'])
    }),
    skill:Object.freeze({
      S:Object.freeze(['282','702']),
      A:Object.freeze(['389','923','9006']),
      B:Object.freeze(['700','40']),
      C:Object.freeze([])
    }),
    special:Object.freeze({
      S:Object.freeze(['491','488','380']),
      A:Object.freeze(['245','243','244']),
      B:Object.freeze(['150','381']),
      C:Object.freeze([])
    })
  });
  const NAME_FALLBACKS=Object.freeze({超梦:Object.freeze({tier:'B',category:'special'})});
  const byId=new Map();
  Object.entries(LISTS).forEach(([category,tiers])=>Object.entries(tiers).forEach(([tier,ids])=>ids.forEach(id=>{
    if(byId.has(id))throw new Error(`梯级表存在重复最终形态：${id}`);
    byId.set(id,Object.freeze({tier,category,listed:true,source:SOURCE}));
  })));

  function normalizeSkillId(value){return String(value||'').trim().toLowerCase()}
  function isBerryBurst(value){return normalizeSkillId(value)==='berry-burst'||String(value||'').includes('树果骤增')}
  function entryFor(input={}){
    const id=String(input.finalFormId||input.id||'').trim(),name=String(input.finalFormNameZh||input.name||'').trim();
    if(id==='151'||name==='梦幻'){
      const tier=isBerryBurst(input.selectedAllRounderSkillId||input.selectedSkillId||input.mainSkill)?'S':'B';
      return Object.freeze({tier,category:'special',listed:true,source:SOURCE,dynamic:true});
    }
    const listed=byId.get(id)||NAME_FALLBACKS[name];
    if(listed)return listed;
    const category=['berry','ingredient','skill'].includes(input.specialty)?input.specialty:'special';
    return Object.freeze({tier:'C',category,listed:false,source:SOURCE});
  }
  function tierFor(input){return entryFor(input).tier}
  function order(value){return TIER_ORDER[String(value||'C')]??TIER_ORDER.C}
  function compare(left,right){return order(left)-order(right)}
  function definition(value){return TIER_DEFINITIONS[String(value||'C')]||TIER_DEFINITIONS.C}

  return Object.freeze({SOURCE,TIER_ORDER,TIER_DEFINITIONS,CATEGORY_LABELS,LISTS,entryFor,tierFor,order,compare,definition,isBerryBurst});
});
