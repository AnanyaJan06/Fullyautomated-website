import mongoose, { HydratedDocument, Schema } from 'mongoose';

export type PartCondition = 'new' | 'refurbished' | 'used';
export type PartType = 'engine' | 'transmission';

export interface IPart {
  part: string;
  partType: PartType;
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
    partType: {
      type: String,
      enum: ['engine', 'transmission'],
      required: true,
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

PartSchema.index({ year: -1, createdAt: -1, _id: -1 });
PartSchema.index({ make: 1, model: 1, year: 1 });
PartSchema.index({ partType: 1, make: 1, model: 1, year: 1 });

export const Part = mongoose.model<IPart>('Part', PartSchema);
