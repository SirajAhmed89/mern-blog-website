import express from 'express';
import {
  subscribe,
  unsubscribe,
  getAllSubscribers,
  getSubscriberById,
  deleteSubscriber,
  deleteMultipleSubscribers,
  getStats,
  exportSubscribers,
  sendTestEmail,
  sendNewsletterUpdate,
  sendWeeklyDigest,
} from '../controllers/newsletterController.js';
import {
  validateSubscribe,
  validateUnsubscribe,
  validateGetSubscribers,
  validateSubscriberId,
  validateDeleteMultiple,
} from '../validators/newsletterValidator.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/authorize.js';

const router = express.Router();

// Public routes
router.post('/subscribe', validateSubscribe, subscribe);
router.post('/unsubscribe', validateUnsubscribe, unsubscribe);

// Protected routes - Admin/Superadmin only
router.get(
  '/',
  protect,
  authorize('admin', 'superadmin'),
  validateGetSubscribers,
  getAllSubscribers
);

router.get(
  '/stats',
  protect,
  authorize('admin', 'superadmin'),
  getStats
);

router.get(
  '/export',
  protect,
  authorize('admin', 'superadmin'),
  exportSubscribers
);

router.get(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  validateSubscriberId,
  getSubscriberById
);

router.delete(
  '/:id',
  protect,
  authorize('admin', 'superadmin'),
  validateSubscriberId,
  deleteSubscriber
);

router.post(
  '/delete-multiple',
  protect,
  authorize('admin', 'superadmin'),
  validateDeleteMultiple,
  deleteMultipleSubscribers
);

// Newsletter automation routes
router.post(
  '/test-email',
  protect,
  authorize('admin', 'superadmin'),
  sendTestEmail
);

router.post(
  '/send-update',
  protect,
  authorize('admin', 'superadmin'),
  sendNewsletterUpdate
);

router.post(
  '/send-digest',
  protect,
  authorize('admin', 'superadmin'),
  sendWeeklyDigest
);

export default router;
