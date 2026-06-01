import type { FilterState, SortOption, SpiritType, AbvRange, Origin } from "./types";
import { DEFAULT_FILTERS } from "./types";

function parseList<T extends string>(value: string | null, fallback: T[]): T[] {
  if (!value) return fallback;
  const items = value.split(",").filter(Boolean) as T[];
  return items.length ? items : fallback;
}

export function filtersFromSearchParams(
  params: Record<string, string | string[] | undefined>,
): FilterState {
  const get = (key: string) => {
    const value = params[key];
    return typeof value === "string" ? value : undefined;
  };

  const budget = Number(get("budget") ?? DEFAULT_FILTERS.budget);

  return {
    type: parseList<SpiritType>(get("type") ?? null, DEFAULT_FILTERS.type),
    taste: parseList(get("taste") ?? null, DEFAULT_FILTERS.taste),
    notes: parseList(get("notes") ?? null, DEFAULT_FILTERS.notes),
    occasions: parseList(get("occasions") ?? null, DEFAULT_FILTERS.occasions),
    abv: parseList<AbvRange>(get("abv") ?? null, DEFAULT_FILTERS.abv),
    origin: parseList<Origin>(get("origin") ?? null, DEFAULT_FILTERS.origin),
    budget: Number.isFinite(budget) ? budget : DEFAULT_FILTERS.budget,
  };
}

export function filtersToSearchParams(filters: FilterState, sort?: SortOption): string {
  const params = new URLSearchParams();

  if (filters.type.length && filters.type.length < DEFAULT_FILTERS.type.length) {
    params.set("type", filters.type.join(","));
  }
  if (filters.taste.length) params.set("taste", filters.taste.join(","));
  if (filters.notes.length) params.set("notes", filters.notes.join(","));
  if (filters.occasions.length) params.set("occasions", filters.occasions.join(","));
  if (filters.abv.length && filters.abv.length < DEFAULT_FILTERS.abv.length) {
    params.set("abv", filters.abv.join(","));
  }
  if (filters.origin.length && filters.origin.length < DEFAULT_FILTERS.origin.length) {
    params.set("origin", filters.origin.join(","));
  }
  if (filters.budget !== DEFAULT_FILTERS.budget) {
    params.set("budget", String(filters.budget));
  }
  if (sort && sort !== "match") params.set("sort", sort);

  return params.toString();
}

export function sortBottles<T extends { matchScore: number; price_750ml: number; score: number }>(
  bottles: T[],
  sort: SortOption,
): T[] {
  const copy = [...bottles];

  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => a.price_750ml - b.price_750ml);
    case "price_desc":
      return copy.sort((a, b) => b.price_750ml - a.price_750ml);
    case "score":
      return copy.sort((a, b) => b.score - a.score);
    default:
      return copy.sort((a, b) => b.matchScore - a.matchScore);
  }
}
