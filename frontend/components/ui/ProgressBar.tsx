import React from 'react';

interface ProgressBarProps {
  value: number; // 0 - 100 or current value relative to max
  max?: number;
  height?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showValue?: boolean;
  className?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  height = 'md',
  showLabel = false,
  showValue = false,
  className = '',
  color = 'primary',
}) => {
  const percentage = (value / max) * 100;
  const clampedValue = Math.min(100, Math.max(0, percentage));
  const shouldShowLabel = showLabel || showValue;

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorMap = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    danger: 'bg-danger',
  };

  return (
    <div className={`w-full ${className}`}>
      {shouldShowLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-gray-500">
          <span>Progress</span>
          <span>{Math.round(clampedValue)}%</span>
        </div>
      )}
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightMap[height]}`}>
        <div
          className={`h-full ${colorMap[color]} transition-all duration-300 ease-out rounded-full`}
          style={{ width: `${clampedValue}%` }}
          role="progressbar"
          aria-valuenow={clampedValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
