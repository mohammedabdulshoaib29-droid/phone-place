import axios from 'axios';

const api = axios.create({
  // In production VITE_API_URL points to the Render backend URL.
  // In development the Vite proxy rewrites /api → http://localhost:5000.
  baseURL: import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api`
    : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
