import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { postService } from '../../services/postService';
import type { Post } from '../../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Post[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleViewAllResults = () => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleViewAllResults();
    }
  };

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
      setResults([]);
      setError(null);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsSearching(false);
      setError(null);
      return;
    }

    const searchPosts = async () => {
      setIsSearching(true);
      setError(null);
      try {
        const response = await postService.searchPosts(query, 5);
        console.log('Search response:', response);
        
        // Handle different response structures
        if (Array.isArray(response)) {
          setResults(response);
        } else if (response && Array.isArray(response.data)) {
          setResults(response.data);
        } else {
          console.warn('Unexpected response format:', response);
          setResults([]);
        }
      } catch (error: any) {
        console.error('Search error:', error);
        setError(error?.message || 'Failed to search. Please try again.');
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounce = setTimeout(searchPosts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-start justify-center p-4 sm:p-6 md:p-20">
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-2xl">
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b border-neutral-200">
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search articles..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 text-lg outline-none placeholder:text-neutral-400"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 hover:bg-neutral-100 rounded transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-neutral-400" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <span className="text-sm text-neutral-600 font-medium">ESC</span>
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {isSearching ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                <p className="mt-4 text-neutral-600">Searching...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-error-500">
                <p className="font-medium">Search Error</p>
                <p className="text-sm mt-2 text-neutral-600">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : query.length < 2 ? (
              <div className="p-8 text-center text-neutral-500">
                <MagnifyingGlassIcon className="w-12 h-12 mx-auto mb-4 text-neutral-300" />
                <p>Type at least 2 characters to search</p>
              </div>
            ) : results.length === 0 ? (
              <div className="p-8 text-center text-neutral-500">
                <p>No results found for "{query}"</p>
                <p className="text-sm mt-2">Try different keywords</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {results.map((result) => (
                  <Link
                    key={result._id}
                    to={`/post/${result.slug}`}
                    onClick={onClose}
                    className="block p-4 hover:bg-neutral-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-neutral-900 mb-1">
                          {result.title}
                        </h3>
                        <p className="text-sm text-neutral-600 line-clamp-2">
                          {result.excerpt}
                        </p>
                        <span className="inline-block mt-2 text-xs text-primary-500 font-medium">
                          {result.category?.name || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {results.length > 0 && (
            <div className="p-3 border-t border-neutral-200 bg-neutral-50">
              <div className="flex items-center justify-between">
                <p className="text-xs text-neutral-500">
                  Press <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-neutral-700">↵</kbd> to view all results, 
                  <kbd className="px-2 py-1 bg-white border border-neutral-300 rounded text-neutral-700 ml-1">ESC</kbd> to close
                </p>
                <button
                  onClick={handleViewAllResults}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  View All Results →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
