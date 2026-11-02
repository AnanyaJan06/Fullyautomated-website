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

export interface DatabasePart {
  id: string;
  part: string;
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

export interface PartSearchParams {
  q?: string;
  partType?: string;
  make?: string;
  model?: string;
  year?: string | number;
  condition?: string;
}

export interface PartSearchResponse {
  existsInCollection: boolean;
  count: number;
  totalInCollection: number;
  filters: {
    q?: string;
    partType?: string;
    make?: string;
    model?: string;
    year?: number;
    condition?: string;
  };
  parts: DatabasePart[];
  suggestions: DatabasePart[];
}
