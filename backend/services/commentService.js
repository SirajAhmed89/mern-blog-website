import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { AppError } from '../utils/AppError.js';
import { getPaginationData, formatPaginatedResponse } from '../utils/pagination.js';

class CommentService {
  async create(commentData, authorId = null) {
    const post = await Post.findById(commentData.post);
    
    if (!post) {
      throw new AppError('Post not found', 404);
    }

    if (commentData.parentComment) {
      const parentComment = await Comment.findById(commentData.parentComment);
      if (!parentComment) {
        throw new AppError('Parent comment not found', 404);
      }
    }

    // Guest comment (no authorId) — require guestName and guestEmail
    if (!authorId) {
      if (!commentData.guestName || !commentData.guestEmail) {
        throw new AppError('Guest name and email are required', 400);
      }
    }

    const comment = await Comment.create({
      content: commentData.content,
      post: commentData.post,
      parentComment: commentData.parentComment || null,
      author: authorId || null,
      guestName: authorId ? null : commentData.guestName,
      guestEmail: authorId ? null : commentData.guestEmail,
      status: 'pending', // All comments start as pending for moderation
    });

    return await comment.populate('author', 'name username');
  }

  async findByPost(postId, page = 1, limit = 20) {
    const query = { post: postId, parentComment: null, status: 'approved' };
    
    const total = await Comment.countDocuments(query);
    const pagination = getPaginationData(page, limit, total);

    const comments = await Comment.find(query)
      .populate('author', 'name username')
      .populate({
        path: 'replies',
        match: { status: 'approved' },
        populate: { path: 'author', select: 'name username' },
      })
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage);

    return formatPaginatedResponse(comments, pagination);
  }

  async findById(id) {
    const comment = await Comment.findById(id)
      .populate('author', 'name username')
      .populate('post', 'title slug');

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    return comment;
  }

  async update(id, updateData, userId) {
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    if (comment.author.toString() !== userId) {
      throw new AppError('Not authorized to update this comment', 403);
    }

    Object.assign(comment, updateData);
    await comment.save();

    return await comment.populate('author', 'name username');
  }

  async delete(id, userId, isAdmin = false) {
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    // Admins can delete any comment; users can only delete their own
    if (!isAdmin && (!comment.author || comment.author.toString() !== userId)) {
      throw new AppError('Not authorized to delete this comment', 403);
    }

    await Comment.deleteMany({ parentComment: id });
    await comment.deleteOne();
    return comment;
  }

  async findAll(filters = {}, page = 1, limit = 15) {
    const query = {};
    if (filters.status) query.status = filters.status;
    if (filters.postId) query.post = filters.postId;

    const total = await Comment.countDocuments(query);
    const pagination = getPaginationData(page, limit, total);

    const comments = await Comment.find(query)
      .populate('author', 'name username email')
      .populate('post', 'title slug')
      .sort('-createdAt')
      .skip(pagination.skip)
      .limit(pagination.itemsPerPage);

    return formatPaginatedResponse(comments, pagination);
  }

  async updateStatus(id, status) {
    const comment = await Comment.findById(id);

    if (!comment) {
      throw new AppError('Comment not found', 404);
    }

    comment.status = status;
    await comment.save();

    return comment;
  }
}

export default new CommentService();
