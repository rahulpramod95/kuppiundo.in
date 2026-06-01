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
      <div>
        <h2 className="font-display text-lg font-semibold tracking-tight text-ink">
          {t("brands_title")}
        </h2>
        <div className="hide-scrollbar -mx-1 mt-4 flex gap-5 overflow-x-auto px-1 pb-1">
          {SPIRIT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => goToSpiritResults(type)}
              className="flex shrink-0 flex-col items-center gap-2.5"
            >
              <div className="flex size-[4.25rem] items-center justify-center rounded-full bg-surface-soft text-2xl ring-1 ring-hairline transition-transform active:scale-95">
                {CATEGORY_EMOJI[type]}
              </div>
              <span className="text-xs font-medium text-body-text">{tc(`spirit_${type}`)}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-display text-lg font-semibold leading-snug tracking-tight text-ink">
          {t("cocktails_title")}
        </h2>
        <div className="hide-scrollbar -mx-5 mt-4 flex gap-4 overflow-x-auto px-5 pb-2">
          {SPIRIT_TYPES.map((type, index) => {
            const count = cocktailCounts[type];
            return (
              <motion.button
                key={type}
                type="button"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
                onClick={() => goToCocktails(type)}
                className={cn(
                  "relative flex h-44 w-[9.25rem] shrink-0 flex-col items-center justify-center gap-2.5 rounded-xl border border-hairline bg-gradient-to-b p-4 text-center shadow-[var(--shadow-card)] transition-all active:scale-[0.98]",
                  CATEGORY_TINT[type],
                )}
              >
                <span className="text-3xl">{CATEGORY_EMOJI[type]}</span>
                <span className="font-display text-sm font-semibold leading-snug text-ink">
                  {tc(`label_${type}`)}
                </span>
                <span className="text-[11px] text-text-muted">
                  {count === 1
                    ? tc("cocktail_count_one", { count })
                    : tc("cocktail_count", { count })}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
