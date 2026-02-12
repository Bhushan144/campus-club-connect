// src/components/UserModal.jsx

import React, { useState, useEffect } from 'react';

const UserModal = ({ isOpen, onClose, onSave, userToEdit }) => {
    // State to manage form data
    const [formData, setFormData] = useState({
        name: '', 
        email: '', 
        password: '', 
        role: 'Student', 
        department: ''
    });

    const isEditMode = Boolean(userToEdit); // Determine if we are in edit or create mode

    // Effect to populate form when modal opens or userToEdit changes
    useEffect(() => {
        if (isOpen) { // Only update form data if the modal is actually open
            if (isEditMode) {
                setFormData({
                    name: userToEdit.name,
                    email: userToEdit.email,
                    password: '', // Password always cleared on edit for security
                    role: userToEdit.role,
                    department: userToEdit.department || '', // Handle null/undefined department
                });
            } else {
                // Reset form for create mode
                setFormData({ name: '', email: '', password: '', role: 'Student', department: '' });
            }
        }
    }, [userToEdit, isOpen, isEditMode]); // Depend on userToEdit and isOpen

    // Handler for input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    // Handler for form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        const dataToSend = { ...formData };

        if (isEditMode) {
            // If in edit mode and password is not changed, remove it from dataToSend
            if (!formData.password) {
                delete dataToSend.password;
            }
        } else {
            // In create mode, password is required
            if (!formData.password) {
                // This shouldn't happen if input is required, but good for safety
                alert("Password is required for new users.");
                return;
            }
        }
        onSave(dataToSend);
    };

    if (!isOpen) return null; // Render nothing if the modal is not open

    // Define all possible user roles
    const userRoles = ['Student', 'ClubPresident', 'FacultyHead', 'VC', 'HOD', 'RoomAllotter', 'Accounts', 'SuperAdmin'];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg shadow-xl">
                <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Edit User' : 'Create New User'}</h2>
                <div className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label htmlFor="userName" className="block mb-2 text-sm font-medium text-gray-400">Name</label>
                        <input type="text" id="userName" name="name" value={formData.name} onChange={handleChange} required 
                               className="input-style block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    {/* Email Input */}
                    <div>
                        <label htmlFor="userEmail" className="block mb-2 text-sm font-medium text-gray-400">Email</label>
                        <input type="email" id="userEmail" name="email" value={formData.email} onChange={handleChange} required 
                               className="input-style block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    {/* Password Input (conditional required for edit mode) */}
                    <div>
                        <label htmlFor="userPassword" className="block mb-2 text-sm font-medium text-gray-400">
                            Password {isEditMode ? '(Leave blank to keep unchanged)' : ''}
                        </label>
                        <input type="password" id="userPassword" name="password" value={formData.password} onChange={handleChange} 
                               required={!isEditMode} // Password is only required when creating a new user
                               className="input-style block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                    {/* Role Dropdown */}
                    <div>
                        <label htmlFor="userRole" className="block mb-2 text-sm font-medium text-gray-400">Role</label>
                        <select id="userRole" name="role" value={formData.role} onChange={handleChange} required
                                className="input-style block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500">
                            {userRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    {/* Department Input (optional) */}
                    <div>
                        <label htmlFor="userDepartment" className="block mb-2 text-sm font-medium text-gray-400">Department (for HOD/Faculty)</label>
                        <input type="text" id="userDepartment" name="department" value={formData.department} onChange={handleChange} 
                               className="input-style block w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
                    </div>
                </div>
                {/* Action Buttons */}
                <div className="flex justify-end space-x-4 mt-8">
                    <button type="button" onClick={onClose} 
                            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold text-white transition-colors">
                        Cancel
                    </button>
                    <button type="submit" 
                            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white transition-colors">
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserModal;