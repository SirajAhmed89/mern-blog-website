import { useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 flex items-center justify-center px-4">
      <div className="text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary-500 mb-4">404</h1>
          <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
        </div>

        {/* Message */}
        <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-neutral-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => navigate(-1)} variant="secondary">
            ← Go Back
          </Button>
          <Button onClick={() => navigate('/')}>
            Go to Home
          </Button>
          <Button onClick={() => navigate('/blog')} variant="secondary">
            Browse Blog
          </Button>
        </div>

        {/* Helpful Links */}
        <div className="mt-12 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-600 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <button
              onClick={() => navigate('/')}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Home
            </button>
            <button
              onClick={() => navigate('/blog')}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Blog
            </button>
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              Admin Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
