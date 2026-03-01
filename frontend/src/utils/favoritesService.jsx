import axios from 'axios';

const API = axios.create({
  baseURL: 'https://weather-backend-001h.onrender.com/api/favorites',
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const getFavorites = async () => {
  const res = await API.get('/');
  return res.data.favorites;
};

export const addFavorite = async (city) => {
  const res = await API.post('/add', { city });
  return res.data.message;
};

export const removeFavorite = async (city) => {
  const res = await API.post('/remove', { city });
  return res.data.message;
};