'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { DatabasePart } from '@/types';

const TABS = [
  { id: 'description', label: 'Description' },
  { id: 'specifications', label: 'Specifications' },
  { id: 'shipping', label: 'Shipping & warranty' },
  { id: 'reviews', label: 'Reviews' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function PartInformationTabs({ part, category }: { part: DatabasePart; category: string }) {
  const [activeTab, setActiveTab] = useState<TabId>('description');
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const descriptionParagraphs = part.description?.split(/\n\s*\n/).filter(Boolean) ?? [];
  const activeIndex = TABS.findIndex((tab) => tab.id === activeTab);
  const panelVariants = {
    enter: (slideDirection: number) => reduceMotion
      ? { opacity: 0, x: 0 }
      : { opacity: 0, x: slideDirection * 36 },
    center: { opacity: 1, x: 0 },
    exit: (slideDirection: number) => reduceMotion
      ? { opacity: 0, x: 0 }
      : { opacity: 0, x: slideDirection * -36 },
  };

  function selectTab(tabId: TabId) {
    const nextIndex = TABS.findIndex((tab) => tab.id === tabId);
    if (nextIndex === activeIndex) return;
    setDirection(nextIndex > activeIndex ? 1 : -1);
    setActiveTab(tabId);
  }

  function handleTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number | undefined;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % TABS.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + TABS.length) % TABS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = TABS.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    tabRefs.current[nextIndex]?.focus();
    selectTab(TABS[nextIndex].id);
  }

  return (
    <section className="mt-7 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div role="tablist" aria-label="Product information" className="no-scrollbar flex overflow-x-auto border-b border-neutral-200 px-2 sm:px-6">
        {TABS.map((tab, index) => {
          const selected = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              ref={(element) => { tabRefs.current[index] = element; }}
              id={`part-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="part-tab-panel"
              tabIndex={selected ? 0 : -1}
              onClick={() => selectTab(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`shrink-0 whitespace-nowrap border-b-2 px-3 py-3.5 text-xs transition-colors sm:px-4 sm:py-4 sm:text-sm ${selected ? 'border-[#facc15] font-bold text-neutral-950' : 'border-transparent font-semibold text-neutral-600 hover:text-neutral-950'}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="min-h-[220px] overflow-x-hidden px-4 sm:min-h-[260px] sm:px-8 lg:min-h-[300px]">
        <AnimatePresence initial={false} mode="wait" custom={direction}>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={panelVariants}
            id="part-tab-panel"
            role="tabpanel"
            aria-labelledby={`part-tab-${activeTab}`}
            tabIndex={0}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="py-5 sm:py-7 outline-none"
          >
            {activeTab === 'description' && (
              <>
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-950">Product description</h2>
                {descriptionParagraphs.length > 0 ? (
                  <div className="mt-3 sm:mt-4 max-w-4xl space-y-4 text-sm leading-7 text-neutral-600">
                    {descriptionParagraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                  </div>
                ) : (
                  <p className="mt-3 sm:mt-4 text-sm text-neutral-500">Detailed product information is not available for this part yet.</p>
                )}
              </>
            )}

            {activeTab === 'specifications' && (
              <>
                <h2 className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-950">Specifications &amp; fitment</h2>
                <dl className="mt-3 sm:mt-4 grid max-w-3xl grid-cols-1 gap-x-10 sm:grid-cols-2">
                  {[['Part', part.part], ['Category', category], ['Condition', part.condition], ['Year', String(part.year)], ['Make', part.make], ['Model', part.model]].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4 border-b border-neutral-100 py-3 text-xs sm:text-sm"><dt className="shrink-0 text-neutral-500">{label}</dt><dd className="break-words text-right font-semibold capitalize text-neutral-900">{value}</dd></div>
                  ))}
                </dl>
              </>
            )}

            {activeTab === 'shipping' && (
              <>
                <h2 className="text-lg font-extrabold tracking-tight text-neutral-950">Shipping &amp; warranty</h2>
                <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-600">For shipping options and warranty coverage for this specific part, please contact our parts team before ordering.</p>
                <a href="tel:+18001234567890" className="mt-3 inline-flex text-sm font-bold text-[#806000] hover:text-neutral-950">Ask our parts team <span className="ml-1" aria-hidden="true">&rarr;</span></a>
              </>
            )}

            {activeTab === 'reviews' && (
              <>
                <h2 className="text-lg font-extrabold tracking-tight text-neutral-950">Customer reviews</h2>
                <p className="mt-3 text-sm text-neutral-500">Reviews for this part are not available yet.</p>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
