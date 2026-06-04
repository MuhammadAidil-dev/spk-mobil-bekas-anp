export type Transmission = 'manual' | 'automatic';

export type FuelType = 'gasoline' | 'diesel' | 'hybrid' | 'electric';

export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineCapacity: number;
  seatCapacity: number;
  transmission: Transmission;
  fuelType: FuelType;
  imageUrl: string;
  description: string;
}
