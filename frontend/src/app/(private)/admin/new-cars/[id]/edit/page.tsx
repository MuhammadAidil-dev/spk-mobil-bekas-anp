import { notFound } from 'next/navigation';
import { getNewCarById } from '@/services/new-cars.service';
import EditNewCarView from '@/features/new-cars/components/view/EditNewCarView';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminEditNewCarPage({ params }: Props) {
  const { id } = await params;
  const result = await getNewCarById(id);
  if (!result.success) notFound();
  return <EditNewCarView car={result.data} />;
}
