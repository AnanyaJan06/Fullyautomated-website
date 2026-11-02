import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Part } from '../models/Part.model';
import { classifyPartType } from '../utils/partType';
import { logger } from '../utils/logger';

async function migratePartTypes(): Promise<void> {
  try {
    await connectDB();
    const legacyParts = await Part.find({ partType: { $exists: false } })
      .select('_id part description')
      .lean();

    if (legacyParts.length === 0) {
      logger.info('Part type migration skipped: every part already has a partType.');
      return;
    }

    const classifiableParts = legacyParts.flatMap((part) => {
      const partType = classifyPartType(part.part, part.description);
      return partType ? [{ part, partType }] : [];
    });
    const unmatchedIds = legacyParts
      .filter((part) => !classifyPartType(part.part, part.description))
      .map((part) => part._id);

    const operations = classifiableParts.map(({ part, partType }) => ({
      updateOne: {
        filter: { _id: part._id, partType: { $exists: false } },
        update: { $set: { partType } },
      },
    }));
    const result = operations.length > 0
      ? await Part.bulkWrite(operations, { ordered: false })
      : { modifiedCount: 0 };
    const removed = unmatchedIds.length > 0
      ? await Part.deleteMany({ _id: { $in: unmatchedIds }, partType: { $exists: false } })
      : { deletedCount: 0 };

    logger.info(
      `Part type migration completed: ${result.modifiedCount} legacy records classified and ${removed.deletedCount} unclassifiable records removed.`
    );
  } catch (error) {
    logger.error('Failed to migrate part types:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void migratePartTypes();
