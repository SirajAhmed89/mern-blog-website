import api from '../config/api';

export interface NewsletterSubscriber {
  _id: string;
  email: string;
  status: 'active' | 'unsubscribed';
  subscribedAt: string;
  unsubscribedAt?: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewsletterStats {
  total: number;
  active: number;
  unsubscribed: number;
  recentSubscribers: number;
}

interface SubscribersResult {
  data: NewsletterSubscriber[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const newsletterAdminService = {
  getAllSubscribers: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sort?: string;
  }): Promise<SubscribersResult> => {
    const response = await api.get('/newsletter', { params });
    const inner = response.data?.data ?? {};
    return {
      data: inner.data ?? [],
      pagination: inner.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
    };
  },

  getSubscriberById: async (id: string): Promise<{ data: NewsletterSubscriber }> => {
    const response = await api.get(`/newsletter/${id}`);
    return { data: response.data?.data?.subscriber ?? response.data?.data };
  },

  deleteSubscriber: async (id: string): Promise<void> => {
    await api.delete(`/newsletter/${id}`);
  },

  deleteMultiple: async (ids: string[]): Promise<void> => {
    await api.post('/newsletter/delete-multiple', { ids });
  },

  getStats: async (): Promise<NewsletterStats> => {
    const response = await api.get('/newsletter/stats');
    return response.data?.data?.stats ?? { total: 0, active: 0, unsubscribed: 0, recentSubscribers: 0 };
  },

  exportSubscribers: async (status?: string): Promise<Blob> => {
    const response = await api.get('/newsletter/export', {
      params: { status },
      responseType: 'blob',
    });
    return response.data;
  },
};
