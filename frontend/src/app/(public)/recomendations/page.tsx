import { Suspense } from 'react';
import RecomendationView from '@/features/recomendations/components/view/RecomendationView';
import { getAnpResult, EMPTY_ANP_RESULT } from '@/services/anp.service';
import { getNewCarAnpResult, EMPTY_NEW_CAR_ANP_RESULT } from '@/services/new-cars.service';
import type { AnpPreference } from '@/types/api.type';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
    minYear?: string;
    maxYear?: string;
  }>;
}

export default async function RecomendationsPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const preference: AnpPreference = {};
  if (params.minPrice) preference.minPrice = Number(params.minPrice);
  if (params.maxPrice) preference.maxPrice = Number(params.maxPrice);
  if (params.minYear) preference.minYear = Number(params.minYear);
  if (params.maxYear) preference.maxYear = Number(params.maxYear);

  const hasPreference = Object.keys(preference).length > 0;

  const [anpResult, newCarResult] = await Promise.all([
    getAnpResult(hasPreference ? preference : undefined),
    getNewCarAnpResult(hasPreference ? preference : undefined),
  ]);

  const anpData = anpResult.success ? anpResult.data : EMPTY_ANP_RESULT;
  const newCarAnpData = newCarResult.success
    ? newCarResult.data
    : EMPTY_NEW_CAR_ANP_RESULT;

  return (
    <Suspense>
      <RecomendationView
        anpData={anpData}
        newCarAnpData={newCarAnpData}
        preference={hasPreference ? preference : undefined}
        anpError={anpResult.success ? null : anpResult.error.message}
        anpErrorStatus={anpResult.success ? undefined : anpResult.error.status}
        newCarAnpError={newCarResult.success ? null : newCarResult.error.message}
        newCarAnpErrorStatus={
          newCarResult.success ? undefined : newCarResult.error.status
        }
      />
    </Suspense>
  );
}
