// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api'; // axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize from localStorage so refreshes persist
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Keep API Authorization header in sync with token
  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Load profile if token exists (verify session)
  useEffect(() => {
    const initAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await API.get('/profile');
        setUser(res.data.user);
      } catch (err) {
        console.error('Auth initialization failed:', err);
        logout(); // invalid token or expired
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [token]);

  // 🔐 Register a new user
  const register = async ({ username, email, password }) => {
    const res = await API.post('/auth/register', { username, email, password });
    const { user: userData, token: jwt } = res.data;

    setUser(userData);
    setToken(jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwt);

    API.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    return res;
  };

  // 🔑 Login existing user
  const login = async ({ email, password }) => {
    const res = await API.post('/auth/login', { email, password });
    const { user: userData, token: jwt } = res.data;

    setUser(userData);
    setToken(jwt);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', jwt);

    API.defaults.headers.common['Authorization'] = `Bearer ${jwt}`;
    return res;
  };

  // 🚪 Logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
