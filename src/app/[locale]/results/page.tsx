import { getBottles } from "@/lib/bottles";
import { getBottleImageSrcMap } from "@/lib/bottle-images";
import { filtersFromSearchParams } from "@/lib/filters";
import { ResultsPageClient } from "@/components/results-page-client";
import type { SortOption } from "@/lib/types";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResultsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const bottles = await getBottles();
  const imageMap = getBottleImageSrcMap(bottles.map((bottle) => bottle.id));
  const filters = filtersFromSearchParams(params);
  const sort = (typeof params.sort === "string" ? params.sort : "match") as SortOption;
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return (
    <ResultsPageClient
      bottles={bottles}
      imageMap={imageMap}
      filters={filters}
      initialSort={sort}
      initialQuery={initialQuery}
    />
  );
}
