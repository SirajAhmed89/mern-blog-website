/**
 * Migration Script: Add isFeaturedHero field to existing posts
 * 
 * This script adds the isFeaturedHero field to all existing posts in the database.
 * It sets all posts to isFeaturedHero: false by default.
 * 
 * Run this script once after deploying the featured hero feature.
 * 
 * Usage:
 *   node backend/scripts/addFeaturedHeroField.js
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function
const addFeaturedHeroField = async () => {
  try {
    console.log('🔄 Starting migration: Adding isFeaturedHero field to posts...');

    // Get the Post collection directly
    const db = mongoose.connection.db;
    const postsCollection = db.collection('posts');

    // Check if any posts exist
    const totalPosts = await postsCollection.countDocuments();
    console.log(`📊 Found ${totalPosts} posts in the database`);

    if (totalPosts === 0) {
      console.log('ℹ️  No posts found. Migration not needed.');
      return;
    }

    // Check if any posts already have the isFeaturedHero field
    const postsWithField = await postsCollection.countDocuments({ 
      isFeaturedHero: { $exists: true } 
    });
    console.log(`📊 ${postsWithField} posts already have the isFeaturedHero field`);

    // Add isFeaturedHero: false to all posts that don't have it
    const result = await postsCollection.updateMany(
      { isFeaturedHero: { $exists: false } },
      { $set: { isFeaturedHero: false } }
    );

    console.log(`✅ Migration completed successfully!`);
    console.log(`   - Modified ${result.modifiedCount} posts`);
    console.log(`   - Matched ${result.matchedCount} posts`);

    // Verify the migration
    const verifyCount = await postsCollection.countDocuments({ 
      isFeaturedHero: { $exists: true } 
    });
    console.log(`✅ Verification: ${verifyCount} posts now have the isFeaturedHero field`);

    // Create index for better performance
    console.log('🔄 Creating index for isFeaturedHero field...');
    await postsCollection.createIndex({ isFeaturedHero: 1 });
    console.log('✅ Index created successfully');

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await addFeaturedHeroField();
    console.log('🎉 All done! You can now use the featured hero feature.');
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  }
};

// Run the script
main();
