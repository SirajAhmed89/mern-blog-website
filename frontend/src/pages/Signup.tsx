import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../components/forms/AuthCard';
import FormField from '../components/forms/FormField';
import SocialAuth from '../components/forms/SocialAuth';
import Button from '../components/ui/Button';
import { useForm } from '../hooks/useForm';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardPath } from '../utils/getDashboardPath';
import { useToast } from '../hooks/useToast';

interface SignupFormData extends Record<string, string> {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
  } = useForm<SignupFormData>({
    initialValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationRules: {
      name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        message: 'Name must be between 2 and 50 characters',
      },
      username: {
        required: true,
        minLength: 3,
        maxLength: 30,
        pattern: /^[a-zA-Z0-9_]+$/,
        message: 'Username must be 3-30 characters and contain only letters, numbers, and underscores',
      },
      email: {
        required: true,
        pattern: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        message: 'Please enter a valid email address',
      },
      password: {
        required: true,
        minLength: 6,
        message: 'Password must be at least 6 characters',
      },
      confirmPassword: {
        required: true,
        custom: (value: string): boolean => value === values.password,
        message: 'Passwords do not match',
      },
    },
    onSubmit: async (formValues) => {
      try {
        const { confirmPassword, ...registerData } = formValues;
        const response = await authService.register(registerData);
        
        // Check if verification is required
        if (response.data.requiresVerification) {
          toast.success('Registration successful!', {
            description: 'Please check your email for verification code',
          });
          
          // Redirect to OTP verification page
          navigate('/verify-email', { 
            state: { 
              email: registerData.email,
              password: registerData.password // Store temporarily for auto-login after verification
            } 
          });
        } else {
          // Old flow (if OTP is disabled)
          if (!response.data.token) {
            throw new Error('Registration failed');
          }
          login(response.data.token, response.data.user);
          toast.success('Account created successfully!', {
            description: `Welcome to our platform, ${response.data.user.name}!`,
          });
          const dashboardPath = getDashboardPath(response.data.user);
          navigate(dashboardPath);
        }
      } catch (error: any) {
        if (error.errors && Array.isArray(error.errors)) {
          // Handle validation errors from backend
          const fieldErrors: Partial<Record<keyof SignupFormData, string>> = {};
          error.errors.forEach((err: { field: string; message: string }) => {
            fieldErrors[err.field as keyof SignupFormData] = err.message;
          });
          setErrors(fieldErrors);
          toast.error('Registration failed', {
            description: 'Please check the form for errors',
          });
        } else {
          toast.error('Registration failed', {
            description: error.message || 'Please try again later',
          });
        }
      }
    },
  });

  return (
    <AuthCard title="Create Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full Name"
          name="name"
          type="text"
          placeholder="John Doe"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.name ? errors.name : undefined}
          required
        />

        <FormField
          label="Username"
          name="username"
          type="text"
          placeholder="johndoe"
          value={values.username}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.username ? errors.username : undefined}
          helperText="Only letters, numbers, and underscores"
          required
        />

        <FormField
          label="Email Address"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email ? errors.email : undefined}
          required
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="At least 6 characters"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : undefined}
          required
        />

        <FormField
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={values.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirmPassword ? errors.confirmPassword : undefined}
          required
        />

        <div className="flex items-start">
          <input
            type="checkbox"
            id="terms"
            className="mt-1 mr-2 rounded border-neutral-300"
            required
          />
          <label htmlFor="terms" className="text-sm text-neutral-600">
            I agree to the{' '}
            <Link to="/terms" className="text-primary-500 hover:text-primary-600">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary-500 hover:text-primary-600">
              Privacy Policy
            </Link>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isSubmitting}
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign in
          </Link>
        </p>
      </div>

      <SocialAuth />

      <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
        <Link to="/" className="text-sm text-neutral-500 hover:text-primary-500 flex items-center justify-center gap-2 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>
    </AuthCard>
  );
}
