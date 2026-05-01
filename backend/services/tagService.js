import Tag from '../models/Tag.js';
import { AppError } from '../utils/AppError.js';
import { generateUniqueSlug } from '../utils/slugify.js';

class TagService {
  async create(tagData) {
    const slug = await generateUniqueSlug(Tag, tagData.name);
    
    const tag = await Tag.create({
      ...tagData,
      slug,
    });

    return tag;
  }

  async findAll() {
    return await Tag.find().populate('postsCount').sort('name');
  }

  async findById(id) {
    const tag = await Tag.findById(id).populate('postsCount');

    if (!tag) {
      throw new AppError('Tag not found', 404);
    }

    return tag;
  }

  async findBySlug(slug) {
    const tag = await Tag.findOne({ slug }).populate('postsCount');

    if (!tag) {
      throw new AppError('Tag not found', 404);
    }

    return tag;
  }

  async update(id, updateData) {
    const tag = await Tag.findById(id);

    if (!tag) {
      throw new AppError('Tag not found', 404);
    }

    if (updateData.name && updateData.name !== tag.name) {
      updateData.slug = await generateUniqueSlug(Tag, updateData.name, id);
    }

    Object.assign(tag, updateData);
    await tag.save();

    return tag;
  }

  async delete(id) {
    const tag = await Tag.findById(id);

    if (!tag) {
      throw new AppError('Tag not found', 404);
    }

    await tag.deleteOne();
    return tag;
  }

  async findOrCreateMany(tagNames) {
    const tags = [];

    for (const name of tagNames) {
      let tag = await Tag.findOne({ name: name.trim() });
      
      if (!tag) {
        const slug = await generateUniqueSlug(Tag, name);
        tag = await Tag.create({ name: name.trim(), slug });
      }
      
      tags.push(tag._id);
    }

    return tags;
  }
}

export default new TagService();
