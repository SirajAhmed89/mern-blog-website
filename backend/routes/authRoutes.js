import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getMe, 
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword
} from '../controllers/authController.js';
import { 
  validateRegister, 
  validateLogin,
  validateForgotPassword,
  validateResetPassword 
} from '../validators/authValidator.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password/:token', validateResetPassword, resetPassword);

// Protected routes
router.get('/me', protect, getMe);
router.post('/refresh', protect, refreshToken);
router.put('/change-password', protect, changePassword);

export default router;
