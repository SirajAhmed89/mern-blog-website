import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import AuthCard from '../components/forms/AuthCard';
import FormField from '../components/forms/FormField';
import SocialAuth from '../components/forms/SocialAuth';
import Button from '../components/ui/Button';
import { useForm } from '../hooks/useForm';
import { authService } from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardPath } from '../utils/getDashboardPath';
import { useToast } from '../hooks/useToast';

interface LoginFormData extends Record<string, string> {
  identifier: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const toast = useToast();
  const [rememberMe, setRememberMe] = useState(false);

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setErrors,
  } = useForm<LoginFormData>({
    initialValues: {
      identifier: '',
      password: '',
    },
    validationRules: {
      identifier: {
        required: true,
        message: 'Email or username is required',
      },
      password: {
        required: true,
        message: 'Password is required',
      },
    },
    onSubmit: async (formValues) => {
      try {
        const response = await authService.login(formValues);
        
        if (!response.data.token) {
          throw new Error('Authentication failed');
        }
        
        // Await login so permissions are loaded before navigating
        await login(response.data.token, response.data.user);
        
        toast.success('Welcome back!', {
          description: `Signed in as ${response.data.user.name}`,
        });
        
        const dashboardPath = getDashboardPath(response.data.user);
        navigate(dashboardPath);
      } catch (error: any) {
        // Check if error is due to unverified email
        if (error.message && error.message.includes('verify your email')) {
          toast.error('Email not verified', {
            description: 'Please verify your email before logging in',
          });
          navigate('/verify-email', { state: { email: formValues.identifier } });
          return;
        }

        // Check if account is deactivated
        if (error.message && error.message.includes('deactivated')) {
          toast.error('Account deactivated', {
            description: 'Your account has been deactivated. Contact a superadmin.',
          });
          return;
        }

        if (error.errors && Array.isArray(error.errors)) {
          const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
          error.errors.forEach((err: { field: string; message: string }) => {
            fieldErrors[err.field as keyof LoginFormData] = err.message;
          });
          setErrors(fieldErrors);
          toast.error('Invalid credentials', {
            description: 'Please check your email/username and password',
          });
        } else {
          toast.error('Login failed', {
            description: error.message || 'Please check your credentials and try again',
          });
        }
      }
    },
  });

  return (
    <AuthCard title="Sign In">
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email or Username"
          name="identifier"
          type="text"
          placeholder="you@example.com or username"
          value={values.identifier}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.identifier ? errors.identifier : undefined}
          required
        />

        <FormField
          label="Password"
          name="password"
          type="password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : undefined}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="mr-2 rounded border-neutral-300"
            />
            <span className="text-sm text-neutral-600">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-500 hover:text-primary-600">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-neutral-600">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary-500 hover:text-primary-600 font-medium">
            Sign up
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
