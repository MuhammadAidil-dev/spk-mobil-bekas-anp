import AdminNewCarsView from '@/features/new-cars/components/view/AdminNewCarsView';
import { getNewCars } from '@/services/new-cars.service';

export const dynamic = 'force-dynamic';

export default async function AdminNewCarsPage() {
  const result = await getNewCars();
  const cars = result.success ? result.data : [];

  return <AdminNewCarsView cars={cars} />;
}
