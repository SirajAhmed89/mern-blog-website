import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    // Site Information
    siteName: {
      type: String,
      required: true,
      default: 'My Blog',
      trim: true,
      maxlength: [100, 'Site name cannot exceed 100 characters'],
    },
    siteDescription: {
      type: String,
      default: '',
      trim: true,
      maxlength: [500, 'Site description cannot exceed 500 characters'],
    },
    siteUrl: {
      type: String,
      default: '',
      trim: true,
    },
    
    // Content Settings
    postsPerPage: {
      type: Number,
      default: 10,
      min: [1, 'Posts per page must be at least 1'],
      max: [100, 'Posts per page cannot exceed 100'],
    },
    
    // Comment Settings
    commentsEnabled: {
      type: Boolean,
      default: true,
    },
    commentModeration: {
      type: Boolean,
      default: true,
    },
    allowGuestComments: {
      type: Boolean,
      default: true,
    },
    
    // Newsletter Settings
    newsletterEnabled: {
      type: Boolean,
      default: true,
    },
    
    // Feature Toggles
    featuresEnabled: {
      search: { type: Boolean, default: true },
      categories: { type: Boolean, default: true },
      tags: { type: Boolean, default: true },
      socialSharing: { type: Boolean, default: true },
    },
    
    // SEO Settings
    seo: {
      metaTitle: { type: String, default: '', maxlength: 60 },
      metaDescription: { type: String, default: '', maxlength: 160 },
      metaKeywords: { type: String, default: '' },
    },
    
    // Social Media Links
    socialLinks: {
      twitter: { type: String, default: '' },
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    
    // Custom Code Injection
    customCode: {
      headerCode: { 
        type: String, 
        default: '',
        maxlength: [10000, 'Header code cannot exceed 10000 characters']
      },
      footerCode: { 
        type: String, 
        default: '',
        maxlength: [10000, 'Footer code cannot exceed 10000 characters']
      },
      customCSS: { 
        type: String, 
        default: '',
        maxlength: [50000, 'Custom CSS cannot exceed 50000 characters']
      },
      customJS: { 
        type: String, 
        default: '',
        maxlength: [50000, 'Custom JS cannot exceed 50000 characters']
      },
    },
    
    // Last updated by
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one settings document exists
settingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
