import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/ApiResponse';
import { AutomationService } from '../services/automation.service';

export const getHealthStatus = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const tasks = await AutomationService.getAllTasks();
    ApiResponse.success(
      res,
      {
        status: 'UP',
        timestamp: new Date().toISOString(),
        activeTasksCount: tasks.length,
      },
      'Server is healthy'
    );
  } catch (error) {
    next(error);
  }
};
