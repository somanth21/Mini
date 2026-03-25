import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '@/services/api.js';

interface AuthContextType {
  token: string | null;
  role: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string, email: string, role?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('role'));
  const [email, setEmail] = useState<string | null>(localStorage.getItem('email'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      if (role) localStorage.setItem('role', role);
      if (email) localStorage.setItem('email', email);
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      delete api.defaults.headers.common['Authorization'];
    }
  }, [token, role, email]);

  const login = (newToken: string, newEmail: string, newRole: string = 'USER') => {
    setToken(newToken);
    setEmail(newEmail);
    setRole(newRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, email, isAuthenticated: !!token, isAdmin: role === 'ADMIN', login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
