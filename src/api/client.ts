import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Base URL configured from environment variable or defaults to backend contract
const env = (import.meta as any).env || {};

export const API_BASE_URL: string =
  env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Check if Mock Mode is enabled via env var or localStorage toggle
export const isMockModeEnabled = (): boolean => {
  const localOverride = localStorage.getItem('cropshield_mock_mode');
  if (localOverride !== null) {
    return localOverride === 'true';
  }
  return env.VITE_MOCK_MODE !== 'false';
};

export const setMockMode = (enabled: boolean) => {
  localStorage.setItem('cropshield_mock_mode', String(enabled));
  window.dispatchEvent(new CustomEvent('cropshield_mock_mode_changed', { detail: enabled }));
};

// Create Axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor: Attach JWT Access Token if available
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('cropshield_token');
    // All endpoints except /auth/* require Authorization: Bearer <token>
    if (token && !config.url?.startsWith('/auth/')) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 Unauthorized
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token and notify app to redirect to login
      localStorage.removeItem('cropshield_token');
      localStorage.removeItem('cropshield_user');
      window.dispatchEvent(new CustomEvent('cropshield_auth_expired'));
    }
    return Promise.reject(error);
  }
);
