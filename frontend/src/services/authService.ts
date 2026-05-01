import api from '../config/api';
import type { ApiResponse, User } from '../types';

interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface LoginRequest {
  identifier: string;
  password: string;
}

interface AuthResponse {
  user: User;
  token?: string;
  message?: string;
  requiresVerification?: boolean;
}

interface ValidationError {
  field: string;
  message: string;
}

interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}

export const authService = {
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
      
      // Only store token if provided (when email verification is disabled)
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ErrorResponse;
      }
      throw { success: false, message: 'Registration failed. Please try again.' };
    }
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    try {
      const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
      if (response.data.success && response.data.data.token) {
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data as ErrorResponse;
      }
      throw { success: false, message: 'Login failed. Please try again.' };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },
};
