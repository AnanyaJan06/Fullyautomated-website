import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ApiResponse } from '../utils/ApiResponse';

export const getHealthStatus = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const databaseReady = mongoose.connection.readyState === 1;
    if (!databaseReady) {
      res.status(503).json({
        success: false,
        message: 'Database is unavailable',
      });
      return;
    }

    ApiResponse.success(
      res,
      {
        status: 'UP',
        timestamp: new Date().toISOString(),
        database: 'connected',
      },
      'Server is healthy',
    );
  } catch (error) {
    next(error);
  }
};
