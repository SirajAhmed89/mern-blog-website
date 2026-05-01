import User from '../models/User.js';
import emailService from '../services/emailService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';
import { AppError } from '../utils/AppError.js';

/**
 * @desc    Send OTP for email verification
 * @route   POST /api/otp/send-verification
 * @access  Public
 */
export const sendVerificationOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+emailVerificationOTP +emailVerificationOTPExpires');
  
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email is already verified', 400);
  }

  // Generate OTP
  const otp = user.generateEmailVerificationOTP();
  await user.save({ validateBeforeSave: false });

  // Send OTP via email
  await emailService.sendOTPEmail(user.email, user.name, otp);

  ApiResponse.success(
    res,
    { 
      email: user.email,
      expiresIn: '10 minutes'
    },
    'OTP sent successfully to your email'
  );
});

/**
 * @desc    Verify email with OTP
 * @route   POST /api/otp/verify-email
 * @access  Public
 */
export const verifyEmailOTP = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Find user with OTP fields
  const user = await User.findOne({ email }).select('+emailVerificationOTP +emailVerificationOTPExpires');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email is already verified', 400);
  }

  // Check if OTP exists
  if (!user.emailVerificationOTP || !user.emailVerificationOTPExpires) {
    throw new AppError('No OTP found. Please request a new one', 400);
  }

  // Verify OTP
  const isValid = user.verifyEmailOTP(otp);

  if (!isValid) {
    throw new AppError('Invalid or expired OTP', 400);
  }

  // Mark email as verified and clear OTP fields
  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailVerificationOTPExpires = undefined;
  await user.save({ validateBeforeSave: false });

  // Send welcome email
  await emailService.sendWelcomeEmail(user.email, user.name);

  ApiResponse.success(
    res,
    { 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        isEmailVerified: user.isEmailVerified,
      }
    },
    'Email verified successfully'
  );
});

/**
 * @desc    Resend OTP for email verification
 * @route   POST /api/otp/resend-verification
 * @access  Public
 */
export const resendVerificationOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Find user by email
  const user = await User.findOne({ email }).select('+emailVerificationOTP +emailVerificationOTPExpires');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.isEmailVerified) {
    throw new AppError('Email is already verified', 400);
  }

  // Check rate limiting - prevent resending too quickly
  if (user.emailVerificationOTPExpires) {
    const timeLeft = user.emailVerificationOTPExpires - Date.now();
    const minWaitTime = 60 * 1000; // 1 minute
    const maxWaitTime = 10 * 60 * 1000; // 10 minutes
    
    if (timeLeft > (maxWaitTime - minWaitTime)) {
      throw new AppError('Please wait at least 1 minute before requesting a new OTP', 429);
    }
  }

  // Generate new OTP
  const otp = user.generateEmailVerificationOTP();
  await user.save({ validateBeforeSave: false });

  // Send OTP via email
  await emailService.sendOTPEmail(user.email, user.name, otp);

  ApiResponse.success(
    res,
    { 
      email: user.email,
      expiresIn: '10 minutes'
    },
    'New OTP sent successfully to your email'
  );
});
