import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh for auth endpoints and public endpoints
    const publicEndpoints = ['/auth/', '/search'];
    const isPublicEndpoint = publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));
    
    if (isPublicEndpoint) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await api.post('/auth/refresh', { refreshToken });
        const { tokens } = response.data.data;
        
        localStorage.setItem('accessToken', tokens.accessToken);
        if (tokens.refreshToken) {
          localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        
        // Only redirect to login if not a public endpoint
        const publicEndpoints = ['/auth/', '/search'];
        const isPublicEndpoint = publicEndpoints.some(endpoint => originalRequest.url?.includes(endpoint));
        
        if (!isPublicEndpoint) {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API error handler utility
export const handleApiError = (error: any): string => {
  if (error.response) {
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return data.message || 'Invalid request';
      case 401:
        return 'Please login to continue';
      case 403:
        return 'Access denied';
      case 404:
        return 'Not found';
      case 429:
        return 'Too many requests. Please try again later';
      case 500:
        return 'Server error. Please try again later';
      default:
        return data.message || 'An unexpected error occurred';
    }
  }
  
  if (error.request) {
    return 'Network error. Please check your connection';
  }
  
  return error.message || 'An unexpected error occurred';
};