'use client';

import { useEffect, useRef, useState, type TransitionEvent } from 'react';
import Image from 'next/image';

const slides = [
  { src: '/images/gearup-hero-1.webp', alt: 'Automotive brake and performance parts' },
  { src: '/images/gearup-hero-2.webp', alt: 'Performance brake rotor and red caliper on a warm studio background' },
];

const carouselSlides = [
  { ...slides[slides.length - 1], key: 'clone-last' },
  ...slides.map((slide) => ({ ...slide, key: slide.src })),
  { ...slides[0], key: 'clone-first' },
];

export function HeroArtworkCarousel() {
  // The first and last entries are clones used to make wraparound movement seamless.
  const [activeIndex, setActiveIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const wrappingRef = useRef(false);
  const activeSlideIndex =
    activeIndex === 0
      ? slides.length - 1
      : activeIndex === slides.length + 1
        ? 0
        : activeIndex - 1;

  useEffect(() => {
    if (transitionEnabled) return;
    const frame = window.requestAnimationFrame(() => setTransitionEnabled(true));
    return () => window.cancelAnimationFrame(frame);
  }, [transitionEnabled]);

  function showPrevious() {
    if (wrappingRef.current) return;
    if (activeIndex === 1) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      wrappingRef.current = !reduceMotion;
      setActiveIndex(reduceMotion ? slides.length : 0);
      return;
    }
    setActiveIndex((current) => current - 1);
  }

  function showNext() {
    if (wrappingRef.current) return;
    if (activeIndex === slides.length) {
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      wrappingRef.current = !reduceMotion;
      setActiveIndex(reduceMotion ? 1 : slides.length + 1);
      return;
    }
    setActiveIndex((current) => current + 1);
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || event.propertyName !== 'transform') return;

    if (activeIndex === 0 || activeIndex === slides.length + 1) {
      setTransitionEnabled(false);
      setActiveIndex(activeIndex === 0 ? slides.length : 1);
      wrappingRef.current = false;
    }
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 hidden lg:block">
      <div className="absolute inset-0 overflow-hidden">
        <div
          onTransitionEnd={handleTransitionEnd}
          className={`absolute inset-y-0 left-0 flex h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none ${transitionEnabled ? '' : '!transition-none'}`}
          style={{
            width: `${carouselSlides.length * 100}%`,
            transform: `translateX(-${(activeIndex * 100) / carouselSlides.length}%)`,
          }}
        >
          {carouselSlides.map((item, index) => (
            <div
              key={item.key}
              aria-hidden={index !== activeIndex}
              className="relative h-full shrink-0"
              style={{ width: `${100 / carouselSlides.length}%` }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                priority={index === 1}
                sizes="100vw"
                className="object-cover object-center grayscale"
              />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-neutral-100/20 via-transparent to-transparent" />
      </div>

      <button
        type="button"
        aria-label="Previous hero image"
        onClick={showPrevious}
        className="pointer-events-auto absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md backdrop-blur transition-colors duration-200 hover:bg-white hover:text-[#a88100] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eab308]"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next hero image"
        onClick={showNext}
        className="pointer-events-auto absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-neutral-800 shadow-md backdrop-blur transition-colors duration-200 hover:bg-white hover:text-[#a88100] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eab308]"
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
            aria-pressed={activeSlideIndex === index}
            onClick={() => {
              if (!wrappingRef.current) setActiveIndex(index + 1);
            }}
            className={`h-2.5 w-2.5 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eab308] ${
              activeSlideIndex === index ? 'bg-[#eab308]' : 'bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
