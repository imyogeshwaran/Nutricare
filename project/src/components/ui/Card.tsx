import React from 'react';

interface CardProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerAction?: React.ReactNode;
  footer?: React.ReactNode;
  isHoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  children,
  className = '',
  headerAction,
  footer,
  isHoverable = false,
}) => {
  return (
    <div 
      className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
        isHoverable ? 'hover:shadow-lg transform hover:-translate-y-1' : ''
      } ${className}`}
    >
      {(title || subtitle || headerAction) && (
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            {title && <h3 className="font-semibold text-lg text-gray-800">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      
      <div className="p-6">{children}</div>
      
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card