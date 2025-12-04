import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useTheme } from '../contexts/ThemeContext.jsx';

export const Dashboard = () => {
  const { user, loading } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Show loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: isDark ? '#111827' : '#f3f4f6',
        color: isDark ? '#e5e7eb' : '#374151'
      }}>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: isDark ? '#111827' : '#f3f4f6',
        color: isDark ? '#e5e7eb' : '#374151'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '20px' }}>Please login to view your dashboard</p>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const isJobSeeker = user.userType === 'job_seeker';

  return (
    <div style={{
      minHeight: '100vh',
      padding: '48px 16px',
      backgroundColor: isDark ? '#111827' : '#f3f4f6',
      color: isDark ? '#e5e7eb' : '#1f2937'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '8px',
            color: isDark ? '#f3f4f6' : '#111827'
          }}>
            {isJobSeeker ? 'Job Seeker Dashboard' : 'Employer Dashboard'}
          </h1>
          <p style={{
            fontSize: '18px',
            color: isDark ? '#d1d5db' : '#6b7280'
          }}>
            Welcome back, {user.firstName}!
          </p>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '48px'
        }}>
          {isJobSeeker ? (
            <>
              <StatCard isDark={isDark} title="Total Applications" value="0" />
              <StatCard isDark={isDark} title="Saved Jobs" value="0" />
              <StatCard isDark={isDark} title="Profile Views" value="0" />
              <StatCard isDark={isDark} title="Profile Match" value="75%" />
            </>
          ) : (
            <>
              <StatCard isDark={isDark} title="Jobs Posted" value="0" />
              <StatCard isDark={isDark} title="Total Applicants" value="0" />
              <StatCard isDark={isDark} title="Shortlisted" value="0" />
              <StatCard isDark={isDark} title="Profile Completion" value="100%" />
            </>
          )}
        </div>

        {/* Recent Section */}
        <div style={{
          padding: '32px',
          borderRadius: '8px',
          backgroundColor: isDark ? '#1f2937' : '#ffffff',
          boxShadow: isDark ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: 'bold',
            marginBottom: '24px',
            color: isDark ? '#f3f4f6' : '#111827'
          }}>
            {isJobSeeker ? 'Recent Applications' : 'Quick Actions'}
          </h2>

          {isJobSeeker ? (
            <p style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              No applications yet. Start applying to jobs!
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '24px'
            }}>
              <ActionButton label="Post New Job" color="#2563eb" onClick={() => navigate('/employer/post-job')} />
              <ActionButton label="View All Applicants" color="#9333ea" onClick={() => navigate('/employer/applicants')} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ isDark, title, value }) => (
  <div style={{
    padding: '24px',
    borderRadius: '8px',
    backgroundColor: isDark ? '#1f2937' : '#ffffff',
    boxShadow: isDark ? '0 4px 6px -1px rgba(0, 0, 0, 0.3)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    transition: 'box-shadow 0.3s'
  }}>
    <p style={{
      fontSize: '14px',
      marginBottom: '8px',
      color: isDark ? '#9ca3af' : '#6b7280'
    }}>
      {title}
    </p>
    <p style={{
      fontSize: '28px',
      fontWeight: 'bold',
      color: isDark ? '#60a5fa' : '#2563eb'
    }}>
      {value}
    </p>
  </div>
);

const ActionButton = ({ label, color, onClick }) => (
  <button onClick={onClick} style={{
    padding: '16px',
    backgroundColor: color,
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'opacity 0.2s'
  }}
  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
  onMouseLeave={(e) => e.target.style.opacity = '1'}
  >
    {label}
  </button>
);
