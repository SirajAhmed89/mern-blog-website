import express from 'express';
import {
  getAllComments,
  createComment,
  getCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
  updateCommentStatus,
} from '../controllers/commentController.js';
import {
  validateCreateComment,
  validateUpdateComment,
  validateCommentStatus,
  validateCommentId,
  validateGetComments,
} from '../validators/commentValidator.js';
import { protect, optionalProtect } from '../middleware/auth.js';
import { requireAdminOrAbove, requirePermission } from '../middleware/permissions.js';

const router = express.Router();

// Admin: list all comments (requires comments.view permission)
router.get('/', protect, requireAdminOrAbove, requirePermission('comments.view'), getAllComments);

// Public routes
router.get('/post/:postId', validateGetComments, getCommentsByPost);
router.get('/:id', validateCommentId, getCommentById);

// Public: post a comment (guest or logged-in user)
router.post('/', optionalProtect, validateCreateComment, createComment);
router.put('/:id', protect, validateUpdateComment, updateComment);
router.delete('/:id', optionalProtect, validateCommentId, deleteComment);

// Admin routes
router.patch('/:id/status', protect, requireAdminOrAbove, requirePermission('comments.moderate', 'comments.delete'), validateCommentStatus, updateCommentStatus);

export default router;
