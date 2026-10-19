const { grade1Subjects } = require('./grade1-subjects');

function tvTopics(grade) {
  const common = {
    2: [
      {
        id: 'tv2-doc',
        name: 'Đọc hiểu',
        lessons: [
          { slug: 'g2-tv-doc-doan', name: 'Đọc hiểu đoạn văn ngắn' },
          { slug: 'g2-tv-doc-tu', name: 'Đọc trơn và hiểu từ' },
        ],
      },
      {
        id: 'tv2-chinh-ta',
        name: 'Chính tả',
        lessons: [
          { slug: 'g2-tv-chinh-ta-dau', name: 'Viết đúng dấu thanh' },
          { slug: 'g2-tv-chinh-ta-am', name: 'Phân biệt ch/tr, d/gi (cơ bản)' },
        ],
      },
      {
        id: 'tv2-ltv',
        name: 'Luyện từ và câu',
        lessons: [
          { slug: 'g2-tv-tu-loai', name: 'Từ chỉ sự vật, chỉ hoạt động' },
          { slug: 'g2-tv-cau-mau', name: 'Mẫu câu: Ai là gì? Ai làm gì?' },
        ],
      },
      {
        id: 'tv2-on',
        name: 'Ôn tập',
        lessons: [{ slug: 'g2-tv-on-tap', name: '★ Ôn tập tổng hợp' }],
      },
    ],
    3: [
      {
        id: 'tv3-doc',
        name: 'Đọc hiểu',
        lessons: [
          { slug: 'g3-tv-doc-hieu', name: 'Đọc hiểu bài văn ngắn' },
          { slug: 'g3-tv-y-nghia', name: 'Từ ngữ và ý chính' },
        ],
      },
      {
        id: 'tv3-chinh-ta',
        name: 'Chính tả',
        lessons: [{ slug: 'g3-tv-chinh-ta', name: 'Chính tả: l/n, v/d' }],
      },
      {
        id: 'tv3-ltv',
        name: 'Luyện từ và câu',
        lessons: [
          { slug: 'g3-tv-so-sanh', name: 'So sánh đơn giản' },
          { slug: 'g3-tv-cau-ke', name: 'Câu kể Ai làm gì?' },
        ],
      },
      {
        id: 'tv3-on',
        name: 'Ôn tập',
        lessons: [{ slug: 'g3-tv-on-tap', name: '★ Ôn tập tổng hợp' }],
      },
    ],
    4: [
      {
        id: 'tv4-doc',
        name: 'Đọc hiểu',
        lessons: [
          { slug: 'g4-tv-doc-hieu', name: 'Đọc hiểu và nắm ý chính' },
          { slug: 'g4-tv-van-ban', name: 'Văn bản thông tin / thơ' },
        ],
      },
      {
        id: 'tv4-ltv',
        name: 'Luyện từ và câu',
        lessons: [
          { slug: 'g4-tv-tu-loai', name: 'Danh từ, động từ, tính từ' },
          { slug: 'g4-tv-cau', name: 'Mở rộng câu: Ai thế nào?' },
        ],
      },
      {
        id: 'tv4-chinh-ta',
        name: 'Chính tả & TLV',
        lessons: [{ slug: 'g4-tv-tlv-doan', name: 'Viết đoạn văn ngắn (4–5 câu)' }],
      },
      {
        id: 'tv4-on',
        name: 'Ôn tập',
        lessons: [{ slug: 'g4-tv-on-tap', name: '★ Ôn tập tổng hợp' }],
      },
    ],
    5: [
      {
        id: 'tv5-doc',
        name: 'Đọc hiểu văn học',
        lessons: [
          { slug: 'g5-tv-doc-hieu', name: 'Đọc hiểu văn bản lớp 5' },
          { slug: 'g5-tv-nhan-vat', name: 'Nhân vật và chi tiết' },
        ],
      },
      {
        id: 'tv5-ltv',
        name: 'Luyện từ và câu',
        lessons: [
          { slug: 'g5-tv-chu-vi', name: 'Chủ ngữ, vị ngữ (cơ bản)' },
          { slug: 'g5-tv-bien-phap', name: 'Biện pháp so sánh, nhân hóa' },
        ],
      },
      {
        id: 'tv5-tlv',
        name: 'Tập làm văn',
        lessons: [{ slug: 'g5-tv-tlv', name: 'Viết đoạn văn kể / miêu tả' }],
      },
      {
        id: 'tv5-on',
        name: 'Ôn tập',
        lessons: [{ slug: 'g5-tv-on-tap', name: '★ Ôn tập — chuẩn bị lên lớp 6' }],
      },
    ],
  };
  return common[grade] || [];
}

function buildSubjects(grade, toanTagline, toanTopics, onTapToan) {
  const topics = [...toanTopics];
  if (onTapToan?.length) {
    topics.push({
      id: `on-toan-${grade}`,
      name: `Ôn tập (Toán lớp ${grade})`,
      lessons: onTapToan,
    });
  }
  return [
    { id: 'toan', name: 'Toán', tagline: toanTagline, topics },
    {
      id: 'tieng-viet',
      name: 'Tiếng Việt',
      tagline: 'Đọc, viết, luyện từ và câu — CT2018',
      topics: tvTopics(grade),
    },
  ];
}

const grade2Toan = [
  {
    id: 'so-den-1000',
    name: 'Các số đến 1000',
    lessons: [
      { slug: 'tram-chuc-don-vi', name: 'Trăm, chục, đơn vị' },
      { slug: 'so-sanh-1000', name: 'So sánh số đến 1000' },
    ],
  },
  {
    id: 'cong-2',
    name: 'Phép cộng',
    lessons: [
      { slug: 'g2-cong-co-nho', name: 'Cộng có nhớ trong phạm vi 100' },
      { slug: 'g2-cong-1000', name: 'Cộng số tròn trăm, tròn chục đến 1000' },
    ],
  },
  {
    id: 'tru-2',
    name: 'Phép trừ',
    lessons: [
      { slug: 'g2-tru-co-nho', name: 'Trừ có nhớ trong phạm vi 100' },
      { slug: 'g2-tru-1000', name: 'Trừ số tròn trăm, tròn chục đến 1000' },
    ],
  },
  {
    id: 'nhan-2',
    name: 'Phép nhân',
    lessons: [
      { slug: 'g2-nhan-2-5', name: 'Bảng nhân 2 và 5' },
      { slug: 'g2-nhan-3-4', name: 'Bảng nhân 3 và 4' },
      { slug: 'g2-nhan-co-nho', name: 'Nhân 2 chữ số × 1 chữ số' },
    ],
  },
  {
    id: 'chia-2',
    name: 'Phép chia',
    lessons: [
      { slug: 'g2-chia-2-5', name: 'Bảng chia 2 và 5' },
      { slug: 'g2-chia-3-4', name: 'Bảng chia 3 và 4' },
      { slug: 'g2-chia-co-du', name: 'Chia có dư' },
    ],
  },
  {
    id: 'hinh-2',
    name: 'Hình học & đo lường',
    lessons: [
      { slug: 'chu-vi-hinh-chu-nhat', name: 'Chu vi hình chữ nhật' },
      { slug: 'do-dai-m-dm', name: 'Đo độ dài: dm, m' },
    ],
  },
];

const grade3Toan = [
  {
    id: 'cong-3',
    name: 'Phép cộng',
    lessons: [
      { slug: 'g3-cong-4-chu-so', name: 'Cộng số có đến bốn chữ số' },
      { slug: 'g3-cong-co-nho', name: 'Cộng có nhớ (đến 10 000)' },
    ],
  },
  {
    id: 'tru-3',
    name: 'Phép trừ',
    lessons: [
      { slug: 'g3-tru-4-chu-so', name: 'Trừ số có đến bốn chữ số' },
      { slug: 'g3-tru-co-nho', name: 'Trừ có nhớ (đến 10 000)' },
    ],
  },
  {
    id: 'nhan-3',
    name: 'Phép nhân',
    lessons: [
      { slug: 'g3-bang-nhan-6910', name: 'Bảng nhân 6–10' },
      { slug: 'g3-nhan-2-chu-so', name: 'Nhân 2 chữ số × 1 chữ số' },
      { slug: 'g3-nhan-3-chu-so', name: 'Nhân 3 chữ số × 1 chữ số' },
    ],
  },
  {
    id: 'chia-3',
    name: 'Phép chia',
    lessons: [
      { slug: 'g3-chia-1-chu-so', name: 'Chia 2–3 chữ số cho 1 chữ số' },
      { slug: 'g3-chia-co-du', name: 'Chia có dư' },
    ],
  },
  {
    id: 'phan-so',
    name: 'Phân số',
    lessons: [{ slug: 'phan-so-co-ban', name: 'Phân số: ý nghĩa, so sánh' }],
  },
  {
    id: 'hinh-3',
    name: 'Hình học',
    lessons: [
      { slug: 'chu-vi-dien-tich', name: 'Chu vi và diện tích HCN' },
      { slug: 'goc-vuong', name: 'Góc vuông' },
    ],
  },
];

const grade4Toan = [
  {
    id: 'so-4',
    name: 'Số',
    lessons: [
      { slug: 'so-lon-trieu', name: 'Số đến hàng triệu' },
      { slug: 'phan-so-thap-phan', name: 'Phân số và thập phân' },
    ],
  },
  {
    id: 'cong-4',
    name: 'Phép cộng',
    lessons: [{ slug: 'g4-cong-so-lon', name: 'Cộng số lớn' }],
  },
  {
    id: 'tru-4',
    name: 'Phép trừ',
    lessons: [{ slug: 'g4-tru-so-lon', name: 'Trừ số lớn' }],
  },
  {
    id: 'nhan-4',
    name: 'Phép nhân',
    lessons: [
      { slug: 'g4-nhan-nhieu-chu-so', name: 'Nhân nhiều chữ số' },
      { slug: 'g4-nhan-10-100-1000', name: 'Nhân 10, 100, 1000' },
    ],
  },
  {
    id: 'chia-4',
    name: 'Phép chia',
    lessons: [
      { slug: 'g4-chia-nhieu-chu-so', name: 'Chia nhiều chữ số' },
      { slug: 'g4-chia-2-chu-so', name: 'Chia cho 2 chữ số' },
    ],
  },
  {
    id: 'ps-tinh-4',
    name: 'Phân số',
    lessons: [{ slug: 'g4-ps-cong-tru', name: 'Cộng, trừ PS cùng mẫu' }],
  },
  {
    id: 'hinh-4',
    name: 'Hình học',
    lessons: [{ slug: 'dien-tich-hinh', name: 'Diện tích hình' }],
  },
];

const grade5ToanCore = [
  {
    id: 'cong-5',
    name: 'Phép cộng',
    lessons: [
      { slug: 'g5-cong-tp', name: 'Cộng thập phân' },
      { slug: 'g5-cong-ps', name: 'Cộng phân số' },
    ],
  },
  {
    id: 'tru-5',
    name: 'Phép trừ',
    lessons: [
      { slug: 'g5-tru-tp', name: 'Trừ thập phân' },
      { slug: 'g5-tru-ps', name: 'Trừ phân số' },
    ],
  },
  {
    id: 'nhan-5',
    name: 'Phép nhân',
    lessons: [
      { slug: 'g5-nhan-tp', name: 'Nhân thập phân' },
      { slug: 'g5-nhan-ps', name: 'Nhân phân số' },
    ],
  },
  {
    id: 'chia-5',
    name: 'Phép chia',
    lessons: [
      { slug: 'g5-chia-tp', name: 'Chia thập phân' },
      { slug: 'g5-chia-ps', name: 'Chia phân số' },
    ],
  },
  {
    id: 'hinh-5',
    name: 'Hình học & đo lường',
    lessons: [
      { slug: 'the-tich', name: 'Thể tích hộp chữ nhật' },
      { slug: 'dien-tich-xq', name: 'Diện tích xung quanh' },
    ],
  },
];

const gradeSubjectsByLevel = {
  1: grade1Subjects,
  2: buildSubjects(2, 'Số đến 1000, bốn phép tính, đo lường', grade2Toan, [
    { slug: 'g2-on-toan', name: '★ Ôn tập Toán lớp 2' },
  ]),
  3: buildSubjects(3, 'Số lớn, phân số, hình học', grade3Toan, [
    { slug: 'g3-on-toan', name: '★ Ôn tập Toán lớp 3' },
  ]),
  4: buildSubjects(4, 'Số lớn, PS, TP, hình học', grade4Toan, [
    { slug: 'g4-on-toan', name: '★ Ôn tập Toán lớp 4' },
  ]),
  5: buildSubjects(
    5,
    'PS, TP, phần trăm, thể tích',
    grade5ToanCore,
    [
      { slug: 'phan-so-thap-phan-5', name: 'Phần trăm' },
      { slug: 'on-tap-phep-tinh', name: '★ Ôn bốn phép tính' },
    ]
  ),
};

module.exports = { gradeSubjectsByLevel, buildSubjects };
