import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">
        Automated Website Platform
      </h1>
      <p className="text-neutral-400 max-w-xl mb-8">
        Scalable Next.js + Express + MongoDB architecture ready for automated workflows,
        scheduled tasks, and dynamic content.
      </p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200 transition"
      >
        Open Automation Dashboard
      </Link>
    </main>
  );
}
