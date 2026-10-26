import { Request, Response, NextFunction } from 'express';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized' });
    return;
  }
  // Fail closed until real token verification and user identity attachment are implemented.
  res.status(503).json({
    success: false,
    message: 'Authentication is not configured',
  });
};
