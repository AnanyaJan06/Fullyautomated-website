import { apiFetcher } from '@/lib/api';
import type { ApiResponse, PartSearchParams, PartSearchResponse } from '@/types';

export const partService = {
  searchParts: async (params: PartSearchParams = {}) => {
    const searchParams = new URLSearchParams();

    if (params.q && params.q.trim()) {
      searchParams.set('q', params.q.trim());
    }
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

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/parts/search?${queryString}` : '/parts/search';
    return apiFetcher<ApiResponse<PartSearchResponse>>(endpoint);
  },
};
