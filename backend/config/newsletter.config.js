/**
 * Newsletter Configuration
 * Centralized configuration for newsletter automation
 */

export const newsletterConfig = {
  // Automatic notifications
  automation: {
    // Send welcome email when user subscribes
    sendWelcomeEmail: process.env.NEWSLETTER_SEND_WELCOME === 'true' || true,
    
    // Send notification when post is published
    sendPostNotification: process.env.NEWSLETTER_SEND_POST_NOTIFICATION === 'true' || true,
    
    // Batch size for sending emails (to avoid overwhelming email service)
    batchSize: parseInt(process.env.NEWSLETTER_BATCH_SIZE) || 50,
    
    // Delay between batches in milliseconds
    batchDelay: parseInt(process.env.NEWSLETTER_BATCH_DELAY) || 1000,
  },

  // Email settings
  email: {
    // Unsubscribe URL base
    unsubscribeUrl: process.env.CLIENT_URL 
      ? `${process.env.CLIENT_URL}/newsletter/unsubscribe`
      : 'http://localhost:5173/newsletter/unsubscribe',
  },

  // Digest settings
  digest: {
    // Default number of days for weekly digest
    defaultDays: 7,
    
    // Maximum number of posts in digest
    maxPosts: 10,
  },
};

export default newsletterConfig;
