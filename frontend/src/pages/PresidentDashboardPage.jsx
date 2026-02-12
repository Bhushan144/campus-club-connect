import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getMyEvents, deleteEvent } from '../api/eventService'; // Import delete
import EventCard from '../components/EventCard';
import ConfirmationModal from '../components/ConfirmationModal'; // Reuse this!

const PresidentDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Delete modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await getMyEvents();
      setEvents(data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (e, event) => {
    e.preventDefault(); // Stop navigation if clicked inside Link
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
        await deleteEvent(eventToDelete._id);
        // Optimistic UI update
        setEvents(events.filter(e => e._id !== eventToDelete._id));
        setIsDeleteModalOpen(false);
    } catch (err) {
        alert(err); // Simple alert for error or use a toast state
    }
  };

  // Custom Event Card wrapper to include Delete button
  const PresidentEventCard = ({ event }) => (
    <div className="relative">
        <EventCard event={event} />
        <button 
            onClick={(e) => handleDeleteClick(e, event)}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 shadow-lg transition-colors z-10"
            title="Delete Event"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        </button>
    </div>
  );

  if (loading) return <div className="text-center p-8 text-gray-50">Loading your events...</div>;
  if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-50">President's Dashboard</h1>
          <Link
            to="/create-event"
            className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-400 transition-colors duration-300 flex items-center"
          >
            <span className="mr-2 text-xl">+</span> Create New Event
          </Link>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <PresidentEventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-50">No Events Found</h2>
            <p className="mt-2 text-gray-400">You haven't created any events yet.</p>
            <Link to="/create-event" className="mt-6 inline-block bg-indigo-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-400">
              Create Your First Event
            </Link>
          </div>
        )}
      </div>

      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Event"
        message="Are you sure? This will permanently delete this event proposal and all associated data."
      />
    </div>
  );
};

export default PresidentDashboardPage;