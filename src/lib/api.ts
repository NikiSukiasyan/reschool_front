import axios from 'axios';

export const getLocale = (): string =>
  localStorage.getItem('locale') || 'ka';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = getLocale();
  return config;
});
