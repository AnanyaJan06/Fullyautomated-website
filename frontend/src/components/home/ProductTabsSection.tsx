import { GEARUP_PRODUCTS } from '@/data/gearup-data';
import { ProductCard } from './ProductCard';

const tabs = [
  { id: 'all', label: 'All Parts' },
  { id: 'featured', label: 'Featured' },
  { id: 'bestseller', label: 'Best Sellers' },
  { id: 'onsale', label: 'On Sale' },
] as const;

export function ProductTabsSection() {
  return (
    <section id="products" className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4 mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#e51515]">
            OEM &amp; Aftermarket Catalog
          </span>
          <h2 className="text-2xl font-black text-neutral-900 mt-0.5">
            Trending Auto Parts &amp; Performance Gear
          </h2>
        </div>

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
                className="inline-flex cursor-pointer rounded-lg bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700 transition-colors hover:bg-neutral-200 peer-checked:bg-[#e51515] peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#e51515]"
              >
                {tab.label}
              </label>
            </span>
          ))}
        </fieldset>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {GEARUP_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
