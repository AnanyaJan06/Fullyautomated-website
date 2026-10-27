'use client';

import { useState } from 'react';
import Image from 'next/image';

const slides = [
  { src: '/images/gearup-hero-1.webp', alt: 'Automotive brake and performance parts' },
  { src: '/images/gearup-hero-2.webp', alt: 'Performance brake rotor and red caliper on a warm studio background' },
];

export function HeroArtworkCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = slides[activeIndex];

  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[48%] lg:block">
      <Image
        key={slide.src}
        src={slide.src}
        alt={slide.alt}
        fill
        priority={activeIndex === 0}
        loading={activeIndex === 0 ? undefined : 'eager'}
        sizes="(min-width: 1280px) 48vw, (min-width: 1024px) 48vw, 1px"
        className="object-cover object-[70%_center]"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-l from-transparent via-[#f5e9e2]/10 to-[#f5e9e2]/40" />

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
