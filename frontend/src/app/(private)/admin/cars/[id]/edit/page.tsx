import { notFound } from 'next/navigation';
import { getCarById } from '@/services/cars.service';
import EditCarsView from '@/features/cars/components/view/EditCarsView';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditCarPage({ params }: Props) {
  const { id } = await params;
  const result = await getCarById(id);
  if (!result.success) notFound();
  return <EditCarsView car={result.data} />;
}
