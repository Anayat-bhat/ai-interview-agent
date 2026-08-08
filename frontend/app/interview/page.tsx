'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
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
import { ArrowLeft, ArrowRight, CheckCircle2, ChevronLeft, Bot, MessageSquare, Send, Sparkles } from 'lucide-react';
import { useInterviewContext } from '@/context/InterviewContext';
import { sendMessage, startInterview } from '@/services/interview';

function InterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id');
  const { candidate: contextCandidate, setCandidate, setAnswerForQuestion, completeInterview } = useInterviewContext();

  const candidate: Candidate = useMemo(() => {
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
    return contextCandidate || {
      id: 'CAND-001',
      name: 'Sarah Johnson',
      role: 'Senior Data Engineer',
      experience: '9 Years',
      technology: 'AI & Data Engineering',
      difficulty: 'Medium',
    };
  }, [candidateId, contextCandidate]);

  const sessionId = useMemo(() => `sess_${candidate.id || 'default'}_${Date.now()}`, [candidate.id]);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerText, setAnswerText] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'ai' | 'candidate'; text: string }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionTitle, setQuestionTitle] = useState('Core Architecture & Systems Evaluation');
  const [questionDesc, setQuestionDesc] = useState('Answer the technical interviewer question provided in the conversation panel.');

  const totalQuestions = 3;
  const currentQuestionNumber = currentQuestionIndex + 1;
  const progressPercent = Math.round((currentQuestionNumber / totalQuestions) * 100);

  // Initialize session on mount
  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const res = await startInterview({ candidateId: sessionId, candidate });
        if (isMounted) {
          setChatMessages([{ sender: 'ai', text: res.firstQuestion }]);
        }
      } catch (err) {
        if (isMounted) {
          setChatMessages([{ sender: 'ai', text: `Welcome ${candidate.name}. Let's begin your technical interview for the ${candidate.role} position.` }]);
        }
      }
    }
    init();
    return () => { isMounted = false; };
  }, [sessionId, candidate]);

  const handleSendAnswer = async () => {
    if (!answerText.trim() || isSubmitting) return;

    const userMsg = answerText.trim();
    setAnswerForQuestion(currentQuestionIndex, userMsg);
    setChatMessages((prev) => [...prev, { sender: 'candidate', text: userMsg }]);
    setAnswerText('');
    setIsSubmitting(true);

    try {
      const res = await sendMessage({ interviewId: sessionId, message: userMsg });
      
      setChatMessages((prev) => [...prev, { sender: 'ai', text: res.reply }]);

      if (res.isInterviewComplete || currentQuestionIndex >= totalQuestions - 1) {
        if (res.feedback) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('ai_interview_latest_feedback', JSON.stringify({
              candidate,
              feedback: res.feedback,
            }));
          }
        }
        completeInterview();
        setTimeout(() => {
          router.push('/feedback');
        }, 1200);
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: 'ai', text: 'Thank you for your response. Let us proceed to the next technical topic.' }]);
      if (currentQuestionIndex >= totalQuestions - 1) {
        completeInterview();
        router.push('/feedback');
      } else {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEndInterview = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, endSession: true }),
      });
      const data = await res.json();
      if (data.feedback && typeof window !== 'undefined') {
        localStorage.setItem('ai_interview_latest_feedback', JSON.stringify({
          candidate,
          feedback: data.feedback,
        }));
      }
    } catch (e) {}
    completeInterview();
    router.push('/feedback');
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
                  AI Technical Interview Room
                </h1>
                <p className="text-xs text-gray-500">
                  Candidate: <span className="font-semibold text-gray-700">{candidate.name}</span> ({candidate.role})
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Timer initialSeconds={60} />

            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold text-gray-900">
                Question {currentQuestionNumber} / {totalQuestions}
              </span>
              <span className="text-[11px] text-gray-400">Progress: {progressPercent}%</span>
            </div>

            <button
              onClick={handleEndInterview}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>End Interview</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-3">
          <ProgressBar value={progressPercent} max={100} showValue={false} color="primary" className="h-1.5" />
        </div>
      </header>

      {/* Main Body Layout */}
      <PageContainer maxWidth="xl" className="py-8 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (8 Cols): AI Conversation Stream & Answer Form */}
          <div className="lg:col-span-8 space-y-6">
            {/* Live AI Interviewer Conversation Display */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Bot className="w-5 h-5 text-blue-600" />
                  <span>AI Assessor Stream</span>
                </div>
                <Badge variant="primary" icon={<Sparkles className="w-3 h-3" />}>
                  POST /api/interview Active
                </Badge>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-3 ${
                      msg.sender === 'candidate' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                        msg.sender === 'candidate'
                          ? 'bg-primary text-white'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {msg.sender === 'candidate' ? 'YOU' : 'AI'}
                    </div>
                    <div
                      className={`rounded-2xl p-4 text-sm leading-relaxed max-w-[85%] ${
                        msg.sender === 'candidate'
                          ? 'bg-primary text-white rounded-tr-none'
                          : 'bg-gray-100 text-gray-900 rounded-tl-none border border-gray-200/80'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Answer Input Box */}
            <AnswerBox
              value={answerText}
              onChange={setAnswerText}
              placeholder="Type your technical response here..."
            />

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
                }}
                disabled={currentQuestionIndex === 0}
                icon={<ArrowLeft className="w-4 h-4" />}
              >
                Previous Question
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={handleSendAnswer}
                disabled={!answerText.trim() || isSubmitting}
                icon={<Send className="w-4 h-4" />}
              >
                {isSubmitting
                  ? 'Submitting...'
                  : currentQuestionIndex < totalQuestions - 1
                  ? 'Submit & Next Question'
                  : 'Submit & Complete Interview'}
              </Button>
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
            <p className="text-sm font-medium">Loading AI interview room...</p>
          </div>
        </div>
      }
    >
      <InterviewContent />
    </Suspense>
  );
}

