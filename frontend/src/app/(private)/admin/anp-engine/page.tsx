import AnpEngineView from '@/features/anp-engine/components/view/AnpEngineView';
import { getAnpResult, EMPTY_ANP_RESULT } from '@/services/anp.service';
import { getNewCarAnpResult, EMPTY_NEW_CAR_ANP_RESULT } from '@/services/new-cars.service';

export default async function ANPEnginePage() {
  const [anpResult, newCarResult] = await Promise.all([
    getAnpResult(),
    getNewCarAnpResult(),
  ]);

  const anpData = anpResult.success ? anpResult.data : EMPTY_ANP_RESULT;
  const newCarAnpData = newCarResult.success ? newCarResult.data : EMPTY_NEW_CAR_ANP_RESULT;

  return <AnpEngineView anpData={anpData} newCarAnpData={newCarAnpData} />;
}
