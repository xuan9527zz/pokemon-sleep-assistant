(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  root.POKEMON_SLEEP_INGREDIENTS=api;
})(typeof window!=='undefined'?window:globalThis,function(){
  'use strict';

  const ICON_BASE='./assets/ingredients/';
  const INGREDIENTS=Object.freeze({
    '品鲜蘑菇':'mushroom.png',
    '暖暖姜':'ginger.png',
    '甜甜蜜':'honey.png',
    '好眠番茄':'tomato.png',
    '美味尾巴':'tail.png',
    '火辣香草':'herb.png',
    '沉甸甸南瓜':'pumpkin.webp',
    '嫩亮酪梨':'avocado.webp',
    '特选蛋':'egg.png',
    '特选苹果':'apple.png',
    '纯粹油':'oil.png',
    '粗枝大葱':'leek.png',
    '窝心洋芋':'potato.png',
    '豆制肉':'bean-meat.png',
    '醒脑咖啡豆':'coffee.png',
    '哞哞鲜奶':'milk.png',
    '放松可可':'cacao.png',
    '萌绿玉米':'corn.png',
    '萌绿大豆':'soybean.png'
  });
  const ALIASES=Object.freeze({
    '蘑菇':'品鲜蘑菇','蜂蜜':'甜甜蜜','番茄':'好眠番茄','香草':'火辣香草',
    '南瓜':'沉甸甸南瓜','牛油果':'嫩亮酪梨','酪梨':'嫩亮酪梨','青色果实':'嫩亮酪梨',
    '蛋':'特选蛋','苹果':'特选苹果','储存油':'纯粹油','大葱':'粗枝大葱',
    '马铃薯':'窝心洋芋','土豆':'窝心洋芋','肉':'豆制肉','咖啡':'醒脑咖啡豆',
    '牛奶':'哞哞鲜奶','鲜奶':'哞哞鲜奶','可可':'放松可可','玉米':'萌绿玉米','大豆':'萌绿大豆',
    '呆呆兽尾巴':'美味尾巴','尾巴':'美味尾巴'
  });
  const SAFE_TEXT_ALIASES=Object.freeze(Object.fromEntries(
    Object.entries(ALIASES).filter(([name])=>name.length>=2)
  ));
  const TEXT_NAMES=Object.freeze([...new Set([
    ...Object.keys(INGREDIENTS),...Object.keys(SAFE_TEXT_ALIASES)
  ])].sort((a,b)=>b.length-a.length||a.localeCompare(b,'zh-CN')));
  const escapeRegExp=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  const TEXT_PATTERN=new RegExp(TEXT_NAMES.map(escapeRegExp).join('|'),'g');

  function canonicalize(name){
    const clean=String(name||'').trim();
    if(Object.hasOwn(INGREDIENTS,clean))return clean;
    return ALIASES[clean]||null;
  }

  function iconPath(name){
    const canonical=canonicalize(name);
    return canonical?ICON_BASE+INGREDIENTS[canonical]:null;
  }

  function create(name,{label,suffix='',className=''}={}){
    if(typeof document==='undefined')return null;
    const canonical=canonicalize(name);
    if(!canonical)return document.createTextNode(`${label??name}${suffix}`);
    const wrapper=document.createElement('span');
    wrapper.className=['ingredient-visual',className].filter(Boolean).join(' ');
    wrapper.dataset.ingredientIcon=canonical;
    const img=document.createElement('img');
    img.className='ingredient-icon';img.src=iconPath(canonical);img.alt='';img.loading='lazy';img.decoding='async';img.width=28;img.height=28;
    img.addEventListener('error',()=>img.classList.add('is-missing'),{once:true});
    const text=document.createElement('span');text.className='ingredient-visual-label';text.textContent=`${label??name}${suffix}`;
    wrapper.append(img,text);
    return wrapper;
  }

  function decorate(root){
    if(typeof document==='undefined'||!root)return 0;
    const owner=root.ownerDocument||document;
    const walker=owner.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      if(!node.nodeValue||!node.nodeValue.trim())return NodeFilter.FILTER_REJECT;
      const parent=node.parentElement;
      if(!parent||parent.closest('.ingredient-visual,[data-mon],.pokemon-name-cell,.pokemon-name-text,.current-team-saved-members')||parent.matches('script,style,option,select,textarea,input'))return NodeFilter.FILTER_REJECT;
      TEXT_PATTERN.lastIndex=0;
      return TEXT_PATTERN.test(node.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    let replacements=0;
    nodes.forEach(node=>{
      const value=node.nodeValue,fragment=owner.createDocumentFragment();let last=0,match;
      TEXT_PATTERN.lastIndex=0;
      while((match=TEXT_PATTERN.exec(value))){
        if(match.index>last)fragment.append(owner.createTextNode(value.slice(last,match.index)));
        fragment.append(create(match[0],{label:match[0]}));
        last=match.index+match[0].length;replacements++;
      }
      if(last<value.length)fragment.append(owner.createTextNode(value.slice(last)));
      node.replaceWith(fragment);
    });
    return replacements;
  }

  return {ICON_BASE,INGREDIENTS,ALIASES,TEXT_NAMES,canonicalize,iconPath,create,decorate};
});
