// controllers/adminController.js
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';
import Club from '../models/clubModel.js';
import bcrypt from 'bcryptjs';

// --- User Management ---

// @desc    Get all users with pagination
// @route   GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 10; // Sets how many users to show per page
  const page = Number(req.query.pageNumber) || 1;

  // Get the total count of users to calculate the number of pages
  const count = await User.countDocuments({}); 
  
  const users = await User.find({})
    .limit(pageSize) // Apply the limit
    .skip(pageSize * (page - 1)) // Skip documents on previous pages
    .select('-password');

  // Send back the users for the current page, and the page numbers
  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize), 
  });
});

// @desc    Create a user
// @route   POST /api/admin/users
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, department } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashedPassword, role, department });
  res.status(201).json(user);
});

// @desc    Update a user
// @route   PUT /api/admin/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.role = req.body.role || user.role;
    user.department = req.body.department || user.department;

    // Only update password if a new one was provided, and hash it
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users for assignment (no pagination)
// @route   GET /api/admin/users/all
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('_id name role');
  res.json(users);
});



// --- Club Management ---

// @desc    Get all clubs
// @route   GET /api/admin/clubs
export const getClubs = asyncHandler(async (req, res) => {
  // Populate president and faculty names instead of just IDs
  const clubs = await Club.find({})
    .populate('presidentId', 'name')
    .populate('facultyHeadId', 'name');
  res.json(clubs);
});

// @desc    Create a club
// @route   POST /api/admin/clubs
export const createClub = asyncHandler(async (req, res) => {
  const { name, department, presidentId, facultyHeadId } = req.body;

  // Create the new club
  const club = new Club({ name, department, presidentId, facultyHeadId });
  const createdClub = await club.save();

  // --- ADDED LOGIC ---
  // Link the club back to the assigned users
  if (presidentId) {
    await User.findByIdAndUpdate(presidentId, { assignedClubId: createdClub._id });
  }
  if (facultyHeadId) {
    await User.findByIdAndUpdate(facultyHeadId, { assignedClubId: createdClub._id });
  }
  // -------------------

  res.status(201).json(createdClub);
});


// @desc    Update a club
// @route   PUT /api/admin/clubs/:id
export const updateClub = asyncHandler(async (req, res) => {
  const { name, department, presidentId, facultyHeadId } = req.body;
  const club = await Club.findById(req.params.id);

  if (club) {
    const oldPresidentId = club.presidentId;
    const oldFacultyHeadId = club.facultyHeadId;

    // Update club details from request body
    club.name = name || club.name;
    club.department = department || club.department;
    club.presidentId = presidentId || club.presidentId;
    club.facultyHeadId = facultyHeadId || club.facultyHeadId;
    
    const updatedClub = await club.save();

    // --- NEW ROBUST LOGIC ---

    // 1. If the president was changed, un-assign the old one
    if (oldPresidentId && oldPresidentId.toString() !== updatedClub.presidentId.toString()) {
      await User.findByIdAndUpdate(oldPresidentId, { $unset: { assignedClubId: "" } });
    }

    // 2. If the faculty head was changed, un-assign the old one
    if (oldFacultyHeadId && oldFacultyHeadId.toString() !== updatedClub.facultyHeadId.toString()) {
        await User.findByIdAndUpdate(oldFacultyHeadId, { $unset: { assignedClubId: "" } });
    }

    // 3. ALWAYS ensure the CURRENT president and faculty are correctly assigned
    await User.findByIdAndUpdate(updatedClub.presidentId, { assignedClubId: updatedClub._id });
    await User.findByIdAndUpdate(updatedClub.facultyHeadId, { assignedClubId: updatedClub._id });

    // -------------------------
    
    res.json(updatedClub);
  } else {
    res.status(404);
    throw new Error('Club not found');
  }
});

// @desc    Delete a club
// @route   DELETE /api/admin/clubs/:id
export const deleteClub = asyncHandler(async (req, res) => {
  const club = await Club.findById(req.params.id);
  if (club) {
    // Un-assign the club from the president and faculty head before deleting
    if (club.presidentId) {
      await User.findByIdAndUpdate(club.presidentId, { $unset: { assignedClubId: '' } });
    }
    if (club.facultyHeadId) {
      await User.findByIdAndUpdate(club.facultyHeadId, { $unset: { assignedClubId: '' } });
    }

    await club.deleteOne();
    res.json({ message: 'Club removed' });
  } else {
    res.status(404);
    throw new Error('Club not found');
  }
});