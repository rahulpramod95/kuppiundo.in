import type { FilterState } from "./types";
import {
  ABV_OPTIONS,
  DEFAULT_FILTERS,
  ORIGIN_OPTIONS,
  SPIRIT_TYPES,
} from "./types";

export const FIND_STEPS = [
  "type",
  "taste",
  "notes",
  "abv",
  "budget",
] as const;

export type FindStepId = (typeof FIND_STEPS)[number];

export const FIND_STEP_COUNT = FIND_STEPS.length;

export const BUDGET_PRESETS = [
  { value: 1000, key: "budget_upto_1k" },
  { value: 2000, key: "budget_upto_2k" },
  { value: 4000, key: "budget_upto_4k" },
  { value: 6000, key: "budget_upto_6k" },
  { value: 10000, key: "budget_any" },
] as const;

export function getStepIndex(step: FindStepId): number {
  return FIND_STEPS.indexOf(step);
}

export function getStepByIndex(index: number): FindStepId {
  return FIND_STEPS[index] ?? FIND_STEPS[0];
}

/** Reset a single step to its skip/default value. */
export function applySkip(step: FindStepId, filters: FilterState): FilterState {
  switch (step) {
    case "type":
      return { ...filters, type: [...SPIRIT_TYPES] };
    case "taste":
      return { ...filters, taste: [] };
    case "notes":
      return { ...filters, notes: [] };
    case "abv":
      return { ...filters, abv: [...ABV_OPTIONS] };
    case "budget":
      return { ...filters, budget: DEFAULT_FILTERS.budget };
  }
}

export function isLastStep(index: number): boolean {
  return index >= FIND_STEP_COUNT - 1;
}

/** Empty selections for the find wizard — nothing pre-selected. */
export const JOURNEY_INITIAL_FILTERS: FilterState = {
  type: [],
  taste: [],
  notes: [],
  occasions: [],
  abv: [],
  origin: [],
  budget: DEFAULT_FILTERS.budget,
};

/** Treat empty chip selections as "any" when submitting to results. */
export function normalizeJourneyFilters(filters: FilterState): FilterState {
  return {
    ...filters,
    type: filters.type.length ? filters.type : [...SPIRIT_TYPES],
    abv: filters.abv.length ? filters.abv : [...ABV_OPTIONS],
    origin: filters.origin.length ? filters.origin : [...ORIGIN_OPTIONS],
  };
}
