'use client';

import { useEffect, useRef, useState, type MouseEvent, type ReactNode, type TransitionEvent } from 'react';
import { createPortal } from 'react-dom';

interface PartImageGalleryProps {
  images: string[];
  title: string;
  subtitle?: string;
  overlayBadge?: ReactNode;
  fallbackMark?: string;
  fallbackGradient?: string;
  priority?: boolean;
  size?: 'card' | 'detail';
}

export function PartImageGallery({
  images,
  title,
  overlayBadge,
  fallbackMark = 'PART',
  fallbackGradient = 'from-neutral-100 to-neutral-200',
  priority = false,
  size = 'card',
}: PartImageGalleryProps) {
  const validImages = Array.isArray(images)
    ? images.map((src) => (typeof src === 'string' ? src.trim() : '')).filter(Boolean)
    : [];
  const totalSlides = validImages.length;
  const loopImages = totalSlides > 0
    ? [validImages[totalSlides - 1], ...validImages, validImages[0]]
    : [];

  // Track positions 0 and totalSlides + 1 are clones for seamless wraparound.
  const [trackIndex, setTrackIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const wrappingRef = useRef(false);

  const activeIndex = totalSlides === 0
    ? 0
    : trackIndex === 0
      ? totalSlides - 1
      : trackIndex === totalSlides + 1
        ? 0
        : trackIndex - 1;
  const currentImage = validImages[activeIndex];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    wrappingRef.current = false;
    setTrackIndex(1);
    setTransitionEnabled(true);
  }, [images]);

  useEffect(() => {
    if (transitionEnabled) return;
    const frame = window.requestAnimationFrame(() => setTransitionEnabled(true));
    return () => window.cancelAnimationFrame(frame);
  }, [transitionEnabled]);

  function movePrevious() {
    if (totalSlides <= 1 || wrappingRef.current) return;
    if (trackIndex === 1) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setTrackIndex(totalSlides);
      } else {
        wrappingRef.current = true;
        setTrackIndex(0);
      }
      return;
    }
    setTrackIndex((current) => current - 1);
  }

  function moveNext() {
    if (totalSlides <= 1 || wrappingRef.current) return;
    if (trackIndex === totalSlides) {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setTrackIndex(1);
      } else {
        wrappingRef.current = true;
        setTrackIndex(totalSlides + 1);
      }
      return;
    }
    setTrackIndex((current) => current + 1);
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLDivElement>) {
    if (
      event.target !== event.currentTarget ||
      event.propertyName !== 'transform' ||
      !wrappingRef.current
    ) return;

    if (trackIndex === 0 || trackIndex === totalSlides + 1) {
      setTransitionEnabled(false);
      setTrackIndex(trackIndex === 0 ? totalSlides : 1);
      wrappingRef.current = false;
    }
  }

  function goToPrevious(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    movePrevious();
  }

  function goToNext(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    moveNext();
  }

  function openPreview(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    if (totalSlides > 0) setIsPreviewOpen(true);
  }

  function closePreview() {
    setIsPreviewOpen(false);
  }

  useEffect(() => {
    if (!isPreviewOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closePreview();
      else if (event.key === 'ArrowRight') moveNext();
      else if (event.key === 'ArrowLeft') movePrevious();
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreviewOpen, totalSlides, trackIndex]);

  const trackStyle = {
    width: `${loopImages.length * 100}%`,
    transform: `translateX(-${(trackIndex * 100) / (loopImages.length || 1)}%)`,
  };
  const trackClassName = `absolute inset-y-0 left-0 flex h-full transition-transform duration-700 ease-in-out motion-reduce:transition-none ${transitionEnabled ? '' : '!transition-none'}`;

  return (
    <div className="mb-3">
      <div
        className={`group/slider relative flex w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-200/80 bg-gradient-to-br ${fallbackGradient} ${size === 'detail' ? 'h-[320px] sm:h-[420px]' : 'h-44'}`}
      >
        {currentImage ? (
          <>
            <div
              onTransitionEnd={handleTransitionEnd}
              className={trackClassName}
              style={trackStyle}
            >
              {loopImages.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  aria-hidden={index !== trackIndex}
                  className="relative h-full shrink-0"
                  style={{ width: `${100 / loopImages.length}%` }}
                >
                  <button
                    type="button"
                    onClick={openPreview}
                    tabIndex={index === trackIndex ? 0 : -1}
                    aria-label={index === trackIndex ? `Open image preview for ${title}` : undefined}
                    className="group/image relative block h-full w-full cursor-zoom-in p-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#eab308]"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={index === trackIndex ? `${title} - Image ${activeIndex + 1} of ${totalSlides}` : ''}
                      className="h-full w-full object-cover"
                      loading={priority && index === 1 ? 'eager' : 'lazy'}
                      fetchPriority={priority && index === 1 ? 'high' : 'auto'}
                      decoding="async"
                    />
                    {size === 'card' && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-950/0 transition-colors duration-200 group-hover/image:bg-neutral-950/10 group-focus-visible/image:bg-neutral-950/10">
                        <span className="flex h-10 w-10 scale-90 items-center justify-center rounded-full bg-white/95 text-neutral-900 opacity-0 shadow-lg transition duration-200 group-hover/image:scale-100 group-hover/image:opacity-100 group-focus-visible/image:scale-100 group-focus-visible/image:opacity-100">
                          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                            <circle cx="10.8" cy="10.8" r="6.8" />
                            <path d="m16 16 4.2 4.2M10.8 8v5.6M8 10.8h5.6" />
                          </svg>
                        </span>
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>

            {size === 'detail' && totalSlides > 1 && (
              <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-md bg-neutral-950/75 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white backdrop-blur-sm">
                {activeIndex + 1} / {totalSlides}
              </span>
            )}

            {size === 'detail' && (
              <button
                type="button"
                onClick={openPreview}
                aria-label={`Preview images for ${title}`}
                className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md bg-neutral-950/80 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm transition hover:bg-[#facc15] hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eab308]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
                </svg>
                <span>Preview</span>
              </button>
            )}

            {totalSlides > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label={`Previous slide for ${title}`}
                  className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md backdrop-blur-sm transition hover:bg-[#facc15] hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#eab308]"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M12.5 15 7.5 10l5-5" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={goToNext}
                  aria-label={`Next slide for ${title}`}
                  className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md backdrop-blur-sm transition hover:bg-[#facc15] hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#eab308]"
                >
                  <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
                    <path d="M7.5 15 12.5 10l-5-5" />
                  </svg>
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span aria-hidden="true" className="text-3xl font-black tracking-tight text-neutral-700/80">
              {fallbackMark}
            </span>
          </div>
        )}

        {overlayBadge && (
          <div className="pointer-events-none absolute bottom-2 left-2 z-10">{overlayBadge}</div>
        )}

        {totalSlides > 1 && (
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-neutral-950/75 px-2 py-1 backdrop-blur-sm">
            {validImages.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                aria-label={`Go to slide ${index + 1}`}
                aria-pressed={activeIndex === index}
                onClick={(event) => {
                  event.stopPropagation();
                  if (!wrappingRef.current) setTrackIndex(index + 1);
                }}
                className={`h-1.5 rounded-full transition-all ${activeIndex === index ? 'w-4 bg-[#facc15]' : 'w-1.5 bg-white/60 hover:bg-white'}`}
              />
            ))}
          </div>
        )}
      </div>

      {size === 'detail' && totalSlides > 1 && (
        <div className="mt-2 grid grid-cols-4 gap-1.5" role="group" aria-label="Part image slides">
          {validImages.slice(0, 4).map((src, index) => {
            const isSelected = activeIndex === index;
            return (
              <button
                key={`${src}-thumb-${index}`}
                type="button"
                onClick={() => {
                  if (!wrappingRef.current) setTrackIndex(index + 1);
                }}
                aria-label={`Select slide ${index + 1} for ${title}`}
                aria-pressed={isSelected}
                className={`relative h-10 overflow-hidden rounded-md border transition-all ${isSelected ? 'border-[#facc15] ring-2 ring-[#facc15]/25' : 'border-neutral-200 opacity-75 hover:border-neutral-400 hover:opacity-100'}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`${title} thumbnail ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
              </button>
            );
          })}
        </div>
      )}

      {isMounted && isPreviewOpen && currentImage && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image preview for ${title}. Press Escape or click outside the image to close.`}
          onClick={closePreview}
          className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/85 p-4 backdrop-blur-md sm:p-6"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="animate-scale-in relative flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-neutral-950 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-4 py-3.5 sm:px-5">
              <div className="min-w-0">
                <h2 className="truncate text-sm font-bold text-neutral-950">{title}</h2>
                <p className="mt-0.5 text-xs text-neutral-500">Image {activeIndex + 1} of {totalSlides}</p>
              </div>
              <button
                type="button"
                onClick={closePreview}
                aria-label="Close image preview"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eab308]"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-5 w-5">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
            <div className="relative h-[min(58vh,560px)] min-h-[280px] overflow-hidden bg-neutral-100 sm:h-[min(62vh,600px)]">
              <div
                onTransitionEnd={handleTransitionEnd}
                className={trackClassName}
                style={trackStyle}
              >
                {loopImages.map((src, index) => (
                  <div
                    key={`preview-${src}-${index}`}
                    aria-hidden={index !== trackIndex}
                    className="flex h-full shrink-0 items-center justify-center p-4"
                    style={{ width: `${100 / loopImages.length}%` }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={src}
                      alt={index === trackIndex ? `${title} - Image ${activeIndex + 1}` : ''}
                      className="max-h-full max-w-full rounded-lg object-contain"
                      loading={index === trackIndex ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  </div>
                ))}
              </div>

              {totalSlides > 1 && (
                <>
                  <button
                    type="button"
                    onClick={goToPrevious}
                    aria-label="Previous preview image"
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-neutral-900 shadow-lg transition hover:bg-[#facc15]"
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M12.5 15 7.5 10l5-5" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={goToNext}
                    aria-label="Next preview image"
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/95 text-neutral-900 shadow-lg transition hover:bg-[#facc15]"
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M7.5 15 12.5 10l-5-5" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {totalSlides > 1 && (
              <div className="border-t border-neutral-200 bg-white px-4 py-3.5 sm:px-5">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-600">
                    Part images ({totalSlides})
                  </span>
                  <span className="text-[11px] text-neutral-500">Use arrow keys or select an image</span>
                </div>
                <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                  {validImages.map((src, index) => {
                    const isSelected = activeIndex === index;
                    return (
                      <button
                        key={`modal-thumb-${src}-${index}`}
                        type="button"
                        onClick={() => {
                          if (!wrappingRef.current) setTrackIndex(index + 1);
                        }}
                        aria-label={`Select preview image ${index + 1}`}
                        aria-pressed={isSelected}
                        className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${isSelected ? 'border-[#facc15] ring-2 ring-[#facc15]/40 opacity-100' : 'border-neutral-200 opacity-75 hover:border-neutral-400 hover:opacity-100'}`}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt={`${title} image ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                        <span className="absolute bottom-1 right-1 rounded bg-neutral-950/75 px-1.5 py-0.5 text-[9px] font-bold text-white">
                          {index + 1}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
