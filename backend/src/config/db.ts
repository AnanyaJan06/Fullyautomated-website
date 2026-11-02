import dns from 'node:dns';
import mongoose from 'mongoose';
import { env } from './env';
import { logger } from '../utils/logger';

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10_000 });
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    const errCode = (error as { code?: string; syscall?: string })?.code;
    const errSyscall = (error as { syscall?: string })?.syscall;
    if (errCode === 'ECONNREFUSED' || errSyscall === 'querySrv') {
      dns.setServers(['8.8.8.8', '1.1.1.1']);
      const conn = await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 10_000 });
      logger.info(`MongoDB Connected (via public DNS fallback): ${conn.connection.host}`);
      return;
    }
    throw error;
  }
};
