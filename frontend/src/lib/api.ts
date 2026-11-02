function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    const cleaned = process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/+$/, '');
    return cleaned.endsWith('/api/v1') ? cleaned : `${cleaned}/api/v1`;
  }
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return `http://${window.location.hostname}:5000/api/v1`;
  }
  return 'http://localhost:5000/api/v1';
}

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
  const timeoutSignal = AbortSignal.timeout(10_000);
  const signal = options?.signal
    ? AbortSignal.any([options.signal, timeoutSignal])
    : timeoutSignal;
  if (options?.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${getApiBaseUrl()}${endpoint}`, {
    ...options,
    headers,
    signal,
  });

  if (!response.ok) {
    const errorBody: { message?: string } = await response.json().catch(() => ({}));
    throw new ApiError(errorBody.message || `API request failed (${response.status})`, response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json();
}
