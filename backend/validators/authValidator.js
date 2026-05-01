/**
 * Authentication Validation Schemas
 */

export const validateRegister = (req, res, next) => {
  const { name, username, email, password } = req.body;
  const errors = [];

  // Name validation
  if (!name || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Name must be at least 2 characters' });
  }
  if (name && name.length > 50) {
    errors.push({ field: 'name', message: 'Name cannot exceed 50 characters' });
  }

  // Username validation
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!username || username.trim().length < 3) {
    errors.push({ field: 'username', message: 'Username must be at least 3 characters' });
  }
  if (username && username.length > 30) {
    errors.push({ field: 'username', message: 'Username cannot exceed 30 characters' });
  }
  if (username && !usernameRegex.test(username)) {
    errors.push({ field: 'username', message: 'Username can only contain letters, numbers, and underscores' });
  }

  // Email validation
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!email || !emailRegex.test(email)) {
    errors.push({ field: 'email', message: 'Valid email is required' });
  }

  // Password validation
  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
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

export const validateLogin = (req, res, next) => {
  const { identifier, password } = req.body;
  const errors = [];

  // Identifier (email or username) validation
  if (!identifier) {
    errors.push({ field: 'identifier', message: 'Email or username is required' });
  }

  // Password validation
  if (!password) {
    errors.push({ field: 'password', message: 'Password is required' });
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

export const validateForgotPassword = (req, res, next) => {
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

export const validateResetPassword = (req, res, next) => {
  const { password } = req.body;
  const errors = [];

  // Password validation
  if (!password || password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
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
