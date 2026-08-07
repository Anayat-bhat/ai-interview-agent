import React from 'react';
import { Card } from '../ui/Card';
import { CheckCircle2, ThumbsUp } from 'lucide-react';

interface StrengthCardProps {
  strengths?: string[];
}

export const StrengthCard: React.FC<StrengthCardProps> = ({
  strengths = [
    'Deep understanding of Virtual DOM reconciliation algorithms',
    'Clear explanations of asynchronous state updates and batching',
    'Effective use of accurate frontend performance terminology',
    'Logical problem-solving breakdown during technical scenarios',
  ],
}) => {
  return (
    <Card padding="md" className="w-full bg-white border-gray-200">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-success">
          <ThumbsUp className="w-5 h-5" />
          <h3 className="text-base font-bold text-gray-900">Key Strengths</h3>
        </div>

        <ul className="space-y-3">
          {strengths.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};
