import { notFound } from 'next/navigation';
import { getNewCarById } from '@/services/new-cars.service';
import AdminNewCarDetailView from '@/features/new-cars/components/view/AdminNewCarDetailView';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminNewCarDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getNewCarById(id);
  if (!result.success) notFound();
  return <AdminNewCarDetailView car={result.data} />;
}
