export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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
