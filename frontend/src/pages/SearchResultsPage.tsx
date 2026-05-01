import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, FaceFrownIcon } from '@heroicons/react/24/outline';
import { postService } from '../services/postService';
import PostCard from '../components/home/PostCard';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Skeleton from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import type { Post } from '../types';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');

  useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchQuery(query);
      fetchSearchResults(query);
    } else {
      setLoading(false);
    }
  }, [searchParams, currentPage]);

  const fetchSearchResults = async (query: string) => {
    if (!query.trim()) {
      setPosts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await postService.getAllPosts({
        page: currentPage,
        limit: 12,
        search: query,
      });

      if (response.data?.data) {
        setPosts(response.data.data);
        setTotalPages(response.data.pagination?.pages || 1);
      } else {
        setPosts([]);
      }
    } catch (err: any) {
      console.error('Error searching posts:', err);
      setError(err.message || 'Failed to search posts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      setCurrentPage(1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <Skeleton className="h-12 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const query = searchParams.get('q') || '';

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/blog')}
            className="mb-6"
          >
            ← Back to Blog
          </Button>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex gap-4 max-w-2xl">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit">
                Search
              </Button>
            </div>
          </form>

          {query && (
            <>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Search Results
              </h1>
              <p className="text-lg text-neutral-600">
                {posts.length > 0 ? (
                  <>
                    Found {posts.length} {posts.length === 1 ? 'result' : 'results'} for{' '}
                    <span className="font-semibold">"{query}"</span>
                  </>
                ) : (
                  <>
                    No results found for <span className="font-semibold">"{query}"</span>
                  </>
                )}
              </p>
            </>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Results */}
        {!query ? (
          <div className="text-center py-16">
            <MagnifyingGlassIcon className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              Search for posts
            </h2>
            <p className="text-neutral-600">
              Enter a search term to find posts
            </p>
          </div>
        ) : posts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <FaceFrownIcon className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              No results found
            </h2>
            <p className="text-neutral-600 mb-8">
              Try searching with different keywords or browse all posts
            </p>
            <Button onClick={() => navigate('/blog')}>
              Browse All Posts
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
