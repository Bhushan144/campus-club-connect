import express from 'express';
import { 
    createEvent, 
    approveEvent, 
    rejectEvent, 
    getEvents, 
    allocateVenue, 
    approveBudget, 
    getEventById,
    deleteEvent
} from '../controllers/eventController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, authorize('ClubPresident'), upload.single('posterImage'), createEvent);

router.route('/:id')
    .get(protect, getEventById)
    .delete(protect, authorize('ClubPresident', 'SuperAdmin'), deleteEvent);

router.route('/:id/approve').patch(protect, authorize('FacultyHead', 'VC', 'HOD'), approveEvent);
router.route('/:id/reject').patch(protect, authorize('FacultyHead', 'VC', 'HOD'), rejectEvent);

router.route('/:id/allocate-venue').patch(protect, authorize('RoomAllotter'), allocateVenue);
router.route('/:id/approve-budget').patch(protect, authorize('Accounts'), approveBudget);

export default router;