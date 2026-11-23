import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Part } from '../models/Part.model';
import { logger } from '../utils/logger';

const DESCRIPTIONS = {
  transmission: "Used transmissions offer a reliable and budget-friendly alternative to remanufactured units. Sourced from previously operated vehicles, these transmissions provide a cost-effective replacement solution for customers looking to restore their vehicle's performance without the higher cost of a remanufactured unit.\n\nOur used transmissions typically include the transmission case, internal hard parts, and valve body. External bolt-on accessories, sensors, and other components may not be included and are not guaranteed or warrantied. Depending on the application, your mechanic may need to transfer certain components from your original transmission to ensure proper fitment and installation. Please review our pre-installation checklist before proceeding with installation.",
  engine: "Used engines offer a reliable and budget-friendly alternative to remanufactured units. Sourced from previously operated vehicles, these engines provide a cost-effective replacement solution for customers looking to restore their vehicle's performance without the higher expense of a remanufactured engine.\n\nOur used engines typically include the engine block, cylinder head, and internal components. External accessories, sensors, wiring, and other bolt-on components may not be included and are not guaranteed or warrantied. Depending on the vehicle application, your mechanic may need to transfer certain components from your original engine to ensure proper fitment and installation. Please review our pre-installation checklist before proceeding with installation.",
} as const;

async function migratePartDescriptions(): Promise<void> {
  try {
    await connectDB();

    const [engineResult, transmissionResult] = await Promise.all([
      Part.updateMany({ partType: 'engine' }, { $set: { description: DESCRIPTIONS.engine } }),
      Part.updateMany({ partType: 'transmission' }, { $set: { description: DESCRIPTIONS.transmission } }),
    ]);

    logger.info(
      `Part description migration completed: ${engineResult.matchedCount} engines matched (${engineResult.modifiedCount} updated), ${transmissionResult.matchedCount} transmissions matched (${transmissionResult.modifiedCount} updated).`
    );
  } catch (error) {
    logger.error('Failed to migrate part descriptions:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void migratePartDescriptions();
