const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1')
  .replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetcher<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const headers = new Headers(options?.headers);
  if (options?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    signal: options?.signal ?? AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    const errorBody: { message?: string } = await response.json().catch(() => ({}));
    throw new ApiError(errorBody.message || `API request failed (${response.status})`, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}
