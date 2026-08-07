import React from 'react';
import { Bot } from 'lucide-react';

interface TypingIndicatorProps {
  isVisible?: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div
      className="flex items-center gap-3 my-3 sm:my-4 flex-row justify-start"
      aria-label="AI is thinking"
      role="status"
    >
      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-indigo-500 to-primary text-white shrink-0 shadow-sm">
        <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      <div className="flex items-center gap-2 px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <span className="font-medium">AI is thinking</span>
        <span className="flex items-center gap-1 ml-1">
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
        </span>
      </div>
    </div>
  );
};
