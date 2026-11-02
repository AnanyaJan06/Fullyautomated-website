import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { Part, IPart } from '../models/Part.model';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';
import { ApiResponse } from '../utils/ApiResponse';

type CreatePartBody = Pick<
  IPart,
  'description' | 'part' | 'year' | 'make' | 'model' | 'price' | 'condition' | 'images'
>;

export const createPart = async (
  req: Request<unknown, unknown, Partial<CreatePartBody>>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
      ApiResponse.error(res, 'Request body must be a JSON object.', 400);
      return;
    }

    // Pick allowed properties explicitly so client-supplied Mongo fields cannot
    // override generated identifiers or timestamps.
    const partData: Partial<CreatePartBody> = {
      description: req.body.description,
      part: req.body.part,
      year: req.body.year,
      make: req.body.make,
      model: req.body.model,
      price: req.body.price,
      condition: req.body.condition,
      images: req.body.images,
    };

    const part = await Part.create(partData);
    ApiResponse.success(res, { part }, 'Part created successfully.', 201);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const details = Object.values(error.errors).map((validationError) => ({
        field: validationError.path,
        message: validationError.message,
      }));
      res.status(400).json({
        success: false,
        message: 'Part data is invalid.',
        errors: details,
      });
      return;
    }

    if (error instanceof mongoose.Error.CastError) {
      ApiResponse.error(res, `Invalid value for ${error.path}.`, 400);
      return;
    }

    next(error);
  }
};

export const requireAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    ApiResponse.error(res, 'Administrator access is required.', 403);
    return;
  }

  next();
};
