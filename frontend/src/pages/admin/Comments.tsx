import { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import DataTable, { type Column } from '../../components/admin/ui/DataTable';
import StatusBadge from '../../components/admin/ui/StatusBadge';
import ActionMenu from '../../components/admin/ui/ActionMenu';
import ConfirmDialog from '../../components/admin/ui/ConfirmDialog';
import { commentAdminService } from '../../services/commentAdminService';
import { useToast } from '../../hooks/useToast';
import type { Comment } from '../../types';

const STATUS_OPTIONS = ['all', 'pending', 'approved', 'rejected'];

export default function Comments() {
  const toast = useToast();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<Comment | null>(null);
  const [isActing, setIsActing] = useState(false);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await commentAdminService.getAllComments({
        page,
        limit: 15,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setComments(res.data ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch { toast.error('Failed to load comments'); }
    finally { setIsLoading(false); }
  }, [page, statusFilter]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await commentAdminService.updateStatus(id, status);
      toast.success(`Comment ${status}`);
      fetchComments();
    } catch { toast.error('Failed to update comment'); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsActing(true);
    try {
      await commentAdminService.deleteComment(deleteTarget._id);
      toast.success('Comment deleted');
      setDeleteTarget(null);
      fetchComments();
    } catch { toast.error('Failed to delete comment'); }
    finally { setIsActing(false); }
  };

  const columns: Column<Comment>[] = [
    {
      key: 'content',
      header: 'Comment',
      render: (c) => (
        <p className="text-sm text-neutral-700 max-w-sm truncate">{c.content}</p>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (c) => {
        if (c.author) {
          return (
            <div>
              <p className="text-sm font-medium text-neutral-900">{c.author.name}</p>
              <p className="text-xs text-neutral-400">{c.author.email}</p>
            </div>
          );
        }
        return (
          <div>
            <p className="text-sm font-medium text-neutral-900">{c.guestName ?? 'Guest'}</p>
            <p className="text-xs text-neutral-400">{c.guestEmail ?? '—'}</p>
          </div>
        );
      },
    },
    {
      key: 'post',
      header: 'Post',
      render: (c) => {
        if (!c.post) return <span className="text-xs text-neutral-500">—</span>;
        const postTitle = typeof c.post === 'object' ? (c.post as any)?.title : c.post;
        return (
          <span className="text-xs text-neutral-500 truncate max-w-xs block">
            {postTitle || '—'}
          </span>
        );
      },
    },
    {
      key: 'status',
      header: 'Status',
      render: (c) => <StatusBadge status={c.status} />,
    },
    {
      key: 'createdAt',
      header: 'Date',
      render: (c) => <span className="text-neutral-500 text-xs">{new Date(c.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (c) => (
        <ActionMenu
          actions={[
            ...(c.status !== 'approved' ? [{ label: 'Approve', onClick: () => handleStatus(c._id, 'approved') }] : []),
            ...(c.status !== 'rejected' ? [{ label: 'Reject', onClick: () => handleStatus(c._id, 'rejected') }] : []),
            { label: 'Delete', variant: 'danger' as const, onClick: () => setDeleteTarget(c) },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="Comments">
      <PageHeader title="Comments" description="Moderate user comments" />

      <div className="flex gap-3 mb-4">
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
        data={comments}
        isLoading={isLoading}
        keyExtractor={(c) => c._id}
        emptyMessage="No comments found."
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Comment"
        message="Permanently delete this comment?"
        confirmLabel="Delete"
        isLoading={isActing}
      />
    </AdminLayout>
  );
}
