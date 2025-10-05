// API Configuration for the frontend
export const API_CONFIG = {
  // Backend API base URL
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  
  // API endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      LOGOUT: '/auth/logout',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      CHANGE_PASSWORD: '/auth/change-password',
      GET_CURRENT_USER: '/auth/me',
      GET_PROFILE: '/auth/profile',
      UPDATE_PROFILE: '/auth/profile',
      REFRESH_TOKEN: '/auth/refresh',
      GET_STATS: '/auth/stats'
    },
    HEALTH: '/health'
  },
  
  // Request timeout (in milliseconds)
  TIMEOUT: 10000,
  
  // Retry configuration
  RETRY: {
    ATTEMPTS: 3,
    DELAY: 1000
  }
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if we're in development
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

// Helper function to check if we're in production
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};
