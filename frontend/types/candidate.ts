export type Technology = 'React' | 'Node.js' | 'Python' | 'Java' | 'JavaScript' | 'TypeScript';
export type ExperienceLevel = 'Fresher' | '1-2 Years' | '3-5 Years' | '5+ Years';
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Member {
  id: string;
  name: string;
  jobRole: string;
  yearsExperience: number;
  education: string;
  status: string;
}

export interface Mission {
  day: number;
  title: string;
  passed?: boolean;
  attempts?: number;
  skipped?: boolean;
}

export interface Signals {
  commitDays: number;
  missionsCompleted: number;
  missionsFirstTry: number;
}

export interface CandidateRecord {
  member: Member;
  missions: Mission[];
  signals: Signals;
}

export interface Candidate {
  id: number | string;
  name: string;
  role: string;
  experience: string;
  fullName?: string;
  email?: string;
  jobRole?: string;
  yearsExperience?: number;
  education?: string;
  technology?: Technology | string;
  experienceLevel?: ExperienceLevel | string;
  difficulty?: Difficulty | string;
  member?: Member;
  missions?: Mission[];
  signals?: Signals;
}
