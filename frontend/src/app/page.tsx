import Image from 'next/image';
import { GEARUP_CATEGORIES, GEARUP_PRODUCTS } from '@/data/gearup-data';
import { VehicleFilterHero } from '@/components/home/VehicleFilterHero';
import { VehicleSearch } from '@/components/home/VehicleSearch';
import { ProductCard } from '@/components/home/ProductCard';
import { ProductTabsSection } from '@/components/home/ProductTabsSection';

export default function HomePage() {
  const dealProducts = GEARUP_PRODUCTS.slice(0, 3);

  return (
    <main className="pb-12">
      {/* 1. Hero Section + Vehicle Garage Fitment Finder */}
      <VehicleFilterHero />

      {/* Vehicle fitment search */}
      <VehicleSearch />

      {/* 2. Service Guarantees Bar */}
      <section className="mx-auto mt-8 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: 'shipping', title: 'Fast, reliable shipping', desc: 'Free delivery on orders over $150' },
            { icon: 'fitment', title: 'Fitment confidence', desc: 'Parts selected for your vehicle' },
            { icon: 'returns', title: 'Easy 30-day returns', desc: 'Simple returns on eligible orders' },
            { icon: 'support', title: 'Parts support', desc: 'Get help finding the right part' },
          ].map((item, index) => (
            <div
              key={item.icon}
              style={{ animationDelay: `${index * 60}ms` }}
              className="animate-fade-up group flex min-h-[112px] items-center gap-4 border-neutral-100 p-5 transition-colors hover:bg-neutral-50 sm:border-r sm:px-6 sm:last:border-r-0 lg:border-b-0"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-[#d92727] ring-1 ring-inset ring-red-100 transition-all duration-200 group-hover:bg-[#d92727] group-hover:text-white group-hover:ring-[#d92727]">
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                  {item.icon === 'shipping' && <><path d="M3 7h11v10H3z" /><path d="M14 10h4l3 3v4h-7z" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="17.5" cy="18" r="1.5" /><path d="M5 10h5M5 13h3" /></>}
                  {item.icon === 'fitment' && <><path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z" /><circle cx="12" cy="10" r="2.5" /><path d="m9.5 16 1.5 1.5 3.5-3.5" /></>}
                  {item.icon === 'returns' && <><path d="M3 11a9 9 0 1 1 2.2 6" /><path d="M3 5v6h6" /><path d="M12 7v5l3 2" /></>}
                  {item.icon === 'support' && <><path d="M4 13v-2a8 8 0 0 1 16 0v2" /><path d="M4 13h3v6H6a2 2 0 0 1-2-2zM20 13h-3v6h1a2 2 0 0 0 2-2z" /><path d="M17 19a5 5 0 0 1-5 2" /></>}
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Browse auto categories (2 Core Part Types: Engine & Transmission) */}
      <section id="categories" className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 border-b border-neutral-200 pb-4 mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-black text-neutral-900 mt-0.5">
              Popular Auto Parts Categories
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {GEARUP_CATEGORIES.map((cat, idx) => (
            <div
              key={cat.id}
              style={{ animationDelay: `${idx * 100}ms` }}
              className={`animate-fade-up group relative flex min-h-[270px] items-stretch overflow-hidden rounded-lg text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:min-h-[310px] ${cat.slug === 'engine' ? 'bg-[#075291]' : 'bg-[#bd3d1e]'}`}
            >
              <Image
                src={cat.slug === 'engine' ? '/images/engines.jpg' : '/images/transmissions.jpg'}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" aria-hidden="true" />
              <div className="relative z-10 flex w-[58%] flex-col items-start p-6 sm:p-8">
                <span className="rounded-md bg-emerald-500 px-2.5 py-1 text-[10px] font-extrabold text-white sm:text-xs">
                  {cat.slug === 'engine' ? 'Top Brands' : 'Up to 40% Off'}
                </span>
                <h3 className="mt-3 max-w-[12ch] text-3xl font-black uppercase leading-[1.05] tracking-tight sm:text-4xl">
                  {cat.name} Essentials
                </h3>
                <p className="mt-2 text-sm font-semibold text-white/90 sm:text-base">
                  {cat.slug === 'engine' ? 'Maximize & Maintain' : 'Power through every drive'}
                </p>
                <a
                  href={`#part-search?partType=${cat.slug}`}
                  className="mt-auto inline-flex items-center gap-3 rounded-md bg-white px-4 py-2.5 text-xs font-extrabold text-neutral-900 transition-colors hover:bg-neutral-100 sm:text-sm"
                >
                  Shop now <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Deals of the week */}
      <section id="deals" className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-2 border-[#e51515] bg-red-50/20 p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Left Deal Countdown Info */}
            <div className="lg:col-span-3">
              <span className="inline-block bg-[#e51515] text-white text-[11px] font-extrabold uppercase px-3 py-1 rounded mb-3">
                Flash Deals of the Week
              </span>
              <h2 className="text-2xl font-black text-neutral-900 leading-tight">
                Don&apos;t Miss Out On Track-Ready Bundles
              </h2>
              <p className="text-xs text-neutral-600 mt-2 mb-5">
                Limited warehouse stock on Brembo, Michelin, and Matrix LED assemblies. Prices reset when timer expires!
              </p>

              {/* Countdown Timer Boxes */}
              <div className="flex items-center gap-2 mb-5">
                {[
                  { val: '02', label: 'Days' },
                  { val: '14', label: 'Hrs' },
                  { val: '38', label: 'Mins' },
                  { val: '52', label: 'Secs' },
                ].map((t, i) => (
                  <div
                    key={i}
                    className="bg-[#161824] text-white rounded-lg px-3 py-2 text-center min-w-[54px]"
                  >
                    <span className="block text-base font-black leading-none">{t.val}</span>
                    <span className="text-[10px] text-neutral-400 uppercase">{t.label}</span>
                  </div>
                ))}
              </div>

              <a
                href="#products"
                className="inline-block bg-neutral-900 hover:bg-[#e51515] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-all duration-200 active:scale-[0.98]"
              >
                View All 24 Flash Deals &rarr;
              </a>
            </div>

            {/* Right 3 Deal Product Cards */}
            <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {dealProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Parts expert support and service benefits */}
      <section className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-lg bg-[#0870b8] px-6 py-7 text-white shadow-sm sm:px-10 lg:px-16">
          <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Need Help Finding the Right Product?
              </h2>
              <p className="mt-1 text-sm text-blue-100 sm:text-base">
                Our Parts Experts Can Help. Call for immediate assistance.
              </p>
            </div>
            <a
              href="tel:+18001234567890"
              className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-bold text-neutral-900 transition-colors hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Request a Call
            </a>
            <a href="tel:+18001234567890" className="text-center transition-opacity hover:opacity-80">
              <span className="block text-xl font-extrabold sm:text-2xl">+(800) 1234 5678 90</span>
              <span className="mt-0.5 block text-xs text-blue-100 sm:text-sm">You can contact us 24/7.</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 border-b border-neutral-200 py-7 sm:grid-cols-3 sm:py-8">
          {[
            { icon: 'quality', title: 'Original Products', desc: 'Quality parts from trusted brands.' },
            { icon: 'price', title: 'Affordable Rates', desc: 'Great value across our catalog.' },
            { icon: 'variety', title: 'Wide variety', desc: 'Find the right parts for your vehicle.' },
          ].map((benefit, index) => (
            <div
              key={benefit.icon}
              className={`flex items-center gap-4 px-5 py-4 sm:px-8 ${index < 2 ? 'sm:border-r sm:border-neutral-200' : ''}`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center text-[#0870b8]">
                <svg aria-hidden="true" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-11 w-11">
                  {benefit.icon === 'quality' && <><path d="m24 5 5 3 6-1 2 6 5 4-3 6 1 6-6 2-4 5-6-3-6 2-3-6-5-3 2-6-2-6 6-3 3-6z" /><circle cx="24" cy="21" r="8" /><path d="m18 31-2 11 8-4 8 4-2-11" /><path d="m21 21 2 2 4-5" /></>}
                  {benefit.icon === 'price' && <><path d="M8 12h26v16H8z" /><path d="M12 16h18M12 24h8" /><circle cx="28" cy="22" r="3" /><path d="M12 32h26v5H12zM7 37h5" /><path d="m17 9 3-4 4 4" /></>}
                  {benefit.icon === 'variety' && <><circle cx="23" cy="23" r="17" /><circle cx="23" cy="23" r="12" /><circle cx="23" cy="23" r="7" /><path d="m23 23 15-15M31 8h7v7" /><path d="m20 26 3-3 4 1" /></>}
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-neutral-900 sm:text-base">{benefit.title}</h3>
                <p className="mt-1 text-xs leading-5 text-neutral-500 sm:text-sm">{benefit.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Tabbed Product Catalog Section */}
      <ProductTabsSection />
    </main>
  );
}
