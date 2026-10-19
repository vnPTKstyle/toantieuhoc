const fs = require('fs');
const path = require('path');
const { enrichPages } = require('./danh-van-page-topics');

const MANIFEST_PATH = path.join(__dirname, 'danh-van-pages.json');

function loadPdfManifest() {
  try {
    if (!fs.existsSync(MANIFEST_PATH)) return null;
    const raw = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
    return enrichPages(raw);
  } catch {
    return null;
  }
}

const LESSON_START = {
  'dv-hub': 'cover',
  'dv-am-chu': 'am-chu',
  'dv-hoc-van': 'hoc-van',
  'dv-luyen-doc': 'luyen-doc',
};

function getStartPage(lessonSlug, manifest) {
  if (!manifest?.toc) return 1;
  const secId = LESSON_START[lessonSlug];
  if (!secId) return 1;
  const sec = manifest.toc.find((t) => t.id === secId);
  return sec?.from || 1;
}

function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function pageLinkLabel(p) {
  const topic = p.topic ? `<span class="dv-toc-topic">${escapeHtml(p.topic)}</span>` : '';
  return `<span class="dv-toc-page-num">Trang ${p.page}</span>${topic}`;
}

function renderServerToc(manifest) {
  return manifest.toc
    .map((sec) => {
      const links = manifest.pages
        .filter((p) => p.page >= sec.from && p.page <= sec.to)
        .map(
          (p) =>
            `<li><a class="dv-pdf-page-link" href="#trang-${p.page}" data-page="${p.page}">${pageLinkLabel(p)}</a></li>`
        )
        .join('');
      return `<details class="dv-toc-section" open>
        <summary>${escapeAttr(sec.label)}</summary>
        <ul class="dv-toc-page-list">${links}</ul>
      </details>`;
    })
    .join('');
}

function renderTocSidebar(manifest, options = {}) {
  const dock = options.dockLeft ? ' dv-hub-sidebar' : '';
  return `
    <aside class="dv-pdf-sidebar${dock}" aria-label="Mục lục sách">
      <header class="dv-sidebar-head">
        <h3>Mục lục</h3>
        <p class="meta">${manifest.numPages} trang · ✓ = đã đọc</p>
      </header>
      <button type="button" class="btn dv-toc-toggle" id="dv-toc-toggle">☰ Thu gọn</button>
      <div class="dv-pdf-toc-panel" id="dv-pdf-toc-panel">
        <div id="dv-pdf-toc">${renderServerToc(manifest)}</div>
      </div>
    </aside>`;
}

function renderReaderPane(startMeta, manifest, lessonSlug) {
  return `
        <div class="dv-pdf-image-wrap">
          <img id="dv-pdf-img" class="dv-pdf-img" src="${escapeAttr(startMeta.image)}" alt="Trang sách ${startMeta.page}" />
          <button type="button" class="btn dv-pdf-zoom-btn" id="dv-pdf-zoom" title="Phóng to">🔍 Phóng to</button>
        </div>
        <div class="dv-pdf-tools">
          <div class="dv-slide-toolbar">
            <button type="button" class="btn" id="dv-pdf-prev">← Trang trước</button>
            <span class="dv-counter" id="dv-pdf-counter">Trang ${startMeta.page} / ${manifest.numPages}</span>
            <button type="button" class="btn primary" id="dv-pdf-next">Trang tiếp →</button>
          </div>
          <button type="button" class="btn" id="dv-pdf-mark-read">Đánh dấu đã đọc xong trang</button>
          <div class="dv-voice-row">
            <label for="dv-voice-select">Giọng đọc:</label>
            <select id="dv-voice-select" class="dv-voice-select"></select>
          </div>
          <p class="dv-voice-warn hidden" id="dv-voice-warn">
            💡 Chọn <strong>🇻🇳 Tiếng Việt (online)</strong> ở trên để đọc chuẩn không cần cài thêm.
            Muốn giọng offline: Windows → <em>Cài đặt → Thời gian &amp; ngôn ngữ → Giọng nói → Tiếng Việt</em> (HoaiMy / Hoai An).
          </p>
          <span class="dv-audio-status" id="dv-audio-status" aria-live="polite"></span>
          <div id="dv-pdf-words"></div>
          <div class="dv-pdf-add-word">
            <input type="text" id="dv-pdf-word-input" placeholder="Gõ từ hoặc vần trên sách…" maxlength="40" />
            <button type="button" class="btn primary" id="dv-pdf-add-word">Thêm &amp; đọc</button>
          </div>
          <h3>Bảng vần — bấm đọc · double-click đánh vần (bờ–a–ba)</h3>
          <div id="dv-pdf-syllables" class="dv-pdf-syllables">
            <p class="meta dv-js-hint">Đang tải bảng vần… (nếu lâu: F5 hoặc restart <code>npm start</code>)</p>
          </div>
          <noscript>
            <p class="meta">Bật JavaScript để lật trang, phóng to và nghe vần. Dùng mục lục cột trái (#trang).</p>
          </noscript>
        </div>`;
}

function renderPdfReader(lessonSlug, options = {}) {
  const externalSidebar = options.externalSidebar === true;
  const manifest = loadPdfManifest();
  if (!manifest?.pages?.length) {
    return `<p class="meta">Chưa có ảnh trang sách. Chạy: <code>npm run build:danh-van</code></p>`;
  }

  const start = getStartPage(lessonSlug, manifest);
  const startMeta = manifest.pages.find((p) => p.page === start) || manifest.pages[0];
  const pane = renderReaderPane(startMeta, manifest, lessonSlug);

  if (externalSidebar) {
    return `
    <section class="dv-pdf-reader dv-pdf-reader--hub" id="dv-pdf-reader" data-lesson="${escapeAttr(lessonSlug)}">
      <div class="dv-pdf-right dv-pdf-right--hub">${pane}</div>
    </section>
    <div class="dv-zoom-modal hidden" id="dv-zoom-modal" role="dialog" aria-modal="true">
      <button type="button" class="dv-zoom-close" id="dv-zoom-close" aria-label="Đóng">✕</button>
      <img id="dv-zoom-img" class="dv-zoom-img" src="" alt="Phóng to trang sách" />
    </div>`;
  }

  return `
    <div class="dv-pdf-stage-fullbleed">
    <section class="dv-126-banner dv-126-banner--stage">
      <h2>📖 Sách đánh vần — <strong>${manifest.numPages} trang</strong></h2>
      <p class="meta">Trái: mục lục · Phải trên: trang sách · Phải dưới: đọc / vần</p>
    </section>
    <section class="dv-pdf-reader" id="dv-pdf-reader" data-lesson="${escapeAttr(lessonSlug)}">
      <div class="dv-pdf-layout">
        ${renderTocSidebar(manifest)}
        <div class="dv-pdf-right">${pane}</div>
      </div>
    </section>
    </div>
    <div class="dv-zoom-modal hidden" id="dv-zoom-modal" role="dialog" aria-modal="true">
      <button type="button" class="dv-zoom-close" id="dv-zoom-close" aria-label="Đóng">✕</button>
      <img id="dv-zoom-img" class="dv-zoom-img" src="" alt="Phóng to trang sách" />
    </div>`;
}

function getPdfClientScript(lessonSlug) {
  const manifest = loadPdfManifest();
  if (!manifest) return '';
  const lite = {
    numPages: manifest.numPages,
    toc: manifest.toc,
    pages: manifest.pages.map((p) => ({
      page: p.page,
      image: p.image,
      words: p.words || [],
      topic: p.topic || '',
      syllables: p.syllables || [],
    })),
  };
  const start = getStartPage(lessonSlug, manifest);
  return `window.DV_PDF = ${JSON.stringify(lite)}; window.DV_PDF_START = ${start};`;
}

module.exports = {
  loadPdfManifest,
  renderTocSidebar,
  renderPdfReader,
  getPdfClientScript,
  getStartPage,
};
