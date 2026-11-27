export default function PartDetailsLoading() {
  return (
    <main
      aria-label="Loading part details"
      className="mx-auto min-h-[70vh] max-w-[1440px] animate-pulse bg-neutral-50/70 px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-8"
    >
      <div className="mb-6 h-4 w-48 rounded bg-neutral-200" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px] xl:gap-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-5">
          <div className="h-[250px] rounded-lg bg-neutral-200 min-[420px]:h-[300px] sm:h-[380px] lg:h-[420px]" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-14 rounded-md bg-neutral-100" />
            ))}
          </div>
        </div>
        <div className="space-y-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7 xl:border-0 xl:bg-transparent xl:p-2 xl:shadow-none">
          <div className="h-6 w-36 rounded-full bg-neutral-200" />
          <div className="h-10 w-4/5 rounded bg-neutral-200" />
          <div className="h-5 w-2/3 rounded bg-neutral-100" />
          <div className="h-24 rounded-xl bg-neutral-100" />
          <div className="h-20 rounded bg-neutral-100" />
        </div>
        <div className="space-y-5 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm lg:col-span-2 xl:col-span-1">
          <div className="h-9 w-2/3 rounded bg-neutral-200" />
          <div className="h-32 rounded bg-neutral-100" />
          <div className="h-12 rounded bg-neutral-200" />
        </div>
      </div>
      <div className="mt-7 h-[420px] rounded-xl border border-neutral-200 bg-white shadow-sm" />
    </main>
  );
}
