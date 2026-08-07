export type ScoreCategory = 'technical' | 'communication' | 'problemSolving' | 'confidence';

export interface Score {
  category: ScoreCategory;
  title: string;
  score: number; // 0 - 100
  maxScore: number;
  description: string;
}

export interface Feedback {
  overallScore: number;
  summary: string;
  aiDetailedFeedback: string;
  scores: Score[];
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: string[];
}

export interface InterviewReport {
  id: string;
  interviewId: string;
  candidateName: string;
  technology: string;
  difficulty: string;
  completedAt: string;
  feedback: Feedback;
}
