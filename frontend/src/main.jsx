import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Landing } from './pages/Landing.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Jobs } from './pages/Jobs.jsx';
import { Profile } from './pages/Profile.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { MyApplications } from './pages/MyApplications.jsx';
import { EmployerApplicants } from './pages/EmployerApplicants.jsx';
import { AIJobSuggester } from './pages/AIJobSuggester.jsx';
import { AdminSeed } from './pages/AdminSeed.jsx';
import PostJob from './pages/PostJob.jsx';
import './index.css';

export const App = () => {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/applications"
              element={
                <ProtectedRoute>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/applicants"
              element={
                <ProtectedRoute requiredUserType="employer">
                  <EmployerApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employer/post-job"
              element={
                <ProtectedRoute requiredUserType="employer">
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-jobs"
              element={
                <ProtectedRoute requiredUserType="job_seeker">
                  <AIJobSuggester />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/seed" element={<AdminSeed />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
