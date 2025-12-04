import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    const result = await login(email, password);
    setLoading(false);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h2>
          <p className={`transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>Sign in to your account to continue</p>
        </div>

        {/* Card */}
        <div className={`card-modern p-8 md:p-10 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
          {error && (
            <div className={`mb-6 p-4 border-l-4 rounded-lg ${isDark ? 'bg-red-900 bg-opacity-30 border-red-500 text-red-300' : 'bg-red-50 border-red-500'}`}>
              <p className={`font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-modern"
                required
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className={`flex items-center gap-2 cursor-pointer transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                <input type="checkbox" className={`w-4 h-4 rounded transition-colors duration-300 ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'}`} />
                Remember me
              </label>
              <a href="#" className={`font-semibold transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>Forgot?</a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient w-full py-3 text-white font-bold rounded-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className={`flex-1 h-px transition-colors duration-300 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            <span className={`text-sm transition-colors duration-300 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>or</span>
            <div className={`flex-1 h-px transition-colors duration-300 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>

          {/* Alternative Login */}
          <div className="grid grid-cols-2 gap-4">
            <button className={`py-3 border-2 rounded-lg font-semibold transition-colors duration-300 ${isDark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
              Google
            </button>
            <button className={`py-3 border-2 rounded-lg font-semibold transition-colors duration-300 ${isDark ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-200 text-gray-700 hover:border-gray-300'}`}>
              GitHub
            </button>
          </div>

          {/* Sign Up Link */}
          <p className={`text-center mt-6 transition-colors duration-300 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
            Don't have an account?{' '}
            <Link to="/register" className={`font-semibold transition-colors duration-300 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
