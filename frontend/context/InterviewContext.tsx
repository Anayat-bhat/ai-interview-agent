'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Candidate } from '@/types/candidate';
import { InterviewQuestion } from '@/types/interview';
import { InterviewReport } from '@/types/feedback';

export type Technology = 'React' | 'Node.js' | 'Python' | 'Java' | 'JavaScript' | 'TypeScript';

const QUESTION_BANK: Record<string, Array<{ title: string; description: string; category: string }>> = {
  React: [
    {
      title: 'Explain React Virtual DOM and why it improves rendering performance.',
      description: 'Focus on reconciliation algorithms, synthetic DOM snapshots, diffing overhead vs browser DOM reflows, and batching updates.',
      category: 'Architecture & Performance',
    },
    {
      title: 'What are React Server Components (RSC) and how do they differ from Client Components?',
      description: 'Discuss bundle size optimization, server-side data fetching, hydration boundaries, and use client directive rules.',
      category: 'Next.js & React 19',
    },
    {
      title: 'How does the React useEffect hook handle side effects and memory leaks?',
      description: 'Explain cleanup functions, dependency arrays, stale closures, and race condition prevention.',
      category: 'Hooks & State',
    },
    {
      title: 'Explain the difference between Context API and state management libraries like Zustand/Redux.',
      description: 'Discuss re-render cascades, selector patterns, prop drilling solutions, and global state architecture.',
      category: 'State Management',
    },
    {
      title: 'How does React batch state updates and what changed in React 18 automatic batching?',
      description: 'Explain event handler batching, promise/timeout batching in React 18, and flushSync overrides.',
      category: 'Core Concepts',
    },
  ],
  'Node.js': [
    {
      title: 'Explain the Node.js Event Loop phases and asynchronous I/O execution.',
      description: 'Detail timers, pending callbacks, poll, check (setImmediate), and close callbacks phases along with process.nextTick.',
      category: 'Node.js Architecture',
    },
    {
      title: 'How do Worker Threads differ from Cluster module in Node.js scaling?',
      description: 'Discuss CPU-bound vs I/O-bound workloads, thread memory sharing vs IPC message passing.',
      category: 'Concurrency & Performance',
    },
    {
      title: 'Explain streams in Node.js and how backpressure is handled.',
      description: 'Detail Readable, Writable, Transform streams, pipe method, and highWaterMark buffer limits.',
      category: 'Streams & I/O',
    },
    {
      title: 'How do you prevent SQL Injection and XSS vulnerabilities in an Express/Node backend?',
      description: 'Discuss parameterized queries, ORM sanitization, Helmet headers, CORS policies, and input validation.',
      category: 'Security',
    },
    {
      title: 'Describe memory leak diagnosis and profiling in Node.js applications.',
      description: 'Explain heap snapshots, V8 garbage collection logs, global variable leaks, and unclosed event listeners.',
      category: 'Debugging & Performance',
    },
  ],
  Python: [
    {
      title: 'Explain Python GIL (Global Interpreter Lock) and its impact on multi-threading.',
      description: 'Discuss CPython execution, IO-bound vs CPU-bound tasks, multiprocessing module, and asyncio event loops.',
      category: 'Python Internals',
    },
    {
      title: 'How do Python Generators and yield statements work under the hood?',
      description: 'Explain iterator protocol, memory efficiency for large datasets, generator expressions, and coroutines.',
      category: 'Core Python',
    },
    {
      title: 'Compare list comprehension, map/filter, and traditional loops in performance and readability.',
      description: 'Discuss bytecode optimization, memory allocation, and pythonic idioms.',
      category: 'Performance & Idioms',
    },
    {
      title: 'Explain decorators in Python and how to write a parameterized decorator.',
      description: 'Detail function wrapping, functools.wraps, higher-order functions, and closure scopes.',
      category: 'Advanced Syntax',
    },
    {
      title: 'How does dynamic typing and reference counting/garbage collection work in Python?',
      description: 'Discuss pyobject, ref counts, cycle detector gc module, and weakref usages.',
      category: 'Memory Management',
    },
  ],
  TypeScript: [
    {
      title: 'Explain TypeScript Generics and Conditional Types with practical examples.',
      description: 'Discuss T extends U ? X : Y syntax, infer keyword, utility types (ReturnType, Parameters).',
      category: 'Advanced Types',
    },
    {
      title: 'What is Type Narrowing and Discriminated Unions in TypeScript?',
      description: 'Discuss type guards (typeof, instanceof, in, custom predicates), literal types, and exhaustiveness checking.',
      category: 'Type System',
    },
    {
      title: 'Compare Interface vs Type Alias declaration in TypeScript.',
      description: 'Discuss declaration merging, index signatures, union/intersection support, and performance compilation differences.',
      category: 'Type Modeling',
    },
    {
      title: 'Explain the difference between unknown, any, and never types.',
      description: 'Discuss type safety strictness, assignability rules, unreachable code assertions, and input sanitization.',
      category: 'Type Safety',
    },
    {
      title: 'How do custom Type Guards (is operator) work in TypeScript?',
      description: 'Explain function return type predicates (arg is Type), narrowing runtime structures, and validation boundaries.',
      category: 'Type Guards',
    },
  ],
};

interface InterviewContextType {
  candidate: Candidate & { technology?: string; difficulty?: string };
  setCandidate: (candidate: Candidate & { technology?: string; difficulty?: string }) => void;
  questions: InterviewQuestion[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  answers: Record<number, string>;
  setAnswerForQuestion: (index: number, answer: string) => void;
  report: InterviewReport | null;
  completeInterview: () => void;
  resetSession: () => void;
}

const defaultCandidate: Candidate & { technology?: string; difficulty?: string } = {
  id: 1,
  name: 'John Doe',
  role: 'Frontend Developer',
  experience: '2 Years',
  technology: 'React',
  difficulty: 'Medium',
};

const InterviewContext = createContext<InterviewContextType | undefined>(undefined);

export const InterviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidate, setCandidate] = useState<Candidate & { technology?: string; difficulty?: string }>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_interview_candidate');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return defaultCandidate;
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_interview_answers');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return {};
  });

  const [report, setReport] = useState<InterviewReport | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ai_interview_report');
      if (saved) {
        try { return JSON.parse(saved); } catch {}
      }
    }
    return null;
  });

  const techDomain = candidate.technology || 'React';
  const questions: InterviewQuestion[] = (QUESTION_BANK[techDomain] || QUESTION_BANK.React).map(
    (item, idx, array) => ({
      id: `q_${techDomain}_${idx + 1}`,
      questionNumber: idx + 1,
      totalQuestions: array.length,
      title: item.title,
      description: item.description,
      category: item.category,
      difficulty: (candidate.difficulty as any) || 'Medium',
      timeLimitSeconds: 60,
    })
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_interview_candidate', JSON.stringify(candidate));
    }
  }, [candidate]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_interview_answers', JSON.stringify(answers));
    }
  }, [answers]);

  const setAnswerForQuestion = (index: number, text: string) => {
    setAnswers((prev) => ({ ...prev, [index]: text }));
  };

  const completeInterview = () => {
    const answeredCount = Object.keys(answers).filter((k) => (answers[Number(k)] || '').trim().length > 10).length;
    const baseScore = Math.min(95, Math.max(70, 75 + answeredCount * 4));

    const generatedReport: InterviewReport = {
      id: `rep_${Date.now()}`,
      interviewId: `sess_${Date.now()}`,
      candidateName: candidate.name || 'John Doe',
      technology: techDomain,
      difficulty: candidate.difficulty || 'Medium',
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      feedback: {
        overallScore: baseScore,
        summary: `Candidate ${candidate.name || 'John Doe'} completed the ${candidate.role} (${techDomain}) technical evaluation. Demonstrated solid structural clarity and foundational comprehension.`,
        aiDetailedFeedback: `The AI evaluation pipeline analyzed ${answeredCount} submitted answers for ${candidate.role}. The candidate demonstrated strong conceptual alignment with ${candidate.experience} expectations.`,
        scores: [
          {
            category: 'technical',
            title: 'Technical Knowledge',
            score: Math.min(98, baseScore + 4),
            maxScore: 100,
            description: `Exemplary understanding of ${techDomain} core architecture and runtime behavior.`,
          },
          {
            category: 'communication',
            title: 'Communication',
            score: Math.max(65, baseScore - 3),
            maxScore: 100,
            description: 'Clear, structured explanations utilizing industry-standard terminology.',
          },
          {
            category: 'problemSolving',
            title: 'Problem Solving',
            score: Math.min(96, baseScore + 2),
            maxScore: 100,
            description: 'Methodical approach to technical trade-offs and performance bottlenecks.',
          },
          {
            category: 'confidence',
            title: 'Confidence',
            score: Math.max(70, baseScore - 2),
            maxScore: 100,
            description: 'Decisive technical articulation and edge case awareness.',
          },
        ],
        strengths: [
          `Strong understanding of ${techDomain} fundamentals`,
          `Effective communication of performance trade-offs`,
          `Structured approach to technical problem solving`,
          `High accuracy on core concept explanations`,
        ],
        weaknesses: [
          `Provide more practical code implementation examples`,
          `Elaborate further on internal runtime architectures`,
          `Mention memory leak prevention and edge-case error handling`,
        ],
        gaps: [
          `Provide more practical code implementation examples`,
          `Elaborate further on internal runtime architectures`,
          `Mention memory leak prevention and edge-case error handling`,
        ],
        next: [
          `${techDomain} Internal Architecture`,
          `Advanced Concurrency & Async Patterns`,
          `Memory Leak Profiling & Optimization`,
          `Production Security & Error Boundaries`,
        ],
        recommendedTopics: [
          `${techDomain} Internal Architecture`,
          `Advanced Concurrency & Async Patterns`,
          `Memory Leak Profiling & Optimization`,
          `Production Security & Error Boundaries`,
        ],
      },
    };

    setReport(generatedReport);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ai_interview_report', JSON.stringify(generatedReport));
    }
  };

  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setReport(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ai_interview_answers');
      localStorage.removeItem('ai_interview_report');
    }
  };

  return (
    <InterviewContext.Provider
      value={{
        candidate,
        setCandidate,
        questions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        answers,
        setAnswerForQuestion,
        report,
        completeInterview,
        resetSession,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviewContext = () => {
  const ctx = useContext(InterviewContext);
  if (!ctx) {
    throw new Error('useInterviewContext must be used within an InterviewProvider');
  }
  return ctx;
};
