import analyticsService from '../services/analyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

/**
 * @desc    Get dashboard analytics
 * @route   GET /api/analytics/dashboard
 * @access  Private/Admin (requires dashboard.analytics permission)
 */
export const getDashboardAnalytics = asyncHandler(async (req, res) => {
  const stats = await analyticsService.getDashboardStats();
  
  ApiResponse.success(
    res,
    { analytics: stats },
    'Dashboard analytics retrieved successfully'
  );
});

/**
 * @desc    Get post analytics
 * @route   GET /api/analytics/posts
 * @access  Private/Admin (requires dashboard.analytics permission)
 */
export const getPostAnalytics = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  
  const analytics = await analyticsService.getPostAnalytics({
    startDate,
    endDate,
  });
  
  ApiResponse.success(
    res,
    { analytics },
    'Post analytics retrieved successfully'
  );
});
