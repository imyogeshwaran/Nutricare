import React, { SelectHTMLAttributes } from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
  helper?: string;
}

const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  helper,
  className = '',
  ...rest
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={rest.id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      
      <select
        className={`w-full px-3 py-2 border ${
          error ? 'border-red-500' : 'border-gray-300'
        } rounded-lg focus:outline-none focus:ring-2 ${
          error ? 'focus:ring-red-500' : 'focus:ring-teal-500'
        } focus:border-transparent bg-white ${className}`}
        {...rest}
      >
        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helper && !error && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
    </div>
  );
};

export default Select;