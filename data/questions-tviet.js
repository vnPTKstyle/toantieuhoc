const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function makeTextQuestion(prompt, answer, wrongs) {
  const ans = String(answer).trim();
  const distractors = [...new Set(wrongs.map((w) => String(w).trim()).filter((w) => w && w !== ans))];
  while (distractors.length < 3) {
    distractors.push(`${ans}x${distractors.length + 1}`);
  }
  const choices = shuffle([ans, ...distractors.slice(0, 3)]);
  return { prompt, answer: ans, choices, type: 'choice' };
}

const consonants = ['b', 'c', 'd', 'đ', 'g', 'h', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'x'];
const vowelPairs = [
  { c: 'b', v: 'a', word: 'ba' },
  { c: 'm', v: 'a', word: 'ma' },
  { c: 'c', v: 'o', word: 'co' },
  { c: 'h', v: 'a', word: 'ha' },
  { c: 'l', v: 'e', word: 'le' },
  { c: 't', v: 'u', word: 'tu' },
];

const toneWords = [
  { base: 'ma', tones: { 'má': 'sắc', 'mà': 'huyền', 'mả': 'hỏi', 'mã': 'ngã', 'mạ': 'nặng', ma: 'không dấu' } },
  { base: 'co', tones: { 'có': 'sắc', 'cò': 'huyền', 'cỏ': 'hỏi', 'cõ': 'ngã', 'cọ': 'nặng', co: 'không dấu' } },
];

const tvGenerators = {
  'tv-am-dau': () => {
    const w = pick([
      { word: 'hoa', start: 'h' },
      { word: 'ban', start: 'b' },
      { word: 'cá', start: 'c' },
      { word: 'me', start: 'm' },
      { word: ' lá', start: 'l' },
    ]);
    const word = w.word.trim();
    const wrong = pick(consonants.filter((c) => c !== w.start));
    return makeTextQuestion(`Tiếng «${word}» bắt đầu bằng phụ âm nào?`, w.start, [wrong, pick(consonants), pick(consonants)]);
  },
  'tv-van': () => {
    const p = pick(vowelPairs);
    return makeTextQuestion(`Ghép âm: ${p.c} + ${p.v} = ?`, p.word, [`${p.c}${p.v}${p.v}`, `${p.v}${p.c}`, `${p.c}${p.c}`]);
  },
  'tv-thanh-dieu': () => {
    const t = pick(toneWords);
    const entries = Object.entries(t.tones);
    const [word, toneName] = pick(entries);
    return makeTextQuestion(`Tiếng «${word}» có dấu thanh gì?`, toneName, entries.map((e) => e[1]).filter((x) => x !== toneName));
  },
  'tv-chinh-ta-dau': () => {
    const t = pick(toneWords);
    const correct = pick(Object.keys(t.tones).filter((k) => k !== t.base));
    const wrong = pick(Object.keys(t.tones).filter((k) => k !== correct));
    return makeTextQuestion(`Chọn cách viết đúng từ «${t.base}» (có dấu):`, correct, [wrong, t.base, wrong + 's']);
  },
  'tv-doc-tu': () => {
    const sets = [
      { w: 'mẹ', a: 'người trong gia đình' },
      { w: 'cây', a: 'sự vật' },
      { w: 'nhà', a: 'nơi ở' },
    ];
    const x = pick(sets);
    return makeTextQuestion(`Từ «${x.w}» gợi ý về?`, x.a, sets.map((s) => s.a).filter((a) => a !== x.a));
  },
  'tv-doc-cau': () => {
    const sets = [
      { s: 'Mẹ em đi chợ.', q: 'Ai đi chợ?', a: 'Mẹ em' },
      { s: 'Em đi học.', q: 'Em đi đâu?', a: 'đi học' },
      { s: 'Bố em là bác sĩ.', q: 'Bố em là gì?', a: 'bác sĩ' },
    ];
    const x = pick(sets);
    return makeTextQuestion(`Câu: «${x.s}» ${x.q}`, x.a, ['em', 'nhà', 'trường']);
  },
  'tv-tu-chi-su-vat': () => {
    const items = [
      { w: 'cây', type: 'sự vật' },
      { w: 'chạy', type: 'hoạt động' },
      { w: 'xanh', type: 'đặc điểm' },
    ];
    const i = pick(items);
    return makeTextQuestion(`Từ «${i.w}» thuộc loại từ nào?`, i.type, items.map((x) => x.type).filter((t) => t !== i.type));
  },
  'tv-cau-don': () => {
    return makeTextQuestion('Câu «Em là học sinh.» thuộc mẫu câu nào?', 'Ai là gì?', ['Ai làm gì?', 'Câu hỏi', 'Câu cảm']);
  },
  'tv-gk1-van-dau': () => pick([tvGenerators['tv-van'], tvGenerators['tv-thanh-dieu']])(),
  'tv-gk1-de-mau': () => {
    const pool = ['tv-van', 'tv-thanh-dieu', 'tv-doc-cau', 'tv-chinh-ta-dau', 'tv-am-dau'];
    return tvGenerators[pick(pool)]();
  },
  'g2-tv-doc-doan': () =>
    makeTextQuestion(
      'Đoạn: «Sáng nay, Lan đi học cùng bạn.» Ý chính?',
      'Lan đi học',
      ['Lan ăn sáng', 'Trời mưa', 'Lan ngủ']
    ),
  'g2-tv-doc-tu': () => makeTextQuestion('Từ «bạn bè» là?', 'từ chỉ người', ['từ chỉ vật', 'từ chỉ màu', 'số đếm']),
  'g2-tv-chinh-ta-dau': () => tvGenerators['tv-chinh-ta-dau'](),
  'g2-tv-chinh-ta-am': () =>
    makeTextQuestion('Chọn từ viết đúng:', 'trường', ['truờng', 'chường', 'trườn']),
  'g2-tv-tu-loai': () => tvGenerators['tv-tu-chi-su-vat'](),
  'g2-tv-cau-mau': () =>
    makeTextQuestion('«Bạn Nam chơi cầu lông.» là câu kiểu?', 'Ai làm gì?', ['Ai là gì?', 'Ai thế nào?', 'Câu hỏi']),
  'g2-tv-on-tap': () => tvGenerators[pick(['g2-tv-doc-doan', 'g2-tv-cau-mau', 'g2-tv-chinh-ta-am'])](),
  'g3-tv-doc-hieu': () =>
    makeTextQuestion('Bài kể: em giúp mẹ nhặt rau. Việc em làm?', 'giúp mẹ', ['đi chơi', 'ngủ', 'xem tivi']),
  'g3-tv-y-nghia': () => makeTextQuestion('Từ «xanh biếc» gợi tả?', 'màu sắc', ['âm thanh', 'mùi vị', 'hình dáng']),
  'g3-tv-chinh-ta': () => makeTextQuestion('Viết đúng:', 'làng quê', ['nàng quê', 'làng que', 'nàng que']),
  'g3-tv-so-sanh': () => makeTextQuestion('«Mẹ hiền như cầu vồng» dùng biện pháp?', 'so sánh', ['nhân hóa', 'ẩn dụ', 'điệp ngữ']),
  'g3-tv-cau-ke': () => makeTextQuestion('Câu «Chim hót líu lo.» trả lời câu hỏi?', 'Làm gì?', ['Ai?', 'Ở đâu?', 'Khi nào?']),
  'g3-tv-on-tap': () => tvGenerators[pick(['g3-tv-doc-hieu', 'g3-tv-so-sanh', 'g3-tv-chinh-ta'])](),
  'g4-tv-doc-hieu': () =>
    makeTextQuestion('Ý chính đoạn tả cây bàng?', 'vẻ đẹp cây bàng', ['cách trồng cây', 'lịch sử', 'mua bán']),
  'g4-tv-van-ban': () => makeTextQuestion('Thơ thường có?', 'nhịp và vần', ['bảng số liệu', 'sơ đồ', 'công thức']),
  'g4-tv-tu-loai': () =>
    makeTextQuestion('«Chạy» thuộc loại từ?', 'động từ', ['danh từ', 'tính từ', 'đại từ']),
  'g4-tv-cau': () => makeTextQuestion('«Em học chăm.» là câu?', 'Ai thế nào?', ['Ai là gì?', 'Ai làm gì?', 'Ở đâu?']),
  'g4-tv-tlv-doan': () => makeTextQuestion('Đoạn văn 4–5 câu nên?', 'một ý chính', ['nhiều ý lẫn lộn', 'chỉ toán', 'không cần mở đoạn']),
  'g4-tv-on-tap': () => tvGenerators[pick(['g4-tv-doc-hieu', 'g4-tv-tu-loai', 'g4-tv-tlv-doan'])](),
  'g5-tv-doc-hieu': () =>
    makeTextQuestion('Chi tiết «nụ cười hiền» gợi tả điều gì?', 'tình cảm mẹ', ['thời tiết', 'giá cả', 'độ cao']),
  'g5-tv-nhan-vat': () => makeTextQuestion('Nhân vật chính thường là?', 'người có nhiều chi tiết nhất', ['người không xuất hiện', 'vật vô tri', 'số liệu']),
  'g5-tv-chu-vi': () => makeTextQuestion('«Em» trong «Em đọc sách» là?', 'chủ ngữ', ['vị ngữ', 'bổ ngữ', 'tân ngữ']),
  'g5-tv-bien-phap': () => makeTextQuestion('«Mặt trời cười» là?', 'nhân hóa', ['so sánh', 'ẩn dụ', 'hoán dụ']),
  'g5-tv-tlv': () => makeTextQuestion('Bài văn kể chuyện cần?', 'mở–diễn biến–kết', ['chỉ một câu', 'chỉ liệt kê', 'không cần kết']),
  'g5-tv-on-tap': () => tvGenerators[pick(['g5-tv-doc-hieu', 'g5-tv-chu-vi', 'g5-tv-bien-phap'])](),
  'dv-am-chu': () => pick([tvGenerators['tv-van'], tvGenerators['tv-am-dau'], tvGenerators['tv-thanh-dieu']])(),
  'dv-hoc-van': () => {
    const sets = [
      { q: 'Ghép: b + an = ?', a: 'ban', w: ['bon', 'ben', 'bin'] },
      { q: 'Ghép: c + on = ?', a: 'con', w: ['can', 'cen', 'cun'] },
      { q: 'Tiếng «lan» có vần gì?', a: 'an', w: ['on', 'en', 'a'] },
      { q: 'Ghép: m + a = ?', a: 'ma', w: ['me', 'mo', 'mu'] },
    ];
    const x = pick(sets);
    return makeTextQuestion(x.q, x.a, x.w);
  },
  'dv-luyen-doc': () => {
    const sets = [
      { s: 'Em đi học.', q: 'Em đi đâu?', a: 'đi học' },
      { s: 'Mẹ yêu em.', q: 'Ai yêu em?', a: 'Mẹ' },
      { s: 'Con yêu mẹ.', q: 'Con yêu ai?', a: 'mẹ' },
    ];
    const x = pick(sets);
    return makeTextQuestion(`Câu: «${x.s}» ${x.q}`, x.a, ['bố', 'trường', 'nhà']);
  },
  'dv-on-tap': () =>
    tvGenerators[pick(['dv-am-chu', 'dv-hoc-van', 'dv-luyen-doc', 'tv-thanh-dieu'])](),
};

function generateTvQuestion(slug) {
  const gen = tvGenerators[slug];
  if (gen) return gen();
  if (/^g[2-5]-tv-/.test(slug)) {
    return makeTextQuestion(`(Lớp ${slug[1]}) Đọc kỹ câu hỏi và chọn đáp án đúng nhất.`, 'đọc hiểu', ['bỏ qua', 'đoán', 'chọn ngẫu nhiên']);
  }
  return makeTextQuestion('Tiếng nào viết đúng: «ba»?', 'ba', ['ab', 'be', 'ca']);
}

module.exports = { tvGenerators, generateTvQuestion };
