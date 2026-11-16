import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { AddToCartButton } from '@/components/home/AddToCartButton';
import { PartImageGallery } from '@/components/home/PartImageGallery';
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
    <main className="mx-auto min-h-[70vh] max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
        <Link href="/" className="transition-colors hover:text-[#e51515]">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/parts" className="transition-colors hover:text-[#e51515]">Auto parts</Link>
        <span className="mx-2">/</span>
        <span className="text-neutral-900">{part.part}</span>
      </nav>

      <section className="grid gap-8 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:grid-cols-2 md:gap-10 md:p-8">
        <PartImageGallery
          images={images}
          title={part.part}
          subtitle={`${fitment} - ${category}`}
          fallbackMark={category}
          priority
          size="detail"
        />

        <div className="flex flex-col">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-neutral-900 px-3 py-1 text-xs font-bold uppercase text-white">{part.condition}</span>
            <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-[#d92727]">{category}</span>
          </div>
          <h1 className="text-2xl font-black leading-tight text-neutral-950 sm:text-3xl">{part.part}</h1>
          <p className="mt-3 text-base font-semibold text-neutral-600">Fits {fitment}</p>

          <div className="mt-6 border-y border-neutral-100 py-5">
            <p className="text-3xl font-black text-[#e51515]">${part.price.toFixed(2)}</p>
            <p className="mt-1 text-sm text-emerald-700">Available to order</p>
          </div>

          {part.description && (
            <div className="py-5">
              <h2 className="text-sm font-bold uppercase tracking-wide text-neutral-900">Product details</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-neutral-600">{part.description}</p>
            </div>
          )}

          <div className="mt-auto pt-4">
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
      </section>
    </main>
  );
}
