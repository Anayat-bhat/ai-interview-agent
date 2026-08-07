'use client';

import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { MessageSquare, Sparkles } from 'lucide-react';

interface AnswerBoxProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export const AnswerBox: React.FC<AnswerBoxProps> = ({
  value: externalValue,
  onChange,
  placeholder = 'Type your detailed technical explanation here... Include key concepts, code structure, or architectural details where applicable.',
}) => {
  const [internalValue, setInternalValue] = useState('');
  const currentValue = externalValue !== undefined ? externalValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    if (onChange) {
      onChange(val);
    } else {
      setInternalValue(val);
    }
  };

  const wordCount = currentValue.trim() ? currentValue.trim().split(/\s+/).length : 0;

  return (
    <Card padding="md" className="w-full">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="answer-input" className="flex items-center gap-2 text-sm font-semibold text-gray-900">
            <MessageSquare className="w-4 h-4 text-primary" />
            Your Answer
          </label>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1 text-primary font-medium">
              <Sparkles className="w-3.5 h-3.5" /> AI Evaluation Active
            </span>
            <span>|</span>
            <span>{wordCount} words</span>
          </div>
        </div>

        <textarea
          id="answer-input"
          rows={8}
          value={currentValue}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full p-4 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 focus:border-primary transition duration-150 resize-y leading-relaxed font-sans"
          aria-label="Your interview answer"
        />

        <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
          <span>Tip: You can use markdown code snippets if needed.</span>
          <span>Auto-saving response...</span>
        </div>
      </div>
    </Card>
  );
};
