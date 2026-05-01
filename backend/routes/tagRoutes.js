import express from 'express';
import {
  createTag,
  getAllTags,
  getTagById,
  getTagBySlug,
  updateTag,
  deleteTag,
} from '../controllers/tagController.js';
import {
  validateCreateTag,
  validateUpdateTag,
  validateTagId,
  validateTagSlug,
} from '../validators/tagValidator.js';
import { protect } from '../middleware/auth.js';
import { requireAdminOrAbove } from '../middleware/permissions.js';

const router = express.Router();

// Public routes
router.get('/', getAllTags);
router.get('/slug/:slug', validateTagSlug, getTagBySlug);
router.get('/:id', validateTagId, getTagById);

// Admin-only routes
router.post('/', protect, requireAdminOrAbove, validateCreateTag, createTag);
router.put('/:id', protect, requireAdminOrAbove, validateUpdateTag, updateTag);
router.delete('/:id', protect, requireAdminOrAbove, validateTagId, deleteTag);

export default router;
