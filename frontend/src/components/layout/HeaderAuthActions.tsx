'use client';

import React, { useEffect, useState } from 'react';
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  const handleSignOut = () => {
    authService.clearSession();
    router.push('/');
    router.refresh();
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/login"
          className="rounded-xl border border-neutral-200 px-3.5 py-2 text-xs font-bold text-[#202126] transition hover:border-[#ef263d] hover:text-[#ef263d]"
        >
          Sign In
        </Link>
        <Link
          href="/signup"
          className="rounded-xl bg-[#ef263d] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-[#d91f34]"
        >
          Sign Up
        </Link>
      </div>
    );
  }

  if (user) {
    const vehicleLabel =
      user.primaryVehicle?.year && user.primaryVehicle?.make
        ? `${user.primaryVehicle.year} ${user.primaryVehicle.make} ${user.primaryVehicle.model || ''}`.trim()
        : null;

    return (
      <div className="flex items-center gap-2.5">
        {vehicleLabel && (
          <div className="hidden xl:flex items-center gap-1.5 rounded-full bg-neutral-900 px-3 py-1.5 text-[11px] font-bold text-white">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            <span>My Garage: {vehicleLabel}</span>
          </div>
        )}

        <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ef263d] text-xs font-black text-white">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div className="hidden sm:block text-left leading-tight">
            <p className="text-xs font-extrabold text-[#202126] truncate max-w-[120px]">
              {user.fullName}
            </p>
            <p className="text-[9px] font-bold uppercase tracking-wider text-[#ef263d]">
              {ACCOUNT_BADGES[user.accountType] || 'GARAGE MEMBER'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="ml-1 rounded-lg bg-white border border-neutral-200 px-2.5 py-1 text-[11px] font-bold text-neutral-700 transition hover:border-[#ef263d] hover:text-[#ef263d]"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="rounded-xl border border-neutral-200 bg-white px-3.5 py-2 text-xs font-extrabold text-[#202126] transition hover:border-[#ef263d] hover:text-[#ef263d]"
      >
        Sign In
      </Link>
      <Link
        href="/signup"
        className="rounded-xl bg-[#ef263d] px-4 py-2 text-xs font-extrabold text-white shadow-sm transition hover:bg-[#d91f34]"
      >
        Sign Up
      </Link>
    </div>
  );
}
