import type { Metadata } from 'next';
import { PartsListingClient } from '@/components/parts/PartsListingClient';
import { partService } from '@/services/part.service';
import type {
  PartCondition,
  PartSearchResponse,
  PartSortOption,
  PartType,
} from '@/types';

export const metadata: Metadata = {
  title: 'Auto Parts Listing | Automobilic',
  description:
    'Browse all available auto parts, engines, and transmissions with vehicle fitment filtering and sorting.',
};

type SearchParamsPromise = Promise<Record<string, string | string[] | undefined>>;

function pickFirst(value: string | string[] | undefined): string {
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0].trim();
  return '';
}

export default async function PartsListingPage({
  searchParams,
}: {
  searchParams?: SearchParamsPromise;
}) {
  const resolvedParams = searchParams ? await searchParams : {};

  const rawPartType = pickFirst(resolvedParams.partType);
  const partType: PartType | '' =
    rawPartType === 'engine' || rawPartType === 'transmission' ? rawPartType : '';
  const make = pickFirst(resolvedParams.make);
  const model = pickFirst(resolvedParams.model);
  const year = pickFirst(resolvedParams.year);
  const rawCondition = pickFirst(resolvedParams.condition).toLowerCase();
  const condition: PartCondition | '' =
    rawCondition === 'new' || rawCondition === 'refurbished' || rawCondition === 'used'
      ? rawCondition
      : '';
  const q = pickFirst(resolvedParams.q);
  const minPrice = pickFirst(resolvedParams.minPrice);
  const maxPrice = pickFirst(resolvedParams.maxPrice);
  const rawSort = pickFirst(resolvedParams.sort) as PartSortOption;
  const validSorts: PartSortOption[] = [
    'newest',
    'price-asc',
    'price-desc',
    'year-desc',
    'year-asc',
    'name-asc',
  ];
  const sort: PartSortOption = validSorts.includes(rawSort) ? rawSort : 'newest';
  const rawPage = Number(pickFirst(resolvedParams.page));
  const page = Number.isSafeInteger(rawPage) && rawPage >= 1 ? rawPage : 1;

  let initialData: PartSearchResponse | null = null;
  let initialError = false;

  try {
    const response = await partService.searchParts(
      {
        partType: partType || undefined,
        make: make || undefined,
        model: model || undefined,
        year: year || undefined,
        condition: condition || undefined,
        q: q || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        sort,
        page,
        limit: 12,
      },
      undefined,
      { next: { revalidate: 30, tags: ['parts-catalog'] } }
    );
    initialData = response.data;
  } catch (error) {
    console.error('Failed to pre-load parts listing page:', error);
    initialError = true;
  }

  return (
    <main className="min-h-[75vh] bg-neutral-50/50 pb-16">
      <PartsListingClient
        initialData={initialData}
        initialError={initialError}
        initialFilters={{
          partType,
          make,
          model,
          year,
          condition,
          q,
          minPrice,
          maxPrice,
          sort,
          page,
        }}
      />
    </main>
  );
}
