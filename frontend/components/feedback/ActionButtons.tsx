'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCcw, ArrowLeft } from 'lucide-react';

interface ActionButtonsProps {
  className?: string;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ className = '' }) => {
  return (
    <nav
      aria-label="Feedback page actions"
      className={`flex flex-col sm:flex-row items-center justify-center gap-4 pt-6 border-t border-gray-200 ${className}`}
    >
      <Link
        href="/interview"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-xl shadow-sm hover:shadow transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <RotateCcw className="w-4 h-4" aria-hidden="true" />
        <span>Retake Interview</span>
      </Link>

      <Link
        href="/"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 border border-gray-300 rounded-xl shadow-xs hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        <span>Back to Candidates</span>
      </Link>
    </nav>
  );
};
