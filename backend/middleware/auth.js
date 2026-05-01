import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        const error = new Error('User not found');
        error.status = 401;
        return next(error);
      }
      
      next();
    } catch (error) {
      error.message = 'Not authorized, token failed';
      error.status = 401;
      next(error);
    }
  } else {
    const error = new Error('Not authorized, no token provided');
    error.status = 401;
    next(error);
  }
};

/**
 * Optional auth — attaches req.user if a valid token is present,
 * but does NOT block the request if there is no token.
 */
export const optionalProtect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return next(); // No token — continue as guest
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
  } catch {
    // Invalid token — treat as guest, don't block
    req.user = null;
  }
  next();
};
