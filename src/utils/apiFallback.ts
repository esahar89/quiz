import { QUIZ_QUESTIONS, RAW_NETWORKING_QUESTIONS, evaluateGrade } from '../data/questions';
import { generateContextualQuestionSvg } from './contextualSvg';
import type {
  QuizDefinition,
  QuizQuestion,
  StudentSubmission,
  StudentAnswerRecord,
  DashboardPayload,
  QuestionAnalyticsItem,
  DatabaseColumnSchema
} from '../types/quiz';

const STORAGE_KEY = 'sahar_quiz_platform_db_v2';

interface LocalDatabaseStore {
  version: number;
  lastUpdated: string;
  activeQuizId: string;
  quizzes: QuizDefinition[];
  submissions: StudentSubmission[];
}

const DB_COLUMNS_SCHEMA: DatabaseColumnSchema[] = [
  {
    name: 'id',
    type: 'VARCHAR(36)',
    constraints: 'PRIMARY KEY, NOT NULL',
    description: 'المعرف الفريد لسجل محاولة الاختبار (UUID)'
  },
  {
    name: 'quiz_id',
    type: 'VARCHAR(48)',
    constraints: 'FOREIGN KEY REFERENCES quizzes(id), NOT NULL',
    description: 'معرف الكويز الذي قدمه الطالب (يربط النتيجة بالكويز النشط وقت التقديم)'
  },
  {
    name: 'quiz_title',
    type: 'NVARCHAR(160)',
    constraints: 'NOT NULL',
    description: 'عنوان الكويز الذي اختبر فيه الطالب'
  },
  {
    name: 'student_id',
    type: 'VARCHAR(32)',
    constraints: 'UNIQUE (quiz_id, student_id), NOT NULL',
    description: 'الرقم التدريبي أو الجامعي للطالب (محاولة واحدة لكل كويز)'
  },
  {
    name: 'student_name',
    type: 'NVARCHAR(120)',
    constraints: 'NOT NULL',
    description: 'اسم الطالب الكامل المدخل عند بوابة الدخول'
  },
  {
    name: 'score',
    type: 'INT',
    constraints: 'NOT NULL',
    description: 'عدد الإجابات الصحيحة التي حققها الطالب'
  },
  {
    name: 'total_questions',
    type: 'INT',
    constraints: 'NOT NULL',
    description: 'إجمالي عدد أسئلة الكويز'
  },
  {
    name: 'percentage',
    type: 'INT',
    constraints: 'NOT NULL, CHECK (percentage BETWEEN 0 AND 100)',
    description: 'النسبة المئوية للدرجة النهائية'
  },
  {
    name: 'grade',
    type: 'NVARCHAR(32)',
    constraints: 'NOT NULL',
    description: 'التقدير اللفظي (ممتاز، جيد جداً، مقبول، يحتاج مراجعة)'
  },
  {
    name: 'duration_seconds',
    type: 'INT',
    constraints: 'NOT NULL, DEFAULT 0',
    description: 'الزمن الفعلي المستغرق لإنهاء الاختبار بالثواني'
  },
  {
    name: 'answers',
    type: 'JSONB',
    constraints: 'NOT NULL',
    description: 'مصفوفة تفصيلية لإجابات الطالب ومقارنتها بالإجابة الصحيحة'
  },
  {
    name: 'submitted_at',
    type: 'TIMESTAMP WITH TIME ZONE',
    constraints: 'NOT NULL, DEFAULT CURRENT_TIMESTAMP',
    description: 'تاريخ ووقت اعتماد وتسليم الاختبار'
  }
];

function buildInitialQuizzes(): QuizDefinition[] {
  const networkingQuestions: QuizQuestion[] = RAW_NETWORKING_QUESTIONS.map((q, idx) => {
    const visual = generateContextualQuestionSvg(q.question, idx);
    return {
      id: q.id,
      question: q.question,
      svg: visual.svg,
      caption: visual.caption,
      options: q.options,
      correct: q.correct,
      explanation: q.explanation
    };
  });

  return [
    {
      id: 'quiz-bios-uefi-1',
      title: 'اختبار BIOS و UEFI وأنواع الموصلات',
      description: 'مستوى سهل للمبتدئين · مدعم بالصور التوضيحية المباشرة (14 سؤالاً)',
      createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      isActive: false,
      questions: QUIZ_QUESTIONS
    },
    {
      id: 'quiz-1793001254821-n01o7',
      title: 'اختبار الشبكات وأنظمة التشغيل وإدارة الخوادم (30 سؤالاً)',
      description: 'اختبار تفاعلي مكون من 30 سؤالاً',
      createdAt: new Date().toISOString(),
      isActive: true,
      questions: networkingQuestions
    }
  ];
}

function getLocalStore(): LocalDatabaseStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as LocalDatabaseStore;
      if (Array.isArray(parsed.quizzes) && parsed.quizzes.length > 0) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  const initialQuizzes = buildInitialQuizzes();
  const fallbackStore: LocalDatabaseStore = {
    version: 2,
    lastUpdated: new Date().toISOString(),
    activeQuizId: 'quiz-1793001254821-n01o7',
    quizzes: initialQuizzes,
    submissions: []
  };

  saveLocalStore(fallbackStore);
  return fallbackStore;
}

function saveLocalStore(store: LocalDatabaseStore): void {
  store.lastUpdated = new Date().toISOString();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // ignore storage quota errors
  }
}

function getActiveQuiz(db: LocalDatabaseStore): QuizDefinition {
  return (
    db.quizzes.find((q) => q.id === db.activeQuizId) ||
    db.quizzes.find((q) => q.isActive) ||
    db.quizzes[0]
  );
}

function normalizeStudentId(rawId: string): string {
  return String(rawId || '')
    .trim()
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/\s+/g, '');
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

function handleLocalApiRequest(urlStr: string, init?: RequestInit): Response {
  const url = new URL(urlStr, window.location.origin);
  const pathname = url.pathname;
  const method = (init?.method || 'GET').toUpperCase();
  const body = init?.body ? JSON.parse(String(init.body)) : {};

  const db = getLocalStore();

  // POST /api/auth/admin
  if (pathname === '/api/auth/admin' && method === 'POST') {
    const username = String(body?.username || '').trim();
    const password = String(body?.password || '');
    if (username.toLowerCase() === 'admin' && password === 'Sahar2026') {
      return jsonResponse({ status: 'authenticated', role: 'admin', username: 'admin' });
    }
    return jsonResponse({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة.' }, 401);
  }

  // GET /api/quizzes/active
  if (pathname === '/api/quizzes/active' && method === 'GET') {
    return jsonResponse({ quiz: getActiveQuiz(db) });
  }

  // POST /api/auth/student
  if (pathname === '/api/auth/student' && method === 'POST') {
    const studentId = normalizeStudentId(body?.studentId);
    const studentName = String(body?.studentName || '').trim();
    if (!studentId || studentId.length < 2) {
      return jsonResponse({ error: 'يرجى إدخال رقم طالب صحيح.' }, 400);
    }
    const activeQuiz = getActiveQuiz(db);
    const existing = db.submissions.find(
      (s) =>
        s.quizId === activeQuiz.id && s.studentId.toLowerCase() === studentId.toLowerCase()
    );
    if (existing) {
      return jsonResponse({
        status: 'already_completed',
        submission: existing,
        quiz: activeQuiz
      });
    }
    if (!studentName || studentName.length < 2) {
      return jsonResponse({ error: 'يرجى إدخال اسم الطالب الكامل لبدء الاختبار.' }, 400);
    }
    return jsonResponse({
      status: 'allowed',
      studentId,
      studentName,
      quiz: activeQuiz
    });
  }

  // POST /api/submissions
  if (pathname === '/api/submissions' && method === 'POST') {
    const studentId = normalizeStudentId(body?.studentId);
    const studentName = String(body?.studentName || '').trim();
    const quizId = String(body?.quizId || '').trim();
    const quizTitle = String(body?.quizTitle || '').trim();
    const selectedOptions = body?.selectedOptions as number[];
    const durationSeconds = Math.max(1, Number(body?.durationSeconds) || 60);

    let targetQuiz = db.quizzes.find((q) => q.id === quizId);
    if (!targetQuiz && quizTitle) {
      targetQuiz = db.quizzes.find(
        (q) =>
          q.title.trim() === quizTitle &&
          q.questions.length === selectedOptions.length
      );
    }
    if (!targetQuiz) {
      targetQuiz =
        db.quizzes.find((q) => q.questions.length === selectedOptions.length) ||
        getActiveQuiz(db);
    }

    const existing = db.submissions.find(
      (s) =>
        s.quizId === targetQuiz.id && s.studentId.toLowerCase() === studentId.toLowerCase()
    );
    if (existing) {
      return jsonResponse({ alreadySubmitted: true, submission: existing, quiz: targetQuiz });
    }

    const answers: StudentAnswerRecord[] = targetQuiz.questions.map((q, index) => {
      const selected = Number(selectedOptions[index]);
      return {
        questionId: q.id,
        selectedOption: selected,
        correctOption: q.correct,
        isCorrect: selected === q.correct
      };
    });

    const score = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = targetQuiz.questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const { grade } = evaluateGrade(percentage);

    const newSubmission: StudentSubmission = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      quizId: targetQuiz.id,
      quizTitle: targetQuiz.title,
      studentId,
      studentName,
      score,
      totalQuestions,
      percentage,
      grade,
      durationSeconds,
      answers,
      submittedAt: new Date().toISOString()
    };

    db.submissions.unshift(newSubmission);
    saveLocalStore(db);
    return jsonResponse(
      { alreadySubmitted: false, submission: newSubmission, quiz: targetQuiz },
      201
    );
  }

  // POST /api/quizzes
  if (pathname === '/api/quizzes' && method === 'POST') {
    const rawQuizzes = Array.isArray(body?.quizzes) ? body.quizzes : [body];
    const activateImmediately = Boolean(body?.activateImmediately);
    const createdQuizzes: QuizDefinition[] = [];

    for (const item of rawQuizzes) {
      const title = String(item?.title || '').trim();
      const description = String(item?.description || '').trim();
      const rawQuestions = Array.isArray(item?.questions) ? item.questions : [];
      if (!title || rawQuestions.length === 0) continue;

      const cleanQuestions: QuizQuestion[] = rawQuestions.map((q: any, idx: number) => ({
        id: idx + 1,
        question: String(q.question || '').trim(),
        svg: String(q.svg || ''),
        caption: String(q.caption || `رسم توضيحي للسؤال ${idx + 1}`).trim(),
        options: [
          String(q.options?.[0] ?? ''),
          String(q.options?.[1] ?? ''),
          String(q.options?.[2] ?? ''),
          String(q.options?.[3] ?? '')
        ],
        correct:
          typeof q.correct === 'number' && q.correct >= 0 && q.correct <= 3 ? q.correct : 0,
        explanation: String(q.explanation || '').trim()
      }));

      const newQuiz: QuizDefinition = {
        id: `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title,
        description: description || `اختبار تفاعلي مكون من ${cleanQuestions.length} سؤالاً`,
        createdAt: new Date().toISOString(),
        isActive: false,
        questions: cleanQuestions
      };

      db.quizzes.push(newQuiz);
      createdQuizzes.push(newQuiz);
    }

    if (activateImmediately && createdQuizzes.length > 0) {
      const lastAdded = createdQuizzes[createdQuizzes.length - 1];
      db.activeQuizId = lastAdded.id;
      db.quizzes = db.quizzes.map((q) => ({ ...q, isActive: q.id === lastAdded.id }));
    }

    saveLocalStore(db);
    return jsonResponse(
      { createdCount: createdQuizzes.length, quizzes: db.quizzes, activeQuizId: db.activeQuizId },
      201
    );
  }

  // POST /api/quizzes/:quizId/activate
  const activateMatch = pathname.match(/^\/api\/quizzes\/([^/]+)\/activate$/);
  if (activateMatch && method === 'POST') {
    const targetQuizId = decodeURIComponent(activateMatch[1]);
    const targetQuiz = db.quizzes.find((q) => q.id === targetQuizId);
    if (!targetQuiz) return jsonResponse({ error: 'الكويز غير موجود' }, 404);
    db.activeQuizId = targetQuiz.id;
    db.quizzes = db.quizzes.map((q) => ({ ...q, isActive: q.id === targetQuiz.id }));
    saveLocalStore(db);
    return jsonResponse({
      success: true,
      activeQuizId: db.activeQuizId,
      activeQuiz: targetQuiz
    });
  }

  // PUT /api/quizzes/:quizId
  const quizItemMatch = pathname.match(/^\/api\/quizzes\/([^/]+)$/);
  if (quizItemMatch && method === 'PUT') {
    const targetQuizId = decodeURIComponent(quizItemMatch[1]);
    const newTitle = String(body?.title || '').trim();
    if (!newTitle) return jsonResponse({ error: 'يرجى إدخال عنوان صحيح' }, 400);
    db.quizzes = db.quizzes.map((q) =>
      q.id === targetQuizId ? { ...q, title: newTitle } : q
    );
    saveLocalStore(db);
    return jsonResponse({ success: true, quizzes: db.quizzes });
  }

  // DELETE /api/quizzes/:quizId
  if (quizItemMatch && method === 'DELETE') {
    const targetQuizId = decodeURIComponent(quizItemMatch[1]);
    if (db.quizzes.length <= 1) {
      return jsonResponse({ error: 'لا يمكن حذف الكويز الوحيد في النظام.' }, 400);
    }
    db.quizzes = db.quizzes.filter((q) => q.id !== targetQuizId);
    db.submissions = db.submissions.filter((s) => s.quizId !== targetQuizId);
    if (db.activeQuizId === targetQuizId) {
      db.activeQuizId = db.quizzes[0].id;
    }
    db.quizzes = db.quizzes.map((q) => ({ ...q, isActive: q.id === db.activeQuizId }));
    saveLocalStore(db);
    return jsonResponse({
      success: true,
      activeQuizId: db.activeQuizId,
      quizzes: db.quizzes
    });
  }

  // DELETE /api/submissions/:id
  const subDeleteMatch = pathname.match(/^\/api\/submissions\/([^/]+)$/);
  if (subDeleteMatch && method === 'DELETE') {
    const targetId = decodeURIComponent(subDeleteMatch[1]);
    db.submissions = db.submissions.filter(
      (s) => s.id !== targetId && s.studentId.toLowerCase() !== targetId.toLowerCase()
    );
    saveLocalStore(db);
    return jsonResponse({ success: true, remaining: db.submissions.length });
  }

  // GET /api/dashboard
  if (pathname === '/api/dashboard' && method === 'GET') {
    const requestedQuizId = url.searchParams.get('quizId') || '';
    const viewAllQuizzes = requestedQuizId === 'all';
    const selectedQuiz =
      db.quizzes.find((q) => q.id === requestedQuizId) || getActiveQuiz(db);
    const quizSubmissions = viewAllQuizzes
      ? db.submissions
      : db.submissions.filter(
          (s) =>
            s.quizId === selectedQuiz.id ||
            (s.totalQuestions === selectedQuiz.questions.length &&
              s.quizTitle === selectedQuiz.title)
        );
    const totalStudents = quizSubmissions.length;
    const maxPossibleScore = selectedQuiz.questions.length;
    const averageScore =
      totalStudents > 0
        ? Number(
            (quizSubmissions.reduce((sum, s) => sum + s.score, 0) / totalStudents).toFixed(1)
          )
        : 0;
    const averagePercentage =
      totalStudents > 0
        ? Math.round(
            quizSubmissions.reduce((sum, s) => sum + s.percentage, 0) / totalStudents
          )
        : 0;
    const passedCount = quizSubmissions.filter((s) => s.percentage >= 50).length;
    const passRate = totalStudents > 0 ? Math.round((passedCount / totalStudents) * 100) : 0;
    const highestScore =
      totalStudents > 0 ? Math.max(...quizSubmissions.map((s) => s.score)) : 0;
    const lowestScore =
      totalStudents > 0 ? Math.min(...quizSubmissions.map((s) => s.score)) : 0;
    const averageDurationSeconds =
      totalStudents > 0
        ? Math.round(
            quizSubmissions.reduce((sum, s) => sum + s.durationSeconds, 0) / totalStudents
          )
        : 0;

    const questionAnalytics: QuestionAnalyticsItem[] = selectedQuiz.questions.map((q) => {
      const optionCounts: [number, number, number, number] = [0, 0, 0, 0];
      let correctCount = 0;
      quizSubmissions.forEach((sub) => {
        const ans = sub.answers.find((a) => a.questionId === q.id);
        if (ans && ans.selectedOption >= 0 && ans.selectedOption <= 3) {
          optionCounts[ans.selectedOption]++;
          if (ans.isCorrect) correctCount++;
        }
      });
      const correctRate =
        totalStudents > 0 ? Math.round((correctCount / totalStudents) * 100) : 0;
      return {
        questionId: q.id,
        questionText: q.question,
        correctOptionIndex: q.correct,
        totalAttempts: totalStudents,
        correctCount,
        correctRate,
        optionCounts
      };
    });

    const payload: DashboardPayload = {
      quizzes: db.quizzes,
      activeQuizId: db.activeQuizId,
      selectedQuizId: viewAllQuizzes ? 'all' : selectedQuiz.id,
      submissions: quizSubmissions,
      stats: {
        totalStudents,
        averageScore,
        maxPossibleScore,
        averagePercentage,
        passRate,
        highestScore,
        lowestScore,
        averageDurationSeconds
      },
      questionAnalytics,
      dbMetadata: {
        engine: 'Hybrid Cloud / LocalStorage Persistent Store',
        tableName: 'student_submissions & quizzes',
        storageFile: 'data/quiz_database.json',
        fileSizeBytes: JSON.stringify(db).length,
        totalRecords: db.submissions.length,
        totalQuizzes: db.quizzes.length,
        lastUpdated: db.lastUpdated,
        columns: DB_COLUMNS_SCHEMA
      }
    };
    return jsonResponse(payload);
  }

  return jsonResponse({ ok: true });
}

export async function apiFetch(
  input: string,
  init?: RequestInit
): Promise<Response> {
  if (input.startsWith('/api/')) {
    try {
      const response = await window.fetch(input, init);
      const contentType = response.headers.get('content-type') || '';
      if (
        response.status === 404 ||
        response.status === 405 ||
        contentType.includes('text/html')
      ) {
        return handleLocalApiRequest(input, init);
      }
      return response;
    } catch {
      return handleLocalApiRequest(input, init);
    }
  }

  return window.fetch(input, init);
}

