/** Giọng đọc tiếng Việt + đánh vần kiểu «bờ — a — ba». Có giọng online nếu máy chưa cài vi-VN. */
window.DvSpeech = (function () {
  const VOICE_KEY = 'dv-voice-uri';
  const CLOUD_VI = 'cloud:vi';
  const INITIALS = [
    'ngh', 'ng', 'nh', 'gh', 'kh', 'ph', 'th', 'tr', 'ch', 'gi', 'qu',
    'b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'r', 's', 't', 'v', 'x',
  ].sort((a, b) => b.length - a.length);

  const CONS_NAME = {
    b: 'bờ', c: 'cờ', d: 'dờ', đ: 'đờ', g: 'gờ', h: 'hờ', k: 'cờ', l: 'lờ', m: 'mờ', n: 'nờ',
    p: 'pờ', r: 'rờ', s: 'sờ', t: 'tờ', v: 'vờ', x: 'xờ',
    ch: 'chờ', tr: 'trờ', th: 'thờ', ph: 'phờ', nh: 'nhờ', ng: 'ngờ', ngh: 'nghờ',
    gh: 'gờ', kh: 'khờ', gi: 'dờ giê', qu: 'quờ',
  };

  let voice = null;
  let gen = 0;
  let cloudAudio = null;

  function allVoices() {
    return window.speechSynthesis?.getVoices() || [];
  }

  function isLocalViVoice(v) {
    return (
      v.lang === 'vi-VN' ||
      v.lang === 'vi' ||
      v.lang.startsWith('vi-') ||
      /Vietnamese|Tiếng Việt|HoaiMy|Hoai|An/i.test(v.name)
    );
  }

  function vietnameseVoices() {
    return allVoices().filter(isLocalViVoice);
  }

  function scoreVoice(v) {
    let s = 0;
    if (v.lang === 'vi-VN') s += 10;
    if (/Online|Natural|Neural|HoaiMy|Hoai My|An/i.test(v.name)) s += 8;
    if (/Microsoft/.test(v.name)) s += 4;
    if (/Google/.test(v.name)) s += 3;
    return s;
  }

  function isCloudVoice(v) {
    return v?.isCloud === true || (typeof v === 'string' && v.startsWith('cloud:'));
  }

  function voiceUri(v) {
    if (!v) return '';
    if (typeof v === 'string') return v;
    return v.voiceURI || '';
  }

  function pickDefaultVoice() {
    const saved = localStorage.getItem(VOICE_KEY);
    if (saved?.startsWith('cloud:')) {
      return { voiceURI: saved, isCloud: true, name: 'Tiếng Việt (online)' };
    }
    const voices = allVoices();
    if (saved) {
      const v = voices.find((x) => x.voiceURI === saved);
      if (v && isLocalViVoice(v)) return v;
    }
    const vi = vietnameseVoices().sort((a, b) => scoreVoice(b) - scoreVoice(a));
    if (vi[0]) return vi[0];
    return { voiceURI: CLOUD_VI, isCloud: true, name: 'Tiếng Việt (online)' };
  }

  function setVoiceByUri(uri) {
    if (!uri) return;
    if (uri.startsWith('cloud:')) {
      voice = { voiceURI: uri, isCloud: true, name: 'Tiếng Việt (online)' };
      localStorage.setItem(VOICE_KEY, uri);
      return;
    }
    const v = allVoices().find((x) => x.voiceURI === uri);
    if (v) {
      voice = v;
      localStorage.setItem(VOICE_KEY, uri);
    }
  }

  function refreshVoice() {
    voice = pickDefaultVoice();
    return voice;
  }

  function hasViVoice() {
    return true;
  }

  function usesCloud() {
    return isCloudVoice(voice) || voiceUri(voice).startsWith('cloud:');
  }

  function splitWord(w) {
    const word = String(w).toLowerCase().trim();
    for (const ini of INITIALS) {
      if (word.startsWith(ini)) {
        return { initial: ini, rhyme: word.slice(ini.length), word };
      }
    }
    return { initial: '', rhyme: word, word };
  }

  function spellParts(word) {
    const { initial, rhyme, word: w } = splitWord(word);
    const parts = [];
    if (initial) parts.push(CONS_NAME[initial] || initial);
    if (rhyme && rhyme !== w) parts.push(rhyme);
    parts.push(w);
    return [...new Set(parts.filter(Boolean))];
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function stopCloud() {
    if (cloudAudio) {
      cloudAudio.pause();
      cloudAudio.src = '';
      cloudAudio = null;
    }
  }

  function stop() {
    gen += 1;
    window.speechSynthesis?.cancel();
    stopCloud();
  }

  async function speakCloud(text, rate = 0.78) {
    const my = gen;
    const res = await fetch('/api/dv/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: String(text) }),
    });
    if (!res.ok || my !== gen) return;
    const blob = await res.blob();
    if (my !== gen) return;
    const url = URL.createObjectURL(blob);
    return new Promise((resolve) => {
      const a = new Audio(url);
      cloudAudio = a;
      a.playbackRate = Math.min(1.35, Math.max(0.65, rate / 0.78));
      a.onended = () => {
        URL.revokeObjectURL(url);
        if (cloudAudio === a) cloudAudio = null;
        resolve();
      };
      a.onerror = () => {
        URL.revokeObjectURL(url);
        resolve();
      };
      a.play().catch(() => resolve());
    });
  }

  function utter(text, rate = 0.78) {
    return new Promise((resolve) => {
      if (!text || !window.speechSynthesis) return resolve();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = 'vi-VN';
      u.rate = rate;
      u.pitch = 1;
      if (voice && !usesCloud()) u.voice = voice;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  async function speak(text, rate = 0.78) {
    stop();
    const my = gen;
    if (my !== gen) return;
    if (usesCloud()) await speakCloud(text, rate);
    else await utter(text, rate);
  }

  async function spell(word) {
    stop();
    const my = gen;
    const parts = spellParts(word);
    for (const p of parts) {
      if (my !== gen) return;
      if (usesCloud()) await speakCloud(p, 0.72);
      else await utter(p, 0.72);
      await sleep(380);
    }
  }

  function fillVoiceSelect(selectEl) {
    if (!selectEl) return;
    refreshVoice();
    const vi = vietnameseVoices().sort((a, b) => scoreVoice(b) - scoreVoice(a));
    const cur = voiceUri(voice);
    const cloudOpts = `<option value="${CLOUD_VI}"${cur === CLOUD_VI ? ' selected' : ''}>🇻🇳 Tiếng Việt (online — mặc định)</option>`;
    const localOpts = vi
      .map(
        (v) =>
          `<option value="${v.voiceURI.replace(/"/g, '&quot;')}"${cur === v.voiceURI ? ' selected' : ''}>${v.name} (${v.lang}) · trên máy</option>`
      )
      .join('');
    selectEl.innerHTML =
      cloudOpts +
      (localOpts ? `<optgroup label="Giọng Windows (nếu đã cài)">${localOpts}</optgroup>` : '');
  }

  if (window.speechSynthesis) {
    refreshVoice();
    window.speechSynthesis.addEventListener('voiceschanged', () => {
      refreshVoice();
      const sel = document.getElementById('dv-voice-select');
      if (sel) fillVoiceSelect(sel);
    });
  } else {
    refreshVoice();
  }

  return {
    refreshVoice,
    setVoiceByUri,
    hasViVoice,
    usesCloud,
    vietnameseVoices,
    speak,
    spell,
    stop,
    fillVoiceSelect,
    spellParts,
  };
})();

(function () {
  const root = document.getElementById('dv-pdf-reader');
  if (!root || !window.DV_PDF) {
    console.warn('[dv-pdf] Thiếu #dv-pdf-reader hoặc window.DV_PDF — restart npm start và Ctrl+F5.');
    return;
  }

  if (!window.DvSpeech) {
    window.DvSpeech = {
      refreshVoice() {},
      setVoiceByUri() {},
      hasViVoice: () => false,
      vietnameseVoices: () => [],
      speak: async (text) => {
        if (window.speechSynthesis && text) {
          const u = new SpeechSynthesisUtterance(text);
          u.lang = 'vi-VN';
          window.speechSynthesis.speak(u);
        }
      },
      spell: async (text) => window.DvSpeech.speak(text),
      stop() {},
      fillVoiceSelect() {},
      spellParts: async () => {},
    };
  }

  const speech = window.DvSpeech;
  const { toc, pages, numPages } = window.DV_PDF;
  const startPage = Number(window.DV_PDF_START) || 1;
  const PROGRESS_KEY = 'dv-pdf-progress-v1';
  const CUSTOM_KEY = 'dv-pdf-custom-words';

  const imgEl = document.getElementById('dv-pdf-img');
  const zoomImg = document.getElementById('dv-zoom-img');
  const counterEl = document.getElementById('dv-pdf-counter');
  const tocEl = document.getElementById('dv-pdf-toc');
  const wordArea = document.getElementById('dv-pdf-words');
  const syllableArea = document.getElementById('dv-pdf-syllables');
  const inputWord = document.getElementById('dv-pdf-word-input');
  const btnAddWord = document.getElementById('dv-pdf-add-word');
  const btnMark = document.getElementById('dv-pdf-mark-read');
  const btnPrev = document.getElementById('dv-pdf-prev');
  const btnNext = document.getElementById('dv-pdf-next');
  const btnZoom = document.getElementById('dv-pdf-zoom');
  const zoomModal = document.getElementById('dv-zoom-modal');
  const zoomClose = document.getElementById('dv-zoom-close');
  const audioStatus = document.getElementById('dv-audio-status');
  const voiceSelect = document.getElementById('dv-voice-select');
  const voiceWarn = document.getElementById('dv-voice-warn');

  let page = startPage;

  function setStatus(msg) {
    if (audioStatus) audioStatus.textContent = msg || '';
  }

  function updateVoiceWarn() {
    if (!voiceWarn) return;
    if (speech.usesCloud?.()) {
      voiceWarn.classList.add('hidden');
    } else if (!speech.vietnameseVoices().length) {
      voiceWarn.classList.remove('hidden');
    } else {
      voiceWarn.classList.add('hidden');
    }
  }

  speech.fillVoiceSelect(voiceSelect);
  updateVoiceWarn();
  voiceSelect?.addEventListener('change', () => {
    speech.setVoiceByUri(voiceSelect.value);
    updateVoiceWarn();
  });

  async function speakWord(text) {
    setStatus(`🔊 ${text}`);
    await speech.speak(text, 0.76);
  }

  async function spellWord(text) {
    setStatus(`📖 ${text}`);
    await speech.spell(text);
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{"read":[]}');
    } catch {
      return { read: [] };
    }
  }

  function saveProgress(prog) {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(prog));
  }

  function isRead(p) {
    return loadProgress().read.includes(p);
  }

  function markRead(p) {
    const prog = loadProgress();
    if (!prog.read.includes(p)) prog.read.push(p);
    prog.read.sort((a, b) => a - b);
    saveProgress(prog);
    renderToc();
    updateMarkBtn();
  }

  function loadCustomWords() {
    try {
      return JSON.parse(sessionStorage.getItem(CUSTOM_KEY) || '{}');
    } catch {
      return {};
    }
  }

  function saveCustomWords(map) {
    sessionStorage.setItem(CUSTOM_KEY, JSON.stringify(map));
  }

  function pageMeta(p) {
    return pages.find((x) => x.page === p) || { page: p, image: '', words: [] };
  }

  function sectionForPage(p) {
    return toc.find((s) => p >= s.from && p <= s.to) || null;
  }

  function bindTocPanel() {
    if (!tocEl || tocEl.dataset.bound === '1') return;
    tocEl.dataset.bound = '1';
    tocEl.addEventListener('click', (e) => {
      const link = e.target.closest('[data-page]');
      if (!link) return;
      e.preventDefault();
      goPage(Number(link.dataset.page));
    });
  }

  function renderToc() {
    if (!tocEl) return;
    const prog = loadProgress();
    tocEl.innerHTML = toc
      .map((sec) => {
        const secPages = pages.filter((pg) => pg.page >= sec.from && pg.page <= sec.to);
        const done = secPages.length && secPages.every((pg) => prog.read.includes(pg.page));
        const items = secPages
          .map((pg) => {
            const r = prog.read.includes(pg.page);
            const topic = pg.topic ? ` · ${pg.topic}` : '';
            return `<li><button type="button" class="dv-pdf-page-link${pg.page === page ? ' active' : ''}${r ? ' done' : ''}" data-page="${pg.page}"><span class="dv-toc-page-num">Trang ${pg.page}${r ? ' ✓' : ''}</span>${pg.topic ? `<span class="dv-toc-topic">${pg.topic}</span>` : ''}</button></li>`;
          })
          .join('');
        return `<details class="dv-toc-section" open>
          <summary class="${done ? 'section-done' : ''}">${sec.label}${done ? ' ✓' : ''}</summary>
          <ul>${items}</ul>
        </details>`;
      })
      .join('');

  }

  function syllablesForPage(p) {
    const meta = pageMeta(p);
    if (meta.syllables?.length) return meta.syllables;
    if (meta.words?.length) return [...new Set(meta.words)];
    return [];
  }

  function bindSylChips(container) {
    container.querySelectorAll('.dv-syl-chip').forEach((btn) => {
      btn.addEventListener('click', () => speakWord(btn.dataset.speak || ''));
      btn.addEventListener('dblclick', (e) => {
        e.preventDefault();
        spellWord(btn.dataset.speak || '');
      });
    });
  }

  function renderSyllables(p) {
    if (!syllableArea) return;
    syllableArea.querySelector('.dv-js-hint')?.remove();
    const list = syllablesForPage(p);
    if (!list.length) {
      syllableArea.innerHTML =
        '<p class="meta">Chưa có bảng vần cho trang này — gõ từ trên sách rồi <strong>Thêm &amp; đọc</strong>.</p>';
      return;
    }
    const label = pageMeta(p).topic
      ? `<p class="meta dv-syl-caption">Theo trang: ${pageMeta(p).topic}</p>`
      : '';
    const chips = list
      .map(
        (w) =>
          `<button type="button" class="dv-syl-chip" data-speak="${String(w).replace(/"/g, '&quot;')}" title="Bấm: đọc · Double-click: đánh vần">${w}</button>`
      )
      .join('');
    syllableArea.innerHTML = label + chips;
    bindSylChips(syllableArea);
  }

  function renderWords(p) {
    if (!wordArea) return;
    const meta = pageMeta(p);
    const custom = loadCustomWords()[String(p)] || [];
    const all = [...new Set([...(meta.words || []), ...custom])].filter(Boolean);
    const hint =
      all.length === 0
        ? '<p class="meta">Gõ từ trên sách → <strong>Thêm &amp; đọc</strong>. Bảng vần: <strong>bấm</strong> = đọc tiếng, <strong>double-click</strong> = đánh vần (bờ–a–ba).</p>'
        : '';
    const chips = all
      .map(
        (w) =>
          `<button type="button" class="dv-word-chip" data-word="${w.replace(/"/g, '&quot;')}">${w}</button>`
      )
      .join('');
    wordArea.innerHTML = hint + `<div class="dv-word-grid">${chips}</div>`;
    wordArea.querySelectorAll('.dv-word-chip').forEach((btn) => {
      btn.addEventListener('click', () => speakWord(btn.dataset.word));
      btn.addEventListener('dblclick', (e) => {
        e.preventDefault();
        spellWord(btn.dataset.word);
      });
    });
  }

  function updateMarkBtn() {
    if (!btnMark) return;
    btnMark.textContent = isRead(page) ? '✓ Đã đọc (bỏ đánh dấu)' : 'Đánh dấu đã đọc xong trang';
    btnMark.classList.toggle('primary', !isRead(page));
  }

  function goPage(p) {
    page = Math.max(1, Math.min(numPages, p));
    const meta = pageMeta(page);
    if (imgEl) {
      imgEl.src = meta.image;
      imgEl.alt = `Sách đánh vần — trang ${page}`;
    }
    if (zoomImg) zoomImg.src = meta.image;
    if (counterEl) {
      const sec = sectionForPage(page);
      const topicBit = meta.topic ? ` · ${meta.topic}` : sec ? ` · ${sec.label.split('·').pop().trim()}` : '';
      counterEl.textContent = `Trang ${page} / ${numPages}${topicBit}`;
    }
    renderToc();
    renderWords(page);
    renderSyllables(page);
    updateMarkBtn();
    history.replaceState(null, '', `#trang-${page}`);
  }

  btnPrev?.addEventListener('click', () => goPage(page - 1));
  btnNext?.addEventListener('click', () => {
    markRead(page);
    goPage(page + 1);
  });

  btnMark?.addEventListener('click', () => {
    if (isRead(page)) {
      const prog = loadProgress();
      prog.read = prog.read.filter((x) => x !== page);
      saveProgress(prog);
    } else markRead(page);
    updateMarkBtn();
    renderToc();
  });

  btnZoom?.addEventListener('click', () => zoomModal?.classList.remove('hidden'));
  zoomClose?.addEventListener('click', () => zoomModal?.classList.add('hidden'));
  zoomModal?.addEventListener('click', (e) => {
    if (e.target === zoomModal) zoomModal.classList.add('hidden');
  });
  imgEl?.addEventListener('click', () => zoomModal?.classList.remove('hidden'));

  btnAddWord?.addEventListener('click', () => {
    const w = (inputWord?.value || '').trim();
    if (!w) return;
    const map = loadCustomWords();
    const key = String(page);
    map[key] = [...new Set([...(map[key] || []), w])];
    saveCustomWords(map);
    if (inputWord) inputWord.value = '';
    renderWords(page);
    speakWord(w);
  });

  inputWord?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') btnAddWord?.click();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goPage(page + 1);
    if (e.key === 'ArrowLeft') goPage(page - 1);
    if (e.key === 'Escape') zoomModal?.classList.add('hidden');
  });

  const hash = window.location.hash.match(/trang-(\d+)/);
  if (hash) goPage(Number(hash[1]));
  else goPage(startPage);

  bindTocPanel();
  root.dataset.ready = '1';

  document.getElementById('dv-toc-toggle')?.addEventListener('click', () => {
    document.getElementById('dv-pdf-toc-panel')?.classList.toggle('collapsed');
  });

  window.addEventListener('hashchange', () => {
    const m = window.location.hash.match(/trang-(\d+)/);
    if (m) goPage(Number(m[1]));
  });

  setTimeout(() => {
    speech.refreshVoice();
    speech.fillVoiceSelect(voiceSelect);
    updateVoiceWarn();
  }, 500);
})();
