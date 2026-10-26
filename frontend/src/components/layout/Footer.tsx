import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#161824] text-neutral-300 mt-16">
      {/* Newsletter Banner */}
      <div className="bg-[#e51515] text-white py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold">
              Join Our Automotive Newsletter &amp; Get $20 Off Your First Order
            </h3>
            <p className="text-red-100 text-sm mt-1">
              Receive exclusive coupons, OEM fitment guides, and flash sale alerts directly in your inbox.
            </p>
          </div>

          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-2 min-w-[340px]">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="px-4 py-3 rounded-lg text-sm text-neutral-900 bg-white focus:outline-none flex-1"
            />
            <button
              type="button"
              className="bg-[#161824] hover:bg-neutral-900 text-white font-semibold text-sm px-6 py-3 rounded-lg transition shrink-0"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto py-12 px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-neutral-800">
        {/* Col 1: Brand Info */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 rounded-lg bg-[#e51515] flex items-center justify-center text-white font-black text-lg">
              G
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              GEARUP<span className="text-[#e51515]">.</span>
            </span>
          </div>
          <p className="text-sm text-neutral-400 leading-relaxed mb-4">
            Gearup Auto Parts &amp; Performance Tools Store. Verified OEM &amp; aftermarket components
            with guaranteed vehicle fitment.
          </p>
          <div className="text-sm space-y-1 text-neutral-300">
            <p>📍 1550 Industrial Parkway, Suite 210, Detroit, MI 48202</p>
            <p>📞 (555) 867-5309</p>
            <p>✉️ support@gearup-autoparts.com</p>
          </div>
        </div>

        {/* Col 2: Customer Service */}
        <div>
          <h4 className="text-white font-bold text-base mb-4">Customer Service</h4>
          <ul className="space-y-2.5 text-sm text-neutral-400">
            <li>
              <Link href="/" className="hover:text-white transition">
                Help Center &amp; FAQs
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white transition">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white transition">
                Core Return &amp; Warranty Policy
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white transition">
                VIN &amp; Fitment Verification
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-white transition">
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
              <Link href="#categories" className="hover:text-white transition">
                Headlights &amp; LED Assemblies
              </Link>
            </li>
            <li>
              <Link href="#categories" className="hover:text-white transition">
                Performance Brake Rotors &amp; Pads
              </Link>
            </li>
            <li>
              <Link href="#categories" className="hover:text-white transition">
                All-Season &amp; Track Tires
              </Link>
            </li>
            <li>
              <Link href="#categories" className="hover:text-white transition">
                Suspension Coilovers &amp; Shocks
              </Link>
            </li>
            <li>
              <Link href="#categories" className="hover:text-white transition">
                Synthetic Motor Oils &amp; Filters
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Garage Hotline & App */}
        <div>
          <h4 className="text-white font-bold text-base mb-4">Specialist Support</h4>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-4">
            <span className="text-xs text-neutral-400 block">Speak with an ASE Mechanic</span>
            <span className="text-lg font-extrabold text-[#e51515] block mt-0.5">
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
      <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
        <p>© {new Date().getFullYear()} Gearup Auto Parts Store . All rights reserved.</p>
        <div className="flex items-center gap-4">
          <span>Privacy Policy</span>
          <span>Terms &amp; Conditions</span>
          <span>Sitemap</span>
        </div>
      </div>
    </footer>
  );
}
