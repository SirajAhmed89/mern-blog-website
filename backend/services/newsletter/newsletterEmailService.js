/**
 * Newsletter Email Service
 * Handles automated email sending for newsletter subscribers
 * Extends the base EmailService with newsletter-specific functionality
 */

import emailService from '../emailService.js';
import Newsletter from '../../models/Newsletter.js';
import { getNewsletterWelcomeTemplate, getPostUpdateTemplate } from '../../templates/email/newsletter/index.js';

class NewsletterEmailService {
  /**
   * Send welcome email to new subscriber
   * @param {string} email - Subscriber email
   */
  async sendWelcomeEmail(email) {
    try {
      const unsubscribeUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;
      
      const subject = '🎉 Welcome to Our Newsletter!';
      const html = getNewsletterWelcomeTemplate(email, unsubscribeUrl);

      await emailService.sendEmail({
        to: email,
        subject,
        html,
      });

      console.log(`✅ Welcome email sent to: ${email}`);
      return { success: true, email };
    } catch (error) {
      console.error(`❌ Failed to send welcome email to ${email}:`, error.message);
      // Don't throw error - we don't want subscription to fail if email fails
      return { success: false, email, error: error.message };
    }
  }

  /**
   * Send post update email to all active subscribers
   * @param {Object|Array} posts - Single post or array of posts to notify about
   * @param {Object} options - Additional options
   */
  async sendPostUpdateEmail(posts, options = {}) {
    try {
      // Normalize posts to array
      const postsArray = Array.isArray(posts) ? posts : [posts];
      
      if (postsArray.length === 0) {
        console.log('⚠️ No posts to send in newsletter update');
        return { success: false, message: 'No posts provided' };
      }

      // Get all active subscribers
      const subscribers = await Newsletter.find({ status: 'active' }).select('email');
      
      if (subscribers.length === 0) {
        console.log('⚠️ No active subscribers to send newsletter update');
        return { success: true, message: 'No active subscribers', sentCount: 0 };
      }

      console.log(`📧 Sending newsletter update to ${subscribers.length} subscribers...`);

      // Send emails in batches to avoid overwhelming the email service
      const batchSize = options.batchSize || 50;
      const results = {
        success: 0,
        failed: 0,
        total: subscribers.length,
        errors: [],
      };

      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize);
        
        // Send emails in parallel within each batch
        const batchPromises = batch.map(async (subscriber) => {
          try {
            const unsubscribeUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/newsletter/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
            
            const subject = postsArray.length === 1
              ? `📝 New Post: ${postsArray[0].title}`
              : `📚 ${postsArray.length} New Posts Published!`;
            
            const html = getPostUpdateTemplate(postsArray, unsubscribeUrl);

            await emailService.sendEmail({
              to: subscriber.email,
              subject,
              html,
            });

            results.success++;
            return { success: true, email: subscriber.email };
          } catch (error) {
            results.failed++;
            results.errors.push({
              email: subscriber.email,
              error: error.message,
            });
            console.error(`❌ Failed to send to ${subscriber.email}:`, error.message);
            return { success: false, email: subscriber.email, error: error.message };
          }
        });

        await Promise.all(batchPromises);

        // Add delay between batches to avoid rate limiting
        if (i + batchSize < subscribers.length) {
          await this.delay(options.batchDelay || 1000);
        }
      }

      console.log(`✅ Newsletter update sent: ${results.success} successful, ${results.failed} failed`);
      
      return {
        success: true,
        results,
        message: `Newsletter sent to ${results.success} subscribers`,
      };
    } catch (error) {
      console.error('❌ Failed to send newsletter update:', error.message);
      throw error;
    }
  }

  /**
   * Send digest email with multiple posts
   * @param {Array} posts - Array of posts for digest
   * @param {Object} options - Additional options
   */
  async sendDigestEmail(posts, options = {}) {
    return this.sendPostUpdateEmail(posts, {
      ...options,
      isDigest: true,
    });
  }

  /**
   * Test email sending to a specific address
   * @param {string} testEmail - Email address to send test to
   * @param {Object} samplePost - Sample post data for testing
   */
  async sendTestEmail(testEmail, samplePost = null) {
    try {
      const post = samplePost || {
        title: 'Sample Blog Post Title',
        slug: 'sample-blog-post',
        excerpt: 'This is a sample excerpt for testing the newsletter email template.',
        content: 'This is sample content for testing purposes.',
        featuredImage: null,
        author: { name: 'Test Author' },
        category: { name: 'Technology' },
        tags: [{ name: 'testing' }, { name: 'newsletter' }],
        publishedAt: new Date(),
      };

      const unsubscribeUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/newsletter/unsubscribe?email=${encodeURIComponent(testEmail)}`;
      
      const subject = '🧪 Test Newsletter Email';
      const html = getPostUpdateTemplate([post], unsubscribeUrl);

      await emailService.sendEmail({
        to: testEmail,
        subject,
        html,
      });

      console.log(`✅ Test email sent to: ${testEmail}`);
      return { success: true, email: testEmail };
    } catch (error) {
      console.error(`❌ Failed to send test email:`, error.message);
      throw error;
    }
  }

  /**
   * Utility function to add delay
   * @private
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new NewsletterEmailService();
