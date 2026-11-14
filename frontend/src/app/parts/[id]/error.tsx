'use client';

export default function PartDetailsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-[#d92727]">Part details unavailable</p>
      <h1 className="mt-2 text-2xl font-black text-neutral-950">We couldn’t load this part</h1>
      <p className="mt-2 max-w-lg text-sm leading-6 text-neutral-600">
        Please check your connection and try again. Your cart and search are still available.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-lg bg-[#d92727] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#b91f1f] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d92727]"
      >
        Try again
      </button>
    </main>
  );
}
