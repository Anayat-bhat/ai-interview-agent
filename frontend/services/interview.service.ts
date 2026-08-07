import { InterviewQuestion, InterviewSession } from '@/types/interview';

/**
 * Service for managing AI interview sessions and question fetching.
 * Placeholder implementation - no backend API connected.
 */
export const InterviewService = {
  /**
   * TODO: Implement API call to initialize a new interview session
   * POST /api/interview/start
   */
  async startInterview(candidateId: string): Promise<InterviewSession> {
    // TODO: Connect to backend API when available
    console.log('TODO: Call start interview API for candidate', candidateId);
    return {
      id: 'sess_mock_98765',
      candidateName: 'John Doe',
      technology: 'React',
      difficulty: 'Medium',
      currentQuestionIndex: 2,
      totalQuestions: 10,
      durationSeconds: 45,
      status: 'in_progress',
      topics: ['Virtual DOM', 'React Fiber', 'Custom Hooks', 'State Management'],
    };
  },

  /**
   * TODO: Implement API call to submit candidate's answer for evaluation
   * POST /api/interview/answer
   */
  async submitAnswer(questionId: string, answerText: string): Promise<{ success: boolean }> {
    // TODO: Connect to backend API when available
    console.log('TODO: Submit answer for question', questionId, answerText);
    return { success: true };
  },

  /**
   * TODO: Implement API call to fetch current or next question from LLM pipeline
   * GET /api/interview/question/:id
   */
  async getQuestion(questionId: string): Promise<InterviewQuestion | null> {
    // TODO: Connect to backend API when available
    console.log('TODO: Fetch question from API', questionId);
    return null;
  },

  /**
   * TODO: Implement API call to finalize interview and request report generation
   * POST /api/interview/end
   */
  async endInterview(sessionId: string): Promise<{ reportId: string }> {
    // TODO: Connect to backend API when available
    console.log('TODO: End interview session via API', sessionId);
    return { reportId: 'rep_mock_54321' };
  },
};
