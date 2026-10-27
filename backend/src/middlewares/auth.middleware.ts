import { Request, Response, NextFunction } from 'express';
import { verifyJwt, JwtPayload } from '../utils/token';

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      message: 'Authentication required. Please sign in to your Gearup account.',
    });
    return;
  }

  const token = authHeader.slice(7).trim();
  const payload = verifyJwt(token);
  if (!payload) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please sign in again.',
    });
    return;
  }

  req.user = payload;
  next();
};
