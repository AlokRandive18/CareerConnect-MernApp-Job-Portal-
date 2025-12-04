import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export const Landing = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center fade-in">
          {/* Left Content */}
          <div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 gradient-text leading-tight">
              Find Your Dream Job Today
            </h1>
            <p className={`text-lg md:text-xl mb-8 leading-relaxed transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Connect with top employers and opportunities. Build your career with the most innovative job portal.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              {!user ? (
                <>
                  <Link 
                    to="/register" 
                    className="btn-gradient px-8 py-4 text-white font-bold rounded-lg text-center hover:scale-105 transition-transform"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login" 
                    className={`px-8 py-4 border-2 font-bold rounded-lg text-center transition-colors ${isDark ? 'border-blue-400 text-blue-400 hover:bg-gray-700' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}`}
                  >
                    Login
                  </Link>
                </>
              ) : (
                <Link 
                  to="/jobs" 
                  className="btn-gradient px-8 py-4 text-white font-bold rounded-lg text-center hover:scale-105 transition-transform"
                >
                  Browse Jobs
                </Link>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 mt-12">
              <div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">10K+</p>
                <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Jobs Posted</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">5K+</p>
                <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Active Users</p>
              </div>
            </div>
          </div>

          {/* Right Image/Illustration */}
          <div className="hidden md:flex items-center justify-center slide-in-right">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl blur-3xl opacity-20"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-12 text-white">
                <div className="space-y-4">
                  <div className="h-12 bg-white bg-opacity-20 rounded-lg"></div>
                  <div className="h-12 bg-white bg-opacity-20 rounded-lg"></div>
                  <div className="h-12 bg-white bg-opacity-20 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 md:py-24 transition-colors duration-300 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 gradient-text">Why Choose Us?</h2>
          <p className={`text-center text-lg mb-12 max-w-2xl mx-auto transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Everything you need to advance your career journey
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '🎯',
                title: 'Smart Matching',
                desc: 'AI-powered job recommendations based on your skills'
              },
              {
                icon: '🔒',
                title: 'Secure & Safe',
                desc: 'Your data is protected with enterprise-grade security'
              },
              {
                icon: '⚡',
                title: 'Lightning Fast',
                desc: 'Quick application process and instant notifications'
              }
            ].map((feature, i) => (
              <div key={i} className={`card-modern p-8 text-center hover:scale-105 transition-transform ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                <p className="text-5xl mb-4">{feature.icon}</p>
                <h3 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
                <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-gray-900 dark:to-gray-800 dark:border-t dark:border-gray-700 py-16 md:py-24 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-white'}`}>Ready to Start?</h2>
          <p className={`text-xl mb-8 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-blue-100'}`}>
            Join thousands of professionals finding their perfect job opportunity
          </p>
          {!user && (
            <Link 
              to="/register" 
              className={`inline-block px-10 py-4 font-bold rounded-lg transition-colors hover:scale-105 ${isDark ? 'bg-gray-700 text-blue-300 hover:bg-gray-600' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
            >
              Create Free Account
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};
