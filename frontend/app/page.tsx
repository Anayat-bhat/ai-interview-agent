'use client';

import React from 'react';
import candidatesData from '@/data/candidates.json';
import { CandidateGrid } from '@/components/CandidateGrid';
import { CandidateForm } from '@/components/candidate/CandidateForm';
import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/Badge';
import { Sparkles, Bot, CheckCircle2, ShieldCheck, Zap, Code2 } from 'lucide-react';
import { Candidate } from '@/types/candidate';

export default function CandidateSelectionPage() {
  const candidates: Candidate[] = (candidatesData as any).candidates || candidatesData;

  return (
    <PageContainer maxWidth="xl" className="space-y-12 py-6">
      {/* Hero / Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />} className="mx-auto">
          AI Technical Interview Platform
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Start Your <span className="text-primary">AI Interview</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Configure candidate details below to launch an automated, real-time technical evaluation aligned with official curriculum & technical specifications.
        </p>
      </div>

      {/* Main Grid Section: Candidate Form + Right Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Columns: Candidate Information Card */}
        <div className="lg:col-span-7">
          <CandidateForm />
        </div>

        {/* Right 5 Columns: Illustration / Hero Features Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-blue-800/50 space-y-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -z-0 pointer-events-none" />

            <div className="flex items-center gap-3 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                <Bot className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">AI Assessor Engine</h3>
                <span className="text-xs font-semibold text-blue-300 uppercase tracking-wider">
                  POST /api/interview Spec Ready
                </span>
              </div>
            </div>

            <p className="text-sm text-blue-100/90 leading-relaxed relative z-10">
              Our AI Interview Agent conducts structured technical interviews tailored to candidate records, evaluating skills, problem solving, and curriculum milestones.
            </p>

            <div className="space-y-3 pt-2 border-t border-white/10 relative z-10">
              <div className="flex items-center gap-3 text-xs font-medium text-blue-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>20+ Real Candidate Profiles & Signals</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-blue-200">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>31-Day AI Curriculum & Mission Benchmarks</span>
              </div>
              <div className="flex items-center gap-3 text-xs font-medium text-blue-200">
                <Zap className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Strict Technical Specification API Contract</span>
              </div>
            </div>
          </div>

          {/* Quick preset candidates summary card */}
          <div className="bg-surface border border-surface-border rounded-2xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-primary" />
              <h4 className="text-sm font-bold text-gray-900">Official Candidate Roster</h4>
            </div>
            <p className="text-xs text-gray-500">
              Select any candidate from the official roster below to launch their interview evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Candidate Grid Section */}
      <section aria-label="Available Candidates" className="space-y-4 pt-6 border-t border-gray-200">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Official Candidate Roster</h2>
          <p className="text-xs text-gray-500">
            Real candidate records loaded from candidates.json dataset.
          </p>
        </div>
        <CandidateGrid candidates={candidates} />
      </section>
    </PageContainer>
  );
}
