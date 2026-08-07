import React from 'react';
import { Card } from '../ui/Card';
import { AlertTriangle } from 'lucide-react';

interface WeaknessCardProps {
  weaknesses?: string[];
}

export const WeaknessCard: React.FC<WeaknessCardProps> = ({
  weaknesses = [
    'Elaborate more on React Fiber architecture and internal priority queues',
    'Include practical code examples for custom hook optimizations',
    'Mention memory leak prevention when cleaning up side effects',
  ],
}) => {
  return (
    <Card padding="md" className="w-full bg-white border-gray-200">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-warning">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="text-base font-bold text-gray-900">Areas for Improvement</h3>
        </div>

        <ul className="space-y-3">
          {weaknesses.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-warning shrink-0 mt-2" />
              <span className="text-sm text-gray-700 leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
