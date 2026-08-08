'use client';

import React from 'react';

export type CardAccentColor = 'blue' | 'green' | 'amber' | 'purple';

export interface FeedbackCardProps {
  title: string;
  icon: React.ReactNode;
  accentColor?: CardAccentColor;
  badge?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const colorStyles: Record<
  CardAccentColor,
  {
    cardBorder: string;
    iconBg: string;
    iconText: string;
    headerBorder: string;
    badgeBg: string;
    accentLine: string;
  }
> = {
  blue: {
    cardBorder: 'border-blue-100/80 hover:border-blue-200',
    iconBg: 'bg-blue-50 border-blue-100',
    iconText: 'text-blue-600',
    headerBorder: 'border-blue-50',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200/60',
    accentLine: 'bg-blue-600',
  },
  green: {
    cardBorder: 'border-emerald-100/80 hover:border-emerald-200',
    iconBg: 'bg-emerald-50 border-emerald-100',
    iconText: 'text-emerald-600',
    headerBorder: 'border-emerald-50',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    accentLine: 'bg-emerald-600',
  },
  amber: {
    cardBorder: 'border-amber-100/80 hover:border-amber-200',
    iconBg: 'bg-amber-50 border-amber-100',
    iconText: 'text-amber-600',
    headerBorder: 'border-amber-50',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200/60',
    accentLine: 'bg-amber-600',
  },
  purple: {
    cardBorder: 'border-purple-100/80 hover:border-purple-200',
    iconBg: 'bg-purple-50 border-purple-100',
    iconText: 'text-purple-600',
    headerBorder: 'border-purple-50',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200/60',
    accentLine: 'bg-purple-600',
  },
};

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  title,
  icon,
  accentColor = 'blue',
  badge,
  children,
  className = '',
}) => {
  const styles = colorStyles[accentColor];

  return (
    <div
      className={`group relative flex flex-col justify-between bg-white rounded-2xl border ${styles.cardBorder} p-6 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${className}`}
    >
      {/* Subtle top accent indicator line */}
      <div
        className={`absolute top-0 left-0 right-0 h-1 ${styles.accentLine} opacity-80 group-hover:opacity-100 transition-opacity`}
      />

      <div>
        {/* Card Header */}
        <div className={`flex items-center justify-between pb-4 mb-4 border-b ${styles.headerBorder}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${styles.iconBg} ${styles.iconText} transition-transform duration-200 group-hover:scale-105`}>
              {icon}
            </div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
              {title}
            </h2>
          </div>

          {badge && (
            <div>
              {typeof badge === 'string' ? (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles.badgeBg}`}>
                  {badge}
                </span>
              ) : (
                badge
              )}
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="space-y-4">{children}</div>
      </div>
    </div>
  );
};
