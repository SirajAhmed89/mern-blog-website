import { useState, useEffect } from 'react';
import { commentPublicService } from '../../services/commentAdminService';
import { useToast } from '../../hooks/useToast';
import Button from '../ui/Button';
import Input from '../ui/Input';
import type { Comment } from '../../types';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const toast = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    guestName: '',
    guestEmail: '',
    content: '',
  });

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await commentPublicService.getByPost(postId);
      setComments(res.data ?? []);
    } catch {
      toast.error('Failed to load comments');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.guestName.trim() || !form.guestEmail.trim() || !form.content.trim()) {
      toast.error('All fields are required');
      return;
    }
    setIsSubmitting(true);
    try {
      await commentPublicService.post({
        post: postId,
        guestName: form.guestName,
        guestEmail: form.guestEmail,
        content: form.content,
      });
      toast.success('Comment submitted!', {
        description: 'Your comment is pending approval.',
      });
      setForm({ guestName: '', guestEmail: '', content: '' });
      fetchComments();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to post comment');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAuthorName = (comment: Comment) => {
    if (comment.author) return comment.author.name;
    return comment.guestName ?? 'Guest';
  };

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-neutral-900 mb-8">
        Comments ({comments.length})
      </h2>

      {/* Comment Form */}
      <div className="bg-neutral-50 rounded-lg p-6 mb-8">
        <h3 className="font-semibold text-neutral-900 mb-4">Leave a Comment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Your Name"
              value={form.guestName}
              onChange={(e) => setForm((p) => ({ ...p, guestName: e.target.value }))}
              placeholder="John Doe"
              required
            />
            <Input
              label="Your Email"
              type="email"
              value={form.guestEmail}
              onChange={(e) => setForm((p) => ({ ...p, guestEmail: e.target.value }))}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-neutral-700">Comment</label>
            <textarea
              value={form.content}
              onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
              rows={4}
              placeholder="Share your thoughts..."
              className="w-full px-4 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              required
            />
          </div>
          <Button type="submit" size="sm" isLoading={isSubmitting}>
            Post Comment
          </Button>
        </form>
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-neutral-200 rounded w-1/4 mb-3" />
              <div className="h-3 bg-neutral-200 rounded w-full mb-2" />
              <div className="h-3 bg-neutral-200 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-neutral-400">
          <p>No comments yet. Be the first to comment!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-white border border-neutral-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {getAuthorName(comment).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="font-medium text-neutral-900">{getAuthorName(comment)}</p>
                    <span className="text-xs text-neutral-400">•</span>
                    <p className="text-xs text-neutral-500">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  <p className="text-neutral-700 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
