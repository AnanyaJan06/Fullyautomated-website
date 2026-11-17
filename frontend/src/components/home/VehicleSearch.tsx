'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { partService } from '@/services/part.service';
import type { PartSearchOptions, PartType } from '@/types';

const selectClassName =
  'h-[42px] w-full appearance-none rounded-md border border-neutral-200 bg-white pl-9 pr-8 text-xs font-normal text-neutral-700 outline-none transition-all duration-200 focus:border-[#ef263d] focus:ring-2 focus:ring-[#ef263d]/15 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400';

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

export function VehicleSearch() {
  const router = useRouter();
  const [partType, setPartType] = useState<PartType | ''>('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [highlightPulse, setHighlightPulse] = useState(false);

  const [searchOptions, setSearchOptions] = useState<PartSearchOptions>({ makes: [], models: [], years: [] });
  const [optionsError, setOptionsError] = useState('');
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

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!partType || !make || !model || !year) return;

    const params = new URLSearchParams({ partType, make, model, year });
    router.push(`/parts?${params.toString()}`);
  }

  function handleReset() {
    setPartType('');
    setMake('');
    setModel('');
    setYear('');
    setSearchOptions({ makes: [], models: [], years: [] });
    setOptionsError('');
  }

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
            className="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#ef263d] px-5 text-xs font-bold text-white transition-all duration-200 hover:bg-[#d91f34] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef263d] lg:flex-initial"
          >
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
            View Matching Parts
          </button>

          <button
            type="button"
            onClick={handleReset}
            aria-hidden={!(partType || make || model || year || optionsError)}
            tabIndex={partType || make || model || year || optionsError ? 0 : -1}
            className={`flex h-[42px] items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 px-3 text-xs font-semibold text-neutral-600 transition-all duration-200 hover:bg-neutral-100 hover:text-neutral-900 active:scale-[0.98] ${
              partType || make || model || year || optionsError
                ? 'visible opacity-100'
                : 'invisible opacity-0 pointer-events-none'
            }`}
          >
            Reset
          </button>
        </div>
      </form>

      {optionsError && (
        <div
          role="alert"
          className="animate-scale-in mt-4 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-800"
        >
          <span>{optionsError}</span>
          <button
            type="button"
            onClick={handleReset}
            className="shrink-0 font-bold text-red-900 underline"
          >
            Dismiss
          </button>
        </div>
      )}

    </section>
  );
}
