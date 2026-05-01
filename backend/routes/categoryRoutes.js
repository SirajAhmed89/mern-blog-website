import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js';
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryId,
  validateCategorySlug,
} from '../validators/categoryValidator.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { requirePermission } from '../middleware/permissions.js';

const router = express.Router();

// Public routes
router.get('/', getAllCategories);
router.get('/slug/:slug', validateCategorySlug, getCategoryBySlug);
router.get('/:id', validateCategoryId, getCategoryById);

// Protected routes
router.post(
  '/',
  protect,
  authorize('admin', 'superadmin'),
  requirePermission('categories.create'),
  validateCreateCategory,
  createCategory
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  requirePermission('categories.edit'),
  validateUpdateCategory,
  updateCategory
);

router.delete(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  requirePermission('categories.delete'),
  validateCategoryId,
  deleteCategory
);

export default router;
