import React from 'react';
import candidatesData from '@/data/candidates.json';
import { CandidateGrid } from '@/components/CandidateGrid';
import { PageContainer } from '@/components/layout/PageContainer';
import { Badge } from '@/components/ui/Badge';
import { Users, Sparkles } from 'lucide-react';
import { Candidate } from '@/types/candidate';

export default function CandidateSelectionPage() {
  const candidates: Candidate[] = candidatesData;

  return (
    <PageContainer maxWidth="xl" className="space-y-8">
      {/* Header Section */}
      <div className="space-y-3 pb-6 border-b border-gray-200">
        <Badge variant="primary" icon={<Sparkles className="w-3.5 h-3.5" />}>
          Candidate Assessment Portal
        </Badge>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Select a Candidate
          </h1>
        </div>
        <p className="text-base text-gray-500 max-w-2xl">
          Choose a candidate to begin the AI interview.
        </p>
      </div>

      {/* Candidate Grid Section */}
      <section aria-label="Available Candidates">
        <CandidateGrid candidates={candidates} />
      </section>
    </PageContainer>
  );
}
