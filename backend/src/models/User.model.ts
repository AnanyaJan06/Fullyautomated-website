import mongoose, { Document, Schema } from 'mongoose';

export interface IPrimaryVehicle {
  year?: string;
  make?: string;
  model?: string;
  engine?: string;
  vin?: string;
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  accountType: 'enthusiast' | 'mechanic_shop' | 'fleet';
  role: 'customer' | 'admin';
  primaryVehicle?: IPrimaryVehicle;
  createdAt: Date;
  updatedAt: Date;
}

const PrimaryVehicleSchema = new Schema<IPrimaryVehicle>(
  {
    year: { type: String, trim: true },
    make: { type: String, trim: true },
    model: { type: String, trim: true },
    engine: { type: String, trim: true },
    vin: { type: String, trim: true, uppercase: true },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [80, 'Full name cannot exceed 80 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    accountType: {
      type: String,
      enum: ['enthusiast', 'mechanic_shop', 'fleet'],
      default: 'enthusiast',
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
    },
    primaryVehicle: {
      type: PrimaryVehicleSchema,
      default: undefined,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
