(() => {
  const input=document.querySelector('#catalog-search');
  if(!input)return;
  const items=[...document.querySelectorAll('.catalog-item')];
  const filters=[...document.querySelectorAll('[data-filter]')];
  let selected=filters.find(b=>b.dataset.key===location.hash.slice(1))?.dataset.filter || '全部';
  const update=()=>{
    const words=input.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visible=0;
    for(const item of items){
      const matches=(selected==='全部'||item.dataset.category===selected)&&words.every(w=>item.textContent.toLocaleLowerCase().includes(w));
      item.hidden=!matches;
      if(matches)visible++;
    }
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===selected)));
    document.querySelector('[data-count]').textContent=`${visible} 项内容`;
    document.querySelector('[data-empty]').hidden=visible!==0;
    document.querySelectorAll('[data-catalog-group]').forEach(group=>{
      group.hidden=![...group.querySelectorAll('.catalog-item')].some(item=>!item.hidden);
    });
  };
  filters.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.filter;update()}));
  input.addEventListener('input',update);
  document.querySelector('[data-clear]').addEventListener('click',()=>{input.value='';update();input.focus()});
  window.addEventListener('hashchange',()=>{selected=filters.find(b=>b.dataset.key===location.hash.slice(1))?.dataset.filter||'全部';update()});
  update();
})();
