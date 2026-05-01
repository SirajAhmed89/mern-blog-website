import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

/**
 * Admin Service - Handles admin management logic
 */
class AdminService {
  // Define all available permissions
  AVAILABLE_PERMISSIONS = {
    // Posts permissions
    'posts.view': 'View all posts',
    'posts.create': 'Create new posts',
    'posts.edit': 'Edit posts',
    'posts.delete': 'Delete posts',
    'posts.publish': 'Publish/unpublish posts',
    
    // Users permissions
    'users.view': 'View all users',
    'users.create': 'Create new users',
    'users.edit': 'Edit user details',
    'users.delete': 'Delete users',
    'users.ban': 'Ban/unban users',
    
    // Categories permissions
    'categories.view': 'View all categories',
    'categories.create': 'Create new categories',
    'categories.edit': 'Edit categories',
    'categories.delete': 'Delete categories',
    
    // Tags permissions
    'tags.view': 'View all tags',
    'tags.create': 'Create new tags',
    'tags.edit': 'Edit tags',
    'tags.delete': 'Delete tags',
    
    // Comments permissions
    'comments.view': 'View all comments',
    'comments.moderate': 'Moderate comments',
    'comments.delete': 'Delete comments',
    
    // Dashboard permissions
    'dashboard.analytics': 'View analytics dashboard',
    'dashboard.reports': 'View and generate reports',
    'dashboard.settings': 'Access system settings',
    
    // Media permissions
    'media.upload': 'Upload media files',
    'media.delete': 'Delete media files',
  };

  /**
   * Create a new admin user
   */
  async createAdmin(adminData) {
    const { name, username, email, password, permissions, createdBy } = adminData;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (existingUser) {
      if (existingUser.email === email) {
        throw new AppError('User already exists with this email', 400);
      }
      if (existingUser.username === username) {
        throw new AppError('Username is already taken', 400);
      }
    }

    // Validate permissions
    const validPermissions = this.validatePermissions(permissions);

    // Create admin user
    const admin = await User.create({
      name,
      username,
      email,
      password,
      role: 'admin',
      permissions: validPermissions,
      createdBy,
      isActive: true,
    });

    return this.sanitizeAdmin(admin);
  }

  /**
   * Get all admins with pagination (includes inactive by default for management)
   */
  async getAllAdmins(page = 1, limit = 10, includeInactive = true) {
    const skip = (page - 1) * limit;
    
    const query = { role: { $in: ['admin', 'superadmin'] } };
    if (!includeInactive) {
      query.isActive = true;
    }

    const [admins, total] = await Promise.all([
      User.find(query)
        .populate('createdBy', 'name email username')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      User.countDocuments(query),
    ]);

    return {
      admins: admins.map(admin => this.sanitizeAdmin(admin)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get admin by ID
   */
  async getAdminById(adminId) {
    const admin = await User.findById(adminId)
      .populate('createdBy', 'name email username');
    
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    if (!['admin', 'superadmin'].includes(admin.role)) {
      throw new AppError('User is not an admin', 400);
    }

    return this.sanitizeAdmin(admin);
  }

  /**
   * Update admin permissions
   */
  async updateAdminPermissions(adminId, permissions) {
    const admin = await User.findById(adminId);
    
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    if (admin.role === 'superadmin') {
      throw new AppError('Cannot modify superadmin permissions', 400);
    }

    if (admin.role !== 'admin') {
      throw new AppError('User is not an admin', 400);
    }

    // Validate permissions
    const validPermissions = this.validatePermissions(permissions);

    admin.permissions = validPermissions;
    await admin.save();

    return this.sanitizeAdmin(admin);
  }

  /**
   * Update admin details
   */
  async updateAdmin(adminId, updateData) {
    const admin = await User.findById(adminId);
    
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    if (admin.role === 'superadmin') {
      throw new AppError('Cannot modify superadmin account', 400);
    }

    if (admin.role !== 'admin') {
      throw new AppError('User is not an admin', 400);
    }

    // Update allowed fields
    const allowedUpdates = ['name', 'email', 'username', 'isActive'];
    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key) && updateData[key] !== undefined) {
        admin[key] = updateData[key];
      }
    });

    await admin.save();

    return this.sanitizeAdmin(admin);
  }

  /**
   * Deactivate admin
   */
  async deactivateAdmin(adminId) {
    const admin = await User.findById(adminId);
    
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    if (admin.role === 'superadmin') {
      throw new AppError('Cannot deactivate superadmin account', 400);
    }

    if (admin.role !== 'admin') {
      throw new AppError('User is not an admin', 400);
    }

    admin.isActive = false;
    await admin.save();

    return this.sanitizeAdmin(admin);
  }

  /**
   * Activate admin
   */
  async activateAdmin(adminId) {
    const admin = await User.findById(adminId);
    
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    if (admin.role !== 'admin') {
      throw new AppError('User is not an admin', 400);
    }

    admin.isActive = true;
    await admin.save();

    return this.sanitizeAdmin(admin);
  }

  /**
   * Delete admin
   */
  async deleteAdmin(adminId) {
    const admin = await User.findById(adminId);
    
    if (!admin) {
      throw new AppError('Admin not found', 404);
    }

    if (admin.role === 'superadmin') {
      throw new AppError('Cannot delete superadmin account', 400);
    }

    if (admin.role !== 'admin') {
      throw new AppError('User is not an admin', 400);
    }

    await User.findByIdAndDelete(adminId);

    return { message: 'Admin deleted successfully' };
  }

  /**
   * Validate permissions array
   */
  validatePermissions(permissions) {
    if (!Array.isArray(permissions)) {
      throw new AppError('Permissions must be an array', 400);
    }

    if (permissions.length === 0) return [];

    const validPermissionKeys = Object.keys(this.AVAILABLE_PERMISSIONS);
    const invalidPermissions = permissions.filter(
      perm => !validPermissionKeys.includes(perm)
    );

    if (invalidPermissions.length > 0) {
      throw new AppError(
        `Invalid permissions: ${invalidPermissions.join(', ')}`,
        400
      );
    }

    // Remove duplicates
    return [...new Set(permissions)];
  }

  /**
   * Get available permissions as a flat key→label map
   */
  getAvailablePermissions() {
    return this.AVAILABLE_PERMISSIONS;
  }

  /**
   * Get available permissions grouped by category
   */
  getPermissionGroups() {
    const groups = {};
    for (const [key, label] of Object.entries(this.AVAILABLE_PERMISSIONS)) {
      const category = key.split('.')[0];
      if (!groups[category]) groups[category] = [];
      groups[category].push({ key, label });
    }
    return groups;
  }

  /**
   * Remove sensitive data from admin object
   */
  sanitizeAdmin(admin) {
    const adminObj = admin.toObject();
    delete adminObj.password;
    delete adminObj.resetPasswordToken;
    delete adminObj.resetPasswordExpire;
    return adminObj;
  }
}

export default new AdminService();
