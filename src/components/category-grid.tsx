"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import type { SpiritType } from "@/lib/types";
import { SPIRIT_TYPES } from "@/lib/types";

const CATEGORY_EMOJI: Record<SpiritType, string> = {
  whisky: "🥃",
  brandy: "🍷",
  rum: "🍹",
  beer: "🍺",
  gin: "🍸",
  vodka: "🧊",
  wine: "🍇",
};

const CATEGORY_TINT: Record<SpiritType, string> = {
  whisky: "from-[#faf6f0] to-surface-soft",
  brandy: "from-[#faf4f4] to-surface-soft",
  rum: "from-[#faf8f0] to-surface-soft",
  beer: "from-[#f8faf4] to-surface-soft",
  gin: "from-[#f4f8fa] to-surface-soft",
  vodka: "from-[#f4f6fa] to-surface-soft",
  wine: "from-[#faf4f8] to-surface-soft",
};

type CategoryGridProps = {
  cocktailCounts: Record<SpiritType, number>;
};

export function CategoryGrid({ cocktailCounts }: CategoryGridProps) {
  const t = useTranslations("app");
  const tc = useTranslations("cocktails");
  const router = useRouter();

  function goToSpiritResults(type: SpiritType) {
    router.push(`/results?type=${type}`);
  }

  function goToCocktails(type: SpiritType) {
    router.push(`/cocktails/${type}`);
  }

  return (
    <div className="space-y-10">
      <section>
        <h3 className="mb-5 font-display text-lg font-semibold text-ink">
          {t("brands_title")}
        </h3>
        <div className="hide-scrollbar -mx-1 flex gap-5 overflow-x-auto px-1 pb-2 pt-1">
          {SPIRIT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => goToSpiritResults(type)}
              className="flex shrink-0 flex-col items-center gap-3"
            >
              <div className="flex size-[4.5rem] items-center justify-center rounded-full bg-surface-soft text-2xl ring-1 ring-hairline transition-transform active:scale-95">
                {CATEGORY_EMOJI[type]}
              </div>
              <span className="text-xs font-medium text-body-text">{tc(`spirit_${type}`)}</span>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-5 font-display text-lg font-semibold leading-snug text-ink">
          {t("cocktails_title")}
        </h3>
        <div className="hide-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 py-3">
          {SPIRIT_TYPES.map((type, index) => {
            const count = cocktailCounts[type];
            return (
              <motion.button
                key={type}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => goToCocktails(type)}
                className={cn(
                  "relative flex h-48 w-[9.5rem] shrink-0 flex-col items-center justify-center gap-3 rounded-md border border-hairline bg-gradient-to-b p-5 text-center shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0] transition-all active:scale-[0.98]",
                  CATEGORY_TINT[type],
                )}
              >
                <span className="text-4xl">{CATEGORY_EMOJI[type]}</span>
                <span className="font-display text-sm font-semibold leading-snug text-ink">
                  {tc(`label_${type}`)}
                </span>
                <span className="text-xs text-text-muted">
                  {count === 1
                    ? tc("cocktail_count_one", { count })
                    : tc("cocktail_count", { count })}
                </span>
              </motion.button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
