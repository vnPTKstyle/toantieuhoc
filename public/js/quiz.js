(function () {
  if (typeof window.QUIZ_CONFIG === 'undefined') return;

  const cfg = window.QUIZ_CONFIG;
  const knowledge = document.getElementById('knowledge-panel');
  const intro = document.getElementById('quiz-practice');
  const panel = document.getElementById('quiz-panel');
  const result = document.getElementById('quiz-result');
  const btnPractice = document.getElementById('btn-practice');
  const btnStart = document.getElementById('btn-start');
  const btnBack = document.getElementById('btn-back-theory');
  const btnNext = document.getElementById('btn-next');
  const btnRetry = document.getElementById('btn-retry');
  const counter = document.getElementById('quiz-counter');
  const progressFill = document.getElementById('progress-fill');
  const questionEl = document.getElementById('quiz-question');
  const feedbackEl = document.getElementById('quiz-feedback');

  let quizId = null;
  let questions = [];
  let answers = [];
  let index = 0;

  function sameAnswer(user, correct) {
    if (user == null || correct == null) return false;
    const a = String(user).trim().normalize('NFC');
    const b = String(correct).trim().normalize('NFC');
    if (a === b) return true;
    try {
      return a.localeCompare(b, 'vi', { sensitivity: 'base' }) === 0;
    } catch {
      return a.toLowerCase() === b.toLowerCase();
    }
  }

  btnPractice?.addEventListener('click', () => {
    intro?.classList.remove('hidden');
    intro?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  btnBack?.addEventListener('click', () => {
    panel?.classList.add('hidden');
    intro?.classList.add('hidden');
    result?.classList.add('hidden');
    knowledge?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  btnStart?.addEventListener('click', startQuiz);
  btnNext?.addEventListener('click', () => nextQuestion());
  btnRetry?.addEventListener('click', resetToTheory);

  function resetToTheory() {
    result?.classList.add('hidden');
    panel?.classList.add('hidden');
    intro?.classList.add('hidden');
    knowledge?.classList.remove('hidden');
    knowledge?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function startQuiz() {
    btnStart.disabled = true;
    try {
      const res = await fetch(
        `/api/quiz/${encodeURIComponent(cfg.grade)}/${encodeURIComponent(cfg.slug)}`
      );
      if (!res.ok) throw new Error('Không tải được câu hỏi');
      const data = await res.json();
      quizId = data.quizId;
      questions = data.questions;
      answers = new Array(questions.length).fill(null);
      index = 0;

      intro?.classList.add('hidden');
      result?.classList.add('hidden');
      panel?.classList.remove('hidden');
      panel?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      renderQuestion();
    } catch (e) {
      alert('Lỗi: ' + e.message);
    } finally {
      btnStart.disabled = false;
    }
  }

  function renderQuestion() {
    questionEl.textContent = questions[index].prompt;
    counter.textContent = `Câu ${index + 1}/${questions.length}`;
    progressFill.style.width = `${((index + 1) / questions.length) * 100}%`;

    const choices = document.createElement('div');
    choices.className = 'choices';
    questions[index].choices.forEach((c) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'choice-btn';
      btn.textContent = c;
      btn.dataset.value = c;
      if (answers[index] === c) btn.classList.add('selected');
      btn.addEventListener('click', () => selectChoice(btn, c));
      choices.appendChild(btn);
    });
    questionEl.appendChild(choices);

    feedbackEl.classList.add('hidden');
    feedbackEl.className = 'quiz-feedback hidden';
    btnNext.disabled = answers[index] == null;
    btnNext.textContent = index === questions.length - 1 ? 'Nộp bài' : 'Câu tiếp';
  }

  function selectChoice(btn, value) {
    if (btn.disabled) return;
    answers[index] = value;
    questionEl.querySelectorAll('.choice-btn').forEach((b) => {
      b.classList.toggle('selected', b.dataset.value === value);
    });
    btnNext.disabled = false;
  }

  async function nextQuestion() {
    const user = answers[index];
    btnNext.disabled = true;

    const expected = questions[index]?.answer;
    let correctAnswer = expected != null ? String(expected) : '';
    let correct = sameAnswer(user, expected);

    try {
      const res = await fetch('/api/quiz/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, index, answer: user }),
      });
      const data = await res.json();
      if (res.ok) {
        correct = data.correct;
        correctAnswer = data.correctAnswer ?? correctAnswer;
      }
    } catch {
      /* phiên server có thể hết — vẫn chấm theo đáp án đã tải lúc bắt đầu */
    }

    questionEl.querySelectorAll('.choice-btn').forEach((b) => {
      b.disabled = true;
      if (correctAnswer && b.dataset.value === String(correctAnswer)) {
        b.classList.add('correct');
      }
      if (b.dataset.value === String(user) && !correct) {
        b.classList.add('wrong');
      }
    });

    if (correct) {
      feedbackEl.textContent = 'Chính xác! Giỏi lắm!';
      feedbackEl.className = 'quiz-feedback ok';
    } else {
      feedbackEl.textContent = correctAnswer
        ? `Chưa đúng. Đáp án đúng là: ${correctAnswer}`
        : 'Chưa đúng. Hãy thử lại bài sau nhé!';
      feedbackEl.className = 'quiz-feedback bad';
    }
    feedbackEl.classList.remove('hidden');

    const delay = correct ? 600 : 1200;
    setTimeout(() => {
      index += 1;
      if (index >= questions.length) {
        showResult();
        return;
      }
      questionEl.innerHTML = '';
      renderQuestion();
      btnNext.disabled = false;
    }, delay);
  }

  async function showResult() {
    panel.classList.add('hidden');
    result.classList.remove('hidden');
    result.scrollIntoView({ behavior: 'smooth', block: 'start' });

    let score = null;
    try {
      const res = await fetch('/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, answers }),
      });
      const data = await res.json();
      if (res.ok) score = data.score;
    } catch {
      /* bỏ qua */
    }
    if (score == null && questions.length) {
      const n = questions.filter((q, i) => sameAnswer(answers[i], q.answer)).length;
      score = n * 10;
    }
    if (score == null) score = 0;

    document.getElementById('score-num').textContent = String(score);
    const msg = document.getElementById('score-message');
    if (score >= 90) msg.textContent = 'Xuất sắc! Em đã nắm vững bài này.';
    else if (score >= 70) msg.textContent = 'Khá tốt! Luyện thêm một lần nữa nhé.';
    else if (score >= 50) msg.textContent = 'Cố gắng thêm! Hãy xem lại phần lý thuyết.';
    else msg.textContent = 'Đừng nản! Đọc lại kiến thức rồi làm lại bài.';
  }
})();
