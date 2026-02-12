// routes/adminRoutes.js
import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { getUsers, createUser, updateUser, deleteUser,getClubs,createClub,updateClub,deleteClub,getAllUsers } from '../controllers/adminController.js';

const router = express.Router();

// All routes in this file are protected and only accessible by SuperAdmin
router.use(protect, authorize('SuperAdmin'));

router.route('/users/all').get(getAllUsers);

router.route('/users').get(getUsers).post(createUser);
router.route('/users/:id').put(updateUser).delete(deleteUser);

// --- ADD CLUB ROUTES ---
router.route('/clubs').get(getClubs).post(createClub);
router.route('/clubs/:id').put(updateClub).delete(deleteClub);

export default router;