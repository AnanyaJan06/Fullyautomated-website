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
        className="pointer-events-none absolute inset-0 z-[1] hidden bg-gradient-to-r from-neutral-100 via-neutral-100/90 to-transparent lg:block"
      />

      <div className="relative z-10 mx-auto grid min-h-[620px] max-w-[1440px] grid-cols-1 items-center gap-8 px-4 py-10 sm:px-6 lg:min-h-[570px] lg:grid-cols-[minmax(300px,390px)_minmax(280px,410px)_1fr] lg:gap-8 lg:px-8 lg:py-8">
        <motion.div
          className="order-2 lg:order-1"
          initial={supportingInitialState}
          animate={{ opacity: 1, y: 0 }}
          transition={entrance(2.1)}
        >
          <VehicleSearch />
        </motion.div>

        <div className="order-1 max-w-[520px] py-2 lg:order-2 lg:max-w-[390px]">
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
            className="mt-4 text-4xl font-black leading-[1.03] tracking-tight text-neutral-950 sm:text-5xl lg:text-[62px] xl:text-[68px]"
            initial={headlineInitialState}
            animate={{ opacity: 1, y: 0 }}
            transition={entrance(1.25)}
          >
            The right parts for every mile.
          </motion.h1>
          <motion.p
            className="mt-4 max-w-[430px] text-sm leading-6 text-neutral-600 sm:text-base sm:leading-7"
            initial={supportingInitialState}
            animate={{ opacity: 1, y: 0 }}
            transition={entrance(2.1)}
          >
            Quality replacement and performance parts, selected to fit your vehicle and your next project.
          </motion.p>
          <motion.div
            className="mt-6 flex flex-wrap items-center gap-3"
            initial={supportingInitialState}
            animate={{ opacity: 1, y: 0 }}
            transition={entrance(2.1)}
          >
            <Link
              href="/parts"
              className="inline-flex items-center gap-2 rounded-lg bg-[#facc15] px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-[#eab308] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
            >
              Browse Parts <span aria-hidden="true">&rarr;</span>
            </Link>
            <Link
              href="#categories"
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-400 bg-white/75 px-5 py-3 text-sm font-semibold text-neutral-900 transition hover:border-neutral-900 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-950"
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
