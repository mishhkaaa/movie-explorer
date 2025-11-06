import axios from 'axios';

// ✅ Smart baseURL resolution for all environments
const backendURL =
  process.env.REACT_APP_API_URL && process.env.REACT_APP_API_URL.startsWith('http')
    ? process.env.REACT_APP_API_URL
    : window.location.hostname.includes('vercel.app')
    ? 'https://movie-explorer-izvt.onrender.com'
    : 'http://localhost:5000';

console.log('🔗 Using backend API baseURL →', backendURL);

const API = axios.create({
  baseURL: backendURL,
});

// ✅ Attach token to every request if present
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

// ✅ Handle unauthorized responses globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default API;
