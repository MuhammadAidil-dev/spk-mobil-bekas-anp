import { Schema, model } from 'mongoose';
import { INewCar, INewCarANPResult } from './newCar.type';

// ============================================================
// SCHEMA — NewCar
// ============================================================
const newCarSchema = new Schema<INewCar>(
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
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    engine_capacity: {
      type: Number,
      required: true,
      min: 0,
    },
    seat_capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    fuel_efficiency: {
      type: Number,
      required: true,
      min: 0,
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
    image_url: {
      type: String,
      required: true,
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
  },
);

// Index untuk query umum
newCarSchema.index({ is_active: 1 });
newCarSchema.index({ brand: 1, model: 1 });

// ============================================================
// SCHEMA — NewCarANPResult
// ============================================================
const newCarANPResultSchema = new Schema<INewCarANPResult>(
  {
    car_id: {
      type: Schema.Types.ObjectId,
      ref: 'NewCar',
      required: true,
    },
    final_score: {
      type: Number,
      required: true,
    },
    rank_position: {
      type: Number,
      required: true,
      min: 1,
    },
    calculated_at: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  },
);

newCarANPResultSchema.index({ car_id: 1 });
newCarANPResultSchema.index({ rank_position: 1 });

// ============================================================
// MODELS
// ============================================================
export const NewCarModel = model<INewCar>('NewCar', newCarSchema, 'new_cars');

export const NewCarANPResultModel = model<INewCarANPResult>(
  'NewCarANPResult',
  newCarANPResultSchema,
  'new_car_anp_results',
);
