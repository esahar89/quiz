export interface QuizQuestion {
  id: number;
  question: string;
  svg: string;
  caption: string;
  options: [string, string, string, string];
  correct: number; // 0 = أ, 1 = ب, 2 = ج, 3 = د
  explanation: string;
}

export interface QuizDefinition {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  isActive: boolean;
  questions: QuizQuestion[];
}

export interface StudentAnswerRecord {
  questionId: number;
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
}

export interface StudentSubmission {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  grade: string;
  durationSeconds: number;
  answers: StudentAnswerRecord[];
  submittedAt: string;
}

export interface DatabaseColumnSchema {
  name: string;
  type: string;
  constraints: string;
  description: string;
}

export interface DatabaseMetadata {
  engine: string;
  tableName: string;
  storageFile: string;
  fileSizeBytes: number;
  totalRecords: number;
  totalQuizzes: number;
  lastUpdated: string;
  columns: DatabaseColumnSchema[];
}

export interface QuestionAnalyticsItem {
  questionId: number;
  questionText: string;
  correctOptionIndex: number;
  totalAttempts: number;
  correctCount: number;
  correctRate: number;
  optionCounts: [number, number, number, number];
}

export interface DashboardPayload {
  quizzes: QuizDefinition[];
  activeQuizId: string;
  selectedQuizId: string;
  submissions: StudentSubmission[];
  stats: {
    totalStudents: number;
    averageScore: number;
    maxPossibleScore: number;
    averagePercentage: number;
    passRate: number;
    highestScore: number;
    lowestScore: number;
    averageDurationSeconds: number;
  };
  questionAnalytics: QuestionAnalyticsItem[];
  dbMetadata: DatabaseMetadata;
}
