(() => {
  const routes={all:'archive.html',intel:'collections/intel.html',vr:'collections/vr.html',game:'collections/game-design.html',football:'collections/football.html',culture:'collections/culture.html',original:'works.html',calligraphy:'collections/calligraphy.html'};
  const preserve=()=>{
    let key=location.hash.slice(1).replace(/^count-/,'');
    if(['grid','empty','section-label','total-count'].includes(key))key='all';
    if(key==='intel-section')key='intel';
    if(routes[key])location.replace(routes[key]);
  };
  preserve();window.addEventListener('hashchange',preserve);
})();
