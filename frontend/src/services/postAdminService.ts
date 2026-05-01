import api from '../config/api';
import type { Post, PostFormData } from '../types';

interface PostsResult {
  data: Post[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const postAdminService = {
  getAllPosts: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    category?: string;
    search?: string;
    sort?: string;
  }): Promise<PostsResult> => {
    const response = await api.get('/posts', { params });
    // Backend: { success, data: { data: Post[], pagination: {...} } }
    const inner = response.data?.data ?? {};
    return {
      data: inner.data ?? [],
      pagination: inner.pagination ?? { currentPage: 1, totalPages: 1, totalItems: 0, itemsPerPage: 10 },
    };
  },

  getPostById: async (id: string): Promise<{ data: Post }> => {
    const response = await api.get(`/posts/${id}`);
    return { data: response.data?.data?.post ?? response.data?.data };
  },

  createPost: async (data: PostFormData): Promise<{ data: Post }> => {
    const response = await api.post('/posts', data);
    return { data: response.data?.data?.post ?? response.data?.data };
  },

  updatePost: async (id: string, data: Partial<PostFormData>): Promise<{ data: Post }> => {
    const response = await api.put(`/posts/${id}`, data);
    return { data: response.data?.data?.post ?? response.data?.data };
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(`/posts/${id}`);
  },

  togglePublish: async (id: string, status: 'draft' | 'published'): Promise<void> => {
    await api.put(`/posts/${id}`, { status });
  },

  toggleFeaturedHero: async (id: string): Promise<{ data: Post }> => {
    const response = await api.post(`/posts/${id}/featured-hero`);
    return { data: response.data?.data?.post ?? response.data?.data };
  },
};
