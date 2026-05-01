import tagService from '../services/tagService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

export const createTag = asyncHandler(async (req, res) => {
  const tag = await tagService.create(req.body);
  ApiResponse.success(res, { tag }, 'Tag created successfully', 201);
});

export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await tagService.findAll();
  ApiResponse.success(res, { tags }, 'Tags retrieved successfully');
});

export const getTagById = asyncHandler(async (req, res) => {
  const tag = await tagService.findById(req.params.id);
  ApiResponse.success(res, { tag }, 'Tag retrieved successfully');
});

export const getTagBySlug = asyncHandler(async (req, res) => {
  const tag = await tagService.findBySlug(req.params.slug);
  ApiResponse.success(res, { tag }, 'Tag retrieved successfully');
});

export const updateTag = asyncHandler(async (req, res) => {
  const tag = await tagService.update(req.params.id, req.body);
  ApiResponse.success(res, { tag }, 'Tag updated successfully');
});

export const deleteTag = asyncHandler(async (req, res) => {
  await tagService.delete(req.params.id);
  ApiResponse.success(res, null, 'Tag deleted successfully');
});
