import React from 'react';

/**
 * A reusable modal component for confirming destructive actions.
 *
 * @param {object} props
 * @param {boolean} props.isOpen - Whether the modal is currently visible.
 * @param {function} props.onClose - Function to call when the modal is closed (e.g., by clicking "Cancel").
 * @param {function} props.onConfirm - Function to call when the confirmation button is clicked.
 * @param {string} props.title - The title to display in the modal header.
 * @param {string} props.message - The descriptive message or question to show the user.
 */
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  // If the modal is not open, render nothing.
  if (!isOpen) {
    return null;
  }

  return (
    // Main overlay: fixed position, covers the whole screen
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      
      {/* Modal Dialog */}
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        
        {/* Modal Content */}
        <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
        <p className="text-gray-300 mb-6">{message}</p>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 font-semibold text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 font-semibold text-white transition-colors"
          >
            Confirm
          </button>
        </div>

      </div>
    </div>
  );
};

export default ConfirmationModal;