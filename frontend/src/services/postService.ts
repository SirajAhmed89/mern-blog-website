import api from '../config/api';
import type { Post, PaginatedResponse } from '../types';

export const postService = {
  getAllPosts: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    tag?: string;
    search?: string;
  }) => {
    const response = await api.get<PaginatedResponse<Post>>('/posts', { params });
    return response.data;
  },

  searchPosts: async (query: string, limit: number = 5) => {
    try {
      const response = await api.get('/posts', {
        params: { search: query, limit, status: 'published' }
      });
      
      // Backend returns: {success: true, data: {data: [], pagination: {}}}
      // We need to extract the nested data
      if (response.data && response.data.data) {
        return {
          success: response.data.success,
          data: response.data.data.data || [],
          pagination: response.data.data.pagination || {
            page: 1,
            limit,
            total: 0,
            pages: 0
          }
        };
      }
      
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0
        }
      };
    } catch (error) {
      console.error('Search posts error:', error);
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0
        }
      };
    }
  },

  getPostBySlug: async (slug: string) => {
    const response = await api.get<{ success: boolean; data: { post: Post } }>(`/posts/slug/${slug}`);
    return response.data;
  },

  getPostById: async (id: string) => {
    const response = await api.get<{ success: boolean; data: { post: Post } }>(`/posts/${id}`);
    return response.data;
  },

  getFeaturedPosts: async (limit: number = 6) => {
    const response = await api.get<PaginatedResponse<Post>>('/posts', {
      params: { limit, sort: '-views' }
    });
    return response.data;
  },

  getFeatured: async (limit: number = 3) => {
    try {
      // Use featured query parameter to get featured posts
      const response = await api.get<PaginatedResponse<Post>>('/posts', {
        params: { limit, featured: 'true', status: 'published', sort: '-createdAt' }
      });
      return response.data;
    } catch (error) {
      // Return empty array structure if API fails
      return {
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          pages: 0
        }
      };
    }
  },

  getFeaturedHero: async () => {
    try {
      const response = await api.get<{ success: boolean; data: { post: Post | null } }>('/posts/featured-hero');
      return response.data;
    } catch (error) {
      console.error('Error fetching featured hero:', error);
      return {
        success: false,
        data: { post: null }
      };
    }
  },

  getRecentPosts: async (limit: number = 6) => {
    try {
      const response = await api.get<{ success: boolean; data: { posts: Post[] } }>('/posts/recent', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent posts:', error);
      return {
        success: false,
        data: { posts: [] }
      };
    }
  },
};
