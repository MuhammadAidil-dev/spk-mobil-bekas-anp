import { model, Schema } from 'mongoose';
import { ICar } from './car.type';

const CarSchema = new Schema<ICar>(
  {
    brand: {
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
      min: 1900,
      max: new Date().getFullYear(),
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    mileage: {
      type: Number,
      required: true,
      min: 0,
    },

    engine_capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    seat_capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    transmission: {
      type: String,
      enum: ['manual', 'automatic'],
      required: true,
    },

    fuel_type: {
      type: String,
      enum: ['gasoline', 'diesel', 'hybrid', 'electric'],
      required: true,
    },

    color: {
      type: String,
      required: true,
      trim: true,
    },

    plate_region: {
      type: String,
      trim: true,
      uppercase: true,
    },

    image_url: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    updated_by: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    versionKey: false,
  },
);

CarSchema.index({ brand: 1 });
CarSchema.index({ model: 1 });
CarSchema.index({ price: 1 });
CarSchema.index({ mileage: 1 });
CarSchema.index({ engine_capacity: 1 });
CarSchema.index({ seat_capacity: 1 });
CarSchema.index({ is_active: 1 });

export const CarModel = model<ICar>('Car', CarSchema);
