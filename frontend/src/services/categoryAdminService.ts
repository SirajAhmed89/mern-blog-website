import api from '../config/api';
import type { Category, Tag, CategoryFormData, TagFormData } from '../types';

export const categoryAdminService = {
  // ApiResponse.success → { success, data: { categories: Category[] } }
  getAllCategories: async (): Promise<{ data: Category[] }> => {
    const response = await api.get('/categories');
    return { data: response.data?.data?.categories ?? [] };
  },

  createCategory: async (data: CategoryFormData): Promise<Category> => {
    const response = await api.post('/categories', data);
    return response.data?.data?.category;
  },

  updateCategory: async (id: string, data: Partial<CategoryFormData>): Promise<Category> => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data?.data?.category;
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },

  // ApiResponse.success → { success, data: { tags: Tag[] } }
  getAllTags: async (): Promise<{ data: Tag[] }> => {
    const response = await api.get('/tags');
    return { data: response.data?.data?.tags ?? [] };
  },

  createTag: async (data: TagFormData): Promise<Tag> => {
    const response = await api.post('/tags', data);
    return response.data?.data?.tag;
  },

  updateTag: async (id: string, data: Partial<TagFormData>): Promise<Tag> => {
    const response = await api.put(`/tags/${id}`, data);
    return response.data?.data?.tag;
  },

  deleteTag: async (id: string): Promise<void> => {
    await api.delete(`/tags/${id}`);
  },
};
