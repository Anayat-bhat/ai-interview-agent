'use client';

import React, { useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import candidatesData from '@/data/candidates.json';
import { PageContainer } from '@/components/layout/PageContainer';
import { QuestionCard } from '@/components/interview/QuestionCard';
import { AnswerBox } from '@/components/interview/AnswerBox';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Timer } from '@/components/ui/Timer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useInterviewContext } from '@/context/InterviewContext';
import { useCountdown } from '@/hooks/useCountdown';
import { Candidate } from '@/types/candidate';
import {
  ChevronLeft,
  ChevronRight,
  LogOut,
  Layers,
  BookOpen,
  Lightbulb,
  CheckCircle2,
} from 'lucide-react';

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id');

  const {
    candidate: contextCandidate,
    setCandidate,
    questions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    answers,
    setAnswerForQuestion,
    completeInterview,
  } = useInterviewContext();

  // Selected candidate from JSON if id is provided
  const selectedCandidate: Candidate | undefined = useMemo(() => {
    if (candidateId) {
      return (candidatesData as Candidate[]).find((c) => c.id === Number(candidateId));
    }
    return undefined;
  }, [candidateId]);

  useEffect(() => {
    if (selectedCandidate) {
      // Map role to tech domain for interview engine
      let tech = 'React';
      if (selectedCandidate.role.includes('Backend')) tech = 'Node.js';
      else if (selectedCandidate.role.includes('AI')) tech = 'Python';
      else if (selectedCandidate.role.includes('Full Stack')) tech = 'TypeScript';

      setCandidate({
        ...selectedCandidate,
        technology: tech,
        difficulty: 'Medium',
      });
    }
  }, [selectedCandidate, setCandidate]);

  const activeCandidateName = selectedCandidate ? selectedCandidate.name : (contextCandidate.name || 'John Doe');
  const activeRole = selectedCandidate ? selectedCandidate.role : (contextCandidate.role || 'Frontend Developer');
  const activeExperience = selectedCandidate ? selectedCandidate.experience : (contextCandidate.experience || '2 Years');

  const totalQuestions = questions.length;
  const activeQuestion = questions[currentQuestionIndex] || questions[0];
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const currentAnswer = answers[currentQuestionIndex] || '';

  // Timer setup with 60 seconds per question
  const { formattedTime, resetTimer, startTimer } = useCountdown(60);

  useEffect(() => {
    resetTimer(60);
    startTimer();
  }, [currentQuestionIndex]);

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeInterview();
      router.push('/feedback');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleEndInterview = () => {
    completeInterview();
    router.push('/feedback');
  };

  return (
    <PageContainer maxWidth="xl" className="space-y-6">
      {/* Top Bar */}
      <Card padding="sm" className="bg-white border-gray-200">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <span className="text-sm font-bold text-gray-900 shrink-0">
              Question {currentQuestionIndex + 1} / {totalQuestions}
            </span>
            <Timer formattedTime={formattedTime} />
          </div>

          <div className="w-full md:w-1/3">
            <ProgressBar value={progressPercent} height="sm" color="primary" showLabel />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <Button
              variant="outline"
              size="sm"
              icon={<LogOut className="w-4 h-4 text-danger" />}
              onClick={handleEndInterview}
              className="text-danger hover:bg-red-50 border-red-200"
            >
              End Interview
            </Button>
          </div>
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <QuestionCard
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            title={activeQuestion.title}
            description={activeQuestion.description}
            category={`${activeRole} / ${activeQuestion.category}`}
            difficulty={(contextCandidate.difficulty as any) || 'Medium'}
          />

          <AnswerBox
            value={currentAnswer}
            onChange={(val) => setAnswerForQuestion(currentQuestionIndex, val)}
          />

          {/* Navigation Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="secondary"
              size="md"
              disabled={currentQuestionIndex === 0}
              onClick={handlePrevious}
              icon={<ChevronLeft className="w-4 h-4" />}
            >
              Previous
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleNext}
              className="px-6"
            >
              {currentQuestionIndex === totalQuestions - 1 ? 'Submit & View Report' : 'Next Question'}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>

        {/* Right Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Interview Overview Sidebar Card */}
          <Card padding="md" className="space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <Layers className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-gray-900">Active Candidate</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-500">Name</span>
                <span className="font-semibold text-gray-900">{activeCandidateName}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-500">Role</span>
                <Badge variant="primary">{activeRole}</Badge>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-500">Experience</span>
                <span className="font-semibold text-gray-900">{activeExperience}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-gray-100">
                <span className="text-gray-500">Answered Questions</span>
                <span className="font-semibold text-gray-900">
                  {Object.keys(answers).length} of {totalQuestions}
                </span>
              </div>
            </div>
          </Card>

          {/* Topics Covered Card */}
          <Card padding="md" className="space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <BookOpen className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-bold text-gray-900">Question Checklist</h3>
            </div>

            <div className="space-y-2 text-xs">
              {questions.map((q, idx) => {
                const isAnswered = Boolean((answers[idx] || '').trim());
                const isCurrent = idx === currentQuestionIndex;

                if (isCurrent) {
                  return (
                    <div
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className="flex items-center justify-between p-2 rounded-lg bg-blue-50 text-primary font-semibold border border-blue-100 cursor-pointer"
                    >
                      <span className="truncate max-w-[200px]">
                        {idx + 1}. {q.category}
                      </span>
                      <span>Active</span>
                    </div>
                  );
                }

                if (isAnswered) {
                  return (
                    <div
                      key={q.id}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className="flex items-center justify-between p-2 rounded-lg bg-green-50 text-success font-medium cursor-pointer hover:bg-green-100/80 transition"
                    >
                      <span className="flex items-center gap-1.5 truncate max-w-[200px]">
                        <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> {idx + 1}. {q.category}
                      </span>
                      <span>Done</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className="flex items-center justify-between p-2 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 cursor-pointer transition"
                  >
                    <span className="truncate max-w-[200px]">
                      {idx + 1}. {q.category}
                    </span>
                    <span>Pending</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Candidate Tips Card */}
          <Card padding="md" className="bg-amber-50/50 border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <Lightbulb className="w-4 h-4 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider">Evaluation Tips</h3>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              Demonstrate strong technical accuracy for {activeRole}. Use precise terminology and clear trade-off explanations.
            </p>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

export default function InterviewPage() {
  return (
    <Suspense
      fallback={
        <PageContainer maxWidth="xl" className="py-12 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto" />
            <div className="h-64 bg-gray-100 rounded-2xl" />
          </div>
        </PageContainer>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}
