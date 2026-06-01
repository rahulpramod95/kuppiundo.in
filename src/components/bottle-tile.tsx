"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/types";
import type { Bottle } from "@/lib/types";
import { cn } from "@/lib/utils";

type BottleTileProps = {
  bottle: Bottle;
  matchScore?: number;
  showBestMatch?: boolean;
  className?: string;
  index?: number;
};

export function BottleTile({
  bottle,
  matchScore,
  showBestMatch = false,
  className,
  index = 0,
}: BottleTileProps) {
  const t = useTranslations("results");
  const tc = useTranslations("categories");

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.35 }}
    >
      <Link
        href={`/bottle/${bottle.id}`}
        className={cn("interactive-focus group block h-full rounded-xl", className)}
      >
        <article className="soft-card flex h-[15.5rem] flex-col overflow-hidden border border-hairline bg-canvas transition-transform duration-200 active:scale-[0.98]">
          <div className="relative flex h-32 shrink-0 items-center justify-center bg-canvas px-2">
            <span className="text-5xl transition-transform group-hover:scale-110" aria-hidden>
              {bottle.emoji}
            </span>
            {showBestMatch && (
              <Badge className="absolute top-[12px] left-[12px] rounded-full text-[10px]">
                {t("best_match")}
              </Badge>
            )}
          </div>
          <div className="flex flex-1 flex-col bg-surface-soft p-[12px]">
            <p className="truncate text-[11px] font-medium text-body-text">{bottle.brand}</p>
            <h3 className="font-display mt-1 line-clamp-2 min-h-[2.5rem] text-sm font-bold leading-snug">
              {bottle.name}
            </h3>
            <div className="mt-auto flex items-end justify-between gap-2 pt-3">
              <Badge variant="secondary" className="shrink-0 rounded-full text-[10px]">
                {tc(bottle.type)}
              </Badge>
              <span className="font-display shrink-0 text-base font-semibold text-ink">
                {formatPrice(bottle.price_750ml)}
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
