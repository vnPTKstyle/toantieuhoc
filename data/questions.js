const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = (arr) => arr[rand(0, arr.length - 1)];

function makeNumericQuestion(prompt, answer, options = null) {
  let choices;
  if (options) {
    choices = [...new Set(options.map(Number))].slice(0, 4);
  } else {
    const wrong = new Set();
    while (wrong.size < 3) {
      const delta = rand(1, 5);
      wrong.add(answer + (Math.random() > 0.5 ? delta : -delta));
    }
    choices = [answer, ...wrong];
  }
  while (choices.length < 4) {
    choices.push(answer + rand(1, 9));
  }
  choices = shuffle(choices.map(String));
  return {
    prompt,
    answer: String(answer),
    choices,
    type: 'choice',
  };
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function genCongTrongPhamVi(maxSum, coNho) {
  let a;
  let b;
  do {
    a = rand(0, maxSum);
    b = rand(0, maxSum - a);
    const carry = (a % 10) + (b % 10) >= 10;
    if (coNho && !carry && maxSum >= 20) continue;
    if (!coNho && carry) continue;
    break;
  } while (true);
  return makeNumericQuestion(`${a} + ${b} = ?`, a + b);
}

function genTruTrongPhamVi(max, coNho) {
  let a;
  let b;
  do {
    a = rand(1, max);
    b = rand(1, a);
    const borrow = (a % 10) < (b % 10);
    if (coNho && !borrow && max >= 20) continue;
    if (!coNho && borrow) continue;
    break;
  } while (true);
  return makeNumericQuestion(`${a} − ${b} = ?`, a - b);
}

function genCongDen100(khongNho) {
  let a;
  let b;
  do {
    a = rand(10, 99);
    b = rand(1, 99 - a);
    const carry = (a % 10) + (b % 10) >= 10;
    if (khongNho && carry) continue;
    if (!khongNho && !carry) continue;
    break;
  } while (true);
  return makeNumericQuestion(`${a} + ${b} = ?`, a + b);
}

function genTruDen100(khongNho) {
  let a;
  let b;
  do {
    a = rand(20, 99);
    b = rand(1, a - 1);
    const borrow = (a % 10) < (b % 10);
    if (khongNho && borrow) continue;
    if (!khongNho && !borrow) continue;
    break;
  } while (true);
  return makeNumericQuestion(`${a} − ${b} = ?`, a - b);
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

const generators = {
  'dem-so': () => {
    const n = rand(0, 10);
    const objs = ['quả táo', 'ngôi sao', 'bông hoa', 'con chim'];
    return makeNumericQuestion(
      `Có ${n} ${pick(objs)}. Số đó là?`,
      n,
      [n, n + 1, n - 1, n + 2].filter((x) => x >= 0)
    );
  },
  'so-sanh-10': () => {
    let a = rand(0, 10);
    let b = rand(0, 10);
    while (a === b) b = rand(0, 10);
    const bigger = a > b ? a : b;
    return makeNumericQuestion(`Số nào lớn hơn: ${a} hay ${b}?`, bigger, [a, b, a + b, Math.abs(a - b)]);
  },
  'cong-tru-10': () => (Math.random() > 0.5 ? genCongTrongPhamVi(10, false) : genTruTrongPhamVi(10, false)),
  'g1-cong-10': () => genCongTrongPhamVi(10, false),
  'g1-tru-10': () => genTruTrongPhamVi(10, false),
  'g1-cong-100-khong-nho': () => genCongDen100(true),
  'g1-tru-100-khong-nho': () => genTruDen100(true),
  'g1-cong-100-co-nho': () => genCongDen100(false),
  'g1-tru-100-co-nho': () => genTruDen100(false),
  'g1-nhan-hang-bang': () => {
    const m = rand(2, 5);
    const n = rand(2, 4);
    const sum = m * n;
    return makeNumericQuestion(`${Array(n).fill(m).join(' + ')} = ?`, sum);
  },
  'g1-chia-nhom-deu': () => {
    const groups = pick([2, 3, 4, 5]);
    const each = rand(2, 5);
    const total = groups * each;
    return makeNumericQuestion(
      `Chia ${total} kẹo đều cho ${groups} bạn. Mỗi bạn được ? kẹo`,
      each
    );
  },
  'g1-gk1-sap-xep-so': () => {
    const poolSets = [
      [3, 9, 8, 0, 5],
      [7, 10, 4, 5, 1, 3],
      [6, 2, 8, 1, 4],
    ];
    const nums = pick(poolSets);
    const sorted = [...nums].sort((a, b) => a - b);
    const qType = pick(['max', 'min', 'third']);
    const label = nums.join('; ');
    if (qType === 'max') {
      return makeNumericQuestion(`Sắp xếp ${label} từ bé đến lớn. Số lớn nhất là?`, sorted[sorted.length - 1], nums);
    }
    if (qType === 'min') {
      return makeNumericQuestion(`Sắp xếp ${label} từ bé đến lớn. Số bé nhất là?`, sorted[0], nums);
    }
    const idx = rand(1, Math.min(3, sorted.length - 2));
    return makeNumericQuestion(
      `Sắp xếp ${label} từ bé đến lớn. Số đứng thứ ${idx + 1} là?`,
      sorted[idx],
      sorted
    );
  },
  'g1-gk1-so-sanh-bieu-thuc': () => {
    const a = rand(0, 4);
    const b = rand(0, 5 - a);
    const c = rand(0, 4);
    const d = rand(0, 5 - c);
    const left = a + b;
    const right = c + d;
    let sign;
    if (left > right) sign = '>';
    else if (left < right) sign = '<';
    else sign = '=';
    return makeTextQuestion(
      `Điền dấu >, < hoặc =: ${a} + ${b} ... ${c} + ${d}`,
      sign,
      ['>', '<', '=', String(left)]
    );
  },
  'g1-gk1-dien-so-khoang': () => {
    const templates = [
      () => {
        const mid = rand(1, 8);
        return { prompt: `${mid + 1} > … > ${mid - 1}`, answer: mid };
      },
      () => {
        const mid = rand(1, 8);
        return { prompt: `${mid - 1} < … < ${mid + 1}`, answer: mid };
      },
      () => {
        const n = rand(1, 9);
        return { prompt: `${n + 1} > …`, answer: rand(0, n) };
      },
      () => {
        const n = rand(0, 8);
        return { prompt: `… = ${n}`, answer: n };
      },
    ];
    const t = pick(templates)();
    return makeNumericQuestion(`Điền số thích hợp: ${t.prompt}`, t.answer);
  },
  'g1-gk1-tinh-cong-nhanh': () => {
    const a = rand(0, 5);
    const b = rand(0, 5 - a);
    return makeNumericQuestion(`${a} + ${b} = ?`, a + b);
  },
  'g1-gk1-dem-do-vat': () => {
    const items = [
      { emoji: '🍎', name: 'quả táo' },
      { emoji: '⭐', name: 'ngôi sao' },
      { emoji: '🌸', name: 'bông hoa' },
      { emoji: '✏️', name: 'bút chì' },
    ];
    const target = pick(items);
    const other = pick(items.filter((x) => x.name !== target.name));
    const nTarget = rand(2, 6);
    const nOther = rand(1, 4);
    const scene = target.emoji.repeat(nTarget) + other.emoji.repeat(nOther);
    return makeNumericQuestion(`Trên tranh: ${scene}. Có bao nhiêu ${target.name}?`, nTarget);
  },
  'g1-gk1-dem-hinh': () => {
    const circles = rand(1, 5);
    const squares = rand(1, 4);
    const triangles = rand(1, 4);
    const ask = pick([
      { name: 'hình tròn', n: circles },
      { name: 'hình vuông', n: squares },
      { name: 'hình tam giác', n: triangles },
    ]);
    return makeNumericQuestion(
      `Hình vẽ có ${circles} hình tròn, ${squares} hình vuông, ${triangles} hình tam giác. Có bao nhiêu ${ask.name}?`,
      ask.n
    );
  },
  'g2-on-toan': () =>
    pick([
      generators['g2-cong-co-nho'],
      generators['g2-nhan-2-5'],
      generators['g2-chia-2-5'],
      generators['chu-vi-hinh-chu-nhat'],
    ])(),
  'g3-on-toan': () =>
    pick([
      generators['g3-cong-4-chu-so'],
      generators['g3-nhan-2-chu-so'],
      generators['g3-chia-1-chu-so'],
      generators['chu-vi-dien-tich'],
    ])(),
  'g4-on-toan': () =>
    pick([
      generators['g4-cong-so-lon'],
      generators['g4-nhan-nhieu-chu-so'],
      generators['g4-ps-cong-tru'],
      generators['dien-tich-hinh'],
    ])(),
  'g1-gk1-de-mau': () => {
    const pool = [
      'g1-gk1-sap-xep-so',
      'g1-gk1-so-sanh-bieu-thuc',
      'g1-gk1-dien-so-khoang',
      'g1-gk1-tinh-cong-nhanh',
      'g1-gk1-dem-do-vat',
      'g1-gk1-dem-hinh',
      'g1-cong-10',
      'so-sanh-10',
    ];
    const slug = pick(pool);
    return generators[slug]();
  },
  'chuc-don-vi': () => {
    const tens = rand(1, 9);
    const ones = rand(0, 9);
    const n = tens * 10 + ones;
    const wrongTens = tens === 9 ? 8 : tens + 1;
    return makeNumericQuestion(
      `Số gồm ${tens} chục và ${ones} đơn vị là?`,
      n,
      [n, wrongTens * 10 + ones, tens + ones, tens * 10]
    );
  },
  'cong-tru-khong-nho': () => {
    const a = rand(10, 89);
    const b = rand(1, 9);
    const onesA = a % 10;
    if (Math.random() > 0.5 && onesA + b < 10) {
      return makeNumericQuestion(`${a} + ${b} = ?`, a + b);
    }
    const c = rand(20, 99);
    const d = rand(1, c % 10);
    if (c % 10 >= d) {
      return makeNumericQuestion(`${c} − ${d} = ?`, c - d);
    }
    return makeNumericQuestion(`${a} + ${b} = ?`, a + b);
  },
  'hinh-khoi': () => {
    const shapes = [
      { name: 'hình lập phương', fact: '6 mặt vuông bằng nhau' },
      { name: 'hình hộp chữ nhật', fact: '6 mặt hình chữ nhật' },
    ];
    const s = pick(shapes);
    const q = pick([
      { prompt: `${s.name} có mấy mặt?`, answer: 6 },
      { prompt: `${s.name} có mấy cạnh?`, answer: 12 },
    ]);
    return makeNumericQuestion(q.prompt, q.answer, [4, 6, 8, 12]);
  },
  'hinh-phang': () => {
    const sides = pick([
      { name: 'tam giác', n: 3 },
      { name: 'hình vuông', n: 4 },
      { name: 'hình tròn', n: 0 },
    ]);
    if (sides.n === 0) {
      return {
        prompt: 'Hình tròn có bao nhiêu cạnh thẳng?',
        answer: '0',
        choices: shuffle(['0', '1', '3', '4']),
        type: 'choice',
      };
    }
    return makeNumericQuestion(`Hình ${sides.name} có bao nhiêu cạnh?`, sides.n, [3, 4, 5, 6]);
  },
  'do-dai-cm': () => {
    const cm = rand(5, 30);
    return makeNumericQuestion(`Thước kẻ dài 20 cm. Đoạn thẳng dài ${cm} cm là bao nhiêu xăng-ti-mét?`, cm);
  },
  'thoi-gian-ngay': () => {
    const days = rand(28, 31);
    const month = pick(['tháng 2', 'tháng 4', 'tháng 6']);
    if (month === 'tháng 2') {
      return makeNumericQuestion('Tháng 2 thường có bao nhiêu ngày? (năm thường)', 28, [28, 29, 30, 31]);
    }
    return makeNumericQuestion(`${month} có bao nhiêu ngày?`, 30, [28, 29, 30, 31]);
  },
  'tram-chuc-don-vi': () => {
    const h = rand(1, 9);
    const t = rand(0, 9);
    const o = rand(0, 9);
    const n = h * 100 + t * 10 + o;
    return makeNumericQuestion(`Số gồm ${h} trăm, ${t} chục, ${o} đơn vị là?`, n);
  },
  'so-sanh-1000': () => {
    const a = rand(100, 999);
    let b = rand(100, 999);
    while (b === a) b = rand(100, 999);
    return makeNumericQuestion(`Số nào bé hơn: ${a} hay ${b}?`, a < b ? a : b, [a, b]);
  },
  'cong-tru-co-nho': () =>
    Math.random() > 0.5 ? generators['g2-cong-co-nho']() : generators['g2-tru-co-nho'](),
  'g2-cong-co-nho': () => genCongDen100(false),
  'g2-tru-co-nho': () => genTruDen100(false),
  'g2-cong-1000': () => {
    const a = rand(1, 9) * 100 + rand(0, 9) * 10;
    const b = rand(1, 9) * 100 + rand(0, 9) * 10;
    if (a + b > 999) return generators['g2-cong-1000']();
    return makeNumericQuestion(`${a} + ${b} = ?`, a + b);
  },
  'g2-tru-1000': () => {
    const a = rand(3, 9) * 100 + rand(0, 9) * 10;
    const b = rand(1, Math.floor(a / 10) - 1) * 10 + rand(1, 9);
    if (b >= a) return generators['g2-tru-1000']();
    return makeNumericQuestion(`${a} − ${b} = ?`, a - b);
  },
  'nhan-bang': () => generators['g2-nhan-2-5'](),
  'g2-nhan-bang-245': () => generators['g2-nhan-2-5'](),
  'g2-nhan-2-5': () => {
    const table = pick([2, 5]);
    const m = rand(2, 9);
    return makeNumericQuestion(`${table} × ${m} = ?`, table * m);
  },
  'g2-nhan-3-4': () => {
    const table = pick([3, 4]);
    const m = rand(2, 9);
    return makeNumericQuestion(`${table} × ${m} = ?`, table * m);
  },
  'g2-nhan-co-nho': () => {
    const a = rand(11, 29);
    const b = rand(2, 4);
    if ((a % 10) * b >= 10) return generators['g2-nhan-co-nho']();
    return makeNumericQuestion(`${a} × ${b} = ?`, a * b);
  },
  'chia-bang': () => generators['g2-chia-2-5'](),
  'g2-chia-bang-245': () => generators['g2-chia-2-5'](),
  'g2-chia-2-5': () => {
    const table = pick([2, 5]);
    const m = rand(2, 9);
    const product = table * m;
    return makeNumericQuestion(`${product} : ${table} = ?`, m);
  },
  'g2-chia-3-4': () => {
    const table = pick([3, 4]);
    const m = rand(2, 9);
    const product = table * m;
    return makeNumericQuestion(`${product} : ${table} = ?`, m);
  },
  'g2-chia-co-du': () => {
    const d = pick([2, 3, 4, 5]);
    const q = rand(2, 8);
    const r = rand(1, d - 1);
    const n = d * q + r;
    return makeNumericQuestion(`${n} : ${d} = ? (lấy phần nguyên)`, q);
  },
  'chu-vi-hinh-chu-nhat': () => {
    const a = rand(3, 15);
    const b = rand(3, 15);
    return makeNumericQuestion(
      `Hình chữ nhật có chiều dài ${a} cm, chiều rộng ${b} cm. Chu vi bằng bao nhiêu cm?`,
      2 * (a + b)
    );
  },
  'do-dai-m-dm': () => {
    const dm = rand(2, 9);
    return makeNumericQuestion(`${dm} dm = ? cm`, dm * 10, [dm, dm * 10, dm + 10, dm * 100]);
  },
  'cong-tru-nhieu-chu-so': () =>
    Math.random() > 0.5 ? generators['g3-cong-4-chu-so']() : generators['g3-tru-4-chu-so'](),
  'g3-cong-4-chu-so': () => {
    const a = rand(100, 9999);
    const b = rand(100, Math.min(9999 - a, 5000));
    return makeNumericQuestion(`${a} + ${b} = ?`, a + b);
  },
  'g3-tru-4-chu-so': () => {
    const a = rand(1000, 9999);
    const b = rand(100, a - 100);
    return makeNumericQuestion(`${a} − ${b} = ?`, a - b);
  },
  'g3-cong-co-nho': () => {
    const a = rand(1000, 8999);
    const b = rand(111, 999);
    return makeNumericQuestion(`${a} + ${b} = ?`, a + b);
  },
  'g3-tru-co-nho': () => {
    const a = rand(2000, 9999);
    const b = rand(111, 1500);
    if (b >= a) return generators['g3-tru-co-nho']();
    return makeNumericQuestion(`${a} − ${b} = ?`, a - b);
  },
  'g3-bang-nhan-6910': () => {
    const table = pick([6, 7, 8, 9, 10]);
    const m = rand(2, 9);
    return makeNumericQuestion(`${table} × ${m} = ?`, table * m);
  },
  'nhan-chia-2-chu-so': () =>
    Math.random() > 0.5 ? generators['g3-nhan-2-chu-so']() : generators['g3-chia-1-chu-so'](),
  'g3-nhan-2-chu-so': () => {
    const a = rand(12, 45);
    const b = rand(2, 9);
    return makeNumericQuestion(`${a} × ${b} = ?`, a * b);
  },
  'g3-nhan-3-chu-so': () => {
    const a = rand(100, 499);
    const b = rand(2, 9);
    return makeNumericQuestion(`${a} × ${b} = ?`, a * b);
  },
  'g3-chia-1-chu-so': () => {
    const d = rand(2, 9);
    const q = rand(11, 99);
    const product = d * q;
    return makeNumericQuestion(`${product} : ${d} = ?`, q);
  },
  'g3-chia-co-du': () => {
    const d = rand(3, 9);
    const q = rand(10, 40);
    const r = rand(1, d - 1);
    const n = d * q + r;
    return makeNumericQuestion(`${n} : ${d} = ? (phần nguyên)`, q);
  },
  'g4-cong-so-lon': () => {
    const a = rand(10000, 999999);
    const b = rand(1000, 999999 - a);
    return makeNumericQuestion(`${a} + ${b} = ?`, a + b);
  },
  'g4-tru-so-lon': () => {
    const a = rand(50000, 999999);
    const b = rand(1000, a - 1000);
    return makeNumericQuestion(`${a} − ${b} = ?`, a - b);
  },
  'g4-nhan-nhieu-chu-so': () => generators['nhan-chia-lon'](),
  'g4-nhan-10-100-1000': () => {
    const a = rand(12, 999);
    const m = pick([10, 100, 1000]);
    return makeNumericQuestion(`${a} × ${m} = ?`, a * m);
  },
  'g4-chia-nhieu-chu-so': () => {
    const d = rand(2, 9);
    const q = rand(100, 999);
    const n = d * q;
    return makeNumericQuestion(`${n} : ${d} = ?`, q);
  },
  'g4-chia-2-chu-so': () => {
    const d = rand(11, 25);
    const q = rand(2, 9);
    const n = d * q;
    return makeNumericQuestion(`${n} : ${d} = ?`, q);
  },
  'g4-ps-cong-tru': () => {
    const d = pick([4, 5, 6, 8, 10]);
    const n1 = rand(1, d - 1);
    const n2 = rand(1, d - 1);
    if (Math.random() > 0.5) {
      const ans = n1 + n2;
      if (ans > d) return generators['g4-ps-cong-tru']();
      return makeTextQuestion(`${n1}/${d} + ${n2}/${d} = ?`, `${ans}/${d}`, [
        `${n1 + n2 + 1}/${d}`,
        `${n1}/${d}`,
        `${n2}/${d}`,
      ]);
    }
    const big = Math.max(n1, n2);
    const small = Math.min(n1, n2);
    return makeTextQuestion(`${big}/${d} − ${small}/${d} = ?`, `${big - small}/${d}`, [
      `${big}/${d}`,
      `${small}/${d}`,
      `${big + small}/${d}`,
    ]);
  },
  'g5-cong-tp': () => {
    const a = rand(1, 99) / 10;
    const b = rand(1, 99) / 10;
    const ans = Math.round((a + b) * 10) / 10;
    const fmt = (x) => String(x).replace('.', ',');
    return makeTextQuestion(`${fmt(a)} + ${fmt(b)} = ?`, fmt(ans), [
      fmt(ans + 0.1),
      fmt(ans - 0.1),
      fmt(a),
    ]);
  },
  'g5-tru-tp': () => {
    const a = rand(20, 99) / 10;
    const b = rand(1, Math.floor(a * 10) - 1) / 10;
    const ans = Math.round((a - b) * 10) / 10;
    const fmt = (x) => String(x).replace('.', ',');
    return makeTextQuestion(`${fmt(a)} − ${fmt(b)} = ?`, fmt(ans), [
      fmt(ans + 0.1),
      fmt(b),
      fmt(a),
    ]);
  },
  'g5-nhan-tp': () => {
    const a = rand(2, 9);
    const b = rand(11, 49) / 10;
    const ans = Math.round(a * b * 10) / 10;
    const fmt = (x) => String(x).replace('.', ',');
    return makeTextQuestion(`${a} × ${fmt(b)} = ?`, fmt(ans), [fmt(ans + 1), fmt(b), fmt(a)]);
  },
  'g5-chia-tp': () => {
    const d = rand(2, 9);
    const q = rand(11, 49) / 10;
    const n = Math.round(q * d * 10) / 10;
    const fmt = (x) => String(x).replace('.', ',');
    return makeTextQuestion(`${fmt(n)} : ${d} = ?`, fmt(q), [fmt(q + 0.1), fmt(n), String(d)]);
  },
  'g5-cong-ps': () => {
    const d = pick([2, 4, 6, 8]);
    const n1 = 1;
    const n2 = 1;
    return makeTextQuestion(`1/${d} + 1/${d} = ?`, `2/${d}`, [`1/${d}`, `3/${d}`, `1/${d * 2}`]);
  },
  'g5-tru-ps': () => {
    const d = pick([3, 4, 6, 8]);
    return makeTextQuestion(`3/${d} − 1/${d} = ?`, `2/${d}`, [`1/${d}`, `4/${d}`, `3/${d}`]);
  },
  'g5-nhan-ps': () => {
    const ans = pick(['1/2', '2/3', '3/4']);
    const [n, d] = ans.split('/').map(Number);
    return makeTextQuestion(`2/${d} × ${n}/${d} = ?`, ans, [`${n}/${d * 2}`, `${n + 1}/${d}`, `1/${d}`]);
  },
  'g5-chia-ps': () => {
    return makeTextQuestion(`1/2 : 1/4 = ?`, '2', ['1/2', '4', '1/8']);
  },
  'phan-so-co-ban': () => {
    const denom = pick([2, 3, 4, 5, 6, 8, 10]);
    const num = rand(1, denom - 1);
    return {
      prompt: `Phân số ${num}/${denom} có mẫu số là?`,
      answer: String(denom),
      choices: shuffle([String(denom), String(num), String(denom + 1), String(num + 1)]),
      type: 'choice',
    };
  },
  'chu-vi-dien-tich': () => {
    const a = rand(4, 20);
    const b = rand(3, 15);
    if (Math.random() > 0.5) {
      return makeNumericQuestion(
        `Hình chữ nhật dài ${a} cm, rộng ${b} cm. Diện tích = ? cm²`,
        a * b
      );
    }
    return makeNumericQuestion(
      `Hình chữ nhật dài ${a} cm, rộng ${b} cm. Chu vi = ? cm`,
      2 * (a + b)
    );
  },
  'goc-vuong': () => {
    const n = pick([4, 6, 8]);
    return makeNumericQuestion(`Hình chữ nhật có bao nhiêu góc vuông?`, 4, [2, 3, 4, 6]);
  },
  'so-lon-trieu': () => {
    const millions = rand(1, 9);
    const rest = rand(0, 999999);
    const n = millions * 1000000 + rest;
    const digit = pick([
      { name: 'triệu', idx: 0 },
      { name: 'nghìn', idx: 3 },
    ]);
    const s = String(n).padStart(7, '0');
    const chars = s.split('');
    const answer = Number(chars[chars.length - 1 - (digit.name === 'triệu' ? 6 : 3)]);
    return makeNumericQuestion(
      `Trong số ${n.toLocaleString('vi-VN')}, chữ số hàng ${digit.name} là?`,
      answer
    );
  },
  'phan-so-thap-phan': () => {
    const n = rand(1, 9);
    const d = 10;
    return makeNumericQuestion(`Phân số ${n}/${d} viết dưới dạng thập phân là?`, n / 10, [
      n / 10,
      n,
      n / 100,
      n * 10,
    ]);
  },
  'nhan-chia-lon': () => {
    const a = rand(12, 99);
    const b = rand(11, 99);
    return makeNumericQuestion(`${a} × ${b} = ?`, a * b);
  },
  'dien-tich-hinh': () => {
    const side = rand(3, 15);
    if (Math.random() > 0.5) {
      return makeNumericQuestion(`Hình vuông cạnh ${side} cm. Diện tích = ? cm²`, side * side);
    }
    const h = rand(4, 12);
    const base = rand(6, 20);
    return makeNumericQuestion(
      `Tam giác có đáy ${base} cm, chiều cao ${h} cm. Diện tích = ? cm²`,
      (base * h) / 2
    );
  },
  'phan-so-thap-phan-5': () => {
    if (Math.random() > 0.5) {
      const p = rand(10, 90);
      return makeNumericQuestion(`${p}% của 100 bằng?`, p);
    }
    const a = rand(1, 9);
    const b = rand(1, 9);
    return makeNumericQuestion(`${a},${b} + 0,${10 - b} = ?`, a + 1, [a + 1, a, a + 0.1, a + 2]);
  },
  'on-tap-phep-tinh': () => {
    const ops = [
      generators['g4-cong-so-lon'],
      generators['g4-tru-so-lon'],
      generators['g4-nhan-nhieu-chu-so'],
      generators['g4-chia-nhieu-chu-so'],
    ];
    return pick(ops)();
  },
  'the-tich': () => {
    const a = rand(3, 10);
    const b = rand(3, 10);
    const c = rand(3, 10);
    return makeNumericQuestion(
      `Hộp chữ nhật dài ${a} cm, rộng ${b} cm, cao ${c} cm. Thể tích = ? cm³`,
      a * b * c
    );
  },
  'dien-tich-xq': () => {
    const a = rand(4, 12);
    const b = rand(3, 10);
    const h = rand(3, 10);
    const xq = 2 * h * (a + b);
    return makeNumericQuestion(
      `Hộp chữ nhật dài ${a} cm, rộng ${b} cm, cao ${h} cm. Diện tích xung quanh = ? cm²`,
      xq
    );
  },
};

const { generateTvQuestion } = require('./questions-tviet');

function generateQuestion(lessonSlug) {
  if (/^(tv-|g[1-5]-tv-|dv-)/.test(String(lessonSlug))) {
    return generateTvQuestion(lessonSlug);
  }
  const gen = generators[lessonSlug];
  if (!gen) {
    return makeNumericQuestion('2 + 2 = ?', 4);
  }
  return gen();
}

function generateQuiz(lessonSlug, count = 10) {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({ id: i + 1, ...generateQuestion(lessonSlug) });
  }
  return questions;
}

module.exports = { generateQuestion, generateQuiz };
