import Link from 'next/link';
import { HeroArtworkCarousel } from '@/components/home/HeroArtworkCarousel';

export function VehicleFilterHero() {
  return (
    <section className="mx-auto max-w-[1720px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
      <div className="relative isolate min-h-[420px] overflow-hidden rounded-2xl bg-[#f5e9e2] sm:min-h-[470px] lg:min-h-[520px]">
        <div className="relative z-10 flex min-h-[420px] items-center px-6 py-12 sm:min-h-[470px] sm:px-10 lg:min-h-[520px] lg:px-16">
          <div className="max-w-[620px]">
            <span className="inline-flex rounded-full bg-[#ef263d] px-3 py-1 text-[11px] font-bold text-white sm:text-xs">
              PARTS YOU CAN COUNT ON
            </span>
            <h1 className="mt-5 max-w-[600px] text-4xl font-extrabold leading-[1.08] tracking-tight text-[#202126] sm:text-5xl lg:text-[64px]">
              The right parts for every mile.
            </h1>
            <p className="mt-5 max-w-[520px] text-base leading-7 text-[#77716f] sm:text-lg">
              Find quality replacement and performance parts for your next repair, upgrade, or weekend project.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-lg sm:text-xl">
              <span className="text-sm text-[#77716f]">Quality parts from</span>
              <span className="font-bold text-[#202126]">$54.99</span>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="#categories"
                className="inline-flex items-center gap-3 rounded-xl bg-[#ef263d] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d91f34] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef263d]"
              >
                Shop Auto Parts
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-[#161824] px-5 py-3 text-sm font-bold text-white transition hover:bg-neutral-800"
              >
                <span>Create Garage Account</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white/80 backdrop-blur px-4 py-3 text-sm font-bold text-[#202126] transition hover:border-[#ef263d] hover:text-[#ef263d]"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        <HeroArtworkCarousel />
      </div>
    </section>
  );
}
