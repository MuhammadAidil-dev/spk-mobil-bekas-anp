import { notFound } from 'next/navigation';
import CarDetailView from '@/features/cars/components/view/CarDetail';
import { getCarById } from '@/services/cars.service';
import { getAnpResult } from '@/services/anp.service';
import type { AnpRanking } from '@/types/api.type';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CarDetailPage({ params }: Props) {
  const { id } = await params;

  const carResult = await getCarById(id);
  if (!carResult.success) notFound();
  const car = carResult.data;

  let anpRank: AnpRanking | undefined;
  const anpResult = await getAnpResult();
  if (anpResult.success) {
    anpRank = anpResult.data.rankings.find((r) => r.data_car._id === id);
  }

  return <CarDetailView car={car} anpRank={anpRank} />;
}
