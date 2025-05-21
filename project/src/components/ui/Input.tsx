import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  helper?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
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
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {leftIcon}
          </div>
        )}
        
        <input
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300'
          } rounded-lg focus:outline-none focus:ring-2 ${
            error ? 'focus:ring-red-500' : 'focus:ring-teal-500'
          } focus:border-transparent ${leftIcon ? 'pl-10' : ''} ${
            rightIcon ? 'pr-10' : ''
          } ${className}`}
          {...rest}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      {helper && !error && <p className="mt-1 text-sm text-gray-500">{helper}</p>}
    </div>
  );
};

export default Input;