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
        <div className="grid grid-cols-1 gap-4 border-b border-neutral-100 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {[
            {
              icon: '🚚',
              title: 'Fast, reliable shipping',
              desc: 'Free delivery on orders over $150',
            },
            {
              icon: '🛡️',
              title: 'Fitment confidence',
              desc: 'Parts selected for your vehicle',
            },
            {
              icon: '🔄',
              title: 'Easy 30-day returns',
              desc: 'Simple returns on eligible orders',
            },
            {
              icon: '🎧',
              title: 'Parts support',
              desc: 'Get help finding the right part',
            },
          ].map((item, index) => (
            <div key={index} className="flex items-start gap-4 px-2 py-1">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-200 text-xl font-medium text-cyan-500">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-neutral-900">{item.title}</h3>
                <p className="mt-1 text-xs leading-5 text-neutral-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Browse auto categories */}
      <section id="categories" className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between border-b border-neutral-200 pb-4 mb-6">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#e51515]">
              Shop By Department
            </span>
            <h2 className="text-2xl font-black text-neutral-900 mt-0.5">
              Popular Auto Parts Categories
            </h2>
          </div>
          <a
            href="#products"
            className="text-xs font-bold text-[#e51515] hover:underline hidden sm:inline"
          >
            View All 68+ Categories →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {GEARUP_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="group bg-white rounded-2xl border border-neutral-200 hover:border-[#e51515] p-5 flex items-start justify-between gap-4 transition shadow-sm hover:shadow-md"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-neutral-900 group-hover:text-[#e51515] transition">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                    {cat.itemCount}
                  </span>
                </div>

                <ul className="mt-3 space-y-1.5 text-xs text-neutral-500">
                  {cat.subcategories.map((sub, i) => (
                    <li key={i}>
                      <a href="#products" className="hover:text-[#e51515] transition">
                        {sub}
                      </a>
                    </li>
                  ))}
                </ul>

                <a
                  href="#products"
                  className="inline-block mt-4 text-xs font-bold text-neutral-900 group-hover:text-[#e51515]"
                >
                  Shop {cat.name.split(' ')[0]} →
                </a>
              </div>

              <div className="w-20 h-20 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-4xl shrink-0 group-hover:scale-105 transition">
                {cat.icon}
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
                className="inline-block bg-neutral-900 hover:bg-[#e51515] text-white text-xs font-bold px-5 py-2.5 rounded-lg transition"
              >
                View All 24 Flash Deals →
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

      {/* 5. Dual Mid-Page Promotional Banners */}
      <section className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-gradient-to-r from-[#161824] to-[#25293e] text-white p-7 flex items-center justify-between gap-4">
            <div>
              <span className="inline-block bg-amber-400 text-neutral-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded mb-2">
                German Engineered
              </span>
              <h3 className="text-xl font-black">
                Full-Synthetic Motor Oils &amp; Additives
              </h3>
              <p className="text-xs text-neutral-300 mt-1 mb-4 max-w-sm">
                Keep your turbo &amp; high-mileage engine protected with Liqui Moly and Motul 5W-40 kits.
              </p>
              <a
                href="#products"
                className="inline-block bg-[#e51515] hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition"
              >
                Shop Service Kits →
              </a>
            </div>
            <div className="text-6xl hidden sm:flex w-24 h-24 rounded-2xl bg-white/10 items-center justify-center shrink-0">
              🛢️
            </div>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-[#2c1215] to-[#161824] text-white p-7 flex items-center justify-between gap-4">
            <div>
              <span className="inline-block bg-[#e51515] text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded mb-2">
                Track &amp; Street Series
              </span>
              <h3 className="text-xl font-black">
                Coilover Suspension &amp; Sway Bar Kits
              </h3>
              <p className="text-xs text-neutral-300 mt-1 mb-4 max-w-sm">
                Precision ride height and 10-stage damping control from Bilstein, KW, and Ohlins.
              </p>
              <a
                href="#products"
                className="inline-block bg-white hover:bg-neutral-200 text-neutral-900 text-xs font-bold px-4 py-2 rounded-lg transition"
              >
                Shop Suspension →
              </a>
            </div>
            <div className="text-6xl hidden sm:flex w-24 h-24 rounded-2xl bg-white/10 items-center justify-center shrink-0">
              🔧
            </div>
          </div>
        </div>
      </section>

      {/* 6. Tabbed Product Catalog Section */}
      <ProductTabsSection />
    </main>
  );
}
