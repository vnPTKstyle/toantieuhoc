/** Gợi ý nội dung từng trang sách (PDF scan không có text layer). Có thể sửa / bổ sung thủ công. */
const { ALPHABET, CONSONANTS, VOWELS } = require('./danh-van-data');

/** Nguyên âm ghép với phụ âm — giống lưới trong sách (m + a → am, ám, …). */
const BLEND_VOWELS = ['a', 'ă', 'â', 'e', 'ê', 'i', 'o', 'ô', 'ơ', 'u'];

const VOWEL_TONE = {
  a: ['a', 'á', 'à', 'ả', 'ã', 'ạ'],
  ă: ['ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ'],
  â: ['â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ'],
  e: ['e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ'],
  ê: ['ê', 'ế', 'ề', 'ể', 'ễ', 'ệ'],
  i: ['i', 'í', 'ì', 'ỉ', 'ĩ', 'ị'],
  o: ['o', 'ó', 'ò', 'ỏ', 'õ', 'ọ'],
  ô: ['ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ'],
  ơ: ['ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ'],
  u: ['u', 'ú', 'ù', 'ủ', 'ũ', 'ụ'],
  ư: ['ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự'],
  y: ['y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ'],
};

const VOWEL_SCAN = ['ă', 'â', 'ê', 'ô', 'ơ', 'ư', 'a', 'e', 'i', 'o', 'u', 'y'];

function mainVowelInSyllable(s) {
  let pos = -1;
  let cluster = '';
  for (const cl of VOWEL_SCAN) {
    const i = s.indexOf(cl);
    if (i >= 0 && (pos < 0 || i < pos)) {
      pos = i;
      cluster = cl;
    }
  }
  return { pos, cluster };
}

function withTone(syllable, toneIdx) {
  const { pos, cluster } = mainVowelInSyllable(syllable);
  if (pos < 0 || !VOWEL_TONE[cluster]) return toneIdx === 0 ? syllable : null;
  const toned = VOWEL_TONE[cluster][toneIdx];
  return syllable.slice(0, pos) + toned + syllable.slice(pos + cluster.length);
}

function allTonedForms(base) {
  const out = [];
  for (let t = 0; t < 6; t++) {
    const f = withTone(base, t);
    if (f) out.push(f);
  }
  return [...new Set(out)];
}

function consonantBlendChips(consonant) {
  const c = String(consonant).toLowerCase();
  const list = [];
  for (const v of BLEND_VOWELS) {
    list.push(...allTonedForms(c + v));
  }
  return list;
}

function vanChips(van) {
  const v = String(van).toLowerCase();
  const list = [];
  if (mainVowelInSyllable(v).pos >= 0) list.push(...allTonedForms(v));
  for (const c of CONSONANTS) {
    list.push(...allTonedForms(c + v));
  }
  return [...new Set(list)];
}

function parseTopicKind(topic) {
  const t = String(topic || '');
  let m = t.match(/Ghép âm\s+(\S)\s+\+/);
  if (m) return { kind: 'blend', consonant: m[1].toLowerCase() };
  m = t.match(/Chữ «(.+)»/);
  if (m) return { kind: 'letter', letter: m[1].toLowerCase() };
  m = t.match(/Vần «(.+)»/);
  if (m) return { kind: 'van', van: m[1].toLowerCase() };
  return { kind: 'other' };
}

function blendConsonantFromPage(page) {
  const idx = page - 5 - ALPHABET.length;
  if (idx < 0) return null;
  return CONSONANTS[idx % CONSONANTS.length];
}

const COVER = {
  1: 'Bìa sách',
  2: 'Lời giới thiệu',
  3: 'Mục lục in',
  4: 'Hướng dẫn sử dụng',
};

/** Vần & bài học vần — trang 70–111 (Phần 2), theo lộ trình sách đánh vần 4–6 tuổi. */
const VAN_SEQUENCE = [
  'o', 'ô', 'ơ', 'a', 'ă', 'â', 'u', 'ư', 'i', 'e', 'ê', 'y',
  'oa', 'oe', 'uy', 'uê', 'uơ', 'yê', 'ia', 'ua', 'ưa', 'ươ',
  'an', 'ăn', 'ân', 'on', 'un', 'en', 'in', 'yn',
  'ang', 'ăng', 'âng', 'ong', 'ung', 'eng', 'ich', 'ach',
  'oan', 'oat', 'oăn', 'oăt', 'uyt', 'uyn', 'uych',
];

const LUYEN_DOC = [
  'Đọc tiếng quen',
  'Đọc từ đơn',
  'Đọc từ ghép',
  'Đọc câu ngắn',
  'Đọc câu dài',
  'Đọc đoạn 1',
  'Đọc đoạn 2',
  'Đọc đoạn 3',
  'Đọc đoạn 4',
  'Đọc đoạn 5',
  'Đọc trơn bài 1',
  'Đọc trơn bài 2',
  'Ôn tập đọc',
  'Bài đọc thêm 1',
  'Bài đọc thêm 2',
];

function sectionForPage(page, toc) {
  if (!toc?.length) return null;
  return toc.find((s) => page >= s.from && page <= s.to) || null;
}

function amChuTopic(page) {
  const idx = page - 5;
  if (idx < 0) return '';
  if (idx < ALPHABET.length) {
    return `Chữ «${ALPHABET[idx]}»`;
  }
  const ghépIdx = idx - ALPHABET.length;
  const c = CONSONANTS[ghépIdx % CONSONANTS.length];
  const v = ['a', 'e', 'o', 'i', 'u'][Math.floor(ghépIdx / CONSONANTS.length) % 5];
  return `Ghép âm ${c} + ${v} → ${c}${v}`;
}

function topicForPage(page, toc, pageRow) {
  if (pageRow?.topic) return pageRow.topic;
  if (pageRow?.words?.length) {
    const w = pageRow.words.slice(0, 4).join(', ');
    return w.length > 48 ? `${w.slice(0, 45)}…` : w;
  }
  if (pageRow?.text) {
    const t = pageRow.text.trim();
    if (t) return t.length > 50 ? `${t.slice(0, 47)}…` : t;
  }
  if (COVER[page]) return COVER[page];

  const sec = sectionForPage(page, toc);
  if (!sec) return '';

  if (sec.id === 'am-chu') return amChuTopic(page);

  if (sec.id === 'hoc-van') {
    const i = page - sec.from;
    const van = VAN_SEQUENCE[i] || VAN_SEQUENCE[i % VAN_SEQUENCE.length];
    return `Vần «${van}»`;
  }

  if (sec.id === 'luyen-doc') {
    const i = page - sec.from;
    return LUYEN_DOC[i] || `Luyện đọc (${page})`;
  }

  return sec.label;
}

function syllablesForPage(page, toc, pageRow) {
  if (pageRow?.words?.length) {
    const fromWords = pageRow.words.flatMap((w) => allTonedForms(String(w).toLowerCase()));
    return [...new Set(fromWords.filter(Boolean))];
  }

  const topic = topicForPage(page, toc, pageRow);
  const parsed = parseTopicKind(topic);

  if (parsed.kind === 'blend' && CONSONANTS.includes(parsed.consonant)) {
    return consonantBlendChips(parsed.consonant);
  }
  if (parsed.kind === 'van') {
    return vanChips(parsed.van);
  }
  if (parsed.kind === 'letter') {
    const ch = parsed.letter;
    if (CONSONANTS.includes(ch)) return consonantBlendChips(ch);
    if (VOWELS.includes(ch) || VOWEL_TONE[ch]) return allTonedForms(ch);
    return [ch];
  }

  const sec = sectionForPage(page, toc);
  if (sec?.id === 'am-chu') {
    const c = blendConsonantFromPage(page);
    if (c) return consonantBlendChips(c);
  }
  if (sec?.id === 'hoc-van') {
    const i = page - sec.from;
    const van = VAN_SEQUENCE[i] || VAN_SEQUENCE[i % VAN_SEQUENCE.length];
    return vanChips(van);
  }

  return [];
}

function enrichPages(manifest) {
  if (!manifest?.pages) return manifest;
  const toc = manifest.toc || [];
  return {
    ...manifest,
    pages: manifest.pages.map((p) => {
      const topic = topicForPage(p.page, toc, p);
      return {
        ...p,
        topic,
        syllables: syllablesForPage(p.page, toc, { ...p, topic }),
      };
    }),
  };
}

module.exports = {
  topicForPage,
  enrichPages,
  sectionForPage,
  syllablesForPage,
  consonantBlendChips,
};
