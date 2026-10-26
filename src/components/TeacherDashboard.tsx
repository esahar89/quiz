import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Download,
  RefreshCw,
  Trash2,
  Eye,
  Database,
  BarChart3,
  Users,
  Copy,
  Check,
  X,
  CheckCircle2,
  XCircle,
  Code2,
  FileSpreadsheet,
  Plus,
  Layers,
  Power,
  Pencil
} from 'lucide-react';
import { ARABIC_LETTERS, QUIZ_QUESTIONS } from '../data/questions';
import { QuizUploadModal } from './QuizUploadModal';
import type { DashboardPayload, StudentSubmission, QuizDefinition } from '../types/quiz';

interface TeacherDashboardProps {
  onActiveQuizChanged?: (quiz: QuizDefinition) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onActiveQuizChanged
}) => {
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedQuizId, setSelectedQuizId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'quizzes' | 'students' | 'questions' | 'database'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [quizSearchQuery, setQuizSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentSubmission | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [dbInspectorMode, setDbInspectorMode] = useState<'schema' | 'json' | 'sql'>('schema');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteQuizId, setConfirmDeleteQuizId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [editingTitleValue, setEditingTitleValue] = useState<string>('');

  const fetchDashboard = useCallback(async (quizIdOverride?: string) => {
    setLoading(true);
    try {
      const targetId = quizIdOverride !== undefined ? quizIdOverride : selectedQuizId;
      const url = targetId
        ? `/api/dashboard?quizId=${encodeURIComponent(targetId)}`
        : '/api/dashboard';
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) {
        const payload = (await response.json()) as DashboardPayload;
        setData(payload);
        if (!selectedQuizId && payload.selectedQuizId) {
          setSelectedQuizId(payload.selectedQuizId);
        }
        const currentActive = payload.quizzes.find((q) => q.id === payload.activeQuizId);
        if (currentActive) {
          onActiveQuizChanged?.(currentActive);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [selectedQuizId, onActiveQuizChanged]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleSelectQuizForView = (quizId: string) => {
    setSelectedQuizId(quizId);
    fetchDashboard(quizId);
  };

  const handleActivateQuizForStudents = async (quizId: string) => {
    setActivatingId(quizId);
    try {
      const res = await fetch(`/api/quizzes/${encodeURIComponent(quizId)}/activate`, {
        method: 'POST'
      });
      if (res.ok) {
        setSelectedQuizId(quizId);
        await fetchDashboard(quizId);
      }
    } finally {
      setActivatingId(null);
    }
  };

  const handleSaveQuizTitle = async (quizId: string) => {
    const clean = editingTitleValue.trim();
    if (!clean) return;
    try {
      const res = await fetch(`/api/quizzes/${encodeURIComponent(quizId)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: clean })
      });
      if (res.ok) {
        setEditingQuizId(null);
        await fetchDashboard();
      }
    } catch {
      // ignore
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    try {
      const res = await fetch(`/api/quizzes/${encodeURIComponent(quizId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setConfirmDeleteQuizId(null);
        setSelectedQuizId('');
        await fetchDashboard('');
      }
    } catch {
      // ignore
    }
  };

  const handleCopyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDeleteSubmission = async (submissionId: string) => {
    try {
      const res = await fetch(`/api/submissions/${encodeURIComponent(submissionId)}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setConfirmDeleteId(null);
        if (selectedStudent?.id === submissionId) {
          setSelectedStudent(null);
        }
        fetchDashboard();
      }
    } catch {
      // ignore error
    }
  };

  const handleSeedSample = async () => {
    await fetch('/api/dashboard/seed', { method: 'POST' });
    fetchDashboard();
  };

  const quizzes: QuizDefinition[] = data?.quizzes || [];
  const activeQuiz = quizzes.find((q) => q.id === data?.activeQuizId) || quizzes[0];
  const viewedQuiz =
    quizzes.find((q) => q.id === (selectedQuizId || data?.selectedQuizId)) ||
    activeQuiz;
  const viewedQuestions = viewedQuiz?.questions || QUIZ_QUESTIONS;

  const handleExportCSV = () => {
    if (!data || data.submissions.length === 0) return;

    const headers = [
      'الكويز',
      'رقم الطالب',
      'اسم الطالب',
      `الدرجة (من ${viewedQuestions.length})`,
      'النسبة المئوية',
      'التقدير',
      'الزمن المستغرق (ثانية)',
      'تاريخ التسليم',
      ...viewedQuestions.map((q) => `س${q.id} (الصحيحة: ${ARABIC_LETTERS[q.correct]})`)
    ];

    const rows = data.submissions.map((sub) => {
      const qCols = viewedQuestions.map((q) => {
        const ans = sub.answers.find((a) => a.questionId === q.id);
        if (!ans) return '-';
        const letter = ARABIC_LETTERS[ans.selectedOption] || '-';
        return `${letter} (${ans.isCorrect ? 'صح' : 'خطأ'})`;
      });

      return [
        `"${(sub.quizTitle || viewedQuiz?.title || '').replace(/"/g, '""')}"`,
        sub.studentId,
        `"${sub.studentName.replace(/"/g, '""')}"`,
        sub.score,
        `${sub.percentage}%`,
        sub.grade,
        sub.durationSeconds,
        `"${new Date(sub.submittedAt).toLocaleString('ar-SA')}"`,
        ...qCols
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `quiz_results_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateSQLDump = (): string => {
    if (!data) return '';
    const lines: string[] = [
      '-- مخطط وجدول قاعدة بيانات نتائج الكويزات',
      'CREATE TABLE IF NOT EXISTS student_submissions (',
      '  id VARCHAR(36) PRIMARY KEY NOT NULL,',
      '  quiz_id VARCHAR(48) NOT NULL,',
      '  quiz_title NVARCHAR(160) NOT NULL,',
      '  student_id VARCHAR(32) NOT NULL,',
      '  student_name NVARCHAR(120) NOT NULL,',
      '  score INT NOT NULL,',
      '  total_questions INT NOT NULL,',
      '  percentage INT NOT NULL CHECK (percentage BETWEEN 0 AND 100),',
      '  grade NVARCHAR(32) NOT NULL,',
      '  duration_seconds INT DEFAULT 0 NOT NULL,',
      '  answers JSONB NOT NULL,',
      '  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,',
      '  UNIQUE (quiz_id, student_id)',
      ');',
      ''
    ];

    data.submissions.forEach((sub) => {
      const safeQuizTitle = (sub.quizTitle || '').replace(/'/g, "''");
      const safeName = sub.studentName.replace(/'/g, "''");
      const safeAnswers = JSON.stringify(sub.answers).replace(/'/g, "''");
      lines.push(
        `INSERT INTO student_submissions (id, quiz_id, quiz_title, student_id, student_name, score, total_questions, percentage, grade, duration_seconds, answers, submitted_at) VALUES ('${sub.id}', '${sub.quizId}', '${safeQuizTitle}', '${sub.studentId}', '${safeName}', ${sub.score}, ${sub.totalQuestions}, ${sub.percentage}, '${sub.grade}', ${sub.durationSeconds}, '${safeAnswers}', '${sub.submittedAt}');`
      );
    });

    return lines.join('\n');
  };

  const studentQuizUrl = `${window.location.origin}/`;

  const filteredSubmissions = (data?.submissions || []).filter((sub) => {
    const matchesQuery =
      !searchQuery.trim() ||
      sub.studentId.toLowerCase().includes(searchQuery.trim().toLowerCase()) ||
      sub.studentName.toLowerCase().includes(searchQuery.trim().toLowerCase());

    const matchesGrade = gradeFilter === 'all' || sub.grade === gradeFilter;
    return matchesQuery && matchesGrade;
  });

  const filteredQuizzes = quizzes.filter((q) => {
    if (!quizSearchQuery.trim()) return true;
    const term = quizSearchQuery.trim().toLowerCase();
    return (
      q.title.toLowerCase().includes(term) ||
      q.description.toLowerCase().includes(term)
    );
  });

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}د ${s}ث`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Header & Active Quiz Control Card */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold mb-1">
              <span>لوحة تحكم المعلم</span>
              <span aria-hidden="true">·</span>
              <span>إدارة الكويزات المتعددة وقاعدة بيانات نتائج الطلاب</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              داشبورد الكويزات ونتائج الطلاب
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prominent Add / Upload Quiz Button */}
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-l from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/25 transition whitespace-nowrap shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة / رفع كويز جديد +</span>
            </button>

            <button
              type="button"
              onClick={() => fetchDashboard()}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap shrink-0"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
              <span>تحديث</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              disabled={!data || data.submissions.length === 0}
              className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap shrink-0 disabled:opacity-40"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>تصدير CSV</span>
            </button>
          </div>
        </div>

        {/* Active Quiz Selector & Status Bar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pt-4 border-t border-slate-700/70">
          {/* Active Quiz Indicator & Quick Selector */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="min-w-0">
              <span className="text-xs text-emerald-400 font-bold block mb-1">
                الكويز المتاح حالياً للتقديم من قِبل الطلاب ({quizzes.length} كويز في النظام):
              </span>
              <div className="text-sm sm:text-base font-extrabold text-white truncate">
                {activeQuiz?.title || 'لا يوجد كويز محدد'} ({activeQuiz?.questions.length ?? 0} سؤالاً)
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={activeQuiz?.id || ''}
                onChange={(e) => handleActivateQuizForStudents(e.target.value)}
                disabled={activatingId !== null}
                aria-label="تغيير الكويز المتاح للطلاب"
                className="bg-slate-800 border border-slate-600 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs font-bold text-white max-w-[230px]"
              >
                {quizzes.map((q, idx) => (
                  <option key={q.id} value={q.id}>
                    {idx + 1}. {q.title} ({q.questions.length} س)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Unified Link Box */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-xs text-slate-400 block mb-1">
                الرابط الموحد لإرساله للطلاب:
              </span>
              <span className="text-xs font-mono-tabular text-cyan-300 truncate block dir-ltr text-left">
                {studentQuizUrl}
              </span>
            </div>
            <button
              type="button"
              onClick={() => handleCopyText(studentQuizUrl, 'studentUrl')}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 transition"
            >
              {copiedKey === 'studentUrl' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الرابط</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Summary Strip for Viewed Quiz */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">إجمالي الطلاب المختبرين</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono-tabular">
            {data?.stats.totalStudents ?? 0}
          </div>
          <span className="text-xs text-slate-400 mt-1 truncate block">
            في: {viewedQuiz?.title}
          </span>
        </div>

        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">متوسط الدرجات العام</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono-tabular">
            {data?.stats.averageScore ?? 0}{' '}
            <span className="text-base text-slate-400">
              / {data?.stats.maxPossibleScore ?? viewedQuestions.length}
            </span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block font-mono-tabular">
            بمتوسط نسبة مئوية {data?.stats.averagePercentage ?? 0}%
          </span>
        </div>

        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">نسبة اجتياز الاختبار (≥ 50%)</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono-tabular">
            {data?.stats.passRate ?? 0}%
          </div>
          <span className="text-xs text-slate-400 mt-1 block font-mono-tabular">
            متوسط زمن الحل: {formatDuration(data?.stats.averageDurationSeconds ?? 0)}
          </span>
        </div>

        <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4">
          <span className="text-xs text-slate-400 block mb-1">أعلى / أقل درجة مسجلة</span>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono-tabular">
            {data?.stats.highestScore ?? 0} / {data?.stats.lowestScore ?? 0}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            إجمالي الكويزات بالنظام: {quizzes.length}
          </span>
        </div>
      </div>

      {/* Segmented Dashboard Tabs + Viewed Quiz Filter */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-800 border border-slate-700 rounded-2xl overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('quizzes')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap shrink-0 ${
              activeTab === 'quizzes'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>مكتبة الكويزات ({quizzes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap shrink-0 ${
              activeTab === 'students'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>سجل نتائج الطلاب ({data?.submissions.length ?? 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap shrink-0 ${
              activeTab === 'questions'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>تحليل الأسئلة ({viewedQuestions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('database')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition whitespace-nowrap shrink-0 ${
              activeTab === 'database'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>تفاصيل قاعدة البيانات</span>
          </button>
        </div>

        {/* Filter Dashboard Results by Any Uploaded Quiz */}
        {activeTab !== 'quizzes' && quizzes.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-bold">عرض نتائج كويز:</span>
            <select
              value={viewedQuiz?.id || ''}
              onChange={(e) => handleSelectQuizForView(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-cyan-300"
            >
              {quizzes.map((q, idx) => (
                <option key={q.id} value={q.id}>
                  {idx + 1}. {q.title} {q.id === data?.activeQuizId ? '(نشط للطلاب ✓)' : ''}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 0: QUIZZES LIBRARY & ACTIVATION MANAGER (SUPPORTS 20+ QUIZZES) */}
      {activeTab === 'quizzes' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-extrabold text-white">
                إدارة الكويزات وتحديد الكويز المتاح للطلاب ({quizzes.length} كويز)
              </h2>
              <p className="text-xs text-slate-400">
                يمكنك رفع أكثر من 20 كويز واختيار أي واحد منها بالضغط على زر &quot;تفعيل للطلاب&quot; ليصبح هو الاختبار الذي يظهر للطلاب عند تسجيل الدخول.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="relative min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="بحث في عناوين الكويزات..."
                  value={quizSearchQuery}
                  onChange={(e) => setQuizSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl pr-10 pl-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة / رفع كويزات</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuizzes.map((q, idx) => {
              const isCurrentlyActive = q.id === data?.activeQuizId;

              return (
                <div
                  key={q.id}
                  className={`p-5 rounded-2xl border-2 transition flex flex-col justify-between gap-4 ${
                    isCurrentlyActive
                      ? 'bg-slate-900/95 border-emerald-500/70 shadow-lg shadow-emerald-950/30'
                      : 'bg-slate-900/60 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-mono-tabular font-bold text-slate-400">
                        كويز #{idx + 1} · {q.questions.length} سؤالاً
                      </span>

                      {isCurrentlyActive ? (
                        <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>متاح حالياً للطلاب ✓</span>
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">غير مفعل للطلاب</span>
                      )}
                    </div>

                    {editingQuizId === q.id ? (
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={editingTitleValue}
                          onChange={(e) => setEditingTitleValue(e.target.value)}
                          className="flex-1 bg-slate-950 border border-cyan-400 rounded-xl px-3 py-1.5 text-sm font-bold text-white focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveQuizTitle(q.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0"
                        >
                          حفظ
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingQuizId(null)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs shrink-0"
                        >
                          إلغاء
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base sm:text-lg font-extrabold text-white">
                          {q.title}
                        </h3>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingQuizId(q.id);
                            setEditingTitleValue(q.title);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 shrink-0 transition"
                          title="تعديل عنوان الكويز"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                    <p className="text-xs text-slate-400 leading-relaxed">{q.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {!isCurrentlyActive ? (
                        <button
                          type="button"
                          disabled={activatingId === q.id}
                          onClick={() => handleActivateQuizForStudents(q.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition"
                        >
                          <Power className="w-3.5 h-3.5" />
                          <span>
                            {activatingId === q.id ? 'جاري التفعيل...' : 'تفعيل للطلاب الآن'}
                          </span>
                        </button>
                      ) : (
                        <span className="px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                          الكويز النشط حالياً
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          handleSelectQuizForView(q.id);
                          setActiveTab('students');
                        }}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-bold transition"
                      >
                        عرض نتائج الطلاب
                      </button>
                    </div>

                    {quizzes.length > 1 && (
                      <div>
                        {confirmDeleteQuizId === q.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => handleDeleteQuiz(q.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-600 text-white text-xs font-bold"
                            >
                              تأكيد الحذف
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteQuizId(null)}
                              className="px-2 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
                            >
                              إلغاء
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteQuizId(q.id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
                            title="حذف الكويز"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 1: STUDENT SUBMISSIONS TABLE */}
      {activeTab === 'students' && (
        <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-6">
          {/* Search & Grade Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="بحث برقم الطالب أو اسم الطالب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-slate-500"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700 overflow-x-auto">
              {[
                { key: 'all', label: 'الكل' },
                { key: 'ممتاز', label: 'ممتاز' },
                { key: 'جيد جداً', label: 'جيد جداً' },
                { key: 'مقبول', label: 'مقبول' },
                { key: 'يحتاج مراجعة', label: 'يحتاج مراجعة' }
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setGradeFilter(item.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap shrink-0 ${
                    gradeFilter === item.key
                      ? 'bg-slate-700 text-cyan-300'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 px-4 bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-slate-300 font-bold mb-2">
                لا توجد سجلات طلاب لهذا الكويز ({viewedQuiz?.title}) حالياً
              </p>
              <p className="text-xs text-slate-400 mb-4">
                عند قيام أي طالب بتسجيل الدخول برقمه وإنهاء هذا الكويز، ستظهر نتيجته هنا تلقائياً.
              </p>
              {viewedQuiz?.id === quizzes[0]?.id && (
                <button
                  type="button"
                  onClick={handleSeedSample}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition"
                >
                  إضافة سجلات طلاب تجريبية للمعاينة
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 text-xs text-slate-400">
                    <th className="py-3 px-3 font-bold">رقم الطالب</th>
                    <th className="py-3 px-3 font-bold">اسم الطالب</th>
                    <th className="py-3 px-3 font-bold">الدرجة</th>
                    <th className="py-3 px-3 font-bold">النسبة المئوية</th>
                    <th className="py-3 px-3 font-bold">التقدير</th>
                    <th className="py-3 px-3 font-bold">الزمن</th>
                    <th className="py-3 px-3 font-bold">وقت التسليم</th>
                    <th className="py-3 px-3 font-bold text-left">إجراءات السجل</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-sm">
                  {filteredSubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="hover:bg-slate-900/60 transition-colors"
                    >
                      <td className="py-3.5 px-3 font-mono-tabular font-bold text-cyan-400">
                        {sub.studentId}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-white">
                        {sub.studentName}
                      </td>
                      <td className="py-3.5 px-3 font-mono-tabular font-extrabold text-slate-100">
                        {sub.score} / {sub.totalQuestions}
                      </td>
                      <td className="py-3.5 px-3 font-mono-tabular font-bold text-emerald-400">
                        {sub.percentage}%
                      </td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`text-xs font-bold ${
                            sub.percentage >= 85
                              ? 'text-emerald-400'
                              : sub.percentage >= 70
                              ? 'text-cyan-300'
                              : sub.percentage >= 50
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {sub.grade}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono-tabular text-xs text-slate-300">
                        {formatDuration(sub.durationSeconds)}
                      </td>
                      <td className="py-3.5 px-3 font-mono-tabular text-xs text-slate-400">
                        {new Date(sub.submittedAt).toLocaleString('ar-SA')}
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedStudent(sub)}
                            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-cyan-300 text-xs font-bold flex items-center gap-1 transition whitespace-nowrap shrink-0"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>تفاصيل الإجابات</span>
                          </button>

                          {confirmDeleteId === sub.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDeleteSubmission(sub.id)}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition whitespace-nowrap shrink-0"
                              >
                                تأكيد الحذف
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs font-bold"
                              >
                                إلغاء
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(sub.id)}
                              title="حذف المحاولة للسماح للطالب بإعادة الاختبار"
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUESTION ANALYTICS & PRE-DISTRIBUTED ANSWER KEY */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-white">
                تحليل أسئلة: {viewedQuiz?.title} ({viewedQuestions.length} سؤالاً)
              </h2>
              <p className="text-xs text-slate-400">
                توزيع مواقع الإجابات الصحيحة ونسب اختيارات الطلاب لكل سؤال.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {viewedQuestions.map((q) => {
              const stat = data?.questionAnalytics.find((qa) => qa.questionId === q.id);
              const correctRate = stat?.correctRate ?? 0;
              const totalAttempts = stat?.totalAttempts ?? 0;

              return (
                <div
                  key={q.id}
                  className="bg-slate-800/90 border border-slate-700 rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-extrabold text-cyan-400 font-mono-tabular">
                        السؤال #{q.id} · الإجابة الصحيحة: ({ARABIC_LETTERS[q.correct]})
                      </span>
                      <span className="text-xs font-mono-tabular font-bold text-emerald-400">
                        نسبة الصحة: {correctRate}% ({stat?.correctCount ?? 0}/{totalAttempts})
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white leading-relaxed mb-4">
                      {q.question}
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrectOpt = optIdx === q.correct;
                      const pickedCount = stat?.optionCounts[optIdx] ?? 0;
                      const pickedPercent =
                        totalAttempts > 0 ? Math.round((pickedCount / totalAttempts) * 100) : 0;

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            isCorrectOpt
                              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200 font-bold'
                              : 'bg-slate-900/70 border-slate-800 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`w-6 h-6 rounded-lg flex items-center justify-center font-extrabold shrink-0 ${
                                isCorrectOpt
                                  ? 'bg-emerald-500 text-slate-950'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {ARABIC_LETTERS[optIdx]}
                            </span>
                            <span className="truncate">{opt}</span>
                          </div>
                          <span className="font-mono-tabular shrink-0 text-slate-400">
                            {pickedCount} طالب ({pickedPercent}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: DATABASE SCHEMA & LIVE INSPECTOR */}
      {activeTab === 'database' && data && (
        <div className="space-y-6">
          <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-white mb-1">
                  مواصفات وتفاصيل قاعدة البيانات المسجلة للكويزات والنتائج
                </h2>
                <p className="text-xs text-slate-400">
                  تُحفظ جميع الكويزات المرفوعة ومحاولات الطلاب تلقائياً على الخادم في{' '}
                  <code className="text-cyan-400 font-mono-tabular">
                    {data.dbMetadata.storageFile}
                  </code>
                </p>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-700">
                <button
                  type="button"
                  onClick={() => setDbInspectorMode('schema')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    dbInspectorMode === 'schema'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  هيكل الجدول (Schema)
                </button>
                <button
                  type="button"
                  onClick={() => setDbInspectorMode('json')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    dbInspectorMode === 'json'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  السجلات الخام (JSON)
                </button>
                <button
                  type="button"
                  onClick={() => setDbInspectorMode('sql')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    dbInspectorMode === 'sql'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  تصدير أوامر SQL
                </button>
              </div>
            </div>

            {/* DB Technical Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700/80">
                <span className="text-xs text-slate-400 block mb-1">الجداول الأساسية</span>
                <span className="text-sm font-mono-tabular font-bold text-cyan-400">
                  {data.dbMetadata.tableName}
                </span>
              </div>
              <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700/80">
                <span className="text-xs text-slate-400 block mb-1">الكويزات المحفوظة</span>
                <span className="text-sm font-mono-tabular font-bold text-emerald-400">
                  {data.dbMetadata.totalQuizzes} كويز
                </span>
              </div>
              <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700/80">
                <span className="text-xs text-slate-400 block mb-1">حجم قاعدة البيانات</span>
                <span className="text-sm font-mono-tabular font-bold text-white">
                  {(data.dbMetadata.fileSizeBytes / 1024).toFixed(2)} KB ({data.dbMetadata.totalRecords} نتيجة)
                </span>
              </div>
              <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700/80">
                <span className="text-xs text-slate-400 block mb-1">آخر تحديث للسجلات</span>
                <span className="text-xs font-mono-tabular font-bold text-slate-200">
                  {new Date(data.dbMetadata.lastUpdated).toLocaleString('ar-SA')}
                </span>
              </div>
            </div>

            {dbInspectorMode === 'schema' && (
              <div className="overflow-x-auto">
                <table className="w-full text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700 text-xs text-slate-400">
                      <th className="py-3 px-3 font-bold">اسم الحقل (Column)</th>
                      <th className="py-3 px-3 font-bold">نوع البيانات (Data Type)</th>
                      <th className="py-3 px-3 font-bold">القيود والفهرسة (Constraints)</th>
                      <th className="py-3 px-3 font-bold">الوصف الوظيفي في النظام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm">
                    {data.dbMetadata.columns.map((col) => (
                      <tr key={col.name} className="hover:bg-slate-900/50">
                        <td className="py-3 px-3 font-mono-tabular font-bold text-cyan-400">
                          {col.name}
                        </td>
                        <td className="py-3 px-3 font-mono-tabular text-xs text-amber-300">
                          {col.type}
                        </td>
                        <td className="py-3 px-3 font-mono-tabular text-xs text-emerald-400">
                          {col.constraints}
                        </td>
                        <td className="py-3 px-3 text-slate-300 text-xs sm:text-sm">
                          {col.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {dbInspectorMode === 'json' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-bold">
                    محتوى سجلات النتائج الخام (JSON Records)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(JSON.stringify(data.submissions, null, 2), 'jsonCopy')
                    }
                    className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    {copiedKey === 'jsonCopy' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>تم نسخ JSON</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>نسخ السجلات الخام</span>
                      </>
                    )}
                  </button>
                </div>
                <pre
                  dir="ltr"
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono-tabular text-cyan-300 overflow-x-auto max-h-96 leading-relaxed text-left"
                >
                  {JSON.stringify(data.submissions, null, 2)}
                </pre>
              </div>
            )}

            {dbInspectorMode === 'sql' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-cyan-400" />
                    <span>أوامر SQL لبناء الجدول وإدراج نتائج الطلاب الحالية</span>
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyText(generateSQLDump(), 'sqlCopy')}
                      className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-xs font-bold text-white flex items-center gap-1.5"
                    >
                      {copiedKey === 'sqlCopy' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>تم نسخ SQL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ كود SQL</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([generateSQLDump()], {
                          type: 'application/sql;charset=utf-8'
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'student_submissions_dump.sql';
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>تنزيل ملف .SQL</span>
                    </button>
                  </div>
                </div>
                <pre
                  dir="ltr"
                  className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-xs font-mono-tabular text-emerald-300 overflow-x-auto max-h-96 leading-relaxed text-left"
                >
                  {generateSQLDump()}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Upload / Add Quiz Modal */}
      {showUploadModal && (
        <QuizUploadModal
          onClose={() => setShowUploadModal(false)}
          onSuccess={() => {
            fetchDashboard('');
            setActiveTab('quizzes');
          }}
        />
      )}

      {/* Student Detailed Answers Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-cyan-400 font-bold mb-0.5 font-mono-tabular">
                  رقم الطالب: {selectedStudent.studentId} · التقدير: {selectedStudent.grade}
                </div>
                <h3 className="text-lg font-extrabold text-white">
                  تفاصيل إجابات الطالب: {selectedStudent.studentName} ({selectedStudent.score} /{' '}
                  {selectedStudent.totalQuestions})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-3">
              {viewedQuestions.map((q) => {
                const ans = selectedStudent.answers.find((a) => a.questionId === q.id);
                const pickedIdx = ans ? ans.selectedOption : -1;
                const isCorrect = pickedIdx === q.correct;

                return (
                  <div
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-extrabold text-cyan-300 font-mono-tabular">
                        السؤال #{q.id}
                      </span>
                      {isCorrect ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>إجابة صحيحة (+1)</span>
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>إجابة خاطئة (0)</span>
                        </span>
                      )}
                    </div>

                    <p className="text-sm font-bold text-white mb-2.5">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div
                        className={`p-2.5 rounded-xl border ${
                          isCorrect
                            ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                            : 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                        }`}
                      >
                        <span className="block text-slate-400 mb-0.5">إجابة الطالب:</span>
                        <span className="font-bold">
                          ({ARABIC_LETTERS[pickedIdx] || '-'}) {q.options[pickedIdx] || 'لم يُجب'}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl border bg-slate-900/90 border-slate-700 text-emerald-300">
                        <span className="block text-slate-400 mb-0.5">الإجابة الصحيحة المعتمدة:</span>
                        <span className="font-bold">
                          ({ARABIC_LETTERS[q.correct]}) {q.options[q.correct]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono-tabular">
                معرف السجل: {selectedStudent.id}
              </span>
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold"
              >
                إغلاق النافذة
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
