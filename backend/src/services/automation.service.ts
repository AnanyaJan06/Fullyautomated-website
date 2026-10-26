import { AutomationTask, IAutomationTask } from '../models/AutomationTask.model';

export class AutomationService {
  static async getAllTasks(): Promise<IAutomationTask[]> {
    return AutomationTask.find().sort({ createdAt: -1 });
  }

  static async createTask(data: Partial<IAutomationTask>): Promise<IAutomationTask> {
    return AutomationTask.create(data);
  }
}
