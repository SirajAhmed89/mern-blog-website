/**
 * Database Configuration
 * Supports both local MongoDB and MongoDB Atlas
 */

export const databaseConfig = {
  // Local MongoDB
  local: {
    uri: 'mongodb://localhost:27017/blog',
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    },
  },

  // MongoDB Atlas (Cloud)
  atlas: {
    uri: process.env.MONGODB_ATLAS_URI || '',
    options: {
      maxPoolSize: 50,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority',
    },
  },

  // Get active configuration based on environment
  getActiveConfig() {
    const useAtlas = process.env.USE_ATLAS === 'true';
    return useAtlas ? this.atlas : this.local;
  },
};
