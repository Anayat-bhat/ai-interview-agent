import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'secondary';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  className = '',
  icon,
}) => {
  const variantStyles = {
    primary: 'bg-primary-light text-primary border-blue-200',
    success: 'bg-success-light text-success border-green-200',
    warning: 'bg-warning-light text-warning border-amber-200',
    danger: 'bg-danger-light text-danger border-red-200',
    secondary: 'bg-surface text-gray-700 border-gray-200',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-lg border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
};
