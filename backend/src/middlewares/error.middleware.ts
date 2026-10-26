import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const notFoundMiddleware = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error(err.message, err.stack);
  const statusCode = (err as Error & { status?: number; statusCode?: number }).statusCode
    || (err as Error & { status?: number }).status
    || 500;
  const safeStatus = statusCode >= 400 && statusCode < 600 ? statusCode : 500;
  res.status(safeStatus).json({
    success: false,
    message: safeStatus < 500 ? err.message : 'Internal Server Error',
  });
};
