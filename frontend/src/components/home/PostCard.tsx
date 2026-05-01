import { Link } from 'react-router-dom';
import { ClockIcon, HeartIcon, EyeIcon } from '@heroicons/react/24/outline';
import { uploadService } from '../../services/uploadService';
import type { Post } from '../../types';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Resolve featured image URL
  const featuredImageUrl = post.featuredImage 
    ? uploadService.resolveUrl(post.featuredImage)
    : 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';

  // Resolve author avatar
  const authorAvatar = post.author.avatar
    ? uploadService.resolveUrl(post.author.avatar)
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}`;

  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {/* Featured Image */}
      <Link to={`/post/${post.slug}`} className="block relative aspect-video overflow-hidden">
        <img
          src={featuredImageUrl}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800';
          }}
        />
        <div className="absolute top-4 left-4">
          <Link 
            to={`/category/${typeof post.category === 'object' ? post.category.slug : post.category}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-block"
          >
            <span className="px-3 py-1.5 bg-primary-500 hover:bg-primary-600 text-white text-xs font-semibold rounded-md transition-colors shadow-lg">
              {typeof post.category === 'object' ? post.category.name : post.category}
            </span>
          </Link>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-bold text-[oklch(16.6%_0.018_256.802)] mb-2 line-clamp-2 group-hover:text-[oklch(63.7%_0.237_25.331)] transition-colors">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-[oklch(47.6%_0.049_257.281)] text-sm mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => {
              const tagName = typeof tag === 'string' ? tag : tag.name;
              const tagSlug = tagName.toLowerCase().replace(/\s+/g, '-');
              return (
                <Link
                  key={typeof tag === 'string' ? tag : tag._id}
                  to={`/tag/${tagSlug}`}
                  className="text-xs text-[oklch(47.6%_0.049_257.281)] bg-[oklch(97.3%_0.007_247.896)] px-2 py-1 rounded hover:bg-[oklch(93.7%_0.013_255.508)] transition-colors"
                >
                  #{tagName}
                </Link>
              );
            })}
          </div>
        )}

        {/* Author & Meta */}
        <div className="flex items-center justify-between pt-4 border-t border-[oklch(93.7%_0.013_255.508)]">
          <div className="flex items-center space-x-3">
            <Link to={`/author/${post.author.username || post.author.name}`}>
              <img
                src={authorAvatar}
                alt={post.author.username}
                className="w-10 h-10 rounded-full hover:ring-2 hover:ring-primary-500 transition-all"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author.username)}`;
                }}
              />
            </Link>
            <div>
              <Link to={`/author/${post.author.username || post.author.name}`}>
                <p className="text-sm font-medium text-[oklch(28.2%_0.03_265.189)] hover:text-[oklch(63.7%_0.237_25.331)] transition-colors">
                  {post.author.name || post.author.username}
                </p>
              </Link>
              <div className="flex items-center space-x-2 text-xs text-[oklch(47.6%_0.049_257.281)]">
                <ClockIcon className="w-3 h-3" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-[oklch(47.6%_0.049_257.281)]">
            <div className="flex items-center space-x-1">
              <HeartIcon className="w-4 h-4" />
              <span className="text-xs">{post.likes?.length || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <EyeIcon className="w-4 h-4" />
              <span className="text-xs">{post.views || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
