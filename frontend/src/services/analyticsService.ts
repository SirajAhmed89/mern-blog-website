import api from '../config/api';

export interface DashboardAnalytics {
  overview: {
    totalPosts: number;
    totalViews: number;
    totalComments: number;
    totalSubscribers: number;
    postsChange: number;
    viewsChange: number;
    commentsChange: number;
    subscribersChange: number;
  };
  posts: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };
  comments: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };
  newsletter: {
    total: number;
    active: number;
    unsubscribed: number;
  };
  topPosts: Array<{
    _id: string;
    title: string;
    slug: string;
    views: number;
  }>;
  topCategories: Array<{
    _id: string;
    name: string;
    slug: string;
    postCount: number;
  }>;
  summary: {
    mostViewedCategory: {
      name: string;
      postCount: number;
    } | null;
    mostActiveAuthor: {
      name: string;
      username: string;
      postCount: number;
    } | null;
    avgReadTime: number;
  };
  recentActivity: {
    newPosts: number;
    newComments: number;
    newSubscribers: number;
    period: string;
  };
}

export const analyticsService = {
  getDashboardAnalytics: async (): Promise<DashboardAnalytics> => {
    const response = await api.get('/analytics/dashboard');
    return response.data?.data?.analytics;
  },

  getPostAnalytics: async (params?: { startDate?: string; endDate?: string }) => {
    const response = await api.get('/analytics/posts', { params });
    return response.data?.data?.analytics;
  },
};
