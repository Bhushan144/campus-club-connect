// src/pages/admin/ClubListPage.jsx

import React, { useState, useEffect } from 'react';
import { getClubs, createClub, updateClub, deleteClub } from '../../api/adminService';
import ClubModal from '../../components/ClubModal';
import ConfirmationModal from '../../components/ConfirmationModal';

const ClubListPage = () => {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for managing modals
    const [isClubModalOpen, setIsClubModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [clubToEdit, setClubToEdit] = useState(null);
    const [clubToDelete, setClubToDelete] = useState(null);

    // --- Data Fetching ---
    const fetchClubs = async () => {
        try {
            setLoading(true);
            const data = await getClubs();
            setClubs(data);
            setError(null);
        } catch (err) {
            setError(err.toString());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClubs();
    }, []);

    // --- Action Handlers ---

    const handleSaveClub = async (clubData) => {
        try {
            if (clubToEdit) {
                await updateClub(clubToEdit._id, clubData);
            } else {
                await createClub(clubData);
            }
            fetchClubs(); // Refresh the list
            setIsClubModalOpen(false);
        } catch (err) {
            // Display error from API call in the modal or as a toast later
            console.error(err);
            setError(err.toString());
        }
    };

    const handleDeleteClub = async () => {
        try {
            await deleteClub(clubToDelete._id);
            fetchClubs(); // Refresh the list
            setIsConfirmModalOpen(false);
        } catch (err) {
            console.error(err);
            setError(err.toString());
        }
    };

    // --- Modal Control Handlers ---

    const openCreateModal = () => {
        setClubToEdit(null);
        setIsClubModalOpen(true);
    };

    const openEditModal = (club) => {
        setClubToEdit(club);
        setIsClubModalOpen(true);
    };

    const openDeleteModal = (club) => {
        setClubToDelete(club);
        setIsConfirmModalOpen(true);
    };

    if (loading) return <p className="text-gray-300">Loading clubs...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Manage Clubs</h1>
                <button onClick={openCreateModal} className="bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-400">
                    + Add Club
                </button>
            </div>

            {error && <div className="bg-red-500 text-white p-4 rounded-lg mb-4">{error}</div>}

            <div className="bg-gray-800 shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Club Name</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Department</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">President</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Faculty Head</th>
                            <th className="px-5 py-3 border-b-2 border-gray-700"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {clubs.map((club) => (
                            <tr key={club._id}>
                                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">{club.name}</td>
                                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">{club.department}</td>
                                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">{club.presidentId?.name || <span className="text-gray-500">Not Assigned</span>}</td>
                                <td className="px-5 py-5 border-b border-gray-700 text-sm text-white">{club.facultyHeadId?.name || <span className="text-gray-500">Not Assigned</span>}</td>
                                <td className="px-5 py-5 border-b border-gray-700 text-sm text-right">
                                    <button onClick={() => openEditModal(club)} className="text-indigo-400 hover:text-indigo-300 mr-4 font-semibold">Edit</button>
                                    <button onClick={() => openDeleteModal(club)} className="text-red-400 hover:text-red-300 font-semibold">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ClubModal isOpen={isClubModalOpen} onClose={() => setIsClubModalOpen(false)} onSave={handleSaveClub} clubToEdit={clubToEdit} />
            <ConfirmationModal 
                isOpen={isConfirmModalOpen} 
                onClose={() => setIsConfirmModalOpen(false)} 
                onConfirm={handleDeleteClub}
                title="Delete Club"
                message={`Are you sure you want to delete the club: ${clubToDelete?.name}? This action cannot be undone.`}
            />
        </div>
    );
};

export default ClubListPage;