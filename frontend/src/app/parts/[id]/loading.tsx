export default function PartDetailsLoading() {
  return (
    <main
      aria-label="Loading part details"
      className="mx-auto min-h-[70vh] max-w-[1200px] animate-pulse px-4 py-8 sm:px-6 lg:px-8"
    >
      <div className="mb-6 h-4 w-48 rounded bg-neutral-200" />
      <div className="grid gap-8 rounded-2xl border border-neutral-200 bg-white p-5 md:grid-cols-2 md:gap-10 md:p-8">
        <div>
          <div className="h-[320px] rounded-lg bg-neutral-200 sm:h-[420px]" />
          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="h-14 rounded-md bg-neutral-100" />
            ))}
          </div>
        </div>
        <div className="space-y-5 py-2">
          <div className="h-6 w-36 rounded-full bg-neutral-200" />
          <div className="h-10 w-4/5 rounded bg-neutral-200" />
          <div className="h-5 w-2/3 rounded bg-neutral-100" />
          <div className="h-24 rounded bg-neutral-100" />
          <div className="h-12 rounded bg-neutral-200" />
        </div>
      </div>
    </main>
  );
}
