'use client';

import React from 'react';
import { FeedbackCard } from './FeedbackCard';
import { Award, Sparkles, TrendingUp } from 'lucide-react';

interface SummaryCardProps {
  score?: number;
  summary?: string;
  className?: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  score = 84,
  summary = 'You demonstrated solid frontend knowledge and communicated your ideas clearly. Continue improving advanced concepts and system design.',
  className = '',
}) => {
  return (
    <FeedbackCard
      title="Summary"
      icon={<Award className="w-5 h-5" />}
      accentColor="blue"
      badge={
        <div className="flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200/80">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Overall Score: {score}%</span>
        </div>
      }
      className={className}
    >
      <div className="space-y-4">
        {/* Score Visual Bar & Badge */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50/80 to-indigo-50/50 border border-blue-100 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block">
              Overall Score
            </span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-3xl font-extrabold text-blue-900 tracking-tight">
                {score}%
              </span>
              <span className="text-xs font-medium text-blue-600">/ 100%</span>
            </div>
          </div>

          <div className="flex-1 max-w-[140px] space-y-1.5">
            <div className="w-full bg-blue-200/70 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
                aria-label={`Score progress: ${score}%`}
              />
            </div>
            <div className="flex items-center justify-end text-[11px] font-medium text-blue-700 gap-1">
              <TrendingUp className="w-3 h-3 text-blue-600" />
              <span>Above Benchmark</span>
            </div>
          </div>
        </div>

        {/* Short paragraph describing performance */}
        <div className="text-sm leading-relaxed text-gray-700 bg-gray-50/60 p-4 rounded-xl border border-gray-100 font-normal">
          {summary}
        </div>
      </div>
    </FeedbackCard>
  );
};
