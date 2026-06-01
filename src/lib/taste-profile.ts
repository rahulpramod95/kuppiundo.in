import type { FilterState } from "./types";
import {
  ABV_OPTIONS,
  DEFAULT_FILTERS,
  ORIGIN_OPTIONS,
  SPIRIT_TYPES,
} from "./types";

const STORAGE_KEY = "kuppiundo_taste_profile";
const SESSION_META_KEY = "kuppiundo_results_meta";

export type SavedTasteProfile = {
  filters: FilterState;
  engagedSteps: number;
  savedAt: number;
};

export type ResultsSessionMeta = {
  engagedSteps: number;
  fromJourney: boolean;
};

export function countEngagedSteps(filters: FilterState): number {
  let count = 0;
  if (filters.type.length > 0) count++;
  if (filters.taste.length > 0) count++;
  if (filters.notes.length > 0) count++;
  if (filters.occasions.length > 0) count++;
  if (filters.abv.length > 0) count++;
  if (filters.origin.length > 0) count++;
  if (filters.budget < DEFAULT_FILTERS.budget) count++;
  return count;
}

export function saveTasteProfile(filters: FilterState): SavedTasteProfile {
  const profile: SavedTasteProfile = {
    filters,
    engagedSteps: countEngagedSteps(filters),
    savedAt: Date.now(),
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }
  return profile;
}

export function loadTasteProfile(): SavedTasteProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavedTasteProfile;
  } catch {
    return null;
  }
}

export function setResultsSessionMeta(meta: ResultsSessionMeta) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(SESSION_META_KEY, JSON.stringify(meta));
  }
}

export function consumeResultsSessionMeta(): ResultsSessionMeta | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(SESSION_META_KEY);
    if (!raw) return null;
    sessionStorage.removeItem(SESSION_META_KEY);
    return JSON.parse(raw) as ResultsSessionMeta;
  } catch {
    return null;
  }
}

export type ProfileHighlight = {
  label: string;
  value: string;
};

export function buildProfileHighlights(
  filters: FilterState,
  labels: {
    any: string;
    budget: (amount: string) => string;
    type: (value: string) => string;
    taste: (value: string) => string;
    notes: (value: string) => string;
    occasion: (value: string) => string;
    abv: (value: string) => string;
    origin: (value: string) => string;
    spirits: string;
    tasteLabel: string;
    notesLabel: string;
    occasionLabel: string;
    strengthLabel: string;
    originLabel: string;
    budgetLabel: string;
  },
): ProfileHighlight[] {
  const formatList = (values: string[]) =>
    values.length ? values.join(", ") : labels.any;

  return [
    {
      label: labels.spirits,
      value: formatList(
        filters.type.length ? filters.type.map((v) => labels.type(v)) : [],
      ),
    },
    {
      label: labels.tasteLabel,
      value: formatList(
        filters.taste.length ? filters.taste.map((v) => labels.taste(v)) : [],
      ),
    },
    {
      label: labels.notesLabel,
      value: formatList(
        filters.notes.length ? filters.notes.map((v) => labels.notes(v)) : [],
      ),
    },
    {
      label: labels.occasionLabel,
      value: formatList(
        filters.occasions.length
          ? filters.occasions.map((v) => labels.occasion(v))
          : [],
      ),
    },
    {
      label: labels.strengthLabel,
      value: formatList(
        filters.abv.length ? filters.abv.map((v) => labels.abv(v)) : [],
      ),
    },
    {
      label: labels.originLabel,
      value: formatList(
        filters.origin.length ? filters.origin.map((v) => labels.origin(v)) : [],
      ),
    },
    {
      label: labels.budgetLabel,
      value:
        filters.budget >= DEFAULT_FILTERS.budget
          ? labels.any
          : labels.budget(String(filters.budget)),
    },
  ];
}

export function isFullyOpenProfile(filters: FilterState): boolean {
  return countEngagedSteps(filters) <= 1;
}

export { SPIRIT_TYPES, ABV_OPTIONS, ORIGIN_OPTIONS };
