'use client';

import React from 'react';
import { FeedbackCard } from './FeedbackCard';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

interface StrengthsCardProps {
  strengths?: string[];
  className?: string;
}

export const StrengthsCard: React.FC<StrengthsCardProps> = ({
  strengths = [
    'Strong React fundamentals',
    'Clear communication',
    'Good problem-solving approach',
    'Well-structured answers',
  ],
  className = '',
}) => {
  return (
    <FeedbackCard
      title="Strengths"
      icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />}
      accentColor="green"
      badge={`${strengths.length} Identified`}
      className={className}
    >
      <ul className="space-y-2.5" aria-label="List of identified strengths">
        {strengths.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/40 border border-emerald-100/60 hover:bg-emerald-50/80 transition-colors duration-150"
          >
            <div className="mt-0.5 shrink-0 p-1 bg-emerald-100/80 rounded-full text-emerald-600">
              <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
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
