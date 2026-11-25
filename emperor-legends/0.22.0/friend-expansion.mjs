import { createFolioGame, FOLIO_MARKS, playMove, SIZE } from './board.mjs';

export const folioLabel = method => method === 'self' ? '亲手收录' : '书佐补录';
const source = '《史记·刺客列传》记太子丹得赵人徐夫人之匕首，刃上有毒。图样为本作拟绘。';
export function showFolioCard(tag, layers, method) {
  const paper = tag('figure', 'yan-paper');
  paper.dataset.layers = layers;
  const print = tag('div', 'yan-print');
  print.setAttribute('aria-hidden', 'true');
  const title = ['器形待辨', '外缘初现', '题签待揭', '燕匕'][layers];
  paper.append(print, tag('figcaption', '', title));
  if (layers === 3) paper.append(tag('p', '', source), tag('small', '', folioLabel(method)));
  return paper;
}

function openFolio(ui, after) {
  const { tag, button, actions, content, setPhase, pieces, collect, tone } = ui;
  setPhase('folio', '燕地物记', '案上有物');
  let state = createFolioGame();
  let selected = null;
  let busy = false;
  const grid = tag('div', 'folio-grid');
  grid.setAttribute('aria-label', '揭开物件图的棋盘');
  const card = tag('div');
  const status = tag('p', 'folio-status');
  status.setAttribute('role', 'status');
  const row = actions();
  const cells = state.board.map((_, index) => {
    const cell = button('', 'cell', () => pick(index));
    cell.dataset.index = index;
    cell.append(tag('span', 'chip'));
    grid.append(cell);
    return cell;
  });
  content.replaceChildren(card, status, grid, row);
  function paint(values = state.board) {
    cells.forEach((cell, index) => {
      const marked = index === FOLIO_MARKS[state.collected];
      cell.classList.toggle('folio-mark', marked);
      cell.classList.toggle('selected', index === selected);
      cell.firstChild.className = 'chip ' + pieces[values[index]].style;
      cell.setAttribute('aria-label', (Math.floor(index / SIZE) + 1) + '行' + (index % SIZE + 1) + '列，' +
        pieces[values[index]].name + (marked ? '，墨框' : ''));
      cell.setAttribute('aria-pressed', String(index === selected));
    });
  }
  function reveal(layers) {
    const notes = ['案上摊着一页物记。器形藏在纸纹里。','第一片纸纹退去，露出了器物的外缘。','器物已显出全形，页底还空着一行。','题签落定。燕匕收进了传说卷。'];
    ui.updateScene('friend','传说卷 · 燕地物记',notes[layers],{ storyBeat: 'folio' + layers });
  }
  function complete(method) {
    reveal(3);
    collect(method);
    grid.hidden = true;
    card.replaceChildren(showFolioCard(tag, 3, method));
    status.textContent = '书页收好。翻过去，是这一行人的名册。';
    row.replaceChildren(button('翻过这一页', 'action-button primary', after));
    row.firstChild.focus({ preventScroll: true });
  }
  const assist = () => complete('scribe');
  function render(feedback = '') {
    if (state.collected === 3) return complete('self');
    reveal(state.collected);
    card.replaceChildren(showFolioCard(tag, state.collected));
    paint();
    status.textContent = feedback + '余 ' + state.moves + ' 手。在墨框上下左右消除，' +
      (state.collected < 2 ? '显出器形。' : '揭开题签。');
    if (state.moves === 0) {
      grid.inert = true;
      status.textContent = '图页还缺' + (state.collected < 2 ? '器形和题签。' : '一行题签。');
      row.replaceChildren(button('重试这张图页', 'action-button', () => openFolio(ui, after)),
        button('请书佐补全', 'action-button primary', assist));
    } else {
      row.replaceChildren(button('请书佐补全', 'text-button', assist));
    }
  }
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function exchange(a, b) {
    const turn = playMove(state, a, b);
    selected = null;
    if (!turn) { paint(); status.textContent = '这两枚不能连成三枚，再选一对。余 ' + state.moves + ' 手。'; return; }
    busy = true;
    row.inert = true;
    const old = state.collected;
    const quick = matchMedia('(prefers-reduced-motion: reduce)').matches;
    paint();
    for (const wave of turn.waves) {
      for (const index of wave.removed) cells[index].classList.add('folio-hit');
      tone(270 + wave.collected * 38, 0.12, 0.018);
      await wait(quick ? 0 : 165);
      for (const index of wave.removed) cells[index].classList.remove('folio-hit');
      paint(wave.board);
    }
    state = turn.state;
    busy = false;
    row.inert = false;
    render(state.collected > old ? ['','图边露出来了。','轮廓齐了，只差题签。',''][state.collected] : '纸纹还在。');
  }
  function pick(index) {
    if (busy || !state.moves || grid.hidden) return;
    if (selected === null || selected === index) { selected = selected === index ? null : index; paint(); return; }
    const a = selected;
    const adjacent = Math.abs(a % SIZE - index % SIZE) + Math.abs(Math.floor(a / SIZE) - Math.floor(index / SIZE)) === 1;
    if (adjacent) void exchange(a, index);
    else { selected = index; paint(); }
  }
  let drag;
  let ignoreClick = false;
  grid.addEventListener('pointerdown', e => {
    const cell = e.target.closest('.cell');
    ignoreClick = false;
    if (cell && !busy) drag = { x: e.clientX, y: e.clientY, index: Number(cell.dataset.index) };
  });
  grid.addEventListener('pointercancel', () => { drag = null; });
  grid.addEventListener('pointerup', e => {
    if (!drag || busy) return;
    const { x, y, index } = drag;
    drag = null;
    const dx = e.clientX - x, dy = e.clientY - y;
    if (Math.max(Math.abs(dx),Math.abs(dy)) < 16) return;
    ignoreClick = true;
    const across = Math.abs(dx) > Math.abs(dy);
    const next = index + (across ? Math.sign(dx) : Math.sign(dy) * SIZE);
    if (next >= 0 && next < cells.length && (!across || Math.floor(index / SIZE) === Math.floor(next / SIZE))) void exchange(index, next);
  });
  grid.addEventListener('click', e => { if (ignoreClick) { ignoreClick = false; e.stopImmediatePropagation(); } }, true);
  render();
}

export function playFriendExpansion(ui, opening, hall) {
  const { tag, button, actions, content, setPhase, sequence, updateScene, map, tone } = ui;
  const scene = document.getElementById('scene');
  function sceneAction(label, action) {
    const hotspot = button(label, 'friend-hotspot', action);
    scene.append(hotspot);
  }
  function shot(title, place, beat, note) {
    scene.querySelector('.friend-hotspot')?.remove();
    setPhase('chapter', place, title);
    updateScene('friend', place, note, { storyBeat: beat });
  }
  function page(lines, next, label) { sequence(lines.map(([speaker, line]) => ({ speaker, line })), next, label); }
  function door() {
    shot('客未至', '燕国 · 驿舍', 'door', '门内站着秦舞阳。荆轲身旁的席，还空着。');
    const leaf = tag('div', 'party-leaf');
    leaf.append(tag('span', '', '副使　秦舞阳'), tag('span', 'empty-place', '同行客'));
    const open = button('推开驿门', 'action-button primary', () => {
      shot('客未至', '燕国 · 驿舍', 'visitor', '丹站在门槛外，先往那张空席看了一眼。');
      page([['丹','荆卿，天快尽了。要是还得等，我先让舞阳动身？'],
        ['荆轲','我约了一个人同行。他住得远，还没到。'],['丹','我明日回城，人家还会问我。'],
        ['荆轲','……舞阳，走吧。']], river, '到易水边');
    });
    content.replaceChildren(leaf, tag('p','body-text','门外响起脚步。秦舞阳起身，把门口让了出来。'), actions(open));
    sceneAction('推门', () => open.click());
    open.focus({ preventScroll: true });
  }
  function river() {
    shot('易水一曲', '燕国 · 易水', 'river', '高渐离把筑放稳。荆轲在岸边停下。');
    page([['叙事','送行的人都穿着白衣。高渐离举手，等四下静了。']], () => {
      shot('易水一曲', '燕国 · 易水', 'song', '筑声起。荆轲回过头，和着拍子唱了一句。');
      tone(196,.55,.04); tone(247,.35,.032,.42); tone(220,.65,.034,.74);
      page([['荆轲','风萧萧兮易水寒，壮士一去兮不复还。']], () => {
        shot('送行的人', '燕国 · 易水', 'departed', '车声渐远。岸边只剩高渐离，手仍搁在弦上。');
        page([['叙事','筑声先停了。又过了一会儿，车轮声也听不见了。']], court, '随燕使入咸阳');
      }, '目送车行');
    }, '点弦起音');
    sceneAction('拨弦', () => content.querySelector('.primary').click());
  }
  function court() {
    shot('燕使入殿', '咸阳 · 秦廷', 'audience', '殿上众人都看向秦舞阳。荆轲转过脸，替他说话。');
    page([['叙事','在燕驿门边等了一夜的秦舞阳，到了殿前，忽然变了脸色。'],
      ['荆轲','他从北方来，没见过大王。请容他把使事办完。'],['秦王','图呢？']], unfold, '看督亢图');
  }
  function unfold() {
    const place = '咸阳 · 秦廷';
    const note = '卷上先露出一段河道。向右慢慢展图，松手可停。';
    shot('咸阳展图', place, 'map', note);
    const slider = tag('input', 'tribute-slider');
    slider.type = 'range'; slider.min = 0; slider.max = 100; slider.value = 0;
    slider.setAttribute('aria-label','向右展开督亢图');
    const finish = button('展完', 'action-button primary', () => finishMap());
    const caption = tag('p', 'body-text', note);
    const apply = value => {
      map(value / 100);
      caption.textContent = value > 78 ? '河道到了尽头，余下一段素地。' : value > 32 ? '河道从卷中穿过，题字渐渐露出来。' : note;
      updateScene('friend', place, caption.textContent, { storyBeat: 'map' });
    };
    function finishMap() {
      releaseSurface();
      apply(100);
      shot('卷尽', place, 'mapEnd', '卷尾露出图册里见过的轮廓。众人惊起，殿上一时无声。');
      page([['叙事','案边的水盏倒了。水淌下案角，殿后的人只听见那一声响。']], hall, '听殿后的动静');
    }
    slider.addEventListener('input', () => { const value = Number(slider.value); if (value === 100) finishMap(); else apply(value); });
    const surface = document.getElementById('scene');
    const listeners = new AbortController();
    const options = { signal: listeners.signal };
    let drag;
    function releaseSurface() {
      listeners.abort();
      surface.classList.remove('unfold-surface');
    }
    surface.classList.add('unfold-surface');
    surface.addEventListener('pointerdown', e => {
      if (e.target.closest('button, a')) return;
      drag = { x: e.clientX, start: Number(slider.value) };
      surface.setPointerCapture(e.pointerId);
    }, options);
    surface.addEventListener('pointermove', e => {
      if (!drag) return;
      const distance = Math.max(110, surface.clientWidth * .38);
      const value = Math.round(Math.min(100, Math.max(drag.start, drag.start + (e.clientX - drag.x) * 100 / distance)));
      slider.value = value;
      if (value === 100) finishMap(); else apply(value);
    }, options);
    surface.addEventListener('lostpointercapture', () => { drag = null; }, options);
    content.replaceChildren(caption, slider, actions(finish));
  }
  shot('燕驿问期', '燕国 · 驿舍', 'yan', '北门开了又关。案上一盏水，丹还没有动。');
  sequence([...opening, {speaker:'荆轲',line:'殿下先喝一口。你从城外回来的？'},
    {speaker:'丹',line:'从北门。天还没亮，那里就有人等着问了。'}],
    () => openFolio(ui, door), '翻开燕地物记');
}

export function readOtherHistory(ui, back) {
  const { setPhase, updateScene, tag, content, button, actions } = ui;
  const seen = new Set();
  function leaf(title, beat, note, paragraphs, choices) {
    setPhase('other-history','卷后异闻 · 架空推想',title);
    updateScene('friend', beat === 'mapEnd' ? '异闻 · 咸阳' : '异闻 · 燕国驿舍', note, { storyBeat: beat });
    const sheet = tag('article','dispatch-sheet');
    paragraphs.forEach(text => sheet.append(tag('p','',text)));
    content.replaceChildren(sheet, actions(...choices, button('合卷，回到史实', 'text-button', back)));
    content.querySelector('button').focus({ preventScroll: true });
  }
  const advance = (label, fn) => button(label,'action-button primary',fn);
  function reports() {
    const choices = [['yan','先拆燕地军报'],['qin','先读咸阳来书']].map(([key, title]) => advance(title, () => report(key)));
    leaf('驿门又响了','otherYan','来使捧着两封信。一封沾着泥，一封连封绳也没系。',[
      '丹一夜未眠。听见来使说「秦王死了」，他撑着案沿站了起来。','「秦军退了吗？」使者摇头。「营里的灯还亮着。」',
      '丹坐下，把两封信挪到灯前。「咸阳那边……还有什么话？」'],choices);
  }
  function report(key) {
    seen.add(key);
    const yan = key === 'yan';
    const next = seen.size === 2 ? advance('把两封信放到丹面前', chooseReply) : advance(yan ? '再读咸阳来书' : '再拆燕地军报', () => report(yan?'qin':'yan'));
    leaf(yan?'北门军报':'咸阳来书','otherYan',yan?'燕地来报，秦营仍亮着灯。':'简末的日期空着，写信的人还在等。',yan?
      ['烽候说，天亮时秦营换过一回旗，车马都还在。等候过渡的百姓问，今日能不能开渡。','传令的人没有带回撤军的消息。渡口的船仍系在岸上。']:
      ['「宫门已闭。新君未定，前线来使等了一日，尚未带走一道新令。」','信到燕地，已经走了好几天。丹再问今日如何，使者答不出。'],[next]);
  }
  function chooseReply() {
    const border = advance('给北门回信，先安顿候渡的人', () => end(true));
    const court = advance('给咸阳回信，先问新令的落款', () => end(false));
    leaf('驿里只剩一匹快马','otherYan','两封简都读完了。驿卒牵着马，在门外等回信。',[
      [...seen][0] === 'yan' ? '丹把两封信并在一起，沾泥的那封在上面。' : '丹按住咸阳来书，想了一阵。北门军报摊在他手边。',
      '「今夜赶得及送出一封。」驿卒说。丹取过笔。'],[border,court]);
  }
  function end(borderFirst) {
    leaf('北门天明','otherYan','天亮了。驿外又有人问，今天的渡船开不开。',[
      borderFirst?'北门收到丹的回信，开了驿舍。天亮时，候渡的一家人已在屋里睡熟。那封问咸阳的简，还压在丹案上。':'送往咸阳的马连夜出了城，竹简上只问一件事：「下一道令，落谁的款？」北门没等到回信，船家把毯子分给岸上的孩子。',
      '在这一种推想里，秦廷迟迟未定继承之议。诸侯得到喘息，原本逼近的统一之期向后推移。下一次发出号令的人，仍未可知。',
      '史实中的这一日，荆轲事败，秦王生还。那卷有关圆石和故人的简，还在原处。'],[]);
  }
  leaf('如果秦王没有走出那座殿','mapEnd','同一张地图，卷后另起一页。',[
    '史书写到这里，秦王生还。现在试想另一种结局。',
    '假如这次荆轲得手，而秦廷一时又未能定下继承之议，远在燕国的丹，会先听到什么？'],[advance('去燕驿听信',reports)]);
}
