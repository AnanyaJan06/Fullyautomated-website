import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import { PartCondition } from './Part.model';

export type WarrantyPlanType = 'standard' | 'extended_3yr' | 'lifetime_pro';

export interface ICartItem {
  partId: string;
  part: string;
  sku?: string;
  make?: string;
  model?: string;
  year?: number;
  condition: PartCondition;
  category?: string;
  description?: string;
  image?: string;
  price: number;
  quantity: number;
  vin?: string;
  warrantyPlan: WarrantyPlanType;
  warrantyPrice: number;
}

export interface ICart {
  userId?: Types.ObjectId;
  sessionId: string;
  items: ICartItem[];
  shippingType: 'commercial' | 'residential';
  customerVin?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CartDocument = HydratedDocument<ICart>;

const CartItemSchema = new Schema<ICartItem>(
  {
    partId: {
      type: String,
      required: true,
      trim: true,
    },
    part: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
    },
    make: {
      type: String,
      trim: true,
    },
    model: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
    },
    condition: {
      type: String,
      enum: ['new', 'refurbished', 'used'],
      default: 'new',
    },
    category: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true,
    },
    warrantyPlan: {
      type: String,
      enum: ['standard', 'extended_3yr', 'lifetime_pro'],
      default: 'standard',
    },
    warrantyPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { _id: false }
);

const CartSchema = new Schema<ICart>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      sparse: true,
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    shippingType: {
      type: String,
      enum: ['commercial', 'residential'],
      default: 'commercial',
    },
    customerVin: {
      type: String,
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
    collection: 'carts',
  }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
