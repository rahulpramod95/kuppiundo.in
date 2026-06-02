"use client";

import { useTranslations } from "next-intl";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { FilterState, SpiritType } from "@/lib/types";
import {
  ABV_OPTIONS,
  DEFAULT_FILTERS,
  NOTE_OPTIONS,
  OCCASION_OPTIONS,
  ORIGIN_OPTIONS,
  SPIRIT_TYPES,
  TASTE_OPTIONS,
  formatPrice,
} from "@/lib/types";

import { FilterChipGroup } from "@/components/filter-chip-group";

type FilterPanelProps = {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onSubmit: () => void;
  className?: string;
  showFooter?: boolean;
  embedded?: boolean;
};

export function FilterPanel({
  filters,
  onChange,
  onSubmit,
  className,
  showFooter = true,
  embedded = false,
}: FilterPanelProps) {
  const t = useTranslations("filters");
  const tc = useTranslations("categories");

  function toggleType(type: SpiritType) {
    const next = filters.type.includes(type)
      ? filters.type.filter((item) => item !== type)
      : [...filters.type, type];
    onChange({ ...filters, type: next });
  }

  function toggleList<T extends string>(key: keyof FilterState, value: T) {
    const current = filters[key] as T[];
    const next = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: next });
  }

  function toggleAbv(value: (typeof ABV_OPTIONS)[number]) {
    const next = filters.abv.includes(value)
      ? filters.abv.filter((item) => item !== value)
      : [...filters.abv, value];
    onChange({ ...filters, abv: next });
  }

  function toggleOrigin(value: (typeof ORIGIN_OPTIONS)[number]) {
    const next = filters.origin.includes(value)
      ? filters.origin.filter((item) => item !== value)
      : [...filters.origin, value];
    onChange({ ...filters, origin: next });
  }

  const activeCount =
    filters.taste.length +
    filters.notes.length +
    filters.occasions.length +
    (filters.type.length > 0 && filters.type.length < SPIRIT_TYPES.length ? 1 : 0) +
    (filters.abv.length > 0 && filters.abv.length < ABV_OPTIONS.length ? 1 : 0) +
    (filters.origin.length > 0 && filters.origin.length < ORIGIN_OPTIONS.length ? 1 : 0) +
    (filters.budget !== DEFAULT_FILTERS.budget ? 1 : 0);

  const body = (
    <>
      <CardContent className={cn("space-y-5", embedded ? "px-0 pt-0" : "pt-5")}>
        <FilterChipGroup
          label={t("category")}
          options={SPIRIT_TYPES}
          selected={filters.type}
          onToggle={toggleType}
          getLabel={(value) => tc(value)}
        />

        <Separator />

        <FilterChipGroup
          label={t("taste")}
          options={TASTE_OPTIONS}
          selected={filters.taste}
          onToggle={(value) => toggleList("taste", value)}
          getLabel={(value) => t(`taste_${value}`)}
        />

        <FilterChipGroup
          label={t("notes")}
          options={NOTE_OPTIONS}
          selected={filters.notes}
          onToggle={(value) => toggleList("notes", value)}
          getLabel={(value) => t(`notes_${value}`)}
        />

        <FilterChipGroup
          label={t("occasion")}
          options={OCCASION_OPTIONS}
          selected={filters.occasions}
          onToggle={(value) => toggleList("occasions", value)}
          getLabel={(value) => t(`occ_${value}`)}
        />

        <Separator />

        <FilterChipGroup
          label={t("abv")}
          options={ABV_OPTIONS}
          selected={filters.abv}
          onToggle={toggleAbv}
          getLabel={(value) => t(`abv_${value}`)}
        />

        <FilterChipGroup
          label={t("origin")}
          options={ORIGIN_OPTIONS}
          selected={filters.origin}
          onToggle={toggleOrigin}
          getLabel={(value) => t(`origin_${value}`)}
        />

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {t("budget")}
            </p>
            <span className="text-sm font-semibold text-primary">
              {t("budget_label", { amount: formatPrice(filters.budget).replace("₹", "") })}
            </span>
          </div>
          <Slider
            min={500}
            max={10000}
            step={100}
            value={[filters.budget]}
            onValueChange={(value) => {
              const next = Array.isArray(value) ? value[0] : value;
              onChange({ ...filters, budget: next ?? filters.budget });
            }}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatPrice(500)}</span>
            <span>{formatPrice(10000)}</span>
          </div>
        </div>
      </CardContent>

      {showFooter && (
        <CardFooter className={cn("border-t bg-muted/30", embedded && "px-0")}>
          <Button type="button" size="lg" className="h-11 w-full" onClick={onSubmit}>
            {t("find_btn")}
          </Button>
        </CardFooter>
      )}
    </>
  );

  if (embedded) {
    return <div className={className}>{body}</div>;
  }

  return (
    <Card className={cn("shadow-sm ring-border/60", className)}>
      <CardHeader className="border-b pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="font-display text-xl">{t("title")}</CardTitle>
            <CardDescription>
              {activeCount > 0
                ? `${activeCount} active · ${t("budget_label", { amount: formatPrice(filters.budget).replace("₹", "") })}`
                : t("budget_label", { amount: formatPrice(filters.budget).replace("₹", "") })}
            </CardDescription>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
            onClick={() => onChange({ ...DEFAULT_FILTERS })}
          >
            <RotateCcw className="size-3.5" />
            {t("reset")}
          </Button>
        </div>
      </CardHeader>
      {body}
    </Card>
  );
}
