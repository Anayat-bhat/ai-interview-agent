'use client';

import React from 'react';
import Link from 'next/link';
import { Candidate } from '@/types/candidate';
import { CandidateAvatar } from './CandidateAvatar';
import { Button } from './ui/Button';
import { Briefcase, ArrowRight, Clock, GraduationCap, CheckCircle2 } from 'lucide-react';

interface CandidateCardProps {
  candidate: Candidate;
}

export const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const candidateId = candidate.member?.id || candidate.id || 1;
  const name = candidate.member?.name || candidate.name || 'Candidate';
  const role = candidate.member?.jobRole || candidate.jobRole || candidate.role || 'Software Engineer';
  const experience = candidate.member?.yearsExperience !== undefined
    ? `${candidate.member.yearsExperience} Yrs Exp`
    : candidate.yearsExperience !== undefined
    ? `${candidate.yearsExperience} Yrs Exp`
    : candidate.experience || '3 Years';
  const education = candidate.member?.education || candidate.education || '';
  const missionsCompleted = candidate.signals?.missionsCompleted;

  return (
    <div className="group relative bg-surface border border-surface-border rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Top Header: Avatar & Experience Badge */}
        <div className="flex items-start justify-between gap-3">
          <CandidateAvatar name={name} size="md" />
          <div className="flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-600 shadow-xs">
              <Clock className="w-3 h-3 text-primary" />
              {experience}
            </span>
            {missionsCompleted !== undefined && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                {missionsCompleted} Missions
              </span>
            )}
          </div>
        </div>

        {/* Candidate Info */}
        <div className="space-y-1.5 pt-1">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight group-hover:text-primary transition-colors">
            {name}
          </h3>
          <p className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <span>{role}</span>
          </p>
          {education && (
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              <span className="truncate">{education}</span>
            </p>
          )}
        </div>
      </div>

      {/* Start Interview Action */}
      <div className="pt-6 mt-4 border-t border-gray-100">
        <Link href={`/interview?id=${candidateId}`} className="block w-full">
          <Button
            variant="primary"
            size="md"
            fullWidth
            icon={<ArrowRight className="w-4 h-4 ml-auto transition-transform duration-200 group-hover:translate-x-1" />}
            className="flex items-center justify-between"
          >
            Start Interview
          </Button>
        </Link>
      </div>
    </div>
  );
};
