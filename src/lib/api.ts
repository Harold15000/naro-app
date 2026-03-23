import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.naroapp.net',
  withCredentials: true,
});

// Response interceptor: handle 401 with cookie-based refresh
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Refresh uses httpOnly cookies automatically (withCredentials: true)
        await api.post('/api/auth/refresh');
        // Retry the original request — new cookies are set automatically
        return api(originalRequest);
      } catch {
        // Refresh failed — session expired, redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(err);
  }
);

export default api;
