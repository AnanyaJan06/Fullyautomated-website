'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CART_CHANGE_EVENT, cartService } from '@/services/cart.service';

export function HeaderCartLink() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const syncFromCache = () => {
      const cached = cartService.getCachedCart();
      if (cached?.summary) {
        setCount(cached.summary.totalQuantity || 0);
      }
    };

    syncFromCache();
    void cartService
      .getCart()
      .then((cart) => {
        setCount(cart.summary?.totalQuantity || 0);
      })
      .catch(() => {
        // Ignore if backend is offline on initial load
      });

    window.addEventListener(CART_CHANGE_EVENT, syncFromCache);
    window.addEventListener('storage', syncFromCache);
    return () => {
      window.removeEventListener(CART_CHANGE_EVENT, syncFromCache);
      window.removeEventListener('storage', syncFromCache);
    };
  }, []);

  return (
    <Link
      href="/cart"
      aria-label={`Shopping cart (${count} items)`}
      className="relative rounded-full p-2 text-[#202126] transition hover:bg-neutral-100 hover:text-[#ef263d]"
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
        <path d="M3 4h2l2.1 11.1a2 2 0 0 0 2 1.6h8.7a2 2 0 0 0 1.9-1.5L21 8H6" />
        <circle cx="10" cy="20" r="1" />
        <circle cx="18" cy="20" r="1" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#ef263d] px-1 text-[10px] font-extrabold text-white shadow-sm">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  );
}
