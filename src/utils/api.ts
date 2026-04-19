import axios from 'axios';

function getApiBaseUrl() {
  if (import.meta.env.VITE_API_URL) {
    return `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`;
  }

  if (typeof window !== 'undefined') {
    const { protocol, hostname } = window.location;

    if (hostname === 'phone-place.onrender.com') {
      return `${protocol}//phone-place-api.onrender.com/api`;
    }
  }

  // In development the Vite proxy rewrites /api → http://localhost:5000.
  return '/api';
}

const api = axios.create({
  // In production VITE_API_URL points to the Render backend URL.
  // If it isn't set on Render, fall back to the known backend service URL.
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
