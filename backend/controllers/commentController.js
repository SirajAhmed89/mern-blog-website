import commentService from '../services/commentService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

export const getAllComments = asyncHandler(async (req, res) => {
  const { page, limit, status, postId } = req.query;
  const result = await commentService.findAll({ status, postId }, page, limit);
  ApiResponse.success(res, result, 'Comments retrieved successfully');
});

export const createComment = asyncHandler(async (req, res) => {
  // If user is authenticated, use their ID; otherwise null (guest comment)
  const authorId = req.user?.id ?? null;
  const comment = await commentService.create(req.body, authorId);
  ApiResponse.success(res, { comment }, 'Comment created successfully', 201);
});

export const getCommentsByPost = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await commentService.findByPost(req.params.postId, page, limit);
  ApiResponse.success(res, result, 'Comments retrieved successfully');
});

export const getCommentById = asyncHandler(async (req, res) => {
  const comment = await commentService.findById(req.params.id);
  ApiResponse.success(res, { comment }, 'Comment retrieved successfully');
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await commentService.update(req.params.id, req.body, req.user.id);
  ApiResponse.success(res, { comment }, 'Comment updated successfully');
});

export const deleteComment = asyncHandler(async (req, res) => {
  const isAdmin = req.user && ['admin', 'superadmin'].includes(req.user.role);
  await commentService.delete(req.params.id, req.user?.id, isAdmin);
  ApiResponse.success(res, null, 'Comment deleted successfully');
});

export const updateCommentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const comment = await commentService.updateStatus(req.params.id, status);
  ApiResponse.success(res, { comment }, 'Comment status updated successfully');
});
