export interface CategoryItem {
  id: string;
  name: string;
  slug: 'engine' | 'transmission';
  badge: string;
  description: string;
  itemCount: string;
  subcategories: string[];
  highlights: string[];
  icon: string;
}

export interface ProductItem {
  id: string;
  title: string;
  sku: string;
  category: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount?: number;
  SoldCount?: number;
  badge?: 'HOT' | 'SALE' | 'NEW';
  tabCategory: ('featured' | 'bestseller' | 'onsale')[];
  specs: string[];
  images: string[];
  imageColor: string;
  iconType: 'brake' | 'headlight' | 'tire' | 'battery' | 'oil' | 'suspension' | 'spark' | 'exhaust';
}

export const VEHICLE_YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018'];
export const VEHICLE_MAKES: Record<string, string[]> = {
  BMW: ['3 Series (G20)', '5 Series (G30)', 'M3 Competition', 'X5 M-Sport'],
  'Mercedes-Benz': ['C-Class (W206)', 'E-Class', 'AMG GT', 'GLE 450'],
  Audi: ['A4 Quattro', 'A6 Avant', 'RS5 Sportback', 'Q7 TDI'],
  Toyota: ['Supra GR', 'Camry TRD', 'Hilux 4x4', 'Land Cruiser'],
  Ford: ['Mustang GT', 'F-150 Raptor', 'Bronco Wildtrak', 'Focus ST'],
};
export const VEHICLE_ENGINES = [
  '2.0L Turbo Inline-4',
  '3.0L Twin-Turbo V6',
  '4.0L Bi-Turbo V8',
  '2.5L Hybrid EcoBoost',
  '3.5L EcoBoost V6',
];

export const GEARUP_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-engine',
    name: 'Engine',
    slug: 'engine',
    badge: 'Complete Assemblies & Core Units',
    description:
      'OEM-verified complete engine assemblies, long blocks, turbo powertrains, and tested replacement motors ready for direct vehicle fitment.',
    itemCount: 'OEM & Tested Units',
    subcategories: [
      'Complete Engine Assemblies',
      'Turbocharged & Naturally Aspirated Blocks',
      'Cylinder Heads & Valvetrain Units',
      'Direct-Fit OEM Replacement Motors',
      'Performance & Reconditioned Engines',
    ],
    highlights: ['Compression & Leak-Down Tested', 'VIN Fitment Verified', 'Warranty Backed'],
    icon: '⚙️',
  },
  {
    id: 'cat-transmission',
    name: 'Transmission',
    slug: 'transmission',
    badge: 'Automatic, Manual & AWD Gearboxes',
    description:
      'Precision-inspected automatic, manual, CVT, and dual-clutch transmission assemblies engineered for smooth shifting and long-haul reliability.',
    itemCount: 'Direct-Fit Gearboxes',
    subcategories: [
      'Automatic Transmission Assemblies',
      'Manual & Dual-Clutch Gearboxes',
      'CVT & AWD Transfer Case Units',
      'Torque Converters & Valve Bodies',
      'Refurbished & Low-Mileage Transmissions',
    ],
    highlights: ['Shift & Pressure Tested', 'Exact OEM Gear Ratios', 'Ready to Install'],
    icon: '🔧',
  },
];

export const GEARUP_PRODUCTS: ProductItem[] = [
  {
    id: 'prod-1',
    title: 'Brembo GT-R Drilled & Slotted Front Brake Rotor Set (380mm)',
    sku: 'BRM-9084-GT',
    category: 'Brake Systems',
    price: 349.0,
    originalPrice: 429.0,
    discountPercent: 19,
    rating: 4.9,
    reviewsCount: 38,
    inStock: true,
    stockCount: 14,
    SoldCount: 46,
    badge: 'SALE',
    tabCategory: ['featured', 'bestseller', 'onsale'],
    specs: ['Fitment: Direct OEM Replacement', 'Material: High-Carbon Cast Iron'],
    images: [
      '/images/gearup-hero-2.webp',
      '/images/gearup-hero-1.webp',
      '/images/parts/engine-assembly-3.svg',
    ],
    imageColor: 'from-red-50 to-slate-100',
    iconType: 'brake',
  },
  {
    id: 'prod-2',
    title: 'Matrix Pro Bi-LED Projector Headlight Assembly (Pair)',
    sku: 'LGT-4420-LED',
    category: 'Headlights & Lighting',
    price: 589.0,
    originalPrice: 699.0,
    discountPercent: 16,
    rating: 4.8,
    reviewsCount: 24,
    inStock: true,
    stockCount: 9,
    SoldCount: 31,
    badge: 'HOT',
    tabCategory: ['featured', 'bestseller'],
    specs: ['Color Temp: 6000K Diamond White', 'Plug & Play Harness Included'],
    images: [
      '/images/gearup-hero-1.webp',
      '/images/parts/transmission-assembly-3.svg',
      '/images/gearup-hero-2.webp',
    ],
    imageColor: 'from-blue-50 to-slate-100',
    iconType: 'headlight',
  },
  {
    id: 'prod-3',
    title: 'Michelin Pilot Sport 4S Ultra-High Performance Tire 255/35ZR19',
    sku: 'TIR-25535-PS4',
    category: 'Tires & Wheels',
    price: 274.5,
    originalPrice: 315.0,
    discountPercent: 13,
    rating: 5.0,
    reviewsCount: 64,
    inStock: true,
    stockCount: 22,
    SoldCount: 88,
    badge: 'SALE',
    tabCategory: ['featured', 'bestseller', 'onsale'],
    specs: ['Speed Rating: Y (186 mph)', 'Dynamic Response Technology'],
    images: [
      '/images/gearup-hero-1.webp',
      '/images/gearup-hero-2.webp',
      '/images/parts/transmission-assembly-2.svg',
    ],
    imageColor: 'from-zinc-100 to-slate-200',
    iconType: 'tire',
  },
  {
    id: 'prod-4',
    title: 'Liqui Moly Leichtlauf High Tech 5W-40 Full Synthetic Motor Oil (5L)',
    sku: 'OIL-LM-5W40',
    category: 'Oils, Fluids & Garage Tools',
    price: 54.99,
    originalPrice: 68.0,
    discountPercent: 19,
    rating: 4.9,
    reviewsCount: 112,
    inStock: true,
    stockCount: 45,
    SoldCount: 140,
    badge: 'HOT',
    tabCategory: ['bestseller', 'onsale'],
    specs: ['Made in Germany', 'OEM Approved: BMW LL-01 / MB 229.5'],
    images: [
      '/images/parts/engine-assembly-1.svg',
      '/images/parts/engine-assembly-3.svg',
      '/images/gearup-hero-1.webp',
    ],
    imageColor: 'from-amber-50 to-orange-100',
    iconType: 'oil',
  },
  {
    id: 'prod-5',
    title: 'Bilstein B16 PSS10 Ride Height Adjustable Coilover Suspension Kit',
    sku: 'SUS-BIL-B16',
    category: 'Suspension & Steering',
    price: 1490.0,
    originalPrice: 1750.0,
    discountPercent: 15,
    rating: 4.7,
    reviewsCount: 19,
    inStock: true,
    stockCount: 5,
    SoldCount: 18,
    badge: 'NEW',
    tabCategory: ['featured', 'onsale'],
    specs: ['10-Stage Damping Adjustment', 'Monotube Gas Pressure Design'],
    images: [
      '/images/parts/transmission-assembly-1.svg',
      '/images/parts/transmission-assembly-2.svg',
      '/images/gearup-hero-2.webp',
    ],
    imageColor: 'from-yellow-50 to-slate-100',
    iconType: 'suspension',
  },
  {
    id: 'prod-6',
    title: 'Optima RedTop 8020-164 35 AGM High-CCA Starting Automotive Battery',
    sku: 'BAT-OPT-35R',
    category: 'Engine & Drivetrain',
    price: 249.99,
    originalPrice: 289.99,
    discountPercent: 14,
    rating: 4.8,
    reviewsCount: 53,
    inStock: true,
    stockCount: 12,
    SoldCount: 42,
    badge: 'SALE',
    tabCategory: ['featured', 'bestseller', 'onsale'],
    specs: ['Cold Cranking Amps: 720 CCA', 'Spill-Proof SpiralCell AGM'],
    images: [
      '/images/parts/engine-assembly-2.svg',
      '/images/parts/engine-assembly-1.svg',
      '/images/parts/engine-assembly-3.svg',
    ],
    imageColor: 'from-rose-50 to-zinc-100',
    iconType: 'battery',
  },
  {
    id: 'prod-7',
    title: 'NGK Laser Iridium High-Ignitability Spark Plugs (Set of 6)',
    sku: 'ENG-NGK-97506',
    category: 'Engine & Drivetrain',
    price: 84.0,
    originalPrice: 99.0,
    discountPercent: 15,
    rating: 4.9,
    reviewsCount: 77,
    inStock: true,
    stockCount: 30,
    SoldCount: 95,
    badge: 'HOT',
    tabCategory: ['bestseller'],
    specs: ['Fine Wire Center Electrode', 'Pre-Gapped for Turbo Engines'],
    images: [
      '/images/parts/engine-assembly-3.svg',
      '/images/parts/engine-assembly-1.svg',
      '/images/parts/engine-assembly-2.svg',
    ],
    imageColor: 'from-emerald-50 to-slate-100',
    iconType: 'spark',
  },
  {
    id: 'prod-8',
    title: 'Akrapovič Evolution Line Titanium Cat-Back Performance Exhaust',
    sku: 'EXH-AKR-TI09',
    category: 'Engine & Drivetrain',
    price: 2190.0,
    originalPrice: 2490.0,
    discountPercent: 12,
    rating: 5.0,
    reviewsCount: 14,
    inStock: true,
    stockCount: 3,
    SoldCount: 11,
    badge: 'NEW',
    tabCategory: ['featured', 'onsale'],
    specs: ['Carbon Fiber Tailpipes', '+14.2 HP Dyno Proven Gain'],
    images: [
      '/images/parts/transmission-assembly-2.svg',
      '/images/parts/engine-assembly-2.svg',
      '/images/gearup-hero-2.webp',
    ],
    imageColor: 'from-purple-50 to-slate-100',
    iconType: 'exhaust',
  },
];
