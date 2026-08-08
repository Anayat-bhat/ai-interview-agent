/**
 * Request payload for starting an interview session.
 */
export interface StartInterviewRequest {
  candidateId: string;
  candidate?: any;
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
  feedback?: {
    summary: string;
    strengths: string[];
    gaps: string[];
    next: string[];
  };
}

/**
 * Initializes a new AI interview session for a candidate.
 *
 * @param payload - Object containing candidate details.
 * @returns Object containing the generated interview ID and the first question.
 */
export async function startInterview(
  payload: StartInterviewRequest
): Promise<StartInterviewResponse> {
  const sessionId = payload.candidateId || `sess_${Date.now()}`;
  const response = await fetch('/api/interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId,
      candidate: payload.candidate || { id: payload.candidateId, name: 'Candidate' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to start interview: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    interviewId: sessionId,
    firstQuestion: data.reply || "Welcome. Let's begin your technical interview.",
  };
}

/**
 * Sends a candidate message to the AI interviewer and returns the AI reply.
 *
 * @param payload - Object containing active interview ID and candidate message.
 * @returns Object containing the AI response reply and completion status.
 */
export async function sendMessage(
  payload: SendMessageRequest
): Promise<SendMessageResponse> {
  const response = await fetch('/api/interview', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sessionId: payload.interviewId,
      message: payload.message,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    reply: data.reply,
    isInterviewComplete: Boolean(data.done),
    feedback: data.feedback,
  };
}

