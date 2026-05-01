import Settings from '../models/Settings.js';
import { AppError } from '../utils/AppError.js';

class SettingsService {
  async getSettings() {
    const settings = await Settings.getSettings();
    return settings;
  }

  async updateSettings(updateData, userId) {
    const settings = await Settings.getSettings();
    
    // Update allowed fields
    const allowedFields = [
      'siteName',
      'siteDescription',
      'siteUrl',
      'postsPerPage',
      'commentsEnabled',
      'commentModeration',
      'allowGuestComments',
      'newsletterEnabled',
      'featuresEnabled',
      'seo',
      'socialLinks',
    ];

    Object.keys(updateData).forEach((key) => {
      if (allowedFields.includes(key)) {
        if (typeof updateData[key] === 'object' && !Array.isArray(updateData[key])) {
          // Merge nested objects
          settings[key] = { ...settings[key], ...updateData[key] };
        } else {
          settings[key] = updateData[key];
        }
      }
    });

    settings.updatedBy = userId;
    await settings.save();

    return settings;
  }
}

export default new SettingsService();
