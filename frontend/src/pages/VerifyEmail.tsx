import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthCard from '../components/forms/AuthCard';
import OTPInput from '../components/forms/OTPInput';
import Button from '../components/ui/Button';
import { otpService } from '../services/otpService';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardPath } from '../utils/getDashboardPath';
import { useToast } from '../hooks/useToast';

export default function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Get email from location state (passed from signup page)
    const stateEmail = location.state?.email;
    if (stateEmail) {
      setEmail(stateEmail);
    } else {
      // If no email in state, redirect to signup
      toast.error('Session expired', {
        description: 'Please sign up again',
      });
      navigate('/signup');
    }
  }, [location, navigate, toast]);

  useEffect(() => {
    // Countdown timer for resend button
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleVerify = async (otpValue: string) => {
    if (otpValue.length !== 6) return;

    setIsVerifying(true);
    setError('');

    try {
      await otpService.verifyEmail({ email, otp: otpValue });
      
      toast.success('Email verified!', {
        description: 'Your account has been activated successfully',
      });

      // Auto-login after verification
      // We need to login the user to get the token
      const loginResponse = await authService.login({
        identifier: email,
        password: location.state?.password || '',
      });

      if (loginResponse.success && loginResponse.data.token) {
        login(loginResponse.data.token, loginResponse.data.user);
        const dashboardPath = getDashboardPath(loginResponse.data.user);
        navigate(dashboardPath);
      } else {
        // If auto-login fails, redirect to login page
        navigate('/login', { 
          state: { 
            message: 'Email verified! Please login to continue.' 
          } 
        });
      }
    } catch (err: any) {
      setError(err.message || 'Invalid or expired OTP');
      toast.error('Verification failed', {
        description: err.message || 'Please check your OTP and try again',
      });
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setIsResending(true);
    setError('');

    try {
      await otpService.resendVerificationOTP(email);
      toast.success('OTP sent!', {
        description: 'A new verification code has been sent to your email',
      });
      setResendTimer(60); // 60 seconds cooldown
      setOtp('');
    } catch (err: any) {
      toast.error('Failed to resend OTP', {
        description: err.message || 'Please try again later',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <AuthCard title="Verify Your Email">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <svg
            className="w-8 h-8 text-primary-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <p className="text-neutral-600 text-sm">
          We've sent a 6-digit verification code to
        </p>
        <p className="text-neutral-900 font-semibold mt-1">{email}</p>
      </div>

      <div className="space-y-6">
        <OTPInput
          length={6}
          value={otp}
          onChange={setOtp}
          onComplete={handleVerify}
          error={error}
          disabled={isVerifying}
        />

        <Button
          type="button"
          variant="primary"
          className="w-full"
          onClick={() => handleVerify(otp)}
          isLoading={isVerifying}
          disabled={otp.length !== 6 || isVerifying}
        >
          {isVerifying ? 'Verifying...' : 'Verify Email'}
        </Button>

        <div className="text-center space-y-3">
          <p className="text-sm text-neutral-600">
            Didn't receive the code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            className={`text-sm font-medium transition-colors ${
              resendTimer > 0 || isResending
                ? 'text-neutral-400 cursor-not-allowed'
                : 'text-primary-600 hover:text-primary-700'
            }`}
          >
            {isResending
              ? 'Sending...'
              : resendTimer > 0
              ? `Resend in ${resendTimer}s`
              : 'Resend Code'}
          </button>
        </div>

        <div className="pt-4 border-t border-neutral-100 text-center">
          <Link
            to="/signup"
            className="text-sm text-neutral-500 hover:text-primary-500 transition-colors"
          >
            Use a different email address
          </Link>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
        <Link
          to="/"
          className="text-sm text-neutral-500 hover:text-primary-500 flex items-center justify-center gap-2 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Home
        </Link>
      </div>
    </AuthCard>
  );
}
