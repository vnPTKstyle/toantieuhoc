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
