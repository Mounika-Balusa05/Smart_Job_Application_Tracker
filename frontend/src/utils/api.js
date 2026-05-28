import axios from 'axios';

const API = axios.create({
  baseURL: 'https://smart-job-application-tracker-2yo6.onrender.com/api',
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    if (parsed.token) {
      config.headers.Authorization = `Bearer ${parsed.token}`;
    }
  }
  return config;
});

// Applications
export const getApplications = (params) => API.get('/applications', { params });
export const getApplication = (id) => API.get(`/applications/${id}`);
export const createApplication = (data) => API.post('/applications', data);
export const updateApplication = (id, data) => API.put(`/applications/${id}`, data);
export const deleteApplication = (id) => API.delete(`/applications/${id}`);
export const getAppStats = () => API.get('/applications/stats/summary');

// Interviews
export const getInterviews = (params) => API.get('/interviews', { params });
export const getUpcomingInterviews = () => API.get('/interviews/upcoming');
export const getInterview = (id) => API.get(`/interviews/${id}`);
export const createInterview = (data) => API.post('/interviews', data);
export const updateInterview = (id, data) => API.put(`/interviews/${id}`, data);
export const deleteInterview = (id) => API.delete(`/interviews/${id}`);

// Auth
export const loginUser = (data) => API.post('/auth/login', data);
export const registerUser = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');