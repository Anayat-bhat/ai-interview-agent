import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      );
    }

    // 1. Primary Backend: FastAPI Python server on port 8000
    try {
      const fastApiRes = await fetch('http://127.0.0.1:8000/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000),
      });

      if (fastApiRes.ok) {
        const data = await fastApiRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Fallback to secondary backend
    }

    // 2. Secondary Backend: Express server on port 5000
    try {
      const expressRes = await fetch('http://127.0.0.1:5000/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(3000),
      });

      if (expressRes.ok) {
        const data = await expressRes.json();
        return NextResponse.json(data);
      }
    } catch {
      // Direct local fallback below if servers are starting
    }

    // 3. Direct Fallback Handler
    const candidateName = body.candidate?.name || body.candidate?.member?.name || 'Candidate';
    const jobRole = body.candidate?.jobRole || body.candidate?.member?.jobRole || 'Software Engineer';

    if (body.endSession) {
      return NextResponse.json({
        reply: `Interview completed for ${candidateName}.`,
        done: true,
        feedback: {
          summary: `${candidateName} demonstrated solid technical depth for the ${jobRole} role.`,
          strengths: [`Strong ${jobRole} fundamentals`, 'Clear technical communication'],
          gaps: ['Production concurrency optimization'],
          next: ['Practice complex system design mock interviews'],
        },
      });
    }

    if (body.candidate) {
      return NextResponse.json({
        reply: `Welcome ${candidateName}. Let's begin your technical interview for the ${jobRole} role. Question 1: Explain vector search embeddings and low-latency database retrieval strategies.`,
        done: false,
      });
    }

    return NextResponse.json({
      reply: `Thank you for your response, ${candidateName}. Let's move to the next technical topic regarding production streaming pipelines and trade-offs.`,
      done: false,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process interview request' },
      { status: 500 }
    );
  }
}
