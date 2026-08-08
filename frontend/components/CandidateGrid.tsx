import React from 'react';
import { Candidate } from '@/types/candidate';
import { CandidateCard } from './CandidateCard';

interface CandidateGridProps {
  candidates: Candidate[];
}

export const CandidateGrid: React.FC<CandidateGridProps> = ({ candidates }) => {
  if (!candidates || candidates.length === 0) {
    return (
      <div className="text-center py-12 bg-surface border border-dashed border-gray-300 rounded-2xl">
        <p className="text-gray-500 text-sm">No candidates available.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {candidates.map((candidate, idx) => {
        const key = candidate.member?.id || candidate.id || idx;
        return <CandidateCard key={key} candidate={candidate} />;
      })}
    </div>
  );
};
