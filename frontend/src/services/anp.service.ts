import apiClient, { parseAxiosError } from '@/lib/axios';
import { ok, type ApiResponse } from '@/lib/api-response';
import type { AnpPreference, AnpResult, BackendResponse } from '@/types/api.type';

export const EMPTY_ANP_RESULT: AnpResult = {
  consistency: {
    lambdaMax: 0,
    consistencyIndex: 0,
    consistencyRatio: 0,
    isConsistent: false,
  },
  weights: [],
  rankings: [],
};

export async function getAnpResult(preference?: AnpPreference): Promise<ApiResponse<AnpResult>> {
  try {
    const params = new URLSearchParams();
    if (preference?.minPrice !== undefined) params.set('minPrice', String(preference.minPrice));
    if (preference?.maxPrice !== undefined) params.set('maxPrice', String(preference.maxPrice));
    if (preference?.minYear !== undefined) params.set('minYear', String(preference.minYear));
    if (preference?.maxYear !== undefined) params.set('maxYear', String(preference.maxYear));

    const url = params.size ? `/anp/calculate?${params}` : '/anp/calculate';
    const { data } = await apiClient.get<BackendResponse<AnpResult>>(url);
    return ok(data.data);
  } catch (err) {
    return parseAxiosError(err);
  }
}
