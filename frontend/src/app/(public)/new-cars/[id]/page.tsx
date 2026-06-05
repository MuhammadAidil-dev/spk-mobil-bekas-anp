import { notFound } from 'next/navigation';
import NewCarDetail from '@/features/new-cars/components/view/NewCarDetail';
import { getNewCarById, getNewCarAnpResult } from '@/services/new-cars.service';
import type { NewCarAnpRanking } from '@/types/api.type';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function NewCarDetailPage({ params }: Props) {
  const { id } = await params;

  const carResult = await getNewCarById(id);
  if (!carResult.success) notFound();
  const car = carResult.data;

  let anpRank: NewCarAnpRanking | undefined;
  const anpResult = await getNewCarAnpResult();
  if (anpResult.success) {
    anpRank = anpResult.data.rankings.find((r) => r.data_cars._id === id);
  }

  return <NewCarDetail car={car} anpRank={anpRank} />;
}
