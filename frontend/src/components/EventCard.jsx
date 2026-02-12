// src/components/EventCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const getStatusBadge = (status) => {
  const statusStyles = {
    Pending_Faculty_Approval: 'bg-amber-500',
    Pending_VC_Approval: 'bg-amber-500',
    Pending_HOD_Approval: 'bg-amber-500',
    Approved_Pending_Resources: 'bg-green-500',
    Active: 'bg-indigo-500',
    Rejected: 'bg-red-500',
    Completed: 'bg-gray-500',
  };
  const displayName = status.replace(/_/g, ' ');
  const bgColor = statusStyles[status] || 'bg-gray-400';
  return <span className={`px-2 py-1 text-xs font-semibold text-white rounded-full ${bgColor}`}>{displayName}</span>;
};

const EventCard = ({ event }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
      <img src={event.posterImageUrl} alt={event.title} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-gray-50 mb-1">{event.title}</h3>
          {getStatusBadge(event.overallStatus)}
        </div>
        <p className="text-sm text-gray-400 mb-4">
          {new Date(event.eventDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })}
        </p>
        <Link 
          to={`/event/${event._id}`} // We'll build this route later
          className="w-full text-center block bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-400 transition-colors duration-300"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;