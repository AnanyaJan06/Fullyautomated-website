import { Request, Response, NextFunction } from 'express';
import { FilterQuery } from 'mongoose';
import { Part, IPart, PartType } from '../models/Part.model';
import { ApiResponse } from '../utils/ApiResponse';

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 24;
const MAX_PAGE_NUMBER = 10_000;
const MAX_SEARCH_LENGTH = 100;
const PART_FIELDS = 'part partType make model year condition description images price createdAt updatedAt';
type PartSearchDocument = Pick<
  IPart,
  'part' | 'partType' | 'make' | 'model' | 'year' | 'condition' | 'description' | 'images' | 'price' | 'createdAt' | 'updatedAt'
> & { _id: unknown };

const SEARCHABLE_PART_TYPES = ['engine', 'transmission'] as const;

const DEFAULT_PART_IMAGES: Record<PartType, string[]> = {
  engine: [
    '/images/parts/engine-assembly-1.svg',
    '/images/parts/engine-assembly-2.svg',
    '/images/parts/engine-assembly-3.svg',
    '/images/gearup-hero-1.webp',
  ],
  transmission: [
    '/images/parts/transmission-assembly-1.svg',
    '/images/parts/transmission-assembly-2.svg',
    '/images/parts/transmission-assembly-3.svg',
    '/images/gearup-hero-2.webp',
  ],
};

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resolvePartImages(doc: PartSearchDocument): string[] {
  const validImages = Array.isArray(doc.images)
    ? doc.images.map((img) => (typeof img === 'string' ? img.trim() : '')).filter(Boolean)
    : [];

  if (validImages.length > 0) {
    return validImages;
  }

  return DEFAULT_PART_IMAGES[doc.partType] ?? DEFAULT_PART_IMAGES.engine;
}

function serializePart(doc: PartSearchDocument) {
  return {
    id: String(doc._id),
    part: doc.part,
    partType: doc.partType,
    make: doc.make,
    model: doc.model,
    year: doc.year,
    condition: doc.condition,
    description: doc.description || '',
    images: resolvePartImages(doc),
    price: doc.price,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export const getPartSearchOptions = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const readParam = (key: string): string | null => {
      const value = req.query[key];
      if (value === undefined) return '';
      return typeof value === 'string' ? value.trim() : null;
    };

    const rawPartType = readParam('partType');
    const rawMake = readParam('make');
    const rawModel = readParam('model');
    if (rawPartType === null || rawMake === null || rawModel === null) {
      ApiResponse.error(res, 'Search option parameters must each be a single string value.', 400);
      return;
    }

    if (!(SEARCHABLE_PART_TYPES as readonly string[]).includes(rawPartType)) {
      ApiResponse.error(res, 'Part type must be engine or transmission.', 400);
      return;
    }
    if ([rawMake, rawModel].some((value) => value.length > MAX_SEARCH_LENGTH)) {
      ApiResponse.error(res, `Search filters cannot exceed ${MAX_SEARCH_LENGTH} characters.`, 400);
      return;
    }
    if (rawModel && !rawMake) {
      ApiResponse.error(res, 'Select a make before requesting models or years.', 400);
      return;
    }

    const partType = rawPartType as PartType;
    const makeFilter = rawMake ? { $regex: `^${escapeRegex(rawMake)}$`, $options: 'i' } : undefined;
    const modelFilter = rawModel ? { $regex: `^${escapeRegex(rawModel)}$`, $options: 'i' } : undefined;
    const [makes, models, years] = await Promise.all([
      Part.distinct('make', { partType }),
      rawMake ? Part.distinct('model', { partType, make: makeFilter }) : Promise.resolve([]),
      rawModel
        ? Part.distinct('year', { partType, make: makeFilter, model: modelFilter })
        : Promise.resolve([]),
    ]);

    ApiResponse.success(res, {
      makes: (makes as string[]).sort((a, b) => a.localeCompare(b)),
      models: (models as string[]).sort((a, b) => a.localeCompare(b)),
      years: (years as number[]).sort((a, b) => b - a),
    }, 'Available vehicle options loaded.');
  } catch (error) {
    next(error);
  }
};

export const searchParts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const getParam = (primary: string, alias?: string): string | null => {
      const value = req.query[primary] ?? (alias ? req.query[alias] : undefined);
      if (value === undefined) return '';
      return typeof value === 'string' ? value.trim() : null;
    };

    const rawPartType = getParam('partType');
    const rawMake = getParam('make');
    const rawModel = getParam('model');
    const rawYear = getParam('year');
    const rawCondition = getParam('condition');
    const rawPage = getParam('page');
    const rawLimit = getParam('limit');
    const values = [rawPartType, rawMake, rawModel, rawYear, rawCondition, rawPage, rawLimit];

    if (values.some((value) => value === null)) {
      ApiResponse.error(res, 'Search parameters must each be a single string value.', 400);
      return;
    }

    const partType = rawPartType as string;
    const make = rawMake as string;
    const model = rawModel as string;
    const year = rawYear as string;
    const condition = rawCondition as string;
    const pageValue = rawPage as string;
    const limitValue = rawLimit as string;

    if ([partType, make, model, year, condition].some((value) => value.length > MAX_SEARCH_LENGTH)) {
      ApiResponse.error(res, `Search filters cannot exceed ${MAX_SEARCH_LENGTH} characters.`, 400);
      return;
    }

    if (!(SEARCHABLE_PART_TYPES as readonly string[]).includes(partType)) {
      ApiResponse.error(res, 'Part type must be engine or transmission.', 400);
      return;
    }

    const page = pageValue ? Number(pageValue) : 1;
    const requestedLimit = limitValue ? Number(limitValue) : DEFAULT_PAGE_SIZE;
    if (!Number.isSafeInteger(page) || page < 1 || page > MAX_PAGE_NUMBER) {
      ApiResponse.error(res, `Page must be an integer between 1 and ${MAX_PAGE_NUMBER}.`, 400);
      return;
    }
    if (!Number.isSafeInteger(requestedLimit) || requestedLimit < 1) {
      ApiResponse.error(res, 'Limit must be a positive integer.', 400);
      return;
    }
    const pageSize = Math.min(requestedLimit, MAX_PAGE_SIZE);

    let parsedYear: number | undefined;
    if (year) {
      parsedYear = Number(year);
      if (!Number.isInteger(parsedYear) || parsedYear < 1886 || parsedYear > 2100) {
        ApiResponse.error(res, 'Year must be a whole number between 1886 and 2100.', 400);
        return;
      }
    }

    const normalizedCondition = condition.toLowerCase();
    if (condition && !['new', 'refurbished', 'used'].includes(normalizedCondition)) {
      ApiResponse.error(res, 'Condition must be new, refurbished, or used.', 400);
      return;
    }

    const andConditions: FilterQuery<IPart>[] = [];

    andConditions.push({ partType: partType as PartType });

    if (make) {
      andConditions.push({
        make: { $regex: `^${escapeRegex(make)}$`, $options: 'i' },
      });
    }

    if (model) {
      andConditions.push({
        model: { $regex: `^${escapeRegex(model)}$`, $options: 'i' },
      });
    }

    if (parsedYear !== undefined) {
      andConditions.push({ year: parsedYear });
    }

    if (normalizedCondition) {
      andConditions.push({ condition: normalizedCondition });
    }

    const mongoFilter: FilterQuery<IPart> =
      andConditions.length > 0 ? { $and: andConditions } : {};

    const totalMatchesQuery = andConditions.length === 0
      ? Promise.resolve<number | null>(null)
      : Part.countDocuments(mongoFilter);
    const [matchingDocs, totalInCollection, filteredCount] = await Promise.all([
      Part.find(mongoFilter)
        .select(PART_FIELDS)
        .sort({ year: -1, createdAt: -1, _id: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize + 1)
        .lean(),
      Part.estimatedDocumentCount(),
      totalMatchesQuery,
    ]);

    const hasNextPage = matchingDocs.length > pageSize;
    const parts = matchingDocs.slice(0, pageSize).map(serializePart);
    const totalMatches = filteredCount ?? totalInCollection;
    const existsInCollection = totalMatches > 0;

    // When an exact multi-filter search returns 0 results, provide closely related parts from the DB collection
    let suggestions: ReturnType<typeof serializePart>[] = [];
    if (!existsInCollection && andConditions.length > 0) {
      const suggestionOr: FilterQuery<IPart>[] = [];
      if (make && model) {
        suggestionOr.push({
          make: { $regex: `^${escapeRegex(make)}$`, $options: 'i' },
          model: { $regex: `^${escapeRegex(model)}$`, $options: 'i' },
        });
      }
      if (make) {
        suggestionOr.push({
          make: { $regex: `^${escapeRegex(make)}$`, $options: 'i' },
        });
      }

      if (suggestionOr.length > 0) {
        const relatedDocs = await Part.find({
          partType: partType as PartType,
          $or: suggestionOr,
        })
          .select(PART_FIELDS)
          .sort({ year: -1 })
          .limit(4)
          .lean();
        suggestions = relatedDocs.map(serializePart);
      }
    }

    const message = existsInCollection
      ? `Found ${totalMatches} matching part${totalMatches === 1 ? '' : 's'} in the database parts collection.`
      : 'This part was not found in the database parts collection for the selected filters.';

    ApiResponse.success(
      res,
      {
        existsInCollection,
        count: totalMatches,
        countIsEstimate: andConditions.length === 0,
        totalInCollection,
        filters: {
          partType,
          make: make || undefined,
          model: model || undefined,
          year: parsedYear,
          condition: normalizedCondition || undefined,
        },
        pagination: {
          page,
          pageSize,
          hasNextPage,
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
