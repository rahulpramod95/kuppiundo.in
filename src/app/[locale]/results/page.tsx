import { getBottles } from "@/lib/bottles";
import { filtersFromSearchParams } from "@/lib/filters";
import { ResultsPageClient } from "@/components/results-page-client";
import type { SortOption } from "@/lib/types";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ResultsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const bottles = await getBottles();
  const filters = filtersFromSearchParams(params);
  const sort = (typeof params.sort === "string" ? params.sort : "match") as SortOption;
  const initialQuery = typeof params.q === "string" ? params.q : "";

  return (
    <ResultsPageClient
      bottles={bottles}
      filters={filters}
      initialSort={sort}
      initialQuery={initialQuery}
    />
  );
}
