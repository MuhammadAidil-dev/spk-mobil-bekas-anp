import apiClient, { parseAxiosError } from '@/lib/axios';
import { ok, type ApiResponse } from '@/lib/api-response';
import { getServerAuthHeaders } from '@/lib/auth';
import type {
  ApiNewCar,
  BackendResponse,
  NewCarAnpResult,
} from '@/types/api.type';

export const EMPTY_NEW_CAR_ANP_RESULT: NewCarAnpResult = {
  consistency: {
    lambdaMax: 0,
    consistencyIndex: 0,
    consistencyRatio: 0,
    isConsistent: false,
  },
  weights: [],
  rankings: [],
};

export async function getNewCars(): Promise<ApiResponse<ApiNewCar[]>> {
  try {
    const { data } = await apiClient.get<BackendResponse<ApiNewCar[]>>('/new-cars');
    return ok(data.data);
  } catch (err) {
    return parseAxiosError(err);
  }
}

export async function getNewCarById(id: string): Promise<ApiResponse<ApiNewCar>> {
  try {
    const { data } = await apiClient.get<BackendResponse<ApiNewCar>>(`/new-cars/${id}`);
    return ok(data.data);
  } catch (err) {
    return parseAxiosError(err);
  }
}

export async function createNewCar(
  formData: FormData,
): Promise<ApiResponse<ApiNewCar>> {
  try {
    const authHeaders = await getServerAuthHeaders();
    const { data } = await apiClient.post<BackendResponse<ApiNewCar>>(
      '/new-cars',
      formData,
      { headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' } },
    );
    return ok(data.data, data.message);
  } catch (err) {
    return parseAxiosError(err);
  }
}

export async function updateNewCar(
  id: string,
  formData: FormData,
): Promise<ApiResponse<ApiNewCar>> {
  try {
    const authHeaders = await getServerAuthHeaders();
    const { data } = await apiClient.patch<BackendResponse<ApiNewCar>>(
      `/new-cars/${id}`,
      formData,
      { headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' } },
    );
    return ok(data.data, data.message);
  } catch (err) {
    return parseAxiosError(err);
  }
}

export async function deleteNewCar(id: string): Promise<ApiResponse<null>> {
  try {
    const authHeaders = await getServerAuthHeaders();
    await apiClient.delete(`/new-cars/${id}`, { headers: authHeaders });
    return ok(null);
  } catch (err) {
    return parseAxiosError(err);
  }
}

export async function getNewCarAnpResult(): Promise<ApiResponse<NewCarAnpResult>> {
  try {
    const { data } = await apiClient.get<BackendResponse<NewCarAnpResult>>(
      '/new-cars/calculate-new-cars',
    );
    return ok(data.data);
  } catch (err) {
    return parseAxiosError(err);
  }
}
