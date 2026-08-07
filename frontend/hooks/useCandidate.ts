import { useState } from 'react';
import { Candidate, Technology, ExperienceLevel, Difficulty } from '@/types/candidate';

/**
 * Reusable hook placeholder for candidate form management
 */
export function useCandidate() {
  const [candidate, setCandidate] = useState<Candidate>({
    fullName: '',
    email: '',
    technology: 'React',
    experienceLevel: '1-2 Years',
    difficulty: 'Medium',
  });

  const updateCandidate = (fields: Partial<Candidate>) => {
    setCandidate((prev) => ({ ...prev, ...fields }));
  };

  const resetCandidate = () => {
    setCandidate({
      fullName: '',
      email: '',
      technology: 'React',
      experienceLevel: '1-2 Years',
      difficulty: 'Medium',
    });
  };

  return {
    candidate,
    updateCandidate,
    resetCandidate,
  };
}
