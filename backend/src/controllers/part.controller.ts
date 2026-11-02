import { Request, Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import { Part, IPart, PartDocument } from '../models/Part.model';
import { ApiResponse } from '../utils/ApiResponse';

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const CATEGORY_REGEX_MAP: Record<string, RegExp> = {
  'headlights & lighting': /headlight|headlamp|tail\s*light|led|lamp|lighting|bulb|fog\s*light/i,
  'tires & wheels': /tire|wheel|rim|tpms|spacer/i,
  'brake systems': /brake|rotor|caliper|pad/i,
  'engine & drivetrain':
    /engine|turbo|exhaust|spark\s*plug|intake|injector|differential|alternator|battery|intercooler|muffler|drivetrain|oil\s*filter|timing/i,
  'suspension & steering':
    /suspension|coilover|control\s*arm|lift\s*kit|strut|shock|sway\s*bar|steering|tie\s*rod|bumper/i,
  'oils, fluids & garage tools': /oil|fluid|coolant|tool|scanner|wrench|charger|synthetic/i,
};

function serializePart(doc: PartDocument) {
  return {
    id: String(doc._id),
    part: doc.part,
    make: doc.make,
    model: doc.model,
    year: doc.year,
    condition: doc.condition,
    description: doc.description || '',
    images: Array.isArray(doc.images) ? doc.images : [],
    price: doc.price,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function buildPartMatchCondition(partTypeOrName: string): FilterQuery<IPart> {
  const normalized = partTypeOrName.trim().toLowerCase();
  const categoryRegex = CATEGORY_REGEX_MAP[normalized];
  if (categoryRegex) {
    return {
      $or: [{ part: categoryRegex }, { description: categoryRegex }],
    };
  }

  const regex = new RegExp(escapeRegex(partTypeOrName.trim()), 'i');
  return {
    $or: [{ part: regex }, { description: regex }],
  };
}

export const searchParts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawQuery = typeof req.query.q === 'string'
      ? req.query.q
      : typeof req.query.query === 'string'
      ? req.query.query
      : '';
    const rawPartType = typeof req.query.partType === 'string'
      ? req.query.partType
      : typeof req.query.part === 'string'
      ? req.query.part
      : '';
    const rawMake = typeof req.query.make === 'string' ? req.query.make.trim() : '';
    const rawModel = typeof req.query.model === 'string' ? req.query.model.trim() : '';
    const rawYear = typeof req.query.year === 'string' ? req.query.year.trim() : '';
    const rawCondition = typeof req.query.condition === 'string' ? req.query.condition.trim() : '';

    const andConditions: FilterQuery<IPart>[] = [];

    if (rawPartType.trim()) {
      andConditions.push(buildPartMatchCondition(rawPartType));
    }

    if (rawQuery.trim()) {
      const qTrimmed = rawQuery.trim();
      const qRegex = new RegExp(escapeRegex(qTrimmed), 'i');
      const orClauses: FilterQuery<IPart>[] = [
        { part: qRegex },
        { description: qRegex },
        { make: qRegex },
        { model: qRegex },
      ];
      const maybeYear = Number(qTrimmed);
      if (Number.isInteger(maybeYear) && maybeYear >= 1900 && maybeYear <= 2100) {
        orClauses.push({ year: maybeYear });
      }
      andConditions.push({ $or: orClauses });
    }

    if (rawMake) {
      andConditions.push({
        make: new RegExp(`^${escapeRegex(rawMake)}$`, 'i'),
      });
    }

    if (rawModel) {
      andConditions.push({
        model: new RegExp(`^${escapeRegex(rawModel)}$`, 'i'),
      });
    }

    if (rawYear) {
      const parsedYear = Number(rawYear);
      if (Number.isInteger(parsedYear)) {
        andConditions.push({ year: parsedYear });
      }
    }

    if (rawCondition && ['new', 'refurbished', 'used'].includes(rawCondition.toLowerCase())) {
      andConditions.push({ condition: rawCondition.toLowerCase() });
    }

    const mongoFilter: FilterQuery<IPart> =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const [matchingDocs, totalInCollection] = await Promise.all([
      Part.find(mongoFilter).sort({ year: -1, createdAt: -1 }),
      Part.countDocuments(),
    ]);

    const parts = matchingDocs.map(serializePart);
    const existsInCollection = parts.length > 0;

    // When an exact multi-filter search returns 0 results, provide closely related parts from the DB collection
    let suggestions: ReturnType<typeof serializePart>[] = [];
    if (!existsInCollection && andConditions.length > 0) {
      const suggestionOr: FilterQuery<IPart>[] = [];
      if (rawMake && rawModel) {
        suggestionOr.push({
          make: new RegExp(`^${escapeRegex(rawMake)}$`, 'i'),
          model: new RegExp(`^${escapeRegex(rawModel)}$`, 'i'),
        });
      }
      if (rawMake) {
        suggestionOr.push({
          make: new RegExp(`^${escapeRegex(rawMake)}$`, 'i'),
        });
      }
      if (rawPartType.trim()) {
        suggestionOr.push(buildPartMatchCondition(rawPartType));
      }
      if (rawQuery.trim()) {
        const qRegex = new RegExp(escapeRegex(rawQuery.trim()), 'i');
        suggestionOr.push({ part: qRegex });
      }

      if (suggestionOr.length > 0) {
        const relatedDocs = await Part.find({ $or: suggestionOr })
          .sort({ year: -1 })
          .limit(4);
        suggestions = relatedDocs.map(serializePart);
      }
    }

    const message = existsInCollection
      ? `Found ${parts.length} matching part${parts.length === 1 ? '' : 's'} in the database parts collection.`
      : 'This part was not found in the database parts collection for the selected filters.';

    ApiResponse.success(
      res,
      {
        existsInCollection,
        count: parts.length,
        totalInCollection,
        filters: {
          q: rawQuery.trim() || undefined,
          partType: rawPartType.trim() || undefined,
          make: rawMake || undefined,
          model: rawModel || undefined,
          year: rawYear ? Number(rawYear) : undefined,
          condition: rawCondition || undefined,
        },
        parts,
        suggestions,
      },
      message
    );
  } catch (error) {
    next(error);
  }
};
