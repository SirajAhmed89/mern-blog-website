import { useState, useEffect, useCallback } from 'react';
import { 
  EnvelopeIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import DataTable, { type Column } from '../../components/admin/ui/DataTable';
import StatusBadge from '../../components/admin/ui/StatusBadge';
import ActionMenu from '../../components/admin/ui/ActionMenu';
import SearchBar from '../../components/admin/ui/SearchBar';
import ConfirmDialog from '../../components/admin/ui/ConfirmDialog';
import StatCard from '../../components/admin/ui/StatCard';
import Button from '../../components/ui/Button';
import { newsletterAdminService, type NewsletterSubscriber } from '../../services/newsletterAdminService';
import { useToast } from '../../hooks/useToast';

const STATUS_OPTIONS = ['all', 'active', 'unsubscribed'];

export default function Newsletter() {
  const toast = useToast();

  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<NewsletterSubscriber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0, recentSubscribers: 0 });
  const [isExporting, setIsExporting] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await newsletterAdminService.getAllSubscribers({
        page,
        limit: 10,
        search: search || undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
        sort: '-subscribedAt',
      });
      setSubscribers(res.data ?? []);
      setTotalPages(res.pagination?.totalPages ?? 1);
    } catch {
      toast.error('Failed to load subscribers');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  const fetchStats = useCallback(async () => {
    try {
      const data = await newsletterAdminService.getStats();
      setStats(data);
    } catch {
      console.error('Failed to load stats');
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await newsletterAdminService.deleteSubscriber(deleteTarget._id);
      toast.success('Subscriber deleted');
      setDeleteTarget(null);
      fetchSubscribers();
      fetchStats();
    } catch {
      toast.error('Failed to delete subscriber');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const blob = await newsletterAdminService.exportSubscribers(statusFilter !== 'all' ? statusFilter : undefined);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Subscribers exported successfully');
    } catch {
      toast.error('Failed to export subscribers');
    } finally {
      setIsExporting(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const columns: Column<NewsletterSubscriber>[] = [
    {
      key: 'email',
      header: 'Email',
      render: (subscriber) => (
        <div>
          <p className="font-medium text-neutral-900">{subscriber.email}</p>
          <p className="text-xs text-neutral-400 mt-0.5">Source: {subscriber.source}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (subscriber) => (
        <StatusBadge 
          status={subscriber.status === 'active' ? 'published' : 'archived'} 
        />
      ),
    },
    {
      key: 'subscribedAt',
      header: 'Subscribed',
      render: (subscriber) => (
        <span className="text-neutral-600 text-sm">{formatDate(subscriber.subscribedAt)}</span>
      ),
    },
    {
      key: 'unsubscribedAt',
      header: 'Unsubscribed',
      render: (subscriber) => (
        <span className="text-neutral-500 text-sm">
          {subscriber.unsubscribedAt ? formatDate(subscriber.unsubscribedAt) : '—'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (subscriber) => (
        <ActionMenu
          actions={[
            { label: 'Delete', variant: 'danger', onClick: () => setDeleteTarget(subscriber) },
          ]}
        />
      ),
    },
  ];

  return (
    <AdminLayout title="Newsletter">
      <PageHeader
        title="Newsletter Subscribers"
        description="Manage newsletter subscriptions"
        action={
          <Button 
            size="sm" 
            variant="secondary"
            onClick={handleExport}
            isLoading={isExporting}
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Subscribers"
          value={stats.total.toLocaleString()}
          icon={<EnvelopeIcon className="w-6 h-6" />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Active"
          value={stats.active.toLocaleString()}
          icon={<CheckCircleIcon className="w-6 h-6" />}
          trend={{ value: 0, isPositive: true }}
        />
        <StatCard
          title="Unsubscribed"
          value={stats.unsubscribed.toLocaleString()}
          icon={<XCircleIcon className="w-6 h-6" />}
          trend={{ value: 0, isPositive: false }}
        />
        <StatCard
          title="Last 30 Days"
          value={stats.recentSubscribers.toLocaleString()}
          icon={<ArrowTrendingUpIcon className="w-6 h-6" />}
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="w-64">
          <SearchBar placeholder="Search by email..." onSearch={(v) => { setSearch(v); setPage(1); }} />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s === 'all' ? 'All Status' : s.charAt(0).toUpperCase() + s.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={subscribers}
        isLoading={isLoading}
        keyExtractor={(s) => s._id}
        emptyMessage="No subscribers found."
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Subscriber"
        message={`Are you sure you want to delete "${deleteTarget?.email}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </AdminLayout>
  );
}
