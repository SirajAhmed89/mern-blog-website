/**
 * Post Notification Service
 * Handles automated newsletter notifications when posts are published
 */

import newsletterEmailService from './newsletterEmailService.js';
import Post from '../../models/Post.js';

class PostNotificationService {
  /**
   * Notify subscribers about a newly published post
   * @param {Object} post - The published post
   */
  async notifyNewPost(post) {
    try {
      // Only send notifications for published posts
      if (post.status !== 'published') {
        console.log('⚠️ Post is not published, skipping notification');
        return { success: false, message: 'Post is not published' };
      }

      // Populate post data if needed
      let populatedPost = post;
      if (!post.populated('author') || !post.populated('category')) {
        populatedPost = await Post.findById(post._id)
          .populate('author', 'name username email avatar')
          .populate('category', 'name slug')
          .populate('tags', 'name slug');
      }

      console.log(`📧 Notifying subscribers about new post: ${populatedPost.title}`);

      // Send newsletter update
      const result = await newsletterEmailService.sendPostUpdateEmail(populatedPost);

      return result;
    } catch (error) {
      console.error('❌ Failed to notify subscribers about new post:', error.message);
      // Don't throw - we don't want post publication to fail if email fails
      return { success: false, error: error.message };
    }
  }

  /**
   * Send digest of multiple posts
   * @param {Array} postIds - Array of post IDs to include in digest
   */
  async sendDigest(postIds) {
    try {
      const posts = await Post.find({
        _id: { $in: postIds },
        status: 'published',
      })
        .populate('author', 'name username email avatar')
        .populate('category', 'name slug')
        .populate('tags', 'name slug')
        .sort('-publishedAt');

      if (posts.length === 0) {
        return { success: false, message: 'No published posts found' };
      }

      console.log(`📧 Sending digest with ${posts.length} posts`);

      const result = await newsletterEmailService.sendDigestEmail(posts);

      return result;
    } catch (error) {
      console.error('❌ Failed to send digest:', error.message);
      throw error;
    }
  }

  /**
   * Send weekly digest of recent posts
   * @param {number} days - Number of days to look back (default: 7)
   */
  async sendWeeklyDigest(days = 7) {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const posts = await Post.find({
        status: 'published',
        publishedAt: { $gte: startDate },
      })
        .populate('author', 'name username email avatar')
        .populate('category', 'name slug')
        .populate('tags', 'name slug')
        .sort('-publishedAt')
        .limit(10); // Limit to 10 most recent posts

      if (posts.length === 0) {
        console.log(`⚠️ No posts published in the last ${days} days`);
        return { success: false, message: 'No recent posts to send' };
      }

      console.log(`📧 Sending weekly digest with ${posts.length} posts from last ${days} days`);

      const result = await newsletterEmailService.sendDigestEmail(posts);

      return result;
    } catch (error) {
      console.error('❌ Failed to send weekly digest:', error.message);
      throw error;
    }
  }
}

export default new PostNotificationService();
