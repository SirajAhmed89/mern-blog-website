import api from '../config/api';

export interface SiteSettings {
  _id?: string;
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  postsPerPage: number;
  commentsEnabled: boolean;
  commentModeration: boolean;
  allowGuestComments: boolean;
  newsletterEnabled: boolean;
  featuresEnabled: {
    search: boolean;
    categories: boolean;
    tags: boolean;
    socialSharing: boolean;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string;
  };
  socialLinks: {
    twitter: string;
    facebook: string;
    instagram: string;
    linkedin: string;
    github: string;
  };
  customCode: {
    headerCode: string;
    footerCode: string;
    customCSS: string;
    customJS: string;
  };
  updatedBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const settingsService = {
  getSettings: async (): Promise<SiteSettings> => {
    const response = await api.get('/settings');
    return response.data?.data?.settings;
  },

  updateSettings: async (data: Partial<SiteSettings>): Promise<SiteSettings> => {
    const response = await api.put('/settings', data);
    return response.data?.data?.settings;
  },
};
