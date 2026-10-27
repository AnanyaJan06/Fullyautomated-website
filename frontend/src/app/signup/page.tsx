'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { ApiError } from '@/lib/api';
import { AccountType } from '@/types';
import {
  VEHICLE_YEARS,
  VEHICLE_MAKES,
  VEHICLE_ENGINES,
} from '@/data/gearup-data';

const ACCOUNT_TYPES: {
  id: AccountType;
  label: string;
  subtitle: string;
  icon: string;
}[] = [
  {
    id: 'enthusiast',
    label: 'DIY / Enthusiast',
    subtitle: 'Personal garage & upgrades',
    icon: '🏎️',
  },
  {
    id: 'mechanic_shop',
    label: 'Pro Mechanic Shop',
    subtitle: 'Wholesale & trade fitment',
    icon: '🔧',
  },
  {
    id: 'fleet',
    label: 'Fleet / Commercial',
    subtitle: 'Multi-vehicle maintenance',
    icon: '🚚',
  },
];

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('enthusiast');

  // Optional Primary Garage Vehicle Fitment
  const [addGarageVehicle, setAddGarageVehicle] = useState(true);
  const [year, setYear] = useState('2024');
  const [make, setMake] = useState('BMW');
  const [model, setModel] = useState('M3 Competition');
  const [engine, setEngine] = useState('3.0L Twin-Turbo V6');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const makeList = Object.keys(VEHICLE_MAKES);
  const availableModels = make && VEHICLE_MAKES[make] ? VEHICLE_MAKES[make] : [];

  const handleMakeChange = (newMake: string) => {
    setMake(newMake);
    const firstModel = VEHICLE_MAKES[newMake]?.[0] || '';
    setModel(firstModel);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.signup({
        fullName,
        email,
        password,
        phone: phone || undefined,
        accountType,
        primaryVehicle: addGarageVehicle
          ? { year, make, model, engine }
          : undefined,
      });

      setSuccessMessage(
        response.message || 'Garage account created! Redirecting to Gearup...'
      );
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 700);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Unable to reach backend server. Make sure the backend is running on port 5000.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-76px)] bg-neutral-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1260px]">
        {/* Top Breadcrumb */}
        <div className="mb-6 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-semibold text-neutral-700 hover:text-[#ef263d] transition">
              Home
            </Link>
            <span>/</span>
            <span className="font-bold text-[#202126]">Create Garage Account</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 font-semibold text-[#ef263d] bg-red-50 border border-red-200 px-3 py-1 rounded-full">
            🎁 Includes $20 Off First OEM / Performance Order
          </span>
        </div>

        {/* Main Split Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-xl">
          {/* Left Panel: Automotive Brand & Garage Perks */}
          <div className="lg:col-span-5 relative overflow-hidden bg-gradient-to-br from-[#161824] via-[#1c2033] to-[#2c1215] p-8 sm:p-10 text-white flex flex-col justify-between">
            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
                backgroundSize: '24px 24px',
              }}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-400/20 border border-amber-400/40 px-3.5 py-1 text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                <span>🏁 Free Gearup Garage Membership</span>
              </div>

              <h1 className="mt-5 text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Build Your Digital Vehicle Garage.
              </h1>
              <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
                Register your account and save your primary vehicle to filter our entire catalog for exact OEM and track-ready parts compatibility.
              </p>

              {/* Live Vehicle Card Preview */}
              {addGarageVehicle && (
                <div className="mt-7 rounded-2xl border border-[#ef263d]/50 bg-[#161824]/90 p-5 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#ef263d]">
                      Active Garage Fitment Preview
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      ● Fitment Verified
                    </span>
                  </div>
                  <p className="mt-2 text-lg font-black text-white">
                    {year} {make} {model}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    Powertrain: <span className="text-neutral-200 font-semibold">{engine}</span>
                  </p>
                </div>
              )}

              <div className="mt-7 space-y-3.5 text-xs text-neutral-300">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ef263d] text-white font-black">
                    ✓
                  </span>
                  <p>
                    <strong className="text-white">Zero Fitment Guesswork:</strong> Every product page automatically verifies compatibility with your saved vehicle.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ef263d] text-white font-black">
                    ✓
                  </span>
                  <p>
                    <strong className="text-white">Priority Warehouse Dispatch:</strong> Same-day shipping on brake kits, coilovers, tires &amp; LED assemblies.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#ef263d] text-white font-black">
                    ✓
                  </span>
                  <p>
                    <strong className="text-white">ASE Mechanic Hotline Access:</strong> Direct tech support for torque specs and installation guides.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-8 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-neutral-400">
              <span>Trusted by 140,000+ builders &amp; shops</span>
              <span className="font-bold text-white">★ 4.9/5 Rating</span>
            </div>
          </div>

          {/* Right Panel: Sign Up Form */}
          <div className="lg:col-span-7 p-8 sm:p-10">
            <div className="max-w-xl mx-auto">
              {/* Top Mode Switcher Tabs */}
              <div className="grid grid-cols-2 rounded-2xl bg-neutral-100 p-1.5 mb-7">
                <Link
                  href="/login"
                  className="rounded-xl py-2.5 text-center text-xs font-bold text-neutral-500 hover:text-[#202126] transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-white py-2.5 text-center text-xs font-extrabold text-[#202126] shadow-sm"
                >
                  Create Account
                </Link>
              </div>

              <div className="mb-6">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#ef263d]">
                  New Garage Registration
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#202126] mt-1">
                  Create Your Gearup Account
                </h2>
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
                {/* 1. Account Type Selector */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-2">
                    Select Account Profile
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {ACCOUNT_TYPES.map((item) => {
                      const active = accountType === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setAccountType(item.id)}
                          className={`rounded-xl border p-3 text-left transition ${
                            active
                              ? 'border-[#ef263d] bg-red-50/40 ring-2 ring-[#ef263d]/15'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-lg">{item.icon}</span>
                            {active && (
                              <span className="h-2 w-2 rounded-full bg-[#ef263d]" />
                            )}
                          </div>
                          <p className="mt-1.5 text-xs font-extrabold text-[#202126]">
                            {item.label}
                          </p>
                          <p className="text-[11px] text-neutral-500">{item.subtitle}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Personal Credentials */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="signup-name"
                      className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-1.5"
                    >
                      Full Name *
                    </label>
                    <input
                      id="signup-name"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Mercer"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ef263d] focus:outline-none focus:ring-2 focus:ring-[#ef263d]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-phone"
                      className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-1.5"
                    >
                      Phone (For Delivery Alerts)
                    </label>
                    <input
                      id="signup-phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 234-5678"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ef263d] focus:outline-none focus:ring-2 focus:ring-[#ef263d]/15"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="signup-email"
                    className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@gearup-garage.com"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ef263d] focus:outline-none focus:ring-2 focus:ring-[#ef263d]/15"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="signup-password"
                      className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-1.5"
                    >
                      Password *
                    </label>
                    <input
                      id="signup-password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ef263d] focus:outline-none focus:ring-2 focus:ring-[#ef263d]/15"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="signup-confirm-password"
                      className="block text-xs font-extrabold uppercase tracking-wider text-neutral-700 mb-1.5"
                    >
                      Confirm Password *
                    </label>
                    <input
                      id="signup-confirm-password"
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#ef263d] focus:outline-none focus:ring-2 focus:ring-[#ef263d]/15"
                    />
                  </div>
                </div>

                {/* 3. Optional Primary Vehicle Garage Fitment Box */}
                <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base">🚗</span>
                      <div>
                        <p className="text-xs font-extrabold text-[#202126]">
                          Save Primary Vehicle to My Garage
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Auto-filter parts that fit your exact Year, Make, Model &amp; Engine
                        </p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={addGarageVehicle}
                      onChange={(e) => setAddGarageVehicle(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-300 text-[#ef263d] focus:ring-[#ef263d]"
                    />
                  </div>

                  {addGarageVehicle && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-3 border-t border-neutral-200">
                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                          Year
                        </label>
                        <select
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-900"
                        >
                          {VEHICLE_YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                          Make
                        </label>
                        <select
                          value={make}
                          onChange={(e) => handleMakeChange(e.target.value)}
                          className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-900"
                        >
                          {makeList.map((m) => (
                            <option key={m} value={m}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                          Model
                        </label>
                        <select
                          value={model}
                          onChange={(e) => setModel(e.target.value)}
                          className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-900"
                        >
                          {availableModels.map((mod) => (
                            <option key={mod} value={mod}>
                              {mod}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1">
                          Engine
                        </label>
                        <select
                          value={engine}
                          onChange={(e) => setEngine(e.target.value)}
                          className="w-full rounded-lg border border-neutral-300 bg-white px-2.5 py-2 text-xs font-semibold text-neutral-900"
                        >
                          {VEHICLE_ENGINES.map((eng) => (
                            <option key={eng} value={eng}>
                              {eng}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-[#ef263d] hover:bg-[#d91f34] disabled:opacity-60 text-white font-extrabold text-sm py-3.5 px-6 shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Creating Your Garage Account...</span>
                  ) : (
                    <>
                      <span>Create Garage Account &amp; Save Vehicle</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              <p className="mt-5 text-center text-xs text-neutral-500">
                Already have a Gearup Garage account?{' '}
                <Link href="/login" className="font-extrabold text-[#ef263d] hover:underline">
                  Sign In Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
