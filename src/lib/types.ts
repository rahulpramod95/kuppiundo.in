export type Locale = "en" | "ml";
export type SpiritType =
  | "whisky"
  | "rum"
  | "brandy"
  | "gin"
  | "vodka"
  | "beer"
  | "wine";
export type AbvRange = "low" | "medium" | "high";
export type Origin = "imfl" | "fmfl";

export type Volume = {
  ml: number;
  price: number;
};

export type Bottle = {
  id: string;
  name: string;
  brand: string;
  type: SpiritType;
  origin: Origin;
  abv_value: number;
  abv_range: AbvRange;
  taste: string[];
  notes: string[];
  occasions: string[];
  tags: string[];
  score: number;
  emoji: string;
  price_750ml: number;
  volumes: Volume[];
  available: boolean;
  updated_at: string;
  bevco_codes?: string[];
};

export type FilterState = {
  type: SpiritType[];
  taste: string[];
  notes: string[];
  occasions: string[];
  abv: AbvRange[];
  origin: Origin[];
  budget: number;
};

export type SortOption = "match" | "price_asc" | "price_desc" | "score";

export type CocktailIngredientRole = "spirit" | "mixer" | "garnish";

export type CocktailIngredient = {
  name: string;
  amount: string;
  bottleId?: string;
  emoji: string;
  role: CocktailIngredientRole;
};

export type Cocktail = {
  id: string;
  name: string;
  spiritType: SpiritType;
  emoji: string;
  description: string;
  ingredients: CocktailIngredient[];
};

export const SPIRIT_TYPES: SpiritType[] = [
  "whisky",
  "rum",
  "brandy",
  "gin",
  "vodka",
  "beer",
  "wine",
];

export const TASTE_OPTIONS = [
  "smooth",
  "peaty",
  "fruity",
  "spicy",
  "sweet",
  "dry",
] as const;

export const NOTE_OPTIONS = [
  "vanilla",
  "oak",
  "caramel",
  "citrus",
  "floral",
  "chocolate",
  "honey",
  "spice",
] as const;

export const OCCASION_OPTIONS = [
  "casual",
  "gifting",
  "party",
  "cocktails",
  "daily",
] as const;

export const ABV_OPTIONS: AbvRange[] = ["low", "medium", "high"];
export const ORIGIN_OPTIONS: Origin[] = ["imfl", "fmfl"];

export const DEFAULT_FILTERS: FilterState = {
  type: [...SPIRIT_TYPES],
  taste: [],
  notes: [],
  occasions: [],
  abv: [...ABV_OPTIONS],
  origin: [...ORIGIN_OPTIONS],
  budget: 10000,
};

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}
