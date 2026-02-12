// routes/analyticsRoutes.js
import express from 'express';
import { protect, authorize } from '../middlewares/authMiddleware.js';
import { getHodAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();
router.route('/hod').get(protect, authorize('HOD'), getHodAnalytics);

export default router;