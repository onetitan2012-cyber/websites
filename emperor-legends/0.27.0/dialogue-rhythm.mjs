export function createDialogueRhythm() {
  const body = document.body;
  const panel = document.querySelector('.panel');
  const roll = document.querySelector('#proposal-roll');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let finish;
  let completeNow;
  let lastScene;

  // These labels persist between lines. Animate a replacement only if its words changed.
  for (const id of ['chapter-name','chapter-date','chapter-number','panel-kicker','panel-title','place','scene-note','desk-caption']) {
    const label = document.getElementById(id);
    let previous = label.textContent;
    let entrance;
    new MutationObserver(() => {
      const changed = previous !== label.textContent;
      previous = label.textContent;
      if (!changed || motion.matches || body.dataset.layout !== 'new' || body.dataset.phase === 'game') return;
      entrance?.cancel();
      entrance = label.animate([{opacity:0},{opacity:1}], {
        duration:520, delay:id.endsWith('caption') || id === 'scene-note' ? 200 : 80,
        easing:'ease-out', fill:'backwards',
      });
    }).observe(label, {childList:true, characterData:true, subtree:true});
  }
  // Allow time to take in a whole written line after its entrance has finished.
  function readingHold(text) {
    return Math.min(3400, 850 + Array.from(text.trim()).length * 70);
  }

  const content = document.getElementById('content');
  new MutationObserver(() => {
    if (body.dataset.layout !== 'new' || ['game','folio'].includes(body.dataset.phase) || content.querySelector('[data-paced],.dialogue')) return;
    const blocks = content.querySelectorAll(':scope > :is(p,.memories,.chapter-review,.legend-roll,.yan-paper,.party-leaf), :scope > .dispatch-sheet > p');
    if (!blocks.length) return;
    let onset = 760;
    for (const block of blocks) {
      block.dataset.readingBlock = '';
      block.style.setProperty('--reading-onset', onset + 'ms');
      const hold = readingHold(block.textContent);
      // The final text stays visible while the player reads the choices.
      const beforeControls = block === blocks[blocks.length - 1];
      onset += 480 + (beforeControls ? Math.round(hold * 0.55) : hold);
    }
    const controls = content.querySelector(':scope > .choices,:scope > .actions');
    controls?.style.setProperty('--decision-onset', onset + 'ms');
  }).observe(content, {childList:true});

  let consumedSpace = false;

  window.addEventListener('keydown', event => {
    if (event.code !== 'Space' || event.isComposing || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (consumedSpace && event.repeat) { event.preventDefault(); return; }
    if (!finish || document.querySelector('dialog[open]') ||
        event.target.closest?.('a, button, input, textarea, select, [contenteditable=true]')) return;
    event.preventDefault();
    consumedSpace = true;
    finish();
  });
  window.addEventListener('keyup', event => {
    if (event.code === 'Space' && consumedSpace) {
      event.preventDefault();
      consumedSpace = false;
      if (!finish && document.activeElement === body) {
        panel.querySelector('#content .primary')?.focus({preventScroll:true});
      }
    }
  });
  window.addEventListener('blur', () => { consumedSpace = false; });
  panel.addEventListener('click', event => {
    if (!event.target.closest('button,a') && !window.getSelection()?.toString()) finish?.();
  });

  function reveal(entry, row, ready) {
    completeNow?.();
    if (body.dataset.layout !== 'new') {
      ready?.();
      return;
    }
    const entries = Array.isArray(entry) ? entry : [entry];
    const lines = row.parentElement.querySelectorAll('.line, .body-text, .decree-reading');
    const parts = entries.map((item, i) => {
      const line = lines[i];
      line.dataset.pacedLine = '';
      const text = line.textContent;
      const visible = document.createElement('span');
      const rest = document.createElement('span');
      const accessible = document.createElement('span');
      visible.setAttribute('aria-hidden','true');
      rest.setAttribute('aria-hidden','true');
      rest.style.visibility = 'hidden';
      rest.textContent = accessible.textContent = text;
      accessible.className = 'reading-accessible';
      line.replaceChildren(visible, rest, accessible);
      const bubble = line.closest('.dialogue');
      bubble?.classList.add('reading-pending');
      const spoken = !['旁白','叙事','议简','边报','后报','旧书','燕地旧记'].includes(item.speaker)
        && !/^前\d+年/u.test(item.speaker);
      return {line, text, visible, rest, bubble, spoken, letters:Array.from(text)};
    });
    row.dataset.paced = '';
    row.inert = true;
    roll.disabled = true;
    body.dataset.reading = 'lead';
    const action = row.parentElement.querySelector('.dialogue .action');
    // The action starts fading immediately, so include its entrance in its reading time.
    const decisionDelay = action ? Math.min(1150, 600 + Array.from(action.textContent.trim()).length * 24) : 380;
    const entrances = [];
    let timer;
    let index = 0;
    let partIndex = 0;
    function showText() {
      for (const animation of entrances) animation.cancel();
      for (const part of parts) {
        part.line.textContent = part.text;
        part.bubble?.classList.remove('reading-pending');
      }
    }
    function unlock() {
      clearTimeout(timer);
      completeNow = finish = null;
      delete body.dataset.reading;
      roll.disabled = false;
      row.inert = false;
      if (row.isConnected) ready?.();
    }
    completeNow = () => { showText(); unlock(); };
    function afterLine(expedited) {
      clearTimeout(timer);
      finish = expedited ? null : () => afterLine(true);
      showText();
      body.dataset.reading = 'after';
      timer = setTimeout(() => {
        finish = null;
        body.dataset.reading = 'controls';
        timer = setTimeout(unlock, 300);
      }, expedited ? 100 : decisionDelay);
    }
    finish = () => afterLine(true);
    function nextPart() {
      partIndex++;
      index = 0;
      if (partIndex < parts.length) timer = setTimeout(introducePart, 480);
      else if (action) timer = setTimeout(() => afterLine(false), 150);
      else afterLine(false);
    }
    function tick() {
      const {letters, visible, rest} = parts[partIndex];
      const letter = letters[index++];
      visible.append(letter);
      rest.textContent = letters.slice(index).join('');
      const pause = /[。！？!?…]/u.test(letter) ? 360 : /[，、；：,]/u.test(letter) ? 220 : 78;
      timer = setTimeout(index >= letters.length ? nextPart : tick, pause);
    }
    function startPart() {
      body.dataset.reading = 'text';
      const part = parts[partIndex];
      if (part.spoken && part.letters.length) tick();
      else {
        part.visible.textContent = part.text;
        part.rest.textContent = '';
        part.visible.animate([{opacity:0},{opacity:1}], {duration:480, easing:'ease-out'});
        timer = setTimeout(nextPart, 480 + readingHold(part.text));
      }
    }
    function introducePart() {
      const part = parts[partIndex];
      const portrait = part.bubble?.querySelector('.speaker-portrait');
      const name = part.bubble?.querySelector('.speaker');
      body.dataset.reading = 'speaker';
      part.bubble?.classList.remove('reading-pending');
      function fade(element, delay, duration) {
        if (element) entrances.push(element.animate([{opacity:0},{opacity:1}],
          {duration, delay, easing:'ease-out', fill:'backwards'}));
      }
      fade(portrait, 0, 280);
      fade(name, portrait ? 280 : 0, 280);
      timer = setTimeout(startPart, portrait ? 680 : name ? 360 : 120);
    }
    const scene = [document.getElementById('chapter-name').textContent, document.getElementById('place').textContent,
      document.getElementById('panel-title').textContent].join('|');
    const entering = scene !== lastScene;
    lastScene = scene;
    timer = setTimeout(introducePart, entering ? 700 : 170);
  }

  return { reveal, complete: () => completeNow?.() };
}
