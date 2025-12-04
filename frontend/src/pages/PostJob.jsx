import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export const PostJob = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    company: user?.company || '',
    location: '',
    salaryMin: '',
    salaryMax: '',
    jobType: 'full-time',
    category: '',
    skills: '',
    experience: '',
    requirements: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        company: form.company,
        location: form.location,
        salaryMin: parseInt(form.salaryMin) || 0,
        salaryMax: parseInt(form.salaryMax) || 0,
        jobType: form.jobType,
        category: form.category,
        skills: form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
        experience: form.experience,
        requirements: form.requirements ? form.requirements.split('\n').map(r => r.trim()).filter(Boolean) : []
      };

      const res = await createJob(payload);
      if (res.data?.success) {
        navigate('/dashboard');
      } else {
        setError(res.data?.error || 'Failed to create job');
      }
    } catch (err) {
      console.error('Create job error', err);
      setError(err.response?.data?.error || err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-12 px-4 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg p-8 shadow">
        <h1 className="text-2xl font-bold mb-4">Post New Job</h1>
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Job Title</label>
            <input name="title" value={form.title} onChange={handleChange} required className="input-modern w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Company</label>
            <input name="company" value={form.company} onChange={handleChange} required className="input-modern w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <input name="location" value={form.location} onChange={handleChange} required className="input-modern w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Salary Min (INR per annum)</label>
            <input name="salaryMin" value={form.salaryMin} onChange={handleChange} type="number" className="input-modern w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Salary Max (INR per annum)</label>
            <input name="salaryMax" value={form.salaryMax} onChange={handleChange} type="number" className="input-modern w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Job Type</label>
            <select name="jobType" value={form.jobType} onChange={handleChange} className="input-modern w-full">
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Skills (comma separated)</label>
            <input name="skills" value={form.skills} onChange={handleChange} className="input-modern w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Experience required (years)</label>
            <input name="experience" value={form.experience} onChange={handleChange} className="input-modern w-full" />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required className="input-modern w-full h-28" />
          </div>

          <div>
            <label className="block text-sm font-medium">Requirements (one per line)</label>
            <textarea name="requirements" value={form.requirements} onChange={handleChange} className="input-modern w-full h-20" />
          </div>

          <div className="flex gap-2">
            <button type="submit" disabled={loading} className="btn-gradient px-4 py-2 text-white rounded">
              {loading ? 'Posting…' : 'Post Job'}
            </button>
            <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 border rounded">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
