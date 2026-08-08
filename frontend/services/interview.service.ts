import { InterviewQuestion, InterviewSession } from '@/types/interview';

/**
 * Service for managing AI interview sessions and question fetching via POST /api/interview.
 */
export const InterviewService = {
  /**
   * Initializes a new interview session via POST /api/interview
   */
  async startInterview(candidateId: string, candidateData?: any): Promise<InterviewSession> {
    const sessionId = candidateId || `sess_${Date.now()}`;
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        candidate: candidateData || { id: candidateId, name: 'Candidate' },
      }),
    });

    const data = await res.json();

    return {
      id: sessionId,
      candidateName: candidateData?.name || candidateData?.member?.name || 'Candidate',
      technology: candidateData?.technology || 'Software Engineering',
      difficulty: candidateData?.difficulty || 'Medium',
      currentQuestionIndex: 0,
      totalQuestions: 3,
      durationSeconds: 60,
      status: 'in_progress',
      topics: ['System Design', 'Algorithms', 'Core Fundamentals'],
    };
  },

  /**
   * Submits candidate's answer for evaluation via POST /api/interview
   */
  async submitAnswer(sessionId: string, messageText: string): Promise<{ reply: string; done: boolean; feedback?: any }> {
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        message: messageText,
      }),
    });

    return await res.json();
  },

  /**
   * Finalizes interview and requests report generation via POST /api/interview
   */
  async endInterview(sessionId: string): Promise<{ reply: string; done: boolean; feedback?: any }> {
    const res = await fetch('/api/interview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId,
        endSession: true,
      }),
    });

    return await res.json();
  },
};

