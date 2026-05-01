import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';
import {
  getConnectionStatus,
  getDatabaseStats,
  listCollections,
} from '../utils/dbHelpers.js';

/**
 * @desc    Get API health status
 * @route   GET /api/health
 * @access  Public
 */
export const getHealth = asyncHandler(async (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: getConnectionStatus(),
    environment: process.env.NODE_ENV,
  };

  ApiResponse.success(res, health, 'API is healthy');
});

/**
 * @desc    Get database information
 * @route   GET /api/health/database
 * @access  Public
 */
export const getDatabaseInfo = asyncHandler(async (req, res) => {
  const stats = await getDatabaseStats();
  const collections = await listCollections();

  const info = {
    ...stats,
    collections: collections,
    status: getConnectionStatus(),
  };

  ApiResponse.success(res, info, 'Database information retrieved');
});
