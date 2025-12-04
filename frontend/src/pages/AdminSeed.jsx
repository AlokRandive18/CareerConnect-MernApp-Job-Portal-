import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext.jsx';
import API from '../lib/api.js';

export const AdminSeed = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSeed = async () => {
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await API.post('/seed');
      if (response.data.success) {
        setMessage(`✓ ${response.data.message}`);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to seed database');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">Admin - Seed Database</h1>
          <p className={`text-lg transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Populate the database with sample employers and jobs
          </p>
        </div>

        {/* Card */}
        <div className={`card-modern p-8 md:p-10 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {message && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 transition-colors duration-300 ${isDark ? 'bg-green-900 bg-opacity-30 border-green-500 text-green-300' : 'bg-green-50 border-green-500 text-green-700'}`}>
              {message}
            </div>
          )}

          {error && (
            <div className={`mb-6 p-4 rounded-lg border-l-4 transition-colors duration-300 ${isDark ? 'bg-red-900 bg-opacity-30 border-red-500 text-red-300' : 'bg-red-50 border-red-500 text-red-700'}`}>
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className={`p-6 rounded-lg transition-colors duration-300 ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
              <h2 className={`text-xl font-bold mb-3 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                📊 What will be created:
              </h2>
              <ul className={`space-y-2 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>✓ <strong>5 Employers</strong> with company profiles</li>
                <li>✓ <strong>11 Active Jobs</strong> ready for applications</li>
                <li>✓ Jobs include: titles, descriptions, salaries, skills, requirements</li>
                <li>✓ All data is realistic and production-ready</li>
              </ul>
            </div>

            <div className={`p-6 rounded-lg transition-colors duration-300 ${isDark ? 'bg-blue-900 bg-opacity-30 border border-blue-700' : 'bg-blue-50 border border-blue-200'}`}>
              <h3 className={`font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                ⚠️ Important:
              </h3>
              <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-blue-200' : 'text-blue-600'}`}>
                This endpoint can only be run once. After seeding, the database will have data and the seed endpoint will prevent duplicate seeding.
              </p>
            </div>

            <button
              onClick={handleSeed}
              disabled={loading}
              className="btn-gradient w-full py-3 text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Seeding Database...' : '🌱 Seed Database with Sample Data'}
            </button>
          </div>
        </div>

        {/* Sample Data Preview */}
        <div className={`card-modern p-8 mt-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            📋 Sample Data Preview
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Companies */}
            <div>
              <h3 className={`font-bold text-lg mb-3 transition-colors duration-300 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                Companies:
              </h3>
              <ul className={`space-y-2 text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>🏢 Infosys Technologies (Bangalore)</li>
                <li>🎨 SoftTech Innovations (Pune)</li>
                <li>💰 FinServe India (Mumbai)</li>
                <li>☁️ CloudIndia Systems (Hyderabad)</li>
                <li>🛒 EcomIndia Solutions (Delhi NCR)</li>
              </ul>
            </div>

            {/* Sample Jobs */}
            <div>
              <h3 className={`font-bold text-lg mb-3 transition-colors duration-300 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                Sample Jobs:
              </h3>
              <ul className={`space-y-2 text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>💼 Senior React Developer - ₹12-18 LPA</li>
                <li>🎨 UX/UI Designer - ₹7-10 LPA</li>
                <li>⚙️ Full Stack Developer - ₹10-15 LPA</li>
                <li>📊 Data Scientist - ₹13-20 LPA</li>
                <li>🚀 DevOps Engineer - ₹11-16 LPA</li>
                <li>+ 6 more positions...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
