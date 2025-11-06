// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import API from '../services/api'; // axios instance

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user + token from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  // Keep Authorization header updated
  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // 🔐 Register new user
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

  // 🌀 Show a loading message while restoring session
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '18px',
          fontWeight: 500,
        }}
      >
        Restoring session...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
