import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

export const validateCreateComment = [
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  body('post')
    .notEmpty().withMessage('Post ID is required')
    .isMongoId().withMessage('Invalid post ID'),
  body('parentComment')
    .optional()
    .isMongoId().withMessage('Invalid parent comment ID'),
  body('guestName')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('guestEmail')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address'),
  validateRequest,
];

export const validateUpdateComment = [
  param('id')
    .isMongoId().withMessage('Invalid comment ID'),
  body('content')
    .trim()
    .notEmpty().withMessage('Comment content is required')
    .isLength({ min: 1, max: 1000 }).withMessage('Comment must be between 1 and 1000 characters'),
  validateRequest,
];

export const validateCommentStatus = [
  param('id')
    .isMongoId().withMessage('Invalid comment ID'),
  body('status')
    .isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status'),
  validateRequest,
];

export const validateCommentId = [
  param('id')
    .isMongoId().withMessage('Invalid comment ID'),
  validateRequest,
];

export const validateGetComments = [
  param('postId')
    .isMongoId().withMessage('Invalid post ID'),
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  validateRequest,
];
