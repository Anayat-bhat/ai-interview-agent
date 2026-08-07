import React, { InputHTMLAttributes } from 'react';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  id,
  error,
  helperText,
  icon,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-900"
      >
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      <div className="relative rounded-xl shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          required={required}
          className={`w-full bg-white border ${
            error ? 'border-danger focus:ring-danger' : 'border-gray-300 focus:ring-primary'
          } rounded-xl py-3 ${
            icon ? 'pl-10' : 'pl-4'
          } pr-4 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-opacity-20 transition duration-150 ${className}`}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-danger font-medium mt-1">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
};
