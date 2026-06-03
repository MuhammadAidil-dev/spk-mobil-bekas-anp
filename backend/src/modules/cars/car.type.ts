import { Document, Types } from 'mongoose';

type TTransmission = 'manual' | 'automatic';
type TFuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric';

export interface ICar {
  _id: Types.ObjectId;
  brand: string;
  model: string;
  year: number;

  price: number;
  mileage: number;

  engine_capacity: number;
  seat_capacity: number;

  transmission: TTransmission;
  fuel_type: TFuelType;

  color: string;
  plate_region?: string;

  image_url?: string;
  description: string;

  is_active: boolean;

  created_by: Types.ObjectId | null;
  updated_by: Types.ObjectId | null;

  createdAt?: Date;
  updatedAt?: Date;
}

export type ICarDocument = ICar & Document;
export type CreateCarDTO = Pick<
  ICar,
  | 'brand'
  | 'model'
  | 'year'
  | 'year'
  | 'price'
  | 'mileage'
  | 'engine_capacity'
  | 'seat_capacity'
  | 'transmission'
  | 'fuel_type'
  | 'color'
  | 'plate_region'
  | 'image_url'
  | 'description'
>;
