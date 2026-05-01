/**
 * Profile Service
 * Handles all profile-related API operations
 */

import api from '../config/api';
import type { User, ApiResponse } from '../types';

export interface UpdateProfileData {
  name?: string;
  email?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class ProfileService {
  /**
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data.user;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, data: UpdateProfileData): Promise<User> {
    const response = await api.put<ApiResponse<{ user: User }>>(
      `/users/${userId}`,
      data
    );
    return response.data.data.user;
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordData): Promise<void> {
    await api.put('/auth/change-password', data);
  }

  /**
   * Upload avatar image
   */
  async uploadAvatar(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post<ApiResponse<{ url: string }>>(
      '/upload/image?folder=avatars',
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );

    return response.data.data.url;
  }
}

export default new ProfileService();
