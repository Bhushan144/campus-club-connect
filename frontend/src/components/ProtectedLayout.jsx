// src/components/ProtectedLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const ProtectedLayout = () => {
  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar />
      <main>
        {/* The content of our protected pages will be rendered here */}
        <Outlet />
      </main>
    </div>
  );
};

export default ProtectedLayout;