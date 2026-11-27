'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { motion, useAnimationControls, useReducedMotion } from 'motion/react';

const BRANDS = [
  'Acura', 'Alfa Romeo', 'Audi', 'BMW', 'British Leyland', 'Buick', 'Cadillac', 'Chevrolet',
  'Chrysler', 'Dodge', 'Eagle', 'Fiat', 'Ford', 'Freightliner', 'GMC', 'Genesis',
  'Honda', 'Hummer', 'Hyundai', 'Infiniti', 'Isuzu', 'Jaguar', 'Jeep', 'Kia',
  'Land Rover', 'Lexus', 'Lincoln', 'Mazda', 'Mercedes-Benz', 'Mercury', 'Mini', 'Mitsubishi',
  'Nissan', 'Oldsmobile', 'Other', 'Plymouth', 'Pontiac', 'Porsche', 'Ram', 'Rover',
  'Saab', 'Saturn', 'Scion', 'Smart', 'Subaru', 'Suzuki', 'Toyota', 'Volkswagen', 'Volvo',
] as const;

const TICKER_ANIMATION = {
  x: '-50%',
  transition: { duration: 90, ease: 'linear' as const, repeat: Infinity, repeatType: 'loop' as const },
};

export function VehicleBrandCarousel() {
  const reduceMotion = useReducedMotion();
  const controls = useAnimationControls();

  useEffect(() => {
    if (reduceMotion) return;
    void controls.start(TICKER_ANIMATION);

    return () => controls.stop();
  }, [controls, reduceMotion]);

  return (
    <section
      aria-label="Vehicle brands"
      className="mx-auto mt-14 max-w-[1440px] px-4 sm:px-6 lg:px-8"
      onMouseEnter={() => controls.stop()}
      onMouseLeave={() => {
        if (!reduceMotion) void controls.start(TICKER_ANIMATION);
      }}
    >
      <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 py-3 shadow-sm sm:py-4">
        <div className={reduceMotion ? 'overflow-x-auto' : 'overflow-hidden'}>
          <motion.div
            initial={{ x: '0%' }}
            animate={reduceMotion ? { x: '0%' } : controls}
            className="flex w-max"
          >
            {[0, 1].map((copy) => (
              <div
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
                className="flex shrink-0 items-center gap-2.5 px-1.5 sm:gap-3 sm:px-2"
              >
                {BRANDS.map((brand) => (
                  <Link
                    key={`${copy}-${brand}`}
                    href={`/parts?make=${encodeURIComponent(brand)}`}
                    tabIndex={copy === 1 ? -1 : undefined}
                    className="group inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md border border-white/10 bg-white/[0.06] px-3.5 py-2 text-xs font-bold text-white/90 transition-colors hover:border-[#facc15] hover:bg-[#facc15] hover:text-neutral-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#facc15] sm:min-h-11 sm:px-4 sm:text-sm"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#facc15] transition-colors group-hover:bg-neutral-950" aria-hidden="true" />
                    {brand}
                  </Link>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
