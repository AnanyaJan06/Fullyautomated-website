import type { Metadata } from 'next';
import Link from 'next/link';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Parts Specialists | Automobilic Auto Parts',
  description:
    'Contact our ASE-certified auto parts specialists for VIN fitment verification, engine & transmission quotes, and freight order support.',
};

const CONTACT_CHANNELS = [
  {
    badge: '24/7 PARTS HOTLINE',
    title: 'Speak with an ASE Specialist',
    primary: '+(800) 1234 5678 90',
    secondary: 'Direct line: (555) 867-5309',
    href: 'tel:+18001234567890',
    cta: 'Call Now',
  },
  {
    badge: 'EMAIL SUPPORT DESK',
    title: 'Quotes & Fitment Verification',
    primary: 'support@automobilic-autoparts.com',
    secondary: 'Average response time: under 2 hours',
    href: 'mailto:support@automobilic-autoparts.com',
    cta: 'Send Email',
  },
  {
    badge: 'DISTRIBUTION HUB',
    title: 'Detroit Headquarters & Warehouse',
    primary: '1550 Industrial Parkway, Suite 210',
    secondary: 'Detroit, MI 48202 • Mon–Sat: 8 AM – 8 PM EST',
    href: '/faq#shipping-freight',
    cta: 'Freight & Pickup Info',
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-[75vh] pb-16">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex items-center gap-2 text-xs font-medium text-neutral-500"
        >
          <Link href="/" className="transition-colors hover:text-[#8a6b00]">
            Home
          </Link>
          <span>/</span>
          <span className="font-semibold text-neutral-900">Contact Us</span>
        </nav>

        {/* Page Hero Banner */}
        <section className="animate-fade-up rounded-2xl bg-neutral-950 px-6 py-9 text-white shadow-sm sm:px-10 lg:px-14">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-md bg-[#facc15] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-neutral-950">
                ASE-Certified Support Team
              </span>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Need Help Finding the Right Engine or Transmission?
              </h1>
              <p className="mt-2 text-sm leading-6 text-neutral-300 sm:text-base">
                Send us your 17-digit VIN or vehicle details and our parts specialists will verify exact OEM compatibility, check warehouse stock, and provide a freight quote.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="tel:+18001234567890"
                className="inline-flex items-center justify-center rounded-xl bg-[#facc15] px-5 py-3 text-xs font-extrabold text-neutral-950 transition hover:bg-[#eab308] sm:text-sm"
              >
                Call +(800) 1234 5678 90
              </a>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/20 sm:text-sm"
              >
                Browse FAQs &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* 3 Direct Contact Cards */}
        <section
          aria-label="Direct contact channels"
          className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3"
        >
          {CONTACT_CHANNELS.map((channel, index) => (
            <div
              key={channel.title}
              style={{ animationDelay: `${index * 60}ms` }}
              className="animate-fade-up flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div>
                <span className="inline-block rounded-md bg-yellow-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#8a6b00] ring-1 ring-inset ring-yellow-200">
                  {channel.badge}
                </span>
                <h2 className="mt-3 text-lg font-black text-neutral-900">{channel.title}</h2>
                <p className="mt-2 text-sm font-extrabold text-neutral-900">{channel.primary}</p>
                <p className="mt-1 text-xs text-neutral-500">{channel.secondary}</p>
              </div>
              <div className="mt-5 border-t border-neutral-100 pt-3">
                <a
                  href={channel.href}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-neutral-950 hover:text-[#8a6b00] hover:underline"
                >
                  {channel.cta} <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          ))}
        </section>

        {/* Contact Form + Fitment Guarantee Details */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8 lg:col-span-8">
            <div className="mb-6 border-b border-neutral-100 pb-4">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#806000]">
                Direct Specialist Message
              </span>
              <h2 className="mt-1 text-2xl font-black text-neutral-900">
                Send a Parts or Fitment Inquiry
              </h2>
              <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                Fill out the form below and an automotive specialist will respond with verified part numbers and pricing.
              </p>
            </div>

            <ContactForm />
          </section>

          <aside className="space-y-5 lg:col-span-4">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-black text-neutral-900">
                What to Include for Faster VIN Checks
              </h3>
              <ul className="mt-3 space-y-3 text-xs leading-5 text-neutral-600">
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#facc15] text-[11px] font-black text-neutral-950">
                    1
                  </span>
                  <span>
                    <strong>17-Digit VIN:</strong> Found on your driver-side door jamb or lower windshield.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#facc15] text-[11px] font-black text-neutral-950">
                    2
                  </span>
                  <span>
                    <strong>Drivetrain &amp; Displacement:</strong> Let us know if your vehicle is AWD, 4WD, FWD, or RWD.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#facc15] text-[11px] font-black text-neutral-950">
                    3
                  </span>
                  <span>
                    <strong>Delivery Type:</strong> Specify whether you are shipping to a commercial shop or residential garage.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl bg-neutral-950 p-6 text-white shadow-sm">
              <span className="inline-block rounded bg-[#facc15] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-neutral-950">
                Self-Service Tools
              </span>
              <h3 className="mt-3 text-lg font-black">
                Looking for Immediate Answers?
              </h3>
              <p className="mt-1.5 text-xs leading-5 text-neutral-300">
                Check our online catalog or browse our FAQ center for instant policy details.
              </p>
              <div className="mt-5 flex flex-col gap-2.5">
                <Link
                  href="/parts"
                  className="inline-flex items-center justify-center rounded-xl bg-[#facc15] px-4 py-2.5 text-xs font-extrabold text-neutral-950 transition hover:bg-[#eab308]"
                >
                  Open Auto Parts Listing &rarr;
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/20"
                >
                  Read Help Center &amp; FAQs
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
