import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { postService } from '../services/postService';
import { uploadService } from '../services/uploadService';
import PostCard from '../components/home/PostCard';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Skeleton from '../components/ui/Skeleton';
import type { Post } from '../types';

export default function AuthorPage() {
  const { username } = useParams<{ username: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authorInfo, setAuthorInfo] = useState<{
    name: string;
    username: string;
    avatar?: string;
    bio?: string;
  } | null>(null);

  // Support both /author/:username and /blog?author=name
  const authorQuery = username || searchParams.get('author') || '';

  useEffect(() => {
    const fetchPosts = async () => {
      if (!authorQuery) return;

      try {
        setLoading(true);
        setError('');
        
        // Fetch posts by author
        // Note: Backend needs to support author filter
        const response = await postService.getAllPosts({
          page: 1,
          limit: 100, // Get all posts for client-side filtering
          // Backend should accept author parameter
        });

        if (response.data?.data) {
          // Filter posts by author on frontend (temporary until backend supports it)
          const filteredPosts = response.data.data.filter((post: Post) => {
            const author = typeof post.author === 'object' ? post.author : null;
            if (!author) return false;
            
            return (
              author.username?.toLowerCase() === authorQuery.toLowerCase() ||
              author.name?.toLowerCase() === authorQuery.toLowerCase()
            );
          });

          setPosts(filteredPosts);
          
          // Get author info from first post
          if (filteredPosts.length > 0) {
            const firstPost = filteredPosts[0];
            const author = typeof firstPost.author === 'object' ? firstPost.author : null;
            if (author) {
              setAuthorInfo({
                name: author.name || 'Unknown Author',
                username: author.username || '',
                avatar: author.avatar,
                bio: author.bio,
              });
            }
          } else {
            setAuthorInfo({
              name: authorQuery,
              username: authorQuery,
            });
          }
        } else {
          setPosts([]);
        }
      } catch (err: any) {
        console.error('Error fetching author posts:', err);
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [authorQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-8">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
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

  const avatarUrl = authorInfo?.avatar
    ? uploadService.resolveUrl(authorInfo.avatar)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(authorInfo?.name || 'Author')}&background=random`;

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-4">
        {/* Author Header */}
        <div className="mb-12">
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => navigate('/blog')}
            className="mb-6"
          >
            ← Back to Blog
          </Button>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex items-start gap-6">
              <Avatar 
                src={avatarUrl} 
                alt={authorInfo?.name || 'Author'} 
                size="2xl"
              />
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                  {authorInfo?.name || 'Unknown Author'}
                </h1>
                {authorInfo?.username && (
                  <p className="text-neutral-600 mb-4">@{authorInfo.username}</p>
                )}
                {authorInfo?.bio && (
                  <p className="text-neutral-700 mb-4">{authorInfo.bio}</p>
                )}
                <p className="text-sm text-neutral-600">
                  {posts.length} {posts.length === 1 ? 'post' : 'posts'} published
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {posts.length > 0 ? (
          <>
            <h2 className="text-2xl font-bold text-neutral-900 mb-6">
              Posts by {authorInfo?.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>

            {/* Pagination - Hidden for now since we're filtering client-side */}
            {/* {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )} */}
          </>
        ) : (
          <div className="text-center py-16">
            <PencilSquareIcon className="w-16 h-16 mx-auto mb-4 text-neutral-400" />
            <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
              No posts yet
            </h2>
            <p className="text-neutral-600 mb-8">
              This author hasn't published any posts yet.
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
