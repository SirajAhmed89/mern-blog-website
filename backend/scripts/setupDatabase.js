import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { databaseConfig } from '../config/database.config.js';

dotenv.config();

/**
 * Database Setup Script
 * Creates indexes and initial collections
 */

const setupDatabase = async () => {
  try {
    console.log('🔧 Starting database setup...\n');

    // Connect to database
    const config = databaseConfig.getActiveConfig();
    const uri = process.env.MONGODB_URI || config.uri;
    
    await mongoose.connect(uri, config.options);
    console.log('✅ Connected to MongoDB\n');

    // Get database info
    const db = mongoose.connection.db;
    const dbName = mongoose.connection.name;
    console.log(`📊 Database: ${dbName}`);

    // List existing collections
    const collections = await db.listCollections().toArray();
    console.log(`📁 Existing collections: ${collections.length}`);
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log('');

    // Create indexes for User collection
    console.log('🔨 Creating indexes...');
    const User = mongoose.model('User', new mongoose.Schema({
      email: { type: String, unique: true },
      name: String,
      password: String,
    }, { timestamps: true }));

    await User.createIndexes();
    console.log('✅ User indexes created');

    // Get database stats
    const stats = await db.stats();
    console.log('\n📈 Database Statistics:');
    console.log(`   - Collections: ${stats.collections}`);
    console.log(`   - Data Size: ${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Storage Size: ${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`   - Indexes: ${stats.indexes}`);

    console.log('\n✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

setupDatabase();
