'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import candidatesData from '@/data/candidates.json';
import { Candidate, Difficulty } from '@/types/candidate';
import { PageContainer } from '@/components/layout/PageContainer';
import { QuestionCard } from '@/components/interview/QuestionCard';
import { AnswerBox } from '@/components/interview/AnswerBox';
import { ProgressSidebar } from '@/components/interview/ProgressSidebar';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Timer } from '@/components/ui/Timer';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, Bot } from 'lucide-react';

const mockQuestions = [
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
];

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id');

  const candidate: Candidate = React.useMemo(() => {
    const list: any[] = (candidatesData as any).candidates || candidatesData;
    if (candidateId) {
      const found = list.find((c) => {
        const id = c.member?.id || c.id;
        return String(id) === String(candidateId);
      });
      if (found) {
        return {
          id: found.member?.id || found.id,
          name: found.member?.name || found.name || 'Sarah Johnson',
          role: found.member?.jobRole || found.jobRole || found.role || 'Senior Data Engineer',
          experience: found.member?.yearsExperience !== undefined ? `${found.member.yearsExperience} Years` : found.experience || '9 Years',
          technology: 'AI & Data Engineering',
          difficulty: 'Medium',
        };
      }
    }
    return {
      id: 'CAND-001',
      name: 'Sarah Johnson',
      role: 'Senior Data Engineer',
      experience: '9 Years',
      technology: 'AI & Data Engineering',
      difficulty: 'Medium',
    };
  }, [candidateId]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(2); // 0-indexed (Question 3)
  const [answerText, setAnswerText] = useState('');
  const totalQuestions = 10;
  const currentQuestionNumber = currentQuestionIndex + 1;
  const progressPercent = Math.round((currentQuestionNumber / totalQuestions) * 100);

  const currentQ = mockQuestions[currentQuestionIndex % mockQuestions.length];

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswerText('');
    } else {
      router.push('/feedback');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setAnswerText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col">
      {/* Top Bar Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-2xs px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
              aria-label="Back to candidate selection"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-base font-bold text-gray-900 leading-tight">
                  AI Interview Room
                </h1>
                <p className="text-xs text-gray-500">
                  Candidate: <span className="font-semibold text-gray-700">{candidate.name}</span> ({candidate.role})
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer component */}
            <Timer initialSeconds={45} />

            {/* Question Counter */}
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-gray-900">
                Question {currentQuestionNumber} / {totalQuestions}
              </span>
              <span className="text-[11px] text-gray-400">Progress: {progressPercent}%</span>
            </div>

            <Link
              href="/feedback"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>End Interview</span>
            </Link>
          </div>
        </div>

        {/* Top Progress Bar */}
        <div className="max-w-7xl mx-auto mt-3">
          <ProgressBar value={progressPercent} max={100} showValue={false} color="primary" className="h-1.5" />
        </div>
      </header>

      {/* Main Body Layout */}
      <PageContainer maxWidth="xl" className="py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 Cols): Question Card, Answer Textarea, Controls */}
          <div className="lg:col-span-8 space-y-6">
            <QuestionCard
              questionNumber={currentQuestionNumber}
              totalQuestions={totalQuestions}
              title={currentQ.title}
              description={currentQ.description}
              category={currentQ.category}
              difficulty={(candidate.difficulty as Difficulty) || 'Medium'}
            />

            <AnswerBox
              value={answerText}
              onChange={setAnswerText}
              placeholder="Type your detailed technical explanation here..."
            />

            {/* Action Buttons: Previous, Next, End Interview */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleNext}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Complete & View Feedback'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column (4 Cols): Progress Sidebar */}
          <div className="lg:col-span-4">
            <ProgressSidebar
              currentQuestion={currentQuestionNumber}
              totalQuestions={totalQuestions}
              difficulty={(candidate.difficulty as Difficulty) || 'Medium'}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-500">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20" />
            <p className="text-sm font-medium">Loading interview room...</p>
          </div>
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
