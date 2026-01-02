import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../lib/api.js';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const response = await getCurrentUser();
          setUser(response.data.data);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          localStorage.removeItem('token');
          setToken(null);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await loginUser({ email, password });
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        request: error.request ? 'Request made but no response' : 'No request made',
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method
        }
      });
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        return { success: false, error: error.response.data?.error || 'Login failed' };
      } else if (error.request) {
        // Request was made but no response received
        console.error('Network error - request URL:', error.config?.baseURL + error.config?.url);
        return { success: false, error: `Unable to connect to server at ${error.config?.baseURL || 'http://localhost:5001/api'}. Please check if the backend is running.` };
      } else {
        // Something else happened
        return { success: false, error: error.message || 'Login failed' };
      }
    }
  };

  const register = async (data) => {
    try {
      const response = await registerUser(data);
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        return { success: false, error: error.response.data?.error || 'Registration failed' };
      } else if (error.request) {
        // Request was made but no response received
        return { success: false, error: 'Unable to connect to server. Please check if the backend is running.' };
      } else {
        // Something else happened
        return { success: false, error: error.message || 'Registration failed' };
      }
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
