import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';
import MobileMenu from './MobileMenu';
import SearchModal from './SearchModal';
import UserMenu from './UserMenu';
import { useKeyPress } from '../../hooks/useKeyPress';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  // Keyboard shortcut: Cmd/Ctrl + K to open search
  useKeyPress('k', (event) => {
    if (event.metaKey || event.ctrlKey) {
      event.preventDefault();
      setIsSearchOpen(true);
    }
  });

  // ESC to close search
  useKeyPress('Escape', () => {
    if (isSearchOpen) {
      setIsSearchOpen(false);
    }
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  });

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">C</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">Chronicle</span>
            </Link>

            {/* Centered Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 absolute left-1/2 transform -translate-x-1/2">
              <Link to="/" className="text-neutral-700 hover:text-primary-500 transition-colors font-medium">
                Home
              </Link>
              <Link to="/blog" className="text-neutral-700 hover:text-primary-500 transition-colors font-medium">
                Articles
              </Link>
              <Link to="/categories" className="text-neutral-700 hover:text-primary-500 transition-colors font-medium">
                Categories
              </Link>
              <Link to="/about" className="text-neutral-700 hover:text-primary-500 transition-colors font-medium">
                About
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
              {/* Search Button */}
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Search"
              >
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
              
              {/* Desktop Auth Buttons or User Menu */}
              {!isLoading && (
                <>
                  {isAuthenticated ? (
                    <div className="hidden md:block">
                      <UserMenu />
                    </div>
                  ) : (
                    <div className="hidden md:flex items-center space-x-3">
                      <Link to="/login">
                        <Button variant="ghost" size="sm">Sign In</Button>
                      </Link>
                      <Link to="/signup">
                        <Button variant="primary" size="sm">Get Started</Button>
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
                aria-label="Open menu"
              >
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </>
  );
}
