// src/api/authService.js
import axios from 'axios';

export const login = async (email, password) => {
    try {
      const { data } = await axios.post('/api/users/login', { email, password });
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
};

export const register = async (name, email, password) => {
    try {
        const { data } = await axios.post('/api/users/register', { name, email, password });
        return data;
    } catch (error) {
        throw error.response?.data?.message || 'Registration failed';
    }
};

export const logout = async () => {
    try {
        await axios.post('/api/users/logout');
    } catch (error) {
        throw error.response?.data?.message || 'Logout failed';
    }
};