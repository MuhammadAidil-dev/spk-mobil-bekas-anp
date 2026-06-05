import { notFound } from 'next/navigation';
import { getCarById } from '@/services/cars.service';
import AdminCarDetailView from '@/features/cars/components/view/AdminCarDetailView';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminCarDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getCarById(id);
  if (!result.success) notFound();
  return <AdminCarDetailView car={result.data} />;
}
