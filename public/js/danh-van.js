(function () {
  const deck = document.getElementById('dv-deck');
  if (!deck || !Array.isArray(window.DV_SLIDES) || !window.DV_SLIDES.length) return;

  const slides = window.DV_SLIDES;
  const slideEl = document.getElementById('dv-slide');
  const counterEl = document.getElementById('dv-counter');
  const btnPrev = document.getElementById('dv-prev');
  const btnNext = document.getElementById('dv-next');
  const btnSpeak = document.getElementById('dv-speak');
  const btnSpell = document.getElementById('dv-speak-spell');
  const autoReadEl = document.getElementById('dv-auto-read');
  const audioStatus = document.getElementById('dv-audio-status');
  const menuToggle = document.getElementById('dv-menu-toggle');
  const menuPanel = document.getElementById('dv-menu-panel');

  const AUTO_KEY = 'dv-auto-read';
  let index = 0;
  let viVoice = null;
  let audioGen = 0;

  if (autoReadEl) {
    const saved = localStorage.getItem(AUTO_KEY);
    autoReadEl.checked = saved !== '0';
    autoReadEl.addEventListener('change', () => {
      localStorage.setItem(AUTO_KEY, autoReadEl.checked ? '1' : '0');
    });
  }

  function pickViVoice() {
    const voices = window.speechSynthesis?.getVoices() || [];
    viVoice =
      voices.find((v) => v.lang === 'vi-VN') ||
      voices.find((v) => v.lang.startsWith('vi')) ||
      voices.find((v) => /Viet/i.test(v.name)) ||
      null;
  }

  if (window.speechSynthesis) {
    pickViVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickViVoice);
  }

  function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
  }

  function setStatus(msg) {
    if (audioStatus) audioStatus.textContent = msg || '';
  }

  function stopAllAudio() {
    audioGen += 1;
    window.speechSynthesis?.cancel();
    document.querySelectorAll('audio.dv-slide-audio').forEach((a) => {
      a.pause();
      a.remove();
    });
  }

  function speakOne(text, rate = 0.82) {
    return new Promise((resolve) => {
      if (!text || !window.speechSynthesis) return resolve();
      const u = new SpeechSynthesisUtterance(String(text));
      u.lang = 'vi-VN';
      u.rate = rate;
      if (viVoice) u.voice = viVoice;
      u.onend = () => resolve();
      u.onerror = () => resolve();
      window.speechSynthesis.speak(u);
    });
  }

  async function speakSequence(parts, pauseMs = 500, rate = 0.78) {
    const myGen = audioGen;
    for (const part of parts) {
      if (myGen !== audioGen) return;
      if (!part) continue;
      setStatus(`🔊 ${part}`);
      await speakOne(part, rate);
      await sleep(pauseMs);
    }
    if (myGen === audioGen) setStatus('');
  }

  async function tryPlayMp3(slideId) {
    const url = `/audio/danh-van/${slideId}.mp3`;
    const audio = new Audio(url);
    audio.className = 'dv-slide-audio';
    document.body.appendChild(audio);
    try {
      await audio.play();
      return new Promise((resolve) => {
        audio.onended = () => {
          audio.remove();
          resolve(true);
        };
        audio.onerror = () => {
          audio.remove();
          resolve(false);
        };
      });
    } catch {
      audio.remove();
      return false;
    }
  }

  function spellParts(s) {
    if (!s) return [];
    if (s.type === 'blend') {
      return [s.consonant, s.vowel, s.word, s.sentence].filter(Boolean);
    }
    if (s.type === 'van-word') {
      return [s.consonant, s.van, s.word, s.sentence].filter(Boolean);
    }
    if (s.type === 'read-line') return [s.line];
    if (s.type === 'sentence') return s.sentence.split(/(?<=[.!?])\s+/).filter(Boolean);
    if (s.type === 'tones') return (s.examples || []).map((e) => e.word);
    if (s.type === 'alphabet' || s.type === 'letters') {
      const L = s.letters || [];
      const chunks = [];
      for (let i = 0; i < L.length; i += 6) chunks.push(L.slice(i, i + 6).join(' '));
      return chunks;
    }
    return [];
  }

  function fluentText(s) {
    if (!s) return '';
    if (s.type === 'alphabet' || s.type === 'letters') return (s.letters || []).join(' ');
    if (s.type === 'blend' || s.type === 'van-word') {
      return [s.word, s.sentence].filter(Boolean).join('. ');
    }
    if (s.type === 'read-line') return s.line;
    if (s.type === 'sentence') return s.sentence;
    if (s.type === 'tones') return (s.examples || []).map((e) => e.word).join(', ');
    if (s.type === 'van-intro') return `Vần ${s.center}. ${s.hint || ''}`;
    return [s.title, s.subtitle, s.body].filter(Boolean).join('. ');
  }

  async function playSpell(s) {
    stopAllAudio();
    const parts = spellParts(s);
    if (!parts.length) {
      await speakSequence([fluentText(s)], 200, 0.85);
      return;
    }
    setStatus('📖 Đang đánh vần…');
    await speakSequence(parts, 550, 0.72);
  }

  async function playFluent(s) {
    stopAllAudio();
    const played = await tryPlayMp3(s.id);
    if (played) {
      setStatus('🔊 File âm thanh');
      return;
    }
    const text = fluentText(s);
    if (!text) return;
    setStatus('🔊 Đang đọc…');
    await speakSequence([text], 100, 0.85);
    setStatus('');
  }

  function speakSlide(s, mode) {
    if (mode === 'spell') playSpell(s);
    else playFluent(s);
  }

  function renderLetters(letters, big) {
    return `<div class="dv-letter-grid${big ? ' big' : ''}">${letters.map((l) => `<span class="dv-letter-cell">${l}</span>`).join('')}</div>`;
  }

  function renderSlide(s) {
    if (!slideEl || !s) return;
    let html = '';
    switch (s.type) {
      case 'title':
      case 'passage-title':
        html = `<p class="dv-slide-tag">Slide · ${s.menu || ''}</p>
          <h2 class="dv-slide-title">${s.title}</h2>
          ${s.subtitle ? `<p class="dv-slide-sub">${s.subtitle}</p>` : ''}
          ${s.body ? `<p class="dv-slide-body">${s.body}</p>` : ''}`;
        break;
      case 'alphabet':
        html = `<h2 class="dv-slide-title">${s.title}</h2>${renderLetters(s.letters, true)}`;
        break;
      case 'letters':
        html = `<h2 class="dv-slide-title">${s.title}</h2>${renderLetters(s.letters, false)}
          ${s.hint ? `<p class="dv-slide-hint">${s.hint}</p>` : ''}`;
        break;
      case 'tones':
        html = `<h2 class="dv-slide-title">${s.title}</h2>
          <ul class="dv-tone-list">${(s.examples || []).map((e) => `<li><strong>${e.word}</strong> <span>(${e.tone})</span></li>`).join('')}</ul>`;
        break;
      case 'blend':
      case 'van-word':
        html = `<h2 class="dv-slide-title">${s.title}</h2>
          <p class="dv-spell-big">${s.spell}</p>
          <p class="dv-word-big">${s.word}</p>
          ${s.sentence ? `<p class="dv-slide-sentence">Câu: ${s.sentence}</p>` : ''}
          ${s.words ? `<p class="dv-slide-words">Từ: ${s.words.join(', ')}</p>` : ''}`;
        break;
      case 'van-intro':
        html = `<h2 class="dv-slide-title">${s.title}</h2>
          <p class="dv-van-center">Vần <span>${s.center}</span></p>
          <p class="dv-slide-hint">${s.hint || ''}</p>`;
        break;
      case 'sentence':
        html = `<h2 class="dv-slide-title">${s.title}</h2>
          <p class="dv-slide-sentence big">${s.sentence}</p>
          <p class="dv-slide-hint">${s.spell || ''}</p>`;
        break;
      case 'read-line':
        html = `<p class="dv-slide-tag">${s.title} · dòng ${s.lineIndex}/${s.lineTotal}</p>
          <p class="dv-read-line-big">${s.line}</p>`;
        break;
      default:
        html = `<h2 class="dv-slide-title">${s.title || 'Slide'}</h2>`;
    }
    slideEl.innerHTML = html;
    slideEl.dataset.slideId = s.id;
    if (counterEl) counterEl.textContent = `${index + 1} / ${slides.length}`;
    if (btnPrev) btnPrev.disabled = index <= 0;
    if (btnNext) btnNext.disabled = index >= slides.length - 1;
    document.querySelectorAll('.dv-menu-item').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.goto === s.id);
    });
    const hash = `#${s.id}`;
    if (window.location.hash !== hash) {
      history.replaceState(null, '', hash);
    }
  }

  function goTo(i, opts = {}) {
    stopAllAudio();
    index = Math.max(0, Math.min(slides.length - 1, i));
    const s = slides[index];
    renderSlide(s);
    if (opts.autoRead !== false && autoReadEl?.checked) {
      window.setTimeout(() => {
        if (s.type === 'blend' || s.type === 'van-word') playSpell(s);
        else playFluent(s);
      }, 280);
    }
  }

  function goToId(id) {
    const i = slides.findIndex((s) => s.id === id);
    if (i >= 0) goTo(i);
  }

  btnPrev?.addEventListener('click', () => goTo(index - 1));
  btnNext?.addEventListener('click', () => goTo(index + 1));
  btnSpeak?.addEventListener('click', () => speakSlide(slides[index], 'fluent'));
  btnSpell?.addEventListener('click', () => speakSlide(slides[index], 'spell'));

  document.querySelectorAll('.dv-menu-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      goToId(btn.dataset.goto);
      if (window.innerWidth < 768) menuPanel?.classList.add('collapsed');
    });
  });

  menuToggle?.addEventListener('click', () => {
    const collapsed = menuPanel?.classList.toggle('collapsed');
    menuToggle.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(index + 1);
    if (e.key === 'ArrowLeft') goTo(index - 1);
  });

  const hashId = window.location.hash.replace('#', '');
  if (hashId) goToId(hashId);
  else goTo(0, { autoRead: false });
})();
