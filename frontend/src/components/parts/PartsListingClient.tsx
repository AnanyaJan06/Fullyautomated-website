'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { DatabaseProductCard } from '@/components/home/DatabaseProductCard';
import { partService } from '@/services/part.service';
import type {
  PartCondition,
  PartSearchOptions,
  PartSearchParams,
  PartSearchResponse,
  PartSortOption,
  PartType,
} from '@/types';

const SORT_OPTIONS: { value: PartSortOption; label: string }[] = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'year-desc', label: 'Vehicle Year: Newest' },
  { value: 'year-asc', label: 'Vehicle Year: Oldest' },
  { value: 'name-asc', label: 'Part Name: A to Z' },
];

const CONDITION_OPTIONS: { value: PartCondition | ''; label: string }[] = [
  { value: '', label: 'All Conditions' },
  { value: 'new', label: 'New' },
  { value: 'refurbished', label: 'Refurbished' },
  { value: 'used', label: 'Used' },
];

interface CatalogFilters {
  partType: PartType | '';
  make: string;
  model: string;
  year: string;
  condition: PartCondition | '';
  q: string;
  minPrice: string;
  maxPrice: string;
}

interface PartsListingClientProps {
  initialData: PartSearchResponse | null;
  initialError?: boolean;
  initialFilters?: {
    partType?: PartType | '';
    make?: string;
    model?: string;
    year?: string;
    condition?: PartCondition | '';
    q?: string;
    minPrice?: string;
    maxPrice?: string;
    sort?: PartSortOption;
    page?: number;
  };
}

export function PartsListingClient({
  initialData,
  initialError = false,
  initialFilters,
}: PartsListingClientProps) {
  const [partType, setPartType] = useState<PartType | ''>(initialFilters?.partType ?? '');
  const [make, setMake] = useState(initialFilters?.make ?? '');
  const [model, setModel] = useState(initialFilters?.model ?? '');
  const [year, setYear] = useState(initialFilters?.year ?? '');
  const [condition, setCondition] = useState<PartCondition | ''>(initialFilters?.condition ?? '');
  const [q, setQ] = useState(initialFilters?.q ?? '');
  const [minPrice, setMinPrice] = useState(initialFilters?.minPrice ?? '');
  const [maxPrice, setMaxPrice] = useState(initialFilters?.maxPrice ?? '');
  const [sort, setSort] = useState<PartSortOption>(initialFilters?.sort ?? 'newest');
  const [appliedSort, setAppliedSort] = useState<PartSortOption>(initialFilters?.sort ?? 'newest');
  const [page, setPage] = useState<number>(initialFilters?.page ?? 1);
  const [appliedFilters, setAppliedFilters] = useState<CatalogFilters>(() => ({
    partType: initialFilters?.partType ?? '',
    make: initialFilters?.make ?? '',
    model: initialFilters?.model ?? '',
    year: initialFilters?.year ?? '',
    condition: initialFilters?.condition ?? '',
    q: initialFilters?.q ?? '',
    minPrice: initialFilters?.minPrice ?? '',
    maxPrice: initialFilters?.maxPrice ?? '',
  }));

  const [options, setOptions] = useState<PartSearchOptions>({
    makes: [],
    models: [],
    years: [],
  });
  const [result, setResult] = useState<PartSearchResponse | null>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData && !initialError);
  const [errorMsg, setErrorMsg] = useState(
    initialError ? 'Unable to load parts from the server. Please try again.' : ''
  );

  const requestIdRef = useRef(0);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isFirstRender = useRef(true);

  // Load distinct makes / models / years for filter dropdowns
  useEffect(() => {
    const controller = new AbortController();

    partService
      .getSearchOptions(
        {
          partType: partType || undefined,
          make: make || undefined,
          model: model || undefined,
        },
        controller.signal
      )
      .then((res) => {
        if (!controller.signal.aborted) {
          setOptions((prev) => ({
            makes: res.data.makes ?? prev.makes,
            models: make ? (res.data.models ?? prev.models) : [],
            years: model ? (res.data.years ?? prev.years) : [],
          }));
        }
      })
      .catch(() => {
        // Keep existing options if option fetch fails
      });

    return () => controller.abort();
  }, [partType, make, model]);

  async function fetchCatalog(params: PartSearchParams) {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const currentId = ++requestIdRef.current;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await partService.searchParts(
        { ...params, limit: 12 },
        controller.signal
      );
      if (currentId === requestIdRef.current) {
        setResult(response.data);
      }
    } catch (error) {
      if (currentId !== requestIdRef.current) return;
      setErrorMsg(
        error instanceof Error
          ? error.message
          : 'Failed to load auto parts. Please try again.'
      );
    } finally {
      if (currentId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }

  // Only committed filters and pagination affect the catalog results.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialData) return;
    }
    void fetchCatalog({
      partType: appliedFilters.partType || undefined,
      make: appliedFilters.make || undefined,
      model: appliedFilters.model || undefined,
      year: appliedFilters.year || undefined,
      condition: appliedFilters.condition || undefined,
      q: appliedFilters.q || undefined,
      minPrice: appliedFilters.minPrice || undefined,
      maxPrice: appliedFilters.maxPrice || undefined,
      sort: appliedSort,
      page,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters, appliedSort, page]);

  function handleFilterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setAppliedFilters((current) => ({
      ...current,
      partType,
      make,
      model,
      year,
      condition,
      q,
      minPrice,
      maxPrice,
    }));
    setPage(1);
  }

  function handleResetFilters() {
    setPartType('');
    setMake('');
    setModel('');
    setYear('');
    setCondition('');
    setQ('');
    setMinPrice('');
    setMaxPrice('');
    setOptions((prev) => ({ ...prev, models: [], years: [] }));
  }

  function handleRetry() {
    void fetchCatalog({
      partType: appliedFilters.partType || undefined,
      make: appliedFilters.make || undefined,
      model: appliedFilters.model || undefined,
      year: appliedFilters.year || undefined,
      condition: appliedFilters.condition || undefined,
      q: appliedFilters.q || undefined,
      minPrice: appliedFilters.minPrice || undefined,
      maxPrice: appliedFilters.maxPrice || undefined,
      sort: appliedSort,
      page,
    });
  }

  const hasActiveFilters = Boolean(partType || make || model || year || condition || q.trim() || minPrice || maxPrice);
  const hasUnappliedFilterChanges =
    partType !== appliedFilters.partType ||
    make !== appliedFilters.make ||
    model !== appliedFilters.model ||
    year !== appliedFilters.year ||
    condition !== appliedFilters.condition ||
    q !== appliedFilters.q ||
    minPrice !== appliedFilters.minPrice ||
    maxPrice !== appliedFilters.maxPrice;

  const parts = result?.parts ?? [];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb & Page Header */}
      <div className="mb-6 border-b border-neutral-200 pb-4">
        <nav aria-label="Breadcrumb" className="mb-2 flex items-center gap-2 text-xs font-medium text-neutral-500">
          <Link href="/" className="transition-colors hover:text-[#806000]">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">Auto Parts Listing</span>
        </nav>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#806000]">
              OEM &amp; Aftermarket Catalog
            </span>
            <h1 className="mt-0.5 text-2xl font-black text-neutral-900">
              Shop Auto Parts &amp; Performance Gear
            </h1>
          </div>

          <div className="flex shrink-0 items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-500">
            <label htmlFor="sort-parts">Sort:</label>
            <select
              id="sort-parts"
              value={sort}
              onChange={(e) => {
                const nextSort = e.target.value as PartSortOption;
                setSort(nextSort);
                setAppliedSort(nextSort);
                setPage(1);
              }}
              className="max-w-44 cursor-pointer appearance-none bg-transparent py-0.5 pr-4 text-xs font-bold text-neutral-900 outline-none transition hover:text-[#806000] focus:text-[#806000]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="-ml-4 pointer-events-none h-3.5 w-3.5 text-neutral-600">
              <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* Main Content Layout: Filter Sidebar + Product Listing Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3">
          <form
            id="parts-filter-form"
            role="search"
            onSubmit={handleFilterSubmit}
            className="sticky top-24 space-y-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Filter Parts
              </h2>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs font-bold text-[#806000] hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label htmlFor="filter-q" className="sr-only">Search parts by keyword</label>
              <div className="relative">
                <input
                  id="filter-q"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search parts, make, or model..."
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 pr-11 text-xs text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#eab308] focus:ring-2 focus:ring-[#eab308]/20"
                />
                <button
                  type="submit"
                  aria-label="Search keyword and apply filters"
                  title="Search"
                  disabled={isLoading}
                  className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md bg-[#facc15] text-neutral-950 transition hover:bg-[#eab308] focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-950 disabled:cursor-wait disabled:opacity-50"
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-4 w-4">
                    <circle cx="10.8" cy="10.8" r="6.8" stroke="currentColor" strokeWidth="1.8" />
                    <path d="m16 16 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Part Category */}
            <div>
              <label htmlFor="filter-part-type" className="block text-xs font-bold text-neutral-700">
                Part Category
              </label>
              <select
                id="filter-part-type"
                value={partType}
                onChange={(e) => {
                  setPartType(e.target.value as PartType | '');
                  setMake('');
                  setModel('');
                  setYear('');
                  setQ('');
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#eab308]"
              >
                <option value="">All Categories</option>
                <option value="engine">Engine</option>
                <option value="transmission">Transmission</option>
              </select>
            </div>

            {/* Vehicle Make */}
            <div>
              <label htmlFor="filter-make" className="block text-xs font-bold text-neutral-700">
                Vehicle Make
              </label>
              <select
                id="filter-make"
                value={make}
                onChange={(e) => {
                  setMake(e.target.value);
                  setModel('');
                  setYear('');
                  setQ('');
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#eab308]"
              >
                <option value="">All Makes</option>
                {options.makes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Model */}
            <div>
              <label htmlFor="filter-model" className="block text-xs font-bold text-neutral-700">
                Vehicle Model
              </label>
              <select
                id="filter-model"
                value={model}
                disabled={!make}
                onChange={(e) => {
                  setModel(e.target.value);
                  setYear('');
                  setQ('');
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#eab308] disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400"
              >
                <option value="">{make ? 'All Models' : 'Select make first'}</option>
                {options.models.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Year */}
            <div>
              <label htmlFor="filter-year" className="block text-xs font-bold text-neutral-700">
                Vehicle Year
              </label>
              <select
                id="filter-year"
                value={year}
                disabled={!model}
                onChange={(e) => {
                  setYear(e.target.value);
                  setQ('');
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#eab308] disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400"
              >
                <option value="">{model ? 'All Years' : 'Select model first'}</option>
                {options.years.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label htmlFor="filter-condition" className="block text-xs font-bold text-neutral-700">
                Condition
              </label>
              <select
                id="filter-condition"
                value={condition}
                onChange={(e) => {
                  setCondition(e.target.value as PartCondition | '');
                  setQ('');
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#eab308]"
              >
                {CONDITION_OPTIONS.map((opt) => (
                  <option key={opt.label} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <span className="block text-xs font-bold text-neutral-700">Price Range ($)</span>
              <div className="mt-1.5 grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min $"
                  value={minPrice}
                  onChange={(e) => {
                    setMinPrice(e.target.value);
                    setQ('');
                  }}
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#eab308]"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={(e) => {
                    setMaxPrice(e.target.value);
                    setQ('');
                  }}
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#eab308]"
                />
              </div>
            </div>

            {hasUnappliedFilterChanges && (
              <p className="text-xs font-medium text-neutral-500" role="status">
                Filters changed. Apply them to update results.
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || !hasUnappliedFilterChanges}
              className="flex h-10 w-full items-center justify-center rounded-xl bg-[#facc15] px-4 text-xs font-extrabold text-neutral-950 transition hover:bg-[#eab308] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? 'Updating...' : 'Apply Filters'}
            </button>
          </form>
        </aside>

        {/* Right Product Grid & Sorting Bar */}
        <section className="lg:col-span-9" aria-label="Auto parts catalog results">
          {/* Error Banner */}
          {errorMsg && (
            <div
              role="alert"
              className="mb-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800"
            >
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={handleRetry}
                className="font-bold text-red-900 underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading Skeleton */}
          {isLoading && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[360px] animate-pulse rounded-xl border border-neutral-200 bg-neutral-100 p-4"
                />
              ))}
            </div>
          )}

          {/* Product Grid */}
          {!isLoading && parts.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {parts.map((product) => (
                  <DatabaseProductCard key={product.id} product={product} listingImage />
                ))}
              </div>

              {/* Pagination Controls */}
              {result && (result.pagination.page > 1 || result.pagination.hasNextPage) && (
                <nav
                  aria-label="Catalog pagination"
                  className="mt-8 flex items-center justify-center gap-3 border-t border-neutral-200 pt-6"
                >
                  <button
                    type="button"
                    disabled={isLoading || result.pagination.page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    &larr; Previous
                  </button>
                  <span className="rounded-lg bg-neutral-100 px-3.5 py-2 text-xs font-extrabold text-neutral-800">
                    Page {result.pagination.page}
                  </span>
                  <button
                    type="button"
                    disabled={isLoading || !result.pagination.hasNextPage}
                    onClick={() => setPage((p) => p + 1)}
                    className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next &rarr;
                  </button>
                </nav>
              )}
            </>
          )}

          {/* Empty State */}
          {!isLoading && parts.length === 0 && (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
              <h3 className="text-lg font-black text-neutral-900">
                No matching auto parts found
              </h3>
              <p className="mt-1.5 text-xs text-neutral-500">
                Try adjusting your filters, clearing your search query, or resetting all filters to view the full catalog.
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-4 inline-flex items-center rounded-xl bg-[#facc15] px-5 py-2.5 text-xs font-extrabold text-neutral-950 transition hover:bg-[#eab308]"
              >
                Show All Auto Parts
              </button>

              {result?.suggestions && result.suggestions.length > 0 && (
                <div className="mt-8 border-t border-neutral-100 pt-6 text-left">
                  <h4 className="mb-4 text-xs font-extrabold uppercase tracking-wider text-neutral-600">
                    Related parts you might like
                  </h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {result.suggestions.map((item) => (
                      <DatabaseProductCard key={item.id} product={item} listingImage />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
