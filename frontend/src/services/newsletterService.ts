import api from '../config/api';
import type { ApiResponse } from '../types';

interface NewsletterSubscribeResponse {
  message: string;
}

export const newsletterService = {
  subscribe: async (email: string) => {
    const response = await api.post<ApiResponse<NewsletterSubscribeResponse>>(
      '/newsletter/subscribe',
      { email }
    );
    return response.data;
  },

  unsubscribe: async (email: string) => {
    const response = await api.post<ApiResponse<NewsletterSubscribeResponse>>(
      '/newsletter/unsubscribe',
      { email }
    );
    return response.data;
  },
};
