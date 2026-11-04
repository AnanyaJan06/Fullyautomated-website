'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cartService } from '@/services/cart.service';
import type { AddCartItemPayload } from '@/types';

export function AddToCartButton({ item }: { item: AddCartItemPayload }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'added' | 'error'>('idle');

  async function handleAddToCart() {
    setStatus('loading');
    try {
      await cartService.addItem(item);
      setStatus('added');
    } catch {
      setStatus('error');
    }
  }

  if (status === 'added') {
    return (
      <div className="animate-scale-in flex items-center gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98]"
        >
          <span>✓ In Cart</span>
        </button>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center rounded-lg border border-neutral-900 bg-neutral-900 px-3 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:border-[#e51515] hover:bg-[#e51515] active:scale-[0.98]"
        >
          View Cart →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <button
        type="button"
        disabled={status === 'loading'}
        onClick={handleAddToCart}
        aria-live="polite"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white transition-all duration-200 hover:bg-[#e51515] active:scale-[0.98] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e51515] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {status === 'loading' && (
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-3.5 w-3.5 animate-spin text-white"
          >
            <circle
              cx="12"
              cy="12"
              r="9"
              stroke="currentColor"
              strokeWidth="2.5"
              className="opacity-25"
            />
            <path
              d="M21 12a9 9 0 0 0-9-9"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        )}
        {status === 'loading' ? 'Adding to Cart...' : 'Add to Cart'}
      </button>
      {status === 'error' && (
        <p className="animate-fade-in mt-1 text-[11px] font-medium text-red-600">
          Could not add to cart. Check backend connection.
        </p>
      )}
    </div>
  );
}
