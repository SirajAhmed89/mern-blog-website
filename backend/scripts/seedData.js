import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Tag from '../models/Tag.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { generateSlug } from '../utils/slugify.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Tag.deleteMany({});
    await Post.deleteMany({});
    await Comment.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@blog.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Blog administrator',
      isEmailVerified: true,
    });

    const admin2 = await User.create({
      name: 'John Admin',
      username: 'johnadmin',
      email: 'john@blog.com',
      password: 'admin123',
      role: 'admin',
      bio: 'Content administrator and writer',
      isEmailVerified: true,
    });

    console.log('✅ Created users');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Technology',
        slug: generateSlug('Technology'),
        description: 'Latest tech news and tutorials',
      },
      {
        name: 'Web Development',
        slug: generateSlug('Web Development'),
        description: 'Web development tips and tricks',
      },
      {
        name: 'Mobile',
        slug: generateSlug('Mobile'),
        description: 'Mobile app development',
      },
      {
        name: 'DevOps',
        slug: generateSlug('DevOps'),
        description: 'DevOps practices and tools',
      },
    ]);

    console.log('✅ Created categories');

    // Create tags
    const tags = await Tag.create([
      { name: 'JavaScript', slug: generateSlug('JavaScript') },
      { name: 'Node.js', slug: generateSlug('Node.js') },
      { name: 'React', slug: generateSlug('React') },
      { name: 'MongoDB', slug: generateSlug('MongoDB') },
      { name: 'Express', slug: generateSlug('Express') },
      { name: 'TypeScript', slug: generateSlug('TypeScript') },
      { name: 'Docker', slug: generateSlug('Docker') },
      { name: 'AWS', slug: generateSlug('AWS') },
    ]);

    console.log('✅ Created tags');

    // Create posts
    const posts = await Post.create([
      {
        title: 'Getting Started with Node.js',
        slug: generateSlug('Getting Started with Node.js'),
        content: 'Node.js is a powerful JavaScript runtime built on Chrome\'s V8 engine. In this comprehensive guide, we\'ll explore the fundamentals of Node.js and build your first application...',
        excerpt: 'Learn the basics of Node.js and build your first application',
        author: admin2._id,
        category: categories[1]._id,
        tags: [tags[0]._id, tags[1]._id],
        status: 'published',
        publishedAt: new Date(),
        views: 150,
      },
      {
        title: 'React Hooks Deep Dive',
        slug: generateSlug('React Hooks Deep Dive'),
        content: 'React Hooks revolutionized how we write React components. Let\'s explore useState, useEffect, useContext, and custom hooks in detail...',
        excerpt: 'Master React Hooks with practical examples',
        author: admin2._id,
        category: categories[1]._id,
        tags: [tags[0]._id, tags[2]._id],
        status: 'published',
        publishedAt: new Date(Date.now() - 86400000),
        views: 230,
      },
      {
        title: 'MongoDB Best Practices',
        slug: generateSlug('MongoDB Best Practices'),
        content: 'MongoDB is a powerful NoSQL database. Here are the best practices for schema design, indexing, and query optimization...',
        excerpt: 'Optimize your MongoDB database performance',
        author: admin._id,
        category: categories[0]._id,
        tags: [tags[3]._id],
        status: 'published',
        publishedAt: new Date(Date.now() - 172800000),
        views: 180,
      },
      {
        title: 'Building RESTful APIs with Express',
        slug: generateSlug('Building RESTful APIs with Express'),
        content: 'Express.js makes building APIs simple and elegant. Learn how to structure your API, handle errors, and implement authentication...',
        excerpt: 'Complete guide to building REST APIs',
        author: admin2._id,
        category: categories[1]._id,
        tags: [tags[1]._id, tags[4]._id],
        status: 'published',
        publishedAt: new Date(Date.now() - 259200000),
        views: 320,
      },
      {
        title: 'TypeScript for JavaScript Developers',
        slug: generateSlug('TypeScript for JavaScript Developers'),
        content: 'TypeScript adds static typing to JavaScript. Discover how TypeScript can improve your code quality and developer experience...',
        excerpt: 'Why you should learn TypeScript',
        author: admin2._id,
        category: categories[1]._id,
        tags: [tags[0]._id, tags[5]._id],
        status: 'draft',
      },
      {
        title: 'Docker Containerization Guide',
        slug: generateSlug('Docker Containerization Guide'),
        content: 'Docker simplifies application deployment. Learn how to containerize your applications and manage them with Docker Compose...',
        excerpt: 'Containerize your applications with Docker',
        author: admin._id,
        category: categories[3]._id,
        tags: [tags[6]._id],
        status: 'published',
        publishedAt: new Date(Date.now() - 345600000),
        views: 275,
      },
    ]);

    console.log('✅ Created posts');

    // Create comments
    await Comment.create([
      {
        content: 'Great article! Very helpful for beginners.',
        author: admin._id,
        post: posts[0]._id,
        status: 'approved',
      },
      {
        content: 'Thanks for sharing. Looking forward to more content.',
        author: admin2._id,
        post: posts[1]._id,
        status: 'approved',
      },
      {
        content: 'This is exactly what I was looking for!',
        author: admin._id,
        post: posts[2]._id,
        status: 'approved',
      },
    ]);

    console.log('✅ Created comments');

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('📧 Login credentials:');
    console.log('   Admin 1: admin@blog.com / admin123');
    console.log('   Admin 2: john@blog.com / admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
