import React from 'react';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';

interface ScoreCardProps {
  title: string;
  score: number; // 0 - 100
  description: string;
  icon?: React.ReactNode;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  title,
  score,
  description,
  icon,
}) => {
  let color: 'success' | 'primary' | 'warning' | 'danger' = 'success';
  if (score < 60) color = 'danger';
  else if (score < 75) color = 'warning';
  else if (score < 85) color = 'primary';

  return (
    <Card padding="md" hoverable className="w-full">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {icon && <div className="p-2 rounded-xl bg-blue-50 text-primary">{icon}</div>}
            <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          </div>
          <span className="text-xl font-extrabold text-gray-900 tracking-tight">
            {score}%
          </span>
        </div>

        <ProgressBar value={score} height="sm" color={color} />

        <p className="text-xs text-gray-500 leading-relaxed pt-1">
          {description}
        </p>
      </div>
    </Card>
  );
};
