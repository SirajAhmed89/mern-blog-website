import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { postService } from '../../services/postService';
import { uploadService } from '../../services/uploadService';
import type { Post } from '../../types';

export default function HeroSection() {
  const [featuredPost, setFeaturedPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPost = async () => {
      try {
        const response = await postService.getFeaturedHero();
        if (response.data && response.data.post) {
          setFeaturedPost(response.data.post);
        } else {
          // Use fallback if no featured hero is set
          throw new Error('No featured hero post available');
        }
      } catch (error) {
        console.error('Error fetching featured hero post:', error);
        // Use fallback featured post
        setFeaturedPost({
          _id: '1',
          title: 'The Architecture of Information in the Modern Era',
          excerpt: 'How we structure data is no longer just a technical challenge; it\'s a fundamental design problem. Exploring the delicate balance between vast storage capabilities and human cognitive load in contemporary interface design.',
          featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=800&fit=crop',
          category: { name: 'Design', slug: 'design', _id: 'cat1' },
          author: { 
            _id: 'auth1',
            username: 'elenarostova',
            name: 'Elena Rostova',
            email: 'elena@example.com',
            avatar: 'https://i.pravatar.cc/150?img=5',
            role: 'admin' as const,
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          content: '',
          slug: 'architecture-of-information',
          tags: [],
          status: 'published' as const,
          likes: [],
          views: 2847,
          readTime: 8,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPost();
  }, []);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Resolve featured image URL
  const getFeaturedImageUrl = (post: Post | null) => {
    if (!post) return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';
    if (!post.featuredImage) return 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';
    return uploadService.resolveUrl(post.featuredImage);
  };

  // Resolve author avatar URL
  const getAuthorAvatarUrl = (post: Post | null) => {
    if (!post) return '';
    if (post.author.avatar) {
      return uploadService.resolveUrl(post.author.avatar);
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}`;
  };

  return (
    <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
        <div className="max-w-6xl mx-auto">
          

          {loading ? (
            <div className="animate-pulse bg-white/10 backdrop-blur-sm rounded-xl p-6 md:p-8 h-[500px]"></div>
          ) : featuredPost ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-2xl hover:shadow-3xl transition-shadow duration-300">
              {/* Bento Style Grid - Image on Left, Content on Right */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                {/* Left: Featured Image (7 columns on desktop) */}
                <div className="md:col-span-7 h-[300px] md:h-[400px] rounded-lg overflow-hidden relative group">
                  <img
                    src={getFeaturedImageUrl(featuredPost)}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';
                    }}
                  />
                  {/* Category Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-neutral-200">
                    <span className="text-xs font-medium text-primary-600">
                      {featuredPost.category.name}
                    </span>
                  </div>
                </div>

                {/* Right: Content (5 columns on desktop) */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  {/* Metadata */}
                  <div className="flex items-center gap-2 text-neutral-600 text-sm">
                    <span>{formatDate(featuredPost.createdAt)}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime || 5} min read</span>
                  </div>

                  {/* Title */}
                  <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 leading-tight font-serif">
                    {featuredPost.title}
                  </h2>

                  {/* Excerpt */}
                  <p className="text-base text-neutral-600 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-3 mt-4">
                    <img
                      src={getAuthorAvatarUrl(featuredPost)}
                      alt={featuredPost.author.username}
                      className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(featuredPost.author.username)}`;
                      }}
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {featuredPost.author.name || featuredPost.author.username}
                      </p>
                      <p className="text-xs text-neutral-500">Senior Editor</p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="mt-4">
                    <Link to={`/post/${featuredPost.slug}`}>
                      <Button 
                        variant="primary" 
                        size="lg"
                        className="w-full md:w-auto"
                      >
                        Read Full Article
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-white">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Discover Stories That Inspire
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Explore our collection of articles on technology, design, business, and lifestyle.
              </p>
              <Link to="/blog">
                <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-white/90">
                  Explore Articles
                </Button>
              </Link>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/20">
            
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
}
