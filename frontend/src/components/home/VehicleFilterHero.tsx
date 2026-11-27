'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { VehicleSearch } from '@/components/home/VehicleSearch';
import { HeroArtworkCarousel } from '@/components/home/HeroArtworkCarousel';

export function VehicleFilterHero() {
  const prefersReducedMotion = useReducedMotion();
  const supportingInitialState = prefersReducedMotion ? false : { opacity: 0, y: -16 };
  const headlineInitialState = prefersReducedMotion ? false : { opacity: 0, y: 16 };
  const entrance = (delay: number) => ({
    duration: prefersReducedMotion ? 0 : 0.9,
    delay: prefersReducedMotion ? 0 : delay,
    ease: [0.22, 0.61, 0.36, 1] as [number, number, number, number],
  });

  return (
    <section className="relative isolate overflow-hidden bg-neutral-200">
      <HeroArtworkCarousel />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-neutral-100/95 via-neutral-100/85 to-neutral-100/90 lg:bg-gradient-to-r lg:from-neutral-100 lg:via-neutral-100/90 lg:to-transparent"
      />

      <div className="relative z-10 mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 lg:min-h-[570px] lg:grid-cols-[minmax(300px,390px)_minmax(280px,410px)_1fr] lg:gap-8 lg:px-8 lg:py-8">
        <motion.div
          className="order-2 min-w-0 lg:order-1"
          initial={supportingInitialState}
          animate={{ opacity: 1, y: 0 }}
          transition={entrance(2.1)}
        >
          <VehicleSearch />
        </motion.div>

        <div className="order-1 min-w-0 max-w-[540px] py-1 lg:order-2 lg:max-w-[390px] lg:py-2">
          <motion.span
            className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-neutral-700"
            initial={supportingInitialState}
            animate={{ opacity: 1, y: 0 }}
            transition={entrance(2.1)}
          >
            <span className="h-1.5 w-7 rounded-full bg-[#eab308]" />
            Made for the road ahead
          </motion.span>
          <motion.h1
            className="mt-3 sm:mt-4 text-3xl min-[380px]:text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl lg:text-[56px] xl:text-[68px]"
            initial={headlineInitialState}
            animate={{ opacity: 1, y: 0 }}
            transition={entrance(1.25)}
          >
            The right parts for every mile.
          </motion.h1>
          <motion.p
            className="mt-3 sm:mt-4 max-w-[430px] text-sm leading-6 text-neutral-700 lg:text-neutral-600 sm:text-base sm:leading-7"
            initial={supportingInitialState}
            animate={{ opacity: 1, y: 0 }}
            transition={entrance(2.1)}
          >
            Quality replacement and performance parts, selected to fit your vehicle and your next project.
          </motion.p>
          <motion.div
            className="mt-5 sm:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3"
            initial={supportingInitialState}
            animate={{ opacity: 1, y: 0 }}
            transition={entrance(2.1)}
          >
            <Link
              href="/parts"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#facc15] px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-neutral-950 transition hover:bg-[#eab308] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
            >
              Browse Parts <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="#categories"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-400 bg-white/85 px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
            >
              Explore Categories
            </Link>
          </motion.div>
        </div>
        <div aria-hidden="true" className="hidden lg:order-3 lg:block" />
      </div>
    </section>
  );
}
