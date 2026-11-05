import type { DatabasePart } from '@/types';
import { AddToCartButton } from './AddToCartButton';

export function DatabaseProductCard({ product }: { product: DatabasePart }) {
  const fitment = [product.year, product.make, product.model].filter(Boolean).join(' ');
  const category = product.partType === 'transmission' ? 'Transmission' : 'Engine';

  return (
    <article
      data-product-tabs={product.partType ?? 'engine'}
      className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:shadow-md"
    >
      <div>
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
            {product.condition}
          </span>
          <span className="text-[11px] text-neutral-400">{category}</span>
        </div>

        <div className="relative mb-3 flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-neutral-100">
          {product.images[0] ? (
            // Catalog images may be stored on a remote media host that is not configured in next/image.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.images[0]} alt={product.part} className="h-full w-full object-contain" />
          ) : (
            <span className="px-5 text-center text-2xl font-black uppercase tracking-wide text-neutral-400">
              {category}
            </span>
          )}
        </div>

        <p className="mb-1 text-xs font-semibold text-neutral-500">{fitment}</p>
        <h3 className="min-h-[40px] line-clamp-2 text-sm font-bold text-neutral-900">
          {product.part}
        </h3>
        {product.description && (
          <p className="mt-2 line-clamp-2 text-[11px] text-neutral-500">{product.description}</p>
        )}
      </div>

      <div className="mt-4 border-t border-neutral-100 pt-3">
        <p className="mb-2 text-lg font-black text-[#e51515]">${product.price.toFixed(2)}</p>
        <AddToCartButton
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
            image: product.images[0],
            price: product.price,
            quantity: 1,
          }}
        />
      </div>
    </article>
  );
}
