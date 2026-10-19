/** Chương trình Lớp 1: Toán + Tiếng Việt (CT2018) */
const grade1ToanTopics = [
  {
    id: 'so-den-10',
    name: 'Các số đến 10',
    lessons: [
      { slug: 'dem-so', name: 'Đếm và đọc số' },
      { slug: 'so-sanh-10', name: 'So sánh số trong phạm vi 10' },
    ],
  },
  {
    id: 'so-den-100',
    name: 'Các số đến 100',
    lessons: [{ slug: 'chuc-don-vi', name: 'Chục, đơn vị' }],
  },
  {
    id: 'cong-1',
    name: 'Phép cộng',
    lessons: [
      { slug: 'g1-cong-10', name: 'Cộng trong phạm vi 10' },
      { slug: 'g1-cong-100-khong-nho', name: 'Cộng không nhớ đến 100' },
      { slug: 'g1-cong-100-co-nho', name: 'Cộng có nhớ đến 100' },
    ],
  },
  {
    id: 'tru-1',
    name: 'Phép trừ',
    lessons: [
      { slug: 'g1-tru-10', name: 'Trừ trong phạm vi 10' },
      { slug: 'g1-tru-100-khong-nho', name: 'Trừ không nhớ đến 100' },
      { slug: 'g1-tru-100-co-nho', name: 'Trừ có nhớ đến 100' },
    ],
  },
  {
    id: 'nhan-1',
    name: 'Phép nhân (làm quen)',
    lessons: [
      { slug: 'g1-nhan-hang-bang', name: 'Tổng các số hạng bằng nhau (chuẩn bị bảng nhân)' },
    ],
  },
  {
    id: 'chia-1',
    name: 'Phép chia (làm quen)',
    lessons: [{ slug: 'g1-chia-nhom-deu', name: 'Chia đều thành các nhóm bằng nhau' }],
  },
  {
    id: 'hinh-hoc-1',
    name: 'Hình học',
    lessons: [
      { slug: 'hinh-khoi', name: 'Hình khối: lập phương, hộp chữ nhật' },
      { slug: 'hinh-phang', name: 'Hình phẳng: tam giác, vuông, tròn' },
    ],
  },
  {
    id: 'do-luong-1',
    name: 'Đo lường',
    lessons: [
      { slug: 'do-dai-cm', name: 'Đo độ dài (cm)' },
      { slug: 'thoi-gian-ngay', name: 'Ngày, tháng, giờ' },
    ],
  },
  {
    id: 'gk1-vietjack',
    name: 'Ôn tập Giữa kì 1 (Toán)',
    lessons: [
      { slug: 'g1-gk1-de-mau', name: '★ Đề mẫu tổng hợp Giữa kì 1' },
      { slug: 'g1-gk1-sap-xep-so', name: 'Sắp xếp số' },
      { slug: 'g1-gk1-so-sanh-bieu-thuc', name: 'So sánh >, <, = (có phép cộng)' },
      { slug: 'g1-gk1-dien-so-khoang', name: 'Điền số vào khoảng' },
      { slug: 'g1-gk1-tinh-cong-nhanh', name: 'Tính cộng nhanh' },
      { slug: 'g1-gk1-dem-do-vat', name: 'Đếm đồ vật' },
      { slug: 'g1-gk1-dem-hinh', name: 'Đếm hình' },
    ],
  },
];

const grade1TiengVietTopics = [
  {
    id: 'tv-am-van',
    name: 'Âm và vần',
    lessons: [
      { slug: 'tv-am-dau', name: 'Phụ âm đầu (b, c, d, h, …)' },
      { slug: 'tv-van', name: 'Ghép vần (ba, be, ma, …)' },
      { slug: 'tv-thanh-dieu', name: 'Dấu thanh: sắc, huyền, hỏi, ngã, nặng' },
    ],
  },
  {
    id: 'tv-doc',
    name: 'Đọc hiểu',
    lessons: [
      { slug: 'tv-doc-tu', name: 'Đọc từ ngữ quen thuộc' },
      { slug: 'tv-doc-cau', name: 'Đọc hiểu câu ngắn' },
    ],
  },
  {
    id: 'tv-viet',
    name: 'Chính tả & từ ngữ',
    lessons: [
      { slug: 'tv-chinh-ta-dau', name: 'Chọn dấu thanh đúng' },
      { slug: 'tv-tu-chi-su-vat', name: 'Từ chỉ sự vật' },
      { slug: 'tv-cau-don', name: 'Câu đơn: ai là gì?' },
    ],
  },
  {
    id: 'tv-gk1',
    name: 'Ôn tập Giữa kì 1 (Tiếng Việt)',
    lessons: [
      { slug: 'dv-on-tap', name: '★ Ôn đánh vần tổng hợp' },
      { slug: 'tv-gk1-de-mau', name: '★ Ôn tập tổng hợp GK1' },
      { slug: 'tv-gk1-van-dau', name: 'Ôn vần và dấu thanh' },
    ],
  },
];

const grade1Subjects = [
  {
    id: 'tieng-viet',
    name: 'Tiếng Việt',
    tagline: 'Âm vần, đọc hiểu, chính tả — CT2018',
    topics: grade1TiengVietTopics,
  },
  {
    id: 'toan',
    name: 'Toán',
    tagline: 'Số học, hình học, đo lường',
    topics: grade1ToanTopics,
  },
];

module.exports = { grade1Subjects, grade1ToanTopics, grade1TiengVietTopics };
