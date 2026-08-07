import React from 'react';

interface ScoreCircleProps {
  score: number; // 0 - 100
  size?: number; // width/height in px
  strokeWidth?: number;
  label?: string;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({
  score = 86,
  size = 140,
  strokeWidth = 10,
  label = 'Overall Score',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="text-gray-100"
            strokeWidth={strokeWidth}
            stroke="currentColor"
            fill="transparent"
          />
          {/* Progress Circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="text-primary transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
            {score}%
          </span>
          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Passed
          </span>
        </div>
      </div>
      {label && <p className="mt-3 text-sm font-medium text-gray-600">{label}</p>}
    </div>
  );
};
