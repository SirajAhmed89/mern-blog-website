/**
 * OTP Validation Schemas
 */

export const validateSendOTP = (req, res, next) => {
  const { email } = req.body;
  const errors = [];

  // Email validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};

export const validateVerifyOTP = (req, res, next) => {
  const { email, otp } = req.body;
  const errors = [];

  // Email validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  // OTP validation
  const otpRegex = /^\d{6}$/;
  if (!otp || !otpRegex.test(otp)) {
    errors.push({ field: 'otp', message: 'Valid 6-digit OTP is required' });
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  next();
};
