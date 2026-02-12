// src/components/ClubModal.jsx

import React, { useState, useEffect } from 'react';
import { getAllUsersForAssignment } from '../api/adminService'; // <-- Use the new service

const ClubModal = ({ isOpen, onClose, onSave, clubToEdit }) => {
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('');
    const [presidentId, setPresidentId] = useState('');
    const [facultyHeadId, setFacultyHeadId] = useState('');

    const [allUsers, setAllUsers] = useState([]); // Store all users for dropdowns
    const isEditMode = Boolean(clubToEdit);

    useEffect(() => {
        const fetchUsersForDropdown = async () => {
            try {
                // Use the new, non-paginated function
                const data = await getAllUsersForAssignment();
                setAllUsers(data);
            } catch (error) {
                console.error("Failed to fetch users for dropdowns", error);
            }
        };

        if (isOpen) {
            fetchUsersForDropdown();
            if (isEditMode) {
                setName(clubToEdit.name);
                setDepartment(clubToEdit.department);
                setPresidentId(clubToEdit.presidentId?._id || '');
                setFacultyHeadId(clubToEdit.facultyHeadId?._id || '');
            } else {
                setName(''); setDepartment(''); setPresidentId(''); setFacultyHeadId('');
            }
        }
    }, [clubToEdit, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ name, department, presidentId, facultyHeadId });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
            <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-8 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-6">{isEditMode ? 'Edit Club' : 'Create New Club'}</h2>
                {/* Name */}
                <div>
                    <label className="block mb-2 text-sm font-medium text-gray-400">Club Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="input-style" />
                </div>
                {/* Department */}
                <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-400">Department</label>
                    <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} required className="input-style" />
                </div>
                {/* President Dropdown */}
                <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-400">Assign President</label>
                    <select value={presidentId} onChange={(e) => setPresidentId(e.target.value)} required className="input-style">
                        <option value="">Select a President</option>
                        {allUsers.filter(u => u.role === 'ClubPresident').map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                    </select>
                </div>
                {/* Faculty Head Dropdown */}
                <div className="mt-4">
                    <label className="block mb-2 text-sm font-medium text-gray-400">Assign Faculty Head</label>
                    <select value={facultyHeadId} onChange={(e) => setFacultyHeadId(e.target.value)} required className="input-style">
                        <option value="">Select a Faculty Head</option>
                        {allUsers.filter(u => u.role === 'FacultyHead').map(user => <option key={user._id} value={user._id}>{user.name}</option>)}
                    </select>
                </div>
                <div className="flex justify-end space-x-4 mt-8">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold">Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-white">Save Changes</button>
                </div>
            </form>
        </div>
    );
};
export default ClubModal;