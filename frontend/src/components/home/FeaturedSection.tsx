import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PostCard from './PostCard';
import { PostCardSkeleton } from '../ui/Skeleton';
import { postService } from '../../services/postService';
import type { Post } from '../../types';

export default function FeaturedSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postService.getRecentPosts(6);
        if (response.data && response.data.posts && Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        console.error('Error fetching recent posts:', err);
        setError('Failed to load posts. Please try again later.');
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPosts();
  }, []);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
              Recent Articles
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl">
              Latest stories from our writers and thought leaders.
            </p>
          </div>
          <Link 
            to="/blog" 
            className="hidden md:flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            View All
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">{error}</p>
              </div>
            )}
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600">No recent posts available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <PostCard key={post._id} post={post} />
                ))}
              </div>
            )}
          </>
        )}

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            View All Articles
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
