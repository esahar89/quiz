import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { QUIZ_QUESTIONS, evaluateGrade, svgIllustrations } from './src/data/questions.ts';
import { generateContextualQuestionSvg } from './src/utils/contextualSvg.ts';
import type {
  QuizDefinition,
  QuizQuestion,
  StudentSubmission,
  StudentAnswerRecord,
  DashboardPayload,
  QuestionAnalyticsItem,
  DatabaseColumnSchema
} from './src/types/quiz.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'quiz_database.json');

const DEFAULT_QUIZ_ID = 'quiz-bios-uefi-1';
const BIOS_SVG_SET = new Set(Object.values(svgIllustrations).map((s) => s.trim()));

function sanitizeQuizIfPolluted(quiz: QuizDefinition): {
  quiz: QuizDefinition;
  modified: boolean;
} {
  if (quiz.id === DEFAULT_QUIZ_ID) {
    return { quiz, modified: false };
  }

  let modified = false;
  let newTitle = quiz.title.trim();

  if (
    !newTitle ||
    /^(questions?|quiz(data|questions)?|data|items|test|index|untitled|كويز مضاف بالكود)$/i.test(
      newTitle
    )
  ) {
    const sampleText = quiz.questions
      .slice(0, 8)
      .map((q) => q.question)
      .join(' ')
      .toLowerCase();
    if (
      sampleText.includes('ipv4') ||
      sampleText.includes('dns') ||
      sampleText.includes('dhcp') ||
      sampleText.includes('osi')
    ) {
      newTitle = `اختبار الشبكات وأنظمة التشغيل وإدارة الخوادم (${quiz.questions.length} سؤالاً)`;
    } else {
      newTitle = `اختبار تفاعلي (${quiz.questions.length} سؤالاً)`;
    }
    modified = true;
  }

  const updatedQuestions = quiz.questions.map((q, idx) => {
    const trimmedSvg = (q.svg || '').trim();
    const hasGenericCaption = /^رسم توضيحي للسؤال\s+\d+$/i.test((q.caption || '').trim());
    const hasInjectedBiosSvg = BIOS_SVG_SET.has(trimmedSvg) && hasGenericCaption;

    if (hasInjectedBiosSvg || !trimmedSvg) {
      const contextual = generateContextualQuestionSvg(q.question, idx);
      modified = true;
      return {
        ...q,
        svg: contextual.svg,
        caption: contextual.caption
      };
    }
    return q;
  });

  return {
    quiz: {
      ...quiz,
      title: newTitle,
      questions: updatedQuestions
    },
    modified
  };
}

interface DatabaseStore {
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

function buildDefaultQuiz(): QuizDefinition {
  return {
    id: DEFAULT_QUIZ_ID,
    title: 'اختبار BIOS و UEFI وأنواع الموصلات',
    description: 'مستوى سهل للمبتدئين · مدعم بالصور التوضيحية المباشرة (14 سؤالاً)',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isActive: true,
    questions: QUIZ_QUESTIONS
  };
}

function buildSeedSubmissions(defaultQuiz: QuizDefinition): StudentSubmission[] {
  const questions = defaultQuiz.questions;
  const sampleStudents = [
    {
      id: 'sub-1001',
      studentId: '44510231',
      studentName: 'عبدالله محمد العتيبي',
      durationSeconds: 315,
      submittedAt: new Date(Date.now() - 1000 * 60 * 95).toISOString(),
      picked: questions.map((q, idx) => (idx === 11 ? 0 : q.correct))
    },
    {
      id: 'sub-1002',
      studentId: '44510248',
      studentName: 'ريان خالد الزهراني',
      durationSeconds: 410,
      submittedAt: new Date(Date.now() - 1000 * 60 * 62).toISOString(),
      picked: questions.map((q, idx) =>
        idx === 3 || idx === 6 || idx === 9 ? (q.correct + 1) % 4 : q.correct
      )
    },
    {
      id: 'sub-1003',
      studentId: '44510289',
      studentName: 'فهد سلطان القحطاني',
      durationSeconds: 280,
      submittedAt: new Date(Date.now() - 1000 * 60 * 38).toISOString(),
      picked: questions.map((q) => q.correct)
    },
    {
      id: 'sub-1004',
      studentId: '44510315',
      studentName: 'نواف عبدالرحمن الحربي',
      durationSeconds: 495,
      submittedAt: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      picked: questions.map((q, idx) =>
        idx % 2 === 1 && idx < 12 ? (q.correct + 2) % 4 : q.correct
      )
    }
  ];

  return sampleStudents.map((s) => {
    const answers: StudentAnswerRecord[] = questions.map((q, idx) => {
      const selectedOption = s.picked[idx];
      return {
        questionId: q.id,
        selectedOption,
        correctOption: q.correct,
        isCorrect: selectedOption === q.correct
      };
    });
    const score = answers.filter((a) => a.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const { grade } = evaluateGrade(percentage);
    return {
      id: s.id,
      quizId: defaultQuiz.id,
      quizTitle: defaultQuiz.title,
      studentId: s.studentId,
      studentName: s.studentName,
      score,
      totalQuestions,
      percentage,
      grade,
      durationSeconds: s.durationSeconds,
      answers,
      submittedAt: s.submittedAt
    };
  });
}

function ensureDatabase(): DatabaseStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const defaultQuiz = buildDefaultQuiz();

  if (!fs.existsSync(DB_FILE)) {
    const initialStore: DatabaseStore = {
      version: 2,
      lastUpdated: new Date().toISOString(),
      activeQuizId: defaultQuiz.id,
      quizzes: [defaultQuiz],
      submissions: buildSeedSubmissions(defaultQuiz)
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialStore, null, 2), 'utf-8');
    return initialStore;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<DatabaseStore>;

    let quizzes = Array.isArray(parsed.quizzes) && parsed.quizzes.length > 0
      ? parsed.quizzes
      : [defaultQuiz];

    let activeQuizId = parsed.activeQuizId || quizzes.find((q) => q.isActive)?.id || quizzes[0].id;
    if (!quizzes.some((q) => q.id === activeQuizId)) {
      activeQuizId = quizzes[0].id;
    }

    let anyModified = false;
    quizzes = quizzes.map((q) => {
      const { quiz: cleaned, modified } = sanitizeQuizIfPolluted(q);
      if (modified) anyModified = true;
      return {
        ...cleaned,
        isActive: cleaned.id === activeQuizId
      };
    });

    const submissions = (Array.isArray(parsed.submissions) ? parsed.submissions : []).map((sub) => {
      const matchedQuiz = quizzes.find((q) => q.id === sub.quizId);
      return {
        ...sub,
        quizId: sub.quizId || defaultQuiz.id,
        quizTitle: matchedQuiz?.title || sub.quizTitle || defaultQuiz.title
      };
    });

    const store: DatabaseStore = {
      version: 2,
      lastUpdated: parsed.lastUpdated || new Date().toISOString(),
      activeQuizId,
      quizzes,
      submissions
    };

    if (anyModified) {
      saveDatabase(store);
    }

    return store;
  } catch {
    const fallbackStore: DatabaseStore = {
      version: 2,
      lastUpdated: new Date().toISOString(),
      activeQuizId: defaultQuiz.id,
      quizzes: [defaultQuiz],
      submissions: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(fallbackStore, null, 2), 'utf-8');
    return fallbackStore;
  }
}

function saveDatabase(store: DatabaseStore): void {
  store.lastUpdated = new Date().toISOString();
  fs.writeFileSync(DB_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

function getActiveQuiz(db: DatabaseStore): QuizDefinition {
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

async function startServer() {
  const app = express();
  // Support large payloads for uploading 20+ quizzes with inline SVGs
  app.use(express.json({ limit: '50mb' }));

  // Prevent browser caching on API routes so active quiz switches take effect immediately
  app.use('/api', (_req, res, next) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  ensureDatabase();

  // 0. Admin Authentication (username: admin, password: Sahar2026)
  app.post('/api/auth/admin', (req, res) => {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '');

    if (username.toLowerCase() === 'admin' && password === 'Sahar2026') {
      res.json({
        status: 'authenticated',
        role: 'admin',
        username: 'admin'
      });
      return;
    }

    res.status(401).json({
      error: 'اسم المستخدم أو كلمة المرور غير صحيحة.'
    });
  });

  // 1. Get Currently Active Quiz for Students
  app.get('/api/quizzes/active', (_req, res) => {
    const db = ensureDatabase();
    const activeQuiz = getActiveQuiz(db);
    res.json({ quiz: activeQuiz });
  });

  // 2. Verify Student ID before starting the Currently Active Quiz
  app.post('/api/auth/student', (req, res) => {
    const rawStudentId = req.body?.studentId;
    const rawStudentName = req.body?.studentName;

    const studentId = normalizeStudentId(rawStudentId);
    const studentName = String(rawStudentName || '').trim();

    if (!studentId || studentId.length < 2) {
      res.status(400).json({ error: 'يرجى إدخال رقم طالب صحيح.' });
      return;
    }

    const db = ensureDatabase();
    const activeQuiz = getActiveQuiz(db);

    const existing = db.submissions.find(
      (s) =>
        s.quizId === activeQuiz.id &&
        s.studentId.toLowerCase() === studentId.toLowerCase()
    );

    if (existing) {
      res.json({
        status: 'already_completed',
        submission: existing,
        quiz: activeQuiz
      });
      return;
    }

    if (!studentName || studentName.length < 2) {
      res.status(400).json({ error: 'يرجى إدخال اسم الطالب الكامل لبدء الاختبار.' });
      return;
    }

    res.json({
      status: 'allowed',
      studentId,
      studentName,
      quiz: activeQuiz
    });
  });

  // 3. Submit Final Quiz Answers for Active Quiz
  app.post('/api/submissions', (req, res) => {
    const studentId = normalizeStudentId(req.body?.studentId);
    const studentName = String(req.body?.studentName || '').trim();
    const quizId = String(req.body?.quizId || '');
    const selectedOptions = req.body?.selectedOptions as number[];
    const durationSeconds = Math.max(1, Number(req.body?.durationSeconds) || 60);

    if (!studentId || !studentName) {
      res.status(400).json({ error: 'بيانات الطالب غير مكتملة.' });
      return;
    }

    const db = ensureDatabase();
    const targetQuiz =
      db.quizzes.find((q) => q.id === quizId) || getActiveQuiz(db);

    if (!Array.isArray(selectedOptions) || selectedOptions.length !== targetQuiz.questions.length) {
      res.status(400).json({
        error: `يرجى الإجابة على جميع الأسئلة الـ ${targetQuiz.questions.length} قبل التسليم.`
      });
      return;
    }

    const existing = db.submissions.find(
      (s) =>
        s.quizId === targetQuiz.id &&
        s.studentId.toLowerCase() === studentId.toLowerCase()
    );

    if (existing) {
      res.json({
        alreadySubmitted: true,
        submission: existing,
        quiz: targetQuiz
      });
      return;
    }

    const answers: StudentAnswerRecord[] = targetQuiz.questions.map((q, index) => {
      const selected = Number(selectedOptions[index]);
      const isCorrect = selected === q.correct;
      return {
        questionId: q.id,
        selectedOption: selected,
        correctOption: q.correct,
        isCorrect
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
    saveDatabase(db);

    res.status(201).json({
      alreadySubmitted: false,
      submission: newSubmission,
      quiz: targetQuiz
    });
  });

  // 4. Create / Upload One or Multiple Quizzes (Supports 20+ Quizzes)
  app.post('/api/quizzes', (req, res) => {
    const db = ensureDatabase();
    const rawQuizzes = Array.isArray(req.body?.quizzes)
      ? req.body.quizzes
      : [req.body];
    const activateImmediately = Boolean(req.body?.activateImmediately);

    const createdQuizzes: QuizDefinition[] = [];

    for (const item of rawQuizzes) {
      const title = String(item?.title || '').trim();
      const description = String(item?.description || '').trim();
      const rawQuestions = Array.isArray(item?.questions) ? item.questions : [];

      if (!title || rawQuestions.length === 0) {
        continue;
      }

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
          typeof q.correct === 'number' && q.correct >= 0 && q.correct <= 3
            ? q.correct
            : 0,
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

    if (createdQuizzes.length === 0) {
      res.status(400).json({ error: 'بيانات الكويز غير مكتملة أو لا تحتوي على أسئلة.' });
      return;
    }

    if (activateImmediately) {
      const lastAdded = createdQuizzes[createdQuizzes.length - 1];
      db.activeQuizId = lastAdded.id;
      db.quizzes = db.quizzes.map((q) => ({
        ...q,
        isActive: q.id === lastAdded.id
      }));
    }

    saveDatabase(db);
    res.status(201).json({
      createdCount: createdQuizzes.length,
      quizzes: db.quizzes,
      activeQuizId: db.activeQuizId
    });
  });

  // 5. Activate a Specific Quiz for Students
  app.post('/api/quizzes/:quizId/activate', (req, res) => {
    const targetQuizId = String(req.params.quizId || '');
    const db = ensureDatabase();
    const targetQuiz = db.quizzes.find((q) => q.id === targetQuizId);

    if (!targetQuiz) {
      res.status(404).json({ error: 'لم يتم العثور على الكويز المطلوب.' });
      return;
    }

    db.activeQuizId = targetQuiz.id;
    db.quizzes = db.quizzes.map((q) => ({
      ...q,
      isActive: q.id === targetQuiz.id
    }));

    saveDatabase(db);
    res.json({
      success: true,
      activeQuizId: db.activeQuizId,
      activeQuiz: targetQuiz
    });
  });

  // 5b. Update Quiz Title / Description
  app.put('/api/quizzes/:quizId', (req, res) => {
    const targetQuizId = String(req.params.quizId || '');
    const newTitle = String(req.body?.title || '').trim();
    const newDescription = req.body?.description !== undefined ? String(req.body.description).trim() : undefined;

    if (!newTitle) {
      res.status(400).json({ error: 'يرجى إدخال عنوان صحيح للكويز.' });
      return;
    }

    const db = ensureDatabase();
    const exists = db.quizzes.some((q) => q.id === targetQuizId);
    if (!exists) {
      res.status(404).json({ error: 'الكويز غير موجود.' });
      return;
    }

    db.quizzes = db.quizzes.map((q) => {
      if (q.id !== targetQuizId) return q;
      return {
        ...q,
        title: newTitle,
        description: newDescription !== undefined ? newDescription : q.description
      };
    });

    db.submissions = db.submissions.map((sub) =>
      sub.quizId === targetQuizId ? { ...sub, quizTitle: newTitle } : sub
    );

    saveDatabase(db);
    res.json({
      success: true,
      quizzes: db.quizzes
    });
  });

  // 6. Delete a Quiz from the System
  app.delete('/api/quizzes/:quizId', (req, res) => {
    const targetQuizId = String(req.params.quizId || '');
    const db = ensureDatabase();

    if (db.quizzes.length <= 1) {
      res.status(400).json({
        error: 'لا يمكن حذف الكويز الوحيد في النظام. يجب بقاء كويز واحد على الأقل.'
      });
      return;
    }

    const exists = db.quizzes.some((q) => q.id === targetQuizId);
    if (!exists) {
      res.status(404).json({ error: 'الكويز غير موجود.' });
      return;
    }

    db.quizzes = db.quizzes.filter((q) => q.id !== targetQuizId);
    db.submissions = db.submissions.filter((s) => s.quizId !== targetQuizId);

    if (db.activeQuizId === targetQuizId) {
      db.activeQuizId = db.quizzes[0].id;
    }
    db.quizzes = db.quizzes.map((q) => ({
      ...q,
      isActive: q.id === db.activeQuizId
    }));

    saveDatabase(db);
    res.json({
      success: true,
      activeQuizId: db.activeQuizId,
      quizzes: db.quizzes
    });
  });

  // 7. Get Teacher Dashboard & Database Inspector Data
  app.get('/api/dashboard', (req, res) => {
    const db = ensureDatabase();
    const requestedQuizId = String(req.query.quizId || '').trim();

    const selectedQuiz =
      db.quizzes.find((q) => q.id === requestedQuizId) || getActiveQuiz(db);

    const quizSubmissions = db.submissions
      .filter((s) => s.quizId === selectedQuiz.id)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    const totalStudents = quizSubmissions.length;
    const maxPossibleScore = selectedQuiz.questions.length;
    const averageScore =
      totalStudents > 0
        ? Number((quizSubmissions.reduce((sum, s) => sum + s.score, 0) / totalStudents).toFixed(1))
        : 0;
    const averagePercentage =
      totalStudents > 0
        ? Math.round(quizSubmissions.reduce((sum, s) => sum + s.percentage, 0) / totalStudents)
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
          if (ans.isCorrect) {
            correctCount++;
          }
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

    let fileSizeBytes = 0;
    try {
      fileSizeBytes = fs.statSync(DB_FILE).size;
    } catch {
      fileSizeBytes = 0;
    }

    const payload: DashboardPayload = {
      quizzes: db.quizzes,
      activeQuizId: db.activeQuizId,
      selectedQuizId: selectedQuiz.id,
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
        engine: 'JSON Relational Document Store (Server-Persisted)',
        tableName: 'student_submissions & quizzes',
        storageFile: 'data/quiz_database.json',
        fileSizeBytes,
        totalRecords: db.submissions.length,
        totalQuizzes: db.quizzes.length,
        lastUpdated: db.lastUpdated,
        columns: DB_COLUMNS_SCHEMA
      }
    };

    res.json(payload);
  });

  // 8. Delete a student submission (Allow student to retake)
  app.delete('/api/submissions/:submissionId', (req, res) => {
    const targetParam = normalizeStudentId(req.params.submissionId);
    const quizIdFilter = String(req.query.quizId || '');
    const db = ensureDatabase();
    const initialLen = db.submissions.length;

    db.submissions = db.submissions.filter((s) => {
      if (s.id === req.params.submissionId) return false;
      if (
        s.studentId.toLowerCase() === targetParam.toLowerCase() &&
        (!quizIdFilter || s.quizId === quizIdFilter)
      ) {
        return false;
      }
      return true;
    });

    if (db.submissions.length === initialLen) {
      res.status(404).json({ error: 'لم يتم العثور على سجل الطالب.' });
      return;
    }

    saveDatabase(db);
    res.json({ success: true, remaining: db.submissions.length });
  });

  // 9. Reset / Re-seed sample data for demonstration if empty
  app.post('/api/dashboard/seed', (_req, res) => {
    const db = ensureDatabase();
    const defaultQuiz = db.quizzes[0] || buildDefaultQuiz();
    const seeds = buildSeedSubmissions(defaultQuiz);
    seeds.forEach((seed) => {
      if (
        !db.submissions.some(
          (s) => s.studentId === seed.studentId && s.quizId === seed.quizId
        )
      ) {
        db.submissions.push(seed);
      }
    });
    saveDatabase(db);
    res.json({ success: true, totalRecords: db.submissions.length });
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Quiz & Database Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
