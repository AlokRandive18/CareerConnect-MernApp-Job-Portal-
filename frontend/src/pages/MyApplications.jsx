import React, { useEffect, useState } from 'react';
import { getMyApplications } from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

const statusColors = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', darkBg: 'dark:bg-yellow-900', darkText: 'dark:text-yellow-300' },
  reviewed: { bg: 'bg-blue-100', text: 'text-blue-800', darkBg: 'dark:bg-blue-900', darkText: 'dark:text-blue-300' },
  shortlisted: { bg: 'bg-purple-100', text: 'text-purple-800', darkBg: 'dark:bg-purple-900', darkText: 'dark:text-purple-300' },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', darkBg: 'dark:bg-red-900', darkText: 'dark:text-red-300' },
  accepted: { bg: 'bg-green-100', text: 'text-green-800', darkBg: 'dark:bg-green-900', darkText: 'dark:text-green-300' }
};

export const MyApplications = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const res = await getMyApplications();
        setApplications(res.data.data || []);
      } catch (err) {
        setError('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    if (user?.userType === 'job_seeker') {
      fetchApplications();
    }
  }, [user]);

  if (!user) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        Please login to view your applications
      </div>
    );
  }

  if (user.userType !== 'job_seeker') {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
        This page is for job seekers only
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        <h1 className={`text-4xl font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>My Applications</h1>
        <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Track all your job applications and their status</p>

        {error && (
          <div className={`mb-6 p-4 rounded-lg ${isDark ? 'bg-red-900 bg-opacity-30 text-red-300' : 'bg-red-100 text-red-700'}`}>
            {error}
          </div>
        )}

        {loading && (
          <div className={`text-center py-12 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Loading your applications...
          </div>
        )}

        {!loading && applications.length === 0 && (
          <div className={`text-center py-12 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow`}>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>You haven't applied to any jobs yet</p>
            <p className={`text-sm mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Start exploring jobs and apply now!</p>
          </div>
        )}

        {!loading && applications.length > 0 && (
          <div className="space-y-4">
            {applications.map(app => {
              const colors = statusColors[app.status] || statusColors.pending;
              return (
                <div key={app._id} className={`p-6 rounded-lg shadow ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {app.jobId?.title || 'Job Title'}
                      </h3>
                      <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {app.jobId?.company || 'Company'} • {app.jobId?.location || 'Location'}
                      </p>
                      <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        Applied on {new Date(app.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-3">
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${colors.bg} ${colors.text} ${colors.darkBg} ${colors.darkText}`}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </span>
                      {app.jobId?.salaryMin && app.jobId?.salaryMax && (
                        <p className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          💰 ${app.jobId.salaryMin.toLocaleString()} - ${app.jobId.salaryMax.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {app.coverLetter && (
                    <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                      <p className={`text-sm font-semibold mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Cover Letter:</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{app.coverLetter}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
