import { body, param, query } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

export const validateCreatePost = [
  body('title')
    .trim()
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .notEmpty().withMessage('Content is required'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  body('category')
    .notEmpty().withMessage('Category is required')
    .isMongoId().withMessage('Invalid category ID'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isMongoId().withMessage('Invalid tag ID'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('featuredImage')
    .optional()
    .trim()
    .custom((value) => {
      // Allow both full URLs and relative paths like /uploads/blog/image.jpg
      if (!value) return true;
      const isUrl = /^https?:\/\/.+/.test(value);
      const isPath = /^\/uploads\/.+/.test(value);
      if (!isUrl && !isPath) {
        throw new Error('Featured image must be a valid URL or upload path');
      }
      return true;
    }),
  validateRequest,
];

export const validateUpdatePost = [
  param('id')
    .isMongoId().withMessage('Invalid post ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be between 3 and 200 characters'),
  body('content')
    .optional()
    .notEmpty().withMessage('Content cannot be empty'),
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Excerpt cannot exceed 500 characters'),
  body('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .isMongoId().withMessage('Invalid tag ID'),
  body('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('featuredImage')
    .optional()
    .trim()
    .custom((value) => {
      // Allow both full URLs and relative paths like /uploads/blog/image.jpg
      if (!value) return true;
      const isUrl = /^https?:\/\/.+/.test(value);
      const isPath = /^\/uploads\/.+/.test(value);
      if (!isUrl && !isPath) {
        throw new Error('Featured image must be a valid URL or upload path');
      }
      return true;
    }),
  validateRequest,
];

export const validateGetPosts = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  query('category')
    .optional()
    .isMongoId().withMessage('Invalid category ID'),
  query('author')
    .optional()
    .isMongoId().withMessage('Invalid author ID'),
  validateRequest,
];

export const validatePostId = [
  param('id')
    .isMongoId().withMessage('Invalid post ID'),
  validateRequest,
];

export const validatePostSlug = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required'),
  validateRequest,
];
