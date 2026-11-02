import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Part, IPart } from '../models/Part.model';
import { logger } from '../utils/logger';

type SeedPartItem = Omit<IPart, 'createdAt' | 'updatedAt'>;

export const FAKE_PARTS: SeedPartItem[] = [
  // BMW Parts
  {
    part: 'Brembo GT-R Drilled & Slotted Front Brake Rotor Set (380mm)',
    description:
      'High-carbon cast iron 380mm front brake rotors with cross-drilled and slotted ventilation for superior heat dissipation and fade-free stopping power.',
    year: 2024,
    make: 'BMW',
    model: 'M3 Competition',
    price: 349.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Matrix Pro Bi-LED Projector Headlight Assembly (Pair)',
    description:
      'Direct plug-and-play 6000K diamond white Bi-LED adaptive projector headlight assemblies with sequential amber turn signals and DRL light tubes.',
    year: 2023,
    make: 'BMW',
    model: '3 Series (G20)',
    price: 589.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Bilstein B16 PSS10 Ride Height Adjustable Coilover Kit',
    description:
      '10-stage manually adjustable damping coilover system with monotube gas pressure construction and threaded body for precise ride height tuning.',
    year: 2022,
    make: 'BMW',
    model: '5 Series (G30)',
    price: 1490.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'OEM M-Sport Adaptive Air Suspension Compressor Pump',
    description:
      'Factory-remanufactured air suspension compressor unit with integrated valve block and thermal overload protection, pressure-tested to OEM specs.',
    year: 2021,
    make: 'BMW',
    model: 'X5 M-Sport',
    price: 425.5,
    condition: 'refurbished',
    images: [
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Akrapovič Evolution Line Titanium Cat-Back Exhaust',
    description:
      'Ultra-lightweight titanium exhaust system featuring carbon fiber tailpipes, precision TIG welds, and dyno-proven +14.2 HP performance gains.',
    year: 2025,
    make: 'BMW',
    model: 'M3 Competition',
    price: 2190.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // Mercedes-Benz Parts
  {
    part: 'Ceramic Low-Dust Front & Rear Brake Pad Set',
    description:
      'Chamfered and slotted carbon-ceramic brake pads engineered for quiet braking, ultra-low brake dust, and extended rotor life.',
    year: 2024,
    make: 'Mercedes-Benz',
    model: 'C-Class (W206)',
    price: 129.99,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'BorgWarner Twin-Scroll Turbocharger Assembly',
    description:
      'Remanufactured OEM twin-scroll turbocharger balanced on a high-speed VSR machine with new bearings, seals, and electronic wastegate actuator.',
    year: 2021,
    make: 'Mercedes-Benz',
    model: 'E-Class',
    price: 895.0,
    condition: 'refurbished',
    images: [
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Michelin Pilot Sport 4S Performance Tire 295/30ZR20',
    description:
      'Ultra-high performance summer tire featuring bi-compound tread technology and aramid-nylon hybrid belt for exceptional dry and wet grip.',
    year: 2023,
    make: 'Mercedes-Benz',
    model: 'AMG GT',
    price: 384.5,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Heavy-Duty Forged Aluminum Lower Control Arm Set',
    description:
      'Front left and right forged aluminum lower control arms pre-fitted with hydraulic rubber bushings and sealed ball joints.',
    year: 2022,
    make: 'Mercedes-Benz',
    model: 'GLE 450',
    price: 310.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Multibeam LED Right Front Headlamp Module',
    description:
      'Genuine low-mileage used Multibeam LED right-side headlight housing with intact mounting tabs and clear polycarbonate lens.',
    year: 2020,
    make: 'Mercedes-Benz',
    model: 'E-Class',
    price: 460.0,
    condition: 'used',
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // Audi Parts
  {
    part: 'NGK Laser Iridium High-Ignitability Spark Plugs (Set of 6)',
    description:
      'Fine-wire iridium center electrode and platinum ground electrode spark plugs pre-gapped for high-boost turbocharged direct-injection engines.',
    year: 2024,
    make: 'Audi',
    model: 'RS5 Sportback',
    price: 84.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Carbon Fiber Closed-Box Cold Air Intake System',
    description:
      'High-flow pleated cotton air filter enclosed in a gloss autoclaved carbon fiber airbox, increasing airflow by 34% over the stock intake.',
    year: 2023,
    make: 'Audi',
    model: 'A4 Quattro',
    price: 499.95,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Bosch High-Pressure Common Rail Fuel Injector Set',
    description:
      'Flow-matched and ultrasonically cleaned diesel common-rail piezo fuel injectors with new copper crush washers and O-ring seals.',
    year: 2019,
    make: 'Audi',
    model: 'Q7 TDI',
    price: 640.0,
    condition: 'refurbished',
    images: [
      'https://images.unsplash.com/photo-1541348263662-e068662d82af?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'OLED Matrix Dynamic Sequential Tail Light Assembly',
    description:
      'Complete inner and outer rear LED tail lamp set with dynamic sweeping indicator animation and rear fog lamp integration.',
    year: 2022,
    make: 'Audi',
    model: 'A6 Avant',
    price: 520.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Quattro Rear Sport Differential Electronic Control Unit',
    description:
      'Tested OEM rear sport differential control module removed from a donor vehicle with 18,000 miles, ready for coding.',
    year: 2021,
    make: 'Audi',
    model: 'RS5 Sportback',
    price: 275.0,
    condition: 'used',
    images: [
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // Toyota Parts
  {
    part: 'HKS Super Turbo Muffler Dual Titanium Tip Exhaust',
    description:
      'Mandrel-bent SUS304 stainless steel cat-back exhaust with anodized titanium dual tips engineered for low backpressure and deep exhaust note.',
    year: 2024,
    make: 'Toyota',
    model: 'Supra GR',
    price: 1680.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Old Man Emu Nitrocharger Sport 2-Inch Suspension Lift Kit',
    description:
      'Complete off-road 4x4 suspension lift kit including heavy-duty coil springs, twin-tube nitrogen gas shocks, and greasable leaf shackles.',
    year: 2023,
    make: 'Toyota',
    model: 'Hilux 4x4',
    price: 1245.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'TRD Red Performance Front Strut Tower Brace',
    description:
      'Lightweight tig-welded aluminum front strut tie bar with powder-coated TRD red finish that reduces chassis flex during hard cornering.',
    year: 2022,
    make: 'Toyota',
    model: 'Camry TRD',
    price: 215.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Denso 180-Amp Heavy-Duty Brushless Alternator',
    description:
      'Remanufactured Denso high-output 180A alternator with new voltage regulator, rectifier bridge, and sealed Japanese NSK bearings.',
    year: 2020,
    make: 'Toyota',
    model: 'Land Cruiser',
    price: 289.99,
    condition: 'refurbished',
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Forged Monoblock 19x9.5 Matte Bronze Alloy Wheel Set',
    description:
      'Flow-formed lightweight alloy wheels in 5x112 bolt pattern with TPMS sensor compatibility and scratch-resistant matte bronze clear coat.',
    year: 2025,
    make: 'Toyota',
    model: 'Supra GR',
    price: 1360.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?auto=format&fit=crop&w=800&q=80',
    ],
  },

  // Ford Parts
  {
    part: 'FOX 3.0 Internal Bypass Live Valve Coilover Shock Pair',
    description:
      'Factory-rebuilt FOX Racing Shox 3.0-inch internal bypass front coilovers with fresh PTFE-lined spherical bearings and high-viscosity damper fluid.',
    year: 2023,
    make: 'Ford',
    model: 'F-150 Raptor',
    price: 1599.0,
    condition: 'refurbished',
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Borla ATAK Active Valve Quad-Tip Stainless Cat-Back Exhaust',
    description:
      'T-304 austenitic stainless steel exhaust retaining factory active exhaust valve functionality with aggressive ATAK acoustic tuning.',
    year: 2024,
    make: 'Ford',
    model: 'Mustang GT',
    price: 1849.99,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1584345604476-8ec5e12e42dd?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Optima RedTop 8020-164 35 AGM High-CCA Starting Battery',
    description:
      'Spill-proof SpiralCell AGM automotive battery delivering 720 Cold Cranking Amps and 15x greater vibration resistance for off-road rigs.',
    year: 2024,
    make: 'Ford',
    model: 'Bronco Wildtrak',
    price: 249.99,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Mishimoto Bar-and-Plate Front Mount Intercooler Kit',
    description:
      'Direct-fit silver aluminum front-mount intercooler that lowers intake air temperatures by 38°F and supports up to 550 WHP.',
    year: 2018,
    make: 'Ford',
    model: 'Focus ST',
    price: 539.0,
    condition: 'new',
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    part: 'Heavy-Duty Steel Modular Front Off-Road Winch Bumper',
    description:
      'Used OEM heavy-duty modular steel front bash bumper with integrated D-ring recovery shackle mounts and sensor cutouts in clean condition.',
    year: 2022,
    make: 'Ford',
    model: 'Bronco Wildtrak',
    price: 620.0,
    condition: 'used',
    images: [
      'https://images.unsplash.com/photo-1612544448445-b8232cff3b6c?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

async function seedParts(): Promise<void> {
  const shouldReset = process.argv.includes('--reset');

  try {
    await connectDB();

    if (shouldReset) {
      const deleted = await Part.deleteMany({});
      logger.info(`Cleared ${deleted.deletedCount} existing part documents.`);
    }

    const operations = FAKE_PARTS.map((item) => ({
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
      `Parts seed completed: ${result.upsertedCount} inserted, ${result.modifiedCount} updated, ${totalCount} total parts in database.`
    );
  } catch (error) {
    logger.error('Failed to seed fake parts:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedParts();
