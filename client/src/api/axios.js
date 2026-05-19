// client/src/api/axios.js | Axios client with auth interceptors | Author: SmartComplain | Date: 2026-05-19
import axios from 'axios';

const defaultApiBaseUrl = 'https://ai-complaint-system-1-vbja.onrender.com/api';
const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseUrl = configuredBaseUrl
  ? configuredBaseUrl.replace(/\/$/, '').endsWith('/api')
    ? configuredBaseUrl.replace(/\/$/, '')
    : `${configuredBaseUrl.replace(/\/$/, '')}/api`
  : defaultApiBaseUrl;

const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sc_token');
      localStorage.removeItem('sc_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;