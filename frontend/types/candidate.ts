export type Technology = 'React' | 'Node.js' | 'Python' | 'Java' | 'JavaScript' | 'TypeScript';

export type ExperienceLevel = 'Fresher' | '1-2 Years' | '3-5 Years' | '5+ Years';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Candidate {
  id: number;
  name: string;
  role: string;
  experience: string;
  technology?: Technology | string;
  difficulty?: Difficulty | string;
}
