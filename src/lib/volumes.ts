import type { Bottle, Volume } from "./types";

const SPIRIT_VOLUMES = [180, 375, 750] as const;
const WINE_VOLUMES = [375, 750] as const;

function roundKeralaPrice(amount: number): number {
  return Math.max(50, Math.round(amount / 5) * 5);
}

/** Kerala FL-1 size ratios derived from common IMFL price lists. */
function deriveSpiritPrice(price750: number, ml: number): number {
  if (ml === 750) return price750;
  if (ml === 375) return roundKeralaPrice(price750 * 0.494);
  if (ml === 180) return roundKeralaPrice(price750 * 0.244);
  return roundKeralaPrice((price750 * ml) / 750);
}

function deriveWinePrice(price750: number, ml: number): number {
  if (ml === 750) return price750;
  if (ml === 375) return roundKeralaPrice(price750 * 0.52);
  return roundKeralaPrice((price750 * ml) / 750);
}

function buildVolumes(
  bottle: Bottle,
  targetSizes: readonly number[],
  derive: (price750: number, ml: number) => number,
): Volume[] {
  const existing = new Map(bottle.volumes.map((volume) => [volume.ml, volume.price]));
  const price750 =
    existing.get(750) ??
    bottle.price_750ml ??
    [...existing.entries()].sort((a, b) => b[0] - a[0])[0]?.[1] ??
    0;

  return targetSizes.map((ml) => ({
    ml,
    price: existing.get(ml) ?? derive(price750, ml),
  }));
}

export function fillStandardVolumes(bottle: Bottle): Bottle {
  if (bottle.tags.includes("bevco")) {
    const price750 =
      bottle.volumes.find((volume) => volume.ml === 750)?.price ?? bottle.price_750ml;
    return { ...bottle, price_750ml: price750 };
  }

  if (bottle.type === "beer") {
    return bottle;
  }

  const volumes =
    bottle.type === "wine"
      ? buildVolumes(bottle, WINE_VOLUMES, deriveWinePrice)
      : buildVolumes(bottle, SPIRIT_VOLUMES, deriveSpiritPrice);

  const price750 = volumes.find((volume) => volume.ml === 750)?.price ?? bottle.price_750ml;

  return {
    ...bottle,
    price_750ml: price750,
    volumes,
  };
}

export function fillAllStandardVolumes(bottles: Bottle[]): Bottle[] {
  return bottles.map(fillStandardVolumes);
}
