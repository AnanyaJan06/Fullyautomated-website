import type { ProductItem } from '@/data/gearup-data';
import { AddToCartButton } from './AddToCartButton';

const PRODUCT_MARK: Record<ProductItem['iconType'], string> = {
  brake: 'BR',
  headlight: 'LED',
  tire: 'T',
  battery: '12V',
  oil: 'OIL',
  suspension: 'SUS',
  spark: 'SPK',
  exhaust: 'EX',
};

export function ProductCard({ product }: { product: ProductItem }) {
  return (
    <article
      data-product-tabs={product.tabCategory.join(' ')}
      className="group flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-neutral-300"
    >
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.discountPercent && (
              <span className="rounded bg-[#e51515] px-2 py-0.5 text-[11px] font-extrabold text-white">
                -{product.discountPercent}%
              </span>
            )}
            {product.badge && (
              <span className="rounded bg-neutral-900 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                {product.badge}
              </span>
            )}
          </div>
          <span className="font-mono text-[11px] text-neutral-400">SKU: {product.sku}</span>
        </div>

        <div className={`relative mb-3 flex h-44 w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${product.imageColor}`}>
          <span aria-hidden="true" className="text-4xl font-black tracking-tight text-neutral-700/80">
            {PRODUCT_MARK[product.iconType]}
          </span>
          <span className="mt-2 rounded-full bg-white/80 px-2.5 py-0.5 text-[11px] font-semibold text-neutral-500">
            {product.category}
          </span>
        </div>

        <div className="mb-1.5 flex items-center gap-1.5 text-xs">
          <span aria-hidden="true" className="font-bold text-amber-400">&#9733;&#9733;&#9733;&#9733;&#9733;</span>
          <span className="sr-only">{product.rating} out of 5 stars</span>
          <span className="font-bold text-neutral-800">{product.rating.toFixed(1)}</span>
          <span className="text-neutral-400">({product.reviewsCount} reviews)</span>
        </div>

        <h3 className="min-h-[40px] line-clamp-2 text-sm font-bold text-neutral-900 transition-colors group-hover:text-[#e51515]">
          {product.title}
        </h3>

        <ul className="mt-2 space-y-1 text-[11px] text-neutral-500">
          {product.specs.map((spec) => <li key={spec} className="truncate">{spec}</li>)}
        </ul>
      </div>

      <div className="mt-4 border-t border-neutral-100 pt-3">
        <div className="mb-2 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-[#e51515]">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-xs text-neutral-400 line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            In Stock ({product.stockCount})
          </span>
        </div>
        <AddToCartButton />
      </div>
    </article>
  );
}
