import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, Eye, EyeOff, LogOut, Clock, ShieldAlert } from 'lucide-react';
import { ARABIC_LETTERS, evaluateGrade } from '../data/questions';
import type { QuizDefinition, StudentSubmission } from '../types/quiz';

interface StudentResultViewProps {
  submission: StudentSubmission;
  quiz: QuizDefinition;
  wasAlreadyCompleted: boolean;
  onExitStudentSession: () => void;
}

export const StudentResultView: React.FC<StudentResultViewProps> = ({
  submission,
  quiz,
  wasAlreadyCompleted,
  onExitStudentSession
}) => {
  const [showReview, setShowReview] = useState(false);
  const { feedback } = evaluateGrade(submission.percentage);
  const questions = quiz.questions;

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const rem = sec % 60;
    if (mins === 0) return `${rem} ثانية`;
    return `${mins} دقيقة و ${rem} ثانية`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {wasAlreadyCompleted && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-950/70 border border-amber-500/40 text-amber-200 text-sm flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-extrabold block text-amber-300">
              تم تأدية هذا الكويز مسبقاً برقم الطالب ({submission.studentId})
            </span>
            <span>
              يُسمح بمحاولة واحدة فقط لكل طالب في نفس الكويز. يمكنك أدناه الاطلاع على نتيجتك المسجلة في قاعدة البيانات ومراجعة إجاباتك.
            </span>
          </div>
        </div>
      )}

      {/* Final Score Card */}
      <div className="bg-gradient-to-b from-slate-800 to-slate-900 border-2 border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center">
          <Award className="w-9 h-9 text-emerald-400" />
        </div>

        <div className="text-xs text-cyan-400 font-bold mb-1">
          {submission.quizTitle || quiz.title} · تم حفظ النتيجة في قاعدة البيانات
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
          النتيجة النهائية للطالب: {submission.studentName}
        </h2>

        <p className="text-slate-300 mb-6 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          {feedback}
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-6">
          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">رقم الطالب</span>
            <span className="text-lg sm:text-xl font-extrabold text-white font-mono-tabular">
              {submission.studentId}
            </span>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">الدرجة النهائية</span>
            <span className="text-lg sm:text-xl font-extrabold text-cyan-400 font-mono-tabular">
              {submission.score} / {submission.totalQuestions}
            </span>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">النسبة المئوية</span>
            <span className="text-lg sm:text-xl font-extrabold text-emerald-400 font-mono-tabular">
              {submission.percentage}%
            </span>
          </div>

          <div className="bg-slate-900/90 p-3.5 rounded-2xl border border-slate-700">
            <span className="text-xs text-slate-400 block mb-1">التقييم</span>
            <span className="text-base sm:text-lg font-extrabold text-amber-400">
              {submission.grade}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 text-xs text-slate-400 mb-6">
          <span className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>الزمن المستغرق: {formatDuration(submission.durationSeconds)}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular">
            {new Date(submission.submittedAt).toLocaleString('ar-SA')}
          </span>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => setShowReview((prev) => !prev)}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            {showReview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>
              {showReview
                ? 'إخفاء مراجعة الإجابات والتوضيحات'
                : 'مراجعة إجاباتك والتوضيحات العلمية'}
            </span>
          </button>

          <button
            type="button"
            onClick={onExitStudentSession}
            className="px-5 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold transition flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <LogOut className="w-4 h-4" />
            <span>خروج لبوابة طالب جديد</span>
          </button>
        </div>
      </div>

      {/* Detailed Post-Submission Answer Review */}
      {showReview && (
        <div className="mt-8 space-y-6">
          <h3 className="text-xl font-extrabold text-white">
            مراجعة الإجابات والتوضيحات العلمية ({questions.length} سؤالاً)
          </h3>

          {questions.map((q, idx) => {
            const ansRecord = submission.answers.find((a) => a.questionId === q.id);
            const selectedIdx = ansRecord ? ansRecord.selectedOption : -1;
            const isCorrect = selectedIdx === q.correct;

            return (
              <div
                key={q.id}
                className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-xl"
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="text-cyan-300 font-extrabold text-sm">
                    السؤال <span className="font-mono-tabular">{idx + 1}</span> من{' '}
                    <span className="font-mono-tabular">{questions.length}</span>
                  </span>

                  {isCorrect ? (
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>إجابة صحيحة</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" />
                      <span>إجابة خاطئة</span>
                    </span>
                  )}
                </div>

                <h4 className="text-lg font-extrabold text-white leading-relaxed mb-4">
                  {q.question}
                </h4>

                {q.svg && (
                  <div className="mb-5 bg-slate-950/90 border border-slate-700/80 rounded-2xl p-3 overflow-hidden">
                    <div
                      className="svg-container"
                      dangerouslySetInnerHTML={{ __html: q.svg }}
                    />
                    <p className="text-center text-xs text-slate-400 mt-2 font-semibold">
                      رسم توضيحي مباشر: {q.caption}
                    </p>
                  </div>
                )}

                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    const isRightOption = optIdx === q.correct;
                    const isStudentChoice = optIdx === selectedIdx;

                    let btnStyle = 'bg-slate-900/40 border-slate-800 text-slate-400';
                    let letterStyle = 'bg-slate-800 text-slate-400 border-slate-700';

                    if (isRightOption) {
                      btnStyle =
                        'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-bold';
                      letterStyle = 'bg-emerald-500 text-slate-950 border-emerald-400';
                    } else if (isStudentChoice && !isRightOption) {
                      btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                      letterStyle = 'bg-rose-500 text-white border-rose-400';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`w-full text-right p-3.5 rounded-2xl border-2 flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3.5">
                          <span
                            className={`w-8 h-8 rounded-xl border flex items-center justify-center font-extrabold text-sm shrink-0 ${letterStyle}`}
                          >
                            {ARABIC_LETTERS[optIdx]}
                          </span>
                          <span className="text-sm sm:text-base">{opt}</span>
                        </div>

                        {isRightOption && (
                          <span className="text-xs font-extrabold text-emerald-400 whitespace-nowrap shrink-0">
                            الإجابة الصحيحة ✓
                          </span>
                        )}
                        {isStudentChoice && !isRightOption && (
                          <span className="text-xs font-extrabold text-rose-400 whitespace-nowrap shrink-0">
                            اختيارك ✕
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-5 p-4 rounded-2xl bg-slate-900/95 border border-slate-700/80 text-sm leading-relaxed">
                  <div
                    className={`font-extrabold mb-1 ${
                      isCorrect ? 'text-emerald-400' : 'text-amber-400'
                    }`}
                  >
                    التوضيح العلمي:
                  </div>
                  <p className="text-slate-300">{q.explanation}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
