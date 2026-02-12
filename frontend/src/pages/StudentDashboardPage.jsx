import React, { useState, useEffect } from 'react';
import { getMyEvents } from '../api/eventService';
import EventCard from '../components/EventCard';

const StudentDashboardPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewHistory, setViewHistory] = useState(false); // Toggle state

  const fetchActiveEvents = async () => {
    try {
      setLoading(true);
      // Pass the viewHistory state to the API call
      const data = await getMyEvents(viewHistory);
      setEvents(data);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch whenever the view toggle changes
  useEffect(() => {
    fetchActiveEvents();
  }, [viewHistory]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Toggle */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-gray-700 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-50">
                {viewHistory ? 'Past Events' : 'Upcoming Events'}
            </h1>
            <p className="mt-1 text-gray-400">
                {viewHistory ? 'Events that have already taken place.' : 'Active events happening across college.'}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-gray-800 p-1 rounded-lg flex">
            <button 
                onClick={() => setViewHistory(false)}
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${!viewHistory ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                Upcoming
            </button>
            <button 
                onClick={() => setViewHistory(true)}
                className={`px-4 py-2 rounded-md font-semibold transition-colors ${viewHistory ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                History
            </button>
          </div>
        </div>

        {/* Event Grid Section */}
        {loading ? (
            <div className="text-center p-8 text-gray-50">Loading events...</div>
        ) : error ? (
            <div className="text-center p-8 text-red-500">Error: {error}</div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-50">No {viewHistory ? 'Past' : 'Active'} Events</h2>
            <p className="mt-2 text-gray-400">
                {viewHistory ? 'No event history found.' : 'There are no upcoming events at the moment.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboardPage;