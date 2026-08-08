'use client';

import React from 'react';
import { FeedbackCard } from './FeedbackCard';
import { AlertCircle, AlertTriangle } from 'lucide-react';

interface GapsCardProps {
  gaps?: string[];
  className?: string;
}

export const GapsCard: React.FC<GapsCardProps> = ({
  gaps = [
    'Advanced React optimization',
    'Performance tuning',
    'Testing strategies',
    'System design knowledge',
  ],
  className = '',
}) => {
  return (
    <FeedbackCard
      title="Gaps"
      icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
      accentColor="amber"
      badge={`${gaps.length} Areas`}
      className={className}
    >
      <ul className="space-y-2.5" aria-label="List of improvement areas">
        {gaps.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/40 border border-amber-100/60 hover:bg-amber-50/80 transition-colors duration-150"
          >
            <div className="mt-0.5 shrink-0 p-1 bg-amber-100/80 rounded-full text-amber-600">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
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
