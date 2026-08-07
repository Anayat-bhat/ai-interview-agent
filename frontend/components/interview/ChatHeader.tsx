import React from 'react';
import Link from 'next/link';
import { Bot, ChevronLeft } from 'lucide-react';
import { Badge } from '../ui/Badge';

interface ChatHeaderProps {
  candidateName?: string;
  candidateRole?: string;
  currentQuestion?: number;
  totalQuestions?: number;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  candidateName = 'John Doe',
  candidateRole = 'Frontend Developer',
  currentQuestion = 2,
  totalQuestions = 10,
}) => {
  return (
    <header className="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 py-3 shadow-xs">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
        {/* Left: App Title & Back Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Back to candidate selection"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-primary text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">
                AI Interview Agent
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Evaluating <span className="font-semibold text-gray-700 dark:text-gray-300">{candidateName}</span> ({candidateRole})
              </p>
            </div>
          </div>
        </div>

        {/* Right: Progress & Status */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-gray-900 dark:text-gray-100">
              Question {currentQuestion} / {totalQuestions}
            </span>
            <span className="text-[11px] text-gray-400">Progress</span>
          </div>

          <Badge variant="success" className="gap-1.5 px-3 py-1 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Interview Active
          </Badge>
        </div>
      </div>
    </header>
  );
};
