import express from 'express';
import { protect } from '../middlewares/authMiddleware.js';
import { 
    getMyNotifications, 
    markNotificationRead, 
    deleteNotification // <-- Import this
} from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.patch('/:id/read', protect, markNotificationRead);
router.delete('/:id', protect, deleteNotification); // <-- Add this route

export default router;