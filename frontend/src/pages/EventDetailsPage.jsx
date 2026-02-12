// src/pages/EventDetailsPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getEventDetails } from '../api/eventService';

const EventDetailsPage = () => {
  const { id: eventId } = useParams(); // Get the 'id' from the URL
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventDetails(eventId);
        setEvent(data);
      } catch (err) {
        setError(err.toString());
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <div className="p-8 text-white">Loading Event Details...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
  if (!event) return <div className="p-8 text-white">Event not found.</div>;

  return (
    <div className="bg-gray-900 min-h-screen text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/dashboard" className="text-indigo-400 hover:underline">&larr; Back to Dashboard</Link>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <img src={event.posterImageUrl} alt={event.title} className="w-full h-64 object-contain bg-gray-700" />
          <div className="p-6">
            <h1 className="text-4xl font-extrabold mb-2">{event.title}</h1>
            <p className="text-lg text-indigo-400 font-semibold mb-4">
              Hosted by {event.clubId?.name || 'Unknown Club'}
            </p>
            <p className="text-gray-400 mb-6">
              Date: {new Date(event.eventDate).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
              })}
            </p>
            <div className="prose prose-invert max-w-none">
              <p>{event.description}</p>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-700">
                <h3 className="text-md font-semibold text-gray-400">Status</h3>
                <p className="text-xl font-bold">{event.overallStatus.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;