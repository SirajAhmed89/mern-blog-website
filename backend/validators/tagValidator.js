import { body, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

export const validateCreateTag = [
  body('name')
    .trim()
    .notEmpty().withMessage('Tag name is required')
    .isLength({ min: 2, max: 30 }).withMessage('Tag name must be between 2 and 30 characters'),
  validateRequest,
];

export const validateUpdateTag = [
  param('id')
    .isMongoId().withMessage('Invalid tag ID'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 30 }).withMessage('Tag name must be between 2 and 30 characters'),
  validateRequest,
];

export const validateTagId = [
  param('id')
    .isMongoId().withMessage('Invalid tag ID'),
  validateRequest,
];

export const validateTagSlug = [
  param('slug')
    .trim()
    .notEmpty().withMessage('Slug is required'),
  validateRequest,
];
