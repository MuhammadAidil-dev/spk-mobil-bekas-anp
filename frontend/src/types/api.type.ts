export type Transmission = 'manual' | 'automatic';
export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric';

export interface ApiCar {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engine_capacity: number;
  seat_capacity: number;
  transmission: Transmission;
  fuel_type: FuelType;
  color: string;
  plate_region?: string;
  image_url?: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AnpWeight {
  criteria_code: string;
  criteria_name: string;
  weight: number;
}

export interface AnpNormalizedScores {
  price: number;
  mileage: number;
  engine_capacity: number;
  seat_capacity: number;
}

export interface AnpRanking {
  rank_position: number;
  data_car: ApiCar;
  normalized_scores: AnpNormalizedScores;
  final_score: number;
  calculated_at: string;
}

export interface AnpConsistency {
  lambdaMax: number;
  consistencyIndex: number;
  consistencyRatio: number;
  isConsistent: boolean;
}

export interface AnpResult {
  consistency: AnpConsistency;
  weights: AnpWeight[];
  rankings: AnpRanking[];
}

export interface BackendResponse<T> {
  data: T;
  message?: string;
}

export type CreateCarPayload = Omit<ApiCar, '_id' | 'created_at' | 'updated_at' | 'is_active'>;
export type UpdateCarPayload = Partial<CreateCarPayload>;

export interface CreateNewCarPayload {
  brand: string;
  model: string;
  year: number;
  price: number;
  engine_capacity: number;
  seat_capacity: number;
  fuel_efficiency: number;
  transmission: Transmission;
  fuel_type: FuelType;
  color: string;
  image_url: string;
  description: string;
  is_active?: boolean;
}

/* ─── New Car Domain ───────────────────────────────────────────── */

export interface ApiNewCar {
  _id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  engine_capacity: number;
  seat_capacity: number;
  fuel_efficiency: number;
  transmission: Transmission;
  fuel_type: FuelType;
  color: string;
  image_url: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NewCarNormalizedScores {
  price: number;
  engine: number;
  seat: number;
  fuel: number;
}

export interface NewCarAnpRanking {
  rank_position: number;
  data_cars: ApiNewCar;
  normalized_scores: NewCarNormalizedScores;
  final_score: number;
  calculated_at: string;
}

export interface NewCarAnpWeight {
  criteria_code: string;
  criteria_name: string;
  type: 'cost' | 'benefit';
  weight: number;
}

export interface NewCarAnpResult {
  consistency: AnpConsistency;
  weights: NewCarAnpWeight[];
  rankings: NewCarAnpRanking[];
}
