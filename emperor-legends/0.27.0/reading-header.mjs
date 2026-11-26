// The reading header shares the live date and chapter labels with every scene.
export function mountReadingHeader({sample, recent}) {
  const byId = id => document.getElementById(id);
  const shell = byId('game-shell');
  const chapter = shell.querySelector('.chapter');
  shell.classList.add('reading-shell');
  const panel = document.createElement('dialog');
  panel.id = 'journey-sheet';
  panel.setAttribute('aria-labelledby','journey-heading');
  panel.innerHTML = `<form method="dialog"><button class="text-button dismiss">收起</button></form>
    <h2 id="journey-heading">行迹</h2><ol class="nearby-chapters"></ol>
    <div class="journey-options"></div>`;
  document.body.append(panel);
  const options = panel.querySelector('.journey-options');
  options.append(byId('checkpoint-bar'), shell.querySelector('.masthead .tools'));
  if (new URLSearchParams(location.search).get('preview') === 'stones') {
    const label = document.createElement('label');
    label.className = 'pottery-comparison';
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'pottery-engraving';
    toggle.checked = true;
    label.append(toggle, '显示陶坊章名刻线');
    options.append(label);
  }
  const comparison = shell.querySelector('.comparison-bar');
  const links = comparison || shell.querySelector('footer nav');
  if (links) {
    const tools = document.createElement('details');
    const title = document.createElement('summary');
    title.textContent = '试玩工具';
    tools.append(title, links);
    options.append(tools);
  }
  const trigger = document.createElement('button');
  trigger.id = 'journey-toggle';
  trigger.type = 'button';
  trigger.textContent = '行迹';
  trigger.setAttribute('aria-haspopup','dialog');
  trigger.setAttribute('aria-controls',panel.id);
  const actions = document.createElement('nav');
  actions.className = 'reading-actions';
  actions.setAttribute('aria-label','阅读工具');
  const log = byId('log');
  log.setAttribute('aria-haspopup','dialog');
  log.setAttribute('aria-controls','notes');
  actions.append(log, trigger);
  chapter.append(actions);
  trigger.addEventListener('click', () => {
    const list = panel.querySelector('ol');
    list.replaceChildren();
    const current = byId('chapter-number').textContent;
    function item(when, title, note, now) {
      const row = document.createElement('li');
      const date = document.createElement('small');
      date.textContent = when;
      const name = document.createElement('b');
      name.textContent = title;
      row.append(date, name);
      if (note) {
        const text = document.createElement('p');
        text.textContent = note;
        row.append(text);
      }
      if (now) row.setAttribute('aria-current','step');
      list.append(row);
    }
    for (const entry of recent()) item(entry.when, entry.title, entry.note, false);
    item('此刻 · ' + byId('chapter-date').textContent,
      current + '　' + byId('chapter-name').textContent,
      sample ? '独立试玩 · ' + byId('place').textContent : byId('place').textContent, true);
    panel.showModal();
  });
  // Return focus to the reading header when the nested history sheet closes.
  let notesReturn = trigger;
  log.addEventListener('click', () => { notesReturn = log; });
  byId('history').addEventListener('click', () => {
    notesReturn = trigger;
    panel.close();
  }, {capture:true});
  byId('notes').addEventListener('close', () => {
    if (document.activeElement === document.body) notesReturn.focus({preventScroll:true});
  });
  comparison?.addEventListener('click', event => {
    if (event.target.closest('[data-version]')) panel.close();
  });
}

export function openTitleScreen() {
  const cover = document.createElement('dialog');
  cover.id = 'title-screen';
  cover.setAttribute('aria-labelledby','game-title');
  cover.innerHTML = `<div class="title-lamplight" aria-hidden="true"></div><div class="title-copy"><p class="title-cycle">始 皇 篇</p>
    <h1 id="game-title">帝王传说</h1>
    <p class="title-place">公元前 259 年 · 邯郸</p>
    <form method="dialog"><button class="title-start" autofocus>从邯郸开始</button></form>
    <button class="lamp-play" type="button" aria-pressed="false">播放灯影</button></div>`;
  const play = cover.querySelector('.lamp-play');
  play.addEventListener('click', () => {
    const playing = cover.toggleAttribute('data-play-lamp');
    play.setAttribute('aria-pressed',String(playing));
    play.textContent = playing ? '暂停灯影' : '播放灯影';
  });
  document.body.append(cover);
  cover.addEventListener('cancel', event => event.preventDefault());
  cover.showModal();
  return new Promise(resolve => cover.addEventListener('close', () => {cover.remove(); resolve();}, {once:true}));
}
