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
      <Link href={`/bottle/${bottle.id}`} className={cn("group block h-full", className)}>
        <article className="flex h-[15.5rem] flex-col overflow-hidden rounded-md border border-hairline bg-hairline-soft shadow-[rgba(0,0,0,0.02)_0_0_0_1px,rgba(0,0,0,0.04)_0_2px_6px_0,rgba(0,0,0,0.1)_0_4px_8px_0] transition-transform duration-200 active:scale-[0.98]">
          <div className="relative flex h-32 shrink-0 items-center justify-center bg-surface-strong">
            <span className="text-5xl drop-shadow-sm transition-transform group-hover:scale-110">
              {bottle.emoji}
            </span>
            {showBestMatch && (
              <Badge className="absolute top-2.5 left-2.5 rounded-full text-[10px]">
                {t("best_match")}
              </Badge>
            )}
          </div>
          <div className="flex flex-1 flex-col p-3.5">
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
