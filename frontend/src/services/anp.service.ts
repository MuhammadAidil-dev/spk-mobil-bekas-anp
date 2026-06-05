import apiClient, { parseAxiosError } from '@/lib/axios';
import { ok, type ApiResponse } from '@/lib/api-response';
import type { AnpResult, BackendResponse } from '@/types/api.type';

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

export async function getAnpResult(): Promise<ApiResponse<AnpResult>> {
  try {
    const { data } = await apiClient.get<BackendResponse<AnpResult>>('/anp/calculate');
    return ok(data.data);
  } catch (err) {
    return parseAxiosError(err);
  }
}
