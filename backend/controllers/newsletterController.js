import newsletterService from '../services/newsletterService.js';
import newsletterEmailService from '../services/newsletter/newsletterEmailService.js';
import postNotificationService from '../services/newsletter/postNotificationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

export const subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await newsletterService.subscribe(email, 'website');
  ApiResponse.success(res, result, result.message, 201);
});

export const unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const result = await newsletterService.unsubscribe(email);
  ApiResponse.success(res, result, result.message);
});

export const getAllSubscribers = asyncHandler(async (req, res) => {
  const { page, limit, status, search, sort } = req.query;
  
  const filters = { status, search };
  const result = await newsletterService.findAll(filters, page, limit, sort);
  
  ApiResponse.success(res, result, 'Subscribers retrieved successfully');
});

export const getSubscriberById = asyncHandler(async (req, res) => {
  const subscriber = await newsletterService.findById(req.params.id);
  ApiResponse.success(res, { subscriber }, 'Subscriber retrieved successfully');
});

export const deleteSubscriber = asyncHandler(async (req, res) => {
  await newsletterService.delete(req.params.id);
  ApiResponse.success(res, null, 'Subscriber deleted successfully');
});

export const deleteMultipleSubscribers = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const result = await newsletterService.deleteMany(ids);
  ApiResponse.success(res, { deletedCount: result.deletedCount }, 'Subscribers deleted successfully');
});

export const getStats = asyncHandler(async (req, res) => {
  const stats = await newsletterService.getStats();
  ApiResponse.success(res, { stats }, 'Newsletter stats retrieved successfully');
});

export const exportSubscribers = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const subscribers = await newsletterService.exportSubscribers(status);
  
  // Format as CSV
  const csv = [
    'Email,Status,Subscribed At',
    ...subscribers.map(s => `${s.email},${s.status},${s.subscribedAt}`)
  ].join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=newsletter-subscribers.csv');
  res.send(csv);
});

// New endpoints for newsletter automation

/**
 * Send test newsletter email
 * POST /api/newsletter/test-email
 */
export const sendTestEmail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return ApiResponse.error(res, 'Email is required', 400);
  }

  const result = await newsletterEmailService.sendTestEmail(email);
  ApiResponse.success(res, result, 'Test email sent successfully');
});

/**
 * Manually send newsletter for specific posts
 * POST /api/newsletter/send-update
 */
export const sendNewsletterUpdate = asyncHandler(async (req, res) => {
  const { postIds } = req.body;
  
  if (!postIds || !Array.isArray(postIds) || postIds.length === 0) {
    return ApiResponse.error(res, 'Post IDs array is required', 400);
  }

  const result = await postNotificationService.sendDigest(postIds);
  ApiResponse.success(res, result, 'Newsletter update sent successfully');
});

/**
 * Send weekly digest
 * POST /api/newsletter/send-digest
 */
export const sendWeeklyDigest = asyncHandler(async (req, res) => {
  const { days = 7 } = req.body;
  
  const result = await postNotificationService.sendWeeklyDigest(days);
  ApiResponse.success(res, result, 'Weekly digest sent successfully');
});
