import settingsService from '../services/settingsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

/**
 * @desc    Get site settings
 * @route   GET /api/settings
 * @access  Public
 */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getSettings();
  
  ApiResponse.success(
    res,
    { settings },
    'Settings retrieved successfully'
  );
});

/**
 * @desc    Update site settings
 * @route   PUT /api/settings
 * @access  Private/Admin (requires dashboard.settings permission)
 */
export const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body, req.user.id);
  
  ApiResponse.success(
    res,
    { settings },
    'Settings updated successfully'
  );
});
