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
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
        >
          <span>✓ In Cart</span>
        </button>
        <Link
          href="/cart"
          className="inline-flex items-center justify-center rounded-lg border border-neutral-900 bg-neutral-900 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#e51515] hover:border-[#e51515]"
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
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-neutral-900 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-[#e51515] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e51515] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'loading' ? 'Adding to Cart...' : 'Add to Cart'}
      </button>
      {status === 'error' && (
        <p className="mt-1 text-[11px] font-medium text-red-600">
          Could not add to cart. Check backend connection.
        </p>
      )}
    </div>
  );
}
