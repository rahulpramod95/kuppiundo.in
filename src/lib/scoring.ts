import type { Bottle, FilterState } from "./types";

export function scoreBottle(bottle: Bottle, filters: FilterState): number {
  if (!filters.type.includes(bottle.type)) return -1;
  if (!filters.abv.includes(bottle.abv_range)) return -1;
  if (!filters.origin.includes(bottle.origin)) return -1;
  if (bottle.price_750ml > filters.budget * 1.1) return -1;

  let score = 0;
  bottle.taste.forEach((t) => {
    if (filters.taste.includes(t)) score += 12;
  });
  bottle.notes.forEach((n) => {
    if (filters.notes.includes(n)) score += 8;
  });
  bottle.occasions.forEach((o) => {
    if (filters.occasions.includes(o)) score += 10;
  });
  if (bottle.price_750ml <= filters.budget) score += 15;
  score += bottle.score / 10;

  return score;
}

export function rankBottles(
  bottles: Bottle[],
  filters: FilterState,
): Array<Bottle & { matchScore: number }> {
  return bottles
    .map((bottle) => ({ ...bottle, matchScore: scoreBottle(bottle, filters) }))
    .filter((bottle) => bottle.matchScore >= 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
