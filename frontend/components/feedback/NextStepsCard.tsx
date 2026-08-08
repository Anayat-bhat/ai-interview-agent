'use client';

import React from 'react';
import { FeedbackCard } from './FeedbackCard';
import { Target, ArrowRightCircle } from 'lucide-react';

interface NextStepsCardProps {
  nextSteps?: string[];
  className?: string;
}

export const NextStepsCard: React.FC<NextStepsCardProps> = ({
  nextSteps = [
    'Practice React performance optimization',
    'Build one full-stack project',
    'Learn caching techniques',
    'Solve 20 medium DSA problems',
  ],
  className = '',
}) => {
  return (
    <FeedbackCard
      title="Next Steps"
      icon={<Target className="w-5 h-5 text-purple-600" />}
      accentColor="purple"
      badge={`${nextSteps.length} Actions`}
      className={className}
    >
      <ul className="space-y-2.5" aria-label="List of recommended next steps">
        {nextSteps.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/40 border border-purple-100/60 hover:bg-purple-50/80 transition-colors duration-150"
          >
            <div className="mt-0.5 shrink-0 p-1 bg-purple-100/80 rounded-full text-purple-600">
              <ArrowRightCircle className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-gray-800 leading-snug">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </FeedbackCard>
  );
};
