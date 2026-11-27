'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AUTH_CHANGE_EVENT, authService } from '@/services/auth.service';
import { User } from '@/types';

const ACCOUNT_BADGES: Record<User['accountType'], string> = {
  enthusiast: 'GARAGE MEMBER',
  mechanic_shop: 'PRO MECHANIC',
  fleet: 'FLEET COMMERCIAL',
};

export function HeaderAuthActions() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncUser = () => {
      setUser(authService.getStoredUser());
    };
    syncUser();

    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    window.addEventListener('storage', syncUser);
    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSignOut = () => {
    authService.clearSession();
    setOpen(false);
    router.push('/');
    router.refresh();
  };

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="User profile and account options"
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative flex items-center justify-center rounded-full p-2 text-neutral-900 transition-all duration-200 hover:bg-neutral-100 hover:text-[#a88100] active:scale-95"
      >
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
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c1.8-3.8 5-6 8-6s6.2 2.2 8 6" />
        </svg>
        {user && (
          <span
            title={`Signed in as ${user.fullName}`}
            className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"
          />
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 w-56 max-w-[calc(100vw-2rem)] rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl"
        >
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 border-b border-neutral-100 pb-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#facc15] text-xs font-black text-neutral-950">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 text-left leading-tight">
                  <p className="truncate text-xs font-extrabold text-[#202126]">
                    {user.fullName}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#806000]">
                    {ACCOUNT_BADGES[user.accountType] || 'GARAGE MEMBER'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                role="menuitem"
                onClick={handleSignOut}
                className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-center text-xs font-bold text-neutral-800 transition hover:border-[#eab308] hover:bg-white hover:text-[#806000]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <p className="px-1 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                My Account
              </p>
              <Link
                href="/login"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2.5 text-center text-xs font-extrabold text-neutral-900 transition hover:border-[#eab308] hover:text-[#806000]"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                role="menuitem"
                onClick={() => setOpen(false)}
                className="rounded-xl bg-[#facc15] px-4 py-2.5 text-center text-xs font-extrabold text-neutral-950 shadow-sm transition hover:bg-[#eab308]"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
