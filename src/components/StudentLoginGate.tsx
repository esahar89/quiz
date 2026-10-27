import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Hash,
  User,
  ArrowLeft,
  AlertCircle,
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';
import { svgIllustrations } from '../data/questions';
import { apiFetch } from '../utils/apiFallback';
import type { QuizDefinition, StudentSubmission } from '../types/quiz';

interface StudentLoginGateProps {
  initialActiveQuiz?: QuizDefinition;
  onActiveQuizLoaded?: (quiz: QuizDefinition) => void;
  onStartQuiz: (studentId: string, studentName: string, activeQuiz: QuizDefinition) => void;
  onAlreadyCompleted: (submission: StudentSubmission, activeQuiz: QuizDefinition) => void;
  onAdminAuthenticated: (username: string) => void;
}

export const StudentLoginGate: React.FC<StudentLoginGateProps> = ({
  initialActiveQuiz,
  onActiveQuizLoaded,
  onStartQuiz,
  onAlreadyCompleted,
  onAdminAuthenticated
}) => {
  const [loginMode, setLoginMode] = useState<'student' | 'admin'>('student');
  const [identifier, setIdentifier] = useState('');
  const [studentName, setStudentName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeQuiz, setActiveQuiz] = useState<QuizDefinition | null>(
    initialActiveQuiz || null
  );

  useEffect(() => {
    apiFetch('/api/quizzes/active', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.quiz) {
          setActiveQuiz(data.quiz);
          onActiveQuizLoaded?.(data.quiz);
        }
      })
      .catch(() => {
        // ignore error
      });
  }, [onActiveQuizLoaded]);

  const isTypingAdminInStudentMode =
    loginMode === 'student' && identifier.trim().toLowerCase() === 'admin';

  const effectiveMode: 'student' | 'admin' =
    loginMode === 'admin' || isTypingAdminInStudentMode ? 'admin' : 'student';

  const handleModeSwitch = (mode: 'student' | 'admin') => {
    setLoginMode(mode);
    setErrorMsg(null);
    if (mode === 'admin' && identifier.trim().toLowerCase() !== 'admin') {
      setIdentifier('');
    }
    if (mode === 'student' && identifier.trim().toLowerCase() === 'admin') {
      setIdentifier('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanId = identifier.trim();

    if (effectiveMode === 'admin') {
      if (!cleanId) {
        setErrorMsg('يرجى إدخال اسم المستخدم للمشرف.');
        return;
      }
      if (!password) {
        setErrorMsg('يرجى إدخال كلمة المرور للمشرف.');
        return;
      }

      setLoading(true);
      try {
        const res = await apiFetch('/api/auth/admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: cleanId,
            password
          })
        });
        const data = await res.json();
        if (!res.ok) {
          setErrorMsg(data.error || 'اسم المستخدم أو كلمة المرور غير صحيحة.');
          setLoading(false);
          return;
        }
        onAdminAuthenticated(data.username || 'admin');
      } catch {
        setErrorMsg('تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Student Login Flow
    const cleanName = studentName.trim();

    if (!cleanId) {
      setErrorMsg('يرجى إدخال رقم الطالب (الرقم التدريبي أو الجامعي).');
      return;
    }

    if (!cleanName || cleanName.length < 3) {
      setErrorMsg('يرجى إدخال اسم الطالب الكامل.');
      return;
    }

    setLoading(true);
    try {
      const response = await apiFetch('/api/auth/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: cleanId,
          studentName: cleanName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.error || 'حدث خطأ أثناء التحقق من بيانات الطالب.');
        setLoading(false);
        return;
      }

      const currentQuiz: QuizDefinition = data.quiz || activeQuiz;

      if (data.status === 'already_completed' && data.submission) {
        onAlreadyCompleted(data.submission, currentQuiz);
        return;
      }

      onStartQuiz(data.studentId, data.studentName, currentQuiz);
    } catch {
      setErrorMsg('تعذر الاتصال بالخادم، يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const previewSvg =
    activeQuiz?.questions?.[0]?.svg || svgIllustrations.biosChip;
  const previewCaption =
    activeQuiz?.questions?.[0]?.caption ||
    'شريحة BIOS والموصلات القياسية على اللوحة الأم';
  const totalQuestionCount = activeQuiz?.questions?.length ?? 14;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Right Column: Unified Login Card (Student & Admin with Separate Permissions) */}
        <div className="lg:col-span-7 bg-slate-800/90 border border-slate-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between">
          <div>
            {/* Role Mode Selector */}
            <div className="flex items-center justify-between gap-3 mb-5">
              <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-2xl border border-slate-700 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleModeSwitch('student')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition whitespace-nowrap ${
                    effectiveMode === 'student'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span>دخول الطلاب (للاختبار)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleModeSwitch('admin')}
                  className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition whitespace-nowrap ${
                    effectiveMode === 'admin'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                  <span>دخول المشرف (الداشبورد)</span>
                </button>
              </div>
            </div>

            {effectiveMode === 'student' && activeQuiz && (
              <div className="text-xs text-cyan-400 font-bold mb-2">
                الكويز المتاح حالياً للتقديم · {totalQuestionCount} سؤالاً
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight mb-2.5">
              {effectiveMode === 'admin'
                ? 'تسجيل دخول المشرف للوحة التحكم وقاعدة البيانات'
                : activeQuiz?.title || 'اختبار أساسيات BIOS و UEFI وأنواع الموصلات'}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-6">
              {effectiveMode === 'admin'
                ? 'أدخل اسم المستخدم وكلمة المرور الخاصة بالمشرف لإدارة الكويزات، اختيار الكويز النشط للطلاب، واستعراض النتائج وقاعدة البيانات.'
                : activeQuiz?.description ||
                  'أدخل رقمك التدريبي أو الجامعي واسمك الكامل لبدء الاختبار التفاعلي المصور (سؤال بسؤال بدون كلمة مرور).'}
            </p>

            {errorMsg && (
              <div className="mb-5 p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-sm flex items-center gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="unifiedIdInput"
                  className="block text-sm font-bold text-slate-200 mb-2"
                >
                  {effectiveMode === 'admin'
                    ? 'اسم المستخدم (المشرف)'
                    : 'رقم الطالب (أو اسم المستخدم للمشرف)'}
                </label>
                <div className="relative">
                  {effectiveMode === 'admin' ? (
                    <ShieldCheck className="w-5 h-5 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  ) : (
                    <Hash className="w-5 h-5 text-cyan-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  )}
                  <input
                    id="unifiedIdInput"
                    type="text"
                    autoComplete="username"
                    placeholder={
                      effectiveMode === 'admin'
                        ? 'أدخل اسم المستخدم (admin)'
                        : 'مثال: 44510290'
                    }
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-2xl pr-11 pl-4 py-3.5 text-white font-mono-tabular text-base placeholder:text-slate-500 transition-colors"
                  />
                </div>
              </div>

              {effectiveMode === 'admin' ? (
                <div>
                  <label
                    htmlFor="adminPasswordInput"
                    className="block text-sm font-bold text-slate-200 mb-2"
                  >
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <KeyRound className="w-5 h-5 text-emerald-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="adminPasswordInput"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      placeholder="أدخل كلمة المرور"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-400 focus:outline-none rounded-2xl pr-11 pl-11 py-3.5 text-white font-mono-tabular text-base placeholder:text-slate-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                      title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="studentNameInput"
                    className="block text-sm font-bold text-slate-200 mb-2"
                  >
                    اسم الطالب الكامل
                  </label>
                  <div className="relative">
                    <User className="w-5 h-5 text-cyan-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      id="studentNameInput"
                      type="text"
                      autoComplete="name"
                      placeholder="أدخل اسمك الثلاثي"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-400 focus:outline-none rounded-2xl pr-11 pl-4 py-3.5 text-white text-base placeholder:text-slate-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full mt-2 py-4 px-6 rounded-2xl text-white font-extrabold text-base shadow-lg flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 ${
                  effectiveMode === 'admin'
                    ? 'bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 shadow-emerald-600/25'
                    : 'bg-gradient-to-l from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-600/25'
                }`}
              >
                {effectiveMode === 'admin' ? (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>
                      {loading ? 'جاري التحقق من صلاحيات المشرف...' : 'دخول إلى لوحة التحكم والداشبورد'}
                    </span>
                    <ArrowLeft className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <UserCheck className="w-5 h-5" />
                    <span>{loading ? 'جاري التحقق من رقم الطالب...' : 'دخول وبدء الاختبار المتاح الآن'}</span>
                    <ArrowLeft className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-700/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>بوابة موحدة بصلاحيات منفصلة (طالب / مشرف)</span>
            </span>
            <span>{totalQuestionCount} سؤالاً مصوراً · محاولة واحدة لكل كويز</span>
          </div>
        </div>

        {/* Left Column: Visual Preview & Instructions */}
        <div className="lg:col-span-5 bg-slate-800/70 border border-slate-700/80 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 mb-3">
              معاينة الكويز المتاح حالياً للطلاب
            </div>

            <div className="bg-slate-950/90 border border-slate-700/80 rounded-2xl p-3 overflow-hidden mb-5">
              <div
                className="svg-container"
                dangerouslySetInnerHTML={{ __html: previewSvg }}
              />
              <p className="text-center text-xs text-slate-400 mt-2 font-semibold">
                {previewCaption}
              </p>
            </div>

            <h2 className="text-base font-extrabold text-white mb-3">
              تعليمات البوابة الموحدة
            </h2>

            <ul className="space-y-2.5 text-sm text-slate-300 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono-tabular">01.</span>
                <span>
                  <strong className="text-white">للطلاب:</strong> أدخل رقمك التدريبي واسمك الكامل للدخول مباشرة إلى الكويز النشط ({totalQuestionCount} سؤالاً خطوة بخطوة).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono-tabular">02.</span>
                <span>
                  <strong className="text-white">للمعلم / المشرف:</strong> ادخل باسم المستخدم <code className="text-emerald-400 font-mono-tabular">admin</code> وكلمة المرور لرفع الكويزات وتحديد الكويز المتاح للطلاب.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold font-mono-tabular">03.</span>
                <span>لا تظهر صحة الإجابة أثناء الحل؛ بل تظهر الدرجة النهائية والتوضيحات العلمية فور تسليم الاختبار.</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 text-xs text-slate-400 flex items-center justify-between">
            <span>رابط موحد لجميع المستخدمين</span>
            <span className="font-mono-tabular text-cyan-400">
              {totalQuestionCount} / {totalQuestionCount} سؤالاً
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
