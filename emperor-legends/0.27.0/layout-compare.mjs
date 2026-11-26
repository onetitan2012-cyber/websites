import { createDialogueRhythm } from './dialogue-rhythm.mjs?v=mobile-reading1';
const samples = { birth: '第一章开场', board: '灯下藏身', orders: '第五章', emperor: '终章' };
// Match each portrait to the figure used in that scene. Narration and documents keep their text treatment.
const childCast = { '政':'boy', '丹':'danBoy', '冉伯':'ran', '赵氏':'mother' };
const cast = {
  opening: { '赵氏':'mother' }, birth: { '赵氏':'mother', '异人':'father' },
  shelter: { '赵氏':'mother' }, pottery:childCast, west:childCast, lane:childCast,
  qin: { '赵氏':'mother', '子楚':'father', '政':'boy', '管事':'steward' },
  court: { '政':'young', '车夫':'driver', '吕不韦':'minister', '文书':'scribe' },
  qinDesk: { '政':'king', '值夜小吏':'official' },
  crown: { '政':'king', '赵太后':'courtMother', '传令官':'official', '值守领班':'keeper', '近侍宫人':'resident' },
  canal: { '农妇':'resident', '郑国':'keeper', '禾生':'guest' },
  petition: { '政':'king', '李斯':'lisi', '文书':'official', '守吏':'keeper', '客士':'guest' },
  handover: { '秦使':'official', '韩籍库吏':'keeper', '里人':'resident', '老妇':'elder' },
  return: { '政':'king', '书佐':'official', '邻人':'resident' },
  friend: { '丹':'yan', '荆轲':'guest', '秦舞阳':'li', '政':'king', '秦王':'king', '书佐':'official', '记忆中的丹':'danBoy' },
  flood: { '撑排人':'keeper', '小满':'li', '陶婶':'elder', '哥哥':'guest', '阿荇':'resident' },
  chu: { '政':'king', '李信':'li', '王翦':'wang', '书佐':'official', '车夫':'keeper', '渡妇':'resident', '孩子':'guest' },
  yan: { '政':'king', '书佐':'official', '燕人':'resident', '代人':'keeper' },
  qi: { '秦使':'official', '齐吏':'keeper', '市人':'resident' },
  qiDesk: { '市人':'resident', '掌书':'keeper', '新吏':'li' },
  emperor: { '政':'king', '廷尉李斯':'lisi', '门下小吏':'keeper' },
};

export function addPortrait(bubble, scene, speaker) {
  const {world, storyBeat} = scene.dataset;
  const role = world === 'qin' && speaker === '政' && storyBeat.startsWith('closing-')
    ? 'young' : cast[world]?.[speaker];
  if (!role) return;
  const face = document.createElement('img');
  face.className = 'speaker-portrait';
  face.alt = '';
  face.src = new URL('./portraits/' + role + '.png', import.meta.url);
  bubble.prepend(face);
}

function enableStoryKeys() {
  const content = document.querySelector('#content');
  // A tap can move focus to the next page's primary button before it is painted.
  window.addEventListener('pointerdown', event => {
    document.body.toggleAttribute('data-touch-reading', event.pointerType === 'touch' || event.pointerType === 'pen');
  }, {capture:true, passive:true});
  let heldEnter = false;
  window.addEventListener('keyup', event => { if (event.key === 'Enter') heldEnter = false; });
  window.addEventListener('blur', () => { heldEnter = false; });
  window.addEventListener('keydown', event => {
    document.body.removeAttribute('data-touch-reading');
    if (document.body.dataset.layout !== 'new' || event.defaultPrevented || event.isComposing ||
        event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const enter = event.key === 'Enter';
    if (enter && (heldEnter || event.repeat)) { event.preventDefault(); return; }
    if (document.querySelector('dialog[open]') || document.body.dataset.phase === 'game' ||
        event.target.closest?.('input,textarea,select,summary,[contenteditable=true]')) return;
    const focusedControl = event.target.closest?.('button,a');
    if (focusedControl && !content.contains(focusedControl)) return;
    if (document.body.dataset.reading) {
      if (enter) { heldEnter = true; event.preventDefault(); }
      return;
    }
    const choices = Array.from(content.querySelectorAll('.choices .choice:enabled')).filter(option => getComputedStyle(option).visibility === 'visible');
    if (choices.length && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
      const index = choices.indexOf(document.activeElement);
      const next = index < 0 ? 0 : (index + (event.key === 'ArrowDown' ? 1 : -1) + choices.length) % choices.length;
      event.preventDefault();
      choices[next].focus();
      return;
    }
    if (!enter) return;
    const action = focusedControl || choices[0] || content.querySelector('.actions .primary:enabled');
    if (!action || !action.getClientRects().length || action.closest('[inert]') || getComputedStyle(action).visibility !== 'visible') return;
    heldEnter = true;
    event.preventDefault();
    action.click();
  });
}

export function mountStoryReading() {
  document.body.dataset.layout = 'new';
  enableStoryKeys();
  return createDialogueRhythm();
}

export function mountComparison(sample, rhythm) {
  // Carry only genuinely played samples across this tab's scripted transitions.
  // A direct or shared link starts a separate excerpt.
  const arrival = new URL(location.href);
  const token = arrival.searchParams.get('trail');
  let recent = history.state?.sampleTrail || [];
  if (token) {
    try {
      const handoff = JSON.parse(sessionStorage.getItem('qin-sample-transition'));
      if (handoff?.token === token && handoff.to === sample) {
        recent = handoff.recent;
        sessionStorage.removeItem('qin-sample-transition');
      }
    } catch { /* Private browsing can disable session storage. */ }
    arrival.searchParams.delete('trail');
    history.replaceState({...history.state, sampleTrail:recent}, '', arrival);
  }
  const bar = document.createElement('div');
  bar.className = 'comparison-bar';
  bar.innerHTML = '<nav aria-label="布局对照场景"></nav><div role="group" aria-label="布局版本"><button type="button" data-version="old">原版</button><button type="button" data-version="new">新版</button></div>';
  const nav = bar.querySelector('nav');
  const switches = bar.querySelectorAll('button');
  function sampleURL(key) {
    const url = new URL(location.href);
    url.searchParams.set('preview', 'layout-' + key);
    url.searchParams.set('layout', document.body.dataset.layout);
    return url;
  }
  for (const [key, title] of Object.entries(samples)) {
    const link = document.createElement('a');
    link.textContent = title;
    link.dataset.sample = key;
    if (key === sample) link.setAttribute('aria-current','page');
    nav.append(link);
  }
  function apply(which) {
    if (which === 'old') rhythm.complete();
    document.body.dataset.layout = which;
    for (const item of switches) item.setAttribute('aria-pressed',String(item.dataset.version === which));
    for (const link of nav.children) link.href = sampleURL(link.dataset.sample);
  }
  for (const item of switches) item.addEventListener('click',() => {
    apply(item.dataset.version);
    history.replaceState(history.state,'',sampleURL(sample));
  });
  document.querySelector('.masthead').after(bar);
  apply(new URL(location.href).searchParams.get('layout') === 'old' ? 'old' : 'new');
  return {
    sample,
    recent,
    visit(key) {
      const url = sampleURL(key);
      if (key !== sample) {
        const token = Math.random().toString(36).slice(2);
        const entry = {when:document.querySelector('#chapter-date').textContent,
          title:'试玩片段 · ' + samples[sample]};
        try {
          sessionStorage.setItem('qin-sample-transition', JSON.stringify({token, to:key, recent:[...recent,entry].slice(-2)}));
          url.searchParams.set('trail', token);
        } catch { /* The transition also works without a local trail. */ }
      }
      location.assign(url);
    },
  };
}
