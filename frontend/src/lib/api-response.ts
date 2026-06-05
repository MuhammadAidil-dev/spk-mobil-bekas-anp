export type ApiSuccess<T> = {
  success: true;
  data: T;
  message?: string;
};

export type ApiFailure = {
  success: false;
  error: {
    message: string;
    status?: number;
    code?: string;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export function ok<T>(data: T, message?: string): ApiSuccess<T> {
  return { success: true, data, message };
}

export function fail(message: string, status?: number, code?: string): ApiFailure {
  return { success: false, error: { message, status, code } };
}
