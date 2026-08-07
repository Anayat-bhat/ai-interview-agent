import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { HelpCircle, Code, Award } from 'lucide-react';
import { Difficulty } from '@/types/candidate';

interface QuestionCardProps {
  questionNumber: number;
  totalQuestions: number;
  title: string;
  description: string;
  category?: string;
  difficulty?: Difficulty;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber = 3,
  totalQuestions = 10,
  title = 'Explain React Virtual DOM and why it improves rendering performance.',
  description = 'Detailed technical question assessing foundational concepts of the synthetic DOM tree, diffing algorithms (reconciliation), batching updates, and avoiding costly real DOM operations.',
  category = 'React / Frontend Architecture',
  difficulty = 'Medium',
}) => {
  return (
    <Card padding="lg" className="w-full bg-surface border-surface-border">
      <div className="space-y-4">
        {/* Header tags */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-200 pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="primary" icon={<Code className="w-3.5 h-3.5" />}>
              {category}
            </Badge>
            <Badge variant="warning" icon={<Award className="w-3.5 h-3.5" />}>
              {difficulty}
            </Badge>
          </div>
          <span className="text-xs font-semibold text-gray-500 bg-white px-2.5 py-1 rounded-full border border-gray-200">
            Question {questionNumber} of {totalQuestions}
          </span>
        </div>

        {/* Question content */}
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-primary flex items-center justify-center shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight leading-snug">
                {title}
              </h2>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
