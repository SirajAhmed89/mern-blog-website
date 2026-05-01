import { useState, useEffect } from 'react';
import PostCard from '../components/home/PostCard';
import { PostCardSkeleton } from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import { postService } from '../services/postService';
import type { Post } from '../types';

export default function BlogFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { name: 'All', slug: null },
    { name: 'Technology', slug: 'technology' },
    { name: 'Design', slug: 'design' },
    { name: 'Business', slug: 'business' },
    { name: 'Lifestyle', slug: 'lifestyle' }
  ];

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await postService.getAllPosts({
          page: currentPage,
          limit: 9,
          category: selectedCategory || undefined
        });
        
        if (response.success && response.data) {
          const data = response.data as any;
          const postList = data.data || (Array.isArray(data) ? data : []);
          const pagination = data.pagination || (response as any).pagination;
          
          setPosts(postList || []);
          if (pagination) {
            setTotalPages(pagination.totalPages || 1);
          }
        } else {
          setPosts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        setPosts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage, selectedCategory]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-4">Discover Stories</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Explore our collection of articles on technology, design, business, and more.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.slug || 'all'}
                onClick={() => setSelectedCategory(category.slug)}
                className={`px-6 py-2 rounded-full transition-all ${
                  selectedCategory === category.slug
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </>
        )}

        {/* Newsletter Section */}
        <div className="mt-20 bg-white rounded-lg shadow-md p-12 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
            Get the latest articles and insights delivered directly to your inbox.
          </p>
          <form className="flex gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors font-medium"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

