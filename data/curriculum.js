/**
 * Chương trình tiểu học lớp 1–5 (CT2018)
 * Mỗi lớp: Toán + Tiếng Việt (subjects), kiến thức rồi bài tập; ôn tập cuối mỗi môn.
 */
const { gradeSubjectsByLevel } = require('./grade-subjects');

const curriculum = {
  1: {
    title: 'Lớp 1',
    description:
      'Tiếng Việt và Toán. Sách đánh vần 126 trang mở từ menu trên; mỗi bài CT2018: kiến thức rồi 10 câu.',
    subjects: gradeSubjectsByLevel[1],
  },
  2: {
    title: 'Lớp 2',
    description: 'Toán và Tiếng Việt — chương trình đầy đủ, ôn tập cuối mỗi môn.',
    subjects: gradeSubjectsByLevel[2],
  },
  3: {
    title: 'Lớp 3',
    description: 'Toán và Tiếng Việt — bốn phép tính, đọc-viết, ôn tập cuối kỳ.',
    subjects: gradeSubjectsByLevel[3],
  },
  4: {
    title: 'Lớp 4',
    description: 'Toán và Tiếng Việt — số lớn, phân số, văn bản, ôn tập.',
    subjects: gradeSubjectsByLevel[4],
  },
  5: {
    title: 'Lớp 5',
    description: 'Toán và Tiếng Việt — chuẩn bị THCS, ôn tập tổng hợp cuối môn.',
    subjects: gradeSubjectsByLevel[5],
  },
};

function getGrade(grade) {
  const g = Number(grade);
  return curriculum[g] || null;
}

function findLesson(grade, lessonSlug, subjectId) {
  const g = getGrade(grade);
  if (!g) return null;

  const search = (topics, subject) => {
    for (const topic of topics) {
      const lesson = topic.lessons.find((l) => l.slug === lessonSlug);
      if (lesson) return { grade: g, topic, lesson, subject };
    }
    return null;
  };

  if (g.subjects) {
    if (subjectId) {
      const sub = g.subjects.find((s) => s.id === subjectId);
      if (sub) return search(sub.topics, sub);
      return null;
    }
    for (const sub of g.subjects) {
      const hit = search(sub.topics, sub);
      if (hit) return hit;
    }
    return null;
  }

  return search(g.topics, null);
}

function hasSubjects(gradeData) {
  return Boolean(gradeData?.subjects?.length);
}

module.exports = { curriculum, getGrade, findLesson, hasSubjects };
