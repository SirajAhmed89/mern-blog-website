import api from '../config/api';
import type { Comment } from '../types';

interface CommentsResult {
  data: Comment[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const commentAdminService = {
  getAllComments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    postId?: string;
  }): Promise<CommentsResult> => {
    const response = await api.get('/comments', { params });
    const inner = response.data?.data ?? {};
    return {
      data: inner.data ?? [],
      pagination: inner.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 15 },
    };
  },

  updateStatus: async (id: string, status: 'approved' | 'rejected' | 'pending'): Promise<void> => {
    await api.patch(`/comments/${id}/status`, { status });
  },

  deleteComment: async (id: string): Promise<void> => {
    await api.delete(`/comments/${id}`);
  },
};

/** Public comment service — no auth required */
export const commentPublicService = {
  getByPost: async (postId: string, page = 1): Promise<CommentsResult> => {
    const response = await api.get(`/comments/post/${postId}`, { params: { page, limit: 20 } });
    const inner = response.data?.data ?? {};
    return {
      data: inner.data ?? [],
      pagination: inner.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 20 },
    };
  },

  post: async (data: {
    content: string;
    post: string;
    guestName: string;
    guestEmail: string;
    parentComment?: string;
  }): Promise<Comment> => {
    const response = await api.post('/comments', data);
    return response.data?.data?.comment;
  },
};
