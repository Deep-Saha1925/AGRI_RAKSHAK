import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language } from '../types';
import { getMe, loginFarmer, registerFarmer, logoutFarmer, LoginParams, RegisterParams } from '../api/auth';
import { isMockModeEnabled, setMockMode } from '../api/client';
import { initialMockUser } from '../api/mockData';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isMockMode: boolean;
  toggleMockMode: () => void;
  login: (params: LoginParams) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => void;
  updateUserLanguage: (lang: Language) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('cropshield_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // In mock mode, pre-populate Rajesh Patil for instantaneous demo convenience
    if (isMockModeEnabled()) {
      return initialMockUser;
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const saved = localStorage.getItem('cropshield_token');
    if (saved) return saved;
    if (isMockModeEnabled()) {
      return 'mock_demo_jwt_token';
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMockMode, setIsMockModeState] = useState<boolean>(isMockModeEnabled());

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setToken(null);
    };

    const handleLogout = () => {
      setUser(null);
      setToken(null);
    };

    const handleMockModeChange = (e: any) => {
      setIsMockModeState(e.detail);
    };

    window.addEventListener('cropshield_auth_expired', handleAuthExpired);
    window.addEventListener('cropshield_logout', handleLogout);
    window.addEventListener('cropshield_mock_mode_changed', handleMockModeChange);

    return () => {
      window.removeEventListener('cropshield_auth_expired', handleAuthExpired);
      window.removeEventListener('cropshield_logout', handleLogout);
      window.removeEventListener('cropshield_mock_mode_changed', handleMockModeChange);
    };
  }, []);

  const login = async (params: LoginParams) => {
    setIsLoading(true);
    try {
      const auth = await loginFarmer(params);
      setToken(auth.access);
      const profile = await getMe();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (params: RegisterParams) => {
    setIsLoading(true);
    try {
      const auth = await registerFarmer(params);
      setToken(auth.access);
      const profile = await getMe();
      setUser(profile);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutFarmer();
    setUser(null);
    setToken(null);
  };

  const toggleMockMode = () => {
    const next = !isMockMode;
    setMockMode(next);
    setIsMockModeState(next);
    if (next && !user) {
      setUser(initialMockUser);
      setToken('mock_demo_jwt_token');
      localStorage.setItem('cropshield_user', JSON.stringify(initialMockUser));
      localStorage.setItem('cropshield_token', 'mock_demo_jwt_token');
    }
  };

  const updateUserLanguage = (lang: Language) => {
    if (user) {
      const updated = { ...user, language: lang };
      setUser(updated);
      localStorage.setItem('cropshield_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        isMockMode,
        toggleMockMode,
        login,
        register,
        logout,
        updateUserLanguage,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
