import apiClient, { parseAxiosError } from '@/lib/axios';
import { ok, type ApiResponse } from '@/lib/api-response';
import type { LoginData } from '@/types/auth.type';
import type { BackendResponse } from '@/types/api.type';

export async function login(
  email: string,
  password: string,
): Promise<ApiResponse<LoginData>> {
  try {
    const { data } = await apiClient.post<BackendResponse<LoginData>>(
      '/auth/login',
      { email, password },
    );
    return ok(data.data, data.message);
  } catch (err) {
    return parseAxiosError(err);
  }
}
