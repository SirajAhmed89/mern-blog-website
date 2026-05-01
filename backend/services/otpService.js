import crypto from 'crypto';
import { AppError } from '../utils/AppError.js';

/**
 * OTP Service - Handles OTP generation, validation, and management
 * Reusable service for any OTP-related operations
 */
class OTPService {
  /**
   * Generate a random 6-digit OTP
   * @returns {string} 6-digit OTP
   */
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Generate OTP with expiry time
   * @param {number} expiryMinutes - Minutes until OTP expires (default: 10)
   * @returns {Object} OTP and expiry date
   */
  generateOTPWithExpiry(expiryMinutes = 10) {
    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    
    return {
      otp,
      expiresAt,
    };
  }

  /**
   * Hash OTP for secure storage
   * @param {string} otp - Plain OTP
   * @returns {string} Hashed OTP
   */
  hashOTP(otp) {
    return crypto
      .createHash('sha256')
      .update(otp.toString())
      .digest('hex');
  }

  /**
   * Verify OTP against stored hash
   * @param {string} plainOTP - OTP provided by user
   * @param {string} hashedOTP - Stored hashed OTP
   * @returns {boolean} True if OTP matches
   */
  verifyOTP(plainOTP, hashedOTP) {
    const hashedInput = this.hashOTP(plainOTP);
    return hashedInput === hashedOTP;
  }

  /**
   * Check if OTP has expired
   * @param {Date} expiryDate - OTP expiry date
   * @returns {boolean} True if expired
   */
  isExpired(expiryDate) {
    return new Date() > new Date(expiryDate);
  }

  /**
   * Validate OTP with all checks
   * @param {string} plainOTP - User provided OTP
   * @param {string} hashedOTP - Stored hashed OTP
   * @param {Date} expiryDate - OTP expiry date
   * @throws {AppError} If validation fails
   */
  validateOTP(plainOTP, hashedOTP, expiryDate) {
    if (!plainOTP || !hashedOTP) {
      throw new AppError('Invalid OTP', 400);
    }

    if (this.isExpired(expiryDate)) {
      throw new AppError('OTP has expired. Please request a new one', 400);
    }

    if (!this.verifyOTP(plainOTP, hashedOTP)) {
      throw new AppError('Invalid OTP', 400);
    }

    return true;
  }

  /**
   * Generate a secure token for email verification links (alternative to OTP)
   * @returns {string} Secure token
   */
  generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }
}

export default new OTPService();
