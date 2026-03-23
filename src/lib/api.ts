import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.naroapp.net',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  async err => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      try {
        const res = await axios.post('https://api.naroapp.net/api/auth/refresh', 
          {}, { withCredentials: true });
        localStorage.setItem('token', res.data.accessToken);
        err.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(err.config);
      } catch {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;
