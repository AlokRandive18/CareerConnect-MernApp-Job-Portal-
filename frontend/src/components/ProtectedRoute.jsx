import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export const ProtectedRoute = ({ children, requiredUserType }) => {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();

  if (loading) {
    return <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>Loading...</div>;
  }

  if (!user) {
    return <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>Please login first</div>;
  }

  if (requiredUserType && user.userType !== requiredUserType) {
    return <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>Access denied</div>;
  }

  return children;
};
