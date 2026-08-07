'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Code, Briefcase, Gauge, Play } from 'lucide-react';
import { InputField } from '../ui/InputField';
import { DropdownField } from '../ui/DropdownField';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Technology, ExperienceLevel, Difficulty } from '@/types/candidate';
import { useInterviewContext } from '@/context/InterviewContext';

const techOptions: { value: Technology; label: string }[] = [
  { value: 'React', label: 'React' },
  { value: 'Node.js', label: 'Node.js' },
  { value: 'Python', label: 'Python' },
  { value: 'Java', label: 'Java' },
  { value: 'JavaScript', label: 'JavaScript' },
  { value: 'TypeScript', label: 'TypeScript' },
];

const experienceOptions: { value: ExperienceLevel; label: string }[] = [
  { value: 'Fresher', label: 'Fresher' },
  { value: '1-2 Years', label: '1-2 Years' },
  { value: '3-5 Years', label: '3-5 Years' },
  { value: '5+ Years', label: '5+ Years' },
];

const difficultyOptions: { value: Difficulty; label: string }[] = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

export const CandidateForm: React.FC = () => {
  const router = useRouter();
  const { candidate, setCandidate, resetSession } = useInterviewContext();

  const [formData, setFormData] = useState({
    fullName: candidate.fullName || '',
    email: candidate.email || '',
    technology: candidate.technology || 'React',
    experienceLevel: candidate.experienceLevel || '1-2 Years',
    difficulty: candidate.difficulty || 'Medium',
  });

  useEffect(() => {
    setFormData({
      fullName: candidate.fullName || '',
      email: candidate.email || '',
      technology: candidate.technology || 'React',
      experienceLevel: candidate.experienceLevel || '1-2 Years',
      difficulty: candidate.difficulty || 'Medium',
    });
  }, [candidate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCandidate({
      fullName: formData.fullName || 'Sarah Connor',
      email: formData.email || 'sarah@example.com',
      technology: formData.technology,
      experienceLevel: formData.experienceLevel,
      difficulty: formData.difficulty,
    });
    resetSession();
    router.push('/interview');
  };

  return (
    <Card padding="lg" className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-xl font-bold text-gray-900">Candidate Details</h2>
          <p className="text-xs text-gray-500 mt-1">
            Fill in your profile to customize your AI interview session.
          </p>
        </div>

        <div className="space-y-4">
          <InputField
            id="fullName"
            label="Full Name"
            placeholder="e.g. Sarah Connor"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            icon={<User className="w-4 h-4" />}
            required
          />

          <InputField
            id="email"
            type="email"
            label="Email Address"
            placeholder="e.g. sarah@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <DropdownField
            id="technology"
            label="Technology Domain"
            options={techOptions}
            value={formData.technology}
            onChange={(e) => setFormData({ ...formData, technology: e.target.value as Technology })}
            icon={<Code className="w-4 h-4" />}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DropdownField
              id="experience"
              label="Experience Level"
              options={experienceOptions}
              value={formData.experienceLevel}
              onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as ExperienceLevel })}
              icon={<Briefcase className="w-4 h-4" />}
              required
            />

            <DropdownField
              id="difficulty"
              label="Interview Difficulty"
              options={difficultyOptions}
              value={formData.difficulty}
              onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as Difficulty })}
              icon={<Gauge className="w-4 h-4" />}
              required
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            fullWidth
            icon={<Play className="w-5 h-5 fill-current" />}
          >
            Start Interview
          </Button>
        </div>
      </form>
    </Card>
  );
};
