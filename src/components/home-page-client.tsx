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
    <div className="mx-auto w-full max-w-7xl pb-6">
      {/* Mobile: stacked. Desktop: side-by-side */}
      <div className="lg:flex lg:items-start lg:gap-10 lg:px-8 lg:py-8">
        <section className="min-w-0 overflow-hidden px-5 pb-8 pt-6 lg:w-[26rem] lg:shrink-0 lg:px-0 lg:pt-0 lg:pb-0">
          <PromoBanner bottles={promoBottles} />
        </section>

        <section className="min-w-0 px-5 lg:flex-1 lg:px-0">
          <CategoryGrid cocktailCounts={cocktailCounts} />
        </section>
      </div>
    </div>
  );
}
