import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  getPostBySlug,
  updatePost,
  deletePost,
  toggleLike,
  toggleFeaturedHero,
  getFeaturedHero,
  getRecentPosts,
} from '../controllers/postController.js';
import {
  validateCreatePost,
  validateUpdatePost,
  validateGetPosts,
  validatePostId,
  validatePostSlug,
} from '../validators/postValidator.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';
import { requirePermission } from '../middleware/permissions.js';

const router = express.Router();

// Public routes
router.get('/', validateGetPosts, getAllPosts);
router.get('/featured-hero', getFeaturedHero);
router.get('/recent', getRecentPosts);
router.get('/slug/:slug', validatePostSlug, getPostBySlug);
router.get('/:id', validatePostId, getPostById);

// Protected routes
// Admins with posts.create permission can create
router.post(
  '/', 
  protect, 
  authorize('admin', 'superadmin'),
  requirePermission('posts.create'),
  validateCreatePost, 
  createPost
);

// Admins with posts.edit permission can update
router.put(
  '/:id', 
  protect, 
  authorize('admin', 'superadmin'),
  requirePermission('posts.edit'),
  validateUpdatePost, 
  updatePost
);

// Admins with posts.delete permission can delete
router.delete(
  '/:id', 
  protect, 
  authorize('admin', 'superadmin'),
  requirePermission('posts.delete'),
  validatePostId, 
  deletePost
);

// Any authenticated user can like
router.post('/:id/like', protect, validatePostId, toggleLike);

// Only admin and superadmin can set featured hero
router.post(
  '/:id/featured-hero',
  protect,
  authorize('admin', 'superadmin'),
  validatePostId,
  toggleFeaturedHero
);

export default router;
