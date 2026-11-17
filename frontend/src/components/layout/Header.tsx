import Link from 'next/link';
import type { ReactNode } from 'react';
import { HeaderAuthActions } from './HeaderAuthActions';
import { HeaderCartLink } from './HeaderCartLink';

const navigation = [
  { label: 'Shop', href: '/parts' },
  { label: 'Deals', href: '/#deals' },
  { label: 'Contact', href: '/#contact' },
  { label: 'Order Tracking', href: '/cart' },
  { label: 'FAQ', href: '/#contact' },
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
      <div className="hidden border-b border-neutral-200 bg-neutral-50 sm:block">
        <div className="mx-auto flex h-12 max-w-[1440px] items-center justify-between gap-4 px-4 text-sm font-medium text-neutral-700 sm:px-6 lg:px-8">
          <span className="text-[13px]">Parts for every mile.</span>
          <span className="text-sm font-extrabold text-neutral-950">Free delivery on orders over $150</span>
        </div>
      </div>

      <div className="mt-4 mb-4 bg-white">
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:h-[88px] lg:px-8">
          <details className="group relative lg:hidden">
            <summary
              aria-label="Toggle navigation menu"
              className="list-none rounded-md p-2 text-neutral-900 hover:bg-neutral-100 [&::-webkit-details-marker]:hidden"
            >
              <LineIcon><path d="M4 7h16M4 12h16M4 17h16" /></LineIcon>
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute left-0 top-[calc(100%+22px)] z-50 w-screen border-y border-neutral-200 bg-white px-5 py-4 shadow-xl"
            >
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block border-b border-neutral-100 py-3 text-sm font-semibold text-neutral-800 transition hover:text-[#a88100]"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 flex items-center gap-3 pt-2">
                <Link href="/login" className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-center text-xs font-bold text-neutral-900">Sign In</Link>
                <Link href="/signup" className="flex-1 rounded-xl bg-[#facc15] py-2.5 text-center text-xs font-bold text-neutral-950">Sign Up</Link>
              </div>
            </nav>
          </details>

          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Automobilic home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#facc15] text-xl font-black text-neutral-950">A</span>
            <span className="hidden text-[25px] font-extrabold leading-none tracking-tight text-neutral-950 min-[420px]:inline">
              Automobilic<span className="text-[#c49a00]">.</span>
            </span>
          </Link>

          <SearchForm idPrefix="desktop-search" className="hidden w-full max-w-[560px] lg:flex" />

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <HeaderAuthActions />
            <HeaderCartLink />
          </div>
        </div>

        <div className="px-4 pb-3 lg:hidden sm:px-6">
          <SearchForm idPrefix="mobile-search" className="w-full" />
        </div>
      </div>

      <div className="bg-neutral-950 text-white">
        <div className="mx-auto flex min-h-[48px] max-w-[1440px] items-stretch px-4 sm:px-6 lg:px-8">
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

          <nav aria-label="Main navigation" className="flex min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto text-[11px] font-bold uppercase tracking-wide sm:gap-7 lg:gap-10 2xl:gap-12">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className="whitespace-nowrap text-neutral-100 transition hover:text-[#facc15]">
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
