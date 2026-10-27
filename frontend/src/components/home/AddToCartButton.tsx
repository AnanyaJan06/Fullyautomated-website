'use client';

import { useState } from 'react';

export function AddToCartButton() {
  const [added, setAdded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setAdded(true)}
      aria-live="polite"
      className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs font-bold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e51515] ${
        added ? 'bg-emerald-600 text-white' : 'bg-neutral-900 text-white hover:bg-[#e51515]'
      }`}
    >
      {added ? 'Added to Cart' : 'Add to Cart'}
    </button>
  );
}
