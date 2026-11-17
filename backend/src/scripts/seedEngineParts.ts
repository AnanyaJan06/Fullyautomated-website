import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { IPart, Part } from '../models/Part.model';
import { logger } from '../utils/logger';

type SeedEnginePart = Omit<IPart, 'createdAt' | 'updatedAt'>;

const engineImages = [
  '/images/parts/engine-template1.webp',
  '/images/parts/engine-template2.webp',
  '/images/parts/engine-template3.webp',
  '/images/parts/engine-assembly-1.svg',
];

const ENGINE_PARTS: SeedEnginePart[] = [
  {
    part: 'Toyota Camry Engine Long Block Assembly', partType: 'engine', make: 'Toyota', model: 'Camry', year: 2024,
    condition: 'refurbished', description: 'Inspected long block assembly with cylinder head, crankshaft, pistons, and timing components.', images: engineImages, price: 4200,
  },
  {
    part: 'Honda Accord Turbocharger Assembly', partType: 'engine', make: 'Honda', model: 'Accord', year: 2023,
    condition: 'new', description: 'Balanced turbocharger assembly with actuator, seals, and installation hardware.', images: engineImages, price: 1150,
  },
  {
    part: 'Ford F-150 Fuel Injector Set', partType: 'engine', make: 'Ford', model: 'F-150', year: 2022,
    condition: 'new', description: 'Flow-matched fuel injectors tested for spray pattern, pressure, and leak-down.', images: engineImages, price: 480,
  },
  {
    part: 'BMW 3 Series Performance Intake Manifold', partType: 'engine', make: 'BMW', model: '3 Series', year: 2021,
    condition: 'new', description: 'Aluminum intake manifold designed for consistent airflow and throttle response.', images: engineImages, price: 690,
  },
  {
    part: 'Chevrolet Silverado Engine Cylinder Head', partType: 'engine', make: 'Chevrolet', model: 'Silverado', year: 2020,
    condition: 'refurbished', description: 'Pressure-tested cylinder head with machined mating surface and inspected valves.', images: engineImages, price: 1350,
  },
  {
    part: 'Nissan Altima Piston and Ring Kit', partType: 'engine', make: 'Nissan', model: 'Altima', year: 2024,
    condition: 'new', description: 'Precision-matched piston and ring kit for an engine rebuild.', images: engineImages, price: 820,
  },
  {
    part: 'Hyundai Elantra Engine Camshaft Set', partType: 'engine', make: 'Hyundai', model: 'Elantra', year: 2023,
    condition: 'new', description: 'Hardened camshaft set with matched valve timing specifications.', images: engineImages, price: 740,
  },
  {
    part: 'Subaru Outback Engine Timing Kit', partType: 'engine', make: 'Subaru', model: 'Outback', year: 2022,
    condition: 'new', description: 'Timing service kit with chain, guides, tensioner, and required seals.', images: engineImages, price: 390,
  },
  {
    part: 'Mazda CX-5 Engine Oil Pump', partType: 'engine', make: 'Mazda', model: 'CX-5', year: 2021,
    condition: 'new', description: 'High-flow oil pump assembly built to maintain stable lubrication pressure.', images: engineImages, price: 260,
  },
  {
    part: 'Kia Sportage Engine Mount Set', partType: 'engine', make: 'Kia', model: 'Sportage', year: 2024,
    condition: 'new', description: 'Engine mount set designed to reduce drivetrain movement and vibration.', images: engineImages, price: 310,
  },
];

async function seedEngineParts(): Promise<void> {
  try {
    await connectDB();

    const result = await Part.bulkWrite(
      ENGINE_PARTS.map((item) => ({
        updateOne: {
          filter: { part: item.part, make: item.make, model: item.model, year: item.year },
          update: { $set: item },
          upsert: true,
        },
      })),
      { ordered: true },
    );

    logger.info(
      `Engine parts seed completed: ${result.upsertedCount} inserted, ${result.modifiedCount} updated (${ENGINE_PARTS.length} records targeted).`,
    );
  } catch (error) {
    logger.error('Failed to seed engine parts:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seedEngineParts();
