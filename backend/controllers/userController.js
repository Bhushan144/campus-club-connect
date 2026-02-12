// controllers/userController.js

import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; 
import User from '../models/userModel.js';

// --- Helper function to generate token and set cookie ---
const generateTokenAndSetCookie = (res, userId, userRole) => {
  const token = jwt.sign({ userId, role: userRole }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true, // Prevents client-side JS from accessing the cookie
    secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};


// @desc    Register a new user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const user = await User.create({ name, email, password: hashedPassword });

  if (user) {
    generateTokenAndSetCookie(res, user._id, user.role); // <-- USE THE HELPER
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate a user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    generateTokenAndSetCookie(res, user._id, user.role); // <-- USE THE HELPER
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


// Add this to controllers/userController.js
const getUserProfile = asyncHandler(async (req, res) => {
  // req.user is available here because the 'protect' middleware ran first
  res.json(req.user); 
});


// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private
const logoutUser = asyncHandler(async (req, res) => {
  // To log out, we just need to clear the cookie.
  // We do this by sending a new cookie with the same name,
  // an empty value, and an expiration date in the past.
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(0), // Set to a past date
  });

  res.status(200).json({ message: 'Logged out successfully' });
});

// Don't forget to export it!
export { registerUser, loginUser, getUserProfile,logoutUser };
