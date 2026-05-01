import { body, query, param } from 'express-validator';
import { validateRequest } from '../middleware/validateRequest.js';

export const validateSubscribe = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  validateRequest,
];

export const validateUnsubscribe = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  validateRequest,
];

export const validateGetSubscribers = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['active', 'unsubscribed'])
    .withMessage('Status must be either active or unsubscribed'),
  query('sort')
    .optional()
    .isString()
    .withMessage('Sort must be a string'),
  validateRequest,
];

export const validateSubscriberId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid subscriber ID'),
  validateRequest,
];

export const validateDeleteMultiple = [
  body('ids')
    .isArray({ min: 1 })
    .withMessage('IDs must be a non-empty array'),
  body('ids.*')
    .isMongoId()
    .withMessage('Each ID must be a valid MongoDB ID'),
  validateRequest,
];
