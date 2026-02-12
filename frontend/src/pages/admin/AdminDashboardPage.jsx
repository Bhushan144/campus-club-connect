// src/pages/AdminDashboardPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect the admin to their main user management page
    navigate('/admin/users');
  }, [navigate]);

  // Render a loading message while the redirect happens
  return <div className="p-8 text-white">Redirecting to Admin Panel...</div>;
};

export default AdminDashboardPage;