import axios from 'axios';

// --- User Functions ---
export const getUsers = async (pageNumber = 1) => {
  try {
    const { data } = await axios.get(`/api/admin/users?pageNumber=${pageNumber}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch users';
  }
};

export const createUser = async (userData) => {
  try {
    const { data } = await axios.post('/api/admin/users', userData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create user';
  }
};

export const updateUser = async (id, userData) => {
  try {
    const { data } = await axios.put(`/api/admin/users/${id}`, userData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update user';
  }
};

export const deleteUser = async (id) => {
  try {
    const { data } = await axios.delete(`/api/admin/users/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete user';
  }
};

export const getAllUsersForAssignment = async () => {
  try {
    const { data } = await axios.get('/api/admin/users/all');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch all users';
  }
};


// --- Club Functions ---
export const getClubs = async () => {
  try {
    const { data } = await axios.get('/api/admin/clubs');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch clubs';
  }
};

export const createClub = async (clubData) => {
  try {
    const { data } = await axios.post('/api/admin/clubs', clubData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to create club';
  }
};

export const updateClub = async (id, clubData) => {
  try {
    const { data } = await axios.put(`/api/admin/clubs/${id}`, clubData);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to update club';
  }
};

export const deleteClub = async (id) => {
  try {
    const { data } = await axios.delete(`/api/admin/clubs/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete club';
  }
};