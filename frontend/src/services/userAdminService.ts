import api from '../config/api';
import type { User } from '../types';

interface UsersResult {
  data: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const userAdminService = {
  // ApiResponse.paginated → { success, data: User[], pagination: { page, limit, total, pages } }
  getAllUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
  }): Promise<UsersResult> => {
    const response = await api.get('/users', { params });
    const raw = response.data?.pagination ?? {};
    return {
      data: response.data?.data ?? [],
      pagination: {
        currentPage: raw.page ?? raw.currentPage ?? 1,
        totalPages: raw.pages ?? raw.totalPages ?? 1,
        totalItems: raw.total ?? raw.totalItems ?? 0,
        itemsPerPage: raw.limit ?? raw.itemsPerPage ?? 10,
      },
    };
  },

  getUserById: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data?.data?.user ?? response.data?.data;
  },

  updateUser: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put(`/users/${id}`, data);
    return response.data?.data?.user ?? response.data?.data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await api.delete(`/users/${id}`);
  },

  banUser: async (id: string): Promise<void> => {
    await api.put(`/users/${id}`, { isActive: false });
  },

  unbanUser: async (id: string): Promise<void> => {
    await api.put(`/users/${id}`, { isActive: true });
  },
};
