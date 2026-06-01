import cocktailsData from "@/data/cocktails.json";
import type { Cocktail, SpiritType } from "./types";
import { SPIRIT_TYPES } from "./types";

const cocktails = cocktailsData as Cocktail[];

export async function getAllCocktails(): Promise<Cocktail[]> {
  return cocktails;
}

export async function getCocktailsBySpirit(spiritType: SpiritType): Promise<Cocktail[]> {
  return cocktails.filter((c) => c.spiritType === spiritType);
}

export function countCocktailsBySpirit(spiritType: SpiritType): number {
  return cocktails.filter((c) => c.spiritType === spiritType).length;
}

export function getCocktailCounts(): Record<SpiritType, number> {
  return SPIRIT_TYPES.reduce(
    (acc, type) => {
      acc[type] = countCocktailsBySpirit(type);
      return acc;
    },
    {} as Record<SpiritType, number>,
  );
}

export async function getCocktailById(id: string): Promise<Cocktail | undefined> {
  return cocktails.find((c) => c.id === id);
}
