"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BestMatchCallout } from "@/components/best-match-callout";
import { BottleTile } from "@/components/bottle-tile";
import { SearchBar } from "@/components/search-bar";
import { FilterSheet } from "@/components/filter-sheet";
import { SecondaryPageHeader } from "@/components/secondary-page-header";
import type { Bottle, FilterState, SortOption } from "@/lib/types";
import { rankBottles } from "@/lib/scoring";
import { sortBottles } from "@/lib/filters";
import {
  consumeResultsSessionMeta,
  countEngagedSteps,
  isFullyOpenProfile,
} from "@/lib/taste-profile";
import { Button } from "@/components/ui/button";

type ResultsPageClientProps = {
  bottles: Bottle[];
  filters: FilterState;
  initialSort: SortOption;
  initialQuery?: string;
};

export function ResultsPageClient({
  bottles,
  filters,
  initialSort,
  initialQuery = "",
}: ResultsPageClientProps) {
  const t = useTranslations("results");
  const tFilters = useTranslations("filters");
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [search, setSearch] = useState(initialQuery);
  const [localFilters, setLocalFilters] = useState(filters);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sessionMeta, setSessionMeta] = useState<{
    engagedSteps: number;
    fromJourney: boolean;
  } | null>(null);

  useEffect(() => {
    setSessionMeta(consumeResultsSessionMeta());
  }, []);

  const engagedSteps = sessionMeta?.engagedSteps ?? countEngagedSteps(localFilters);
  const personalized =
    sessionMeta?.fromJourney === true && !isFullyOpenProfile(localFilters);

  const results = useMemo(() => {
    const ranked = rankBottles(bottles, localFilters);
    const sorted = sortBottles(ranked, sort);
    const q = search.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (bottle) =>
        bottle.name.toLowerCase().includes(q) || bottle.brand.toLowerCase().includes(q),
    );
  }, [bottles, localFilters, sort, search]);

  const countLabel =
    results.length === 1
      ? t("found_one", { count: results.length })
      : t("found", { count: results.length });

  const subtitle = personalized ? t("personalized_subtitle") : countLabel;
  const bestMatch = sort === "match" ? results[0] : undefined;

  return (
    <div className="pb-8">
      <SecondaryPageHeader
        backHref="/"
        backLabel={t("back_home")}
        title={personalized ? t("personalized_title") : t("title")}
        subtitle={subtitle}
      />

      <div className="space-y-5 px-5 pt-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onFilterClick={() => setSheetOpen(true)}
        />

        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {(["match", "price_asc", "price_desc", "score"] as SortOption[]).map((option) => (
            <Button
              key={option}
              type="button"
              size="sm"
              variant={sort === option ? "default" : "secondary"}
              className="shrink-0 rounded-full"
              onClick={() => setSort(option)}
            >
              {t(option === "match" ? "sort_match" : option === "price_asc" ? "sort_price_asc" : option === "price_desc" ? "sort_price_desc" : "sort_score")}
            </Button>
          ))}
        </div>

        {results.length === 0 ? (
          <div className="soft-card p-10 text-center">
            <p className="font-display text-lg font-bold">{t("no_results")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("no_results_hint")}</p>
            <Link href="/">
              <Button className="mt-6 rounded-lg">{t("back")}</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 items-stretch gap-4">
            {bestMatch ? (
              <BestMatchCallout
                bottle={bestMatch}
                filters={localFilters}
                engagedSteps={engagedSteps}
                personalized={personalized}
              />
            ) : null}
            {results.map((bottle, index) => {
              if (bestMatch && index === 0) return null;
              return (
                <BottleTile
                  key={bottle.id}
                  bottle={bottle}
                  matchScore={bottle.matchScore}
                  index={index}
                />
              );
            })}
          </div>
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        filters={localFilters}
        onChange={setLocalFilters}
        submitLabel={tFilters("apply_btn")}
        onSubmit={() => setSheetOpen(false)}
      />
    </div>
  );
}
