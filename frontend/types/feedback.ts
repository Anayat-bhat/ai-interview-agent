export interface Feedback {
  summary: string;
  strengths: string[];
  gaps: string[];
  next: string[];
  score?: number;
  nextSteps?: string[];
}

export type ScoreCategory = 'technical' | 'communication' | 'problemSolving' | 'confidence';

export interface Score {
  category: ScoreCategory;
  title: string;
  score: number; // 0 - 100
  maxScore: number;
  description: string;
}

export interface DetailedFeedback {
  overallScore?: number;
  summary: string;
  aiDetailedFeedback?: string;
  scores?: Score[];
  strengths: string[];
  weaknesses?: string[];
  gaps?: string[];
  next?: string[];
  nextSteps?: string[];
  recommendedTopics?: string[];
}

export interface InterviewReport {
  id: string;
  interviewId: string;
  candidateName: string;
  technology: string;
  difficulty: string;
  completedAt: string;
  feedback: Feedback | DetailedFeedback;
}
