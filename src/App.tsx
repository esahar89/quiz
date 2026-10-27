/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { TopNav } from './components/TopNav';
import { StudentLoginGate } from './components/StudentLoginGate';
import { StepByStepQuiz } from './components/StepByStepQuiz';
import { StudentResultView } from './components/StudentResultView';
import { TeacherDashboard } from './components/TeacherDashboard';
import { QUIZ_QUESTIONS } from './data/questions';
import { apiFetch } from './utils/apiFallback';
import type { QuizDefinition, StudentSubmission } from './types/quiz';

const FALLBACK_QUIZ: QuizDefinition = {
  id: 'quiz-bios-uefi-1',
  title: 'اختبار BIOS و UEFI وأنواع الموصلات',
  description: 'مستوى سهل للمبتدئين · مدعم بالصور التوضيحية المباشرة (14 سؤالاً)',
  createdAt: new Date().toISOString(),
  isActive: true,
  questions: QUIZ_QUESTIONS
};

export default function App() {
  const [role, setRole] = useState<'guest' | 'student' | 'admin'>('guest');
  const [studentStage, setStudentStage] = useState<'quiz' | 'result'>('quiz');
  const [studentId, setStudentId] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [activeQuiz, setActiveQuiz] = useState<QuizDefinition>(FALLBACK_QUIZ);
  const [completedSubmission, setCompletedSubmission] = useState<StudentSubmission | null>(null);
  const [wasAlreadyCompleted, setWasAlreadyCompleted] = useState<boolean>(false);

  const refreshActiveQuizFromServer = useCallback(() => {
    apiFetch('/api/quizzes/active', { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (data?.quiz) {
          setActiveQuiz(data.quiz);
        }
      })
      .catch(() => {
        // ignore
      });
  }, []);

  // Normalize URL to single unified root path '/' and fetch active quiz on mount
  useEffect(() => {
    if (window.location.pathname !== '/' || window.location.search !== '') {
      window.history.replaceState({}, '', '/');
    }
    refreshActiveQuizFromServer();
  }, [refreshActiveQuizFromServer]);

  const handleStartQuiz = (
    verifiedId: string,
    verifiedName: string,
    quizForStudent: QuizDefinition
  ) => {
    setStudentId(verifiedId);
    setStudentName(verifiedName);
    if (quizForStudent) {
      setActiveQuiz(quizForStudent);
    }
    setWasAlreadyCompleted(false);
    setCompletedSubmission(null);
    setStudentStage('quiz');
    setRole('student');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAlreadyCompleted = (
    submission: StudentSubmission,
    quizForStudent: QuizDefinition
  ) => {
    setStudentId(submission.studentId);
    setStudentName(submission.studentName);
    if (quizForStudent) {
      setActiveQuiz(quizForStudent);
    }
    setCompletedSubmission(submission);
    setWasAlreadyCompleted(true);
    setStudentStage('result');
    setRole('student');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminAuthenticated = (username: string) => {
    setAdminUsername(username);
    setRole('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizSubmitted = (submission: StudentSubmission) => {
    setCompletedSubmission(submission);
    setWasAlreadyCompleted(false);
    setStudentStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setRole('guest');
    setStudentId('');
    setStudentName('');
    setAdminUsername('');
    setCompletedSubmission(null);
    setWasAlreadyCompleted(false);
    setStudentStage('quiz');
    refreshActiveQuizFromServer();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sessionLabel =
    role === 'admin'
      ? adminUsername
      : role === 'student'
      ? `${studentName} (${studentId})`
      : null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <TopNav
        role={role}
        sessionLabel={sessionLabel}
        activeQuizTitle={activeQuiz.title}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        {role === 'guest' && (
          <StudentLoginGate
            initialActiveQuiz={activeQuiz}
            onActiveQuizLoaded={setActiveQuiz}
            onStartQuiz={handleStartQuiz}
            onAlreadyCompleted={handleAlreadyCompleted}
            onAdminAuthenticated={handleAdminAuthenticated}
          />
        )}

        {role === 'admin' && (
          <TeacherDashboard onActiveQuizChanged={setActiveQuiz} />
        )}

        {role === 'student' && (
          <>
            {studentStage === 'quiz' && (
              <StepByStepQuiz
                key={activeQuiz.id}
                studentId={studentId}
                studentName={studentName}
                quiz={activeQuiz}
                onQuizSubmitted={handleQuizSubmitted}
              />
            )}

            {studentStage === 'result' && completedSubmission && (
              <StudentResultView
                key={activeQuiz.id}
                submission={completedSubmission}
                quiz={activeQuiz}
                wasAlreadyCompleted={wasAlreadyCompleted}
                onExitStudentSession={handleLogout}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
