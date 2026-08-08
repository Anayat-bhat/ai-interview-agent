/**
 * Request payload for starting an interview session.
 */
export interface StartInterviewRequest {
  candidateId: string;
}

/**
 * Response payload returned after starting an interview session.
 */
export interface StartInterviewResponse {
  interviewId: string;
  firstQuestion: string;
}

/**
 * Request payload for sending a message during an active interview session.
 */
export interface SendMessageRequest {
  interviewId: string;
  message: string;
}

/**
 * Response payload returned after sending a message during an active interview session.
 */
export interface SendMessageResponse {
  reply: string;
  isInterviewComplete: boolean;
}

/**
 * Initializes a new AI interview session for a candidate.
 *
 * @param payload - Object containing the candidate ID.
 * @returns Object containing the generated interview ID and the first question.
 * @throws Error("Not implemented")
 */
export async function startInterview(
  payload: StartInterviewRequest
): Promise<StartInterviewResponse> {
  throw new Error("Not implemented");
}

/**
 * Sends a candidate message to the AI interviewer and returns the AI reply.
 *
 * @param payload - Object containing the active interview ID and the candidate message.
 * @returns Object containing the AI response reply and completion status.
 * @throws Error("Not implemented")
 */
export async function sendMessage(
  payload: SendMessageRequest
): Promise<SendMessageResponse> {
  throw new Error("Not implemented");
}
