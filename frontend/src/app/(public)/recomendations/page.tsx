import { Suspense } from 'react';
import RecomendationView from '@/features/recomendations/components/view/RecomendationView';
import { getAnpResult, EMPTY_ANP_RESULT } from '@/services/anp.service';
import { getNewCarAnpResult, EMPTY_NEW_CAR_ANP_RESULT } from '@/services/new-cars.service';

export const dynamic = 'force-dynamic';

export default async function RecomendationsPage() {
  const [anpResult, newCarResult] = await Promise.all([
    getAnpResult(),
    getNewCarAnpResult(),
  ]);

  const anpData = anpResult.success ? anpResult.data : EMPTY_ANP_RESULT;
  const newCarAnpData = newCarResult.success
    ? newCarResult.data
    : EMPTY_NEW_CAR_ANP_RESULT;

  return (
    <Suspense>
      <RecomendationView anpData={anpData} newCarAnpData={newCarAnpData} />
    </Suspense>
  );
}
