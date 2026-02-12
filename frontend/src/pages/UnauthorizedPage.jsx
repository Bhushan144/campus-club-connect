// src/pages/UnauthorizedPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-6xl font-bold text-red-500">403</h1>
      <h2 className="text-3xl font-semibold mt-4">Access Denied</h2>
      <p className="mt-2 text-gray-400">You do not have permission to view this page.</p>
      <Link 
        to="/dashboard" // This will redirect to their appropriate dashboard
        className="mt-8 px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg hover:bg-indigo-400 transition-colors"
      >
        Go to My Dashboard
      </Link>
    </div>
  );
};

export default UnauthorizedPage;