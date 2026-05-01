import Category from '../models/Category.js';
import { AppError } from '../utils/AppError.js';
import { generateUniqueSlug } from '../utils/slugify.js';

class CategoryService {
  async create(categoryData) {
    const slug = await generateUniqueSlug(Category, categoryData.name);
    
    const category = await Category.create({
      ...categoryData,
      slug,
    });

    return category;
  }

  async findAll() {
    return await Category.find().populate('postsCount').sort('name');
  }

  async findById(id) {
    const category = await Category.findById(id).populate('postsCount');

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async findBySlug(slug) {
    const category = await Category.findOne({ slug }).populate('postsCount');

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category;
  }

  async update(id, updateData) {
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    if (updateData.name && updateData.name !== category.name) {
      updateData.slug = await generateUniqueSlug(Category, updateData.name, id);
    }

    Object.assign(category, updateData);
    await category.save();

    return category;
  }

  async delete(id) {
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    await category.deleteOne();
    return category;
  }
}

export default new CategoryService();
