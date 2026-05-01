import categoryService from '../services/categoryService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/response.js';

export const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.create(req.body);
  ApiResponse.success(res, { category }, 'Category created successfully', 201);
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.findAll();
  ApiResponse.success(res, { categories }, 'Categories retrieved successfully');
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await categoryService.findById(req.params.id);
  ApiResponse.success(res, { category }, 'Category retrieved successfully');
});

export const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.findBySlug(req.params.slug);
  ApiResponse.success(res, { category }, 'Category retrieved successfully');
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  ApiResponse.success(res, { category }, 'Category updated successfully');
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.delete(req.params.id);
  ApiResponse.success(res, null, 'Category deleted successfully');
});
