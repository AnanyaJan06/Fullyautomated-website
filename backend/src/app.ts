import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorMiddleware, notFoundMiddleware } from './middlewares/error.middleware';

const app: Application = express();

// Security & Core Middlewares
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (
      !origin ||
      env.corsOrigins.includes(origin) ||
      (env.nodeEnv === 'development' &&
        /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+)(:\d+)?$/.test(origin))
    ) {
      return callback(null, true);
    }
    const error = new Error('Origin is not allowed by CORS') as Error & { status: number };
    error.status = 403;
    return callback(error);
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));

// API Routes
app.use('/api/v1', apiRoutes);

// Error Handling Middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
