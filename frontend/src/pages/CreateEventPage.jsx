// src/pages/CreateEventPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../api/eventService';

const CreateEventPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [posterImage, setPosterImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [venueRequired, setVenueRequired] = useState(false);
  const [budgetRequired, setBudgetRequired] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('eventDate', eventDate);
    formData.append('posterImage', posterImage);
    formData.append('venueRequired', venueRequired);
    formData.append('budgetRequired', budgetRequired);
    if (budgetRequired) {
      formData.append('budgetAmount', budgetAmount);
    }

    try {
      await createEvent(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8 text-gray-50">
      <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-indigo-400">Propose a New Event</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-400">Event Title</label>
            <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full input-style" />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block mb-2 text-sm font-medium text-gray-400">Description</label>
            <textarea id="description" rows="4" value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full input-style"></textarea>
          </div>

          {/* Event Date - with min attribute */}
          <div>
            <label htmlFor="eventDate" className="block mb-2 text-sm font-medium text-gray-400">Event Date</label>
            <input 
                type="date" 
                id="eventDate" 
                value={eventDate} 
                onChange={(e) => setEventDate(e.target.value)} 
                required 
                min={getTodayDate()} // <--- Prevents past dates
                className="w-full input-style" 
            />
          </div>

          {/* Poster Image Upload */}
          <div>
            <label htmlFor="posterImage" className="block mb-2 text-sm font-medium text-gray-400">Event Poster</label>
            <input type="file" id="posterImage" onChange={handleFileChange} required className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-400"/>
            {imagePreview && (
              <div className="mt-4">
                <p className="text-sm text-gray-400 mb-2">Image Preview:</p>
                <img src={imagePreview} alt="Poster preview" className="w-full max-w-xs rounded-lg shadow-md" />
              </div>
            )}
          </div>
          
          {/* Resource Requests */}
          <div className="space-y-4 pt-4 border-t border-gray-700">
            <h3 className="text-lg font-semibold">Resource Requests</h3>
            <div className="flex items-center">
              <input type="checkbox" id="venueRequired" checked={venueRequired} onChange={(e) => setVenueRequired(e.target.checked)} className="h-4 w-4 rounded accent-indigo-500"/>
              <label htmlFor="venueRequired" className="ml-2 text-sm text-gray-400">Venue Required?</label>
            </div>
            <div className="flex items-center">
              <input type="checkbox" id="budgetRequired" checked={budgetRequired} onChange={(e) => setBudgetRequired(e.target.checked)} className="h-4 w-4 rounded accent-indigo-500"/>
              <label htmlFor="budgetRequired" className="ml-2 text-sm text-gray-400">Budget Required?</label>
            </div>
            {/* Conditional Budget Amount */}
            {budgetRequired && (
              <div>
                <label htmlFor="budgetAmount" className="block mb-2 text-sm font-medium text-gray-400">Budget Amount (₹)</label>
                <input type="number" id="budgetAmount" value={budgetAmount} onChange={(e) => setBudgetAmount(e.target.value)} required min="0" className="w-full input-style" />
              </div>
            )}
          </div>
          
          {error && <p className="text-sm text-center text-red-500">{error}</p>}

          <button type="submit" disabled={loading} className="w-full font-bold py-3 px-4 rounded-lg bg-indigo-500 hover:bg-indigo-400 disabled:bg-gray-500 transition-colors duration-300">
            {loading ? 'Submitting...' : 'Submit Proposal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEventPage;