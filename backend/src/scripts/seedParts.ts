import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Part, IPart } from '../models/Part.model';
import { logger } from '../utils/logger';

type SeedPartItem = Omit<IPart, 'createdAt' | 'updatedAt' | 'partType'>;

const ENGINE_PRODUCTS = [
  ['Engine Long Block Assembly', 'Complete remanufactured long block with inspected cylinder head, crankshaft, pistons, and timing components.', 4200],
  ['Turbocharger Assembly', 'Balanced turbocharger assembly with upgraded bearings, actuator, seals, and installation hardware.', 1150],
  ['Fuel Injector Set', 'Flow-matched direct injection fuel injectors tested for spray pattern, pressure, and leak-down.', 480],
  ['Performance Intake Manifold', 'Aluminum intake manifold designed for consistent airflow and improved throttle response.', 690],
  ['Engine Cylinder Head', 'Pressure-tested cylinder head with machined mating surface and inspected valves and guides.', 1350],
  ['Piston and Ring Kit', 'Forged piston set with precision-matched rings for a complete engine rebuild.', 820],
  ['Engine Camshaft Set', 'Performance camshaft set with hardened lobes and matched valve timing specifications.', 740],
  ['Engine Timing Kit', 'Complete timing service kit with chain, guides, tensioner, and required seals.', 390],
  ['Engine Oil Pump', 'New high-flow oil pump assembly built to maintain stable lubrication pressure.', 260],
  ['Engine Mount Set', 'Reinforced engine mount set designed to reduce movement while limiting cabin vibration.', 310],
] as const;

const TRANSMISSION_PRODUCTS = [
  ['Automatic Transmission Assembly', 'Inspected automatic transmission assembly with tested solenoids and verified shift operation.', 3650],
  ['Manual Transmission Gearbox', 'Rebuilt manual gearbox with inspected synchronizers, bearings, and gear teeth.', 2850],
  ['Clutch and Flywheel Kit', 'Matched clutch disc, pressure plate, release bearing, and balanced flywheel kit.', 780],
  ['Torque Converter Assembly', 'Remanufactured torque converter with new internal seals and stall-speed testing.', 620],
  ['Transmission Valve Body', 'Tested valve body assembly with cleaned passages and inspected shift-control valves.', 540],
  ['Transmission Solenoid Set', 'Replacement solenoid set electrically tested for reliable transmission control.', 290],
  ['Transmission Gear Set', 'Precision-machined replacement gear set with matched ratios and installation hardware.', 890],
  ['Transmission Oil Pump', 'Replacement transmission oil pump assembly pressure-tested for consistent fluid delivery.', 340],
  ['Transmission Rebuild Kit', 'Overhaul kit with friction plates, steel plates, seals, gaskets, and filter.', 520],
  ['Transmission Control Module', 'Vehicle-matched transmission control module tested for communication and shift logic.', 460],
] as const;

const VEHICLES = [
  { make: 'Toyota', model: 'Camry', year: 2024 },
  { make: 'Honda', model: 'Accord', year: 2023 },
  { make: 'Ford', model: 'F-150', year: 2022 },
  { make: 'BMW', model: '3 Series', year: 2021 },
  { make: 'Chevrolet', model: 'Silverado', year: 2020 },
] as const;

const ENGINE_IMAGE_GALLERY = [
  '/images/parts/engine-assembly-1.svg',
  '/images/parts/engine-assembly-2.svg',
  '/images/parts/engine-assembly-3.svg',
  '/images/gearup-hero-1.webp',
] as const;

const TRANSMISSION_IMAGE_GALLERY = [
  '/images/parts/transmission-assembly-1.svg',
  '/images/parts/transmission-assembly-2.svg',
  '/images/parts/transmission-assembly-3.svg',
  '/images/gearup-hero-2.webp',
] as const;

function buildPartImages(gallery: readonly string[], offset: number): string[] {
  return gallery.map((_, index) => gallery[(index + offset) % gallery.length]);
}

const GENERATED_PARTS: (SeedPartItem & { partType: 'engine' | 'transmission' })[] = [
  ...ENGINE_PRODUCTS.flatMap(([name, description, price], productIndex) =>
    VEHICLES.map((vehicle, vehicleIndex) => ({
      part: `${vehicle.make} ${vehicle.model} ${name}`,
      partType: 'engine' as const,
      description,
      year: vehicle.year - (productIndex % 3),
      make: vehicle.make,
      model: vehicle.model,
      price: price + vehicleIndex * 25,
      condition: productIndex % 4 === 0 ? 'refurbished' as const : 'new' as const,
      images: buildPartImages(ENGINE_IMAGE_GALLERY, productIndex + vehicleIndex),
    }))
  ),
  ...TRANSMISSION_PRODUCTS.flatMap(([name, description, price], productIndex) =>
    VEHICLES.map((vehicle, vehicleIndex) => ({
      part: `${vehicle.make} ${vehicle.model} ${name}`,
      partType: 'transmission' as const,
      description,
      year: vehicle.year - (productIndex % 3),
      make: vehicle.make,
      model: vehicle.model,
      price: price + vehicleIndex * 25,
      condition: productIndex % 4 === 0 ? 'refurbished' as const : 'new' as const,
      images: buildPartImages(TRANSMISSION_IMAGE_GALLERY, productIndex + vehicleIndex),
    }))
  ),
];

async function seedParts(): Promise<void> {
  const shouldReset = process.argv.includes('--reset');

  try {
    await connectDB();

    if (shouldReset) {
      const deleted = await Part.deleteMany({});
      logger.info(`Cleared ${deleted.deletedCount} existing part documents.`);
    }

    const removedOtherParts = await Part.deleteMany({ partType: { $nin: ['engine', 'transmission'] } });
    const operations = GENERATED_PARTS.map((item) => ({
      updateOne: {
        filter: {
          part: item.part,
          make: item.make,
          model: item.model,
          year: item.year,
        },
        update: { $set: item },
        upsert: true,
      },
    }));

    const result = await Part.bulkWrite(operations, { ordered: false });
    const totalCount = await Part.countDocuments();

    logger.info(
      `Parts seed completed: ${result.upsertedCount} inserted, ${result.modifiedCount} updated, ${removedOtherParts.deletedCount} non-engine/transmission records removed, ${totalCount} engine/transmission parts in database (${GENERATED_PARTS.length} generated).`
    );
  } catch (error) {
    logger.error('Failed to seed fake parts:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedParts();
