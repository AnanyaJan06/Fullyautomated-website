'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AUTH_CHANGE_EVENT, authService } from '@/services/auth.service';
import type { User } from '@/types';

interface NavItem {
  label: string;
  href: string;
}

const CATEGORY_LINKS = [
  { label: 'Engines', href: '/parts?partType=engine' },
  { label: 'Transmissions', href: '/parts?partType=transmission' },
  { label: 'All Categories', href: '/#categories' },
];

export function MobileMenu({ navigation }: { navigation: NavItem[] }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const syncUser = () => setUser(authService.getStoredUser());
    syncUser();
    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  function handleSignOut() {
    authService.clearSession();
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={open}
        aria-controls="mobile-navigation-drawer"
        className="flex h-10 w-10 items-center justify-center rounded-lg text-neutral-900 transition hover:bg-neutral-100 active:scale-95"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[22px] w-[22px]"
        >
          {open ? (
            <path d="M6 6l12 12M18 6 6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <>
          <div
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="animate-fade-in fixed inset-0 z-40 bg-neutral-950/50 backdrop-blur-[2px]"
          />

          <nav
            id="mobile-navigation-drawer"
            aria-label="Mobile navigation"
            className="animate-fade-in fixed inset-y-0 left-0 z-50 flex w-[min(86vw,340px)] flex-col bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#facc15] text-lg font-black text-neutral-950">
                  A
                </span>
                <span className="text-xl font-extrabold tracking-tight text-neutral-950">
                  Automobilic<span className="text-[#c49a00]">.</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close navigation menu"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-950"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  className="h-5 w-5"
                >
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">
                Navigation
              </p>
              <div className="divide-y divide-neutral-100">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block py-3 text-sm font-bold transition ${
                        isActive
                          ? 'text-[#a88100]'
                          : 'text-neutral-800 hover:text-[#a88100]'
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-5 border-t border-neutral-200 pt-4">
                <p className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Browse Categories
                </p>
                <div className="space-y-1">
                  {CATEGORY_LINKS.map((cat) => (
                    <Link
                      key={cat.label}
                      href={cat.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-100 hover:text-neutral-950"
                    >
                      <span>{cat.label}</span>
                      <span aria-hidden="true" className="text-neutral-400">&rarr;</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-5 rounded-xl bg-neutral-950 p-4 text-white">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  24/7 Assistance
                </span>
                <a
                  href="tel:+18001234567890"
                  className="mt-1 block text-base font-black text-[#facc15] hover:underline"
                >
                  (800) 1234 5678 90
                </a>
              </div>
            </div>

            <div className="border-t border-neutral-200 bg-neutral-50 p-4">
              {user ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#facc15] text-xs font-black text-neutral-950">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-extrabold text-neutral-900">
                        {user.fullName}
                      </p>
                      <p className="truncate text-[11px] text-neutral-500">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full rounded-xl border border-neutral-300 bg-white py-2.5 text-center text-xs font-extrabold text-neutral-800 transition hover:bg-neutral-100"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl border border-neutral-300 bg-white py-2.5 text-center text-xs font-extrabold text-neutral-900 transition hover:bg-neutral-100"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl bg-[#facc15] py-2.5 text-center text-xs font-extrabold text-neutral-950 transition hover:bg-[#eab308]"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}
