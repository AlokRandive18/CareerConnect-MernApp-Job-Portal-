import React, { useEffect, useState } from 'react';
import { getJobApplications, updateApplicationStatus } from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export const EmployerApplicants = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [jobId, setJobId] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchApplicants = async () => {
    if (!jobId) return setError('Enter a Job ID');
    setLoading(true);
    setError('');
    try {
      const res = await getJobApplications(jobId);
      setApplications(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  const changeStatus = async (applicationId, status) => {
    try {
      await updateApplicationStatus(applicationId, { status });
      setApplications(prev => prev.map(a => a._id === applicationId ? { ...a, status } : a));
    } catch (err) {
      alert('Failed to update status');
    }
  };

  if (!user) return <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>Please login</div>;
  if (user.userType !== 'employer') return <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>Employer access only</div>;

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-5xl mx-auto">
        <h1 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Applicants for Your Job</h1>

        <div className="mb-6">
          <input value={jobId} onChange={e => setJobId(e.target.value)} placeholder="Enter Job ID" className="input-modern w-full" />
          <div className="mt-3 flex gap-3">
            <button onClick={fetchApplicants} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Fetch Applicants</button>
            <button onClick={() => { setJobId(''); setApplications([]); }} className="px-4 py-2 bg-gray-300 rounded-lg">Clear</button>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>

        {loading && <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>Loading...</p>}

        <div className="space-y-4">
          {applications.map(app => (
            <div key={app._id} className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>{app.userId?.firstName} {app.userId?.lastName}</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{app.userId?.email} • {new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <select defaultValue={app.status} onChange={(e) => changeStatus(app._id, e.target.value)} className="input-modern text-sm">
                    <option value="pending">pending</option>
                    <option value="reviewed">reviewed</option>
                    <option value="shortlisted">shortlisted</option>
                    <option value="rejected">rejected</option>
                    <option value="accepted">accepted</option>
                  </select>
                </div>
              </div>
              {app.coverLetter && <p className={`mt-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{app.coverLetter}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
