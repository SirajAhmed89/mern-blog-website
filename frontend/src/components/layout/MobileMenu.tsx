import { Link } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';
import { useAuth } from '../../contexts/AuthContext';
import { getImageUrl } from '../../utils/imageUrl';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, isAuthenticated, logout, hasPermission } = useAuth();

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />

      {/* Menu Panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 md:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <Link to="/" onClick={onClose} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">Chronicle</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-neutral-600" />
            </button>
          </div>

          {/* User Info (if logged in) */}
          {isAuthenticated && user && (
            <div className="p-4 border-b border-neutral-200 bg-neutral-50">
              <div className="flex items-center gap-3">
                <Avatar
                  src={getImageUrl(user.avatar)}
                  alt={user.name}
                  size="md"
                  fallback={user.name.charAt(0).toUpperCase()}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">{user.name}</p>
                  <p className="text-xs text-neutral-500 truncate">@{user.username}</p>
                  <p className="text-xs text-primary-500 mt-0.5 capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <Link
                to="/"
                onClick={onClose}
                className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
              >
                Home
              </Link>
              <Link
                to="/blog"
                onClick={onClose}
                className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
              >
                Articles
              </Link>
              <Link
                to="/categories"
                onClick={onClose}
                className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
              >
                Categories
              </Link>
              <Link
                to="/about"
                onClick={onClose}
                className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
              >
                About
              </Link>

              {/* Authenticated User Links */}
              {isAuthenticated && user && (
                <>
                  <div className="my-4 border-t border-neutral-200" />
                  
                  <Link
                    to="/admin/profile"
                    onClick={onClose}
                    className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
                  >
                    My Profile
                  </Link>

                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <Link
                      to="/admin/dashboard"
                      onClick={onClose}
                      className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
                    >
                      Dashboard
                    </Link>
                  )}

                  {hasPermission('posts.create') && (
                    <Link
                      to="/admin/posts/new"
                      onClick={onClose}
                      className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
                    >
                      Write Article
                    </Link>
                  )}

                  {hasPermission('dashboard.settings') && (
                    <Link
                      to="/admin/settings"
                      onClick={onClose}
                      className="block px-4 py-3 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors font-medium"
                    >
                      Site Settings
                    </Link>
                  )}
                </>
              )}
            </div>
          </nav>

          {/* Auth Buttons */}
          <div className="p-4 border-t border-neutral-200 space-y-3">
            {isAuthenticated ? (
              <Button variant="danger" size="md" className="w-full" onClick={handleLogout}>
                Sign Out
              </Button>
            ) : (
              <>
                <Link to="/login" onClick={onClose} className="block">
                  <Button variant="ghost" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup" onClick={onClose} className="block">
                  <Button variant="primary" size="md" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
