// features/landing/data/dummy-cars.ts

// features/landing/types/car.ts

export interface Car {
  id: string;
  name: string;
  variant: string;
  brand: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  imageUrl: string;
  badge?: string;
}

export const featuredCars: Car[] = [
  {
    id: '1',
    brand: 'BMW',
    name: 'BMW 3 Series',
    variant: '330i M Sport',
    year: 2021,
    price: 845000000,
    mileage: 12000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    badge: 'Top Ranked',
    imageUrl:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200',
  },
  {
    id: '2',
    brand: 'Mazda',
    name: 'Mazda CX-5',
    variant: 'Elite Edition',
    year: 2020,
    price: 420000000,
    mileage: 28000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    imageUrl:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200',
  },
  {
    id: '3',
    brand: 'Toyota',
    name: 'Corolla Cross',
    variant: 'Hybrid',
    year: 2022,
    price: 510000000,
    mileage: 8000,
    transmission: 'CVT',
    fuelType: 'Hybrid',
    imageUrl:
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200',
  },
  {
    id: '4',
    brand: 'Honda',
    name: 'Honda Civic Turbo',
    variant: 'Sedan',
    year: 2019,
    price: 385000000,
    mileage: 35000,
    transmission: 'Automatic',
    fuelType: 'Petrol',
    imageUrl:
      'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200',
  },
  {
    id: '5',
    brand: 'Mitsubishi',
    name: 'Pajero Sport',
    variant: 'Dakar',
    year: 2021,
    price: 560000000,
    mileage: 15000,
    transmission: 'Automatic',
    fuelType: 'Diesel',
    imageUrl:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=1200',
  },
  {
    id: '6',
    brand: 'Hyundai',
    name: 'Ioniq 5',
    variant: 'Signature Long Range',
    year: 2023,
    price: 720000000,
    mileage: 5000,
    transmission: 'Automatic',
    fuelType: 'Electric',
    imageUrl:
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1200',
  },
];
