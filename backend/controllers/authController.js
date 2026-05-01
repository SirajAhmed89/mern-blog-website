import authService from '../services/authService.js';
import userService from '../services/userService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  const result = await authService.register({ name, username, email, password });

  ApiResponse.success(
    res,
    result,
    'User registered successfully',
    201
  );
});

/**
 * @desc    Login user with email or username
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  const result = await authService.login(identifier, password);

  ApiResponse.success(
    res,
    result,
    'Login successful'
  );
});

/**
 * @desc    Forgot password - Request reset token
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  ApiResponse.success(
    res,
    result,
    'Password reset email sent'
  );
});

/**
 * @desc    Reset password with token
 * @route   POST /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const result = await authService.resetPassword(token, password);

  ApiResponse.success(
    res,
    result,
    'Password reset successful'
  );
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.user.id);

  ApiResponse.success(
    res,
    { user },
    'User profile retrieved'
  );
});

/**
 * @desc    Refresh authentication token
 * @route   POST /api/auth/refresh
 * @access  Private
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshToken(req.user.id);

  ApiResponse.success(
    res,
    result,
    'Token refreshed successfully'
  );
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const result = await authService.changePassword(
    req.user.id,
    currentPassword,
    newPassword
  );

  ApiResponse.success(
    res,
    result,
    'Password changed successfully'
  );
});
