import { apiFetcher } from '@/lib/api';
import { ApiResponse, AutomationTask } from '@/types';

export const AutomationFrontendService = {
  getHealth: () =>
    apiFetcher<ApiResponse<{ status: string; timestamp: string; activeTasksCount: number }>>(
      '/health'
    ),
};
