import type { Metadata } from 'next';
import Link from 'next/link';
import { DatabaseProductCard } from '@/components/home/DatabaseProductCard';
import { WeeklyCountdown } from '@/components/home/WeeklyCountdown';
import { partService } from '@/services/part.service';
import type { DatabasePart } from '@/types';

export const metadata: Metadata = {
  title: 'Weekly Auto Parts Deals & Offers | Automobilic',
  description:
    'Save on OEM and aftermarket engines, transmissions, and refurbished assemblies with Automobilic weekly deals and fleet discounts.',
};

const PROMO_HIGHLIGHTS = [
  {
    badge: 'LIMITED TIME',
    title: 'Up to 25% Off Refurbished Assemblies',
    description:
      'Dyno-tested and remanufactured engine and transmission assemblies backed by our fitment guarantee.',
    code: 'REMAN25',
    href: '/parts?condition=refurbished',
    cta: 'Shop Refurbished',
    accent: 'border-[#eab308]/50 bg-yellow-50/40',
  },
  {
    badge: 'FREIGHT SPECIAL',
    title: 'Free Commercial Freight over $150',
    description:
      'Ship directly to your repair shop or commercial dock with zero liftgate surcharge on eligible orders.',
    code: 'FREESHIP150',
    href: '/parts',
    cta: 'Browse Eligible Parts',
    accent: 'border-neutral-200 bg-white',
  },
  {
    badge: 'CORE REBATE',
    title: '$150 Instant Core Exchange Credit',
    description:
      'Return your old engine block or transmission core within 30 days using our prepaid freight label.',
    code: 'CORE150',
    href: '/faq#warranty-core',
    cta: 'How Core Returns Work',
    accent: 'border-neutral-200 bg-white',
  },
];

export default async function DealsPage() {
  let allParts: DatabasePart[] = [];
  let catalogUnavailable = false;

  try {
    const response = await partService.searchParts(
      { page: 1, limit: 12, sort: 'price-asc' },
      undefined,
      { next: { revalidate: 60, tags: ['parts-catalog'] } }
    );
    allParts = response.data.parts;
  } catch (error) {
    console.error('Failed to load deals page catalog:', error);
    catalogUnavailable = true;
  }

  const featuredDeals = allParts.slice(0, 4);
  const engineDeals = allParts.filter((part) => part.partType === 'engine').slice(0, 4);
  const transmissionDeals = allParts
    .filter((part) => part.partType === 'transmission')
    .slice(0, 4);

  return (
    <main className="min-h-[75vh] pb-16">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs font-medium text-neutral-500"
        >
          <Link href="/" className="transition-colors hover:text-[#8a6b00]">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">Deals &amp; Offers</span>
        </nav>

        {/* Hero Banner */}
        <section className="animate-fade-up relative overflow-hidden rounded-2xl bg-neutral-950 px-5 py-7 text-white shadow-sm sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="relative z-10 grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12">
            <div className="min-w-0 lg:col-span-8">
              <span className="inline-flex items-center gap-2 rounded-md bg-[#facc15] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-neutral-950">
                Flash Catalog Savings
              </span>
              <h1 className="mt-4 text-2xl min-[380px]:text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Weekly Auto Parts Deals &amp; Special Pricing
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-300 sm:text-base">
                Explore our lowest-priced OEM and aftermarket engines and transmissions, updated every week with verified vehicle fitment and fast freight shipping.
              </p>
              <div className="mt-6 flex flex-col gap-2.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
                <Link
                  href="/parts?sort=price-asc"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#facc15] px-5 py-3 text-xs font-extrabold text-neutral-950 transition hover:bg-[#eab308] sm:text-sm"
                >
                  Shop Lowest Prices First &rarr;
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-sm transition hover:bg-white/20 sm:text-sm"
                >
                  Request Bulk / Shop Quote
                </Link>
              </div>
            </div>

            <div className="min-w-0 rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-sm lg:col-span-4">
              <span className="inline-block rounded bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-neutral-950">
                Weekly Deal Timer
              </span>
              <h2 className="mt-2 text-base sm:text-lg font-extrabold text-white">
                Next Price Drop Refresh In
              </h2>
              <p className="mt-1 mb-4 text-xs text-neutral-300">
                Lock in current catalog pricing before the weekly inventory rotation.
              </p>
              <div className="rounded-xl bg-white p-3 text-neutral-900 [&>div]:mb-0">
                <WeeklyCountdown />
              </div>
            </div>
          </div>
        </section>

        {/* Promo Cards */}
        <section
          aria-label="Promotional offers"
          className="mt-8 sm:mt-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {PROMO_HIGHLIGHTS.map((promo, index) => (
            <div
              key={promo.code}
              style={{ animationDelay: `${index * 60}ms` }}
              className={`animate-fade-up flex flex-col justify-between rounded-2xl border p-5 sm:p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${promo.accent}`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-md bg-neutral-950 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                    {promo.badge}
                  </span>
                  <span className="rounded-md border border-dashed border-[#eab308] bg-yellow-50 px-2.5 py-1 font-mono text-xs font-black text-neutral-950">
                    CODE: {promo.code}
                  </span>
                </div>
                <h2 className="mt-4 text-base sm:text-lg font-black text-neutral-900">{promo.title}</h2>
                <p className="mt-2 text-xs leading-5 text-neutral-600">{promo.description}</p>
              </div>

              <div className="mt-5 border-t border-neutral-200/70 pt-3">
                <Link
                  href={promo.href}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-neutral-950 hover:text-[#8a6b00] hover:underline"
                >
                  {promo.cta} <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Best Value Picks Grid */}
        <section className="mt-10 sm:mt-12">
          <div className="mb-6 flex flex-col gap-3 border-b border-neutral-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#806000]">
                Top Value Picks
              </span>
              <h2 className="mt-0.5 text-xl sm:text-2xl font-black text-neutral-900">
                Best-Priced Parts This Week
              </h2>
            </div>
            <Link
              href="/parts?sort=price-asc"
              className="inline-flex self-start sm:self-auto items-center gap-2 rounded-lg bg-[#facc15] px-4 py-2 text-xs font-extrabold text-neutral-950 transition hover:bg-[#eab308]"
            >
              View All by Lowest Price &rarr;
            </Link>
          </div>

          {featuredDeals.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featuredDeals.map((product) => (
                <DatabaseProductCard
                  key={product.id}
                  product={product}
                  listingImage
                  cardVariant="neutral"
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
              {catalogUnavailable
                ? 'Deals are temporarily unavailable while we reconnect to the parts catalog.'
                : 'No deal parts are currently listed in the catalog.'}
            </div>
          )}
        </section>

        {/* Engine & Transmission Deal Spotlights */}
        {(engineDeals.length > 0 || transmissionDeals.length > 0) && (
          <section className="mt-14 space-y-12">
            {engineDeals.length > 0 && (
              <div>
                <div className="mb-5 flex flex-col gap-2 border-b border-neutral-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#806000]">
                      Engine Department
                    </span>
                    <h3 className="text-xl font-black text-neutral-900">
                      Featured Engine Assembly Deals
                    </h3>
                  </div>
                  <Link
                    href="/parts?partType=engine&sort=price-asc"
                    className="text-xs font-extrabold text-neutral-900 hover:text-[#8a6b00] hover:underline"
                  >
                    See All Engine Deals &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {engineDeals.map((product) => (
                    <DatabaseProductCard
                      key={product.id}
                      product={product}
                      listingImage
                      cardVariant="neutral"
                    />
                  ))}
                </div>
              </div>
            )}

            {transmissionDeals.length > 0 && (
              <div>
                <div className="mb-5 flex flex-col gap-2 border-b border-neutral-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#806000]">
                      Transmission Department
                    </span>
                    <h3 className="text-xl font-black text-neutral-900">
                      Featured Transmission Deals
                    </h3>
                  </div>
                  <Link
                    href="/parts?partType=transmission&sort=price-asc"
                    className="text-xs font-extrabold text-neutral-900 hover:text-[#8a6b00] hover:underline"
                  >
                    See All Transmission Deals &rarr;
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {transmissionDeals.map((product) => (
                    <DatabaseProductCard
                      key={product.id}
                      product={product}
                      listingImage
                      cardVariant="neutral"
                    />
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
