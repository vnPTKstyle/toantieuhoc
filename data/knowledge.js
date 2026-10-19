/**
 * Nội dung kiến thức + minh họa SVG (nhẹ, không phụ thuộc ảnh ngoài)
 */
const ill = {
  numberLine(max = 10, highlight = null) {
    const w = 320;
    const step = (w - 40) / max;
    let ticks = '';
    for (let i = 0; i <= max; i++) {
      const x = 20 + i * step;
      const hi = highlight === i ? ' class="hl"' : '';
      ticks += `<line x1="${x}" y1="30" x2="${x}" y2="45" stroke="#334155"/>
        <text x="${x}" y="62" text-anchor="middle" font-size="14"${hi}>${i}</text>`;
    }
    const hx = highlight != null ? 20 + highlight * step : 0;
    const dot =
      highlight != null
        ? `<circle cx="${hx}" cy="22" r="6" fill="#2563eb"/>`
        : '';
    return `<svg class="lesson-svg" viewBox="0 0 340 70" role="img" aria-label="Tia số">
      <line x1="20" y1="38" x2="300" y2="38" stroke="#64748b" stroke-width="2"/>
      ${ticks}${dot}
    </svg>`;
  },
  addition(a = 3, b = 2) {
    const drawGroup = (n, x, color) => {
      let s = '';
      for (let i = 0; i < n; i++) {
        s += `<circle cx="${x + (i % 3) * 22}" cy="${40 + Math.floor(i / 3) * 22}" r="9" fill="${color}"/>`;
      }
      return s;
    };
    return `<svg class="lesson-svg" viewBox="0 0 320 90" role="img" aria-label="Minh họa phép cộng">
      ${drawGroup(a, 20, '#f59e0b')}
      <text x="95" y="48" font-size="28" font-weight="bold">+</text>
      ${drawGroup(b, 120, '#38bdf8')}
      <text x="195" y="48" font-size="28" font-weight="bold">=</text>
      ${drawGroup(a + b, 220, '#16a34a')}
      <text x="160" y="82" text-anchor="middle" font-size="13" fill="#475569">${a} + ${b} = ${a + b}</text>
    </svg>`;
  },
  subtraction(a = 5, b = 2) {
    return `<svg class="lesson-svg" viewBox="0 0 280 90" role="img" aria-label="Minh họa phép trừ">
      <text x="20" y="24" font-size="13">Có ${a} — bớt ${b} — còn ${a - b}</text>
      <g transform="translate(30,35)">
        ${Array.from({ length: a }, (_, i) =>
          `<circle cx="${(i % 6) * 18}" cy="${Math.floor(i / 6) * 18}" r="8" fill="${i < a - b ? '#16a34a' : '#fecaca'}" stroke="#94a3b8"/>`
        ).join('')}
      </g>
    </svg>`;
  },
  compare(a = 7, b = 4) {
    return `<svg class="lesson-svg" viewBox="0 0 240 80" role="img" aria-label="So sánh số">
      <rect x="30" y="20" width="${20 + a * 8}" height="28" rx="6" fill="#dbeafe"/>
      <rect x="30" y="52" width="${20 + b * 8}" height="28" rx="6" fill="#fef3c7"/>
      <text x="8" y="38" font-size="14">${a}</text>
      <text x="8" y="70" font-size="14">${b}</text>
      <text x="200" y="48" font-size="22" font-weight="bold">${a > b ? '>' : a < b ? '<' : '='}</text>
    </svg>`;
  },
  placeValue(tens = 3, ones = 4) {
    return `<svg class="lesson-svg" viewBox="0 0 280 100" role="img" aria-label="Chục và đơn vị">
      <text x="20" y="20" font-size="13">Chục</text>
      ${Array.from({ length: tens }, (_, i) =>
        `<rect x="${20 + i * 28}" y="28" width="22" height="50" fill="#bfdbfe" stroke="#2563eb"/>`
      ).join('')}
      <text x="160" y="20" font-size="13">Đơn vị</text>
      ${Array.from({ length: ones }, (_, i) =>
        `<rect x="${160 + i * 14}" y="58" width="10" height="20" fill="#fde68a" stroke="#d97706"/>`
      ).join('')}
      <text x="140" y="95" text-anchor="middle" font-size="15" font-weight="bold">${tens} chục ${ones} đơn vị = ${tens * 10 + ones}</text>
    </svg>`;
  },
  multiply(groups = 3, each = 4) {
    let g = '';
    for (let i = 0; i < groups; i++) {
      g += `<g transform="translate(${20 + i * 70},15)">`;
      for (let j = 0; j < each; j++) {
        g += `<circle cx="12" cy="${8 + j * 16}" r="6" fill="#a78bfa"/>`;
      }
      g += '</g>';
    }
    return `<svg class="lesson-svg" viewBox="0 0 260 90" role="img" aria-label="Minh họa phép nhân">
      ${g}
      <text x="130" y="82" text-anchor="middle" font-size="13">${groups} nhóm × ${each} = ${groups * each}</text>
    </svg>`;
  },
  divide(total = 12, groups = 3) {
    const each = total / groups;
    let s = '';
    for (let g = 0; g < groups; g++) {
      s += `<g transform="translate(${15 + g * 75},12)"><rect width="60" height="55" rx="8" fill="#f1f5f9" stroke="#cbd5e1"/>`;
      for (let i = 0; i < each; i++) {
        s += `<circle cx="${15 + (i % 3) * 15}" cy="${18 + Math.floor(i / 3) * 15}" r="5" fill="#fb7185"/>`;
      }
      s += '</g>';
    }
    return `<svg class="lesson-svg" viewBox="0 0 260 85" role="img" aria-label="Minh họa phép chia">
      ${s}
      <text x="130" y="78" text-anchor="middle" font-size="13">${total} chia ${groups} nhóm → mỗi nhóm ${each}</text>
    </svg>`;
  },
  shapes2d() {
    return `<svg class="lesson-svg" viewBox="0 0 280 90" role="img" aria-label="Hình phẳng">
      <circle cx="45" cy="45" r="28" fill="#fecdd3" stroke="#e11d48"/>
      <rect x="95" y="20" width="50" height="50" fill="#bbf7d0" stroke="#16a34a"/>
      <polygon points="200,70 170,20 230,20" fill="#fde68a" stroke="#d97706"/>
      <text x="45" y="85" text-anchor="middle" font-size="11">tròn</text>
      <text x="120" y="85" text-anchor="middle" font-size="11">vuông</text>
      <text x="200" y="85" text-anchor="middle" font-size="11">tam giác</text>
    </svg>`;
  },
  rulerCm() {
    return `<svg class="lesson-svg" viewBox="0 0 300 70" role="img" aria-label="Thước cm">
      <rect x="20" y="25" width="260" height="22" fill="#fff7ed" stroke="#ea580c"/>
      ${Array.from({ length: 11 }, (_, i) => {
        const x = 20 + i * 26;
        return `<line x1="${x}" y1="25" x2="${x}" y2="${i % 5 === 0 ? 18 : 30}" stroke="#c2410c"/>
          ${i % 5 === 0 ? `<text x="${x}" y="14" font-size="10">${i}</text>` : ''}`;
      }).join('')}
      <line x1="20" y1="47" x2="98" y2="47" stroke="#2563eb" stroke-width="3"/>
      <text x="59" y="62" text-anchor="middle" font-size="12">≈ 3 cm</text>
    </svg>`;
  },
  fraction(num = 1, den = 4) {
    return `<svg class="lesson-svg" viewBox="0 0 120 120" role="img" aria-label="Phân số">
      <circle cx="60" cy="60" r="48" fill="#fff" stroke="#64748b"/>
      ${Array.from({ length: den }, (_, i) => {
        const a1 = ((i * 360) / den - 90) * (Math.PI / 180);
        const a2 = (((i + 1) * 360) / den - 90) * (Math.PI / 180);
        const x1 = 60 + 48 * Math.cos(a1);
        const y1 = 60 + 48 * Math.sin(a1);
        const x2 = 60 + 48 * Math.cos(a2);
        const y2 = 60 + 48 * Math.sin(a2);
        const fill = i < num ? '#93c5fd' : '#f8fafc';
        return `<path d="M60 60 L${x1} ${y1} A48 48 0 0 1 ${x2} ${y2} Z" fill="${fill}" stroke="#cbd5e1"/>`;
      }).join('')}
      <text x="60" y="110" text-anchor="middle" font-size="14">${num}/${den}</text>
    </svg>`;
  },
  vietAlphabet() {
    return `<svg class="lesson-svg" viewBox="0 0 280 100" role="img" aria-label="Bảng chữ cái">
      <rect x="10" y="15" width="260" height="70" rx="10" fill="#fdf2f8" stroke="#f9a8d4"/>
      <text x="24" y="48" font-size="16" font-weight="700" fill="#831843">b a c h m …</text>
      <text x="24" y="72" font-size="13" fill="#9d174d">phụ âm + vần → tiếng (ba, ma, hoa)</text>
      <text x="170" y="55" font-size="28" font-weight="800" fill="#be185d">má</text>
      <text x="220" y="55" font-size="28" fill="#be185d">mà</text>
    </svg>`;
  },
  vietTone() {
    return `<svg class="lesson-svg" viewBox="0 0 240 90" role="img" aria-label="Dấu thanh">
      <text x="20" y="40" font-size="26">ma</text>
      <text x="70" y="40" font-size="26" fill="#dc2626">má</text>
      <text x="120" y="40" font-size="26" fill="#2563eb">mà</text>
      <text x="170" y="40" font-size="26" fill="#16a34a">mã</text>
      <text x="20" y="75" font-size="12" fill="#64748b">sắc · huyền · ngã · …</text>
    </svg>`;
  },
  rectArea(w = 5, h = 3) {
    const scale = 12;
    return `<svg class="lesson-svg" viewBox="0 0 200 120" role="img" aria-label="Diện tích hình chữ nhật">
      <rect x="40" y="30" width="${w * scale}" height="${h * scale}" fill="#dbeafe" stroke="#2563eb"/>
      <text x="${40 + (w * scale) / 2}" y="22" text-anchor="middle" font-size="12">${w} cm</text>
      <text x="28" y="${30 + (h * scale) / 2}" font-size="12">${h} cm</text>
      <text x="100" y="105" text-anchor="middle" font-size="13">S = ${w} × ${h} = ${w * h} cm²</text>
    </svg>`;
  },
};

const bySlug = {
  'dem-so': {
    intro: 'Đếm là nền tảng của Toán: em đếm từng đồ vật một, vừa chỉ số vừa đọc tên số.',
    bullets: ['Đếm thứ tự: 1, 2, 3, …', 'Mỗi đồ vật chỉ đếm một lần', 'Số cuối cùng cho biết “có bao nhiêu”'],
    example: 'Đếm 4 ngôi sao → đọc số 4.',
    tip: 'Dùng ngón tay hoặc que tính khi mới học.',
    svg: ill.numberLine(10, 4),
  },
  'so-sanh-10': {
    intro: 'So sánh số giúp em biết số nào nhiều hơn, ít hơn hay bằng nhau.',
    bullets: ['> : lớn hơn', '< : bé hơn', '= : bằng nhau'],
    example: '7 > 4 vì trên tia số, 7 đứng sau 4.',
    tip: 'Hình vẽ dài hơn thường tương ứng số lớn hơn.',
    svg: ill.compare(7, 4),
  },
  'g1-cong-10': {
    intro: 'Phép cộng gộp hai nhóm lại để tìm tổng.',
    bullets: ['Số hạng + số hạng = tổng', 'Cộng trong phạm vi 10: kết quả không quá 10', 'Có thể cộng nhẩm hoặc dùng que tính'],
    example: '3 + 2 = 5',
    tip: 'Đếm tiếp từ số lớn: 3 → 4, 5.',
    svg: ill.addition(3, 2),
  },
  'g1-tru-10': {
    intro: 'Phép trừ tìm phần còn lại sau khi bớt đi.',
    bullets: ['Số bị trừ − số trừ = hiệu', 'Trong phạm vi 10', 'Hiệu không được âm ở lớp 1'],
    example: '5 − 2 = 3',
    tip: 'Gạch bớt từng đồ vật trên hình.',
    svg: ill.subtraction(5, 2),
  },
  'chuc-don-vi': {
    intro: 'Số có hai chữ số gồm chục (hàng bên trái) và đơn vị (hàng bên phải).',
    bullets: ['34 = 3 chục và 4 đơn vị', 'Số tròn chục: 10, 20, 30, …', 'Đọc số: “ba mươi tư”'],
    example: '5 chục 2 đơn vị viết là 52.',
    tip: 'Một chục = 10 đơn vị.',
    svg: ill.placeValue(3, 4),
  },
  'dv-am-chu': {
    intro: 'Phần 1 theo lộ trình mind map: làm quen bảng chữ, ghép phụ âm + nguyên âm, luyện dấu thanh.',
    bullets: ['29 chữ cái tiếng Việt', 'Ghép âm: b + a → ba', 'Đọc tiếng → từ → câu (dần dần)'],
    example: 'h + o → ho; thêm dấu → hò, hó, họ…',
    tip: 'Dùng nút «Đọc to» trên web; sách in có thêm QR nghe mẫu.',
    svg: ill.vietAlphabet(),
  },
  'dv-hoc-van': {
    intro: 'Phần 2: mỗi vần là một nhánh sơ đồ — các tiếng cùng vần xếp quanh vần trung tâm.',
    bullets: ['Vần a, an, on, en…', 'b + an → ban, c + an → can', 'Mỗi tiếng gắn một câu ngắn'],
    example: 'Vần «an»: ban, can, lan…',
    tip: 'Bấm từng nhánh trên sơ đồ rồi đọc theo câu mẫu.',
    svg: ill.vietTone(),
  },
  'dv-luyen-doc': {
    intro: 'Phần 3: đọc trơn đoạn ngắn, đồng dao — sau khi đánh vần vững từng tiếng.',
    bullets: ['Đọc từng dòng, ngắt hơi đúng', 'Không vội — ưu tiên rõ ràng', 'Có thể nghe «Đọc cả bài»'],
    example: '«Em đi học.» — đọc trơn sau khi đánh vần từng tiếng.',
    tip: 'Luyện mỗi ngày 5–10 phút hiệu quả hơn học dồn.',
    svg: ill.vietAlphabet(),
  },
  'dv-on-tap': {
    intro: 'Ôn ghép âm, vần và đọc hiểu câu ngắn — tổng hợp ba phần.',
    bullets: ['Ghép âm và chọn dấu', 'Nhận biết vần trong tiếng', 'Đọc hiểu câu quen thuộc'],
    example: 'm + a = ma; «Mẹ yêu em.»',
    tip: 'Làm lại phần 1–3 trên web nếu còn sai nhiều.',
    svg: ill.vietTone(),
  },
  'tv-am-dau': {
    intro: 'Tiếng Việt dùng chữ cái Latin. Phụ âm đầu đứng trước vần để tạo tiếng.',
    bullets: ['VD: b + a → ba', 'h + a → ha', 'Đọc từ trái sang phải'],
    example: 'hoa: bắt đầu bằng h',
    tip: 'Tập tìm phụ âm đầu trong từ ở sách Tiếng Việt 1.',
    svg: ill.vietAlphabet(),
  },
  'tv-van': {
    intro: 'Vần là phần âm sau phụ âm đầu (a, e, o, u, …).',
    bullets: ['Ghép: phụ âm + vần = tiếng', 'ba, be, bi, bo, bu cùng vần a/e/i/o/u', 'Không tách rời khi đọc trơn'],
    example: 'm + a = ma',
    tip: 'Đọc to, rõ từng tiếng trong câu.',
    svg: ill.vietAlphabet(),
  },
  'tv-thanh-dieu': {
    intro: 'Thanh điệu tiếng Việt: ngang, sắc, huyền, hỏi, ngã, nặng.',
    bullets: ['Cùng vần, khác dấu → nghĩa khác', 'ma, má, mà, mả, mã, mạ', 'Viết đúng dấu khi chính tả'],
    example: 'có / cò / cỏ',
    tip: 'Đọc theo mẫu giáo viên để quen tai.',
    svg: ill.vietTone(),
  },
  'tv-doc-cau': {
    intro: 'Đọc hiểu câu ngắn: tìm ai, làm gì, ở đâu.',
    bullets: ['Đọc hết câu trước khi trả lời', 'Câu «Ai là gì?»: … là …', 'Gạch chân từ quan trọng'],
    example: '«Mẹ em đi chợ.» — Ai đi chợ? → Mẹ em.',
    tip: 'Một câu một ý ở lớp 1.',
    svg: ill.vietAlphabet(),
  },
  'g1-gk1-de-mau': {
    intro: 'Đề Giữa kì 1 thường gồm: sắp xếp số, so sánh, điền số, cộng nhanh và đếm hình.',
    bullets: ['Đọc kỹ yêu cầu từng câu', 'So sánh có thể kèm phép cộng hai vế', 'Kiểm tra lại trước khi nộp'],
    example: 'Sắp xếp 3; 9; 0 → 0; 3; 9.',
    tip: 'Luyện từng dạng riêng trước khi làm đề tổng hợp.',
    svg: ill.numberLine(10, null),
  },
  'g2-nhan-2-5': {
    intro: 'Phép nhân là cộng các số hạng bằng nhau nhiều lần.',
    bullets: ['2 × 4 = 2 + 2 + 2 + 2 = 8', 'Thuộc bảng nhân 2 và 5', 'Thừa số × thừa số = tích'],
    example: '5 × 3 = 15',
    tip: 'Nhân 5: kết quả luôn tận cùng 0 hoặc 5.',
    svg: ill.multiply(3, 4),
  },
  'g2-chia-2-5': {
    intro: 'Phép chia chia đều vào các nhóm bằng nhau.',
    bullets: ['Chia hết: không còn dư', 'Liên quan bảng nhân (ngược phép nhân)', 'Số chia × thương = số bị chia (chia hết)'],
    example: '12 : 3 = 4',
    tip: 'Hỏi: “12 chia 3 nhóm, mỗi nhóm mấy?”',
    svg: ill.divide(12, 3),
  },
  'hinh-phang': {
    intro: 'Hình phẳng nằm trên mặt phẳng: tròn, vuông, tam giác, chữ nhật.',
    bullets: ['Hình tròn: không góc, không cạnh thẳng', 'Tam giác: 3 cạnh', 'Vuông / chữ nhật: 4 cạnh'],
    example: 'Nhận biết hình theo số cạnh và góc.',
    tip: 'Quan sát đồ vật quanh em: bánh xe, cửa sổ…',
    svg: ill.shapes2d(),
  },
  'do-dai-cm': {
    intro: 'Xăng-ti-mét (cm) dùng đo độ dài ngắn: bút, thước kẻ.',
    bullets: ['Đọc vạch trên thước', '1 dm = 10 cm (lớp 2)', 'Không xô lệch điểm đầu khi đo'],
    example: 'Đo đoạn thẳng AB được 6 cm.',
    tip: 'Mắt nhìn thẳng vạch 0.',
    svg: ill.rulerCm(),
  },
  'phan-so-co-ban': {
    intro: 'Phân số cho biết lấy một phần mấy của cả.',
    bullets: ['Tử số: số phần lấy', 'Mẫu số: chia thành mấy phần bằng nhau', 'Mẫu số khác 0'],
    example: '1/4: chia 4 phần, lấy 1 phần.',
    tip: 'Hình tròn hoặc hình chữ nhật chia ô giúp hình dung.',
    svg: ill.fraction(1, 4),
  },
  'chu-vi-dien-tich': {
    intro: 'Chu vi là độ dài đường bao quanh. Diện tích là độ lớn bề mặt bên trong.',
    bullets: ['Chu vi HCN: (dài + rộng) × 2', 'Diện tích HCN: dài × rộng', 'Đơn vị diện tích: cm²'],
    example: 'HCN 5 cm × 3 cm có S = 15 cm².',
    tip: 'Đừng nhầm chu vi (cm) với diện tích (cm²).',
    svg: ill.rectArea(5, 3),
  },
};

function templateFromSlug(slug, lessonName, topicName) {
  if (/cong|g[0-9]-cong/.test(slug) && !/ps|tp/.test(slug)) {
    return {
      intro: `Bài «${lessonName}»: thực hiện phép cộng đúng thứ tự và nhớ trong phạm vi chương trình.`,
      bullets: ['Viết số thẳng cột (hàng đơn vị thẳng hàng đơn vị)', 'Cộng từ phải sang trái', 'Có nhớ: nhớ 1 sang hàng chục / trăm…'],
      example: '47 + 25 = 72',
      tip: 'Kiểm tra bằng cách cộng ngược hoặc trừ lại.',
      svg: ill.addition(4, 3),
    };
  }
  if (/tru|g[0-9]-tru/.test(slug) && !/ps|tp/.test(slug)) {
    return {
      intro: `Bài «${lessonName}»: phép trừ tìm hiệu; số bị trừ phải lớn hơn hoặc bằng số trừ (số tự nhiên lớp nhỏ).`,
      bullets: ['Trừ từ hàng đơn vị', 'Không đủ thì mượn 1 ở hàng liền trái', 'Trừ nhẩm với số tròn chục khi có thể'],
      example: '52 − 18 = 34',
      tip: 'Mượn 1 chục = 10 đơn vị.',
      svg: ill.subtraction(5, 2),
    };
  }
  if (/nhan|nhan-/.test(slug)) {
    return {
      intro: `Bài «${lessonName}»: nhân là cộng lặp lại; thuộc bảng nhân giúp tính nhanh.`,
      bullets: ['Thừa số × thừa số = tích', 'Nhân với 10, 100: thêm số 0', 'Đổi chỗ thừa số, tích không đổi'],
      example: '6 × 7 = 42',
      tip: 'Chia ngược lại để kiểm tra nhân.',
      svg: ill.multiply(3, 5),
    };
  }
  if (/chia|chia-/.test(slug)) {
    return {
      intro: `Bài «${lessonName}»: chia đều; có thể chia hết hoặc có dư.`,
      bullets: ['Số bị chia : số chia = thương (dư)', 'Chia có dư: số dư < số chia', 'Liên hệ phép nhân'],
      example: '17 : 5 = 3 dư 2',
      tip: 'Nhân thương với số chia rồi cộng dư.',
      svg: ill.divide(12, 4),
    };
  }
  if (/^(tv-|g[1-5]-tv-)/.test(slug)) {
    const gradeNum = slug.match(/^g([2-5])-tv-/)?.[1] || (slug.startsWith('tv-') ? '1' : '1');
    const bulletsByGrade = {
      1: ['Ghép âm, đọc trơn, dấu thanh', 'Hiểu từ trong câu ngắn', 'Luyện 10 câu trắc nghiệm'],
      2: ['Đọc hiểu đoạn ngắn', 'Chính tả và mẫu câu cơ bản', 'Luyện 10 câu trắc nghiệm'],
      3: ['Đọc hiểu và từ ngữ', 'So sánh, chính tả l/n', 'Luyện 10 câu trắc nghiệm'],
      4: ['Đọc hiểu văn bản', 'Từ loại, mở rộng câu', 'Luyện 10 câu trắc nghiệm'],
      5: ['Đọc hiểu văn học', 'LTV, TLV, biện pháp tu từ', 'Luyện 10 câu trắc nghiệm'],
    };
    return {
      intro: `Bài «${lessonName}»: môn Tiếng Việt lớp ${gradeNum} theo CT2018.`,
      bullets: bulletsByGrade[gradeNum] || bulletsByGrade['1'],
      example: gradeNum === '1' ? 'Ghép âm và chọn dấu đúng.' : 'Đọc kỹ đoạn văn rồi chọn đáp án.',
      tip: `Kết hợp SGK Tiếng Việt ${gradeNum} (KNTT / Cánh Diều / CTST).`,
      svg: ill.vietTone(),
    };
  }
  if (/g[2-5]-on-toan|on-tap-phep|phan-so-thap-phan-5/.test(slug)) {
    return {
      intro: `«${lessonName}»: ôn các dạng Toán đã học trong năm — làm đề trộn nhiều kỹ năng.`,
      bullets: ['Ôn cộng, trừ, nhân, chia trong phạm vi lớp', 'Đọc đề kỹ, ghi nháp', 'Kiểm tra lại kết quả'],
      example: 'Làm câu quen trước, câu khó sau.',
      tip: 'Giống đề giữa kỳ / cuối kỳ — luyện nhiều lần.',
      svg: ill.compare(7, 7),
    };
  }
  if (/gk1|sap-xep|dien-so-khoang|so-sanh-bieu/.test(slug)) {
    return {
      intro: 'Ôn tập dạng đề Giữa kì: sắp xếp, so sánh, điền số và tính nhanh trong phạm vi đã học.',
      bullets: ['Sắp xếp: đặt số trên tia số', 'So sánh hai vế: tính từng vế trước', 'Khoảng: 2 < □ < 4 → □ = 3'],
      example: '2 + 3 = 1 + 4 → 5 = 5',
      tip: 'Làm câu dễ trước, câu khó sau.',
      svg: ill.compare(5, 5),
    };
  }
  if (/hinh|goc|chu-vi|dien-tich|the-tich/.test(slug)) {
    return {
      intro: `Chủ đề «${topicName}»: quan sát hình, nhớ công thức và đơn vị đo.`,
      bullets: ['Vẽ và gọi đúng tên hình', 'Ghi đơn vị: cm, cm², cm³', 'Đọc đề và ghi dữ kiện'],
      example: 'Chu vi = tổng độ dài các cạnh.',
      tip: 'Vẽ hình nháp khi giải toán.',
      svg: /dien-tich|chu-vi/.test(slug) ? ill.rectArea(4, 3) : ill.shapes2d(),
    };
  }
  if (/phan-so|ps-|tp|thap-phan|phan-tram/.test(slug)) {
    return {
      intro: `Bài «${lessonName}»: làm việc với phân số / thập phân / phần trăm theo quy tắc lớp.`,
      bullets: ['Cùng mẫu mới cộng trừ trực tiếp được', 'Thập phân: phần nguyên và phần thập phân', '1/2 = 0,5 = 50% (trong ngữ cảnh 100)'],
      example: '1/2 + 1/2 = 1',
      tip: 'Quy đồng mẫu khi mẫu khác nhau.',
      svg: ill.fraction(2, 4),
    };
  }
  if (/do-luong|do-dai|thoi-gian|tram-chuc|so-sanh|so-lon|dem-/.test(slug)) {
    return {
      intro: `Bài «${lessonName}»: đọc – viết – so sánh số hoặc đo lường trong phạm vi lớp.`,
      bullets: ['Đọc số theo hàng: chục, trăm, nghìn…', 'So sánh từ hàng cao nhất', 'Đo đúng đơn vị trong đề'],
      example: '1000 > 999',
      tip: 'Dùng tia số để so sánh.',
      svg: ill.numberLine(10, 8),
    };
  }
  return {
    intro: `Kiến thức bài «${lessonName}» (${topicName}) theo chương trình Toán tiểu học.`,
    bullets: ['Đọc kỹ đề bài', 'Áp dụng quy tắc đã học ở lớp', 'Kiểm tra lại kết quả'],
    example: 'Luyện 10 câu trắc nghiệm bên dưới.',
    tip: 'Hỏi thầy cô khi gặp dạng lạ.',
    svg: ill.numberLine(10, null),
  };
}

function getKnowledge(slug, { lessonName, topicName }) {
  const base = bySlug[slug] || templateFromSlug(slug, lessonName, topicName);
  return {
    title: 'Kiến thức cần nhớ',
    ...base,
  };
}

function renderKnowledgeHtml(slug, ctx) {
  const k = getKnowledge(slug, ctx);
  const bullets = k.bullets.map((b) => `<li>${b}</li>`).join('');
  return `
    <section class="knowledge-panel" id="knowledge-panel">
      <div class="knowledge-layout">
        <div class="knowledge-illus">${k.svg}</div>
        <div class="knowledge-text">
          <h2>${k.title}</h2>
          <p class="knowledge-intro">${k.intro}</p>
          <ul class="knowledge-list">${bullets}</ul>
          <p class="knowledge-example"><strong>Ví dụ:</strong> ${k.example}</p>
          <p class="knowledge-tip">💡 ${k.tip}</p>
        </div>
      </div>
      <div class="knowledge-actions">
        <button type="button" class="btn primary" id="btn-practice">Tiếp theo: Làm bài tập (10 câu)</button>
      </div>
    </section>`;
}

module.exports = { getKnowledge, renderKnowledgeHtml };
