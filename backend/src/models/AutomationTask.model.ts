import mongoose, { Document, Schema } from 'mongoose';

export interface IAutomationTask extends Document {
  name: string;
  description?: string;
  cronSchedule: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  isActive: boolean;
  lastRunAt?: Date;
  nextRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AutomationTaskSchema = new Schema<IAutomationTask>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    cronSchedule: { type: String, required: true, default: '0 * * * *' },
    status: {
      type: String,
      enum: ['idle', 'running', 'completed', 'failed'],
      default: 'idle',
    },
    isActive: { type: Boolean, default: true },
    lastRunAt: { type: Date },
    nextRunAt: { type: Date },
  },
  { timestamps: true }
);

export const AutomationTask = mongoose.model<IAutomationTask>(
  'AutomationTask',
  AutomationTaskSchema
);
