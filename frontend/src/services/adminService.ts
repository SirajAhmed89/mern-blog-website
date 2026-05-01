import api from '../config/api';
import type { User, AdminFormData } from '../types';

interface AdminsResult {
  data: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export const adminService = {
  // ApiResponse.paginated → { success, data: User[], pagination: { page, limit, total, pages } }
  getAllAdmins: async (params?: { page?: number; limit?: number }): Promise<AdminsResult> => {
    const response = await api.get('/admin/list', { params });
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

  getAdminById: async (id: string): Promise<User> => {
    const response = await api.get(`/admin/${id}`);
    return response.data?.data?.admin;
  },

  createAdmin: async (data: AdminFormData): Promise<User> => {
    const response = await api.post('/admin/create', data);
    return response.data?.data?.admin ?? response.data?.data;
  },

  updateAdmin: async (id: string, data: Partial<AdminFormData>): Promise<User> => {
    const response = await api.put(`/admin/${id}`, data);
    return response.data?.data?.admin;
  },

  updatePermissions: async (id: string, permissions: string[]): Promise<User> => {
    const response = await api.put(`/admin/${id}/permissions`, { permissions });
    return response.data?.data?.admin;
  },

  activateAdmin: async (id: string): Promise<void> => {
    await api.put(`/admin/${id}/activate`);
  },

  deactivateAdmin: async (id: string): Promise<void> => {
    await api.put(`/admin/${id}/deactivate`);
  },

  deleteAdmin: async (id: string): Promise<void> => {
    await api.delete(`/admin/${id}`);
  },

  // { success, data: { permissions: { key: label } } }
  getAvailablePermissions: async (): Promise<Record<string, string>> => {
    const response = await api.get('/admin/permissions/available');
    return response.data?.data?.permissions ?? {};
  },

  getMyPermissions: async (): Promise<string[]> => {
    const response = await api.get('/admin/permissions/me');
    return response.data?.data?.permissions ?? [];
  },
};
