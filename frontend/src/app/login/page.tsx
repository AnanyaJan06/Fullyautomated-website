'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      const response = await authService.signin({ email, password });
      setSuccessMessage(response.message || 'Signed in! Loading your Gearup Garage...');
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 600);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to connect to the server. Make sure the backend is running on port 5000.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="mx-auto w-full max-w-[1220px]">
        {/* Top Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-neutral-700 hover:text-[#ef263d] transition">
              Home
            </Link>
            <span>/</span>
            <span className="font-bold text-[#202126]">Sign In to My Garage</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            256-Bit Encrypted Garage Auth
          </span>
        </div>

        {/* Main Split Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl">
          {/* Left Panel: Automotive Garage Showcase */}
          <div className="lg:col-span-5 relative overflow-hidden bg-gradient-to-br from-[#161824] via-[#1d2030] to-[#2c1215] p-8 sm:p-10 text-white flex flex-col justify-between">
            {/* Subtle Technical Grid Pattern */}
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#ef263d]/20 border border-[#ef263d]/40 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#ff6b7b]">
                <span>⚡ Gearup Digital Garage</span>
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Precision Fitment Starts With Your Garage.
              </h1>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                Sign in to access saved vehicles, instant VIN-matched OEM &amp; aftermarket catalogs, and real-time shipment tracking.
              </p>

              {/* Automotive Benefits */}
              <div className="mt-8 space-y-4">
                {[
                  {
                    badge: 'FITMENT',
                    title: '100% Guaranteed Vehicle Match',
                    desc: 'Filter 68,000+ brake, suspension & engine components by your saved car.',
                  },
                  {
                    badge: 'PRO TIER',
                    title: 'Commercial & DIY Member Pricing',
                    desc: 'Unlock exclusive bundle discounts on Brembo, Michelin, Bilstein & Liqui Moly.',
                  },
                  {
                    badge: 'WARRANTY',
                    title: 'One-Click Core Returns & Receipts',
                    desc: 'Instant digital service logs and hassle-free 30-day return labels.',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-[#ef263d] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white">
                        {item.badge}
                      </span>
                      <h3 className="text-sm font-extrabold text-white">{item.title}</h3>
                    </div>
                    <p className="mt-1.5 text-xs text-neutral-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Spec Telemetry Bar */}
            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="block text-xl font-black text-white">68K+</span>
                <span className="text-[11px] text-neutral-400">OEM &amp; Track Parts</span>
              </div>
              <div>
                <span className="block text-xl font-black text-[#ef263d]">99.8%</span>
                <span className="text-[11px] text-neutral-400">Fitment Accuracy</span>
              </div>
              <div>
                <span className="block text-xl font-black text-white">24/7</span>
                <span className="text-[11px] text-neutral-400">ASE Tech Support</span>
              </div>
            </div>
          </div>

          {/* Right Panel: Sign In Form */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              {/* Top Mode Switcher Tabs */}
              <div className="grid grid-cols-2 rounded-2xl bg-neutral-100 p-1.5 mb-8">
                <Link
                  href="/login"
                  className="rounded-xl bg-white py-2.5 text-center text-xs font-extrabold text-[#202126] shadow-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl py-2.5 text-center text-xs font-bold text-neutral-500 hover:text-[#202126] transition"
                >
                  Create Account
                </Link>
              </div>

              <div className="mb-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#ef263d]">
                  Welcome Back, Driver
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#202126] mt-1">
                  Sign In to Your Account
                </h2>
                <p className="text-xs text-neutral-500 mt-1.5">
                  Enter your registered email and password to load your saved vehicles and orders.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700 flex items-center justify-between">
                  <span>⚠️ {error}</span>
                  <button
                    type="button"
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-800 font-bold ml-2"
                  >
                    ✕
                  </button>
                </div>
              )}

              {successMessage && (
                <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-800">
                  ✓ {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="login-email"
                    className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@gearup-garage.com"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ef263d] focus:outline-none focus:ring-2 focus:ring-[#ef263d]/15 transition"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="login-password"
                      className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700"
                    >
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs font-bold text-[#ef263d] hover:underline"
                    >
                      {showPassword ? 'Hide Password' : 'Show Password'}
                    </button>
                  </div>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ef263d] focus:outline-none focus:ring-2 focus:ring-[#ef263d]/15 transition"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <label className="inline-flex items-center gap-2 cursor-pointer text-neutral-600 font-medium">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-[#ef263d] focus:ring-[#ef263d]"
                    />
                    Keep my garage session signed in
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#ef263d] hover:bg-[#d91f34] disabled:opacity-60 text-white font-extrabold text-sm py-3.5 px-6 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Authenticating Garage Access...</span>
                  ) : (
                    <>
                      <span>Sign In to My Garage</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-7 flex items-center gap-3">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                  New to Gearup Auto Parts?
                </span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              <Link
                href="/signup"
                className="w-full rounded-xl border-2 border-[#161824] bg-white hover:bg-[#161824] text-[#161824] hover:text-white font-extrabold text-xs py-3 px-5 transition flex items-center justify-center gap-2"
              >
                <span>Create Your Free Garage Account</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
