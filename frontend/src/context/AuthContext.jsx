// src/context/AuthContext.jsx (Temporary Debugging Version)

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
// We are NOT importing useNavigate for this test

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  // We are NOT calling useNavigate here for this test

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await axios.post('/api/users/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      // NOTE: Automatic redirect is disabled for this test.
      // You will have to manually go to /dashboard after logging in.
      window.location.href = '/dashboard'; // Simple page reload redirect
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const logout = async () => {
    try {
      // Call backend to clear the httpOnly JWT cookie
      await axios.post('/api/users/logout');
    } catch (err) {
      console.error('Logout API call failed:', err);
    }
    setUser(null);
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;