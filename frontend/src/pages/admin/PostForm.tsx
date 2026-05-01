import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { RichTextEditor, ImageUpload } from '../../components/shared';
import { postAdminService } from '../../services/postAdminService';
import { categoryAdminService } from '../../services/categoryAdminService';
import { useToast } from '../../hooks/useToast';
import type { Category, Tag, PostFormData } from '../../types';

export default function PostForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isEdit = !!id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEdit);

  const [form, setForm] = useState<PostFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: [],
    status: 'draft',
    featuredImage: '',
  });

  // ── Load categories, tags, and (if editing) existing post ──────────────────
  useEffect(() => {
    categoryAdminService.getAllCategories().then((r) => setCategories(r.data ?? [])).catch(() => {});
    categoryAdminService.getAllTags().then((r) => setTags(r.data ?? [])).catch(() => {});

    if (isEdit) {
      postAdminService
        .getPostById(id!)
        .then((r) => {
          const p = r.data;
          setForm({
            title: p.title,
            content: p.content,
            excerpt: p.excerpt,
            category: typeof p.category === 'object' ? p.category._id : p.category,
            tags: p.tags?.map((t: any) => (typeof t === 'object' ? t._id : t)) ?? [],
            status: p.status as 'draft' | 'published',
            featuredImage: p.featuredImage ?? '',
          });
        })
        .catch(() => toast.error('Failed to load post'))
        .finally(() => setIsFetching(false));
    }
  }, [id, isEdit]);

  const set = (field: keyof PostFormData, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const toggleTag = (tagId: string) =>
    set(
      'tags',
      form.tags.includes(tagId) ? form.tags.filter((t) => t !== tagId) : [...form.tags, tagId]
    );

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent, overrideStatus?: 'draft' | 'published') => {
    e.preventDefault();
    if (!form.title.trim() || !form.content || !form.category) {
      toast.error('Title, content, and category are required');
      return;
    }

    const payload: PostFormData = overrideStatus
      ? { ...form, status: overrideStatus }
      : form;

    setIsLoading(true);
    try {
      if (isEdit) {
        await postAdminService.updatePost(id!, payload);
        toast.success('Post updated successfully');
      } else {
        await postAdminService.createPost(payload);
        toast.success(
          payload.status === 'published' ? 'Post published!' : 'Post saved as draft'
        );
      }
      navigate('/admin/posts');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to save post');
    } finally {
      setIsLoading(false);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isFetching) {
    return (
      <AdminLayout title={isEdit ? 'Edit Post' : 'New Post'}>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isEdit ? 'Edit Post' : 'New Post'}>
      <PageHeader
        title={isEdit ? 'Edit Post' : 'New Post'}
        action={
          <Button variant="secondary" size="sm" onClick={() => navigate('/admin/posts')}>
            ← Back to Posts
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
        {/* ── Main content area ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Title */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <Input
              label="Post Title"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="Enter a compelling title…"
              required
              className="text-lg font-medium"
            />
          </div>

          {/* Rich Text Editor */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-2">
            <label className="block text-sm font-medium text-neutral-700">Content</label>
            <RichTextEditor
              value={form.content}
              onChange={(html) => set('content', html)}
              placeholder="Start writing your post content here…"
              minHeight={480}
            />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 space-y-2">
            <label className="block text-sm font-medium text-neutral-700">
              Excerpt
              <span className="ml-1 text-xs text-neutral-400 font-normal">
                (short description shown in post listings)
              </span>
            </label>
            <textarea
              value={form.excerpt}
              onChange={(e) => set('excerpt', e.target.value)}
              rows={3}
              maxLength={500}
              placeholder="Write a short summary of your post…"
              className="w-full px-4 py-2.5 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <p className="text-xs text-neutral-400 text-right">
              {form.excerpt.length}/500
            </p>
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Publish panel */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-4">
            <h3 className="font-semibold text-neutral-900 text-sm uppercase tracking-wide">
              Publish
            </h3>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-neutral-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => set('status', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                size="sm"
                isLoading={isLoading}
                className="flex-1"
                onClick={(e) => handleSubmit(e as any, 'published')}
              >
                {isEdit ? 'Update' : 'Publish'}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isLoading}
                onClick={(e) => handleSubmit(e as any, 'draft')}
              >
                Save Draft
              </Button>
            </div>
          </div>

          {/* Category */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-3">
            <h3 className="font-semibold text-neutral-900 text-sm uppercase tracking-wide">
              Category
            </h3>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              required
            >
              <option value="">Select a category…</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5 space-y-3">
            <h3 className="font-semibold text-neutral-900 text-sm uppercase tracking-wide">
              Tags
            </h3>
            {tags.length === 0 ? (
              <p className="text-xs text-neutral-400">No tags available</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag._id}
                    type="button"
                    onClick={() => toggleTag(tag._id)}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      form.tags.includes(tag._id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-xl border border-neutral-200 p-5">
            <ImageUpload
              value={form.featuredImage}
              onChange={(url) => set('featuredImage', url)}
              folder="blog"
              label="Featured Image"
              hint="Recommended: 1200×630px, JPG/PNG/WebP, max 10 MB"
            />
          </div>

          {/* SEO hint */}
          {form.featuredImage && (
            <div className="bg-success-50 border border-success-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-success-600 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-success-700">
                  Featured image is stored on the server and will be indexed by Google.
                </p>
              </div>
            </div>
          )}
        </div>
      </form>
    </AdminLayout>
  );
}
