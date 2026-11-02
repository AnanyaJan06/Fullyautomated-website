import { apiFetcher } from '@/lib/api';
import type { ApiResponse, PartSearchOptions, PartSearchParams, PartSearchResponse } from '@/types';

export const partService = {
  getSearchOptions: async (
    params: { partType: string; make?: string; model?: string },
    signal?: AbortSignal
  ) => {
    const searchParams = new URLSearchParams({ partType: params.partType });
    if (params.make) searchParams.set('make', params.make);
    if (params.model) searchParams.set('model', params.model);

    return apiFetcher<ApiResponse<PartSearchOptions>>(
      `/parts/options?${searchParams.toString()}`,
      { signal }
    );
  },

  searchParts: async (params: PartSearchParams = {}, signal?: AbortSignal) => {
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
    if (params.page !== undefined) {
      searchParams.set('page', String(params.page));
    }
    if (params.limit !== undefined) {
      searchParams.set('limit', String(params.limit));
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/parts/search?${queryString}` : '/parts/search';
    return apiFetcher<ApiResponse<PartSearchResponse>>(endpoint, { signal });
  },
};
