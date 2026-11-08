(() => {
  const root = document.querySelector('.motion-player');
  if (!root) return;
  const total = Number(root.dataset.frames), fps = Number(root.dataset.fps);
  const frame = root.querySelector('.motion-frame'), play = root.querySelector('[data-play]');
  const seek = root.querySelector('input'), time = root.querySelector('[data-time]'), status = root.querySelector('[data-status]');
  const src = n => `${root.dataset.base}${String(n).padStart(3, '0')}.jpg`;
  let ready = false, loading = false, playing = false, index = 0, raf = 0, start = 0;
  function render(n) {
    index = Math.min(total - 1, Math.max(0, n));
    frame.src = src(index); seek.value = index;
    time.textContent = `${(index / fps).toFixed(1)} / ${(total / fps).toFixed(1)} 秒`;
    seek.setAttribute('aria-valuetext', `${(index / fps).toFixed(1)} 秒`);
  }
  function pause() {
    playing = false; cancelAnimationFrame(raf); play.textContent = index === total - 1 ? '重新播放' : '播放演示'; play.setAttribute('aria-pressed', 'false');
  }
  function tick(t) {
    if (!playing) return;
    render(Math.floor((t - start) / 1000 * fps));
    if (index === total - 1) { pause(); return; }
    raf = requestAnimationFrame(tick);
  }
  async function load() {
    loading = true; play.disabled = true; status.textContent = '正在载入动作画面…';
    try {
      await Promise.all(Array.from({length:total}, (_, n) => {const i = new Image(); i.src = src(n); return i.decode();}));
      ready = true; status.textContent = '可暂停或拖动进度，观察动作细节。';
    } catch { status.textContent = '画面未能完整载入，请点击重试。'; }
    finally { loading = false; play.disabled = false; }
  }
  play.addEventListener('click', async () => {
    if (playing) { pause(); return; }
    if (loading) return;
    if (!ready) await load();
    if (!ready || document.hidden || root.getBoundingClientRect().bottom < 0 || root.getBoundingClientRect().top > innerHeight) return;
    if (index === total - 1) render(0);
    playing = true; play.textContent = '暂停'; play.setAttribute('aria-pressed', 'true');
    start = performance.now() - index / fps * 1000; raf = requestAnimationFrame(tick);
  });
  seek.addEventListener('input', () => { pause(); render(Number(seek.value)); });
  document.addEventListener('visibilitychange', () => {if (document.hidden) pause();});
  new IntersectionObserver(entries => {if (!entries[0].isIntersecting) pause();}).observe(root);
  window.addEventListener('pagehide', pause);
  render(0);
})();
