import Link from 'next/link';
import { DatabaseProductCard } from './DatabaseProductCard';
import type { DatabasePart } from '@/types';

const tabs = [
  { id: 'all', label: 'All Parts' },
  { id: 'engine', label: 'Engines' },
  { id: 'transmission', label: 'Transmissions' },
] as const;

export function ProductTabsSection({
  products,
  unavailable,
}: {
  products: DatabasePart[];
  unavailable: boolean;
}) {
  return (
    <section id="products" className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4 mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#806000]">
            OEM &amp; Aftermarket Catalog
          </span>
          <h2 className="text-2xl font-black text-neutral-900 mt-0.5">
            Trending Auto Parts &amp; Performance Gear
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <fieldset className="flex flex-wrap items-center gap-2" aria-label="Filter products">
            {tabs.map((tab, index) => (
              <span key={tab.id}>
                <input
                  className="peer sr-only"
                  type="radio"
                  name="product-filter"
                  id={`product-filter-${tab.id}`}
                  defaultChecked={index === 0}
                />
                <label
                  htmlFor={`product-filter-${tab.id}`}
                  className="inline-flex cursor-pointer rounded-lg bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700 transition-colors hover:bg-neutral-200 peer-checked:bg-[#facc15] peer-checked:text-neutral-950 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#eab308]"
                >
                  {tab.label}
                </label>
              </span>
            ))}
          </fieldset>

          <Link
            href="/parts"
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-4 py-2 text-xs font-extrabold text-neutral-800 transition-colors hover:border-[#eab308] hover:bg-[#facc15] hover:text-neutral-950"
          >
            Full Parts Listing Page &rarr;
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <DatabaseProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-600" role="status">
          {unavailable
            ? 'The parts catalog is temporarily unavailable. Please try again shortly.'
            : 'No engine or transmission parts are available in the catalog yet.'}
        </p>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          href="/parts"
          className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 px-6 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-neutral-800"
        >
          View All Available Auto Parts (Filter &amp; Sort) &rarr;
        </Link>
      </div>
    </section>
  );
}
