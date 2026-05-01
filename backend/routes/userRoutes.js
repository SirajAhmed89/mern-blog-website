import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { requireAdminOrAbove, requirePermission } from '../middleware/permissions.js';

const router = express.Router();

router.use(protect);
router.use(requireAdminOrAbove);

// List / view — requires users.view
router.get('/', requirePermission('users.view'), getAllUsers);
router.get('/:id', requirePermission('users.view'), getUserById);

// Self-update (profile edit) is always allowed; editing others requires users.edit or users.ban
router.put('/:id', (req, res, next) => {
  // Allow admins to update their own profile without needing users.edit
  if (req.params.id === req.user.id || req.params.id === String(req.user._id)) {
    return next();
  }
  // Editing someone else requires users.edit or users.ban
  return requirePermission('users.edit', 'users.ban')(req, res, next);
}, updateUser);

router.delete('/:id', requirePermission('users.delete'), deleteUser);

export default router;
