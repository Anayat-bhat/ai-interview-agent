import { Difficulty, Technology } from './candidate';

export interface InterviewQuestion {
  id: string;
  questionNumber: number;
  totalQuestions: number;
  title: string;
  description: string;
  category: string;
  difficulty: Difficulty;
  timeLimitSeconds: number;
}

export interface InterviewSession {
  id: string;
  candidateName: string;
  technology: Technology;
  difficulty: Difficulty;
  currentQuestionIndex: number;
  totalQuestions: number;
  durationSeconds: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  topics: string[];
}

export interface QuestionProgress {
  current: number;
  total: number;
  answeredCount: number;
}
