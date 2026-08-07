import { Candidate } from '@/types/candidate';

/**
 * Service for candidate information management.
 * Placeholder implementation - no backend API connected.
 */
export const CandidateService = {
  /**
   * TODO: Implement API call to save candidate details
   * POST /api/candidate
   */
  async saveCandidate(candidate: Candidate): Promise<{ success: boolean; candidateId: string }> {
    // TODO: Connect to backend API when available
    console.log('TODO: Submit candidate info to API', candidate);
    return {
      success: true,
      candidateId: 'cand_mock_12345',
    };
  },

  /**
   * TODO: Implement API call to fetch current candidate details
   * GET /api/candidate/:id
   */
  async getCandidate(candidateId: string): Promise<Candidate | null> {
    // TODO: Connect to backend API when available
    console.log('TODO: Fetch candidate from API with ID', candidateId);
    return null;
  },
};
