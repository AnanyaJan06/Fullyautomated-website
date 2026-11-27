export default function DashboardPage() {
  return (
    <main className="mx-auto min-h-[65vh] max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-xl font-black tracking-tight text-neutral-900 sm:text-2xl lg:text-3xl">
          Automation Dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          Monitor and manage your automated workflows and scheduled jobs here.
        </p>
      </div>
    </main>
  );
}
