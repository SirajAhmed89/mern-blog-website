import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import userService from './userService.js';
import emailService from './emailService.js';
import { AppError } from '../utils/AppError.js';

/**
 * Authentication Service - Handles auth logic
 */
class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    // Create user without sanitizing (we need the Mongoose document with methods)
    const { name, username, email, password } = userData;

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

    // Create user (returns Mongoose document with methods)
    const user = await User.create({
      name,
      username,
      email,
      password,
    });
    
    console.log('✅ User created:', user._id);
    
    // Generate OTP for email verification
    const otp = user.generateEmailVerificationOTP();
    console.log('🔐 OTP generated for', user.email, ':', otp);
    
    await user.save({ validateBeforeSave: false });
    console.log('✅ OTP saved to database');

    // Try to send OTP via email
    try {
      console.log('📧 Sending OTP email to:', user.email);
      await emailService.sendOTPEmail(user.email, user.name, otp);
      console.log('✅ OTP email sent successfully');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError.message);
      
      // In development, continue without email (OTP is logged to console)
      if (process.env.NODE_ENV === 'development') {
        console.log('⚠️  Development mode: Continuing without email');
        console.log('🔐 USE THIS OTP:', otp);
      } else {
        // In production, rollback user creation if email fails
        console.error('❌ Production mode: Rolling back user creation');
        await User.findByIdAndDelete(user._id);
        throw new AppError('Failed to send verification email. Please try again.', 500);
      }
    }

    // Don't generate token yet - user needs to verify email first
    return {
      user: userService.sanitizeUser(user),
      message: 'Registration successful. Please check your email for verification code.',
      requiresVerification: true,
    };
  }

  /**
   * Login user with email or username
   */
  async login(identifier, password) {
    // Get user with password (supports email or username)
    const user = await userService.findByEmailOrUsernameWithPassword(identifier);

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      throw new AppError('Please verify your email before logging in', 403);
    }

    // Check if account is active (banned admins cannot login)
    if (!user.isActive) {
      throw new AppError('Your account has been deactivated. Please contact a superadmin.', 403);
    }

    // Generate token
    const token = this.generateToken(user._id);

    return {
      user: userService.sanitizeUser(user),
      token,
    };
  }

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    const user = await userService.findByEmail(email);

    // Generate reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // In production, send email with reset link
    // For now, return the token (in production, only send via email)
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    return {
      message: 'Password reset token generated',
      resetToken, // Remove this in production
      resetUrl,
    };
  }

  /**
   * Reset password with token
   */
  async resetPassword(resetToken, newPassword) {
    const user = await userService.findByResetToken(resetToken);

    // Set new password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate new auth token
    const token = this.generateToken(user._id);

    return {
      user: userService.sanitizeUser(user),
      token,
      message: 'Password reset successful',
    };
  }

  /**
   * Verify JWT token
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }

  /**
   * Generate JWT token
   */
  generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }

  /**
   * Refresh token
   */
  async refreshToken(userId) {
    const user = await userService.findById(userId);
    const token = this.generateToken(user._id);

    return {
      user,
      token,
    };
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    // Get user with password
    const user = await User.findById(userId).select('+password');
    
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Verify current password
    const isPasswordValid = await user.matchPassword(currentPassword);
    if (!isPasswordValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Set new password
    user.password = newPassword;
    await user.save();

    return {
      message: 'Password changed successfully',
    };
  }
}

export default new AuthService();
