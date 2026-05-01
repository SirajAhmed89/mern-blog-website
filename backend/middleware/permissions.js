import { AppError } from '../utils/AppError.js';

/**
 * Middleware to check if user has required permission(s)
 * @param  {...string} permissions - Required permissions
 */
export const requirePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    // Superadmin always has access
    if (req.user.role === 'superadmin') {
      return next();
    }

    // Check if user is active
    if (!req.user.isActive) {
      throw new AppError('Your account has been deactivated', 403);
    }

    // Check if user has any of the required permissions
    const hasPermission = permissions.some(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasPermission) {
      throw new AppError(
        'You do not have permission to access this resource',
        403
      );
    }

    next();
  };
};

/**
 * Middleware to check if user has ALL required permissions
 * @param  {...string} permissions - Required permissions
 */
export const requireAllPermissions = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppError('Not authenticated', 401);
    }

    // Superadmin always has access
    if (req.user.role === 'superadmin') {
      return next();
    }

    // Check if user is active
    if (!req.user.isActive) {
      throw new AppError('Your account has been deactivated', 403);
    }

    // Check if user has all required permissions
    const hasAllPermissions = permissions.every(permission => 
      req.user.permissions.includes(permission)
    );

    if (!hasAllPermissions) {
      throw new AppError(
        'You do not have sufficient permissions to access this resource',
        403
      );
    }

    next();
  };
};

/**
 * Middleware to check if user is superadmin
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  if (req.user.role !== 'superadmin') {
    throw new AppError(
      'Access denied. Superadmin privileges required',
      403
    );
  }

  next();
};

/**
 * Middleware to check if user is admin or superadmin
 */
export const requireAdminOrAbove = (req, res, next) => {
  if (!req.user) {
    throw new AppError('Not authenticated', 401);
  }

  if (!['admin', 'superadmin'].includes(req.user.role)) {
    throw new AppError(
      'Access denied. Admin privileges required',
      403
    );
  }

  // Check if admin is active
  if (req.user.role === 'admin' && !req.user.isActive) {
    throw new AppError('Your account has been deactivated', 403);
  }

  next();
};
