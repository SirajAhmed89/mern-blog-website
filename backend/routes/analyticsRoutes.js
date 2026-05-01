import express from 'express';
import { getDashboardAnalytics, getPostAnalytics } from '../controllers/analyticsController.js';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';

const router = express.Router();

// All routes require authentication and dashboard.analytics permission
router.use(protect);
router.use(requirePermission('dashboard.analytics'));

// Get dashboard analytics
router.get('/dashboard', getDashboardAnalytics);

// Get post analytics
router.get('/posts', getPostAnalytics);

export default router;
