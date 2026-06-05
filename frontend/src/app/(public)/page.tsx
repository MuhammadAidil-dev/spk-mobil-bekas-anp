import HomeView from '@/components/view/HomeView';
import { getCars } from '@/services/cars.service';
import { getNewCarAnpResult } from '@/services/new-cars.service';

export default async function HomePage() {
  const [carsResult, newCarResult] = await Promise.all([
    getCars(),
    getNewCarAnpResult(),
  ]);

  const cars = carsResult.success ? carsResult.data.slice(0, 6) : [];
  const topNewCars = newCarResult.success
    ? newCarResult.data.rankings.slice(0, 6)
    : [];

  return <HomeView cars={cars} topNewCars={topNewCars} />;
}
