import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { ChevronDown, User, LogOut, Menu } from 'lucide-react';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md relative z-50">
      <div className="container mx-auto px-4 max-w-full">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-teal-600 transition duration-300 md:hidden"
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
            <Link to="/" className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-teal-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-800">NutriCare</span>
            </Link>
          </div>
          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center">
            <div className="flex space-x-4">
              <Link to="/" className="px-3 py-2 text-gray-700 hover:text-teal-600 transition duration-300">
                Home
              </Link>
              <Link to="/nutrients" className="px-3 py-2 text-gray-700 hover:text-teal-600 transition duration-300">
                Nutrients
              </Link>
              <Link to="/analyze" className="px-3 py-2 text-gray-700 hover:text-teal-600 transition duration-300">
                Analyze
              </Link>
              <Link to="/learn" className="px-3 py-2 text-gray-700 hover:text-teal-600 transition duration-300">
                Learn
              </Link>
              <Link to="/diet-plan" className="px-3 py-2 text-gray-700 hover:text-teal-600 transition duration-300">
                Fix Your Diet Plan
              </Link>
              {!isAuthenticated && (
                <>
                  <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-teal-600 transition duration-300">
                    Login
                  </Link>
                  <Link to="/register" className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300">
                    Register
                  </Link>
                </>
              )}
              {isAuthenticated && user && (
                <div className="relative">
                  <button
                    onClick={toggleProfile}
                    className="flex items-center px-3 py-2 text-gray-700 hover:text-teal-600 transition duration-300"
                  >
                    <User size={20} className="mr-1" />
                    <span>{user.name}</span>
                    <ChevronDown size={16} className="ml-1" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 divide-y divide-gray-100">
                      <div className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                        <p className="text-sm text-gray-500 truncate">{user.createdAt}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50"
                        >
                          <div className="flex items-center">
                            <LogOut size={16} className="mr-2" />
                            <span>Logout</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg py-2">
          <div className="flex flex-col space-y-2 px-4">
            <Link to="/" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100 rounded-md transition duration-300">
              Home
            </Link>
            <Link to="/profile" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100 rounded-md transition duration-300">
              Profile
            </Link>
            <Link to="/diet-plan" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100 rounded-md transition duration-300">
              Fix Your Diet Plan
            </Link>
            <Link to="/nutrients" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100 rounded-md transition duration-300">
              Nutrients
            </Link>
            <Link to="/analyze" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100 rounded-md transition duration-300">
              Analyze
            </Link>
            <Link to="/learn" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100 rounded-md transition duration-300">
              Learn
            </Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100 rounded-md transition duration-300">
                  Login
                </Link>
                <Link to="/register" className="px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition duration-300">
                  Register
                </Link>
              </>
            )}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center px-3 py-2 text-gray-700 hover:text-teal-600 hover:bg-gray-100 rounded-md transition duration-300"
              >
                <LogOut size={16} className="mr-2" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;