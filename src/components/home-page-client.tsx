"use client";

import { useMemo } from "react";
import { PromoBanner } from "@/components/promo-banner";
import { CategoryGrid } from "@/components/category-grid";
import type { Bottle, SpiritType } from "@/lib/types";

type HomePageClientProps = {
  bottles: Bottle[];
  cocktailCounts: Record<SpiritType, number>;
};

export function HomePageClient({ bottles, cocktailCounts }: HomePageClientProps) {
  const sorted = useMemo(
    () => [...bottles].sort((a, b) => b.score - a.score),
    [bottles],
  );

  const promoBottles = useMemo(() => {
    const featured = bottles.find((b) => b.id === "jack-daniels-single-malt");
    const rest = sorted.filter((b) => b.id !== "jack-daniels-single-malt").slice(0, 2);
    return featured ? [featured, ...rest] : sorted.slice(0, 3);
  }, [bottles, sorted]);

  return (
    <div className="pb-6">
      <section className="px-5 pb-8 pt-6">
        <PromoBanner bottles={promoBottles} />
      </section>

      <section className="px-5">
        <CategoryGrid cocktailCounts={cocktailCounts} />
      </section>
    </div>
  );
}
