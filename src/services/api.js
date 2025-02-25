// src/services/api.js
import axios from 'axios';
import mockApi from './mockApi';

// DEVELOPMENT MOCK MODE - Set to true to bypass backend
const MOCK_MODE = true;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Set auth token for all requests
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
};

// Remove auth token
const removeAuthToken = () => {
  delete apiClient.defaults.headers.common['Authorization'];
};

// API methods
const api = {
  setAuthToken,
  removeAuthToken,
  
  // Auth endpoints
  register: (userData) => {
    if (MOCK_MODE) return mockApi.register(userData);
    return apiClient.post('/user/register', userData);
  },
  
  login: (credentials) => {
    if (MOCK_MODE) return mockApi.login(credentials);
    return apiClient.post('/user/login', credentials);
  },
  
  getUserProfile: () => {
    if (MOCK_MODE) return mockApi.getUserProfile();
    return apiClient.get('/user/profile');
  },
  
  // Game endpoints
  getBaseElements: () => {
    if (MOCK_MODE) return mockApi.getBaseElements();
    return apiClient.get('/game/base-elements');
  },
  
  getUserElements: () => {
    if (MOCK_MODE) return mockApi.getUserElements();
    return apiClient.get('/game/user-elements');
  },
  
  createSession: () => {
    if (MOCK_MODE) return mockApi.createSession();
    return apiClient.post('/game/session');
  },
  
  combineElements: (elementIds) => {
    if (MOCK_MODE) return mockApi.combineElements(elementIds);
    return apiClient.post('/game/combine', { elementIds });
  }
};

export default api;