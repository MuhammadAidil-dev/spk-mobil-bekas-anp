import axios, { AxiosError } from 'axios';
import { fail, type ApiFailure } from './api-response';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

type BackendErrorBody = { message?: string; code?: string };

export function parseAxiosError(err: unknown): ApiFailure {
  if (err instanceof AxiosError) {
    const body = err.response?.data as BackendErrorBody | undefined;
    return fail(
      body?.message ?? err.message ?? 'Request failed',
      err.response?.status,
      body?.code,
    );
  }
  return fail(err instanceof Error ? err.message : 'Unknown error');
}

export { API_BASE_URL };
export default apiClient;
