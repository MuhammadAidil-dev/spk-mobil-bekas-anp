import { Document, Types } from 'mongoose';

// ============================================================
// ENUMS
// ============================================================
export type TransmissionType = 'manual' | 'automatic';
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric';

// ============================================================
// MONGOOSE DOCUMENT INTERFACE
// ============================================================
export interface INewCar {
  _id: Types.ObjectId;
  brand: string;
  model: string;
  year: number;
  price: number;
  engine_capacity: number;
  seat_capacity: number;
  fuel_efficiency: number;
  transmission: TransmissionType;
  fuel_type: FuelType;
  color: string;
  image_url: string;
  description: string;
  is_active: boolean;
  created_by: Types.ObjectId;
  updated_by: Types.ObjectId | null;
  created_at: Date;
  updated_at: Date;
}

export type INewCarDocument = INewCar & Document;

export interface INewCarANPResult {
  _id: Types.ObjectId;
  car_id: Types.ObjectId;
  final_score: number;
  rank_position: number;
  calculated_at: Date;
}

export type INewCarANPResultDocument = INewCarANPResult & Document;

// ============================================================
// DTO — CREATE / UPDATE
// ============================================================
export interface CreateNewCarDto {
  brand: string;
  model: string;
  year: number;
  price: number;
  engine_capacity: number;
  seat_capacity: number;
  fuel_efficiency: number;
  transmission: TransmissionType;
  fuel_type: FuelType;
  color: string;
  image_url: string;
  description: string;
  is_active?: boolean;
  created_by: Types.ObjectId | null;
}

export interface UpdateNewCarDto {
  brand?: string;
  model?: string;
  year?: number;
  price?: number;
  engine_capacity?: number;
  seat_capacity?: number;
  fuel_efficiency?: number;
  transmission?: TransmissionType;
  fuel_type?: FuelType;
  color?: string;
  image_url?: string;
  description?: string;
  is_active?: boolean;
  updated_by: Types.ObjectId;
}

// ============================================================
// SERVICE RETURN TYPES
// ============================================================
export interface NewCarListItem {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  engine_capacity: number;
  seat_capacity: number;
  fuel_efficiency: number;
  transmission: TransmissionType;
  fuel_type: FuelType;
  color: string;
  image_url: string;
  description: string;
  is_active: boolean;
}

export interface NewCarDetail extends NewCarListItem {
  created_by: string | null;
  updated_by: string | null;
  created_at: Date;
  updated_at: Date;
}
