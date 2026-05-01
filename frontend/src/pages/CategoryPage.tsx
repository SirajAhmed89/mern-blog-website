import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { postService } from '../services/postService';
import PostCard from '../components/home/PostCard';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Pagination from '../components/ui/Pagination';
import type { Post } from '../types';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryName, setCategoryName] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError('');
        
        const response = await postService.getAllPosts({
          page: currentPage,
          limit: 12,
          category: slug,
        });

        if (response.data?.data) {
          setPosts(response.data.data);
          setTotalPages(response.data.pagination?.pages || 1);
          
          // Get category name from first post
          if (response.data.data.length > 0) {
            const firstPost = response.data.data[0];
            const category = typeof firstPost.category === 'object' 
              ? firstPost.category.name 
              : slug;
            setCategoryName(category);
          } else {
            setCategoryName(slug.replace(/-/g, ' '));
          }
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        console.error('Error fetching category posts:', err);
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [slug, currentPage]);

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

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Error</h1>
          <p className="text-neutral-600 mb-8">{error}</p>
          <Button onClick={() => navigate('/blog')}>
            ← Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/blog')}
            className="mb-4"
          >
            ← Back to Blog
          </Button>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 capitalize">
            {categoryName}
          </h1>
          <p className="text-lg text-neutral-600">
            {posts.length} {posts.length === 1 ? 'post' : 'posts'} in this category
          </p>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
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
            <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              No posts yet
            </h2>
            <p className="text-neutral-600 mb-8">
              There are no published posts in this category yet.
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
