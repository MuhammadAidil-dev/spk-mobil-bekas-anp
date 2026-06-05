import AdminCarsView from '@/features/cars/components/view/AdminCarsView';
import { getCars } from '@/services/cars.service';

export const dynamic = 'force-dynamic';

export default async function AdminCarsPage() {
  const result = await getCars();
  const cars = result.success ? result.data : [];

  return <AdminCarsView cars={cars} />;
}
