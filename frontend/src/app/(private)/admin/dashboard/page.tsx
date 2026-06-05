import AdminDashboardView from '@/features/dashboard/components/view/AdminDashboardView';
import { getCars } from '@/services/cars.service';
import { getAnpResult, EMPTY_ANP_RESULT } from '@/services/anp.service';
import { getNewCars, getNewCarAnpResult, EMPTY_NEW_CAR_ANP_RESULT } from '@/services/new-cars.service';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const [carsResult, newCarsResult, anpResult, newCarAnpResult] =
    await Promise.all([
      getCars(),
      getNewCars(),
      getAnpResult(),
      getNewCarAnpResult(),
    ]);

  return (
    <AdminDashboardView
      cars={carsResult.success ? carsResult.data : []}
      newCars={newCarsResult.success ? newCarsResult.data : []}
      anpData={anpResult.success ? anpResult.data : EMPTY_ANP_RESULT}
      newCarAnpData={newCarAnpResult.success ? newCarAnpResult.data : EMPTY_NEW_CAR_ANP_RESULT}
    />
  );
}
