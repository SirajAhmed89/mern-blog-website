import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import PageHeader from '../../components/admin/ui/PageHeader';
import StatCard from '../../components/admin/ui/StatCard';
import { analyticsService, type DashboardAnalytics } from '../../services/analyticsService';

interface BarProps { label: string; value: number; max: number; color?: string; }

function Bar({ label, value, max, color = 'bg-primary-500' }: BarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-neutral-600 w-28 truncate flex-shrink-0" title={label}>{label}</span>
      <div className="flex-1 bg-neutral-100 rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm font-medium text-neutral-700 w-12 text-right">{value.toLocaleString()}</span>
    </div>
  );
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await analyticsService.getDashboardAnalytics();
      setAnalytics(data);
      setError(null);
    } catch (err: any) {
      console.error('Failed to load analytics:', err);
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Analytics">
        <PageHeader title="Analytics" description="Content performance overview" />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !analytics) {
    return (
      <AdminLayout title="Analytics">
        <PageHeader title="Analytics" description="Content performance overview" />
        <div className="bg-white rounded-xl border border-neutral-200 p-8 text-center">
          <p className="text-neutral-600">{error || 'No analytics data available'}</p>
          <button
            onClick={loadAnalytics}
            className="mt-4 text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Try Again
          </button>
        </div>
      </AdminLayout>
    );
  }

  const { overview, posts, comments, topPosts, topCategories, summary } = analytics;
  const maxViews = topPosts[0]?.views ?? 1;
  const maxPostCount = posts.total || 1;
  const maxCommentCount = comments.total || 1;

  const stats = [
    { title: 'Total Posts', value: overview.totalPosts, change: overview.postsChange, color: 'primary' as const },
    { title: 'Total Views', value: overview.totalViews, change: overview.viewsChange, color: 'info' as const },
    { title: 'Total Comments', value: overview.totalComments, change: overview.commentsChange, color: 'success' as const },
    { title: 'Subscribers', value: overview.totalSubscribers, change: overview.subscribersChange, color: 'warning' as const },
  ];

  return (
    <AdminLayout title="Analytics">
      <PageHeader title="Analytics" description="Content performance overview" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <StatCard
            key={s.title}
            title={s.title}
            value={s.value}
            change={s.change}
            color={s.color}
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts by Views */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Top Posts by Views</h2>
          {topPosts.length === 0 ? (
            <p className="text-sm text-neutral-400">No posts available.</p>
          ) : (
            <div className="space-y-3">
              {topPosts.slice(0, 5).map((p) => (
                <Bar key={p._id} label={p.title} value={p.views} max={maxViews} />
              ))}
            </div>
          )}
        </div>

        {/* Post Status Breakdown */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Post Status Breakdown</h2>
          <div className="space-y-4">
            <Bar label="Published" value={posts.published} max={maxPostCount} color="bg-success-500" />
            <Bar label="Draft" value={posts.draft} max={maxPostCount} color="bg-warning-500" />
            <Bar label="Archived" value={posts.archived} max={maxPostCount} color="bg-neutral-400" />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Published', value: posts.published, color: 'text-success-600' },
              { label: 'Draft', value: posts.draft, color: 'text-warning-600' },
              { label: 'Archived', value: posts.archived, color: 'text-neutral-500' },
            ].map((item) => (
              <div key={item.label} className="bg-neutral-50 rounded-lg p-3">
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comment Moderation */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Comment Moderation</h2>
          <div className="space-y-4">
            <Bar label="Approved" value={comments.approved} max={maxCommentCount} color="bg-success-500" />
            <Bar label="Pending" value={comments.pending} max={maxCommentCount} color="bg-warning-500" />
            <Bar label="Rejected" value={comments.rejected} max={maxCommentCount} color="bg-error-500" />
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            {[
              { label: 'Approved', value: comments.approved, color: 'text-success-600' },
              { label: 'Pending', value: comments.pending, color: 'text-warning-600' },
              { label: 'Rejected', value: comments.rejected, color: 'text-error-600' },
            ].map((item) => (
              <div key={item.label} className="bg-neutral-50 rounded-lg p-3">
                <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-neutral-500 mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Summary */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <h2 className="font-semibold text-neutral-900 mb-4">Quick Summary</h2>
          <div className="space-y-3">
            {[
              { 
                label: 'Most viewed category', 
                value: summary.mostViewedCategory?.name || 'N/A'
              },
              { 
                label: 'Most active author', 
                value: summary.mostActiveAuthor?.name || 'N/A'
              },
              { 
                label: 'Avg. read time', 
                value: summary.avgReadTime ? `${summary.avgReadTime} min` : 'N/A'
              },
              { 
                label: 'Top categories', 
                value: topCategories.length > 0 ? topCategories[0].name : 'N/A'
              },
              { 
                label: 'Total subscribers', 
                value: analytics.newsletter.total.toLocaleString()
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                <span className="text-sm text-neutral-600">{item.label}</span>
                <span className="text-sm font-semibold text-neutral-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
