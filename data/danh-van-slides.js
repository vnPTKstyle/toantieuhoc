/**
 * Slide luyện đọc — cấu trúc theo sách đánh vần 4–6 tuổi (3 phần, từng bước đọc).
 * Nội dung biên soạn gốc cho web (không trích nguyên văn sách PDF).
 */
const { ALPHABET, CONSONANTS, VOWELS, VAN_GROUPS, LUYEN_DOC } = require('./danh-van-data');

function sid(part, n) {
  return `p${part}-${String(n).padStart(2, '0')}`;
}

function buildPart1Slides() {
  const slides = [];
  let n = 1;
  slides.push({
    id: sid(1, n++),
    part: 1,
    lesson: 'dv-am-chu',
    menu: 'Phần 1 · Giới thiệu',
    type: 'title',
    title: 'Học âm – chữ',
    subtitle: 'Đọc trái → phải · Ghép âm rồi đọc trơn',
    body: 'Lộ trình: Bảng chữ → Nguyên âm / Phụ âm → Dấu thanh → Ghép âm → Đọc từ → Đọc câu.',
  });

  slides.push({
    id: sid(1, n++),
    part: 1,
    lesson: 'dv-am-chu',
    menu: 'Bảng chữ cái',
    type: 'alphabet',
    title: '29 chữ cái tiếng Việt',
    letters: ALPHABET,
  });

  slides.push({
    id: sid(1, n++),
    part: 1,
    lesson: 'dv-am-chu',
    menu: 'Nguyên âm',
    type: 'letters',
    title: 'Nguyên âm',
    letters: VOWELS,
    hint: 'Nguyên âm có thể đứng đầu tiếng (a, e, o…) hoặc làm vần.',
  });

  slides.push({
    id: sid(1, n++),
    part: 1,
    lesson: 'dv-am-chu',
    menu: 'Phụ âm',
    type: 'letters',
    title: 'Phụ âm (luyện ghép)',
    letters: CONSONANTS,
    hint: 'Phụ âm đứng trước vần: b + a → ba.',
  });

  slides.push({
    id: sid(1, n++),
    part: 1,
    lesson: 'dv-am-chu',
    menu: 'Dấu thanh',
    type: 'tones',
    title: 'Năm dấu thanh',
    examples: [
      { word: 'ma', tone: 'ngang' },
      { word: 'má', tone: 'sắc' },
      { word: 'mà', tone: 'huyền' },
      { word: 'mả', tone: 'hỏi' },
      { word: 'mã', tone: 'ngã' },
      { word: 'mạ', tone: 'nặng' },
    ],
  });

  const blends = [
    { c: 'b', v: 'a', words: ['ba'], sentence: 'Ba đi làm.' },
    { c: 'm', v: 'a', words: ['ma', 'má', 'mẹ'], sentence: 'Mẹ yêu em.' },
    { c: 'c', v: 'a', words: ['ca'], sentence: 'Ca hát hay.' },
    { c: 'l', v: 'e', words: ['le', 'lé'], sentence: 'Lá cây xanh.' },
    { c: 'h', v: 'a', words: ['ha', 'hà'], sentence: 'Hà lan nở.' },
    { c: 't', v: 'u', words: ['tu'], sentence: 'Em đi học.' },
  ];

  for (const b of blends) {
    slides.push({
      id: sid(1, n++),
      part: 1,
      lesson: 'dv-am-chu',
      menu: `Ghép âm ${b.c} + ${b.v}`,
      type: 'blend',
      title: 'Ghép âm',
      consonant: b.c,
      vowel: b.v,
      word: b.c + b.v,
      spell: `${b.c} – ${b.v} → ${b.c + b.v}`,
      sentence: b.sentence,
      words: b.words,
    });
  }

  slides.push({
    id: sid(1, n++),
    part: 1,
    lesson: 'dv-am-chu',
    menu: 'Đọc câu (ôn)',
    type: 'sentence',
    title: 'Đọc câu',
    sentence: 'Em học chữ. Mẹ khen em.',
    spell: 'Đọc từng tiếng, ghép lại thành câu.',
  });

  return slides;
}

function buildPart2Slides() {
  const slides = [];
  let n = 1;
  slides.push({
    id: sid(2, n++),
    part: 2,
    lesson: 'dv-hoc-van',
    menu: 'Phần 2 · Học vần',
    type: 'title',
    title: 'Học vần',
    subtitle: 'Vần ở giữa sơ đồ · Các tiếng cùng vần',
    body: 'Mỗi vần: đánh vần → đọc tiếng → đọc từ trong câu.',
  });

  for (const group of VAN_GROUPS) {
    slides.push({
      id: sid(2, n++),
      part: 2,
      lesson: 'dv-hoc-van',
      menu: `Vần «${group.center}»`,
      type: 'van-intro',
      title: `Vần «${group.center}»`,
      center: group.center,
      hint: 'Cùng vần, khác phụ âm đầu.',
    });

    for (const it of group.items) {
      slides.push({
        id: sid(2, n++),
        part: 2,
        lesson: 'dv-hoc-van',
        menu: `${it.word} (vần ${group.center})`,
        type: 'van-word',
        title: 'Đọc tiếng',
        consonant: it.c,
        van: group.center,
        word: it.word,
        spell: `${it.c} – ${group.center} → ${it.word}`,
        sentence: it.sentence,
      });
    }
  }

  return slides;
}

function buildPart3Slides() {
  const slides = [];
  let n = 1;
  slides.push({
    id: sid(3, n++),
    part: 3,
    lesson: 'dv-luyen-doc',
    menu: 'Phần 3 · Luyện đọc',
    type: 'title',
    title: 'Luyện đọc',
    subtitle: 'Đọc trơn từng dòng',
    body: 'Đánh vần xong thì đọc cả câu, cả bài.',
  });

  for (const article of LUYEN_DOC) {
    slides.push({
      id: sid(3, n++),
      part: 3,
      lesson: 'dv-luyen-doc',
      menu: article.title,
      type: 'passage-title',
      title: article.title,
    });
    article.lines.forEach((line, li) => {
      slides.push({
        id: sid(3, n++),
        part: 3,
        lesson: 'dv-luyen-doc',
        menu: `${article.title} · dòng ${li + 1}`,
        type: 'read-line',
        title: article.title,
        line,
        lineIndex: li + 1,
        lineTotal: article.lines.length,
      });
    });
  }

  return slides;
}

const ALL_SLIDES = [...buildPart1Slides(), ...buildPart2Slides(), ...buildPart3Slides()];

function getSlidesForLesson(lessonSlug) {
  if (lessonSlug === 'dv-hub') return ALL_SLIDES;
  return ALL_SLIDES.filter((s) => s.lesson === lessonSlug);
}

function getMenuForLesson(lessonSlug) {
  const slides = getSlidesForLesson(lessonSlug);
  const seen = new Set();
  const items = [];
  for (const s of slides) {
    if (seen.has(s.menu)) continue;
    seen.add(s.menu);
    items.push({ label: s.menu, slideId: s.id });
  }
  return items;
}

function getGlobalMenu() {
  return [
    { part: 1, lesson: 'dv-am-chu', label: 'Phần 1: Âm – chữ' },
    { part: 2, lesson: 'dv-hoc-van', label: 'Phần 2: Học vần' },
    { part: 3, lesson: 'dv-luyen-doc', label: 'Phần 3: Luyện đọc' },
  ];
}

module.exports = {
  ALL_SLIDES,
  getSlidesForLesson,
  getMenuForLesson,
  getGlobalMenu,
};
