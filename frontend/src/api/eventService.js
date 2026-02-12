import axios from 'axios';

// ... existing getMyEvents ...
// Update getMyEvents to accept a query param
export const getMyEvents = async (showHistory = false) => {
  try {
    // Pass ?history=true if requested
    const { data } = await axios.get(`/api/events?history=${showHistory}`);
    return data;
  } catch (error) {
    throw error.response?.data?.message || 'Failed to fetch events';
  }
};

// ... existing createEvent ...
export const createEvent = async (eventData) => { /* ... existing ... */ 
    try {
        const { data } = await axios.post('/api/events', eventData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        return data;
      } catch (error) { throw error.response?.data?.message || 'Failed to create event'; }
};

// --- NEW DELETE FUNCTION ---
export const deleteEvent = async (eventId) => {
    try {
        const { data } = await axios.delete(`/api/events/${eventId}`);
        return data;
    } catch (error) {
        throw error.response?.data?.message || 'Failed to delete event';
    }
};

export const getEventDetails = async (id) => { /* ... existing ... */ 
    try {
        const { data } = await axios.get(`/api/events/${id}`);
        return data;
    } catch (error) { throw error.response?.data?.message || 'Failed to fetch details'; }
};

export const approveEvent = async (eventId) => { /* ... existing ... */ 
    try { const { data } = await axios.patch(`/api/events/${eventId}/approve`); return data; } 
    catch (error) { throw error.response?.data?.message || 'Failed'; }
};
export const rejectEvent = async (eventId, comments) => { /* ... existing ... */
    try { const { data } = await axios.patch(`/api/events/${eventId}/reject`, { comments }); return data; } 
    catch (error) { throw error.response?.data?.message || 'Failed'; }
};
export const allocateVenue = async (eventId, room) => { /* ... existing ... */
    try { const { data } = await axios.patch(`/api/events/${eventId}/allocate-venue`, { room }); return data; } 
    catch (error) { throw error.response?.data?.message || 'Failed'; }
};
export const approveBudget = async (eventId) => { /* ... existing ... */
    try { const { data } = await axios.patch(`/api/events/${eventId}/approve-budget`); return data; } 
    catch (error) { throw error.response?.data?.message || 'Failed'; }
};