import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  padding = 'md',
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hoverable
    ? 'transition-all duration-200 hover:shadow-card-hover hover:border-gray-300'
    : '';

  return (
    <div
      className={`bg-surface border border-surface-border rounded-2xl shadow-card ${paddingStyles[padding]} ${hoverStyles} ${className}`}
    >
      {children}
    </div>
  );
};
