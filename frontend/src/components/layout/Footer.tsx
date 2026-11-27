import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#161824] text-neutral-300 mt-16">
      {/* Newsletter Banner */}
      <div className="bg-[#facc15] text-neutral-950 py-7 sm:py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5 md:gap-6">
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold leading-snug">
              Join Our Automotive Newsletter &amp; Get $20 Off Your First Order
            </h3>
            <p className="text-neutral-800 text-xs sm:text-sm mt-1">
              Receive exclusive coupons, OEM fitment guides, and flash sale alerts directly in your inbox.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 md:min-w-[340px] lg:min-w-[400px] shrink-0">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="px-4 py-3 rounded-lg text-sm text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-neutral-950/20 flex-1 min-w-0"
            />
            <button
              type="button"
              className="bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-sm px-6 py-3 rounded-lg transition shrink-0"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto py-10 sm:py-12 px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-neutral-800">
        {/* Col 1: Brand Info */}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#facc15] flex items-center justify-center text-neutral-950 font-black text-lg shrink-0">
              A
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight text-white">
              AUTOMOBILIC<span className="text-[#facc15]">.</span>
            </span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed mb-4">
            Automobilic Auto Parts &amp; Performance Tools Store. Verified OEM &amp; aftermarket components
            with guaranteed vehicle fitment.
          </p>
          <div className="text-sm space-y-1.5 text-neutral-300 break-words">
            <p>📍 1550 Industrial Parkway, Suite 210, Detroit, MI 48202</p>
            <p>📞 (555) 867-5309</p>
            <p className="[overflow-wrap:anywhere]">✉️ support@automobilic-autoparts.com</p>
          </div>
        </div>

        {/* Col 2: Customer Service */}
        <div>
          <h4 className="text-white font-bold text-base mb-4">Customer Service</h4>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li>
              <Link href="/faq" className="hover:text-white transition">
                Help Center &amp; FAQs
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact Parts Specialists
              </Link>
            </li>
            <li>
              <Link href="/deals" className="hover:text-white transition">
                Weekly Deals &amp; Offers
              </Link>
            </li>
            <li>
              <Link href="/faq#warranty-core" className="hover:text-white transition">
                Core Return &amp; Warranty Policy
              </Link>
            </li>
            <li>
              <Link href="/faq#fitment-vin" className="hover:text-white transition">
                VIN &amp; Fitment Verification
              </Link>
            </li>
            <li>
              <Link href="/faq#shipping-freight" className="hover:text-white transition">
                Shipping &amp; Delivery Rates
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Popular Categories */}
        <div>
          <h4 className="text-white font-bold text-base mb-4">Top Auto Departments</h4>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li>
              <Link href="/parts?partType=engine" className="hover:text-white transition">
                Complete Engine Assemblies &amp; Blocks
              </Link>
            </li>
            <li>
              <Link href="/parts?partType=transmission" className="hover:text-white transition">
                Automatic &amp; Manual Transmissions
              </Link>
            </li>
            <li>
              <Link href="/parts" className="hover:text-white transition">
                Full Auto Parts Catalog
              </Link>
            </li>
            <li>
              <Link href="/deals" className="hover:text-white transition">
                Refurbished &amp; Flash Sale Assemblies
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:text-white transition">
                Shopping Cart &amp; Order Summary
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Garage Hotline & App */}
        <div>
          <h4 className="text-white font-bold text-base mb-4">Specialist Support</h4>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
            <span className="text-xs text-neutral-400 block">Speak with an ASE Mechanic</span>
            <span className="text-lg font-extrabold text-[#facc15] block mt-0.5">
              (+800) 1234 5678 90
            </span>
            <span className="text-xs text-neutral-500 mt-1 block">
              Mon – Sat: 8:00 AM – 8:00 PM EST
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            100% Secure Checkout — Visa, MasterCard, PayPal, Apple Pay &amp; Affirm Financing.
          </p>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left text-xs text-neutral-500 gap-3 sm:gap-4">
        <p>© {new Date().getFullYear()} Automobilic Auto Parts Store. All rights reserved.</p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
          <span>Privacy Policy</span>
          <span>Terms &amp; Conditions</span>
          <span>Sitemap</span>
        </div>
      </div>
    </footer>
  );
}
