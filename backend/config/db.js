import mongoose from 'mongoose';
import { databaseConfig } from './database.config.js';

const connectDB = async () => {
  try {
    const config = databaseConfig.getActiveConfig();
    const uri = process.env.MONGODB_URI || config.uri;

    const conn = await mongoose.connect(uri, config.options);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
    
  } catch (error) {
    console.error(`MongoDB initial connection error: ${error.message}`);
    console.error('\n⚠️  WARNING: Server will continue without database connection');
    console.error('💡 To fix: Whitelist your IP in MongoDB Atlas');
    console.error('   Run: node check-ip.js to get your IP\n');
    
    // Don't exit - allow server to run without DB for testing email
    // process.exit(1);
  }
};

export default connectDB;
