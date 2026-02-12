// src/components/RoleBasedRoute.jsx

import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const RoleBasedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext); // <-- Get the 'loading' state

  // 1. Wait for the initial authentication check to finish
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // 2. Once loading is false, check for authorization
  const isAuthorized = user && allowedRoles.includes(user.role);

  return isAuthorized ? <Outlet /> : <Navigate to="/unauthorized" replace />;
};

export default RoleBasedRoute;