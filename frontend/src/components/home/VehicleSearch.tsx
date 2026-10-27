'use client';

import { useState, type FormEvent, type ReactNode } from 'react';
import { GEARUP_CATEGORIES, VEHICLE_MAKES, VEHICLE_YEARS } from '@/data/gearup-data';

const selectClassName = 'h-[42px] w-full appearance-none rounded-md border border-neutral-200 bg-white pl-9 pr-8 text-xs font-normal text-neutral-600 outline-none transition-colors focus:border-[#ef263d] focus:ring-2 focus:ring-[#ef263d]/15 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-400';

function SearchField({
  label,
  icon,
  children,
}: {
  label: string;
  icon: 'part' | 'car' | 'calendar';
  children: ReactNode;
}) {
  return (
    <label className="min-w-0 text-xs font-medium text-neutral-700 lg:border-r lg:border-neutral-200 lg:pr-4">
      {label}
      <span className="relative mt-1.5 block">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500">
          {icon === 'part' && <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1a1.7 1.7 0 0 1-2.4 2.4l-.1-.1a1.7 1.7 0 0 0-2.9 1.2v.2a1.7 1.7 0 0 1-3.4 0v-.2a1.7 1.7 0 0 0-2.9-1.2l-.1.1a1.7 1.7 0 0 1-2.4-2.4l.1-.1a1.7 1.7 0 0 0-1.2-2.9H4a1.7 1.7 0 0 1 0-3.4h.2a1.7 1.7 0 0 0 1.2-2.9l-.1-.1a1.7 1.7 0 0 1 2.4-2.4l.1.1a1.7 1.7 0 0 0 2.9-1.2V4a1.7 1.7 0 0 1 3.4 0v.2a1.7 1.7 0 0 0 2.9 1.2l.1-.1a1.7 1.7 0 0 1 2.4 2.4l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.2a1.7 1.7 0 0 1 0 3.4h-.2a1.7 1.7 0 0 0-1.2.9Z" /></>}
          {icon === 'car' && <><path d="m5 11 1.5-4.2A2 2 0 0 1 8.4 5.5h7.2a2 2 0 0 1 1.9 1.3L19 11" /><path d="M3.5 11.5h17v6h-17zM6.5 17.5v1.5m11-1.5V19M6 14.5h.01M18 14.5h.01" /></>}
          {icon === 'calendar' && <><rect x="3.5" y="5" width="17" height="16" rx="2" /><path d="M16 3v4M8 3v4M3.5 10h17" /></>}
        </svg>
        {children}
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500">
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}

export function VehicleSearch() {
  const [partType, setPartType] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('Vehicle and part filters selected. Product fitment matching is not connected yet.');
  }

  return (
    <section aria-label="Search auto parts" className="mx-auto mt-4 max-w-[1440px] px-4 sm:px-6 lg:px-8">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_8px_28px_-22px_rgba(20,24,35,0.5)] sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.9fr_auto] lg:items-end lg:gap-4 lg:px-5 lg:py-4">
        <SearchField label="Part Type" icon="part">
          <select required value={partType} onChange={(event) => { setPartType(event.target.value); setStatus(''); }} className={selectClassName}>
            <option value="">Select part type</option>
            {GEARUP_CATEGORIES.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
          </select>
        </SearchField>

        <SearchField label="Make" icon="car">
          <select required value={make} onChange={(event) => { setMake(event.target.value); setModel(''); setStatus(''); }} className={selectClassName}>
            <option value="">Select make</option>
            {Object.keys(VEHICLE_MAKES).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </SearchField>

        <SearchField label="Model" icon="car">
          <select required value={model} disabled={!make} onChange={(event) => { setModel(event.target.value); setStatus(''); }} className={selectClassName}>
            <option value="">{make ? 'Select model' : 'Select make first'}</option>
            {(make ? VEHICLE_MAKES[make] : []).map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </SearchField>

        <SearchField label="Year" icon="calendar">
          <select required value={year} onChange={(event) => { setYear(event.target.value); setStatus(''); }} className={selectClassName}>
            <option value="">Select year</option>
            {VEHICLE_YEARS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </SearchField>

        <button type="submit" className="flex h-[42px] items-center justify-center gap-2 rounded-lg bg-[#ef263d] px-5 text-xs font-bold text-white transition-colors hover:bg-[#d91f34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef263d]">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-4 w-4"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4 4" /></svg>
          Search Parts
        </button>
        <p role="status" className="sr-only">{status}</p>
      </form>
    </section>
  );
}
