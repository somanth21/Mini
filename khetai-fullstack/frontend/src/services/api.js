import axios from 'axios';

const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8080/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error Intercepted:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const sendChatMessage = async (message) => {
  const response = await api.post('/chat', { message });
  return { reply: response.data.data };
};

export const uploadCropImage = async (imageFile, query, language) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  if (query) formData.append('query', query);
  if (language) formData.append('language', language);
  
  const response = await api.post('/crop-diagnosis', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return { diagnosis: response.data.data };
};

export const getMandiPrices = async (crop, location, language) => {
  const response = await api.get('/mandi-prices', { params: { crop, location, language } });
  return { summary: response.data.data };
};

export const getGovSchemes = async (schemeName, query, language) => {
  const response = await api.get('/schemes', { params: { schemeName, query, language } });
  return { summary: response.data.data };
};

export const registerCustomer = async (email, password) => {
  const response = await api.post('/auth/register', { email, password });
  return response.data;
};

export const loginCustomer = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data; // contains token
};

export const fetchHistory = async () => {
  const response = await api.get('/history');
  return response.data.data; // List of queries
};

export const fetchAdminQueries = async () => {
  const response = await api.get('/admin/all-queries');
  return response.data.data;
};

export const fetchAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data.data;
};

export const getWeather = async (location) => {
  const response = await api.get(`/weather?location=${encodeURIComponent(location)}`);
  return response.data.data;
};

export const getSuggestions = async (crop, weather) => {
  const response = await api.post('/suggestions', { crop, weather });
  return response.data;
};

export const clearHistory = async () => {
    const response = await api.delete('/history');
    return response.data;
};

export const saveBackendHistory = async (type, queryData, responseData) => {
  // Gracefully attempts to save to backend (if logged in, the token will be present in headers)
  try {
     await api.post('/history', { type, queryData: JSON.stringify(queryData), responseData: JSON.stringify(responseData) });
  } catch (e) {
     console.error('Failed to save to backend history', e);
  }
};

export default api;
