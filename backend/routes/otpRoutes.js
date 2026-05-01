import express from 'express';
import { 
  sendVerificationOTP, 
  verifyEmailOTP, 
  resendVerificationOTP 
} from '../controllers/otpController.js';
import { 
  validateSendOTP, 
  validateVerifyOTP 
} from '../validators/otpValidator.js';

const router = express.Router();

// OTP routes
router.post('/send-verification', validateSendOTP, sendVerificationOTP);
router.post('/verify-email', validateVerifyOTP, verifyEmailOTP);
router.post('/resend-verification', validateSendOTP, resendVerificationOTP);

export default router;
