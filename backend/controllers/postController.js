import postService from '../services/postService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

export const createPost = asyncHandler(async (req, res) => {
  const post = await postService.create(req.body, req.user.id);
  ApiResponse.success(res, { post }, 'Post created successfully', 201);
});

export const getAllPosts = asyncHandler(async (req, res) => {
  const { page, limit, status, category, tags, author, search, sort } = req.query;
  
  const filters = { status, category, tags, author, search };
  const result = await postService.findAll(filters, page, limit, sort);
  
  ApiResponse.success(res, result, 'Posts retrieved successfully');
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await postService.findById(req.params.id);
  ApiResponse.success(res, { post }, 'Post retrieved successfully');
});

export const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await postService.findBySlug(req.params.slug);
  await postService.incrementViews(post._id);
  ApiResponse.success(res, { post }, 'Post retrieved successfully');
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await postService.update(req.params.id, req.body, req.user.id, req.user.role);
  ApiResponse.success(res, { post }, 'Post updated successfully');
});

export const deletePost = asyncHandler(async (req, res) => {
  await postService.delete(req.params.id, req.user.id, req.user.role);
  ApiResponse.success(res, null, 'Post deleted successfully');
});

export const toggleLike = asyncHandler(async (req, res) => {
  const post = await postService.toggleLike(req.params.id, req.user.id);
  ApiResponse.success(res, { post }, 'Post like toggled successfully');
});

export const toggleFeaturedHero = asyncHandler(async (req, res) => {
  const post = await postService.toggleFeaturedHero(req.params.id, req.user.id, req.user.role);
  ApiResponse.success(res, { post }, 'Featured hero status toggled successfully');
});

export const getFeaturedHero = asyncHandler(async (req, res) => {
  const post = await postService.getFeaturedHero();
  ApiResponse.success(res, { post }, 'Featured hero post retrieved successfully');
});

export const getRecentPosts = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 6;
  const posts = await postService.getRecent(limit);
  ApiResponse.success(res, { posts }, 'Recent posts retrieved successfully');
});
