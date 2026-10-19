const { ALPHABET, CONSONANTS, VOWELS, VAN_GROUPS, LUYEN_DOC } = require('./danh-van-data');
const {
  renderPdfReader,
  renderTocSidebar,
  getPdfClientScript,
  loadPdfManifest,
} = require('./danh-van-pdf-ui');

const BOOK_REFERENCE = {
  title: 'Tập đánh vần Tiếng Việt 4–6 tuổi (sách in / PDF bản quyền)',
  url: 'https://idbooks.vn/products/sach-moi-tu-duy-ngon-ngu-tap-danh-van-tieng-viet-theo-so-do-tu-duy-phien-ban-tuong-tac-nghe-doc',
  note: 'Web biên soạn theo cùng lộ trình (slide đọc), không thay file PDF gốc.',
};

const FLOW = ['Âm – Chữ', 'Ghép âm', 'Học vần', 'Đọc tiếng', 'Đọc từ', 'Đọc câu', 'Luyện đọc'];

const TONES = [
  { id: 'none', label: 'Không dấu', mark: '' },
  { id: 'sac', label: 'Sắc', mark: '´' },
  { id: 'huyen', label: 'Huyền', mark: '`' },
  { id: 'hoi', label: 'Hỏi', mark: '?' },
  { id: 'nga', label: 'Ngã', mark: '~' },
  { id: 'nang', label: 'Nặng', mark: '.' },
];

const PARTS = [
  {
    id: '1',
    slug: 'dv-am-chu',
    title: 'Phần 1: Học âm – chữ',
    summary: '126 trang sách — trang 5–69.',
  },
  {
    id: '2',
    slug: 'dv-hoc-van',
    title: 'Phần 2: Học vần',
    summary: 'Trang 70–111.',
  },
  {
    id: '3',
    slug: 'dv-luyen-doc',
    title: 'Phần 3: Luyện đọc',
    summary: 'Trang 112–126.',
  },
];

function escapeAttr(s) {
  return String(s).replace(/"/g, '&quot;');
}

function mindMapRootSvg() {
  const branches = [
    { label: 'Phần 1\nÂm – Chữ', x: 120, y: 80, color: '#2563eb' },
    { label: 'Phần 2\nHọc vần', x: 400, y: 80, color: '#16a34a' },
    { label: 'Phần 3\nLuyện đọc', x: 260, y: 200, color: '#d97706' },
  ];
  const lines = branches
    .map(
      (b) =>
        `<line x1="260" y1="130" x2="${b.x + 50}" y2="${b.y + 25}" stroke="${b.color}" stroke-width="3" opacity="0.5"/>`
    )
    .join('');
  const nodes = branches
    .map((b) => {
      const partNum = b.label.split('\n')[0].replace('Phần ', '');
      const slug = PARTS.find((p) => p.id === partNum)?.slug || 'dv-am-chu';
      return `<a xlink:href="/sach-126?phan=${slug}" class="mm-link">
      <rect x="${b.x}" y="${b.y}" width="100" height="52" rx="12" fill="${b.color}" opacity="0.15" stroke="${b.color}" stroke-width="2"/>
      <text x="${b.x + 50}" y="${b.y + 22}" text-anchor="middle" font-size="11" font-weight="700" fill="${b.color}">${b.label.split('\n')[0]}</text>
      <text x="${b.x + 50}" y="${b.y + 38}" text-anchor="middle" font-size="10" fill="#334155">${b.label.split('\n')[1]}</text>
    </a>`;
    })
    .join('');
  return `<svg viewBox="0 0 520 260" class="mindmap-svg" role="img" aria-label="Sơ đồ tư duy ba phần" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    ${lines}
    <circle cx="260" cy="130" r="48" fill="#7c3aed" opacity="0.12" stroke="#7c3aed" stroke-width="3"/>
    <text x="260" y="122" text-anchor="middle" font-size="13" font-weight="800" fill="#5b21b6">Tiếng</text>
    <text x="260" y="140" text-anchor="middle" font-size="13" font-weight="800" fill="#5b21b6">Việt</text>
    ${nodes}
  </svg>`;
}

function renderHubBody() {
  const manifest = loadPdfManifest();
  const partCards = PARTS.map(
    (p) => `
    <a class="dv-part-card" href="/sach-126?phan=${p.slug}">
      <span class="dv-part-num">Phần ${p.id}</span>
      <h3>${p.title.replace(/^Phần \\d: /, '')}</h3>
      <p>${p.summary}</p>
    </a>`
  ).join('');

  const flowSteps = FLOW.map((s) => `<li>${s}</li>`).join('');
  const pageNote = manifest
    ? `<p class="meta">Sách PDF <strong>${manifest.numPages} trang</strong> — mỗi trang = 1 slide trên web.</p>`
    : '';

  return `
    <div class="dv-hub-workspace">
      <div class="dv-hub-workspace-head">
        <nav class="breadcrumb"><a href="/">Trang chủ</a> / Sách đánh vần 126 trang</nav>
        <section class="grade-header grade-header--compact">
          <h1>Sách đánh vần — 126 trang</h1>
          <p class="meta">Cùng hàng với mục lục trái · Trên: trang sách · Dưới: đọc / vần</p>
        </section>
      </div>
      ${renderPdfReader('dv-hub', { externalSidebar: true })}
    </div>
    <details class="info-box dv-hub-parts">
      <summary><strong>Nhảy theo phần</strong> (cùng 126 trang)</summary>
      <section class="dv-parts-grid">${partCards}</section>
    </details>`;
}

function renderHubSidebar() {
  const manifest = loadPdfManifest();
  if (!manifest?.pages?.length) return '';
  return renderTocSidebar(manifest, { dockLeft: true });
}

function renderPartWidget(lessonSlug) {
  return renderPdfReader(lessonSlug);
}

function getDanhVanScript(lessonSlug) {
  return getPdfClientScript(lessonSlug);
}

function usePdfReader() {
  return Boolean(loadPdfManifest()?.pages?.length);
}

function partIdFromSlug(slug) {
  if (slug === 'dv-am-chu') return '1';
  if (slug === 'dv-hoc-van') return '2';
  if (slug === 'dv-luyen-doc') return '3';
  return null;
}

module.exports = {
  BOOK_REFERENCE,
  FLOW,
  PARTS,
  ALPHABET,
  CONSONANTS,
  VOWELS,
  VAN_GROUPS,
  renderHubBody,
  renderHubSidebar,
  renderPartWidget,
  renderPdfReader,
  getDanhVanScript,
  usePdfReader,
  partIdFromSlug,
  mindMapRootSvg,
};
