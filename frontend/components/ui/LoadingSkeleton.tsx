import React from 'react';

interface LoadingSkeletonProps {
  className?: string;
  lines?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  className = '',
  lines = 1,
}) => {
  if (lines > 1) {
    return (
      <div className="space-y-3">
        {Array.from({ length: lines }).map((_, idx) => (
          <div
            key={idx}
            className={`bg-gray-200 animate-pulse rounded-lg h-4 w-full ${className}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`bg-gray-200 animate-pulse rounded-lg h-4 w-full ${className}`}
    />
  );
};
