import Link from 'next/link';
import type { ReactNode } from 'react';
import { HeaderAuthActions } from './HeaderAuthActions';

const navigation = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/#products' },
  { label: 'Categories', href: '/#categories' },
  { label: 'Deals', href: '/#deals' },
  { label: 'Contact', href: '/#contact' },
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
      className="h-[22px] w-[22px]"
    >
      {children}
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <details className="group relative lg:hidden">
          <summary
            aria-label="Toggle navigation menu"
            className="list-none rounded-md p-2 text-[#202126] hover:bg-neutral-100 [&::-webkit-details-marker]:hidden"
          >
            <LineIcon>
              <path d="M4 7h16M4 12h16M4 17h16" />
            </LineIcon>
          </summary>
          <nav
            aria-label="Mobile navigation"
            className="absolute left-0 top-[calc(100%+19px)] z-50 w-screen border-y border-neutral-100 bg-white px-5 py-4 shadow-lg"
          >
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block border-b border-neutral-100 py-3 text-sm font-medium text-[#292a2d]"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 flex items-center gap-3 pt-2">
              <Link
                href="/login"
                className="flex-1 rounded-xl border border-neutral-200 py-2.5 text-center text-xs font-extrabold text-[#202126]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex-1 rounded-xl bg-[#ef263d] py-2.5 text-center text-xs font-extrabold text-white"
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </details>

        <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label="Gearup home">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#ef263d] text-xl font-black text-white">
            G
          </span>
          <span className="text-[26px] font-extrabold leading-none tracking-tight text-[#202126]">
            Gearup<span className="text-[#ef263d]">.</span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-[#292a2d] transition hover:text-[#ef263d]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <Link
            href="/#products"
            aria-label="Search products"
            className="rounded-full p-2 text-[#202126] transition hover:bg-neutral-100 hover:text-[#ef263d]"
          >
            <LineIcon>
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4 4" />
            </LineIcon>
          </Link>
          <Link
            href="/wishlist"
            aria-label="Wishlist"
            className="hidden rounded-full p-2 text-[#202126] transition hover:bg-neutral-100 hover:text-[#ef263d] md:block"
          >
            <LineIcon>
              <path d="M20.8 8.7c0 4.1-8.8 10-8.8 10s-8.8-5.9-8.8-10a4.6 4.6 0 0 1 8.8-1.9 4.6 4.6 0 0 1 8.8 1.9Z" />
            </LineIcon>
          </Link>
          <Link
            href="/cart"
            aria-label="Shopping cart"
            className="rounded-full p-2 text-[#202126] transition hover:bg-neutral-100 hover:text-[#ef263d]"
          >
            <LineIcon>
              <path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L21 8H6" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </LineIcon>
          </Link>

          <div className="h-5 w-px bg-neutral-200 hidden sm:block mx-0.5" />

          <HeaderAuthActions />
        </div>
      </div>
    </header>
  );
}
