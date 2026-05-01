import User from '../models/User.js';
import { AppError } from '../utils/AppError.js';

/**
 * User Service - Business logic layer
 * Handles all user-related business operations
 */
class UserService {
  /**
   * Create a new user
   */
  async createUser(userData) {
    const { name, username, email, password } = userData;

    // Check if user already exists with email or username
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

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    return this.sanitizeUser(user);
  }

  /**
   * Find user by email or username (with password for authentication)
   */
  async findByEmailOrUsernameWithPassword(identifier) {
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier.toLowerCase() }]
    }).select('+password');
    
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }
    return user;
  }

  /**
   * Find user by email
   */
  async findByEmail(email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new AppError('User not found with this email', 404);
    }
    return user;
  }

  /**
   * Find user by reset token
   */
  async findByResetToken(resetToken) {
    const crypto = await import('crypto');
    const hashedToken = crypto.default
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    }).select('+resetPasswordToken +resetPasswordExpire');

    if (!user) {
      throw new AppError('Invalid or expired reset token', 400);
    }
    return user;
  }

  /**
   * Find user by ID
   */
  async findById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.sanitizeUser(user);
  }

  /**
   * Update user profile
   * Admins can also update isActive (ban/unban)
   */
  async updateUser(userId, updateData, requestingUser = null) {
    const allowedUpdates = ['name', 'email', 'bio', 'avatar'];
    // Admins and superadmins can also toggle isActive
    if (requestingUser && ['admin', 'superadmin'].includes(requestingUser.role)) {
      allowedUpdates.push('isActive');
    }

    const updates = {};
    Object.keys(updateData).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = updateData[key];
      }
    });

    console.log('[UserService] Updating user:', { userId, updates });

    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    console.log('[UserService] User updated successfully:', this.sanitizeUser(user));

    return this.sanitizeUser(user);
  }

  /**
   * Delete user
   */
  async deleteUser(userId) {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return { message: 'User deleted successfully' };
  }

  /**
   * Get all users (with pagination)
   */
  async getAllUsers(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments(),
    ]);

    return {
      users: users.map(user => this.sanitizeUser(user)),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Remove sensitive data from user object
   */
  sanitizeUser(user) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }
}

export default new UserService();
