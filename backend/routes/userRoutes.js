// routes/userRoutes.js

import express from 'express';
import { registerUser, loginUser, getUserProfile,logoutUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js'; // <-- IMPORT

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// This route is now protected. You must have a valid token to access it.
router.get('/profile', protect, getUserProfile);

export default router;