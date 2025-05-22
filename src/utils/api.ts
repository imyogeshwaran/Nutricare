import axios from 'axios';
import { toast } from 'react-toastify';
import config from '../config';

// Update API base URL configuration
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? config.apiUrl
  : '';  // Empty string will use relative URLs with the proxy

console.log('API is connecting to:', API_BASE_URL || 'relative URLs (using proxy)');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const authState = JSON.parse(localStorage.getItem('auth-storage') || '{}');
    const token = authState?.state?.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log API requests for debugging
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, { 
      data: config.data,
      headers: config.headers
    });
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`API Response Success: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    // Log failed responses for debugging
    console.error(`API Response Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    const message = error.response?.data?.message || 'An error occurred';
    
    // Don't show toast for auth errors as they're handled in the components
    if (!error.config.url.includes('/auth/')) {
      toast.error(message);
    }
    
    // Handle authentication errors
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      localStorage.removeItem('auth-storage');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;