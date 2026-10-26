import { env } from './config/env';
import { connectDB } from './config/db';
import app from './app';
import { initScheduledJobs } from './jobs/scheduler';
import { logger } from './utils/logger';

const startServer = async () => {
  try {
    await connectDB();
  } catch (error) {
    logger.error('Unable to connect to MongoDB:', error);
    process.exitCode = 1;
    return;
  }

  // Initialize automated background jobs / cron tasks
  initScheduledJobs();

  const server = app.listen(env.port, () => {
    logger.info(`Server running in ${env.nodeEnv} mode on http://localhost:${env.port}`);
  });

  const shutdown = (signal: string) => {
    logger.info(`${signal} received; shutting down gracefully`);
    server.close(() => {
      void import('mongoose').then(({ default: mongoose }) => mongoose.disconnect())
        .finally(() => process.exit(0));
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };

  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
};

void startServer().catch((error: unknown) => {
  logger.error('Server startup failed:', error);
  process.exitCode = 1;
});
