import axios from 'axios';

// Fetch all notifications for the logged-in user
export const getNotifications = async () => {
  try {
    const { data } = await axios.get('/api/notifications');
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch notifications';
  }
};

// Mark a specific notification as read
export const markRead = async (id) => {
  try {
    const { data } = await axios.patch(`/api/notifications/${id}/read`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to mark notification as read';
  }
};

export const deleteNotification = async (id) => {
  try {
    const { data } = await axios.delete(`/api/notifications/${id}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to delete notification';
  }
};