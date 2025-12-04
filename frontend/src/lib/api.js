import axios from 'axios';

const API = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL) ? import.meta.env.VITE_API_BASE_URL : 'http://localhost:5001/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getCurrentUser = () => API.get('/auth/me');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const getProfile = (id) => API.get(`/auth/profile/${id}`);

// Job endpoints
export const getJobs = (params) => API.get('/jobs', { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getRecommendedJobs = (limit) => API.get('/jobs/recommendations', { params: { limit } });

// Application endpoints
export const applyForJob = (jobId, data) => API.post(`/applications/${jobId}`, data);
export const getMyApplications = () => API.get('/applications');
export const getJobApplications = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (applicationId, data) => API.put(`/applications/${applicationId}`, data);

export default API;
