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
