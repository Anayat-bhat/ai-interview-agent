import { NextRequest, NextResponse } from 'next/server';

interface SessionData {
  sessionId: string;
  candidateName: string;
  jobRole: string;
  technology: string;
  answers: string[];
  currentTurn: number;
}

const sessions = new Map<string, SessionData>();

const ROLE_QUESTIONS: Record<string, Array<{ title: string; description: string }>> = {
  'Senior Data Engineer': [
    {
      title: 'Embeddings & Vector Indexing',
      description: 'Explain how vector embeddings are generated, stored in vector databases (e.g. Pinecone/Chroma), and indexed for fast similarity search.',
    },
    {
      title: 'Data Pipeline Scaling & Backpressure',
      description: 'How do you handle stream processing backpressure and schema evolution in high-throughput Kafka / Spark pipelines?',
    },
    {
      title: 'Retrieval & Matching Engine Design',
      description: 'Describe your approach to designing a low-latency hybrid search engine combining BM25 keyword matching with dense vector retrieval.',
    },
  ],
  'AI Engineer': [
    {
      title: 'RAG Architecture & Context Window Optimization',
      description: 'How do you structure an end-to-end RAG system to minimize hallucination and stay within context length limits?',
    },
    {
      title: 'Multi-Agent Orchestration & Tool Calling',
      description: 'Explain how to coordinate multiple autonomous agents using structured function calling and Model Context Protocol (MCP).',
    },
    {
      title: 'Model Fine-Tuning vs In-Context Prompt Engineering',
      description: 'When would you choose LoRA/PEFT fine-tuning over advanced prompt engineering and chain-of-thought prompting?',
    },
  ],
  'Backend Software Engineer': [
    {
      title: 'Node.js Event Loop & Non-Blocking I/O',
      description: 'Explain the phases of the Node.js event loop and how worker threads handle CPU-bound workloads.',
    },
    {
      title: 'Microservices Communication & Distributed Caching',
      description: 'Compare gRPC, HTTP REST, and Redis caching strategies for high-concurrency microservice architectures.',
    },
    {
      title: 'Database Sharding & Transaction Isolation',
      description: 'How do ACID guarantees and isolation levels work in distributed relational databases under heavy write loads?',
    },
  ],
  default: [
    {
      title: 'React Architecture & Virtual DOM Reconciliation',
      description: 'Explain how the Virtual DOM diffing algorithm minimizes reflows and improves UI rendering efficiency.',
    },
    {
      title: 'State Management & Custom Hooks',
      description: 'How do custom React hooks encapsulate complex state logic and prevent unnecessary component re-renders?',
    },
    {
      title: 'API Integration & Performance Optimization',
      description: 'Discuss best practices for async data fetching, caching, and error boundaries in modern web applications.',
    },
  ],
};

function getQuestionsForRole(jobRole?: string) {
  if (!jobRole) return ROLE_QUESTIONS.default;
  const match = Object.keys(ROLE_QUESTIONS).find((role) =>
    jobRole.toLowerCase().includes(role.toLowerCase())
  );
  return match ? ROLE_QUESTIONS[match] : ROLE_QUESTIONS.default;
}

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

    let session = sessions.get(sessionId);

    // 1. End Interview Request
    if (endSession || (session && session.currentTurn >= 3)) {
      const candidateName = session?.candidateName || candidate?.name || candidate?.member?.name || 'Candidate';
      const jobRole = session?.jobRole || candidate?.jobRole || candidate?.member?.jobRole || 'Engineer';
      const answersCount = session?.answers.length || 1;

      return NextResponse.json({
        reply: `Interview completed for ${candidateName}.`,
        done: true,
        feedback: {
          summary: `${candidateName} demonstrated strong technical knowledge for the ${jobRole} role, providing ${answersCount} detailed answers during the automated evaluation session.`,
          strengths: [
            `Solid fundamentals in ${jobRole} core principles`,
            'Clear and structured technical communication',
            'Methodical approach to system trade-offs',
            'Good understanding of architectural best practices',
          ],
          gaps: [
            'Deep dive into edge-case error recovery',
            'Advanced production telemetry and monitoring',
            'Distributed system failover strategies',
          ],
          next: [
            'Practice complex system design mock interviews',
            'Build full-stack microservice projects',
            'Study advanced performance profiling techniques',
            'Explore multi-agent orchestration frameworks',
          ],
        },
      });
    }

    // 2. Start Interview Request
    if (candidate || !session) {
      const candidateName = candidate?.name || candidate?.member?.name || 'Candidate';
      const jobRole = candidate?.jobRole || candidate?.member?.jobRole || candidate?.role || 'Software Engineer';
      
      session = {
        sessionId,
        candidateName,
        jobRole,
        technology: candidate?.technology || 'Software Engineering',
        answers: [],
        currentTurn: 0,
      };
      sessions.set(sessionId, session);

      const questions = getQuestionsForRole(jobRole);
      const firstQ = questions[0];

      return NextResponse.json({
        reply: `Welcome ${candidateName}. Let's begin your technical interview for the ${jobRole} role. Question 1: ${firstQ.title} - ${firstQ.description}`,
        done: false,
      });
    }

    // 3. Conversation Turn Request (Candidate message provided)
    if (message) {
      session.answers.push(message);
      session.currentTurn += 1;

      const questions = getQuestionsForRole(session.jobRole);

      if (session.currentTurn < questions.length) {
        const nextQ = questions[session.currentTurn];
        return NextResponse.json({
          reply: `Thank you for your answer. Let's move to Question ${session.currentTurn + 1}: ${nextQ.title} - ${nextQ.description}`,
          done: false,
        });
      } else {
        // Automatically finish when all questions are answered
        return NextResponse.json({
          reply: `Thank you for completing all technical questions, ${session.candidateName}. Generating your final feedback report.`,
          done: true,
          feedback: {
            summary: `${session.candidateName} completed all evaluation questions for the ${session.jobRole} role with solid technical depth and clear articulation.`,
            strengths: [
              `Strong domain proficiency in ${session.jobRole}`,
              'Structured problem-solving methodology',
              'Precise technical terminology',
              'Consistent answer quality',
            ],
            gaps: [
              'Further optimization under peak concurrency',
              'Testing strategy automation',
              'Infrastructure monitoring metrics',
            ],
            next: [
              'Review advanced concurrency patterns',
              'Implement automated load test suites',
              'Deepen telemetry & logging knowledge',
            ],
          },
        });
      }
    }

    // Default fallback start response
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

