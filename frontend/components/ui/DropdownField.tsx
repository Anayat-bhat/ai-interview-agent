import React, { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  options: DropdownOption[];
  error?: string;
  icon?: React.ReactNode;
}

export const DropdownField: React.FC<DropdownFieldProps> = ({
  label,
  id,
  options,
  error,
  icon,
  className = '',
  required,
  ...props
}) => {
  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-900">
        {label}
        {required && <span className="ml-1 text-danger">*</span>}
      </label>
      <div className="relative rounded-xl shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <select
          id={id}
          required={required}
          className={`w-full bg-white border ${
            error ? 'border-danger' : 'border-gray-300'
          } rounded-xl py-3 ${
            icon ? 'pl-10' : 'pl-4'
          } pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20 transition duration-150 appearance-none cursor-pointer ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-gray-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs text-danger font-medium mt-1">{error}</p>}
    </div>
  );
};
