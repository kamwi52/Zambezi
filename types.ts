export type GradeLevel = 8 | 9 | 10 | 11 | 12;

export interface Subject {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  color: string;
  topics: string[];
}

export interface UserProgress {
  grade: GradeLevel;
  completedQuizzes: number;
  averageScore: number;
  streakDays: number;
  subjectMastery: Record<string, number>; // subjectId -> percentage
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  subjectId: string;
  date: Date;
}
