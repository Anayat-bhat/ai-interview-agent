'use client';

import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { CheckCircle2, Circle, Lightbulb, Gauge, BookOpen, Clock } from 'lucide-react';
import { Difficulty } from '@/types/candidate';

interface ProgressSidebarProps {
  currentQuestion?: number;
  totalQuestions?: number;
  difficulty?: Difficulty;
  topics?: string[];
  tips?: string[];
}

export const ProgressSidebar: React.FC<ProgressSidebarProps> = ({
  currentQuestion = 3,
  totalQuestions = 10,
  difficulty = 'Medium',
  topics = [
    'Virtual DOM & Reconciliation',
    'Hooks & Lifecycle Patterns',
    'State Architecture & Batching',
    'Performance Optimization',
    'SSR & React Server Components',
  ],
  tips = [
    'Focus on clear architectural reasoning over memorized syntax.',
    'Mention trade-offs between rendering performance and memory usage.',
    'Provide structured, step-by-step technical explanations.',
  ],
}) => {
  const progressPercent = Math.round((currentQuestion / totalQuestions) * 100);

  return (
    <aside aria-label="Interview Session Details" className="space-y-4 w-full">
      {/* Progress Card */}
      <Card padding="md" className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" />
            Interview Progress
          </h3>
          <span className="text-xs font-semibold text-primary">{progressPercent}%</span>
        </div>

        <ProgressBar value={progressPercent} max={100} showValue={false} color="primary" />

        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Question Progress:</span>
          <span className="font-semibold text-gray-900">{currentQuestion} of {totalQuestions}</span>
        </div>
      </Card>

      {/* Topics & Difficulty Card */}
      <Card padding="md" className="space-y-3">
        <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            Topics Covered
          </h3>
          <Badge variant="warning" icon={<Gauge className="w-3 h-3" />}>
            {difficulty}
          </Badge>
        </div>

        <ul className="space-y-2 text-xs">
          {topics.map((topic, index) => {
            const isCompleted = index + 1 < currentQuestion;
            const isCurrent = index + 1 === currentQuestion;

            return (
              <li
                key={index}
                className={`flex items-center gap-2.5 p-2 rounded-lg transition-colors ${
                  isCurrent
                    ? 'bg-blue-50/80 text-blue-900 font-semibold border border-blue-100'
                    : isCompleted
                    ? 'text-gray-500'
                    : 'text-gray-400'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                ) : isCurrent ? (
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping shrink-0 ml-0.5 mr-1" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-gray-300 shrink-0" />
                )}
                <span className="truncate">{topic}</span>
              </li>
            );
          })}
        </ul>
      </Card>

      {/* Helpful Tips Card */}
      <Card padding="md" className="space-y-3 bg-amber-50/30 border-amber-100">
        <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 border-b border-amber-100 pb-2">
          <Lightbulb className="w-4 h-4 text-amber-600" />
          Candidate Tips
        </h3>

        <ul className="space-y-2 text-xs text-amber-950/80">
          {tips.map((tip, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-500 font-bold">•</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </Card>
    </aside>
  );
};
