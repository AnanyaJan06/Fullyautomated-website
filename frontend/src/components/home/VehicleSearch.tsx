'use client';

import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { partService } from '@/services/part.service';
import type { PartSearchOptions, PartType } from '@/types';

const selectClassName =
  'h-[42px] w-full appearance-none rounded-lg border border-neutral-200 bg-white pl-9 pr-8 text-xs font-medium text-neutral-700 outline-none transition-all duration-200 focus:border-[#eab308] focus:ring-2 focus:ring-[#eab308]/20 disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400';

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
    <label className="min-w-0 text-xs font-medium text-neutral-700">
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

    partService
      .getSearchOptions({ partType: partType || undefined, make: make || undefined, model: model || undefined }, controller.signal)
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
    if (!make || !model || !year) return;

    const params = new URLSearchParams({ make, model, year });
    if (partType) params.set('partType', partType);
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
      className="w-full"
    >
      <form
        onSubmit={handleSubmit}
        className={`grid grid-cols-1 gap-3 rounded-2xl border bg-white p-4 sm:p-5 shadow-[0_20px_55px_-28px_rgba(0,0,0,0.4)] transition-all duration-300 sm:grid-cols-2 lg:grid-cols-1 lg:gap-3 lg:p-6 ${
          highlightPulse
            ? 'border-[#eab308] ring-4 ring-[#eab308]/20'
            : 'border-neutral-200'
        }`}
      >
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-lg font-black uppercase tracking-tight text-neutral-950">Find Your Fit</h2>
          <p className="mt-1 text-xs leading-5 text-neutral-500">Choose your vehicle to find compatible parts.</p>
        </div>
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
          >
            <option value="">All part types</option>
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

        <div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
          <button
            type="submit"
            className="flex h-[44px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#facc15] px-5 text-xs font-extrabold uppercase tracking-wide text-neutral-950 transition-all duration-200 hover:bg-[#eab308] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950 lg:flex-initial"
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
            Go
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
            Clear
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
