import Post from '../models/Post.js';
import { AppError } from '../utils/AppError.js';
import { generateUniqueSlug } from '../utils/slugify.js';
import { getPaginationData, formatPaginatedResponse } from '../utils/pagination.js';
import postNotificationService from './newsletter/postNotificationService.js';

class PostService {
  async create(postData, authorId) {
    const slug = await generateUniqueSlug(Post, postData.title);
    
    const isPublishing = postData.status === 'published';
    
    const post = await Post.create({
      ...postData,
      slug,
      author: authorId,
      publishedAt: isPublishing ? new Date() : null,
    });

    const populatedPost = await post.populate([
      { path: 'author', select: 'name username email' },
      { path: 'category', select: 'name slug' },
      { path: 'tags', select: 'name slug' },
    ]);

    // Send newsletter notification if post is being published
    if (isPublishing) {
      postNotificationService.notifyNewPost(populatedPost).catch(err => {
        console.error('Failed to send post notification:', err);
      });
    }

    return populatedPost;
  }

  async findAll(filters = {}, page = 1, limit = 10, sort = '-createdAt') {
    const query = {};

    if (filters.status) query.status = filters.status;
    if (filters.category) query.category = filters.category;
    if (filters.tags) query.tags = { $in: filters.tags };
    if (filters.author) query.author = filters.author;
    if (filters.featured === 'true' || filters.featured === true) {
      query.isFeaturedHero = true;
    }
    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    const total = await Post.countDocuments(query);
    const pagination = getPaginationData(page, limit, total);

    const posts = await Post.find(query)
      .populate('author', 'name username email')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort(sort)
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage);

    return formatPaginatedResponse(posts, pagination);
  }

  async findById(id) {
    const post = await Post.findById(id)
      .populate('author', 'name username email')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate('commentsCount');

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  }

  async findBySlug(slug) {
    const post = await Post.findOne({ slug })
      .populate('author', 'name username email')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .populate('commentsCount');

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    return post;
  }

  async update(id, updateData, userId, userRole) {
    const post = await Post.findById(id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Allow update if:
    // 1. User is the author, OR
    // 2. User is superadmin (superadmins can edit any post), OR
    // 3. User is admin (admins with posts.edit permission can edit any post - permission already checked in route)
    const isAuthor = post.author.toString() === userId;
    const isSuperAdmin = userRole === 'superadmin';
    const isAdmin = userRole === 'admin';

    if (!isAuthor && !isSuperAdmin && !isAdmin) {
      throw new AppError('Not authorized to update this post', 403);
    }

    if (updateData.title && updateData.title !== post.title) {
      updateData.slug = await generateUniqueSlug(Post, updateData.title, id);
    }

    // Check if post is being published for the first time
    const wasNotPublished = post.status !== 'published';
    const isNowPublished = updateData.status === 'published';
    const isBeingPublished = wasNotPublished && isNowPublished;

    if (isBeingPublished) {
      updateData.publishedAt = new Date();
    }

    Object.assign(post, updateData);
    await post.save();

    const populatedPost = await post.populate([
      { path: 'author', select: 'name username email' },
      { path: 'category', select: 'name slug' },
      { path: 'tags', select: 'name slug' },
    ]);

    // Send newsletter notification if post is being published for the first time
    if (isBeingPublished) {
      postNotificationService.notifyNewPost(populatedPost).catch(err => {
        console.error('Failed to send post notification:', err);
      });
    }

    return populatedPost;
  }

  async delete(id, userId, userRole) {
    const post = await Post.findById(id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Allow delete if:
    // 1. User is the author, OR
    // 2. User is superadmin (superadmins can delete any post), OR
    // 3. User is admin (admins with posts.delete permission can delete any post - permission already checked in route)
    const isAuthor = post.author.toString() === userId;
    const isSuperAdmin = userRole === 'superadmin';
    const isAdmin = userRole === 'admin';

    if (!isAuthor && !isSuperAdmin && !isAdmin) {
      throw new AppError('Not authorized to delete this post', 403);
    }

    await post.deleteOne();
    return post;
  }

  async incrementViews(id) {
    return await Post.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );
  }

  async toggleLike(postId, userId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    const likeIndex = post.likes.indexOf(userId);

    if (likeIndex > -1) {
      post.likes.splice(likeIndex, 1);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    return post;
  }

  async toggleFeaturedHero(id, userId, userRole) {
    const post = await Post.findById(id);

    if (!post) {
      throw new AppError('Post not found', 404);
    }

    // Only superadmin and admin can set featured hero
    if (userRole !== 'superadmin' && userRole !== 'admin') {
      throw new AppError('Not authorized to set featured hero', 403);
    }

    // If setting as featured hero, unset all other posts
    if (!post.isFeaturedHero) {
      await Post.updateMany(
        { isFeaturedHero: true },
        { $set: { isFeaturedHero: false } }
      );
      post.isFeaturedHero = true;
    } else {
      post.isFeaturedHero = false;
    }

    await post.save();
    return await post.populate([
      { path: 'author', select: 'name username email' },
      { path: 'category', select: 'name slug' },
      { path: 'tags', select: 'name slug' },
    ]);
  }

  async getFeaturedHero() {
    const post = await Post.findOne({ 
      isFeaturedHero: true, 
      status: 'published' 
    })
      .populate('author', 'name username email avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name slug');

    return post;
  }

  async getRecent(limit = 6) {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name username email avatar')
      .populate('category', 'name slug')
      .populate('tags', 'name slug')
      .sort('-publishedAt -createdAt')
      .limit(limit);

    return posts;
  }
}

export default new PostService();
