import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('yoganest_token'));
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    const storedToken = localStorage.getItem('yoganest_token');
    if (!storedToken) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/profile');
      setUser(data.user || data);
      setToken(storedToken);
    } catch {
      localStorage.removeItem('yoganest_token');
      localStorage.removeItem('yoganest_user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = data;
    localStorage.setItem('yoganest_token', newToken);
    localStorage.setItem('yoganest_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return data;
  };

  const register = async (name, email, password, level, preferences) => {
    const { data } = await api.post('/auth/register', {
      name,
      email,
      password,
      level,
      preferences,
    });
    const { token: newToken, user: newUser } = data;
    localStorage.setItem('yoganest_token', newToken);
    localStorage.setItem('yoganest_user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('yoganest_token');
    localStorage.removeItem('yoganest_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('yoganest_user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isAuthenticated, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
