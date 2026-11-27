import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { AddToCartButton } from '@/components/home/AddToCartButton';
import { PartImageGallery } from '@/components/home/PartImageGallery';
import { PartInformationTabs } from '@/components/parts/PartInformationTabs';
import { ApiError } from '@/lib/api';
import { partService } from '@/services/part.service';

type PartPageProps = { params: Promise<{ id: string }> };

const loadPart = cache(async (id: string) => {
  if (!/^[a-f\d]{24}$/i.test(id)) notFound();

  try {
    const { data } = await partService.getPartById(id);
    return data;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
});

export async function generateMetadata({ params }: PartPageProps): Promise<Metadata> {
  const { id } = await params;
  const part = await loadPart(id);
  const fitment = [part.year, part.make, part.model].filter(Boolean).join(' ');

  return {
    title: `${part.part} | Automobilic`,
    description: `${part.part} for ${fitment}. Check fitment, product details, and current price at Automobilic.`,
  };
}

export default async function PartDetailsPage({ params }: PartPageProps) {
  const { id } = await params;
  const part = await loadPart(id);
  const fitment = [part.year, part.make, part.model].filter(Boolean).join(' ');
  const category = part.partType === 'transmission' ? 'Transmission' : 'Engine';
  const images = Array.isArray(part.images) ? part.images : [];

  return (
    <main className="min-h-[70vh] bg-neutral-50/70 pb-16">
      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-6 lg:px-8 lg:pt-8">
        <nav aria-label="Breadcrumb" className="mb-6 flex min-w-0 items-center gap-2 overflow-hidden text-xs font-medium text-neutral-500 sm:text-sm">
          <Link href="/" className="shrink-0 transition-colors hover:text-[#806000]">Home</Link>
          <span aria-hidden="true" className="text-neutral-300">/</span>
          <Link href="/parts" className="shrink-0 transition-colors hover:text-[#806000]">Parts</Link>
          <span aria-hidden="true" className="text-neutral-300">/</span>
          <span className="truncate text-neutral-700" aria-current="page">{part.part}</span>
        </nav>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_320px] xl:gap-6">
          <div className="min-w-0 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-5">
            <PartImageGallery
              images={images}
              title={part.part}
              subtitle={`${fitment} - ${category}`}
              fallbackMark={category}
              priority
              size="detail"
            />
          </div>

          <div className="min-w-0 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-7 xl:border-0 xl:bg-transparent xl:p-2 xl:shadow-none">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-neutral-950 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">{part.condition}</span>
              <span className="rounded-md bg-[#fef9c3] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#806000]">{category}</span>
            </div>
            <h1 className="mt-3 sm:mt-4 break-words text-xl font-black leading-tight tracking-tight text-neutral-950 sm:text-2xl md:text-3xl">{part.part}</h1>
            <div className="mt-3 inline-flex max-w-full items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
              <svg aria-hidden="true" viewBox="0 0 20 20" fill="none" className="h-4 w-4 shrink-0"><path d="m5 10 3.2 3.2L15.5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              <span className="truncate">Fits {fitment}</span>
            </div>
            <div className="mt-5 sm:mt-6 border-t border-neutral-200 pt-5">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">Product overview</h2>
              {part.description ? (
                <p className="mt-3 line-clamp-6 text-sm leading-6 text-neutral-600">{part.description.split(/\n\s*\n/)[0]}</p>
              ) : (
                <p className="mt-3 text-sm leading-6 text-neutral-500">Product information is not available yet.</p>
              )}
            </div>
            <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 border-t border-neutral-200 pt-5 text-xs">
              <div className="min-w-0"><p className="font-semibold text-neutral-500">Vehicle</p><p className="mt-1 break-words font-bold text-neutral-900">{part.year} {part.make}</p></div>
              <div className="min-w-0"><p className="font-semibold text-neutral-500">Model</p><p className="mt-1 break-words font-bold text-neutral-900">{part.model}</p></div>
            </div>
          </div>

          <aside className="min-w-0 h-fit overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm lg:col-span-2 xl:col-span-1">
            <div className="p-4 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
                <p className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-950">${part.price.toFixed(2)}</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Available</span>
              </div>
              <dl className="mt-5 divide-y divide-neutral-100 border-y border-neutral-100 text-xs">
                <div className="flex justify-between gap-3 py-3"><dt className="shrink-0 font-semibold text-neutral-600">Part type</dt><dd className="text-right text-neutral-800">{category}</dd></div>
                <div className="flex justify-between gap-3 py-3"><dt className="shrink-0 font-semibold text-neutral-600">Condition</dt><dd className="capitalize text-neutral-800">{part.condition}</dd></div>
                <div className="flex justify-between gap-3 py-3"><dt className="shrink-0 font-semibold text-neutral-600">Vehicle</dt><dd className="break-words text-right text-neutral-800">{fitment}</dd></div>
              </dl>
              <div className="mt-5">
                <AddToCartButton
                  item={{
                    partId: part.id,
                    part: part.part,
                    partType: part.partType,
                    make: part.make,
                    model: part.model,
                    year: part.year,
                    condition: part.condition,
                    category,
                    description: part.description,
                    image: images[0] ?? '',
                    price: part.price,
                    quantity: 1,
                  }}
                />
              </div>
            </div>
            <div className="border-t border-neutral-200 bg-neutral-50 p-5 sm:px-6">
              <h2 className="text-sm font-extrabold text-neutral-900">Questions before you order?</h2>
              <p className="mt-1.5 text-xs leading-5 text-neutral-600">Our parts team can help you confirm vehicle fitment.</p>
              <a href="tel:+18001234567890" className="mt-3 inline-flex text-xs font-bold text-[#806000] hover:text-neutral-950">Call parts support <span className="ml-1" aria-hidden="true">&rarr;</span></a>
            </div>
          </aside>
        </section>

        <PartInformationTabs part={part} category={category} />
      </div>
    </main>
  );
}
