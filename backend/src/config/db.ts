import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

// Use public DNS (Google & Cloudflare) so mongodb+srv:// SRV lookups aren't blocked by local ISP/router DNS
dns.setServers(['8.8.8.8', '1.1.1.1']);

export const connectDB = async (): Promise<void> => {
  const conn = await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10_000 });
  logger.info(`MongoDB Connected: ${conn.connection.host}`);
};
