/**
 * Trích dẫn từ Chương trình GDPT 2018 — Môn Toán
 * Thông tư 32/2018/TT-BGDĐT (Bộ GD&ĐT), mục IV–V: Yêu cầu cần đạt theo lớp.
 * Bản PDF: https://dienbien.edu.vn/uploads/doi-moi-chuong-trinh-gdpt/3ct_toan.pdf
 */
const officialSources = [
  {
    title: 'Thông tư 32/2018/TT-BGDĐT — Chương trình GDPT',
    url: 'https://thuvienphapluat.vn/van-ban/Giao-duc/Thong-tu-32-2018-TT-BGDDT-Chuong-trinh-giao-duc-pho-thong-403454.aspx',
    note: 'Văn bản gốc ban hành CT2018',
  },
  {
    title: 'Chương trình môn Toán (PDF đính kèm Thông tư 32)',
    url: 'https://dienbien.edu.vn/uploads/doi-moi-chuong-trinh-gdpt/3ct_toan.pdf',
    note: 'Mục lục lớp 1–5: trang 21–45 (bản in 2018)',
  },
  {
    title: 'Văn bản hợp nhất 10/VBHN-BGDĐT (2022)',
    url: 'https://congbao.chinhphu.vn/van-ban/van-ban-hop-nhat-so-10-vbhn-bgddt-38754/43522.htm',
    note: 'Hợp nhất các sửa đổi CT2018',
  },
];

/** Tham khảo dạng đề (không phải văn bản nhà nước) — chỉ mô phỏng kiểu câu hỏi */
const supplementarySources = [
  {
    title: 'VietJack — Đề thi Toán lớp 1 Giữa kì 1',
    url: 'https://vietjack.com/de-kiem-tra-lop-1/de-kiem-tra-toan-lop-1-giua-ki-1.jsp',
    note: 'KNTT, Cánh Diều, Chân trời sáng tạo — app sinh câu tương tự, không sao chép đề gốc',
  },
];

/** Yêu cầu cần đạt — mạch Số và phép tính (trích ý chính) */
const arithmeticByGrade = {
  1: {
    cong: [
      'Nhận biết ý nghĩa phép cộng',
      'Cộng (không nhớ) trong phạm vi 100',
      'Cộng nhẩm trong phạm vi 10; cộng nhẩm số tròn chục',
      'Giải bài toán có lời văn một bước tính (cộng)',
    ],
    tru: [
      'Nhận biết ý nghĩa phép trừ',
      'Trừ (không nhớ) trong phạm vi 100',
      'Trừ nhẩm trong phạm vi 10; trừ nhẩm số tròn chục',
      'Biểu thức hai dấu +, − (trái sang phải)',
    ],
    nhan: ['Chương trình lớp 1 chưa có phép nhân chính thức — chỉ làm quen qua tổng các số hạng bằng nhau'],
    chia: ['Chương trình lớp 1 chưa có phép chia chính thức — làm quen chia đều nhóm đồ vật'],
  },
  2: {
    cong: [
      'Cộng có nhớ không quá một lượt, trong phạm vi 1000',
      'Cộng nhẩm trong phạm vi 20; cộng nhẩm số tròn chục, tròn trăm',
    ],
    tru: [
      'Trừ có nhớ không quá một lượt, trong phạm vi 1000',
      'Trừ nhẩm tương ứng',
    ],
    nhan: [
      'Nhận biết ý nghĩa phép nhân và các thành phần',
      'Vận dụng bảng nhân 2 và bảng nhân 5 (mở rộng luyện 3, 4 theo SGK)',
    ],
    chia: [
      'Nhận biết ý nghĩa phép chia',
      'Vận dụng bảng chia 2 và bảng chia 5 (mở rộng 3, 4)',
      'Bài toán một bước tính (thêm, bớt, nhiều hơn, ít hơn)',
    ],
  },
  3: {
    cong: ['Cộng số đến 5 chữ số, nhớ không quá 2 lượt không liên tiếp', 'Tính chất giao hoán, kết hợp của cộng'],
    tru: ['Trừ số đến 5 chữ số, cùng quy tắc nhớ', 'Quan hệ cộng — trừ khi tính'],
    nhan: [
      'Bảng nhân, bảng chia 2 → 9',
      'Nhân số có 1 chữ số (nhớ ≤ 2 lượt)',
      'Nhân nhẩm các trường hợp đơn giản',
    ],
    chia: [
      'Chia cho số có 1 chữ số',
      'Chia hết và chia có dư',
      'Biểu thức 2 dấu phép tính (có/không ngoặc)',
    ],
  },
  4: {
    cong: ['Cộng số tự nhiên nhiều chữ số (đến lớp triệu), nhớ ≤ 3 lượt', 'Trung bình cộng hai hay nhiều số'],
    tru: ['Trừ số lớn cùng quy tắc nhớ', 'Vận dụng tính chất phép tính'],
    nhan: ['Nhân số có không quá 2 chữ số', 'Nhân với 10, 100, 1000…', 'Tính nhẩm, ước lượng kết quả'],
    chia: ['Chia cho số có không quá 2 chữ số', 'Chia cho 10, 100, 1000…', 'Bài toán 2–3 bước, rút về đơn vị'],
  },
  5: {
    cong: ['Ôn cộng số tự nhiên; cộng phân số, số thập phân', 'Giải bài toán đến 4 bước tính'],
    tru: ['Ôn trừ số tự nhiên; trừ phân số, thập phân'],
    nhan: ['Nhân phân số, thập phân', 'Phần trăm và ứng dụng'],
    chia: ['Chia phân số, thập phân', 'Ôn tổng hợp bốn phép với số tự nhiên'],
  },
};

const threeStrands =
  'Ba mạch kiến thức CT2018: (1) Số, Đại số và một số yếu tố giải tích; (2) Hình học và Đo lường; (3) Thống kê và Xác suất.';

function getOfficialArithmetic(grade) {
  return arithmeticByGrade[Number(grade)] || null;
}

module.exports = {
  officialSources,
  supplementarySources,
  arithmeticByGrade,
  threeStrands,
  getOfficialArithmetic,
};
