import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import User from '../models/User.js';
import Newsletter from '../models/Newsletter.js';
import Category from '../models/Category.js';

class AnalyticsService {
  async getDashboardStats() {
    // Get all stats in parallel for better performance
    const [
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews,
      totalComments,
      approvedComments,
      pendingComments,
      rejectedComments,
      totalSubscribers,
      activeSubscribers,
      topPostsByViews,
      topCategories,
      recentActivity,
    ] = await Promise.all([
      // Post stats
      Post.countDocuments(),
      Post.countDocuments({ status: 'published' }),
      Post.countDocuments({ status: 'draft' }),
      
      // Views aggregation
      Post.aggregate([
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]).then(result => result[0]?.total || 0),
      
      // Comment stats
      Comment.countDocuments(),
      Comment.countDocuments({ status: 'approved' }),
      Comment.countDocuments({ status: 'pending' }),
      Comment.countDocuments({ status: 'rejected' }),
      
      // Newsletter stats
      Newsletter.countDocuments(),
      Newsletter.countDocuments({ status: 'active' }),
      
      // Top posts by views
      Post.find({ status: 'published' })
        .select('title slug views')
        .sort('-views')
        .limit(5),
      
      // Top categories by post count
      Category.aggregate([
        {
          $lookup: {
            from: 'posts',
            localField: '_id',
            foreignField: 'category',
            as: 'posts'
          }
        },
        {
          $project: {
            name: 1,
            slug: 1,
            postCount: { $size: '$posts' }
          }
        },
        { $sort: { postCount: -1 } },
        { $limit: 5 }
      ]),
      
      // Recent activity (last 7 days)
      this.getRecentActivity(),
    ]);

    // Calculate post status breakdown
    const archivedPosts = totalPosts - publishedPosts - draftPosts;

    // Get most viewed category
    const mostViewedCategory = topCategories[0] || null;

    // Get average read time
    const avgReadTime = await Post.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: null, avgReadTime: { $avg: '$readTime' } } }
    ]).then(result => Math.round(result[0]?.avgReadTime || 0));

    // Get most active author
    const mostActiveAuthor = await Post.aggregate([
      { $match: { status: 'published' } },
      {
        $group: {
          _id: '$author',
          postCount: { $sum: 1 }
        }
      },
      { $sort: { postCount: -1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'authorInfo'
        }
      },
      { $unwind: '$authorInfo' },
      {
        $project: {
          name: '$authorInfo.name',
          username: '$authorInfo.username',
          postCount: 1
        }
      }
    ]).then(result => result[0] || null);

    return {
      overview: {
        totalPosts,
        totalViews,
        totalComments,
        totalSubscribers,
        // Calculate percentage changes (mock for now, can be enhanced with historical data)
        postsChange: 0,
        viewsChange: 0,
        commentsChange: 0,
        subscribersChange: 0,
      },
      posts: {
        total: totalPosts,
        published: publishedPosts,
        draft: draftPosts,
        archived: archivedPosts,
      },
      comments: {
        total: totalComments,
        approved: approvedComments,
        pending: pendingComments,
        rejected: rejectedComments,
      },
      newsletter: {
        total: totalSubscribers,
        active: activeSubscribers,
        unsubscribed: totalSubscribers - activeSubscribers,
      },
      topPosts: topPostsByViews,
      topCategories,
      summary: {
        mostViewedCategory: mostViewedCategory ? {
          name: mostViewedCategory.name,
          postCount: mostViewedCategory.postCount
        } : null,
        mostActiveAuthor: mostActiveAuthor ? {
          name: mostActiveAuthor.name,
          username: mostActiveAuthor.username,
          postCount: mostActiveAuthor.postCount
        } : null,
        avgReadTime,
      },
      recentActivity,
    };
  }

  async getRecentActivity() {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [newPosts, newComments, newSubscribers] = await Promise.all([
      Post.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Comment.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Newsletter.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    ]);

    return {
      newPosts,
      newComments,
      newSubscribers,
      period: '7 days',
    };
  }

  async getPostAnalytics(filters = {}) {
    const query = {};
    
    if (filters.startDate && filters.endDate) {
      query.createdAt = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    const [
      totalPosts,
      postsByStatus,
      postsByCategory,
      viewsOverTime,
    ] = await Promise.all([
      Post.countDocuments(query),
      
      Post.aggregate([
        { $match: query },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      Post.aggregate([
        { $match: query },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryInfo'
          }
        },
        { $unwind: '$categoryInfo' },
        {
          $group: {
            _id: '$category',
            name: { $first: '$categoryInfo.name' },
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ]),
      
      Post.aggregate([
        { $match: query },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
            },
            views: { $sum: '$views' },
            posts: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]),
    ]);

    return {
      totalPosts,
      postsByStatus,
      postsByCategory,
      viewsOverTime,
    };
  }
}

export default new AnalyticsService();
