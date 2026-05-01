import api from '../config/api';
import type { Category, ApiResponse } from '../types';

export const categoryService = {
  getAllCategories: async () => {
    const response = await api.get<ApiResponse<Category[]>>('/categories');
    return response.data;
  },

  getCategoryBySlug: async (slug: string) => {
    const response = await api.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
    return response.data;
  },
};
