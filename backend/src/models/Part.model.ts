import mongoose, { HydratedDocument, Schema } from 'mongoose';

export type PartCondition = 'new' | 'refurbished' | 'used';

export interface IPart {
  part: string;
  make: string;
  model: string;
  year: number;
  condition: PartCondition;
  description?: string;
  images: string[];
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

export type PartDocument = HydratedDocument<IPart>;

const PartSchema = new Schema<IPart>(
  {
    part: {
      type: String,
      required: true,
      trim: true,
    },
    make: {
      type: String,
      required: true,
      trim: true,
    },
    model: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: Number,
      required: true,
    },
    condition: {
      type: String,
      enum: ['new', 'refurbished', 'used'],
      default: 'new',
    },
    description: {
      type: String,
      trim: true,
    },
    images: {
      type: [String],
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
    collection: 'parts',
  }
);

export const Part = mongoose.model<IPart>('Part', PartSchema);
