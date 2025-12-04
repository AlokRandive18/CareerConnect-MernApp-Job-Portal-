import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { updateProfile } from '../lib/api.js';

export const Profile = () => {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        location: user.location || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setMessage('✓ Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('✗ Failed to update profile');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (!user) return <div className={`flex items-center justify-center min-h-screen transition-colors duration-300 ${isDark ? 'bg-gray-900 text-white' : 'bg-white'}`}>Please login first</div>;

  return (
    <div className={`min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-2">My Profile</h1>
          <p className={`text-lg transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Manage your account information</p>
        </div>

        {/* Tabs */}
        <div className={`card-modern mb-8 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          <div className={`flex border-b transition-colors duration-300 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            {[
              { id: 'basic', label: '👤 Basic Info', icon: '👤' },
              { id: 'contact', label: '📞 Contact', icon: '📞' },
              { id: 'bio', label: '✍️ About', icon: '✍️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 px-6 font-semibold transition-all border-b-2 ${
                  activeTab === tab.id
                    ? isDark ? 'border-blue-500 text-blue-400 bg-gray-700' : 'border-blue-600 text-blue-600 bg-blue-50'
                    : isDark ? 'border-transparent text-gray-400 hover:text-gray-300' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Success Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border-l-4 transition-colors duration-300 ${
            message.includes('✓')
              ? isDark ? 'bg-green-900 bg-opacity-30 border-green-500 text-green-300' : 'bg-green-50 border-green-500 text-green-700'
              : isDark ? 'bg-red-900 bg-opacity-30 border-red-500 text-red-300' : 'bg-red-50 border-red-500 text-red-700'
          }`}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className={`card-modern p-8 fade-in ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="input-modern"
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="input-modern"
                    required
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="inline-block">
                  <span className={`badge-modern transition-colors duration-300 ${isDark ? 'bg-blue-900 bg-opacity-50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                    Account Type: {user.userType === 'job_seeker' ? '💼 Job Seeker' : '🏢 Employer'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <div className={`card-modern p-8 fade-in ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact Information</h2>
              <div className="space-y-6">
                <div>
                  <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className={`input-modern cursor-not-allowed transition-colors duration-300 ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'}`}
                  />
                  <p className={`text-xs mt-1 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Email cannot be changed</p>
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="input-modern"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    className="input-modern"
                  />
                </div>
              </div>
            </div>
          )}

          {/* About Tab */}
          {activeTab === 'bio' && (
            <div className={`card-modern p-8 fade-in ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 transition-colors duration-300 ${isDark ? 'text-white' : 'text-gray-900'}`}>About You</h2>
              <div>
                <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell us about yourself..."
                  rows="6"
                  className="input-modern resize-none"
                />
                <p className={`text-xs mt-1 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{formData.bio.length}/500 characters</p>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className={`card-modern p-8 flex items-center justify-between transition-colors duration-300 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
            <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>All changes are automatically saved to your account</p>
            <button
              type="submit"
              disabled={saving}
              className="btn-gradient px-8 py-3 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
