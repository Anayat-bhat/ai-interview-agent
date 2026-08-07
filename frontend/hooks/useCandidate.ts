import { useState } from 'react';
import { Candidate } from '@/types/candidate';

/**
 * Reusable hook placeholder for candidate form management
 */
export function useCandidate() {
  const [candidate, setCandidate] = useState<Candidate>({
    id: 1,
    name: '',
    role: '',
    experience: '',
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
      id: 1,
      name: '',
      role: '',
      experience: '',
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
