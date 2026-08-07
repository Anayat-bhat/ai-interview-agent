import React from 'react';

interface CandidateAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CandidateAvatar: React.FC<CandidateAvatarProps> = ({
  name,
  size = 'md',
  className = '',
}) => {
  // Generate initials from name (e.g. "John Doe" -> "JD")
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const sizeClasses = {
    sm: 'w-10 h-10 text-xs font-bold',
    md: 'w-14 h-14 text-base font-bold',
    lg: 'w-20 h-20 text-xl font-extrabold',
  };

  // Curated SaaS gradient/color variations based on name length
  const bgGradients = [
    'bg-gradient-to-br from-blue-500 to-indigo-600 text-white',
    'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    'bg-gradient-to-br from-violet-500 to-purple-600 text-white',
    'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
  ];
  const gradientClass = bgGradients[name.length % bgGradients.length];

  return (
    <div
      className={`inline-flex items-center justify-center rounded-2xl shadow-sm ${gradientClass} ${sizeClasses[size]} ${className}`}
      aria-label={`Avatar for ${name}`}
    >
      <span className="tracking-wider">{initials}</span>
    </div>
  );
};
