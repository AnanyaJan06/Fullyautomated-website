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
    if (!origin || env.corsOrigins.includes(origin)) return callback(null, true);
    const error = new Error('Origin is not allowed by CORS') as Error & { status: number };
    error.status = 403;
    return callback(error);
  },
  credentials: true,
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/v1', apiRoutes);

// Error Handling Middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
