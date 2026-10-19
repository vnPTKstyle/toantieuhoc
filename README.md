# Tiểu học — Toán & Tiếng Việt (Lớp 1–5)

Web ôn luyện chạy **Node.js** + **Express**, bám khung CTGDPT **2018** (Bộ GD&ĐT).

## Tính năng

- Mỗi lớp **1 → 5**: hai môn **Toán** và **Tiếng Việt** (accordion trên trang lớp)
- Mỗi bài: **kiến thức + minh họa SVG**, sau đó **10 câu trắc nghiệm** (sinh ngẫu nhiên)
- **Ôn tập** nằm **cuối** từng môn (Toán GK/cuối kỳ, TV tổng hợp)
- Phản hồi ngay sau mỗi câu và chấm điểm /100

## Chạy ứng dụng

Yêu cầu: Node.js 18 trở lên.

```bash
cd d:\project\toantieuhoc
npm install
npm start
```

Mở trình duyệt: [http://localhost:3000](http://localhost:3000)

Chế độ tự tải lại khi sửa code (Node 18+):

```bash
npm run dev
```

## Cấu trúc

- `server.js` — máy chủ, trang lớp/bài, API quiz
- `data/curriculum.js` — lớp 1–5
- `data/grade1-subjects.js`, `data/grade-subjects.js` — Toán + Tiếng Việt theo lớp
- `data/knowledge.js` — nội dung kiến thức và SVG
- `data/questions.js`, `data/questions-tviet.js` — sinh câu hỏi
- `public/` — CSS, `quiz.js`, `subjects.js`

## Ghi chú

Nội dung mang tính **ôn luyện**, không thay sách giáo khoa. Phụ huynh và giáo viên nên kết hợp SGK (Kết nối tri thức, Cánh Diều, Chân trời sáng tạo) tùy địa phương.

## Nguồn chính thức (tham khảo)

- [Thông tư 32/2018/TT-BGDĐT](https://thuvienphapluat.vn/van-ban/Giao-duc/Thong-tu-32-2018-TT-BGDDT-Chuong-trinh-giao-duc-pho-thong-403454.aspx)
- [Chương trình môn Toán (PDF)](https://dienbien.edu.vn/uploads/doi-moi-chuong-trinh-gdpt/3ct_toan.pdf)
- Trong app: **http://localhost:3000/tham-khao** — yêu cầu cần đạt bốn phép tính theo lớp (trích từ CT2018)

Dữ liệu tóm tắt nằm trong `data/official-moet.js`.
