import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    userType: 'job_seeker'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await register(formData);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Registration failed');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold gradient-text mb-2">Create Account</h2>
          <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Join our community and start your journey</p>
        </div>

        {/* Card */}
        <div className={`card-modern p-8 md:p-10 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className={`mb-6 p-4 border-l-4 rounded-lg ${isDark ? 'bg-red-900 bg-opacity-30 border-red-500 text-red-300' : 'bg-red-50 border-red-500'}`}>
              <p className={`font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type */}
            <div>
              <label className={`block text-sm font-semibold mb-3 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 'job_seeker', label: '💼 Job Seeker', desc: 'Find your next opportunity' },
                  { value: 'employer', label: '🏢 Employer', desc: 'Hire talented people' }
                ].map(option => (
                  <label key={option.value} className="relative">
                    <input
                      type="radio"
                      name="userType"
                      value={option.value}
                      checked={formData.userType === option.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      formData.userType === option.value
                        ? isDark ? 'border-blue-500 bg-blue-900 bg-opacity-30' : 'border-blue-600 bg-blue-50'
                        : isDark ? 'border-gray-600 hover:border-gray-500' : 'border-gray-200 hover:border-gray-300'
                    }`}>
                      <p className={`font-semibold transition-colors duration-300 ${isDark && formData.userType !== option.value ? 'text-gray-200' : isDark ? 'text-white' : 'text-gray-900'}`}>{option.label}</p>
                      <p className={`text-sm transition-colors duration-300 ${isDark && formData.userType !== option.value ? 'text-gray-400' : isDark ? 'text-gray-300' : 'text-gray-600'}`}>{option.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
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
                  placeholder="Doe"
                  className="input-modern"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-modern"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-modern"
                required
              />
              <p className={`text-xs mt-1 transition-colors duration-300 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Minimum 6 characters</p>
            </div>

            {/* Terms */}
            <label className={`flex items-start gap-3 text-sm transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              <input type="checkbox" className={`w-4 h-4 mt-1 rounded transition-colors duration-300 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`} required />
              <span>I agree to the <a href="#" className={`font-semibold hover:underline transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>Terms of Service</a> and <a href="#" className={`font-semibold hover:underline transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>Privacy Policy</a></span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3 text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Sign In Link */}
          <p className={`text-center mt-6 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <Link to="/login" className={`font-semibold transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
