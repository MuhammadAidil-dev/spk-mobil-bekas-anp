import { Suspense } from 'react';
import CatalogView from '@/features/catalog/components/view/CatalogView';
import { getCars } from '@/services/cars.service';
import { getNewCarAnpResult } from '@/services/new-cars.service';

export default async function CatalogPage() {
  const [carsResult, newCarResult] = await Promise.all([
    getCars(),
    getNewCarAnpResult(),
  ]);

  const cars = carsResult.success ? carsResult.data : [];
  const newCarRankings = newCarResult.success ? newCarResult.data.rankings : [];

  return (
    <Suspense>
      <CatalogView cars={cars} newCarRankings={newCarRankings} />
    </Suspense>
  );
}
