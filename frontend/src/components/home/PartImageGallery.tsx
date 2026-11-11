'use client';

import { useEffect, useState, type MouseEvent, type ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface PartImageGalleryProps {
  images: string[];
  title: string;
  subtitle?: string;
  overlayBadge?: ReactNode;
  fallbackMark?: string;
  fallbackGradient?: string;
}

export function PartImageGallery({
  images,
  title,
  subtitle,
  overlayBadge,
  fallbackMark = 'PART',
  fallbackGradient = 'from-neutral-100 to-neutral-200',
}: PartImageGalleryProps) {
  const validImages = Array.isArray(images)
    ? images.map((src) => (typeof src === 'string' ? src.trim() : '')).filter(Boolean)
    : [];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const totalSlides = validImages.length;
  const safeIndex = totalSlides > 0 ? Math.min(activeIndex, totalSlides - 1) : 0;
  const currentImage = validImages[safeIndex];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  useEffect(() => {
    if (!isPreviewOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsPreviewOpen(false);
        setIsZoomed(false);
      } else if (event.key === 'ArrowRight' && totalSlides > 1) {
        setActiveIndex((prev) => (prev + 1) % totalSlides);
        setIsZoomed(false);
      } else if (event.key === 'ArrowLeft' && totalSlides > 1) {
        setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
        setIsZoomed(false);
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPreviewOpen, totalSlides]);

  function goToPrevious(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (totalSlides <= 1) return;
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    setIsZoomed(false);
  }

  function goToNext(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    if (totalSlides <= 1) return;
    setActiveIndex((prev) => (prev + 1) % totalSlides);
    setIsZoomed(false);
  }

  function openPreview(event: MouseEvent<HTMLElement>) {
    event.stopPropagation();
    if (totalSlides === 0) return;
    setIsPreviewOpen(true);
    setIsZoomed(false);
  }

  function closePreview() {
    setIsPreviewOpen(false);
    setIsZoomed(false);
  }

  return (
    <div className="mb-3">
      {/* Main Card Slide Viewport */}
      <div
        className={`group/slider relative flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${fallbackGradient} border border-neutral-200/80`}
      >
        {currentImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentImage}
              src={currentImage}
              alt={`${title} - Slide ${safeIndex + 1} of ${totalSlides}`}
              onClick={openPreview}
              className="h-full w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover/slider:scale-105"
              loading="lazy"
            />

            {/* Top Left Slide Counter Badge */}
            {totalSlides > 1 && (
              <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-md bg-neutral-950/75 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-white backdrop-blur-sm">
                {safeIndex + 1} / {totalSlides}
              </span>
            )}

            {/* Top Right Preview Trigger Button */}
            <button
              type="button"
              onClick={openPreview}
              aria-label={`Preview images for ${title}`}
              className="absolute right-2 top-2 z-10 inline-flex items-center gap-1 rounded-md bg-neutral-950/80 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm backdrop-blur-sm transition hover:bg-[#ef263d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ef263d]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5M11 8v6M8 11h6" />
              </svg>
              <span>Preview</span>
            </button>

            {/* Previous & Next Slide Buttons */}
            {totalSlides > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label={`Previous slide for ${title}`}
                  className="absolute left-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md backdrop-blur-sm transition hover:bg-[#ef263d] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ef263d]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M12.5 15 7.5 10l5-5" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  aria-label={`Next slide for ${title}`}
                  className="absolute right-2 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-900 shadow-md backdrop-blur-sm transition hover:bg-[#ef263d] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ef263d]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M7.5 15 12.5 10l-5-5" />
                  </svg>
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <span
              aria-hidden="true"
              className="text-3xl font-black tracking-tight text-neutral-700/80"
            >
              {fallbackMark}
            </span>
          </div>
        )}

        {/* Bottom Left Overlay Badge (Vehicle Fitment or Category) */}
        {overlayBadge && (
          <div className="pointer-events-none absolute bottom-2 left-2 z-10">{overlayBadge}</div>
        )}

        {/* Bottom Right Slide Dots */}
        {totalSlides > 1 && (
          <div className="absolute bottom-2 right-2 z-10 flex items-center gap-1 rounded-full bg-neutral-950/75 px-2 py-1 backdrop-blur-sm">
            {validImages.map((src, idx) => (
              <button
                key={`${src}-${idx}`}
                type="button"
                aria-label={`Go to slide ${idx + 1}`}
                aria-pressed={safeIndex === idx}
                onClick={(event) => {
                  event.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  safeIndex === idx
                    ? 'w-4 bg-[#ef263d]'
                    : 'w-1.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mini Thumbnail Strip Under Main Card Image */}
      {totalSlides > 1 && (
        <div className="mt-2 grid grid-cols-4 gap-1.5" role="group" aria-label="Part image slides">
          {validImages.slice(0, 4).map((src, idx) => {
            const isSelected = safeIndex === idx;
            return (
              <button
                key={`${src}-thumb-${idx}`}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Select slide ${idx + 1} for ${title}`}
                aria-pressed={isSelected}
                className={`relative h-10 overflow-hidden rounded-md border transition-all ${
                  isSelected
                    ? 'border-[#ef263d] ring-2 ring-[#ef263d]/25'
                    : 'border-neutral-200 opacity-75 hover:border-neutral-400 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${title} thumbnail ${idx + 1}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Fullscreen Lightbox Preview Modal (Portaled to document.body) */}
      {isMounted &&
        isPreviewOpen &&
        currentImage &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Image preview for ${title}`}
            onClick={closePreview}
            className="animate-fade-in fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/85 p-4 backdrop-blur-md sm:p-6"
          >
            <div
              onClick={(event) => event.stopPropagation()}
              className="animate-scale-in relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#121521] text-white shadow-2xl"
            >
              {/* Modal Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-[#ef263d] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                      Slide {safeIndex + 1} of {totalSlides}
                    </span>
                    {subtitle && (
                      <span className="truncate text-xs font-semibold text-neutral-300">
                        {subtitle}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 truncate text-sm font-bold text-white sm:text-base">
                    {title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsZoomed((prev) => !prev)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
                  >
                    <span>{isZoomed ? 'Reset Zoom (1x)' : 'Zoom In (1.6x)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={closePreview}
                    aria-label="Close image preview"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/10 text-sm font-black text-white transition hover:bg-[#ef263d]"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Main Slide Stage */}
              <div className="relative flex min-h-[300px] flex-1 items-center justify-center overflow-hidden bg-neutral-950 p-4 sm:min-h-[420px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  key={`preview-${currentImage}`}
                  src={currentImage}
                  alt={`${title} - Preview Slide ${safeIndex + 1}`}
                  onClick={() => setIsZoomed((prev) => !prev)}
                  className={`max-h-[58vh] w-auto max-w-full rounded-lg object-contain transition-transform duration-300 ${
                    isZoomed ? 'scale-150 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                  }`}
                />

                {totalSlides > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={goToPrevious}
                      aria-label="Previous preview slide"
                      className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-neutral-900/85 text-white shadow-lg transition hover:bg-[#ef263d]"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M12.5 15 7.5 10l5-5" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={goToNext}
                      aria-label="Next preview slide"
                      className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-neutral-900/85 text-white shadow-lg transition hover:bg-[#ef263d]"
                    >
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-5 w-5"
                      >
                        <path d="M7.5 15 12.5 10l-5-5" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Modal Footer Thumbnail Strip */}
              {totalSlides > 1 && (
                <div className="border-t border-white/10 bg-[#161a29] px-5 py-3.5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Part Image Slides ({totalSlides} Views)
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      Use ← / → arrow keys or click any slide below
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
                    {validImages.map((src, idx) => {
                      const isSelected = safeIndex === idx;
                      return (
                        <button
                          key={`modal-thumb-${src}-${idx}`}
                          type="button"
                          onClick={() => {
                            setActiveIndex(idx);
                            setIsZoomed(false);
                          }}
                          className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                            isSelected
                              ? 'border-[#ef263d] ring-2 ring-[#ef263d]/40 opacity-100'
                              : 'border-white/15 opacity-60 hover:border-white/40 hover:opacity-100'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={src}
                            alt={`${title} slide ${idx + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.2 text-[9px] font-bold text-white">
                            #{idx + 1}
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
