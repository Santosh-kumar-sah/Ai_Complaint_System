// client/src/context/AuthContext.jsx | Authentication context and hook | Author: SmartComplain | Date: 2026-05-19
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { API_ROUTES } from '../constants';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('sc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const storedToken = localStorage.getItem('sc_token');
      const storedUser = localStorage.getItem('sc_user');

      if (!storedToken) {
        setLoading(false);
        return;
      }

      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          localStorage.removeItem('sc_user');
        }
      }

      try {
        const response = await api.get(API_ROUTES.auth.me);
        setUser(response.data.user);
        setToken(storedToken);
        localStorage.setItem('sc_user', JSON.stringify(response.data.user));
      } catch (error) {
        localStorage.removeItem('sc_token');
        localStorage.removeItem('sc_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const login = (responseData) => {
    localStorage.setItem('sc_token', responseData.token);
    localStorage.setItem('sc_user', JSON.stringify(responseData.user));
    setToken(responseData.token);
    setUser(responseData.user);
  };

  const logout = () => {
    localStorage.removeItem('sc_token');
    localStorage.removeItem('sc_user');
    setToken(null);
    setUser(null);
    navigate('/login', { replace: true });
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};