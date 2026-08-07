import React from 'react';
import Link from 'next/link';
import { Bot, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900 tracking-tight block leading-none">
                AI Interview Agent
              </span>
              <span className="text-[10px] font-medium text-gray-500 tracking-widest uppercase">
                Technical Assessor
              </span>
            </div>
          </Link>

          {/* Right actions/navigation */}
          <nav className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              Candidate Portal
            </Link>
            <Link
              href="/interview"
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              Interview Room
            </Link>
            <Link
              href="/feedback"
              className="text-sm font-medium text-gray-600 hover:text-primary transition-colors py-2 px-3 rounded-lg hover:bg-gray-50"
            >
              Reports
            </Link>
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-xs font-semibold text-primary">
              <Sparkles className="w-3.5 h-3.5" />
              <span>v1.0 Demo</span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};
