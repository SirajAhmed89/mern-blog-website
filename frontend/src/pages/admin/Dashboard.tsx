import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/layout/AdminLayout';
import StatCard from '../../components/admin/ui/StatCard';
import StatusBadge from '../../components/admin/ui/StatusBadge';
import { postAdminService } from '../../services/postAdminService';
import { useAuth } from '../../contexts/AuthContext';
import type { Post } from '../../types';

export default function Dashboard() {
  const { hasPermission, isSuperAdmin, permissions } = useAuth();
  const canViewPosts = hasPermission('posts.view');
  const hasAnyAccess = isSuperAdmin || permissions.length > 0;

  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(canViewPosts);

  useEffect(() => {
    if (!canViewPosts) return;
    postAdminService.getAllPosts({ limit: 5, sort: '-createdAt' })
      .then((res) => setRecentPosts(res.data ?? []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [canViewPosts]);

  // Admin with zero permissions — show a friendly message
  if (!hasAnyAccess) {
    return (
      <AdminLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">No permissions assigned</h2>
          <p className="text-sm text-neutral-500 max-w-sm">
            Your account doesn't have any permissions yet. Contact a superadmin to get access to features.
          </p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Welcome back! Here's what's happening.</p>
      </div>

      {/* Stats — only show what the admin has access to */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {canViewPosts && (
          <StatCard
            title="Total Posts"
            value={recentPosts.length}
            color="primary"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
          />
        )}
        {hasPermission('dashboard.analytics') && (
          <StatCard
            title="Analytics"
            value="View"
            color="info"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
          />
        )}
        {hasPermission('users.view') && (
          <StatCard
            title="Users"
            value="Manage"
            color="success"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
          />
        )}
        {hasPermission('comments.view') && (
          <StatCard
            title="Comments"
            value="Moderate"
            color="warning"
            icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>}
          />
        )}
      </div>

      {/* Recent Posts — only if admin can view posts */}
      {canViewPosts && (
        <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 className="font-semibold text-neutral-900">Recent Posts</h2>
            <Link to="/admin/posts" className="text-sm text-primary-600 hover:text-primary-700">
              View all →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-200">
                  {['Title', 'Author', 'Category', 'Status', 'Views', 'Date'].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {isLoading
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <tr key={i}>
                        {Array.from({ length: 6 }).map((_, j) => (
                          <td key={j} className="px-6 py-4"><div className="h-4 bg-neutral-200 rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  : recentPosts.length === 0
                  ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-10 text-center text-neutral-400 text-sm">No posts yet.</td>
                    </tr>
                  )
                  : recentPosts.map((post) => (
                      <tr key={post._id} className="hover:bg-neutral-50">
                        <td className="px-6 py-4 font-medium text-neutral-900 max-w-xs truncate">{post.title}</td>
                        <td className="px-6 py-4 text-neutral-600">{post.author?.name ?? '—'}</td>
                        <td className="px-6 py-4 text-neutral-600">{post.category?.name ?? '—'}</td>
                        <td className="px-6 py-4"><StatusBadge status={post.status} /></td>
                        <td className="px-6 py-4 text-neutral-600">{post.views?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-neutral-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
