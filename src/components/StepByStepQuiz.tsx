import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Send, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ARABIC_LETTERS } from '../data/questions';
import type { QuizDefinition, StudentSubmission } from '../types/quiz';

interface StepByStepQuizProps {
  studentId: string;
  studentName: string;
  quiz: QuizDefinition;
  onQuizSubmitted: (submission: StudentSubmission) => void;
}

export const StepByStepQuiz: React.FC<StepByStepQuizProps> = ({
  studentId,
  studentName,
  quiz,
  onQuizSubmitted
}) => {
  const questions = quiz.questions;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<(number | null)[]>(
    () => new Array(questions.length).fill(null)
  );
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const currentQuestion = questions[currentIndex];
  const answeredCount = selectedOptions.filter((ans) => ans !== null).length;
  const totalQuestions = questions.length;
  const progressPercent = Math.round((answeredCount / totalQuestions) * 100);
  const allAnswered = answeredCount === totalQuestions;

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remSec = sec % 60;
    return `${String(mins).padStart(2, '0')}:${String(remSec).padStart(2, '0')}`;
  };

  const handleSelectOption = (optionIdx: number) => {
    setSubmitError(null);
    setSelectedOptions((prev) => {
      const updated = [...prev];
      updated[currentIndex] = optionIdx;
      return updated;
    });
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmitFinal = async () => {
    const firstUnanswered = selectedOptions.findIndex((ans) => ans === null);
    if (firstUnanswered !== -1) {
      setCurrentIndex(firstUnanswered);
      setSubmitError(
        `يرجى الإجابة على السؤال رقم ${firstUnanswered + 1} أولاً لإتمام جميع الأسئلة الـ ${totalQuestions}.`
      );
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          studentName,
          quizId: quiz.id,
          selectedOptions: selectedOptions as number[],
          durationSeconds: Math.max(1, elapsedSeconds)
        })
      });

      const data = await response.json();
      if (!response.ok) {
        setSubmitError(data.error || 'حدث خطأ أثناء حفظ الإجابات.');
        setSubmitting(false);
        return;
      }

      onQuizSubmitted(data.submission);
    } catch {
      setSubmitError('تعذر الاتصال بالخادم لتسليم الاختبار، يرجى المحاولة مرة أخرى.');
      setSubmitting(false);
    }
  };

  const selectedForCurrent = selectedOptions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Student Session & Progress Header Bar */}
      <div className="bg-slate-800/85 border border-slate-700/80 rounded-2xl p-4 mb-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">الكويز الحالي</span>
              <span className="font-extrabold text-cyan-300">{quiz.title}</span>
            </div>
            <div className="h-7 w-px bg-slate-700 hidden sm:block" />
            <div>
              <span className="text-xs text-slate-400 block">اسم الطالب</span>
              <span className="font-extrabold text-white">{studentName}</span>
            </div>
            <div className="h-7 w-px bg-slate-700 hidden sm:block" />
            <div>
              <span className="text-xs text-slate-400 block">رقم الطالب</span>
              <span className="font-mono-tabular font-bold text-cyan-400">{studentId}</span>
            </div>
            <div className="h-7 w-px bg-slate-700 hidden sm:block" />
            <div>
              <span className="text-xs text-slate-400 block">الأسئلة المجابة</span>
              <span className="font-mono-tabular font-extrabold text-emerald-400">
                {answeredCount} / {totalQuestions}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs sm:text-sm font-mono-tabular text-slate-300 bg-slate-900/90 px-3.5 py-2 rounded-xl border border-slate-700">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span>{formatTimer(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-700 mb-3">
          <div
            className="bg-gradient-to-l from-cyan-400 to-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Question Stepper Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = selectedOptions[idx] !== null;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg font-mono-tabular text-xs font-bold shrink-0 transition-all border ${
                  isCurrent
                    ? 'bg-blue-600 text-white border-cyan-400 shadow-md shadow-blue-600/30'
                    : isAnswered
                    ? 'bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-slate-800'
                    : 'bg-slate-900/60 text-slate-400 border-slate-700 hover:text-white'
                }`}
                title={`الانتقال إلى السؤال ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {submitError && (
        <div className="mb-5 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/60 text-rose-200 text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      {/* Single Question Card (Step-by-Step) */}
      <div className="bg-slate-800/90 border border-slate-700 rounded-3xl p-5 sm:p-7 shadow-xl transition-all">
        {/* Question Header */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="text-cyan-300 font-extrabold text-sm">
            السؤال <span className="font-mono-tabular">{currentIndex + 1}</span> من{' '}
            <span className="font-mono-tabular">{totalQuestions}</span>
          </span>
          <span
            className={`text-xs font-bold ${
              selectedForCurrent !== null ? 'text-cyan-400' : 'text-slate-400'
            }`}
          >
            {selectedForCurrent !== null
              ? `تم اختيار الإجابة (${ARABIC_LETTERS[selectedForCurrent]})`
              : 'بانتظار اختيار الإجابة'}
          </span>
        </div>

        {/* Question Text */}
        <h2 className="text-lg sm:text-xl font-extrabold text-white leading-relaxed mb-4">
          {currentQuestion.question}
        </h2>

        {/* Direct Embedded SVG Illustration */}
        {currentQuestion.svg && (
          <div className="mb-5 bg-slate-950/90 border border-slate-700/80 rounded-2xl p-3 overflow-hidden shadow-inner">
            <div
              className="svg-container"
              dangerouslySetInnerHTML={{ __html: currentQuestion.svg }}
            />
            <p className="text-center text-xs text-slate-400 mt-2 font-semibold">
              رسم توضيحي مباشر: {currentQuestion.caption}
            </p>
          </div>
        )}

        {/* 4 Options List */}
        <div className="space-y-3">
          {currentQuestion.options.map((optText, optIdx) => {
            const isSelected = selectedForCurrent === optIdx;

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(optIdx)}
                className={`option-btn w-full text-right p-3.5 sm:p-4 rounded-2xl border-2 flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'bg-blue-950/80 border-cyan-400 text-white font-bold shadow-lg shadow-blue-950/50'
                    : 'bg-slate-900/80 hover:bg-slate-900 border-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-xl border flex items-center justify-center font-extrabold text-sm shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-cyan-400 text-slate-950 border-cyan-300'
                        : 'bg-slate-800 text-cyan-400 border-slate-600'
                    }`}
                  >
                    {ARABIC_LETTERS[optIdx]}
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{optText}</span>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Navigation Controls */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 font-bold text-slate-200 disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 transition whitespace-nowrap shrink-0"
        >
          <ChevronRight className="w-5 h-5" />
          <span>السؤال السابق</span>
        </button>

        <span className="text-sm font-bold text-slate-400 font-mono-tabular">
          سؤال {currentIndex + 1} من {totalQuestions}
        </span>

        {currentIndex < totalQuestions - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 transition whitespace-nowrap shrink-0"
          >
            <span>السؤال التالي</span>
            <ChevronLeft className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmitFinal}
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 font-extrabold text-white shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition whitespace-nowrap shrink-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'جاري حفظ النتيجة...' : 'اعتماد وتسليم الاختبار'}</span>
          </button>
        )}
      </div>

      {/* Persistent Submit Banner when all questions are answered */}
      {allAnswered && currentIndex < totalQuestions - 1 && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-emerald-200 font-bold">
            لقد أجبت على جميع الأسئلة الـ {totalQuestions}. يمكنك مراجعة إجاباتك أو تسليم الاختبار الآن لإظهار النتيجة النهائية.
          </div>
          <button
            type="button"
            onClick={handleSubmitFinal}
            disabled={submitting}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm flex items-center gap-2 transition whitespace-nowrap shrink-0"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'جاري التسليم...' : 'اعتماد وتسليم الاختبار النهائي'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
