import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  getDocFromServer,
  setDoc,
  getDocs,
  deleteDoc,
  collection
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import type { QuizDefinition, StudentSubmission } from './types/quiz';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email
        })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error('Please check your Firebase configuration.');
    }
  }
}

testConnection();

function sanitizeDocId(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 64) || 'doc_default';
}

export async function saveSubmissionToCloud(submission: StudentSubmission): Promise<void> {
  const docId = sanitizeDocId(`${submission.quizId}_${submission.studentId}`);
  const path = `student_submissions/${docId}`;
  try {
    await setDoc(doc(db, 'student_submissions', docId), {
      id: String(submission.id).slice(0, 64),
      quizId: String(submission.quizId).slice(0, 64),
      quizTitle: String(submission.quizTitle).slice(0, 200),
      studentId: String(submission.studentId).slice(0, 64),
      studentName: String(submission.studentName).slice(0, 160),
      score: Number(submission.score) || 0,
      totalQuestions: Number(submission.totalQuestions) || 1,
      percentage: Math.min(100, Math.max(0, Number(submission.percentage) || 0)),
      grade: String(submission.grade).slice(0, 48),
      durationSeconds: Math.max(0, Number(submission.durationSeconds) || 0),
      answersJson: JSON.stringify(submission.answers || []).slice(0, 50000),
      submittedAt: String(submission.submittedAt || new Date().toISOString()).slice(0, 64)
    });
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.WRITE, path);
    } catch {
      // Non-fatal fallback so student UI continues smoothly
    }
  }
}

export async function fetchAllCloudSubmissions(): Promise<StudentSubmission[]> {
  const path = 'student_submissions';
  try {
    const snap = await getDocs(collection(db, 'student_submissions'));
    const results: StudentSubmission[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      let parsedAnswers = [];
      try {
        parsedAnswers = JSON.parse(d.answersJson || '[]');
      } catch {
        parsedAnswers = [];
      }
      results.push({
        id: d.id || docSnap.id,
        quizId: d.quizId,
        quizTitle: d.quizTitle,
        studentId: d.studentId,
        studentName: d.studentName,
        score: Number(d.score) || 0,
        totalQuestions: Number(d.totalQuestions) || 1,
        percentage: Number(d.percentage) || 0,
        grade: d.grade || 'مقبول',
        durationSeconds: Number(d.durationSeconds) || 60,
        answers: parsedAnswers,
        submittedAt: d.submittedAt || new Date().toISOString()
      });
    });
    return results.sort(
      (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
    );
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      return [];
    }
  }
}

export async function deleteSubmissionFromCloud(
  submissionIdOrStudentId: string,
  allSubmissions: StudentSubmission[]
): Promise<void> {
  const matched = allSubmissions.find(
    (s) =>
      s.id === submissionIdOrStudentId ||
      s.studentId.toLowerCase() === submissionIdOrStudentId.toLowerCase()
  );
  if (matched) {
    const docId = sanitizeDocId(`${matched.quizId}_${matched.studentId}`);
    try {
      await deleteDoc(doc(db, 'student_submissions', docId));
    } catch {
      // ignore
    }
  }
  const directId = sanitizeDocId(submissionIdOrStudentId);
  try {
    await deleteDoc(doc(db, 'student_submissions', directId));
  } catch {
    // ignore
  }
}

export async function saveActiveQuizIdToCloud(activeQuizId: string): Promise<void> {
  try {
    await setDoc(doc(db, 'platform_state', 'config'), {
      activeQuizId: String(activeQuizId).slice(0, 64),
      updatedAt: new Date().toISOString()
    });
  } catch {
    // ignore
  }
}

export async function fetchActiveQuizIdFromCloud(): Promise<string | null> {
  try {
    const snap = await getDoc(doc(db, 'platform_state', 'config'));
    if (snap.exists()) {
      return snap.data()?.activeQuizId || null;
    }
  } catch {
    // ignore
  }
  return null;
}

export async function saveCustomQuizToCloud(quiz: QuizDefinition): Promise<void> {
  const docId = sanitizeDocId(quiz.id);
  try {
    await setDoc(doc(db, 'quizzes', docId), {
      id: String(quiz.id).slice(0, 64),
      title: String(quiz.title).slice(0, 200),
      description: String(quiz.description || 'اختبار تفاعلي').slice(0, 500),
      createdAt: String(quiz.createdAt || new Date().toISOString()).slice(0, 64),
      isActive: Boolean(quiz.isActive),
      questionsJson: JSON.stringify(quiz.questions || []).slice(0, 800000)
    });
  } catch {
    // ignore
  }
}

export async function fetchCloudQuizzes(): Promise<QuizDefinition[]> {
  try {
    const snap = await getDocs(collection(db, 'quizzes'));
    const quizzes: QuizDefinition[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      try {
        const questions = JSON.parse(d.questionsJson || '[]');
        if (Array.isArray(questions) && questions.length > 0) {
          quizzes.push({
            id: d.id || docSnap.id,
            title: d.title,
            description: d.description || '',
            createdAt: d.createdAt || new Date().toISOString(),
            isActive: Boolean(d.isActive),
            questions
          });
        }
      } catch {
        // skip malformed
      }
    });
    return quizzes;
  } catch {
    return [];
  }
}
