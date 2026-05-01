import api from '../config/api';

export type UploadFolder = 'blog' | 'avatars' | 'categories' | 'misc';

export interface UploadedImage {
  url: string;
  filename: string;
  folder: string;
  size: number;
  mimetype: string;
}

/**
 * Upload a single image file to the backend.
 * @param file   - The File object to upload
 * @param folder - Destination folder: 'blog' | 'avatars' | 'categories' | 'misc'
 */
export const uploadService = {
  uploadImage: async (file: File, folder: UploadFolder = 'misc'): Promise<UploadedImage> => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await api.post(`/upload/image?folder=${folder}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data?.data as UploadedImage;
    } catch (error: any) {
      throw error;
    }
  },

  uploadMultiple: async (files: File[], folder: UploadFolder = 'misc'): Promise<UploadedImage[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));

    const response = await api.post(`/upload/images?folder=${folder}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data?.data?.images as UploadedImage[];
  },

  /**
   * Resolve a stored image URL to a full absolute URL.
   * Handles both relative paths (/uploads/...) and full URLs (http...).
   */
  resolveUrl: (url: string): string => {
    if (!url) return '';

    // Already a full URL
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    // Get base URL without /api suffix
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const base = apiUrl.replace(/\/api\/?$/, '');
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${base}${path}`;
  },
};
