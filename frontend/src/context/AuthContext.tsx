import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, AuthState } from '../models/Akun';
import PenggunaApi from '../api/Pengguna';

interface AuthContextType extends AuthState {
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: { email: string; password: string; full_name: string; phone_number: string }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('rentifa_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('rentifa_token');
  });

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  const login = async (email: string, pass: string) => {
    const res = await PenggunaApi.login(email, pass);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('rentifa_token', res.data.token);
      localStorage.setItem('rentifa_user', JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, message: res.message || 'Gagal login.' };
  };

  const register = async (data: {
    email: string;
    password: string;
    full_name: string;
    phone_number: string;
  }) => {
    const res = await PenggunaApi.register(data);
    if (res.success && res.data) {
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('rentifa_token', res.data.token);
      localStorage.setItem('rentifa_user', JSON.stringify(res.data.user));
      return { success: true };
    }
    return { success: false, message: res.message || 'Gagal registrasi.' };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rentifa_token');
    localStorage.removeItem('rentifa_user');
  };

  const refreshUser = async () => {
    if (!token) return;
    const res = await PenggunaApi.getProfile();
    if (res.success && res.data) {
      setUser(res.data);
      localStorage.setItem('rentifa_user', JSON.stringify(res.data));
    }
  };

  useEffect(() => {
    if (token) {
      refreshUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
