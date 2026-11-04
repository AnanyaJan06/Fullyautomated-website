export default function Loading() {
  return (
    <main className="pb-12" aria-busy="true" aria-label="Loading page content">
      {/* Hero Skeleton */}
      <section className="mx-auto max-w-[1720px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <div className="min-h-[420px] rounded-2xl border border-neutral-200/80 bg-neutral-100/70 p-6 sm:min-h-[470px] sm:p-10 lg:min-h-[520px] lg:p-16 flex items-center">
          <div className="w-full max-w-[580px] space-y-4">
            <div className="h-6 w-44 rounded-full skeleton-shimmer" />
            <div className="h-12 w-full rounded-xl skeleton-shimmer" />
            <div className="h-12 w-4/5 rounded-xl skeleton-shimmer" />
            <div className="h-5 w-3/4 rounded-lg skeleton-shimmer" />
            <div className="pt-3 flex gap-3">
              <div className="h-11 w-36 rounded-xl skeleton-shimmer" />
              <div className="h-11 w-44 rounded-xl skeleton-shimmer" />
            </div>
          </div>
        </div>
      </section>

      {/* Fitment Search Bar Skeleton */}
      <section className="mx-auto mt-4 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3.5 w-20 rounded skeleton-shimmer" />
              <div className="h-[42px] w-full rounded-md skeleton-shimmer" />
            </div>
          ))}
        </div>
      </section>

      {/* Department Section Skeleton (Engine & Transmission) */}
      <section className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between border-b border-neutral-200 pb-4">
          <div className="space-y-2">
            <div className="h-3.5 w-32 rounded skeleton-shimmer" />
            <div className="h-7 w-72 rounded-lg skeleton-shimmer" />
          </div>
          <div className="h-6 w-48 rounded-full skeleton-shimmer hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-7 space-y-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2.5 flex-1">
                  <div className="h-5 w-48 rounded skeleton-shimmer" />
                  <div className="h-8 w-40 rounded-lg skeleton-shimmer" />
                </div>
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl skeleton-shimmer shrink-0" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full rounded skeleton-shimmer" />
                <div className="h-4 w-4/5 rounded skeleton-shimmer" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-36 rounded-lg skeleton-shimmer" />
                <div className="h-6 w-32 rounded-lg skeleton-shimmer" />
              </div>
              <div className="h-10 w-44 rounded-xl skeleton-shimmer" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
