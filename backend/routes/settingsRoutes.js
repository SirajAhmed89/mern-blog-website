import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middleware/auth.js';
import { requirePermission } from '../middleware/permissions.js';

const router = express.Router();

// Public route - anyone can view settings
router.get('/', getSettings);

// Protected route - only admins with dashboard.settings permission can update
router.put(
  '/',
  protect,
  requirePermission('dashboard.settings'),
  updateSettings
);

export default router;
