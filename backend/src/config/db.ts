import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  const conn = await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10_000 });
  logger.info(`MongoDB Connected: ${conn.connection.host}`);
};
