// src/App.jsx

import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import AuthContext from './context/AuthContext';

// Import all Pages & Layout Components
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PresidentDashboardPage from './pages/PresidentDashboardPage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import ApproverDashboardPage from './pages/ApproverDashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import HodAnalyticsPage from './pages/HodAnalyticsPage'

// Import Route Guards & Layouts
import PrivateRoute from './components/PrivateRoute';
import ProtectedLayout from './components/ProtectedLayout';
import RoleBasedRoute from './components/RoleBasedRoute';


// ... other imports
import AdminLayout from './components/AdminLayout';
import UserListPage from './pages/admin/UserListPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ClubListPage from './pages/admin/ClubListPage';

import EventDetailsPage from './pages/EventDetailsPage';


// This component intelligently directs users to the correct dashboard.
const DashboardRedirect = () => {
  const { user } = useContext(AuthContext);

  switch (user?.role) {
    // --- UPDATED LOGIC ---
    case 'SuperAdmin':
      return <AdminDashboardPage />; // Redirect to the admin panel
    case 'ClubPresident':
      return <PresidentDashboardPage />; // President gets their own dashboard
    // ----------------------
    case 'Student':
      return <StudentDashboardPage />;
    case 'FacultyHead':
    case 'VC':
    case 'HOD':
    case 'RoomAllotter':
    case 'Accounts':
      return <ApproverDashboardPage />;
    default:
      return <UnauthorizedPage />;
  }
};


// This is the main App component.
const App = () => {
  return (
    <div>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />


        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<ProtectedLayout />}>

            {/* The single /dashboard route now uses our smart redirector */}
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* This route is specifically for Club Presidents */}
            <Route element={<RoleBasedRoute allowedRoles={['ClubPresident']} />}>
              <Route path="/create-event" element={<CreateEventPage />} />
            </Route>

            <Route path="/event/:id" element={<EventDetailsPage />} />

            {/* ADD HOD ANALYTICS ROUTE */}
            <Route element={<RoleBasedRoute allowedRoles={['HOD']} />}>
              <Route path="/analytics" element={<HodAnalyticsPage />} />
            </Route>
          </Route>
        </Route>


        {/* ADMIN ROUTES */}
        <Route element={<RoleBasedRoute allowedRoles={['SuperAdmin']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="users" element={<UserListPage />} />
            <Route path="clubs" element={<ClubListPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;