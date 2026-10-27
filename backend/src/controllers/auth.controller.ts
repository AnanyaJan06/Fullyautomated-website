import { Request, Response, NextFunction } from 'express';
import { User, IUser } from '../models/User.model';
import { hashPassword, verifyPassword, signJwt } from '../utils/token';
import { ApiResponse } from '../utils/ApiResponse';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function serializeUser(user: IUser) {
  return {
    id: String(user._id),
    fullName: user.fullName,
    email: user.email,
    phone: user.phone || '',
    accountType: user.accountType,
    role: user.role,
    primaryVehicle: user.primaryVehicle || null,
    createdAt: user.createdAt,
  };
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      accountType,
      primaryVehicle,
    } = req.body ?? {};

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      ApiResponse.error(res, 'Please enter your full name (at least 2 characters).', 400);
      return;
    }

    if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
      ApiResponse.error(res, 'Please provide a valid email address.', 400);
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      ApiResponse.error(res, 'Password must be at least 6 characters long.', 400);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      ApiResponse.error(res, 'An account with this email already exists. Please sign in instead.', 409);
      return;
    }

    const passwordHash = await hashPassword(password);

    const allowedAccountTypes = ['enthusiast', 'mechanic_shop', 'fleet'] as const;
    const validAccountType = allowedAccountTypes.includes(accountType)
      ? accountType
      : 'enthusiast';

    const cleanedVehicle =
      primaryVehicle &&
      typeof primaryVehicle === 'object' &&
      (primaryVehicle.year || primaryVehicle.make || primaryVehicle.model)
        ? {
            year: String(primaryVehicle.year || '').trim(),
            make: String(primaryVehicle.make || '').trim(),
            model: String(primaryVehicle.model || '').trim(),
            engine: String(primaryVehicle.engine || '').trim(),
            vin: String(primaryVehicle.vin || '').trim().toUpperCase(),
          }
        : undefined;

    const user = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      passwordHash,
      phone: typeof phone === 'string' ? phone.trim() : undefined,
      accountType: validAccountType,
      primaryVehicle: cleanedVehicle,
    });

    const token = signJwt({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });

    ApiResponse.success(
      res,
      {
        token,
        user: serializeUser(user),
      },
      'Your Gearup Garage account has been created successfully!',
      201
    );
  } catch (error) {
    next(error);
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body ?? {};

    if (!email || typeof email !== 'string' || !password || typeof password !== 'string') {
      ApiResponse.error(res, 'Please enter both your email address and password.', 400);
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      ApiResponse.error(res, 'Invalid email or password. Please check your credentials.', 401);
      return;
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      ApiResponse.error(res, 'Invalid email or password. Please check your credentials.', 401);
      return;
    }

    const token = signJwt({
      id: String(user._id),
      email: user.email,
      role: user.role,
    });

    ApiResponse.success(
      res,
      {
        token,
        user: serializeUser(user),
      },
      'Welcome back to Gearup!'
    );
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.sub) {
      ApiResponse.error(res, 'Unauthorized', 401);
      return;
    }

    const user = await User.findById(req.user.sub);
    if (!user) {
      ApiResponse.error(res, 'User account not found.', 404);
      return;
    }

    ApiResponse.success(res, { user: serializeUser(user) }, 'Authenticated user profile');
  } catch (error) {
    next(error);
  }
};
