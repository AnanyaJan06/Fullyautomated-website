import { apiFetcher } from '@/lib/api';
import type { ApiResponse, DatabasePart, PartSearchOptions, PartSearchParams, PartSearchResponse } from '@/types';

export const partService = {
  getPartById: async (id: string) =>
    apiFetcher<ApiResponse<DatabasePart>>(`/parts/${encodeURIComponent(id)}`, {
      next: { revalidate: 60, tags: [`part:${id}`] },
    }),

  getSearchOptions: async (
    params: { partType?: string; make?: string; model?: string } = {},
    signal?: AbortSignal
  ) => {
    const searchParams = new URLSearchParams();
    if (params.partType) searchParams.set('partType', params.partType);
    if (params.make) searchParams.set('make', params.make);
    if (params.model) searchParams.set('model', params.model);

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/parts/options?${queryString}` : '/parts/options';

    return apiFetcher<ApiResponse<Partial<PartSearchOptions>>>(endpoint, { signal });
  },

  searchParts: async (
    params: PartSearchParams = {},
    signal?: AbortSignal,
    requestOptions: RequestInit = {}
  ) => {
    const searchParams = new URLSearchParams();

    if (params.partType && params.partType.trim()) {
      searchParams.set('partType', params.partType.trim());
    }
    if (params.make && params.make.trim()) {
      searchParams.set('make', params.make.trim());
    }
    if (params.model && params.model.trim()) {
      searchParams.set('model', params.model.trim());
    }
    if (params.year !== undefined && String(params.year).trim() !== '') {
      searchParams.set('year', String(params.year).trim());
    }
    if (params.condition && params.condition.trim()) {
      searchParams.set('condition', params.condition.trim());
    }
    if (params.q && params.q.trim()) {
      searchParams.set('q', params.q.trim());
    }
    if (params.minPrice !== undefined && String(params.minPrice).trim() !== '') {
      searchParams.set('minPrice', String(params.minPrice).trim());
    }
    if (params.maxPrice !== undefined && String(params.maxPrice).trim() !== '') {
      searchParams.set('maxPrice', String(params.maxPrice).trim());
    }
    if (params.sort && params.sort.trim()) {
      searchParams.set('sort', params.sort.trim());
    }
    if (params.page !== undefined) {
      searchParams.set('page', String(params.page));
    }
    if (params.limit !== undefined) {
      searchParams.set('limit', String(params.limit));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/parts/search?${queryString}` : '/parts/search';
    return apiFetcher<ApiResponse<PartSearchResponse>>(endpoint, {
      ...requestOptions,
      ...(signal ? { signal } : {}),
    });
  },
};
