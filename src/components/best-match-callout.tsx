"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  estimateMatchPercent,
  getMatchReasonKeys,
  type MatchReasonKey,
} from "@/lib/match-insights";
import type { Bottle, FilterState } from "@/lib/types";
import { formatPrice } from "@/lib/types";

type BestMatchCalloutProps = {
  bottle: Bottle & { matchScore: number };
  filters: FilterState;
  engagedSteps: number;
  personalized: boolean;
};

export function BestMatchCallout({
  bottle,
  filters,
  engagedSteps,
  personalized,
}: BestMatchCalloutProps) {
  const t = useTranslations("results");
  const reasons = getMatchReasonKeys(bottle, filters);
  const percent = estimateMatchPercent(reasons, engagedSteps);

  const reasonLabels: Record<MatchReasonKey, string> = {
    type: t("match_reason_type"),
    taste: t("match_reason_taste"),
    notes: t("match_reason_notes"),
    occasion: t("match_reason_occasion"),
    budget: t("match_reason_budget"),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="col-span-2 rounded-md border border-hairline bg-hairline-soft p-4"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{bottle.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {personalized ? t("best_match_personalized") : t("best_match")}
          </p>
          <p className="font-display mt-1 text-lg font-bold text-ink">{bottle.name}</p>
          <p className="text-sm text-body-text">{bottle.brand}</p>
          <p className="mt-2 font-display text-2xl font-bold text-ink">
            {t("match_percent", { percent })}
          </p>
          {reasons.length > 0 && (
            <ul className="mt-2 space-y-1">
              {reasons.map((key) => (
                <li key={key} className="text-xs text-body-text">
                  · {reasonLabels[key]}
                </li>
              ))}
            </ul>
          )}
          <Link href={`/bottle/${bottle.id}`} className="mt-3 inline-block">
            <Button size="sm" className="rounded-lg">
              {t("view_best_match")}
            </Button>
          </Link>
        </div>
        <span className="font-display shrink-0 text-base font-semibold text-ink">
          {formatPrice(bottle.price_750ml)}
        </span>
      </div>
    </motion.div>
  );
}
