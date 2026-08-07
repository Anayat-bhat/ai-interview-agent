export type MessageSender = 'ai' | 'candidate';

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  timestamp: string;
}

export interface ChatSession {
  candidateId?: number;
  candidateName: string;
  candidateRole: string;
  currentQuestionNumber: number;
  totalQuestions: number;
  status: 'active' | 'completed' | 'paused';
}
