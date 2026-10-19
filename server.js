const express = require('express');
const crypto = require('crypto');
const path = require('path');
const { curriculum, getGrade, findLesson, hasSubjects } = require('./data/curriculum');
const { subjectArt } = require('./data/subject-art');
const { generateQuiz } = require('./data/questions');
const { sameAnswer } = require('./data/quiz-utils');
const { renderKnowledgeHtml } = require('./data/knowledge');
const { renderHubBody, renderHubSidebar, getDanhVanScript } = require('./data/danh-van');
const { speakViBuffer } = require('./data/dv-tts');
const {
  officialSources,
  supplementarySources,
  threeStrands,
  getOfficialArithmetic,
} = require('./data/official-moet');

const app = express();
const PORT = process.env.PORT || 3000;

/** @type {Map<string, { answers: string[], created: number }>} */
const quizSessions = new Map();
const QUIZ_TTL_MS = 24 * 60 * 60 * 1000;

function pruneQuizSessions() {
  const now = Date.now();
  for (const [id, data] of quizSessions) {
    if (now - data.created > QUIZ_TTL_MS) quizSessions.delete(id);
  }
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/dv/tts', async (req, res) => {
  const text = req.body?.text;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Thiếu nội dung cần đọc.' });
  }
  try {
    const buf = await speakViBuffer(text);
    if (!buf.length) return res.status(400).json({ error: 'Nội dung rỗng.' });
    res.set('Content-Type', 'audio/mpeg');
    res.set('Cache-Control', 'private, max-age=86400');
    res.send(buf);
  } catch (err) {
    console.error('[dv-tts]', err.message);
    res.status(503).json({ error: 'Không tạo được giọng đọc. Kiểm tra kết nối internet.' });
  }
});

app.get('/', (req, res) => {
  res.send(renderPage({
    title: 'Toán Tiểu Học',
    body: `
      <section class="hero">
        <h1>Tiểu Học — Toán &amp; Tiếng Việt</h1>
        <p class="lead">Lớp <strong>1–5</strong>: mỗi lớp có <strong>Toán</strong> và <strong>Tiếng Việt</strong> (CT2018). Kiến thức + minh họa, rồi 10 câu luyện tập.</p>
        <div class="grade-grid">
          ${Object.entries(curriculum)
            .map(
              ([grade, data]) => `
            <a class="grade-card" href="/lop/${grade}">
              <span class="grade-num">${grade}</span>
              <span class="grade-label">${data.title}</span>
              <span class="grade-desc">${data.description.slice(0, 60)}…</span>
            </a>`
            )
            .join('')}
        </div>
      </section>
      <section class="info-box">
        <h2>Cách học</h2>
        <ol>
          <li>Chọn lớp phù hợp với em.</li>
          <li>Chọn chủ đề và bài luyện tập.</li>
          <li>Trả lời 10 câu — có phản hồi ngay và điểm số.</li>
        </ol>
        <p class="meta">Lớp 1: <a href="/sach-126">Sách đánh vần 126 trang</a> · <a href="/tham-khao">Nguồn CT2018</a></p>
      </section>
    `,
  }));
});

app.get('/tham-khao', (req, res) => {
  const gradeBlocks = Object.entries(curriculum)
    .map(([g]) => {
      const ar = getOfficialArithmetic(g);
      if (!ar) return '';
      const ops = [
        ['Phép cộng', ar.cong],
        ['Phép trừ', ar.tru],
        ['Phép nhân', ar.nhan],
        ['Phép chia', ar.chia],
      ];
      return `
        <section class="topic-block">
          <h2>Lớp ${g}</h2>
          ${ops
            .map(
              ([title, items]) => `
            <h3 class="ref-op">${title}</h3>
            <ul>${items.map((i) => `<li>${escapeHtml(i)}</li>`).join('')}</ul>`
            )
            .join('')}
        </section>`;
    })
    .join('');
  res.send(
    renderPage({
      title: 'Nguồn tham khảo',
      body: `
        <nav class="breadcrumb"><a href="/">Trang chủ</a> / Nguồn tham khảo</nav>
        <section class="grade-header">
          <h1>Nguồn chính thức — CT2018 môn Toán</h1>
          <p>${escapeHtml(threeStrands)}</p>
        </section>
        <section class="info-box">
          <h2>Văn bản &amp; tài liệu</h2>
          <ul class="ref-links">
            ${officialSources
              .map(
                (s) =>
                  `<li><a href="${escapeHtml(s.url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(s.title)}</a> — ${escapeHtml(s.note)}</li>`
              )
              .join('')}
          </ul>
          <p class="meta">Web luyện tập căn theo các yêu cầu cần đạt dưới đây (trích ý, không thay thế SGK).</p>
        </section>
        <section class="info-box">
          <h2>Tham khảo thêm (dạng đề)</h2>
          <ul class="ref-links">
            ${supplementarySources
              .map(
                (s) =>
                  `<li><a href="${escapeHtml(s.url)}" rel="noopener noreferrer" target="_blank">${escapeHtml(s.title)}</a> — ${escapeHtml(s.note)}</li>`
              )
              .join('')}
          </ul>
        </section>
        ${gradeBlocks}
      `,
    })
  );
});

function renderOfficialHint(topicId, gradeNum) {
  const map = {
    'cong-1': 'cong',
    'tru-1': 'tru',
    'nhan-1': 'nhan',
    'chia-1': 'chia',
    'cong-2': 'cong',
    'tru-2': 'tru',
    'nhan-2': 'nhan',
    'chia-2': 'chia',
    'cong-3': 'cong',
    'tru-3': 'tru',
    'nhan-3': 'nhan',
    'chia-3': 'chia',
    'cong-4': 'cong',
    'tru-4': 'tru',
    'nhan-4': 'nhan',
    'chia-4': 'chia',
    'cong-5': 'cong',
    'tru-5': 'tru',
    'nhan-5': 'nhan',
    'chia-5': 'chia',
  };
  const key = map[topicId];
  if (!key) return '';
  const ar = getOfficialArithmetic(gradeNum);
  if (!ar || !ar[key]?.length) return '';
  return `<p class="official-hint"><strong>Theo CT2018:</strong> ${escapeHtml(ar[key][0])}${ar[key].length > 1 ? '…' : ''} <a href="/tham-khao">Xem đầy đủ</a></p>`;
}

function lessonTag(slug) {
  if (slug === 'dv-hub') return '126 trang · PDF';
  if (/^dv-/.test(slug)) return 'Luyện đọc · Tương tác + 10 câu';
  if (/on-tap|on-toan|gk1|^g[1-5]-on-/.test(slug) || slug === 'on-tap-phep-tinh') {
    return 'Ôn tập · Kiến thức + 10 câu';
  }
  if (/^(tv-|g[1-5]-tv-)/.test(slug)) return 'TV · Kiến thức + 10 câu';
  return 'Toán · Kiến thức + 10 câu';
}

function lessonHref(grade, slug, subject) {
  if (subject) return `/lop/${grade}/${subject.id}/bai/${slug}`;
  return `/lop/${grade}/bai/${slug}`;
}

function renderTopicBlock(topic, gradeNum, subject) {
  const g = gradeNum;
  return `
    <section class="topic-block">
      <h3>${topic.name}</h3>
      ${renderOfficialHint(topic.id, g)}
      <ul class="lesson-list">
        ${topic.lessons
          .map(
            (l) =>
              `<li><a href="${lessonHref(g, l.slug, subject)}">${l.name}</a> <span class="tag">${lessonTag(l.slug)}</span></li>`
          )
          .join('')}
      </ul>
    </section>`;
}

function renderGradeBody(grade, gradeNum) {
  if (hasSubjects(grade)) {
    return grade.subjects
      .map(
        (sub) => `
      <article class="subject-accordion" id="subject-${sub.id}">
        <button type="button" class="subject-toggle" aria-expanded="false" aria-controls="subject-body-${sub.id}">
          <div class="subject-toggle-art">${subjectArt[sub.id] || ''}</div>
          <div class="subject-toggle-text">
            <h2>${sub.name}</h2>
            <p>${sub.tagline}</p>
            <span class="subject-hint">Bấm để mở chương trình</span>
          </div>
          <span class="subject-chevron" aria-hidden="true">▼</span>
        </button>
        <div class="subject-body hidden" id="subject-body-${sub.id}">
          ${sub.topics.map((t) => renderTopicBlock(t, gradeNum, sub)).join('')}
        </div>
      </article>`
      )
      .join('');
  }
  return grade.topics.map((t) => renderTopicBlock(t, gradeNum, null)).join('');
}

function isDanhVanSlug(slug) {
  return slug === 'dv-hub' || /^dv-/.test(String(slug));
}

const DANH_VAN_START_SLUGS = new Set(['dv-hub', 'dv-am-chu', 'dv-hoc-van', 'dv-luyen-doc']);

function sendDanhVanHub(res, startLesson = 'dv-hub') {
  const slug = DANH_VAN_START_SLUGS.has(startLesson) ? startLesson : 'dv-hub';
  res.send(
    renderPage({
      title: 'Sách đánh vần',
      skipQuiz: true,
      bodyClass: 'page-dv-hub',
      mainClass: 'main-dv-hub',
      bodyAside: renderHubSidebar(),
      extraScript: getDanhVanScript(slug),
      extraScriptSrc: '/js/danh-van-reader.js?v=135',
      body: renderHubBody(),
    })
  );
}

function renderLessonPage(found, gradeNum) {
  const { grade, topic, lesson, subject } = found;
  const back = `/lop/${gradeNum}${subject ? `#${subject.id}` : ''}`;
  const subjectLabel = subject ? `${subject.name} · ` : '';

  if (isDanhVanSlug(lesson.slug) && String(gradeNum) !== '1') {
    return null;
  }

  return {
    title: lesson.name,
    extraScript: `
        window.QUIZ_CONFIG = {
          grade: ${JSON.stringify(String(gradeNum))},
          slug: ${JSON.stringify(lesson.slug)},
          title: ${JSON.stringify(lesson.name)}
        };
      `,
    body: `
        <nav class="breadcrumb">
          <a href="/">Trang chủ</a> /
          <a href="/lop/${gradeNum}">${grade.title}</a> /
          ${subject ? `<span>${subject.name}</span> /` : ''}
          ${lesson.name}
        </nav>
        <header class="lesson-header">
          <h1>${lesson.name}</h1>
          <p class="meta">${subjectLabel}Chủ đề: ${topic.name} · ${grade.title}</p>
        </header>
        ${renderKnowledgeHtml(lesson.slug, { lessonName: lesson.name, topicName: topic.name })}
        <section class="quiz-intro hidden" id="quiz-practice">
          <h2>Bài tập trắc nghiệm</h2>
          <p>10 câu — mỗi câu đúng 10 điểm. Có phản hồi ngay sau mỗi câu.</p>
          <button type="button" class="btn primary" id="btn-start">Bắt đầu làm bài</button>
          <button type="button" class="btn" id="btn-back-theory">Xem lại kiến thức</button>
        </section>
        <section class="quiz-panel hidden" id="quiz-panel">
          <div class="quiz-progress">
            <span id="quiz-counter">Câu 1/10</span>
            <div class="progress-bar"><div id="progress-fill"></div></div>
          </div>
          <div id="quiz-question" class="quiz-question"></div>
          <div id="quiz-feedback" class="quiz-feedback hidden"></div>
          <div class="quiz-actions">
            <button type="button" class="btn" id="btn-next" disabled>Câu tiếp</button>
          </div>
        </section>
        <section class="quiz-result hidden" id="quiz-result">
          <h2>Kết quả</h2>
          <p class="score-display"><span id="score-num">0</span> / 100</p>
          <p id="score-message"></p>
          <button type="button" class="btn primary" id="btn-retry">Làm lại</button>
          <a class="btn" href="${back}">Về danh sách bài</a>
        </section>
      `,
  };
}

app.get('/danh-van', (req, res) => {
  const q = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : '';
  res.redirect(302, `/sach-126${q}`);
});

app.get('/sach-126', (req, res) => {
  sendDanhVanHub(res, req.query.phan || 'dv-hub');
});

app.get('/lop/:grade', (req, res) => {
  const grade = getGrade(req.params.grade);
  if (!grade) {
    return res.status(404).send(renderPage({ title: 'Không tìm thấy', body: '<p>Lớp không hợp lệ.</p>' }));
  }
  const g = req.params.grade;
  const gradeHint =
    g === '1'
      ? 'Sách đánh vần: menu <strong>Sách 126 trang</strong> · Lớp 1: <strong>Tiếng Việt</strong> và <strong>Toán</strong> bên dưới.'
      : 'Bấm <strong>Toán</strong> hoặc <strong>Tiếng Việt</strong> để mở danh sách bài (ôn tập ở cuối mỗi môn).';
  const gradeScript = 'window.SUBJECT_ACCORDION = true;';
  res.send(
    renderPage({
      title: grade.title,
      extraScript: gradeScript,
      extraScriptSrc: '/js/subjects.js',
      body: `
        <nav class="breadcrumb"><a href="/">Trang chủ</a> / ${grade.title}</nav>
        <section class="grade-header">
          <h1>${grade.title}</h1>
          <p>${grade.description}</p>
          <p class="meta">${gradeHint}</p>
        </section>
        ${renderGradeBody(grade, g)}
      `,
    })
  );
});

app.get('/lop/:grade/:mon/bai/:slug', (req, res) => {
  const { slug } = req.params;
  if (isDanhVanSlug(slug) && slug !== 'dv-on-tap') {
    const phan = slug === 'dv-hub' ? '' : `?phan=${encodeURIComponent(slug)}`;
    return res.redirect(302, `/sach-126${phan}`);
  }
  const found = findLesson(req.params.grade, req.params.slug, req.params.mon);
  if (!found) {
    return res.status(404).send(renderPage({ title: 'Không tìm thấy', body: '<p>Bài học không tồn tại.</p>' }));
  }
  const page = renderLessonPage(found, req.params.grade);
  if (!page) {
    return res.status(404).send(renderPage({ title: 'Không tìm thấy', body: '<p>Luyện tập đọc chỉ có ở Lớp 1.</p>' }));
  }
  res.send(renderPage(page));
});

app.get('/lop/:grade/bai/:slug', (req, res) => {
  const { slug } = req.params;
  if (isDanhVanSlug(slug) && slug !== 'dv-on-tap') {
    const phan = slug === 'dv-hub' ? '' : `?phan=${encodeURIComponent(slug)}`;
    return res.redirect(302, `/sach-126${phan}`);
  }
  const found = findLesson(req.params.grade, req.params.slug);
  if (!found) {
    return res.status(404).send(renderPage({ title: 'Không tìm thấy', body: '<p>Bài học không tồn tại.</p>' }));
  }
  const page = renderLessonPage(found, req.params.grade);
  if (!page) {
    return res.status(404).send(renderPage({ title: 'Không tìm thấy', body: '<p>Luyện tập đọc chỉ có ở Lớp 1.</p>' }));
  }
  res.send(renderPage(page));
});

app.get('/api/quiz/:grade/:slug', (req, res) => {
  const found = findLesson(req.params.grade, req.params.slug);
  if (!found) {
    return res.status(404).json({ error: 'Không tìm thấy bài học' });
  }
  pruneQuizSessions();
  const full = generateQuiz(req.params.slug, 10);
  const quizId = crypto.randomUUID();
  quizSessions.set(quizId, {
    answers: full.map((q) => String(q.answer)),
    created: Date.now(),
  });
  const questions = full.map((q) => ({
    id: q.id,
    prompt: q.prompt,
    choices: q.choices,
    answer: q.answer,
  }));
  res.json({ quizId, questions });
});

app.post('/api/quiz/feedback', (req, res) => {
  const { quizId, index, answer } = req.body;
  if (!quizId || index == null || answer == null) {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
  }
  const session = quizSessions.get(quizId);
  if (!session) {
    return res.status(404).json({ error: 'Phiên làm bài đã hết hạn. Hãy bắt đầu lại.' });
  }
  const i = Number(index);
  const correctAnswer = session.answers[i];
  if (correctAnswer == null) {
    return res.status(400).json({ error: 'Câu hỏi không hợp lệ' });
  }
  res.json({
    correct: sameAnswer(answer, correctAnswer),
    correctAnswer,
  });
});

app.post('/api/check', (req, res) => {
  const { quizId, answers } = req.body;
  if (!quizId || !Array.isArray(answers)) {
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ' });
  }
  const session = quizSessions.get(quizId);
  if (!session) {
    return res.status(404).json({ error: 'Phiên làm bài đã hết hạn. Hãy bắt đầu lại.' });
  }
  const key = session.answers;
  if (answers.length !== key.length) {
    return res.status(400).json({ error: 'Số câu trả lời không khớp' });
  }
  const results = key.map((correctAnswer, i) => ({
    id: i + 1,
    correct: sameAnswer(answers[i], correctAnswer),
    correctAnswer,
  }));
  const correctCount = results.filter((r) => r.correct).length;
  res.json({ correctCount, total: key.length, score: correctCount * 10, results });
});

function renderPage({
  title,
  body,
  extraScript = '',
  extraScriptSrc = '',
  extraScriptSrc2 = '',
  skipQuiz = false,
  mainClass = 'container',
  bodyClass = '',
  bodyAside = '',
}) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — Toán Tiểu Học</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/style.css?v=138">
</head>
<body${bodyClass ? ` class="${bodyClass}"` : ''}>
  <header class="site-header">
    <a href="/" class="logo">📚 Tiểu Học</a>
    <nav class="header-nav">
      <a href="/sach-126">Sách 126 trang</a>
      <a href="/tham-khao">Nguồn CT2018</a>
      <span class="badge">Lớp 1–5</span>
    </nav>
  </header>
  ${bodyAside}
  <main class="${mainClass}">${body}</main>
  <footer class="site-footer">
    <p>Toán &amp; Tiếng Việt tiểu học (CT2018 — Bộ GD&amp;ĐT). Dùng để luyện tập tại nhà.</p>
  </footer>
  ${extraScript ? `<script>${extraScript}</script>` : ''}
  ${extraScriptSrc ? `<script src="${extraScriptSrc}"></script>` : ''}
  ${extraScriptSrc2 ? `<script src="${extraScriptSrc2}"></script>` : ''}
  ${skipQuiz ? '' : '<script src="/js/quiz.js"></script>'}
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const server = app.listen(PORT, () => {
  console.log(`Toán Tiểu Học đang chạy tại http://localhost:${PORT}`);
});
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(
      `\nCổng ${PORT} đang được dùng. Chạy: npm run watch (tự giải phóng cổng) hoặc tắt server cũ (Ctrl+C).\n`
    );
    process.exit(1);
  }
  throw err;
});
