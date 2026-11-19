import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Help Center & FAQs | Automobilic Auto Parts',
  description:
    'Frequently asked questions about VIN fitment verification, engine & transmission warranties, core returns, and freight shipping.',
};

interface FaqCategory {
  id: string;
  badge: string;
  title: string;
  description: string;
  items: {
    question: string;
    answer: string;
  }[];
}

const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'fitment-vin',
    badge: 'FITMENT & COMPATIBILITY',
    title: 'VIN & Vehicle Fitment Verification',
    description:
      'How we make sure every engine or transmission matches your exact vehicle specification.',
    items: [
      {
        question: 'How do you guarantee a part will fit my vehicle?',
        answer:
          'Every engine and transmission order is cross-checked against OEM interchange databases using your vehicle Year, Make, Model, and 17-digit VIN. If a mismatch is detected before dispatch, our ASE specialists contact you immediately to confirm the exact sub-model or engine code.',
      },
      {
        question: 'Where can I find my 17-digit VIN?',
        answer:
          'Your 17-digit Vehicle Identification Number (VIN) is located on the driver-side dashboard (visible through the lower corner of the windshield), on the driver-side door jamb sticker, or on your vehicle registration and insurance documents.',
      },
      {
        question: 'What is the difference between New, Refurbished, and Used parts?',
        answer:
          'New parts are factory-fresh OEM or certified aftermarket units with zero miles. Refurbished (remanufactured) assemblies are torn down, machined to OEM tolerances, and rebuilt with new bearings, seals, and gaskets. Used assemblies are low-mileage OEM units inspected and compression/pressure tested prior to shipping.',
      },
    ],
  },
  {
    id: 'shipping-freight',
    badge: 'LOGISTICS & DELIVERY',
    title: 'Freight Shipping & Order Tracking',
    description:
      'Everything you need to know about palletized engine and transmission delivery.',
    items: [
      {
        question: 'How long does shipping take for engines and transmissions?',
        answer:
          'Most in-stock engines and transmissions ship within 1–2 business days via LTL freight carrier and arrive within 3–7 business days depending on your location. You will receive a freight PRO tracking number as soon as your pallet leaves our warehouse.',
      },
      {
        question: 'What is the difference between Commercial and Residential delivery?',
        answer:
          'Commercial delivery ships directly to an auto repair shop or business address equipped with a loading dock or forklift. Residential delivery includes a liftgate-equipped freight truck so the driver can safely lower the pallet to ground level at your home garage.',
      },
      {
        question: 'What should I inspect when my freight shipment arrives?',
        answer:
          'Before signing the Bill of Lading (BOL), inspect the pallet and crate for any visible exterior damage and verify the part tag matches your invoice. If you notice any transit damage, note it clearly on the driver’s delivery receipt and contact our support team within 24 hours.',
      },
    ],
  },
  {
    id: 'warranty-core',
    badge: 'COVERAGE & RETURNS',
    title: 'Warranty Plans & Core Returns',
    description:
      'Details on warranty protection, 30-day returns, and core exchange refunds.',
    items: [
      {
        question: 'What warranty plans are available on engines and transmissions?',
        answer:
          'All catalog assemblies include our Standard Warranty at no extra cost. During checkout in your Cart, you can also upgrade to our Extended 3-Year Protection Plan or Lifetime Pro Coverage for long-term peace of mind.',
      },
      {
        question: 'How does the core charge and core return refund work?',
        answer:
          'Some remanufactured engines and transmissions carry a refundable core deposit. Simply drain all fluids from your original unit, place it on the shipping pallet your replacement arrived on, and schedule a pickup within 30 days. Once inspected, your core deposit is refunded in full.',
      },
      {
        question: 'What is your 30-day return policy?',
        answer:
          'Uninstalled parts in their original shipping condition may be returned within 30 days of delivery. If an incorrect part was sent due to our error, we cover 100% of return freight costs and ship the correct replacement immediately.',
      },
    ],
  },
  {
    id: 'payment-orders',
    badge: 'BILLING & ACCOUNTS',
    title: 'Orders, Pricing & Mechanic Accounts',
    description:
      'Payment options, commercial repair shop accounts, and tax-exempt purchasing.',
    items: [
      {
        question: 'Which payment methods do you accept?',
        answer:
          'We accept Visa, MasterCard, American Express, PayPal, Apple Pay, ACH wire transfers for commercial orders, and flexible monthly financing through Affirm.',
      },
      {
        question: 'Do you offer discounts for repair shops and fleet managers?',
        answer:
          'Yes! When you register an account on our Sign Up page, choose "Mechanic Shop" or "Fleet" as your account type to unlock priority freight scheduling, dedicated specialist support, and volume pricing.',
      },
    ],
  },
];

export default function FaqPage() {
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
          <span className="font-semibold text-neutral-900">Help Center &amp; FAQs</span>
        </nav>

        {/* Hero Header */}
        <section className="animate-fade-up rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex items-center rounded-md bg-[#facc15] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-neutral-950">
                Automobilic Knowledge Base
              </span>
              <h1 className="mt-3 text-3xl font-black tracking-tight text-neutral-900 sm:text-4xl">
                Frequently Asked Questions
              </h1>
              <p className="mt-2 text-sm leading-6 text-neutral-600 sm:text-base">
                Quick answers to common questions about vehicle fitment, LTL freight shipping, warranty plans, and core returns.
              </p>
            </div>

            {/* Quick Category Jump Links */}
            <div className="flex flex-wrap gap-2">
              {FAQ_CATEGORIES.map((category) => (
                <a
                  key={category.id}
                  href={`#${category.id}`}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-xs font-bold text-neutral-800 transition hover:border-[#eab308] hover:bg-[#facc15] hover:text-neutral-950"
                >
                  {category.title}
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Category Sections */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            {FAQ_CATEGORIES.map((category, catIdx) => (
              <section
                key={category.id}
                id={category.id}
                style={{ animationDelay: `${catIdx * 60}ms` }}
                className="animate-fade-up scroll-mt-24 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
              >
                <div className="border-b border-neutral-100 pb-4">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#806000]">
                    {category.badge}
                  </span>
                  <h2 className="mt-1 text-xl font-black text-neutral-900 sm:text-2xl">
                    {category.title}
                  </h2>
                  <p className="mt-1 text-xs text-neutral-500 sm:text-sm">
                    {category.description}
                  </p>
                </div>

                <div className="mt-4 divide-y divide-neutral-100">
                  {category.items.map((item, idx) => (
                    <details
                      key={item.question}
                      open={catIdx === 0 && idx === 0}
                      className="group py-4"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-bold text-neutral-900 transition-colors hover:text-[#8a6b00] [&::-webkit-details-marker]:hidden sm:text-base">
                        <span>{item.question}</span>
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-700 transition-transform duration-200 group-open:rotate-180 group-open:bg-[#facc15] group-open:text-neutral-950">
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="h-3.5 w-3.5"
                          >
                            <path
                              d="m4 6 4 4 4-4"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                      </summary>
                      <p className="mt-3 pr-8 text-xs leading-6 text-neutral-600 sm:text-sm">
                        {item.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </section>
            ))}
          </div>

          {/* Right Sidebar: Direct Specialist Support Card */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-5">
              <div className="rounded-2xl bg-neutral-950 p-6 text-white shadow-sm">
                <span className="inline-block rounded bg-[#facc15] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-neutral-950">
                  24/7 Fitment Desk
                </span>
                <h3 className="mt-3 text-xl font-black">
                  Still Have a Question About Your Vehicle?
                </h3>
                <p className="mt-2 text-xs leading-5 text-neutral-300">
                  Our ASE-certified parts specialists can verify your 17-digit VIN and confirm engine or transmission compatibility in minutes.
                </p>

                <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
                  <span className="block text-[11px] text-neutral-400">
                    Direct Parts Hotline
                  </span>
                  <a
                    href="tel:+18001234567890"
                    className="mt-0.5 block text-lg font-extrabold text-[#facc15] hover:underline"
                  >
                    +(800) 1234 5678 90
                  </a>
                  <span className="mt-1 block text-[11px] text-neutral-400">
                    Mon – Sat: 8:00 AM – 8:00 PM EST
                  </span>
                </div>

                <div className="mt-5 flex flex-col gap-2.5">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center rounded-xl bg-[#facc15] px-4 py-3 text-xs font-extrabold text-neutral-950 transition hover:bg-[#eab308]"
                  >
                    Contact Support Team &rarr;
                  </Link>
                  <Link
                    href="/parts"
                    className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/20"
                  >
                    Browse Auto Parts List
                  </Link>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                  Quick Catalog Links
                </h3>
                <ul className="mt-3 space-y-2.5 text-xs font-semibold text-neutral-600">
                  <li>
                    <Link href="/parts?partType=engine" className="hover:text-[#8a6b00]">
                      &rarr; Complete Engine Assemblies
                    </Link>
                  </li>
                  <li>
                    <Link href="/parts?partType=transmission" className="hover:text-[#8a6b00]">
                      &rarr; Automatic &amp; Manual Transmissions
                    </Link>
                  </li>
                  <li>
                    <Link href="/deals" className="hover:text-[#8a6b00]">
                      &rarr; Weekly Deals &amp; Flash Savings
                    </Link>
                  </li>
                  <li>
                    <Link href="/cart" className="hover:text-[#8a6b00]">
                      &rarr; View Your Shopping Cart
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
