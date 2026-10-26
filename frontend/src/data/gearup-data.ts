export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  itemCount: number;
  subcategories: string[];
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
    id: 'cat-1',
    name: 'Headlights & Lighting',
    slug: 'headlights-lighting',
    itemCount: 142,
    subcategories: ['Headlights', 'Tail Lights', 'Fog Lights', 'LED Conversion Kits', 'Signal Bulbs'],
    icon: '💡',
  },
  {
    id: 'cat-2',
    name: 'Tires & Wheels',
    slug: 'tires-wheels',
    itemCount: 98,
    subcategories: ['All-Season Tires', 'Performance Tires', 'Forged Alloy Wheels', 'Wheel Spacers', 'TPMS Sensors'],
    icon: '🛞',
  },
  {
    id: 'cat-3',
    name: 'Brake Systems',
    slug: 'brake-systems',
    itemCount: 215,
    subcategories: ['Ceramic Brake Pads', 'Drilled Rotors', 'Big Brake Kits', 'Brake Calipers', 'Brake Lines'],
    icon: '🛑',
  },
  {
    id: 'cat-4',
    name: 'Engine & Drivetrain',
    slug: 'engine-drivetrain',
    itemCount: 310,
    subcategories: ['Turbochargers', 'Cold Air Intakes', 'Timing Belts', 'Spark Plugs', 'Oil Filters'],
    icon: '⚙️',
  },
  {
    id: 'cat-5',
    name: 'Suspension & Steering',
    slug: 'suspension-steering',
    itemCount: 124,
    subcategories: ['Coilover Kits', 'Shock Absorbers', 'Control Arms', 'Sway Bars', 'Tie Rod Ends'],
    icon: '🔧',
  },
  {
    id: 'cat-6',
    name: 'Oils, Fluids & Garage Tools',
    slug: 'oils-fluids-tools',
    itemCount: 186,
    subcategories: ['5W-30 Synthetic Oil', 'OBD2 Diagnostic Scanners', 'Torque Wrenches', 'Coolants', 'Battery Chargers'],
    icon: '🛢️',
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
    imageColor: 'from-purple-50 to-slate-100',
    iconType: 'exhaust',
  },
];
