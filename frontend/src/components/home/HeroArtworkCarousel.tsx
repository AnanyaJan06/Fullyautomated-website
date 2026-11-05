'use client';

import { useState } from 'react';
import Image from 'next/image';

const slides = [
  { src: '/images/gearup-hero-1.webp', alt: 'Automotive brake and performance parts' },
  { src: '/images/gearup-hero-2.webp', alt: 'Performance brake rotor and red caliper on a warm studio background' },
];

export function HeroArtworkCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  function showPrevious() {
    setActiveIndex((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % slides.length);
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
      <div className="absolute inset-0 overflow-hidden rounded-2xl">
        <div
          className="absolute inset-y-0 left-0 flex h-full w-[200%] transition-transform duration-700 ease-in-out motion-reduce:transition-none"
          style={{ transform: `translateX(-${activeIndex * 50}%)` }}
        >
          {slides.map((item, index) => (
            <div key={item.src} aria-hidden={index !== activeIndex} className="relative h-full w-1/2 shrink-0">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#f5e9e2]/25 via-transparent to-transparent" />
      </div>

      <button
        type="button"
        aria-label="Previous hero image"
        onClick={showPrevious}
        className="pointer-events-auto absolute -left-5 top-1/2 z-10 flex h-11 w-11 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-neutral-800 opacity-0 shadow-md backdrop-blur transition-[opacity,transform] duration-300 ease-out hover:bg-white/90 hover:text-[#ef263d] hover:opacity-100 group-hover:translate-x-0 group-hover:opacity-85 group-focus-within:translate-x-0 group-focus-within:opacity-85 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef263d]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next hero image"
        onClick={showNext}
        className="pointer-events-auto absolute -right-5 top-1/2 z-10 flex h-11 w-11 translate-x-2 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-neutral-800 opacity-0 shadow-md backdrop-blur transition-[opacity,transform] duration-300 ease-out hover:bg-white/90 hover:text-[#ef263d] hover:opacity-100 group-hover:translate-x-0 group-hover:opacity-85 group-focus-within:translate-x-0 group-focus-within:opacity-85 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef263d]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      <div className="pointer-events-auto absolute bottom-5 right-5 z-10 flex items-center gap-2 rounded-full bg-white/90 p-2 shadow-sm backdrop-blur-sm">
        {slides.map((item, index) => (
          <button
            key={item.src}
            type="button"
            aria-label={`Show hero image ${index + 1}`}
            aria-pressed={activeIndex === index}
            onClick={() => setActiveIndex(index)}
            className={`h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef263d] ${
              activeIndex === index ? 'bg-[#ef263d]' : 'bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
