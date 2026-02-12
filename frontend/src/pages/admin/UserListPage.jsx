// src/pages/admin/UserListPage.jsx

import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../../api/adminService';
import UserModal from '../../components/UserModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const UserListPage = () => {
  // State for data and pagination
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // State for controlling modals
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // --- Data Fetching ---
  const fetchUsers = async (pageNum = 1) => {
    try {
      setLoading(true);
      const data = await getUsers(pageNum);
      setUsers(data.users);
      setPage(data.page);
      setPages(data.pages);
      setError(null);
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]); // Re-fetch users if the page number changes

  // --- Action Handlers ---

  const handleSaveUser = async (userData) => {
    try {
      if (userToEdit) {
        await updateUser(userToEdit._id, userData);
      } else {
        await createUser(userData);
      }
      fetchUsers(page); // Refresh the current page
      setIsUserModalOpen(false);
    } catch (err) {
      setError(err.toString());
      // Optionally, keep the modal open and display the error inside it
    }
  };

  const handleDeleteUser = async () => {
    try {
      await deleteUser(userToDelete._id);
      fetchUsers(page); // Refresh the current page
      setIsConfirmModalOpen(false);
    } catch (err) {
      setError(err.toString());
    }
  };

  // --- Modal Control Handlers ---

  const openCreateModal = () => {
    setUserToEdit(null); // Ensure we are in "create" mode
    setIsUserModalOpen(true);
  };

  const openEditModal = (user) => {
    setUserToEdit(user);
    setIsUserModalOpen(true);
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setIsConfirmModalOpen(true);
  };

  const pageChangeHandler = (newPage) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage);
    }
  };

  if (loading) return <p className="text-gray-300">Loading users...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Users</h1>
        <button onClick={openCreateModal} className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-400">
          + Add User
        </button>
      </div>

      {error && <div className="bg-red-900 text-red-200 p-4 rounded-lg mb-4 border border-red-700">{error}</div>}

      <div className="bg-gray-800 shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Role</th>
              <th className="px-5 py-3 border-b-2 border-gray-700"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">{user.name}</td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">{user.email}</td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">{user.role}</td>
                <td className="px-5 py-5 border-b border-gray-700 text-sm text-right">
                  <button onClick={() => openEditModal(user)} className="text-indigo-400 hover:text-indigo-300 mr-4 font-semibold">Edit</button>
                  <button onClick={() => openDeleteModal(user)} className="text-red-400 hover:text-red-300 font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <button onClick={() => pageChangeHandler(page - 1)} disabled={page === 1} className="px-4 py-2 mx-1 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
            &laquo; Prev
          </button>
          <span className="px-4 py-2 mx-1 text-white">
            Page {page} of {pages}
          </span>
          <button onClick={() => pageChangeHandler(page + 1)} disabled={page === pages} className="px-4 py-2 mx-1 bg-gray-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
            Next &raquo;
          </button>
        </div>
      )}

      <UserModal isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} onSave={handleSaveUser} userToEdit={userToEdit} />
      <ConfirmationModal 
        isOpen={isConfirmModalOpen} 
        onClose={() => setIsConfirmModalOpen(false)} 
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default UserListPage;