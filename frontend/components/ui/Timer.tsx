import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  formattedTime?: string; // e.g. "00:45"
  initialSeconds?: number; // e.g. 45
  warningThreshold?: number; // seconds when timer changes color
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  formattedTime,
  initialSeconds = 45,
  className = '',
}) => {
  const displayTime =
    formattedTime ||
    `${String(Math.floor(initialSeconds / 60)).padStart(2, '0')}:${String(
      initialSeconds % 60
    ).padStart(2, '0')}`;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-surface-border text-sm font-semibold text-gray-800 shadow-sm ${className}`}
      aria-label={`Time remaining: ${displayTime}`}
    >
      <Clock className="w-4 h-4 text-primary animate-pulse" />
      <span className="font-mono tracking-wider">{displayTime}</span>
    </div>
  );
};
