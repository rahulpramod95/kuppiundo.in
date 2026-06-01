import type { Bottle, FilterState } from "./types";
import { DEFAULT_FILTERS } from "./types";

export type MatchReasonKey = "budget" | "taste" | "notes" | "occasion" | "type";

export function getMatchReasonKeys(
  bottle: Bottle,
  filters: FilterState,
): MatchReasonKey[] {
  const reasons: MatchReasonKey[] = [];

  if (filters.type.includes(bottle.type)) {
    reasons.push("type");
  }
  if (filters.taste.some((item) => bottle.taste.includes(item))) {
    reasons.push("taste");
  }
  if (filters.notes.some((item) => bottle.notes.includes(item))) {
    reasons.push("notes");
  }
  if (filters.occasions.some((item) => bottle.occasions.includes(item))) {
    reasons.push("occasion");
  }
  if (
    filters.budget < DEFAULT_FILTERS.budget &&
    bottle.price_750ml <= filters.budget
  ) {
    reasons.push("budget");
  }

  return reasons.slice(0, 3);
}

export function estimateMatchPercent(
  reasons: MatchReasonKey[],
  engagedSteps: number,
): number {
  const base = 68 + engagedSteps * 3 + reasons.length * 7;
  return Math.min(98, Math.max(72, base));
}
