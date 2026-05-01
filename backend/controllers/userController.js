import userService from '../services/userService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

/**
 * @desc    Get all users (with pagination)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const result = await userService.getAllUsers(page, limit);

  ApiResponse.paginated(
    res,
    result.users,
    result.pagination,
    'Users retrieved successfully'
  );
});

/**
 * @desc    Get user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);

  ApiResponse.success(
    res,
    { user },
    'User retrieved successfully'
  );
});

/**
 * @desc    Update user (admin can update isActive for ban/unban)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.params.id, req.body, req.user);

  ApiResponse.success(
    res,
    { user },
    'User updated successfully'
  );
});

/**
 * @desc    Delete user
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = asyncHandler(async (req, res) => {
  await userService.deleteUser(req.params.id);

  ApiResponse.success(
    res,
    null,
    'User deleted successfully'
  );
});
