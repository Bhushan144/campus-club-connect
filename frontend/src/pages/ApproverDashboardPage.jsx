// src/pages/ApproverDashboardPage.jsx

import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getMyEvents, approveEvent, rejectEvent, allocateVenue, approveBudget } from '../api/eventService';

// Details Modal Component
const EventDetailsModal = ({ event, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
    <div className="bg-gray-800 p-6 rounded-lg max-w-lg w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">{event.title}</h2>
        <button onClick={onClose} className="text-gray-400 text-2xl hover:text-white">&times;</button>
      </div>
      <img src={event.posterImageUrl} alt="Poster" className="w-full h-48 object-contain rounded-md mb-4 bg-gray-700" />
      <p className="text-gray-300 mb-6">{event.description}</p>
      <button onClick={onClose} className="w-full bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-400">Close</button>
    </div>
  </div>
);

const ApproverDashboardPage = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
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
    fetchEvents();
  }, []);

  // --- UPDATED ACTION HANDLERS ---

  const handleAction = async (action, eventId, extraParam = null) => {
    try {
      setError(null);
      let success = false;

      if (action === 'approve') {
        if (window.confirm('Are you sure you want to approve this event?')) {
          await approveEvent(eventId);
          success = true;
        }
      } else if (action === 'reject') {
        const comments = prompt("Please provide a reason for rejection:");
        if (comments && comments.trim() !== '') {
          await rejectEvent(eventId, comments);
          success = true;
        }
      } else if (action === 'allocateVenue') {
        const room = prompt("Please enter the room name or number to allocate:");
        if (room && room.trim() !== '') {
          await allocateVenue(eventId, room);
          success = true;
        }
      } else if (action === 'approveBudget') {
        if (window.confirm('Are you sure you want to approve this budget?')) {
          await approveBudget(eventId);
          success = true;
        }
      }

      // If the action was successful, remove the event from the UI instantly
      if (success) {
        setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
      }
    } catch (err) {
      setError(err.toString());
    }
  };


  if (loading) return <div className="text-center text-gray-50 p-8">Loading queue...</div>;
  if (error) return <div className="text-center text-red-500 p-8">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-50">
            {['Accounts', 'RoomAllotter'].includes(user?.role) ? 'Resource Management' : 'Approval Dashboard'}
          </h1>
          {user?.role === 'HOD' && (
            <Link to="/analytics" className="text-indigo-400 hover:underline font-semibold">View Analytics Dashboard</Link>
          )}
        </div>

        {events.length > 0 ? (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="bg-gray-800 p-4 rounded-lg shadow-md flex flex-col sm:flex-row justify-between sm:items-center">
                <div>
                  <h2 className="text-xl font-bold text-white">{event.title}</h2>
                  <p className="text-sm text-gray-400">From: {event.clubId?.name || 'N/A'}</p>
                  {user?.role === 'Accounts' && event.resourceRequests.budget.isRequired && (
                    <p className="text-sm font-semibold text-amber-400">Budget Requested: ₹{event.resourceRequests.budget.amount}</p>
                  )}
                  {user?.role === 'RoomAllotter' && event.resourceRequests.venue.isRequired && (
                    <p className="text-sm font-semibold text-cyan-400">Venue booking required</p>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                  <button onClick={() => setSelectedEvent(event)} className="text-sm text-indigo-400 hover:underline">View Details</button>
                  {['FacultyHead', 'VC', 'HOD'].includes(user?.role) && (
                    <>
                      <button onClick={() => handleAction('approve', event._id)} className="px-4 py-2 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-500">Approve</button>
                      <button onClick={() => handleAction('reject', event._id)} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500">Reject</button>
                    </>
                  )}
                  {user?.role === 'RoomAllotter' && (
                    <button onClick={() => handleAction('allocateVenue', event._id)} className="px-4 py-2 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-500">Allocate Venue</button>
                  )}
                  {user?.role === 'Accounts' && (
                    <button onClick={() => handleAction('approveBudget', event._id)} className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500">Approve Budget</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-50">Queue is Clear!</h2>
            <p className="mt-2 text-gray-400">You have no pending tasks at the moment.</p>
          </div>
        )}
      </div>

      {selectedEvent && <EventDetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
};

export default ApproverDashboardPage;