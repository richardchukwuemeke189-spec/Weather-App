import axios from 'axios';

const API = axios.create({
  baseURL: 'https://weather-backend-001h.onrender.com/api/favorites',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Get all favorites
export const getFavorites = async () => {
  const res = await API.get('/');
  return res.data.favorites;
};

// Add a favorite city
export const addFavorite = async (city) => {
  const res = await API.post('/', { city }); // ✅ matches POST /api/favorites
  return res.data.message;
};

// Remove a favorite city
export const removeFavorite = async (city) => {
  const res = await API.delete(`/${encodeURIComponent(city)}`); // ✅ matches DELETE /api/favorites/:city
  return res.data.message;
};