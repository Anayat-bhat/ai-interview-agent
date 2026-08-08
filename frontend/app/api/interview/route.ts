import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, candidate, message, endSession } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    // End session request
    if (endSession) {
      return NextResponse.json({
        reply: 'Interview completed.',
        done: true,
        feedback: {
          summary:
            'You demonstrated solid technical knowledge and communicated effectively throughout the interview. Continue improving advanced optimization concepts.',
          strengths: [
            'Strong domain fundamentals',
            'Clear technical communication',
            'Good problem solving approach',
            'Well-structured answers',
          ],
          gaps: [
            'Advanced performance tuning',
            'Testing strategies',
            'System design knowledge',
          ],
          next: [
            'Practice performance optimization',
            'Build full-stack architectural projects',
            'Learn caching techniques',
            'Solve medium-level coding scenarios',
          ],
        },
      });
    }

    // Start interview request (candidate object provided or initial turn)
    if (candidate) {
      const candidateName = candidate.name || candidate.member?.name || 'Candidate';
      return NextResponse.json({
        reply: `Welcome ${candidateName}. Let's begin your interview.`,
        done: false,
      });
    }

    // Conversation turn request (message provided)
    if (message) {
      return NextResponse.json({
        reply: `Thank you for your answer: "${message.slice(0, 60)}...". Let's move on to the next technical topic.`,
        done: false,
      });
    }

    // Default start response
    return NextResponse.json({
      reply: "Welcome. Let's begin your interview.",
      done: false,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process interview request' },
      { status: 500 }
    );
  }
}
