'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { cartService } from '@/services/cart.service';
import { authService } from '@/services/auth.service';
import type { CartData, CartItem, WarrantyPlanType } from '@/types';

const CONDITION_STYLES: Record<CartItem['condition'], { label: string; className: string }> = {
  new: {
    label: 'OEM NEW',
    className: 'bg-emerald-600 text-white',
  },
  refurbished: {
    label: 'REMANUFACTURED',
    className: 'bg-amber-500 text-neutral-950',
  },
  used: {
    label: 'TESTED USED',
    className: 'bg-neutral-700 text-white',
  },
};

const WARRANTY_OPTIONS: {
  id: WarrantyPlanType;
  title: string;
  subtitle: string;
  price: number;
}[] = [
  {
    id: 'standard',
    title: 'Standard Fitment & Powertrain Warranty',
    subtitle: 'Baseline coverage against manufacturing & internal component defects',
    price: 0,
  },
  {
    id: 'extended_3yr',
    title: '3-Year / 50,000-Mile Extended Protection',
    subtitle: 'Includes seal, gasket & internal assembly replacement coverage',
    price: 89,
  },
  {
    id: 'lifetime_pro',
    title: 'Pro No-Fault Nationwide Replacement Warranty',
    subtitle: 'Priority overnight replacement + labor reimbursement allowance',
    price: 149,
  },
];

interface ConfirmedOrder {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  shippingType: 'commercial' | 'residential';
  items: CartItem[];
  grandTotal: number;
  createdAt: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [busyPartId, setBusyPartId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [vinDrafts, setVinDrafts] = useState<Record<string, string>>({});
  const [savedVinPartId, setSavedVinPartId] = useState<string | null>(null);

  // Checkout form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);

  useEffect(() => {
    const storedUser = authService.getStoredUser();
    if (storedUser) {
      setCustomerName(storedUser.fullName || '');
      setCustomerEmail(storedUser.email || '');
      setCustomerPhone(storedUser.phone || '');
    }

    const cached = cartService.getCachedCart();
    if (cached) {
      setCart(cached);
      const initialVins: Record<string, string> = {};
      cached.items.forEach((i) => {
        initialVins[i.partId] = i.vin || storedUser?.primaryVehicle?.vin || '';
      });
      setVinDrafts(initialVins);
    }

    setIsLoading(true);
    cartService
      .getCart()
      .then((freshCart) => {
        setCart(freshCart);
        const initialVins: Record<string, string> = {};
        freshCart.items.forEach((i) => {
          initialVins[i.partId] = i.vin || storedUser?.primaryVehicle?.vin || '';
        });
        setVinDrafts(initialVins);
      })
      .catch((err) => {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : 'Unable to sync cart with database. Please ensure the backend server is running.'
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  async function handleQuantityChange(partId: string, nextQty: number) {
    setBusyPartId(partId);
    setErrorMsg('');
    try {
      const updated =
        nextQty <= 0
          ? await cartService.removeItem(partId)
          : await cartService.updateItem(partId, { quantity: nextQty });
      setCart(updated);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update item quantity.');
    } finally {
      setBusyPartId(null);
    }
  }

  async function handleRemoveItem(partId: string) {
    setBusyPartId(partId);
    setErrorMsg('');
    try {
      const updated = await cartService.removeItem(partId);
      setCart(updated);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to remove part from cart.');
    } finally {
      setBusyPartId(null);
    }
  }

  async function handleWarrantyChange(partId: string, warrantyPlan: WarrantyPlanType) {
    setBusyPartId(partId);
    setErrorMsg('');
    try {
      const updated = await cartService.updateItem(partId, { warrantyPlan });
      setCart(updated);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update warranty selection.');
    } finally {
      setBusyPartId(null);
    }
  }

  async function handleSaveVin(partId: string) {
    const vinValue = (vinDrafts[partId] || '').trim().toUpperCase();
    setBusyPartId(partId);
    setErrorMsg('');
    try {
      const updated = await cartService.updateItem(partId, { vin: vinValue });
      setCart(updated);
      setSavedVinPartId(partId);
      setTimeout(() => {
        setSavedVinPartId((prev) => (prev === partId ? null : prev));
      }, 2500);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save VIN for fitment check.');
    } finally {
      setBusyPartId(null);
    }
  }

  async function handleShippingTypeChange(shippingType: 'commercial' | 'residential') {
    setErrorMsg('');
    try {
      const updated = await cartService.updateSettings({ shippingType });
      setCart(updated);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to update shipping method.');
    }
  }

  async function handleClearCart() {
    setErrorMsg('');
    try {
      const updated = await cartService.clearCart();
      setCart(updated);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to clear cart.');
    }
  }

  async function handleCompleteOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart || cart.items.length === 0) return;

    setIsSubmittingOrder(true);
    setErrorMsg('');
    try {
      const orderSnapshot: ConfirmedOrder = {
        orderNumber: `RT-${Date.now().toString().slice(-6)}`,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
        deliveryAddress: deliveryAddress.trim(),
        shippingType: cart.shippingType,
        items: [...cart.items],
        grandTotal: cart.summary.grandTotal,
        createdAt: new Date().toLocaleString(),
      };
      const cleared = await cartService.clearCart();
      setCart(cleared);
      setConfirmedOrder(orderSnapshot);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to finalize order.');
    } finally {
      setIsSubmittingOrder(false);
    }
  }

  const items = cart?.items || [];
  const summary = cart?.summary || {
    totalQuantity: 0,
    partsSubtotal: 0,
    warrantyTotal: 0,
    coreChargeTotal: 0,
    shippingCost: 0,
    grandTotal: 0,
  };

  return (
    <main className="min-h-screen bg-neutral-50 pb-16">
      {/* Top Reman-Transmission Style Banner & Progress Header */}
      <div className="bg-[#161824] text-white">
        <div className="mx-auto max-w-[1440px] px-4 py-7 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-2 text-xs text-neutral-400">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <span>/</span>
            <Link href="/#part-search" className="transition hover:text-white">
              Parts Database Search
            </Link>
            <span>/</span>
            <span className="font-bold text-white">Shopping Cart &amp; VIN Fitment Verification</span>
          </nav>

          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#ef263d] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white">
                Direct OEM &amp; Remanufactured Powertrain Cart
              </span>
              <h1 className="mt-2.5 text-2xl font-black tracking-tight sm:text-3xl">
                Your Selected Auto Parts &amp; Fitment Cart
              </h1>
              <p className="mt-1 text-xs text-neutral-300 sm:text-sm">
                Verify your vehicle VIN, select warranty coverage, and choose shop or residential delivery.
              </p>
            </div>

            {/* 3-Step Checkout Progress Bar */}
            <div className="grid grid-cols-3 gap-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs sm:gap-4 sm:p-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-black text-neutral-950">
                  ✓
                </span>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-emerald-400">Step 1</span>
                  <span className="font-bold text-white">Part Selected</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ef263d] text-xs font-black text-white">
                  2
                </span>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-[#ef263d]">Step 2</span>
                  <span className="font-bold text-white">VIN &amp; Warranty</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 opacity-75">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-500 text-xs font-black text-neutral-300">
                  3
                </span>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-neutral-400">Step 3</span>
                  <span className="font-bold text-neutral-200">Freight Dispatch</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reman-Transmission Style Guarantees Strip */}
          <div className="mt-6 grid grid-cols-1 gap-3 border-t border-white/10 pt-4 text-xs sm:grid-cols-3">
            <div className="flex items-center gap-2.5 text-neutral-200">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                ✓
              </span>
              <span>
                <strong className="text-white">No Upfront Core Charge:</strong> $0.00 Core Deposit Waived at Checkout
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-neutral-200">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold">
                🛡️
              </span>
              <span>
                <strong className="text-white">100% Exact VIN Fitment:</strong> Dyno-Tested &amp; Verified Before Dispatch
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-neutral-200">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold">
                🚚
              </span>
              <span>
                <strong className="text-white">Fast Freight &amp; Shop Delivery:</strong> Free Commercial Address Shipping
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-[1440px] px-4 sm:px-6 lg:px-8">
        {errorMsg && (
          <div
            role="alert"
            className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-800"
          >
            <span>{errorMsg}</span>
            <button
              type="button"
              onClick={() => setErrorMsg('')}
              className="font-bold text-red-950 underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Order Confirmation View */}
        {confirmedOrder && (
          <div className="mb-8 rounded-2xl border-2 border-emerald-500 bg-white p-6 shadow-md sm:p-8">
            <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3.5">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xl font-black text-white">
                  ✓
                </span>
                <div>
                  <span className="inline-block rounded bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-emerald-800">
                    Order Confirmed • Fitment Locked
                  </span>
                  <h2 className="mt-1 text-xl font-black text-neutral-900">
                    Thank you, {confirmedOrder.customerName}! Order #{confirmedOrder.orderNumber}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Placed on {confirmedOrder.createdAt} • Confirmation sent to {confirmedOrder.customerEmail}
                  </p>
                </div>
              </div>
              <Link
                href="/#part-search"
                className="inline-flex items-center justify-center rounded-xl bg-[#ef263d] px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-[#d91f34]"
              >
                Search More Parts →
              </Link>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {confirmedOrder.items.map((item) => (
                <div
                  key={item.partId}
                  className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-xs"
                >
                  <p className="font-bold text-neutral-900">{item.part}</p>
                  {item.year && item.make && (
                    <p className="mt-1 font-semibold text-neutral-600">
                      Vehicle: {item.year} {item.make} {item.model}
                    </p>
                  )}
                  <p className="mt-1 text-neutral-500">
                    Qty: {item.quantity} • Total: ${item.lineSubtotal.toFixed(2)}
                  </p>
                  {item.vin && (
                    <p className="mt-1 font-mono text-[11px] font-bold text-emerald-700">
                      VIN Verified: {item.vin}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {isLoading && items.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center">
            <p className="text-sm font-bold text-neutral-700">Loading your selected parts from the database...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center shadow-sm sm:p-14">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100 text-3xl">
              🛒
            </div>
            <h2 className="mt-4 text-xl font-black text-neutral-900">Your Shopping Cart is Empty</h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-neutral-500 sm:text-sm">
              Use the vehicle fitment search on the home page to check if your part is in the database{' '}
              <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-neutral-800">parts</code>{' '}
              collection and add it directly to your cart.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/#part-search"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ef263d] px-6 py-3 text-xs font-extrabold text-white transition hover:bg-[#d91f34]"
              >
                Search Database Parts
              </Link>
              <Link
                href="/#products"
                className="inline-flex items-center gap-2 rounded-xl border border-neutral-300 bg-white px-6 py-3 text-xs font-extrabold text-neutral-800 transition hover:border-neutral-900"
              >
                Browse Trending Catalog
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left 8 Columns: Cart Items + VIN & Warranty Controls */}
            <div className="space-y-5 lg:col-span-8">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-5 py-3.5 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-black text-white">
                    {summary.totalQuantity}
                  </span>
                  <h2 className="text-sm font-extrabold text-neutral-900">
                    Selected Parts in Database Cart ({items.length}{' '}
                    {items.length === 1 ? 'line item' : 'line items'})
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <Link
                    href="/#part-search"
                    className="text-xs font-bold text-[#ef263d] hover:underline"
                  >
                    + Add Another Part
                  </Link>
                  <button
                    type="button"
                    onClick={handleClearCart}
                    className="text-xs font-semibold text-neutral-500 transition hover:text-red-600"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {items.map((item) => {
                const conditionBadge =
                  CONDITION_STYLES[item.condition] ?? CONDITION_STYLES.new;
                const isItemBusy = busyPartId === item.partId;
                const vehicleLabel =
                  item.year || item.make || item.model
                    ? `${item.year || ''} ${item.make || ''} ${item.model || ''}`.trim()
                    : null;

                return (
                  <article
                    key={item.partId}
                    className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-300 sm:p-6"
                  >
                    <div className="flex flex-col gap-5 sm:flex-row">
                      {/* Part Thumbnail */}
                      <div className="relative flex h-36 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 sm:h-36 sm:w-40">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.part}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="text-center">
                            <span className="block text-2xl font-black text-neutral-400">OEM</span>
                            <span className="text-[10px] font-bold uppercase text-neutral-400">
                              {item.partType || 'AUTO PART'}
                            </span>
                          </div>
                        )}
                        <span
                          className={`absolute left-2 top-2 rounded px-2 py-0.5 text-[10px] font-extrabold uppercase ${conditionBadge.className}`}
                        >
                          {conditionBadge.label}
                        </span>
                      </div>

                      {/* Part Details & Controls */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono text-[11px] font-semibold text-neutral-500">
                                SKU: {item.sku}
                              </span>
                              {vehicleLabel && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-neutral-900 px-2.5 py-0.5 text-[11px] font-bold text-white">
                                  <span>🚗 Fits:</span>
                                  <span>{vehicleLabel}</span>
                                </span>
                              )}
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                                ✓ Core Deposit Waived ($0.00)
                              </span>
                            </div>

                            <h3 className="mt-1.5 text-base font-black text-neutral-900">
                              {item.part}
                            </h3>
                          </div>

                          <div className="text-right">
                            <span className="block text-lg font-black text-[#e51515]">
                              ${item.lineSubtotal.toFixed(2)}
                            </span>
                            <span className="text-[11px] text-neutral-500">
                              ${item.price.toFixed(2)} each
                              {item.warrantyPrice > 0
                                ? ` + $${item.warrantyPrice.toFixed(2)} warranty`
                                : ''}
                            </span>
                          </div>
                        </div>

                        {item.description && (
                          <p className="mt-1.5 text-xs leading-relaxed text-neutral-500">
                            {item.description}
                          </p>
                        )}

                        {/* Quantity & Remove Row */}
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-700">Quantity:</span>
                            <div className="inline-flex items-center rounded-lg border border-neutral-200 bg-neutral-50">
                              <button
                                type="button"
                                disabled={isItemBusy}
                                onClick={() => handleQuantityChange(item.partId, item.quantity - 1)}
                                aria-label="Decrease quantity"
                                className="h-8 w-8 text-sm font-black text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-50"
                              >
                                −
                              </button>
                              <span className="min-w-[34px] text-center text-xs font-extrabold text-neutral-900">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={isItemBusy}
                                onClick={() => handleQuantityChange(item.partId, item.quantity + 1)}
                                aria-label="Increase quantity"
                                className="h-8 w-8 text-sm font-black text-neutral-700 transition hover:bg-neutral-200 disabled:opacity-50"
                              >
                                +
                              </button>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isItemBusy}
                            onClick={() => handleRemoveItem(item.partId)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-neutral-500 transition hover:text-red-600 disabled:opacity-50"
                          >
                            <span>✕ Remove Part</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Reman-Transmission Style VIN Fitment Verification Box */}
                    <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
                      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                        <div>
                          <span className="text-xs font-extrabold text-neutral-900">
                            1. Exact Vehicle VIN Fitment Verification (Recommended)
                          </span>
                          <p className="text-[11px] text-neutral-500">
                            Enter your 17-character Vehicle Identification Number so our powertrain team verifies 100% plug-and-play compatibility before shipping.
                          </p>
                        </div>
                        {item.vin && (
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-extrabold text-emerald-800">
                            ✓ VIN Saved: {item.vin}
                          </span>
                        )}
                      </div>

                      <div className="mt-2.5 flex flex-col gap-2 sm:flex-row">
                        <input
                          type="text"
                          maxLength={17}
                          value={vinDrafts[item.partId] ?? ''}
                          onChange={(e) =>
                            setVinDrafts((prev) => ({
                              ...prev,
                              [item.partId]: e.target.value.toUpperCase(),
                            }))
                          }
                          placeholder="Enter 17-Digit VIN (e.g. WBS33AY05RFL12345)"
                          className="h-9 flex-1 rounded-lg border border-neutral-300 bg-white px-3 font-mono text-xs uppercase text-neutral-900 outline-none focus:border-[#ef263d]"
                        />
                        <button
                          type="button"
                          disabled={isItemBusy}
                          onClick={() => handleSaveVin(item.partId)}
                          className="h-9 rounded-lg bg-neutral-900 px-4 text-xs font-bold text-white transition hover:bg-[#ef263d] disabled:opacity-50"
                        >
                          {savedVinPartId === item.partId ? '✓ VIN Saved' : 'Verify & Save VIN'}
                        </button>
                      </div>
                    </div>

                    {/* Reman-Transmission Style Protection & Warranty Plan Selector */}
                    <div className="mt-4">
                      <span className="block text-xs font-extrabold text-neutral-900">
                        2. Select Powertrain &amp; Component Warranty Coverage:
                      </span>
                      <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        {WARRANTY_OPTIONS.map((option) => {
                          const isSelected = item.warrantyPlan === option.id;
                          return (
                            <button
                              key={option.id}
                              type="button"
                              disabled={isItemBusy}
                              onClick={() => handleWarrantyChange(item.partId, option.id)}
                              className={`flex flex-col justify-between rounded-xl border p-3 text-left transition ${
                                isSelected
                                  ? 'border-[#ef263d] bg-red-50/40 ring-1 ring-[#ef263d]'
                                  : 'border-neutral-200 bg-white hover:border-neutral-300'
                              }`}
                            >
                              <div>
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-xs font-extrabold text-neutral-900">
                                    {option.price === 0 ? 'INCLUDED' : `+$${option.price}.00`}
                                  </span>
                                  {isSelected && (
                                    <span className="rounded bg-[#ef263d] px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
                                      Selected
                                    </span>
                                  )}
                                </div>
                                <p className="mt-1 text-xs font-bold text-neutral-800">
                                  {option.title}
                                </p>
                              </div>
                              <p className="mt-1.5 text-[11px] leading-snug text-neutral-500">
                                {option.subtitle}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Right 4 Columns: Reman-Transmission Style Order Summary & Dispatch Checkout */}
            <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                <h2 className="border-b border-neutral-100 pb-3 text-lg font-black text-neutral-900">
                  Order &amp; Freight Summary
                </h2>

                {/* Freight Delivery Type Selector */}
                <div className="mt-4">
                  <span className="block text-xs font-extrabold text-neutral-800">
                    Freight / Delivery Destination Type:
                  </span>
                  <div className="mt-2 space-y-2">
                    <label
                      className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs transition ${
                        cart?.shippingType === 'commercial'
                          ? 'border-[#ef263d] bg-red-50/30'
                          : 'border-neutral-200 bg-neutral-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingType"
                        checked={cart?.shippingType !== 'residential'}
                        onChange={() => handleShippingTypeChange('commercial')}
                        className="mt-0.5 accent-[#ef263d]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between font-bold text-neutral-900">
                          <span>Commercial / Repair Shop</span>
                          <span className="text-emerald-600">FREE</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          Direct dock or auto repair shop delivery (forklift / bay access)
                        </p>
                      </div>
                    </label>

                    <label
                      className={`flex cursor-pointer items-start gap-2.5 rounded-xl border p-3 text-xs transition ${
                        cart?.shippingType === 'residential'
                          ? 'border-[#ef263d] bg-red-50/30'
                          : 'border-neutral-200 bg-neutral-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="shippingType"
                        checked={cart?.shippingType === 'residential'}
                        onChange={() => handleShippingTypeChange('residential')}
                        className="mt-0.5 accent-[#ef263d]"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between font-bold text-neutral-900">
                          <span>Residential + Liftgate</span>
                          <span>$49.00</span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          Home garage delivery with hydraulic liftgate unloading
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Price Breakdown */}
                <dl className="mt-5 space-y-2.5 border-t border-neutral-100 pt-4 text-xs">
                  <div className="flex items-center justify-between text-neutral-600">
                    <dt>Parts Subtotal ({summary.totalQuantity} items)</dt>
                    <dd className="font-bold text-neutral-900">
                      ${summary.partsSubtotal.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <dt>Core Deposit / Exchange Fee</dt>
                    <dd className="font-bold text-emerald-600">$0.00 (Waived)</dd>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <dt>Protection &amp; Warranty Coverage</dt>
                    <dd className="font-bold text-neutral-900">
                      ${summary.warrantyTotal.toFixed(2)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-neutral-600">
                    <dt>Freight &amp; Handling</dt>
                    <dd className="font-bold text-neutral-900">
                      {summary.shippingCost === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        `$${summary.shippingCost.toFixed(2)}`
                      )}
                    </dd>
                  </div>

                  <div className="flex items-baseline justify-between border-t border-neutral-200 pt-3 text-base">
                    <dt className="font-black text-neutral-900">Estimated Total</dt>
                    <dd className="text-xl font-black text-[#e51515]">
                      ${summary.grandTotal.toFixed(2)}
                    </dd>
                  </div>
                </dl>

                {/* Dispatch & Checkout Form */}
                <form onSubmit={handleCompleteOrder} className="mt-5 space-y-3 border-t border-neutral-100 pt-4">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-neutral-700">
                    Dispatch &amp; Contact Details
                  </p>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700">
                      Full Name or Shop Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Alex Mercer / Mercer Performance Shop"
                      className="mt-1 h-9 w-full rounded-lg border border-neutral-200 px-3 text-xs text-neutral-900 outline-none focus:border-[#ef263d]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="mt-1 h-9 w-full rounded-lg border border-neutral-200 px-3 text-xs text-neutral-900 outline-none focus:border-[#ef263d]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-neutral-700">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="(800) 555-0199"
                        className="mt-1 h-9 w-full rounded-lg border border-neutral-200 px-3 text-xs text-neutral-900 outline-none focus:border-[#ef263d]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-700">
                      Shipping / Shop Bay Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="742 Evergreen Industrial Pkwy, Suite B, Austin, TX"
                      className="mt-1 h-9 w-full rounded-lg border border-neutral-200 px-3 text-xs text-neutral-900 outline-none focus:border-[#ef263d]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#ef263d] px-5 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm transition hover:bg-[#d91f34] disabled:opacity-60"
                  >
                    {isSubmittingOrder
                      ? 'Locking Fitment & Processing...'
                      : `Complete Order • $${summary.grandTotal.toFixed(2)}`}
                  </button>
                </form>
              </div>

              {/* Reman-Transmission Specialist Assistance Box */}
              <div className="rounded-2xl bg-[#161824] p-5 text-white">
                <span className="inline-block rounded bg-amber-400 px-2 py-0.5 text-[10px] font-black uppercase text-neutral-950">
                  Powertrain Fitment Desk
                </span>
                <h3 className="mt-2 text-sm font-black">
                  Need VIN Verification or Freight Assistance?
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-neutral-300">
                  Our drivetrain and OEM parts specialists verify transmission codes, engine casting numbers, and shop delivery logistics.
                </p>
                <div className="mt-3 flex items-center justify-between rounded-xl bg-white/10 px-3.5 py-2.5 text-xs">
                  <span className="text-neutral-300">Direct Specialist Line:</span>
                  <a href="tel:18005550199" className="font-extrabold text-amber-400 hover:underline">
                    1-800-555-0199
                  </a>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
