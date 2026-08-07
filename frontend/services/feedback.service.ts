import { InterviewReport } from '@/types/feedback';

/**
 * Service for fetching interview feedback and report analytics.
 * Placeholder implementation - no backend API connected.
 */
export const FeedbackService = {
  /**
   * TODO: Implement API call to fetch full feedback report by report ID
   * GET /api/feedback/:reportId
   */
  async getReport(reportId: string): Promise<InterviewReport | null> {
    // TODO: Connect to backend API when available
    console.log('TODO: Fetch feedback report from API with ID', reportId);
    return null;
  },

  /**
   * TODO: Implement API call to download PDF export of report
   * GET /api/feedback/:reportId/export
   */
  async exportReportPdf(reportId: string): Promise<{ downloadUrl: string }> {
    // TODO: Connect to backend API when available
    console.log('TODO: Export PDF for report ID', reportId);
    return { downloadUrl: '#' };
  },
};
