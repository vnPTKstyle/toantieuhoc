/**
 * Xuất trang PDF → JPG + manifest (text layer nếu có).
 * node scripts/build-danh-van-pages.js
 */
const fs = require('fs');
const path = require('path');
const { pdf } = require('pdf-to-img');

const PDF_PATH = path.join(__dirname, '..', 'Tập đánh vần tiếng việt 4 - 6 tuổi.pdf');
const OUT_DIR = path.join(__dirname, '..', 'public', 'danh-van', 'pages');
const META_PATH = path.join(__dirname, '..', 'data', 'danh-van-pages.json');

function buildToc(n) {
  const p1End = Math.min(70, Math.floor(n * 0.55));
  const p2End = Math.min(n - 15, Math.floor(n * 0.92));
  return [
    { id: 'cover', label: 'Bìa & giới thiệu', from: 1, to: Math.min(4, n) },
    { id: 'am-chu', label: 'Phần 1 · Âm – chữ & ghép âm', from: 5, to: p1End },
    { id: 'hoc-van', label: 'Phần 2 · Học vần', from: p1End + 1, to: p2End },
    { id: 'luyen-doc', label: 'Phần 3 · Luyện đọc', from: p2End + 1, to: n },
  ];
}

async function extractText(pageNum) {
  try {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    if (!extractText.doc) {
      const data = new Uint8Array(fs.readFileSync(PDF_PATH));
      extractText.doc = await pdfjs.getDocument({ data }).promise;
    }
    const page = await extractText.doc.getPage(pageNum);
    const tc = await page.getTextContent();
    const text = tc.items.map((it) => it.str).join(' ').replace(/\s+/g, ' ').trim();
    const words = text
      ? [...new Set(text.split(/\s+/).filter((w) => w.length >= 1 && /[\p{L}]/u.test(w)))]
      : [];
    return { text, words };
  } catch {
    return { text: '', words: [] };
  }
}
extractText.doc = null;

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const doc = await pdf(PDF_PATH, { scale: 2 });
  const pages = [];
  let p = 0;
  for await (const img of doc) {
    p += 1;
    const file = `${String(p).padStart(3, '0')}.png`;
    fs.writeFileSync(path.join(OUT_DIR, file), img);
    const { text, words } = await extractText(p);
    pages.push({
      page: p,
      image: `/danh-van/pages/${file}`,
      text,
      words,
    });
    if (p % 10 === 0) console.log('Page', p);
  }
  const manifest = {
    generated: new Date().toISOString(),
    numPages: p,
    toc: buildToc(p),
    pages,
  };
  fs.writeFileSync(META_PATH, JSON.stringify(manifest, null, 2));
  console.log('Done', p, 'pages →', META_PATH);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
