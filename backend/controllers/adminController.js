import adminService from '../services/adminService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

/**
 * @desc    Create a new admin user (Superadmin only)
 * @route   POST /api/admin/create
 * @access  Private/Superadmin
 */
export const createAdmin = asyncHandler(async (req, res) => {
  const { name, username, email, password, permissions } = req.body;
  const createdBy = req.user.id;

  const result = await adminService.createAdmin({
    name,
    username,
    email,
    password,
    permissions,
    createdBy,
  });

  ApiResponse.success(
    res,
    result,
    'Admin created successfully',
    201
  );
});

/**
 * @desc    Get all admins (Superadmin only)
 * @route   GET /api/admin/list
 * @access  Private/Superadmin
 */
export const getAllAdmins = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  // Default to true so superadmin can see and manage banned admins
  const includeInactive = req.query.includeInactive !== 'false';

  const result = await adminService.getAllAdmins(page, limit, includeInactive);

  ApiResponse.paginated(
    res,
    result.admins,
    result.pagination,
    'Admins retrieved successfully'
  );
});

/**
 * @desc    Get admin by ID (Superadmin only)
 * @route   GET /api/admin/:id
 * @access  Private/Superadmin
 */
export const getAdminById = asyncHandler(async (req, res) => {
  const admin = await adminService.getAdminById(req.params.id);

  ApiResponse.success(
    res,
    { admin },
    'Admin retrieved successfully'
  );
});

/**
 * @desc    Update admin permissions (Superadmin only)
 * @route   PUT /api/admin/:id/permissions
 * @access  Private/Superadmin
 */
export const updateAdminPermissions = asyncHandler(async (req, res) => {
  const { permissions } = req.body;
  const admin = await adminService.updateAdminPermissions(req.params.id, permissions);

  ApiResponse.success(
    res,
    { admin },
    'Admin permissions updated successfully'
  );
});

/**
 * @desc    Update admin details (Superadmin only)
 * @route   PUT /api/admin/:id
 * @access  Private/Superadmin
 */
export const updateAdmin = asyncHandler(async (req, res) => {
  const { name, email, username, isActive } = req.body;
  const admin = await adminService.updateAdmin(req.params.id, {
    name,
    email,
    username,
    isActive,
  });

  ApiResponse.success(
    res,
    { admin },
    'Admin updated successfully'
  );
});

/**
 * @desc    Deactivate admin (Superadmin only)
 * @route   PUT /api/admin/:id/deactivate
 * @access  Private/Superadmin
 */
export const deactivateAdmin = asyncHandler(async (req, res) => {
  const admin = await adminService.deactivateAdmin(req.params.id);

  ApiResponse.success(
    res,
    { admin },
    'Admin deactivated successfully'
  );
});

/**
 * @desc    Activate admin (Superadmin only)
 * @route   PUT /api/admin/:id/activate
 * @access  Private/Superadmin
 */
export const activateAdmin = asyncHandler(async (req, res) => {
  const admin = await adminService.activateAdmin(req.params.id);

  ApiResponse.success(
    res,
    { admin },
    'Admin activated successfully'
  );
});

/**
 * @desc    Delete admin (Superadmin only)
 * @route   DELETE /api/admin/:id
 * @access  Private/Superadmin
 */
export const deleteAdmin = asyncHandler(async (req, res) => {
  await adminService.deleteAdmin(req.params.id);

  ApiResponse.success(
    res,
    null,
    'Admin deleted successfully'
  );
});

/**
 * @desc    Get available permissions list (key → label map)
 * @route   GET /api/admin/permissions/available
 * @access  Private/Superadmin
 */
export const getAvailablePermissions = asyncHandler(async (req, res) => {
  const permissions = adminService.getAvailablePermissions();

  ApiResponse.success(
    res,
    { permissions },
    'Available permissions retrieved'
  );
});

/**
 * @desc    Get current user's permissions
 * @route   GET /api/admin/permissions/me
 * @access  Private/Admin
 */
export const getMyPermissions = asyncHandler(async (req, res) => {
  const isSuperAdmin = req.user.role === 'superadmin';
  // Always return string[] of permission keys
  const permissions = isSuperAdmin
    ? Object.keys(adminService.getAvailablePermissions())
    : (req.user.permissions ?? []);

  ApiResponse.success(
    res,
    {
      role: req.user.role,
      permissions,
      isSuperAdmin,
    },
    'Your permissions retrieved'
  );
});
