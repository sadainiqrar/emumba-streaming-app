import axios from 'axios';

// Get the API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Make sure headers object exists
      config.headers = config.headers || {};

      // Set Authorization header with Bearer token
      config.headers.Authorization = `Bearer ${token}`;

      // Log for debugging (remove in production)
      console.log('API Request:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        tokenPreview: token ? `${token.substring(0, 10)}...` : 'none',
      });
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      console.error('Authentication error (401):', error.response.data);

      // Only log the error, don't redirect automatically
      // This allows components to handle the error themselves
      console.warn('Authentication required. Please log in.');

      // We'll let the component handle the redirect if needed
    }

    console.error('API Response Error:', error.response || error);
    return Promise.reject(error);
  }
);

export const streamService = {
  getAllStreams: () => api.get('/streams'),
  getStreamById: (id: string) => api.get(`/streams/${id}`),
  getStreamsByStatus: (status: 'active' | 'completed') => api.get(`/streams/status/${status}`),
  createStream: (title: string) => api.post('/streams', { title }),
};

export const authService = {
  getProfile: () => api.get('/auth/profile'),
};

export const chatService = {
  getStreamChats: (streamId: string) => api.get(`/chat/stream/${streamId}`),
};

export default api;
