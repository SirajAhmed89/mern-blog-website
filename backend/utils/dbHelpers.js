import mongoose from 'mongoose';

/**
 * Database Helper Utilities
 */

/**
 * Check if MongoDB is connected
 */
export const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get database connection status
 */
export const getConnectionStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

/**
 * Get database statistics
 */
export const getDatabaseStats = async () => {
  if (!isConnected()) {
    throw new Error('Database not connected');
  }

  const db = mongoose.connection.db;
  const stats = await db.stats();

  return {
    database: mongoose.connection.name,
    collections: stats.collections,
    dataSize: `${(stats.dataSize / 1024 / 1024).toFixed(2)} MB`,
    storageSize: `${(stats.storageSize / 1024 / 1024).toFixed(2)} MB`,
    indexes: stats.indexes,
    indexSize: `${(stats.indexSize / 1024 / 1024).toFixed(2)} MB`,
  };
};

/**
 * List all collections
 */
export const listCollections = async () => {
  if (!isConnected()) {
    throw new Error('Database not connected');
  }

  const collections = await mongoose.connection.db.listCollections().toArray();
  return collections.map(col => col.name);
};

/**
 * Gracefully close database connection
 */
export const closeConnection = async () => {
  if (isConnected()) {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

/**
 * Handle graceful shutdown
 */
export const setupGracefulShutdown = () => {
  process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await closeConnection();
    process.exit(0);
  });
};
