'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { partService } from '@/services/part.service';
import type { DatabasePart, PartSearchOptions, PartSearchParams, PartSearchResponse, PartType } from '@/types';
import { AddToCartButton } from './AddToCartButton';
import { PartImageGallery } from './PartImageGallery';

const FALLBACK_GALLERY_BY_TYPE: Record<PartType, string[]> = {
  engine: [
    '/images/parts/engine-assembly-1.svg',
    '/images/parts/engine-assembly-2.svg',
    '/images/parts/engine-assembly-3.svg',
    '/images/gearup-hero-1.webp',
  ],
  transmission: [
    '/images/parts/transmission-assembly-1.svg',
    '/images/parts/transmission-assembly-2.svg',
    '/images/parts/transmission-assembly-3.svg',
    '/images/gearup-hero-2.webp',
  ],
};

const selectClassName =
  'h-[42px] w-full appearance-none rounded-md border border-neutral-200 bg-white pl-9 pr-8 text-xs font-normal text-neutral-700 outline-none transition-all duration-200 focus:border-[#ef263d] focus:ring-2 focus:ring-[#ef263d]/15 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400';

function SpinnerIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className={`animate-spin ${className}`}
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2.5"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchField({
  label,
  icon,
  hasChevron = true,
  children,
}: {
  label: string;
  icon: 'search' | 'part' | 'car' | 'calendar';
  hasChevron?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="min-w-0 text-xs font-medium text-neutral-700 lg:border-r lg:border-neutral-200 lg:pr-4">
      {label}
      <span className="relative mt-1.5 block">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
        >
          {icon === 'search' && (
            <>
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4 4" />
            </>
          )}
          {icon === 'part' && (
            <>
              <circle cx="12" cy="12" r="3" />
              <path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V4a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2.9Z" />
            </>
          )}
          {icon === 'car' && (
            <>
              <path d="m5 11 1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11" />
              <path d="M3.5 11.5h17v6h-17zM6.5 17.5v1.5m11-1.5V19M6 14.5h.01M18 14.5h.01" />
            </>
          )}
          {icon === 'calendar' && (
            <>
              <rect x="3.5" y="5" width="17" height="16" rx="2" />
              <path d="M16 3v4M8 3v4M3.5 10h17" />
            </>
          )}
        </svg>
        {children}
        {hasChevron && (
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500"
            >
              <path
                d="m4 6 4 4 4-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
        )}
      </span>
    </label>
  );
}

const CONDITION_BADGE: Record<DatabasePart['condition'], { label: string; className: string }> = {
  new: {
    label: 'New',
    className: 'bg-emerald-600 text-white',
  },
  refurbished: {
    label: 'Refurbished',
    className: 'bg-amber-500 text-neutral-950',
  },
  used: {
    label: 'Used',
    className: 'bg-neutral-700 text-white',
  },
};

function DatabasePartCard({ item, index = 0 }: { item: DatabasePart; index?: number }) {
  const conditionBadge = CONDITION_BADGE[item.condition] ?? CONDITION_BADGE.new;
  const fallbackGallery =
    item.partType && FALLBACK_GALLERY_BY_TYPE[item.partType]
      ? FALLBACK_GALLERY_BY_TYPE[item.partType]
      : FALLBACK_GALLERY_BY_TYPE.engine;
  const galleryImages =
    Array.isArray(item.images) && item.images.filter(Boolean).length > 0
      ? item.images.filter(Boolean)
      : fallbackGallery;

  return (
    <article
      style={{ animationDelay: `${Math.min(index * 60, 300)}ms` }}
      className="animate-fade-up group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#e51515]/50 hover:shadow-md"
    >
      <div>
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
            In Database (parts)
          </span>
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${conditionBadge.className}`}
          >
            {conditionBadge.label}
          </span>
        </div>

        <PartImageGallery
          images={galleryImages}
          title={item.part}
          subtitle={`${item.year} ${item.make} ${item.model} • ${conditionBadge.label}`}
          overlayBadge={
            <span className="rounded-md bg-neutral-900/85 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
              {item.year} {item.make} {item.model}
            </span>
          }
        />

        <h3 className="line-clamp-2 min-h-[40px] text-sm font-bold text-neutral-900 transition-colors group-hover:text-[#e51515]">
          {item.part}
        </h3>

        {item.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-neutral-500">
            {item.description}
          </p>
        )}
      </div>

      <div className="mt-4 border-t border-neutral-100 pt-3">
        <div className="mb-2.5 flex items-baseline justify-between">
          <span className="text-lg font-black text-[#e51515]">${Number(item.price).toFixed(2)}</span>
          <span className="text-[11px] font-semibold text-emerald-600">Available in DB</span>
        </div>
        <AddToCartButton
          item={{
            partId: item.id,
            part: item.part,
            partType: item.partType,
            sku: `DB-${item.id.slice(-6).toUpperCase()}`,
            make: item.make,
            model: item.model,
            year: item.year,
            condition: item.condition,
            category: item.partType
              ? `${item.partType.charAt(0).toUpperCase()}${item.partType.slice(1)} Assembly`
              : `${item.make} OEM / Performance Part`,
            description: item.description,
            image: galleryImages[0] || '',
            price: item.price,
            quantity: 1,
          }}
        />
      </div>
    </article>
  );
}

function PartCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
    >
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <div className="h-5 w-28 rounded-full skeleton-shimmer" />
          <div className="h-4 w-14 rounded skeleton-shimmer" />
        </div>
        <div className="mb-2 h-44 w-full rounded-lg skeleton-shimmer" />
        <div className="mb-3 grid grid-cols-4 gap-1.5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="h-10 rounded-md skeleton-shimmer" />
          ))}
        </div>
        <div className="space-y-2">
          <div className="h-4 w-full rounded skeleton-shimmer" />
          <div className="h-4 w-3/4 rounded skeleton-shimmer" />
        </div>
        <div className="mt-2.5 h-3 w-5/6 rounded skeleton-shimmer" />
      </div>
      <div className="mt-4 border-t border-neutral-100 pt-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="h-6 w-20 rounded skeleton-shimmer" />
          <div className="h-3.5 w-16 rounded skeleton-shimmer" />
        </div>
        <div className="h-9 w-full rounded-lg skeleton-shimmer" />
      </div>
    </div>
  );
}

export function VehicleSearch() {
  const [partType, setPartType] = useState<PartType | ''>('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [highlightPulse, setHighlightPulse] = useState(false);

  const [searchOptions, setSearchOptions] = useState<PartSearchOptions>({ makes: [], models: [], years: [] });
  const [optionsError, setOptionsError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [searchResult, setSearchResult] = useState<PartSearchResponse | null>(null);
  const requestId = useRef(0);
  const activeRequest = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      requestId.current += 1;
      activeRequest.current?.abort();
    };
  }, []);

  // Support selecting Engine or Transmission directly from department cards
  useEffect(() => {
    function applyHashDepartment() {
      const hash = window.location.hash;
      if (hash.startsWith('#part-search?partType=')) {
        const value = hash.split('partType=')[1] as PartType | undefined;
        if (value === 'engine' || value === 'transmission') {
          setPartType(value);
          setMake('');
          setModel('');
          setYear('');
          setSearchOptions({ makes: [], models: [], years: [] });
          setOptionsError('');
          setSearchResult(null);
          setHighlightPulse(true);
          setTimeout(() => setHighlightPulse(false), 1400);
          const element = document.getElementById('part-search');
          element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }

    applyHashDepartment();
    window.addEventListener('hashchange', applyHashDepartment);
    return () => window.removeEventListener('hashchange', applyHashDepartment);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    setOptionsError('');

    if (!partType) {
      return () => controller.abort();
    }

    partService
      .getSearchOptions({ partType, make: make || undefined, model: model || undefined }, controller.signal)
      .then((response) => {
        if (!controller.signal.aborted) {
          setSearchOptions((current) => ({ ...current, ...response.data }));
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setOptionsError(error instanceof Error ? error.message : 'Unable to load vehicle options.');
        }
      });

    return () => controller.abort();
  }, [partType, make, model]);

  async function runSearch(params: PartSearchParams) {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    const currentRequestId = ++requestId.current;
    setIsLoading(true);
    setErrorMsg('');
    setSearchResult(null);
    try {
      const response = await partService.searchParts(params, controller.signal);
      if (currentRequestId === requestId.current) setSearchResult(response.data);
    } catch (error) {
      if (currentRequestId !== requestId.current) return;
      const message =
        error instanceof Error
          ? error.message
          : 'Unable to query the database parts collection. Please make sure the backend server is running.';
      setErrorMsg(message);
      setSearchResult(null);
    } finally {
      if (currentRequestId === requestId.current) {
        setIsLoading(false);
        activeRequest.current = null;
      }
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!partType || !make || !model || !year) return;

    await runSearch({
      partType,
      make,
      model,
      year,
    });
  }

  function handleReset() {
    activeRequest.current?.abort();
    activeRequest.current = null;
    requestId.current += 1;
    setPartType('');
    setMake('');
    setModel('');
    setYear('');
    setSearchOptions({ makes: [], models: [], years: [] });
    setErrorMsg('');
    setOptionsError('');
    setSearchResult(null);
    setIsLoading(false);
  }

  const activeFilterSummary = [
    searchResult?.filters.partType
      ? `Part type: ${searchResult.filters.partType === 'engine' ? 'Engine' : 'Transmission'}`
      : null,
    searchResult?.filters.make ? `Make: ${searchResult.filters.make}` : null,
    searchResult?.filters.model ? `Model: ${searchResult.filters.model}` : null,
    searchResult?.filters.year ? `Year: ${searchResult.filters.year}` : null,
    searchResult?.filters.condition ? `Condition: ${searchResult.filters.condition}` : null,
  ]
    .filter(Boolean)
    .join(' • ');
  const visibleError = errorMsg || optionsError;

  return (
    <section
      id="part-search"
      aria-label="Search auto parts"
      className="mx-auto mt-4 max-w-[1440px] px-4 sm:px-6 lg:px-8"
    >
      <form
        onSubmit={handleSubmit}
        className={`grid grid-cols-1 gap-3 rounded-xl border bg-white p-4 shadow-[0_8px_28px_-22px_rgba(20,24,35,0.5)] transition-all duration-300 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,0.75fr)_auto] lg:items-end lg:gap-4 lg:px-5 lg:py-4 ${
          highlightPulse
            ? 'border-[#ef263d] ring-4 ring-[#ef263d]/15'
            : 'border-neutral-200'
        }`}
      >
        <SearchField label="Part Type" icon="part">
          <select
            value={partType}
            onChange={(event) => {
              setPartType(event.target.value as PartType | '');
              setMake('');
              setModel('');
              setYear('');
              setSearchOptions({ makes: [], models: [], years: [] });
              setSearchResult(null);
            }}
            className={selectClassName}
            required
          >
            <option value="">Select part type</option>
            <option value="engine">Engine</option>
            <option value="transmission">Transmissions</option>
          </select>
        </SearchField>

        <SearchField label="Make" icon="car">
          <select
            value={make}
            onChange={(event) => {
              setMake(event.target.value);
              setModel('');
              setYear('');
              setSearchOptions((current) => ({ ...current, models: [], years: [] }));
              setSearchResult(null);
            }}
            className={selectClassName}
            disabled={!partType}
            required
          >
            <option value="">Select make</option>
            {searchOptions.makes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </SearchField>

        <SearchField label="Model" icon="car">
          <select
            value={model}
            onChange={(event) => {
              setModel(event.target.value);
              setYear('');
              setSearchOptions((current) => ({ ...current, years: [] }));
              setSearchResult(null);
            }}
            className={selectClassName}
            disabled={!make}
            required
          >
            <option value="">Select model</option>
            {searchOptions.models.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </SearchField>

        <SearchField label="Year" icon="calendar">
          <select
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
              setSearchResult(null);
            }}
            className={selectClassName}
            disabled={!model}
            required
          >
            <option value="">Select year</option>
            {searchOptions.years.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </SearchField>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#ef263d] px-5 text-xs font-bold text-white transition-all duration-200 hover:bg-[#d91f34] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef263d] disabled:cursor-not-allowed disabled:opacity-65 lg:flex-initial"
          >
            {isLoading ? (
              <SpinnerIcon className="h-4 w-4 text-white" />
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="h-4 w-4"
              >
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 4 4" />
              </svg>
            )}
            {isLoading ? 'Checking DB...' : 'Search Parts'}
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-hidden={!(searchResult || partType || make || model || year || visibleError)}
            tabIndex={searchResult || partType || make || model || year || visibleError ? 0 : -1}
            className={`flex h-[42px] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-xs font-semibold text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.98] ${
              searchResult || partType || make || model || year || visibleError
                ? 'visible opacity-100'
                : 'invisible opacity-0 pointer-events-none'
            }`}
          >
            Reset
          </button>
        </div>
      </form>

      {visibleError && (
        <div
          role="alert"
          className="animate-scale-in mt-4 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800"
        >
          <span>{visibleError}</span>
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 font-bold text-red-900 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Database Search Skeleton Loading State */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="animate-fade-in mt-5 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 sm:p-6"
        >
          <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#ef263d]">
              <SpinnerIcon className="h-4 w-4" />
            </span>
            <div className="flex-1 space-y-1.5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#ef263d]">
                Querying MongoDB Parts Collection...
              </p>
              <p className="text-xs text-neutral-500">
                Checking verified {partType === 'engine' ? 'Engine' : partType === 'transmission' ? 'Transmission' : 'powertrain'} fitment records for{' '}
                {[year, make, model].filter(Boolean).join(' ') || 'your selected filters'}.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <PartCardSkeleton key={index} />
            ))}
          </div>
        </div>
      )}

      {!isLoading && searchResult && (
        <div className="animate-fade-up mt-5 rounded-2xl border border-neutral-200 bg-neutral-50/70 p-5 sm:p-6">
          {/* Database Existence Status Banner */}
          <div
            role="status"
            className={`animate-scale-in flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between ${
              searchResult.existsInCollection
                ? 'border-emerald-200 bg-emerald-50/90 text-emerald-950'
                : 'border-amber-200 bg-amber-50/90 text-amber-950'
            }`}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${
                  searchResult.existsInCollection ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                {searchResult.existsInCollection ? '✓' : '✕'}
              </span>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white ${
                      searchResult.existsInCollection ? 'bg-emerald-700' : 'bg-amber-700'
                    }`}
                  >
                    {searchResult.existsInCollection
                      ? 'Available in Database (parts collection)'
                      : 'Not Found in Database (parts collection)'}
                  </span>
                  <span className="text-xs font-semibold opacity-75">
                    About {searchResult.totalInCollection} records in MongoDB
                  </span>
                </div>

                <h3 className="mt-1 text-base font-extrabold">
                  {searchResult.existsInCollection
                    ? searchResult.countIsEstimate
                      ? 'Yes — parts are listed in the database collection.'
                      : `Yes — ${searchResult.count} matching part${searchResult.count === 1 ? ' is' : 's are'} listed in the database collection.`
                    : 'No parts match these filters. Related parts may be available below.'}
                </h3>

                {activeFilterSummary && (
                  <p className="mt-0.5 text-xs opacity-80">Filters: {activeFilterSummary}</p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {!searchResult.existsInCollection && (
                <button
                  type="button"
                  onClick={() => {
                    setMake('');
                    setModel('');
                    setYear('');
                    const resultPartType = searchResult.filters.partType;
                    if (resultPartType) void runSearch({ partType: resultPartType });
                  }}
                  className="rounded-lg bg-neutral-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#ef263d]"
                >
                  Show All {partType === 'engine' ? 'Engine' : 'Transmission'} Parts
                </button>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-bold text-neutral-700 transition hover:bg-neutral-100"
              >
                Close Results
              </button>
            </div>
          </div>

          {/* Matching Database Parts Grid */}
          {searchResult.existsInCollection && (
            <>
              <p className="mt-5 text-xs text-neutral-500">
                {searchResult.countIsEstimate
                  ? `Showing ${searchResult.parts.length} parts on this page.`
                  : `Showing ${searchResult.parts.length} of ${searchResult.count} matching parts.`}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {searchResult.parts.map((item, idx) => (
                  <DatabasePartCard key={item.id} item={item} index={idx} />
                ))}
              </div>
              {(searchResult.pagination.page > 1 || searchResult.pagination.hasNextPage) && (
                <nav aria-label="Search result pages" className="mt-5 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={isLoading || searchResult.pagination.page <= 1}
                    onClick={() => void runSearch({ ...searchResult.filters, page: searchResult.pagination.page - 1 })}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-xs text-neutral-600">
                    Page {searchResult.pagination.page}
                  </span>
                  <button
                    type="button"
                    disabled={isLoading || !searchResult.pagination.hasNextPage}
                    onClick={() => void runSearch({ ...searchResult.filters, page: searchResult.pagination.page + 1 })}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-xs font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </nav>
              )}
            </>
          )}

          {/* Suggestions when exact combination is not in DB */}
          {!searchResult.existsInCollection && searchResult.suggestions.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-3 text-xs font-extrabold uppercase tracking-wider text-neutral-600">
                Other Parts Available in the Database Collection for Related Filters:
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {searchResult.suggestions.map((item, idx) => (
                  <DatabasePartCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
