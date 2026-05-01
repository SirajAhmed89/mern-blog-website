import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Avatar from '../components/ui/Avatar';
import Button from '../components/ui/Button';
import CommentSection from '../components/common/CommentSection';
import { postService } from '../services/postService';
import { uploadService } from '../services/uploadService';
import { resolveImagesInHtml } from '../utils/imageUtils';
import type { Post } from '../types';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) {
        setError('Post ID is missing');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // Try fetching by slug first (since SearchModal uses slug)
        // If that fails, try by ID
        let response;
        try {
          response = await postService.getPostBySlug(id);
        } catch {
          // If slug fetch fails, try by ID directly via the service
          response = await postService.getPostById(id);
        }

        // Backend returns: { success: true, data: { post: {...} } }
        const postData = response.data?.post || response.data;
        
        if (!postData) {
          throw new Error('Post not found');
        }

        setPost(postData);
      } catch (err: any) {
        console.error('Error fetching post:', err);
        setError(err.message || 'Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">Post Not Found</h1>
          <p className="text-neutral-600 mb-8">{error || 'The post you are looking for does not exist.'}</p>
          <Button onClick={() => navigate('/blog')}>
            ← Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // Resolve featured image URL
  const featuredImageUrl = post.featuredImage 
    ? uploadService.resolveUrl(post.featuredImage)
    : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200';

  // Get author info
  const author = typeof post.author === 'object' ? post.author : { name: 'Unknown', email: '', username: '' };
  const authorAvatar = author.avatar 
    ? uploadService.resolveUrl(author.avatar)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&background=random`;

  // Get category name
  const categoryName = typeof post.category === 'object' ? post.category.name : 'Uncategorized';
  const categorySlug = typeof post.category === 'object' ? post.category.slug : 'uncategorized';

  // Get tag names
  const tags = post.tags?.map(tag => typeof tag === 'object' ? tag.name : tag) || [];

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = post.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Resolve all images in content (using regex, safe for all environments)
  let processedContent = post.content;
  try {
    processedContent = resolveImagesInHtml(post.content);
  } catch (err) {
    console.error('Error processing images in content:', err);
    // Use original content if processing fails
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[500px] bg-gradient-to-br from-neutral-900 to-neutral-800">
        <img
          src={featuredImageUrl}
          alt={post.title}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          {/* Category Badge */}
          <Link 
            to={`/category/${categorySlug}`}
            className="mb-6 inline-flex w-fit"
          >
            <span className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold rounded-lg transition-colors shadow-lg">
              {categoryName}
            </span>
          </Link>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 max-w-4xl leading-tight">
            {post.title}
          </h1>
          
          {/* Author & Meta */}
          <div className="flex items-center gap-4 text-white/90">
            <Link to={`/author/${author.username || author.name}`}>
              <Avatar src={authorAvatar} alt={author.name} size="md" className="ring-2 ring-white/20 hover:ring-white/40 transition-all" />
            </Link>
            <div>
              <Link to={`/author/${author.username || author.name}`}>
                <p className="font-semibold text-white hover:text-primary-300 transition-colors">
                  {author.name}
                </p>
              </Link>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <span>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </span>
                <span>•</span>
                <span>{readTime} min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Social Share */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-neutral-200">
            <span className="text-sm text-neutral-600">Share:</span>
            <button 
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              title="Share on Twitter"
            >
              <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
              </svg>
            </button>
            <button 
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              title="Share on Facebook"
            >
              <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
            <button 
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
              className="p-2 hover:bg-neutral-100 rounded-full transition-colors"
              title="Share on LinkedIn"
            >
              <svg className="w-5 h-5 text-neutral-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </button>
          </div>

          {/* Article Content - Render HTML from TipTap */}
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl prose-p:text-neutral-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-900 prose-img:rounded-lg prose-img:shadow-md"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-neutral-200">
              {tags.map((tag: string) => (
                <Link
                  key={tag}
                  to={`/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-full text-sm text-neutral-700 transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author Bio */}
          <div className="mt-12 p-8 bg-neutral-50 rounded-lg">
            <div className="flex items-start gap-4">
              <Avatar src={authorAvatar} alt={author.name} size="xl" />
              <div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                  {author.name}
                </h3>
                <p className="text-neutral-600 mb-4">
                  {author.bio || `Writer and content creator sharing insights on ${categoryName.toLowerCase()}.`}
                </p>
                <Button variant="secondary" size="sm" onClick={() => navigate(`/author/${author.username || author.name}`)}>
                  View All Posts
                </Button>
              </div>
            </div>
          </div>

          {/* Comments */}
          {post._id && <CommentSection postId={post._id} />}

          {/* Back to Blog */}
          <div className="mt-16 text-center">
            <Button variant="secondary" onClick={() => navigate('/blog')}>
              ← Back to All Posts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
