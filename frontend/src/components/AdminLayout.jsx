// src/components/AdminLayout.jsx

import React, { useContext } from 'react'; // <-- Import useContext
import { NavLink, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext'; // <-- Import AuthContext

const AdminLayout = () => {
  const { logout } = useContext(AuthContext); // <-- Get the logout function
  const linkStyles = "block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700";
  const activeLinkStyles = { backgroundColor: '#4f46e5' }; // Indigo-600

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 p-4 flex flex-col">
        <div>
          <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
          <nav>
            <NavLink to="/admin/users" style={({ isActive }) => isActive ? activeLinkStyles : undefined} className={linkStyles}>Manage Users</NavLink>
            <NavLink to="/admin/clubs" style={({ isActive }) => isActive ? activeLinkStyles : undefined} className={linkStyles}>Manage Clubs</NavLink>
          </nav>
        </div>
        <div className="mt-auto">
          {/* This is now a proper logout button */}
          <button 
            onClick={logout} 
            className={`${linkStyles} w-full text-left border-t border-gray-700 pt-4`}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;