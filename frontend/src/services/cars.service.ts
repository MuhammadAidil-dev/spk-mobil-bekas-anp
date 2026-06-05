import apiClient, { parseAxiosError } from '@/lib/axios';
import { ok, type ApiResponse } from '@/lib/api-response';
import { getServerAuthHeaders } from '@/lib/auth';
import type { ApiCar, BackendResponse, UpdateCarPayload } from '@/types/api.type';

export async function getCars(): Promise<ApiResponse<ApiCar[]>> {
  try {
    const { data } = await apiClient.get<BackendResponse<ApiCar[]>>('/cars');
    return ok(data.data);
  } catch (err) {
    return parseAxiosError(err);
  }
}

export async function getCarById(id: string): Promise<ApiResponse<ApiCar>> {
  try {
    const { data } = await apiClient.get<BackendResponse<ApiCar>>(`/cars/${id}`);
    return ok(data.data);
  } catch (err) {
    return parseAxiosError(err);
  }
}

export async function createCar(formData: FormData): Promise<ApiResponse<ApiCar>> {
  try {
    const authHeaders = await getServerAuthHeaders();
    const { data } = await apiClient.post<BackendResponse<ApiCar>>('/cars', formData, {
      headers: { 'Content-Type': 'multipart/form-data', ...authHeaders },
    });
    return ok(data.data, data.message);
  } catch (err) {
    return parseAxiosError(err);
  }
}

export async function updateCar(id: string, formData: FormData): Promise<ApiResponse<ApiCar>> {
  try {
    const authHeaders = await getServerAuthHeaders();
    const { data } = await apiClient.patch<BackendResponse<ApiCar>>(`/cars/${id}`, formData, {
      headers: { ...authHeaders, 'Content-Type': 'multipart/form-data' },
    });
    return ok(data.data, data.message);
  } catch (err) {
    return parseAxiosError(err);
  }
}

export async function deleteCar(id: string): Promise<ApiResponse<null>> {
  try {
    const authHeaders = await getServerAuthHeaders();
    const { data } = await apiClient.delete<BackendResponse<null>>(`/cars/${id}`, {
      headers: authHeaders,
    });
    return ok(data.data, data.message);
  } catch (err) {
    return parseAxiosError(err);
  }
}
