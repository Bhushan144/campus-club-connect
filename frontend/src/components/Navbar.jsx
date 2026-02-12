import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { getNotifications, markRead, deleteNotification } from '../api/notificationService';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 60000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const handleRead = async (notif) => {
    if (!notif.isRead) {
      try {
        await markRead(notif._id);
        setNotifications(notifications.map(n => 
          n._id === notif._id ? { ...n, isRead: true } : n
        ));
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent triggering the row click
    try {
      await deleteNotification(id);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="bg-gray-800 text-white shadow-md relative z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-indigo-400">
              ClubSphere
            </Link>
          </div>

          <div className="flex items-center">
            {user && (
              <div className="relative mr-6" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)} 
                  className="relative p-1 rounded-full text-gray-400 hover:text-white focus:outline-none transition-colors"
                >
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500 ring-2 ring-gray-900"></span>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 overflow-hidden ring-1 ring-black ring-opacity-5 origin-top-right">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b font-bold bg-gray-50 flex justify-between items-center">
                      <span>Notifications</span>
                      {unreadCount > 0 && <span className="text-xs font-normal text-indigo-600">{unreadCount} new</span>}
                    </div>
                    
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-gray-500 text-center">No notifications</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id} 
                            onClick={() => handleRead(notif)}
                            className={`group flex items-start justify-between px-4 py-3 border-b border-gray-100 cursor-pointer transition-colors relative ${
                              notif.isRead ? 'bg-white hover:bg-gray-50' : 'bg-indigo-50 hover:bg-indigo-100'
                            }`}
                          >
                            <div className="flex-1 pr-2">
                              <p className={`text-sm ${notif.isRead ? 'text-gray-600' : 'text-gray-900 font-medium'}`}>
                                {notif.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </p>
                            </div>
                            
                            {/* Delete Button - Appears on Hover */}
                            <button
                              onClick={(e) => handleDelete(e, notif._id)}
                              className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Delete notification"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {user && (
              <span className="mr-4 text-gray-300 hidden sm:inline-block">
                Welcome, <span className="font-semibold">{user.name}</span>
              </span>
            )}

            <button
              onClick={logout}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-400 transition-colors duration-300 text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;