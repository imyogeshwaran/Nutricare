import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-6">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="mb-4">
            <Link to="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-teal-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="ml-2 text-lg font-semibold text-gray-800">NutriCare</span>
            </Link>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <span className="mr-1">Made with</span>
            <Heart size={16} className="text-red-500 mx-1" />
            <span>for better health</span>
          </div>
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} NutriCare. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;