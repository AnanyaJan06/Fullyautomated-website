import Link from 'next/link';
import type { ReactNode } from 'react';
import { HeaderAuthActions } from './HeaderAuthActions';
import { HeaderCartLink } from './HeaderCartLink';
import { MobileMenu } from './MobileMenu';

const navigation = [
  { label: 'Shop', href: '/parts' },
  { label: 'Deals', href: '/deals' },
  { label: 'Contact', href: '/contact' },
  { label: 'Order Tracking', href: '/cart' },
  { label: 'FAQ', href: '/faq' },
];

function LineIcon({ children }: { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-[21px] w-[21px]"
    >
      {children}
    </svg>
  );
}

function SearchForm({
  idPrefix,
  className = '',
}: {
  idPrefix: string;
  className?: string;
}) {
  return (
    <form
      action="/parts"
      role="search"
      className={`flex h-11 min-w-0 items-center overflow-hidden rounded-full border border-neutral-300 bg-white transition focus-within:border-[#eab308] focus-within:ring-2 focus-within:ring-[#eab308]/20 ${className}`}
    >
      <label className="sr-only" htmlFor={`${idPrefix}-query`}>Search parts</label>
      <input
        id={`${idPrefix}-query`}
        name="q"
        type="search"
        placeholder="Search parts..."
        className="h-full min-w-0 flex-1 bg-transparent px-4 text-xs text-neutral-900 outline-none placeholder:text-neutral-400"
      />
      <button
        type="submit"
        aria-label="Search parts"
        className="flex h-full w-12 shrink-0 items-center justify-center bg-[#facc15] text-neutral-950 transition hover:bg-[#eab308] focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-950"
      >
        <LineIcon>
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4 4" />
        </LineIcon>
      </button>
    </form>
  );
}

export function Header() {
  return (
    <header className="relative z-50">
      <div className="border-b border-neutral-200 bg-neutral-50">
        <div className="mx-auto flex min-h-[36px] max-w-[1440px] items-center justify-center gap-4 px-4 py-1.5 text-xs font-medium text-neutral-700 sm:h-11 sm:justify-between sm:px-6 sm:text-sm lg:px-8">
          <span className="hidden text-[13px] sm:inline">Parts for every mile.</span>
          <span className="text-center text-xs font-extrabold text-neutral-950 sm:text-sm">
            Free delivery on orders over $150
          </span>
        </div>
      </div>

      <div className="bg-white py-1 sm:py-2">
        <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between gap-2 px-4 sm:h-[74px] sm:gap-3 sm:px-6 lg:h-[84px] lg:px-8">
          <MobileMenu navigation={navigation} />

          <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-2.5" aria-label="Automobilic home">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#facc15] text-lg font-black text-neutral-950 sm:h-10 sm:w-10 sm:text-xl">A</span>
            <span className="text-lg font-extrabold leading-none tracking-tight text-neutral-950 min-[360px]:text-xl sm:text-[25px]">
              Automobilic<span className="text-[#c49a00]">.</span>
            </span>
          </Link>

          <SearchForm idPrefix="desktop-search" className="hidden w-full max-w-[560px] lg:flex" />

          <div className="flex shrink-0 items-center gap-1 sm:gap-2.5">
            <HeaderAuthActions />
            <HeaderCartLink />
          </div>
        </div>

        <div className="px-4 pb-3 pt-1 lg:hidden sm:px-6">
          <SearchForm idPrefix="mobile-search" className="w-full" />
        </div>
      </div>

      <div className="bg-neutral-950 text-white">
        <div className="mx-auto flex min-h-[46px] max-w-[1440px] items-stretch px-4 sm:min-h-[48px] sm:px-6 lg:px-8">
          <details className="group relative hidden shrink-0 lg:block">
            <summary className="flex h-full min-w-[238px] cursor-pointer list-none items-center justify-between gap-5 bg-[#facc15] px-5 text-xs font-extrabold uppercase tracking-wide text-neutral-950 transition hover:bg-[#eab308] [&::-webkit-details-marker]:hidden">
              <span className="flex items-center gap-3">
                <LineIcon><path d="M4 6h16M4 12h16M4 18h16" /></LineIcon>
                Browse Categories
              </span>
              <svg aria-hidden="true" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </summary>
            <div className="absolute left-0 top-full z-50 min-w-full border border-neutral-200 bg-white py-2 text-neutral-900 shadow-xl">
              <Link href="/parts?partType=engine" className="block px-5 py-3 text-sm font-semibold transition hover:bg-neutral-100">Engines</Link>
              <Link href="/parts?partType=transmission" className="block px-5 py-3 text-sm font-semibold transition hover:bg-neutral-100">Transmissions</Link>
              <Link href="/#categories" className="block px-5 py-3 text-sm font-semibold transition hover:bg-neutral-100">All Categories</Link>
            </div>
          </details>

          <nav aria-label="Main navigation" className="no-scrollbar flex min-w-0 flex-1 items-center justify-start gap-5 overflow-x-auto py-3 text-[11px] font-bold uppercase tracking-wide sm:justify-center sm:gap-7 lg:gap-10 2xl:gap-12">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className="shrink-0 whitespace-nowrap text-neutral-100 transition hover:text-[#facc15]">
                {item.label}
              </Link>
            ))}
          </nav>

          <a href="tel:+18001234567890" className="hidden shrink-0 items-center gap-2.5 border-l border-white/20 pl-7 text-xs font-bold text-neutral-100 transition hover:text-white xl:flex 2xl:ml-3">
            <span>24/7 Assistance:</span>
            <span className="text-sm font-black tracking-wide text-[#facc15] 2xl:text-base">(800) 1234 5678 90</span>
          </a>

        </div>
      </div>
    </header>
  );
}
