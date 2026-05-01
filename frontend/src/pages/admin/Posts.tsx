import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import DataTable, { type Column } from '../../components/admin/ui/DataTable';
import StatusBadge from '../../components/admin/ui/StatusBadge';
import ActionMenu from '../../components/admin/ui/ActionMenu';
import SearchBar from '../../components/admin/ui/SearchBar';
import ConfirmDialog from '../../components/admin/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import { postAdminService } from '../../services/postAdminService';
import { useToast } from '../../hooks/useToast';
import type { Post } from '../../types';

const STATUS_OPTIONS = ['all', 'published', 'draft', 'archived'];

export default function Posts() {
  const navigate = useNavigate();
  const toast = useToast();

  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await postAdminService.getAllPosts({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort: '-createdAt',
      });
      setPosts(res.data ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch {
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await postAdminService.deletePost(deleteTarget._id);
      toast.success('Post deleted');
      setDeleteTarget(null);
      fetchPosts();
    } catch {
      toast.error('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (post: Post) => {
    const newStatus = post.status === 'published' ? 'draft' : 'published';
    try {
      await postAdminService.togglePublish(post._id, newStatus);
      toast.success(`Post ${newStatus === 'published' ? 'published' : 'unpublished'}`);
      fetchPosts();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleToggleFeaturedHero = async (post: Post) => {
    try {
      await postAdminService.toggleFeaturedHero(post._id);
      toast.success(post.isFeaturedHero ? 'Removed from featured hero' : 'Set as featured hero');
      fetchPosts();
    } catch {
      toast.error('Failed to update featured hero status');
    }
  };

  const columns: Column<Post>[] = [
    {
      key: 'title',
      header: 'Title',
      render: (post) => (
        <div>
          <p className="font-medium text-neutral-900 truncate max-w-xs">{post.title}</p>
          <p className="text-xs text-neutral-400 mt-0.5">{post.slug}</p>
        </div>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (post) => <span className="text-neutral-600">{post.author?.name ?? '—'}</span>,
    },
    {
      key: 'category',
      header: 'Category',
      render: (post) => (
        <span className="px-2 py-0.5 bg-neutral-100 text-neutral-700 rounded-full text-xs">
          {post.category?.name ?? '—'}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (post) => (
        <div className="flex items-center gap-2">
          <StatusBadge status={post.status} />
          {post.isFeaturedHero && (
            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium flex items-center gap-1">
              <StarIcon className="w-3 h-3" />
              Hero
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'views',
      header: 'Views',
      render: (post) => <span className="text-neutral-600">{post.views?.toLocaleString() ?? 0}</span>,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (post) => (
        <span className="text-neutral-500 text-xs">{new Date(post.createdAt).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (post) => (
        <ActionMenu
          actions={[
            { label: 'Edit', onClick: () => navigate(`/admin/posts/${post._id}/edit`) },
            {
              label: post.status === 'published' ? 'Unpublish' : 'Publish',
              onClick: () => handleToggleStatus(post),
            },
            {
              label: post.isFeaturedHero ? 'Remove from Hero' : 'Set as Hero',
              onClick: () => handleToggleFeaturedHero(post),
              icon: post.isFeaturedHero ? <StarIcon className="w-4 h-4" /> : <StarOutlineIcon className="w-4 h-4" />,
            },
            { label: 'Delete', variant: 'danger', onClick: () => setDeleteTarget(post) },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="Posts">
      <PageHeader
        title="Posts"
        description="Manage all blog posts"
        action={
          <Button size="sm" onClick={() => navigate('/admin/posts/new')}>
            + New Post
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="w-64">
          <SearchBar placeholder="Search posts..." onSearch={(v) => { setSearch(v); setPage(1); }} />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={posts}
        isLoading={isLoading}
        keyExtractor={(p) => p._id}
        emptyMessage="No posts found."
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
}
