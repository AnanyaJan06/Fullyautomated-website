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

const PART_TYPE_TABS: { value: PartType | ''; label: string }[] = [
  { value: '', label: 'All Auto Parts' },
  { value: 'engine', label: 'Engines' },
  { value: 'transmission', label: 'Transmissions' },
];

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
  const [page, setPage] = useState<number>(initialFilters?.page ?? 1);

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
  const skipNextFilterEffectRef = useRef(false);

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

  // Trigger search automatically when instant filters or sorting change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (initialData) return;
    }
    if (skipNextFilterEffectRef.current) {
      skipNextFilterEffectRef.current = false;
      return;
    }

    void fetchCatalog({
      partType: partType || undefined,
      make: make || undefined,
      model: model || undefined,
      year: year || undefined,
      condition: condition || undefined,
      q: q || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sort,
      page,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partType, make, model, year, condition, sort, page]);

  function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    skipNextFilterEffectRef.current = page !== 1;
    setPage(1);
    void fetchCatalog({
      partType: partType || undefined,
      make: make || undefined,
      model: model || undefined,
      year: year || undefined,
      condition: condition || undefined,
      q: q || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sort,
      page: 1,
    });
  }

  function handleResetFilters() {
    skipNextFilterEffectRef.current = Boolean(
      partType || make || model || year || condition || sort !== 'newest' || page !== 1
    );
    setPartType('');
    setMake('');
    setModel('');
    setYear('');
    setCondition('');
    setQ('');
    setMinPrice('');
    setMaxPrice('');
    setSort('newest');
    setPage(1);
    setOptions((prev) => ({ ...prev, models: [], years: [] }));
    void fetchCatalog({ sort: 'newest', page: 1 });
  }

  function handleRetry() {
    void fetchCatalog({
      partType: partType || undefined,
      make: make || undefined,
      model: model || undefined,
      year: year || undefined,
      condition: condition || undefined,
      q: q || undefined,
      minPrice: minPrice || undefined,
      maxPrice: maxPrice || undefined,
      sort,
      page,
    });
  }

  const hasActiveFilters = Boolean(
    partType || make || model || year || condition || q.trim() || minPrice || maxPrice || sort !== 'newest'
  );

  const parts = result?.parts ?? [];
  const totalCount = result?.count ?? 0;

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb & Page Header */}
      <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-medium text-neutral-500">
        <Link href="/" className="transition-colors hover:text-[#ef263d]">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-neutral-900">Auto Parts Listing</span>
      </nav>

      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#ef263d]">
            Complete Parts Inventory
          </span>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
            Auto Parts Product Listing
          </h1>
          <p className="mt-1.5 text-sm text-neutral-600">
            Browse, filter, and sort OEM &amp; aftermarket engines and transmissions by vehicle fitment, condition, and price.
          </p>
        </div>

        {/* Category Quick Tabs */}
        <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Part type filter">
          {PART_TYPE_TABS.map((tab) => {
            const active = partType === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => {
                  setPartType(tab.value);
                  setMake('');
                  setModel('');
                  setYear('');
                  setPage(1);
                }}
                className={`rounded-xl px-4 py-2.5 text-xs font-extrabold transition-all ${
                  active
                    ? 'bg-[#ef263d] text-white shadow-sm'
                    : 'border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Layout: Filter Sidebar + Product Listing Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Filter Sidebar */}
        <aside className="lg:col-span-3">
          <form
            onSubmit={handleSearchSubmit}
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
                  className="text-xs font-bold text-[#ef263d] hover:underline"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Keyword Search */}
            <div>
              <label htmlFor="filter-q" className="block text-xs font-bold text-neutral-700">
                Keyword Search
              </label>
              <input
                id="filter-q"
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search part, make, model..."
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#ef263d] focus:ring-2 focus:ring-[#ef263d]/15"
              />
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
                  setPage(1);
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#ef263d]"
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
                  setPage(1);
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#ef263d]"
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
                  setPage(1);
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#ef263d] disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400"
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
                  setPage(1);
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#ef263d] disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400"
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
                  setPage(1);
                }}
                className="mt-1.5 h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#ef263d]"
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
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#ef263d]"
                />
                <input
                  type="number"
                  min="0"
                  placeholder="Max $"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-xs text-neutral-800 outline-none transition focus:border-[#ef263d]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-10 w-full items-center justify-center rounded-xl bg-neutral-900 px-4 text-xs font-extrabold text-white transition hover:bg-[#ef263d] disabled:opacity-60"
            >
              {isLoading ? 'Updating...' : 'Apply Filters'}
            </button>
          </form>
        </aside>

        {/* Right Product Grid & Sorting Bar */}
        <section className="lg:col-span-9" aria-label="Auto parts catalog results">
          {/* Top Toolbar: Count + Sort Dropdown */}
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs font-semibold text-neutral-600">
              {isLoading ? (
                <span>Loading available auto parts...</span>
              ) : (
                <span>
                  Showing <strong className="font-extrabold text-neutral-900">{parts.length}</strong> of{' '}
                  <strong className="font-extrabold text-neutral-900">{totalCount}</strong> available auto parts
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              <label htmlFor="sort-parts" className="shrink-0 text-xs font-bold text-neutral-700">
                Sort by:
              </label>
              <select
                id="sort-parts"
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value as PartSortOption);
                  setPage(1);
                }}
                className="h-9 rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-xs font-bold text-neutral-800 outline-none transition focus:border-[#ef263d] focus:bg-white"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
                  <DatabaseProductCard key={product.id} product={product} />
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
                className="mt-4 inline-flex items-center rounded-xl bg-[#ef263d] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#d91f34]"
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
                      <DatabaseProductCard key={item.id} product={item} />
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
