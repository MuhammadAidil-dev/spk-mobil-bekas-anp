import AdminCarsView from '@/features/cars/components/view/AdminCarsView';
import { getCars } from '@/services/cars.service';

export default async function AdminCarsPage() {
  const result = await getCars();
  const cars = result.success ? result.data : [];

  return <AdminCarsView cars={cars} />;
}
