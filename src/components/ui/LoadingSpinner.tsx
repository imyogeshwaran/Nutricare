import React from 'react';
import styles from '../../styles/animations.module.css';

interface LoadingSpinnerProps {
  isVisible?: boolean;
  message?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  isVisible = false,
  message = 'Loading...'
}) => {
  if (!isVisible) return null;
  return (    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute w-full h-full border-4 border-t-transparent border-emerald-500 rounded-full animate-spin"></div>
        <div className="absolute w-10 h-10 border-4 border-b-transparent border-emerald-500 rounded-full animate-spin-slow"></div>
      </div>
      <h3 className={`text-emerald-600 text-lg font-medium mt-4 ${styles.fadeSlideIn}`}>
        {message}
      </h3>
      <p className={`text-gray-500 text-sm mt-2 ${styles.fadeSlideIn}`} style={{ animationDelay: '0.2s' }}>
        This may take a few moments...
      </p>
    </div>
  );
};

// Add the following CSS to your global styles or a CSS module:
// .animate-spin {
//   animation: spin 1s linear infinite;
// }
// @keyframes spin {
//   from {
//     transform: rotate(0deg);
//   }
//   to {
//     transform: rotate(360deg);
//   }
// }