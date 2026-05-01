import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

export const validateCreateCategory = [
  body('name')
    .trim()
    .notEmpty().withMessage('Category name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
  validateRequest,
];

export const validateUpdateCategory = [
  param('id')
    .isMongoId().withMessage('Invalid category ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('Category name must be between 2 and 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 200 }).withMessage('Description cannot exceed 200 characters'),
  validateRequest,
];

export const validateCategoryId = [
  param('id')
    .isMongoId().withMessage('Invalid category ID'),
  validateRequest,
];

export const validateCategorySlug = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required'),
  validateRequest,
];
