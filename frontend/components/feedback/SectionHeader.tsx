'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SectionHeaderProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title = "Interview Feedback",
  subtitle = "Review your interview performance and recommended improvements.",
  badgeText = "Interview Completed",
  className = "",
}) => {
  return (
    <header className={`flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6 ${className}`}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {badgeText && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" aria-hidden="true" />
              <span>{badgeText}</span>
            </span>
          )}
        </div>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      </div>
    </header>
  );
};
