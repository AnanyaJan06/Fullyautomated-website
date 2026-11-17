import type { DatabasePart, PartType } from '@/types';
import Link from 'next/link';
import { AddToCartButton } from './AddToCartButton';
import { PartImageGallery } from './PartImageGallery';

const GALLERY_BY_TYPE: Record<PartType, string[]> = {
  engine: [
    '/images/parts/engine-template1.webp',
    '/images/parts/engine-template2.webp',
    '/images/parts/engine-template3.webp',
    '/images/parts/engine-assembly-1.svg',
  ],
  transmission: [
    '/images/parts/transmission-template1.webp',
    '/images/parts/transmission-template2.webp',
    '/images/parts/transmission-template3.webp',
    '/images/parts/transmission-assembly-1.svg',
  ],
};

function getStableGalleryStart(productId: string, imageCount: number) {
  let hash = 0;
  for (let index = 0; index < productId.length; index += 1) {
    hash = (hash * 31 + productId.charCodeAt(index)) >>> 0;
  }
  return hash % imageCount;
}

export function DatabaseProductCard({
  product,
  listingImage = false,
}: {
  product: DatabasePart;
  listingImage?: boolean;
}) {
  const fitment = [product.year, product.make, product.model].filter(Boolean).join(' ');
  const category = product.partType === 'transmission' ? 'Transmission' : 'Engine';
  const categoryImages = GALLERY_BY_TYPE[product.partType ?? 'engine'];
  const templateImages = categoryImages.slice(0, 3);
  const startIndex = getStableGalleryStart(product.id, templateImages.length);
  const galleryImages = [
    ...templateImages.slice(startIndex),
    ...templateImages.slice(0, startIndex),
    categoryImages[3],
  ];
  const detailsHref = `/parts/${encodeURIComponent(product.id)}`;

  return (
    <article
      data-product-tabs={product.partType ?? 'engine'}
      className={`group/card flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm ${
        listingImage
          ? ''
          : 'transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md'
      }`}
    >
      <div>
        {/* 1. New / Refurbished badge at top */}
        <div className="mb-2.5 flex items-center justify-start">
          <span className="rounded bg-[#facc15] px-2 py-0.5 text-[10px] font-normal capitalize tracking-normal text-neutral-950">
            {product.condition}
          </span>
        </div>

        {/* Templates lead each card's gallery; the category assembly art is fourth. */}
        {listingImage ? (
          <Link
            href={detailsHref}
            prefetch={false}
            aria-label={`View ${fitment || category} details`}
            className="mb-3 block overflow-hidden rounded-lg border border-neutral-200/80 bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eab308]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={galleryImages[0]}
              alt={fitment ? `${category} - ${fitment}` : category}
              loading="lazy"
              decoding="async"
              className="h-44 w-full object-cover"
            />
          </Link>
        ) : (
          <PartImageGallery
            images={galleryImages.slice(0, 4)}
            title={fitment ? `${category} - ${fitment}` : category}
            subtitle={`${fitment} - ${category}`}
            fallbackMark={category}
          />
        )}

        {/* Part type is secondary; fitment stays prominent. */}
        <p className="text-xs font-normal uppercase tracking-wider text-neutral-500">
          {category}
        </p>
        <h3 className="mt-1 line-clamp-1 text-sm font-bold text-neutral-950 transition-colors hover:text-neutral-700">
          <Link
            href={detailsHref}
            prefetch={false}
            className="focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#eab308]"
          >
            {fitment || category}
          </Link>
        </h3>
      </div>

      {/* 4. Price + Add to Cart */}
      <div className="mt-3 border-t border-neutral-100 pt-2.5">
        <AddToCartButton
          priceOnIdle={product.price}
          item={{
            partId: product.id,
            part: product.part,
            partType: product.partType,
            make: product.make,
            model: product.model,
            year: product.year,
            condition: product.condition,
            category,
            description: product.description,
            image: galleryImages[0] ?? '',
            price: product.price,
            quantity: 1,
          }}
        />
      </div>
    </article>
  );
}
