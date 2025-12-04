import React, { useEffect, useState } from 'react';
import { getJobs, applyForJob } from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { ApplicationForm } from '../components/ApplicationForm.jsx';

export const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    jobType: '',
    salaryMin: 0,
    // Large default max so salary filter doesn't hide all INR jobs
    salaryMax: 1000000000,
    experience: ''
  });
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedJobForApplication, setSelectedJobForApplication] = useState(null);
  const { user } = useAuth();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const response = await getJobs({ search: searchQuery });
        const jobsData = response?.data?.data || [];
        setJobs(jobsData);
        if (!jobsData.length) {
          setError('No jobs available right now. Try reseeding the database or check backend.');
        } else {
          setError('');
        }
      } catch (err) {
        console.error('Fetch jobs error', err);
        setError('Failed to fetch jobs. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [searchQuery]);

  // Apply filters on client-side
  useEffect(() => {
    let filtered = jobs;

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(job =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by job type
    if (filters.jobType) {
      filtered = filtered.filter(job => job.jobType === filters.jobType);
    }

    // Filter by salary range
    if (filters.salaryMin || filters.salaryMax) {
      filtered = filtered.filter(job => {
        const mid = (job.salaryMin + job.salaryMax) / 2;
        return mid >= filters.salaryMin && mid <= filters.salaryMax;
      });
    }

    // Filter by experience
    if (filters.experience) {
      filtered = filtered.filter(job => {
        const reqExp = parseInt(job.experience) || 0;
        if (filters.experience === '0-2') return reqExp <= 2;
        if (filters.experience === '2-5') return reqExp >= 2 && reqExp <= 5;
        if (filters.experience === '5-10') return reqExp >= 5 && reqExp <= 10;
        if (filters.experience === '10+') return reqExp > 10;
        return true;
      });
    }

    setFilteredJobs(filtered);
  }, [jobs, filters]);

  const handleApply = (jobId, jobTitle, company) => {
    if (!user) {
      alert('Please login first');
      return;
    }
    
    if (user.userType !== 'job_seeker') {
      alert('Only job seekers can apply');
      return;
    }

    setSelectedJobForApplication({ jobId, jobTitle, company });
  };

  const handleApplicationSubmit = (applicationData) => {
    setAppliedJobs(prev => new Set([...prev, selectedJobForApplication.jobId]));
    setSelectedJobForApplication(null);
    alert('Application submitted successfully!');
  };

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-3">Job Opportunities</h1>
          <p className={`text-xl transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Find your next great opportunity</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="🔍 Search jobs, companies, skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-modern w-full text-lg"
          />
        </div>

        {/* Filters Section */}
        <div className={`card-modern p-6 mb-8 transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 font-bold transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
          >
            {showAdvanced ? '▼' : '▶'} Advanced Filters
            <span className="text-sm font-normal ml-2 badge-modern px-3 py-1" style={{background: isDark ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: isDark ? '#93c5fd' : '#2563eb'}}>
              {filteredJobs.length} results
            </span>
          </button>

          {showAdvanced && (
            <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Location */}
              <div>
                <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  📍 Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., New York"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="input-modern text-sm"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  💼 Job Type
                </label>
                <select
                  value={filters.jobType}
                  onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
                  className="input-modern text-sm"
                >
                  <option value="">All Types</option>
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="internship">Internship</option>
                </select>
              </div>

              {/* Experience Level */}
              <div>
                <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  📈 Experience
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => setFilters({ ...filters, experience: e.target.value })}
                  className="input-modern text-sm"
                >
                  <option value="">Any Level</option>
                  <option value="0-2">0-2 Years</option>
                  <option value="2-5">2-5 Years</option>
                  <option value="5-10">5-10 Years</option>
                  <option value="10+">10+ Years</option>
                </select>
              </div>

              {/* Salary Range */}
              <div>
                <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  💰 Max Salary
                </label>
                <select
                  value={filters.salaryMax}
                  onChange={(e) => setFilters({ ...filters, salaryMax: parseInt(e.target.value) })}
                  className="input-modern text-sm"
                >
                  <option value={1000000000}>No Limit</option>
                  <option value={8000000}>₹8 LPA</option>
                  <option value={10000000}>₹10 LPA</option>
                  <option value={12000000}>₹12 LPA</option>
                  <option value={15000000}>₹15 LPA</option>
                  <option value={20000000}>₹20 LPA</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className={`mb-6 p-4 border-l-4 rounded-lg ${isDark ? 'bg-red-900 bg-opacity-30 border-red-500 text-red-300' : 'bg-red-50 border-red-500 text-red-700'}`}>
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`card-modern p-6 animate-pulse ${isDark ? 'bg-gray-700' : 'bg-white'}`}>
                <div className={`h-6 rounded mb-4 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded mb-2 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                <div className={`h-4 rounded w-3/4 ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
              </div>
            ))}
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && filteredJobs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {filteredJobs.map(job => (
              <div key={job._id || job.id} className={`card-modern p-6 flex flex-col hover:shadow-2xl transition-all duration-300 group ${isDark ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white'}`}>
                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-xl font-bold group-hover:text-blue-600 transition-colors line-clamp-2 ${isDark ? 'text-white group-hover:text-blue-400' : 'text-gray-900'}`}>
                      {job.title}
                    </h3>
                    {appliedJobs.has(job._id || job.id) && (
                      <span className={`badge-modern text-xs ${isDark ? 'bg-green-900 bg-opacity-50 text-green-300' : 'bg-green-100 text-green-700'}`}>Applied</span>
                    )}
                  </div>
                  <p className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{job.company}</p>
                </div>

                {/* Details */}
                <div className={`space-y-2 mb-4 text-sm flex-grow transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-2">
                    <span>📍</span>
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>💼</span>
                    <span className="capitalize">{job.jobType}</span>
                  </div>
                  {job.salaryMin && job.salaryMax && (
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span>₹{(job.salaryMin / 100000).toFixed(1)} - {(job.salaryMax / 100000).toFixed(1)} LPA</span>
                    </div>
                  )}
                  {job.experience && (
                    <div className="flex items-center gap-2">
                      <span>📈</span>
                      <span>{job.experience}+ years experience</span>
                    </div>
                  )}
                </div>

                {/* Description Preview */}
                <p className={`text-sm mb-4 line-clamp-3 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {job.description}
                </p>

                {/* Skills */}
                {job.skills && job.skills.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className={`badge-modern text-xs transition-colors duration-300 ${isDark ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className={`badge-modern text-xs transition-colors duration-300 ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Button */}
                {user?.userType === 'job_seeker' && (
                  <button
                    onClick={() => handleApply(job._id || job.id, job.title, job.company)}
                    disabled={appliedJobs.has(job._id || job.id)}
                    className={`btn-gradient w-full py-2 text-white font-semibold rounded-lg transition-all ${
                      appliedJobs.has(job._id || job.id)
                        ? isDark ? 'opacity-50 cursor-not-allowed bg-green-700' : 'opacity-50 cursor-not-allowed bg-green-600'
                        : 'hover:scale-105'
                    }`}
                  >
                    {appliedJobs.has(job._id || job.id) ? '✓ Applied' : 'Apply Now'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && (
          <div className={`card-modern p-12 text-center ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`text-2xl font-bold mb-2 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>No jobs found</p>
            <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>

      {/* Application Form Modal */}
      {selectedJobForApplication && (
        <ApplicationForm
          jobId={selectedJobForApplication.jobId}
          jobTitle={selectedJobForApplication.jobTitle}
          company={selectedJobForApplication.company}
          onSubmit={handleApplicationSubmit}
          onCancel={() => setSelectedJobForApplication(null)}
        />
      )}
    </div>
  );
};
