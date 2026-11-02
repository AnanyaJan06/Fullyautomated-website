import mongoose, { Schema } from 'mongoose';

export const PART_CONDITIONS = ['new', 'used', 'refurbished'] as const;
export type PartCondition = (typeof PART_CONDITIONS)[number];

// Keep this as a plain data interface. Extending Mongoose's Document makes
// `model` conflict with Document.model(), even though `model` is a catalog field.
export interface IPart {
  description: string;
  part: string;
  year: number;
  make: string;
  model: string;
  price: number;
  condition: PartCondition;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PartSchema = new Schema<IPart>(
  {
    description: {  
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    part: {
      type: String,
      required: [true, 'Part name is required'],
      trim: true,
      minlength: [2, 'Part name must be at least 2 characters'],
      maxlength: [120, 'Part name cannot exceed 120 characters'],
      index: true,
    },
    year: {
      type: Number,
      required: [true, 'Vehicle year is required'],
      min: [1886, 'Year must be 1886 or later'],
      max: [2100, 'Year must be 2100 or earlier'],
      validate: {
        validator: Number.isInteger,
        message: 'Year must be a whole number',
      },
    },
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true,
      minlength: [1, 'Vehicle make is required'],
      maxlength: [80, 'Vehicle make cannot exceed 80 characters'],
      index: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
      minlength: [1, 'Vehicle model is required'],
      maxlength: [100, 'Vehicle model cannot exceed 100 characters'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      validate: {
        validator: (value: number) => Number.isFinite(value) && /^\d+(\.\d{1,2})?$/.test(String(value)),
        message: 'Price must be a finite amount with no more than two decimal places',
      },
    },
    condition: {
      type: String,
      required: [true, 'Condition is required'],
      enum: {
        values: PART_CONDITIONS,
        message: 'Condition must be new, used, or refurbished',
      },
      lowercase: true,
      trim: true,
      index: true,
    },
    images: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: [2048, 'Image URL cannot exceed 2048 characters'],
          match: [/^https?:\/\//i, 'Images must use an HTTP or HTTPS URL'],
        },
      ],
      default: [],
      validate: {
        validator: (images: string[]) => images.length <= 10,
        message: 'A part cannot have more than 10 images',
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// The standard MongoDB _id remains the database key; this virtual makes `id`
// available in API JSON without storing a duplicate field.
PartSchema.virtual('id').get(function () {
  return this._id.toString();
});

// Supports the common catalog query: fit a part to a vehicle, then sort by price.
PartSchema.index({ make: 1, model: 1, year: 1, price: 1 });
PartSchema.index({ part: 1, make: 1, model: 1, year: 1 });
PartSchema.index({ createdAt: -1 });

export const Part =
  mongoose.models.Part || mongoose.model<IPart>('Part', PartSchema);
