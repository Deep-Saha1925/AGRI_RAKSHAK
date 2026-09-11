import { apiClient, isMockModeEnabled } from './client';
import { initialMockUser } from './mockData';
import { User, AuthResponse, Language } from '../types';

export interface RegisterParams {
  name: string;
  phone: string;
  password?: string;
  language: Language;
}

export interface LoginParams {
  phone: string;
  password?: string;
}

/**
 * Register a new farmer. Role is strictly hardcoded to 'farmer' per contract.
 * POST /auth/register/
 */
export const registerFarmer = async (params: RegisterParams): Promise<AuthResponse> => {
  const payload = {
    role: 'farmer',
    name: params.name,
    phone: params.phone,
    password: params.password || 'Farmer@123',
    language: params.language,
  };

  if (isMockModeEnabled()) {
    // Return mock access/refresh tokens
    const mockAuth: AuthResponse = {
      access: 'mock_jwt_access_token_' + Date.now(),
      refresh: 'mock_jwt_refresh_token_' + Date.now(),
      role: 'farmer',
    };
    const mockUser: User = {
      id: 101,
      name: params.name,
      phone: params.phone,
      role: 'farmer',
      language: params.language,
    };
    localStorage.setItem('cropshield_token', mockAuth.access);
    localStorage.setItem('cropshield_user', JSON.stringify(mockUser));
    return mockAuth;
  }

  const response = await apiClient.post<AuthResponse>('/auth/register/', payload);
  if (response.data.access) {
    localStorage.setItem('cropshield_token', response.data.access);
  }
  return response.data;
};

/**
 * Login existing farmer.
 * POST /auth/login/
 */
export const loginFarmer = async (params: LoginParams): Promise<AuthResponse> => {
  if (isMockModeEnabled()) {
    // Default demo credentials or any input in mock mode
    const mockAuth: AuthResponse = {
      access: 'mock_jwt_access_token_demo',
      refresh: 'mock_jwt_refresh_token_demo',
      role: 'farmer',
    };
    const mockUser: User = {
      ...initialMockUser,
      phone: params.phone || initialMockUser.phone,
    };
    localStorage.setItem('cropshield_token', mockAuth.access);
    localStorage.setItem('cropshield_user', JSON.stringify(mockUser));
    return mockAuth;
  }

  const response = await apiClient.post<AuthResponse>('/auth/login/', {
    phone: params.phone,
    password: params.password,
  });

  if (response.data.access) {
    localStorage.setItem('cropshield_token', response.data.access);
  }
  return response.data;
};

/**
 * Fetch current authenticated farmer profile.
 * GET /auth/me/
 */
export const getMe = async (): Promise<User> => {
  if (isMockModeEnabled()) {
    const saved = localStorage.getItem('cropshield_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return initialMockUser;
      }
    }
    return initialMockUser;
  }

  const response = await apiClient.get<User>('/auth/me/');
  localStorage.setItem('cropshield_user', JSON.stringify(response.data));
  return response.data;
};

/**
 * Logout farmer and clear session tokens
 */
export const logoutFarmer = () => {
  localStorage.removeItem('cropshield_token');
  localStorage.removeItem('cropshield_user');
  window.dispatchEvent(new CustomEvent('cropshield_logout'));
};
