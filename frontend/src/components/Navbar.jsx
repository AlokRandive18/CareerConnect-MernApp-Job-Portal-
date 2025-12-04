import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { CareerConnectLogo } from './CareerConnectLogo.jsx';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 dark:border-b dark:border-gray-700 shadow-2xl transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 text-white hover:opacity-90 transition-opacity"
            title="CareerConnect - Find Your Perfect Job"
          >
            <CareerConnectLogo size="md" isDark={isDark} />
            <span className="hidden sm:inline font-bold text-lg md:text-xl bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              CareerConnect
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <Link 
                  to="/jobs" 
                  className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Jobs
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                {user.userType === 'job_seeker' && (
                  <>
                    <Link 
                      to="/applications" 
                      className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                    >
                      My Applications
                    </Link>
                    <Link 
                      to="/ai-jobs" 
                      className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium flex items-center gap-1"
                    >
                      🤖 AI Jobs
                    </Link>
                  </>
                )}
                {user.userType === 'employer' && (
                  <Link 
                    to="/employer/applicants" 
                    className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                  >
                    Applicants
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Profile
                </Link>
                <div className="flex items-center gap-4 pl-8 border-l border-blue-400 dark:border-gray-700">
                  <span className="text-white font-medium text-sm">
                    {user.firstName}
                  </span>
                  <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all text-white"
                    title={isDark ? 'Light Mode' : 'Dark Mode'}
                  >
                    {isDark ? '☀️' : '🌙'}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Login
                </Link>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all text-white"
                  title={isDark ? 'Light Mode' : 'Dark Mode'}
                >
                  {isDark ? '☀️' : '🌙'}
                </button>
                <Link 
                  to="/register" 
                  className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-white bg-opacity-20 hover:bg-opacity-30 transition-all text-white text-xl"
              title={isDark ? 'Light Mode' : 'Dark Mode'}
            >
              {isDark ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-blue-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-blue-400 dark:border-gray-700">
            {user ? (
              <div className="space-y-3 pt-4">
                <Link
                  to="/jobs"
                  className="block text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Jobs
                </Link>
                <Link
                  to="/dashboard"
                  className="block text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {user.userType === 'job_seeker' && (
                  <>
                    <Link
                      to="/applications"
                      className="block text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/ai-jobs"
                      className="block text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      🤖 AI Job Suggester
                    </Link>
                  </>
                )}
                {user.userType === 'employer' && (
                  <Link
                    to="/employer/applicants"
                    className="block text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Applicants
                  </Link>
                )}
                <Link
                  to="/profile"
                  className="block text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3 pt-4">
                <Link
                  to="/login"
                  className="block text-white hover:text-blue-200 dark:hover:text-blue-300 transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
