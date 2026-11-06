export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface PrimaryVehicle {
  year?: string;
  make?: string;
  model?: string;
  engine?: string;
  vin?: string;
}

export type AccountType = 'enthusiast' | 'mechanic_shop' | 'fleet';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  accountType: AccountType;
  role: 'customer' | 'admin';
  primaryVehicle?: PrimaryVehicle | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SignupPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  accountType?: AccountType;
  primaryVehicle?: PrimaryVehicle;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface AutomationTask {
  _id: string;
  name: string;
  description?: string;
  cronSchedule: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  isActive: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type PartCondition = 'new' | 'refurbished' | 'used';
export type PartType = 'engine' | 'transmission';

export interface DatabasePart {
  id: string;
  part: string;
  partType?: PartType;
  make: string;
  model: string;
  year: number;
  condition: PartCondition;
  description: string;
  images: string[];
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PartSearchOptions {
  makes: string[];
  models: string[];
  years: number[];
}

export interface PartSearchParams {
  partType?: PartType;
  make?: string;
  model?: string;
  year?: string | number;
  condition?: string;
  page?: number;
  limit?: number;
}

export interface PartSearchResponse {
  existsInCollection: boolean;
  count: number;
  countIsEstimate: boolean;
  totalInCollection: number;
  filters: {
    partType?: PartType;
    make?: string;
    model?: string;
    year?: number;
    condition?: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    hasNextPage: boolean;
  };
  parts: DatabasePart[];
  suggestions: DatabasePart[];
}

export type WarrantyPlanType = 'standard' | 'extended_3yr' | 'lifetime_pro';

export interface CartItem {
  partId: string;
  part: string;
  partType?: PartType | string;
  sku: string;
  make?: string;
  model?: string;
  year?: number;
  condition: PartCondition;
  category?: string;
  description?: string;
  image?: string;
  price: number;
  quantity: number;
  vin?: string;
  warrantyPlan: WarrantyPlanType;
  warrantyPrice: number;
  lineSubtotal: number;
}

export interface CartSummary {
  totalQuantity: number;
  partsSubtotal: number;
  warrantyTotal: number;
  coreChargeTotal: number;
  shippingCost: number;
  grandTotal: number;
}

export interface CartData {
  id: string;
  sessionId: string;
  userId?: string | null;
  shippingType: 'commercial' | 'residential';
  customerVin?: string;
  items: CartItem[];
  summary: CartSummary;
  updatedAt?: string;
}

export interface AddCartItemPayload {
  partId: string;
  part: string;
  partType?: PartType | string;
  sku?: string;
  make?: string;
  model?: string;
  year?: number;
  condition?: PartCondition;
  category?: string;
  description?: string;
  image?: string;
  price: number;
  quantity?: number;
  vin?: string;
  warrantyPlan?: WarrantyPlanType;
}
