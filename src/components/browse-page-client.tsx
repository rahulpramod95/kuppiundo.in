"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { SearchBar } from "@/components/search-bar";
import { BottleTile } from "@/components/bottle-tile";
import { FilterSheet } from "@/components/filter-sheet";
import { Button } from "@/components/ui/button";
import { DEFAULT_FILTERS, type Bottle, type FilterState, type SortOption } from "@/lib/types";
import { sortBottles } from "@/lib/filters";
import { rankBottles } from "@/lib/scoring";

type BrowsePageClientProps = {
  bottles: Bottle[];
};

export function BrowsePageClient({ bottles }: BrowsePageClientProps) {
  const t = useTranslations("browse");
  const tResults = useTranslations("results");
  const tFilters = useTranslations("filters");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<FilterState>({ ...DEFAULT_FILTERS });
  const [sort, setSort] = useState<SortOption>("score");
  const [sheetOpen, setSheetOpen] = useState(false);

  const results = useMemo(() => {
    const ranked = rankBottles(bottles, filters);
    const sorted = sortBottles(ranked, sort);
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (bottle) =>
        bottle.name.toLowerCase().includes(q) || bottle.brand.toLowerCase().includes(q),
    );
  }, [bottles, filters, sort, search]);

  const countLabel =
    results.length === 1
      ? tResults("found_one", { count: results.length })
      : tResults("found", { count: results.length });

  return (
    <div className="pb-8">
      <div className="space-y-5 px-5 pt-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">{t("title")}</h1>
          <p className="mt-1 text-sm text-text-muted">{countLabel}</p>
        </div>

        <SearchBar
          value={search}
          onChange={setSearch}
          onFilterClick={() => setSheetOpen(true)}
        />

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {(["score", "price_asc", "price_desc", "match"] as SortOption[]).map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={sort === option ? "default" : "secondary"}
              className="shrink-0 rounded-full"
              onClick={() => setSort(option)}
            >
              {tResults(
                option === "match"
                  ? "sort_match"
                  : option === "price_asc"
                    ? "sort_price_asc"
                    : option === "price_desc"
                      ? "sort_price_desc"
                      : "sort_score",
              )}
            </Button>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="soft-card p-10 text-center">
            <p className="font-display text-lg font-bold">{tResults("no_results")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{tResults("no_results_hint")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 items-stretch gap-4">
            {results.map((bottle, index) => (
              <BottleTile key={bottle.id} bottle={bottle} index={index} />
            ))}
          </div>
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={filters}
        onChange={setFilters}
        submitLabel={tFilters("apply_btn")}
        onSubmit={() => setSheetOpen(false)}
      />
    </div>
  );
}
