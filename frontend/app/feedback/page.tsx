'use client';

import React from 'react';
import Link from 'next/link';
import { PageContainer } from '@/components/layout/PageContainer';
import { SectionHeader } from '@/components/feedback/SectionHeader';
import { ScoreCircle } from '@/components/common/ScoreCircle';
import { ScoreCard } from '@/components/feedback/ScoreCard';
import { SummaryCard } from '@/components/feedback/SummaryCard';
import { StrengthsCard } from '@/components/feedback/StrengthsCard';
import { GapsCard } from '@/components/feedback/GapsCard';
import { NextStepsCard } from '@/components/feedback/NextStepsCard';
import { ActionButtons } from '@/components/feedback/ActionButtons';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { feedback } from '@/data/feedback';
import {
  Code2,
  MessageSquare,
  Cpu,
  Zap,
  BookOpen,
  Calendar,
  Award,
} from 'lucide-react';

const scoreMetrics = [
  {
    category: 'technical',
    title: 'Technical Knowledge',
    score: 90,
    description: 'Exemplary mastery of core React concepts, reconciliation algorithms, and hooks.',
    icon: <Code2 className="w-5 h-5 text-blue-600" />,
  },
  {
    category: 'communication',
    title: 'Communication',
    score: 85,
    description: 'Clear technical prose using standard industry terminology and precise explanations.',
    icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
  },
  {
    category: 'problemSolving',
    title: 'Problem Solving',
    score: 88,
    description: 'Analytical approach to performance trade-offs, batching updates, and DOM reflows.',
    icon: <Cpu className="w-5 h-5 text-blue-600" />,
  },
  {
    category: 'confidence',
    title: 'Confidence',
    score: 82,
    description: 'Decisive answers with thorough coverage of practical edge cases and optimization rules.',
    icon: <Zap className="w-5 h-5 text-blue-600" />,
  },
];

export default function FeedbackPage() {
  const overallScore = 86;

  return (
    <main className="flex-1 bg-gray-50/60 py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      <PageContainer maxWidth="xl" className="space-y-8">
        {/* Page Header */}
        <SectionHeader
          title="Interview Feedback"
          subtitle="Review your interview performance and recommended improvements."
          badgeText="Interview Completed"
        />

        {/* Hero Score Overview Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Overall Score Circle (4 Cols) */}
          <Card padding="lg" className="lg:col-span-4 flex flex-col items-center justify-center text-center bg-gradient-to-b from-blue-50/40 to-white border-blue-100">
            <ScoreCircle score={overallScore} size={150} strokeWidth={12} label="Overall Match Score" />
            <div className="mt-4 pt-4 border-t border-gray-200 w-full flex items-center justify-between text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-gray-400" /> Completed Today
              </span>
              <span className="text-emerald-600 font-semibold">Tier 1 Recommendation</span>
            </div>
          </Card>

          {/* Four Score Cards (8 Cols -> 2x2 Grid) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {scoreMetrics.map((sc, idx) => (
              <ScoreCard
                key={idx}
                title={sc.title}
                score={sc.score}
                description={sc.description}
                icon={sc.icon}
              />
            ))}
          </div>
        </div>

        {/* 4 Reusable Feedback Cards Grid (2x2 Desktop, 2 cols Tablet, 1 col Mobile) */}
        <section
          aria-label="Interview feedback detail grid"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch"
        >
          <SummaryCard
            score={overallScore}
            summary={feedback.summary}
            className="h-full"
          />

          <StrengthsCard
            strengths={feedback.strengths}
            className="h-full"
          />

          <GapsCard
            gaps={feedback.gaps}
            className="h-full"
          />

          <NextStepsCard
            nextSteps={feedback.nextSteps}
            className="h-full"
          />
        </section>

        {/* Recommended Learning Topics & Metadata Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recommended Learning Topics (7 Cols) */}
          <Card padding="lg" className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-bold text-gray-900">Recommended Learning Topics</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(feedback.next || feedback.nextSteps || []).map((topic, idx) => (
                <div key={idx} className="p-3.5 bg-surface border border-surface-border rounded-xl">
                  <span className="text-xs font-bold text-primary block">Module {idx + 1}</span>
                  <h4 className="text-sm font-semibold text-gray-900 mt-0.5">{topic}</h4>
                  <p className="text-xs text-gray-500 mt-1">Targeted practice module for senior proficiency.</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Session Metadata Card (5 Cols) */}
          <Card padding="lg" className="lg:col-span-5 space-y-4 bg-surface border-surface-border">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-3 flex items-center justify-between">
              <span>Interview Summary</span>
              <Badge variant="success" icon={<Award className="w-3 h-3" />}>
                Passed
              </Badge>
            </h3>

            <div className="space-y-3 text-xs text-gray-600">
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="font-medium text-gray-500">Candidate Name</span>
                <span className="font-semibold text-gray-900">John Doe</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="font-medium text-gray-500">Role & Domain</span>
                <span className="font-semibold text-gray-900">Frontend Developer (React)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="font-medium text-gray-500">Experience Level</span>
                <span className="font-semibold text-gray-900">2 Years</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-gray-200">
                <span className="font-medium text-gray-500">Difficulty</span>
                <span className="font-semibold text-gray-900">Medium</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="font-medium text-gray-500">Completed On</span>
                <span className="font-semibold text-gray-900">Today</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Action Buttons */}
        <ActionButtons />
      </PageContainer>
    </main>
  );
}
