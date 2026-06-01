import bevcoData from "@/data/bevco-imfl.json";
import seedData from "@/data/seed.json";
import type { Bottle } from "./types";
import { fillAllStandardVolumes } from "./volumes";

function normalizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

const VARIANT_MARKERS = [
  "coffee",
  "lemon",
  "lime",
  "mango",
  "orange",
  "chilli",
  "cinnamon",
  "spiced",
  "fire",
  "amber",
  "white",
  "dark",
  "peaty",
  "silver",
  "gold",
  "platinum",
  "celebration",
  "chambers",
  "flandy",
  "signature",
  "elements",
  "four",
];

function scoreSeedMatch(bevco: Bottle, seed: Bottle): number {
  if (bevco.type !== seed.type) return 0;

  const bevcoNorm = normalizeName(bevco.name);
  const seedNorm = normalizeName(seed.name);
  if (!bevcoNorm.includes(seedNorm)) return 0;

  let score = 1000 - (bevcoNorm.length - seedNorm.length);

  for (const marker of VARIANT_MARKERS) {
    if (bevcoNorm.includes(marker) && !seedNorm.includes(marker)) {
      score -= 40;
    }
  }

  if (bevcoNorm.includes("deluxe")) score += 15;
  if (bevcoNorm.includes("matured") && seedNorm.includes("oldmonk")) score += 25;
  if (bevcoNorm.includes("prestige") && seedNorm.includes("officerschoice")) score += 25;
  if (bevcoNorm.includes("ultra") && seedNorm.includes("blenderspride")) score += 15;
  if (bevcoNorm.includes("lager") && seedNorm.includes("heineken")) score += 20;
  if (bevcoNorm.includes("rum") && seedNorm.includes("mcdowellsno1")) score += 20;
  if (bevcoNorm.includes("redefined") && seedNorm.includes("mansionhouse")) score += 15;

  return score;
}

function enrichBevcoWithSeed(bevco: Bottle, seed: Bottle): Bottle {
  return {
    ...bevco,
    id: seed.id,
    brand: seed.brand,
    taste: seed.taste,
    notes: seed.notes,
    occasions: seed.occasions,
    tags: [...new Set([...bevco.tags, ...seed.tags])],
    score: seed.score,
    emoji: seed.emoji,
  };
}

function mergeCatalog(bevcoBottles: Bottle[], seedBottles: Bottle[]): Bottle[] {
  const claimedBevcoIndices = new Set<number>();
  const seedToBevcoIndex = new Map<string, number>();

  for (const seed of seedBottles) {
    let bestIndex = -1;
    let bestScore = 0;

    for (let index = 0; index < bevcoBottles.length; index += 1) {
      if (claimedBevcoIndices.has(index)) continue;
      const score = scoreSeedMatch(bevcoBottles[index], seed);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    }

    if (bestIndex >= 0 && bestScore > 0) {
      seedToBevcoIndex.set(seed.id, bestIndex);
      claimedBevcoIndices.add(bestIndex);
    }
  }

  const bevcoIndexToSeedId = new Map<number, string>();
  for (const [seedId, index] of seedToBevcoIndex.entries()) {
    bevcoIndexToSeedId.set(index, seedId);
  }

  const seedById = new Map(seedBottles.map((seed) => [seed.id, seed]));
  const merged: Bottle[] = [];

  for (let index = 0; index < bevcoBottles.length; index += 1) {
    const seedId = bevcoIndexToSeedId.get(index);
    if (seedId) {
      merged.push(enrichBevcoWithSeed(bevcoBottles[index], seedById.get(seedId)!));
      continue;
    }
    merged.push(bevcoBottles[index]);
  }

  for (const seed of seedBottles) {
    if (!seedToBevcoIndex.has(seed.id)) {
      merged.push(seed);
    }
  }

  return merged;
}

const bottles = fillAllStandardVolumes(
  mergeCatalog(bevcoData as Bottle[], seedData as Bottle[]),
);

export async function getBottles(): Promise<Bottle[]> {
  return bottles.filter((bottle) => bottle.available);
}

export async function getBottleById(id: string): Promise<Bottle | undefined> {
  return bottles.find((bottle) => bottle.id === id && bottle.available);
}

export async function getAllBottles(): Promise<Bottle[]> {
  return bottles;
}
