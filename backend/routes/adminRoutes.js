import express from 'express';
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminPermissions,
  updateAdmin,
  deactivateAdmin,
  activateAdmin,
  deleteAdmin,
  getAvailablePermissions,
  getMyPermissions,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';
import { requireSuperAdmin, requireAdminOrAbove } from '../middleware/permissions.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createAdminValidator,
  updateAdminValidator,
  updatePermissionsValidator,
} from '../validators/adminValidator.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get current user's permissions (any admin)
router.get('/permissions/me', requireAdminOrAbove, getMyPermissions);

// Get available permissions (superadmin only)
router.get('/permissions/available', requireSuperAdmin, getAvailablePermissions);

// Admin management routes (superadmin only)
router.post(
  '/create',
  requireSuperAdmin,
  createAdminValidator,
  validateRequest,
  createAdmin
);

router.get('/list', requireSuperAdmin, getAllAdmins);
router.get('/:id', requireSuperAdmin, getAdminById);

router.put(
  '/:id',
  requireSuperAdmin,
  updateAdminValidator,
  validateRequest,
  updateAdmin
);

router.put(
  '/:id/permissions',
  requireSuperAdmin,
  updatePermissionsValidator,
  validateRequest,
  updateAdminPermissions
);

router.put('/:id/deactivate', requireSuperAdmin, deactivateAdmin);
router.put('/:id/activate', requireSuperAdmin, activateAdmin);
router.delete('/:id', requireSuperAdmin, deleteAdmin);

export default router;
