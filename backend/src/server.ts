import { env } from './config/env';
import { connectDB } from './config/db';
import app from './app';
import { initScheduledJobs } from './jobs/scheduler';
import { logger } from './utils/logger';

const startServer = async () => {
  await connectDB();

  // Initialize automated background jobs / cron tasks
  initScheduledJobs();

  app.listen(env.port, () => {
    logger.info(`Server running in ${env.nodeEnv} mode on http://localhost:${env.port}`);
  });
};

startServer();
