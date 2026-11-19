'use client';

import { useState, type FormEvent } from 'react';

export function ContactForm() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('vin-fitment');
  const [vehicleInfo, setVehicleInfo] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const randomRef = `AUT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketId(randomRef);
    setSubmitted(true);
  }

  function handleReset() {
    setFullName('');
    setEmail('');
    setPhone('');
    setTopic('vin-fitment');
    setVehicleInfo('');
    setMessage('');
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div
        role="status"
        className="animate-scale-in rounded-2xl border border-emerald-200 bg-emerald-50/90 p-6 text-emerald-950 sm:p-8"
      >
        <span className="inline-flex items-center rounded-full bg-emerald-700 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
          Inquiry Received • Ref #{ticketId}
        </span>
        <h3 className="mt-3 text-xl font-black text-emerald-950">
          Thank you, {fullName || 'valued customer'}!
        </h3>
        <p className="mt-2 text-xs leading-6 text-emerald-900 sm:text-sm">
          Our ASE-certified parts specialist team has received your inquiry and will reply to{' '}
          <strong className="font-bold">{email}</strong> within 2 business hours.
        </p>
        {vehicleInfo && (
          <p className="mt-2 rounded-lg bg-white/80 px-3 py-2 text-xs font-semibold text-emerald-900">
            Vehicle / VIN on file: {vehicleInfo}
          </p>
        )}
        <button
          type="button"
          onClick={handleReset}
          className="mt-5 inline-flex items-center rounded-xl bg-neutral-950 px-5 py-2.5 text-xs font-extrabold text-white transition hover:bg-neutral-800"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const inputClass =
    'mt-1.5 h-11 w-full rounded-xl border border-neutral-200 bg-white px-3.5 text-xs text-neutral-800 outline-none transition focus:border-[#eab308] focus:ring-2 focus:ring-[#eab308]/20 sm:text-sm';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="block text-xs font-bold text-neutral-700">
            Full Name <span className="text-[#8a6b00]">*</span>
          </label>
          <input
            id="contact-name"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Alex Rivera"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="block text-xs font-bold text-neutral-700">
            Email Address <span className="text-[#8a6b00]">*</span>
          </label>
          <input
            id="contact-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alex@example.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="block text-xs font-bold text-neutral-700">
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 234-5678"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="contact-topic" className="block text-xs font-bold text-neutral-700">
            Inquiry Topic <span className="text-[#8a6b00]">*</span>
          </label>
          <select
            id="contact-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={inputClass}
          >
            <option value="vin-fitment">VIN &amp; Vehicle Fitment Check</option>
            <option value="part-quote">Engine / Transmission Availability &amp; Quote</option>
            <option value="order-freight">Order Status &amp; Freight Tracking</option>
            <option value="warranty-core">Warranty Claim &amp; Core Return Pickup</option>
            <option value="shop-fleet">Commercial Shop / Fleet Account Inquiry</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="contact-vehicle" className="block text-xs font-bold text-neutral-700">
          Vehicle Year / Make / Model or 17-Digit VIN (Optional)
        </label>
        <input
          id="contact-vehicle"
          type="text"
          value={vehicleInfo}
          onChange={(e) => setVehicleInfo(e.target.value)}
          placeholder="e.g. 2019 Ford F-150 5.0L or VIN: 1FTEW1E5..."
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs font-bold text-neutral-700">
          How Can Our Parts Specialists Help? <span className="text-[#8a6b00]">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={4}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us the part you need, your vehicle symptoms, or your order number..."
          className="mt-1.5 w-full rounded-xl border border-neutral-200 bg-white p-3.5 text-xs text-neutral-800 outline-none transition focus:border-[#eab308] focus:ring-2 focus:ring-[#eab308]/20 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#facc15] px-6 text-xs font-extrabold text-neutral-950 transition hover:bg-[#eab308] active:scale-[0.99] sm:w-auto sm:text-sm"
      >
        Submit Parts Inquiry &rarr;
      </button>
    </form>
  );
}
