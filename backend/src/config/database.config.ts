import mongoose from 'mongoose';
import { loadEnv } from './env';
import logger from '@/common/lib/logger';

export const connectDb = async (): Promise<void> => {
  const env = loadEnv();
  try {
    const uri = env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI must be defined in environment');
    }

    logger.info('Connecting to MongoDB...');

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    const { host, port, name } = mongoose.connection;
    logger.info('MongoDB connected', { host, port, database: name });
  } catch (error) {
    logger.error('MongoDB connection failed', { error });
    process.exit(1);
  }
};

export const disconnectDB = async (): Promise<void> => {
  await mongoose.disconnect();
  logger.info('MongoDB connection closed');
};
